"use client"
import { useEffect, useRef, useState } from "react";
import Table from "@/component/ui/Table";
import { getSubordinates } from "@/utils/action";
import DataLoader from "@/component/ui/DataLoader";
import { useAppSelector } from "@/utils/hooks";

const Page = ({ params, searchParams }: any) => {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageCount, setPageCount] = useState<number>(1)
  const lastElementRef = useRef(null);
  const [empty, setEmpty] = useState([])
  const updatedData: any = useAppSelector((state) => state.globlestate.upDateTable)
  useEffect(() => {
    if (updatedData) {
      const isDeleted = updatedData.deleted;

      if (isDeleted) {
        const newSearchData = (searchParams?.date || searchParams?.search?.length > 0)
          ? search.filter(item => item?._id !== updatedData._id)
          : search;

        const newData = data.filter(item => item?._id !== updatedData._id);

        (searchParams?.date || searchParams?.search?.length > 0)
          ? setSearch(newSearchData)
          : setData(newData);

      } else {
        const newSearchData = (searchParams?.date || searchParams?.search?.length > 0)
          ? search.map(item => item?._id === updatedData?._id ? { ...item, ...updatedData } : item)
          : search;

        const newData = data.map(item => item?._id === updatedData?._id ? { ...item, ...updatedData } : item);

        (searchParams?.date || searchParams?.search?.length > 0)
          ? setSearch(newSearchData)
          : setData(newData);
      }
    }
  }, [updatedData]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const result = await getSubordinates(
          params?.role,
          searchParams?.search,
          searchParams?.date,
          (searchParams?.date || searchParams?.search?.length > 0) ? 1 : pageCount,
          10,
        );
        setEmpty(result?.data)
        if (searchParams?.search?.length > 0 || searchParams?.date) {
          setSearch([...result?.data]);
        } else {
          const newData = result?.data?.filter(
            (item: any) => !data.some((stateItem: any) => stateItem?._id === item?._id)
          );
          setData([...data, ...newData]);
          setSearch([])
        }
      } catch (error) {
        console.error("Error fetching subordinates:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, [params?.role, searchParams?.search, searchParams?.date, pageCount]);

  const fieldsHeadings = [
    "Username",
    "Status",
    "Credits",
    "Role",
    "Created At",
    "Actions",
  ];

  const fieldsData = [
    "username",
    "status",
    "credits",
    "role",
    "createdAt",
    "actions",
  ];


  // Use IntersectionObserver to detect when the last element is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (searchParams?.search?.length > 0 || searchParams?.date) {
          setPageCount(1)
        }
        if (entries[0]?.isIntersecting && data?.length >= 10) {
          setPageCount((prevPageCount) => prevPageCount + 1);
        }
      },
      {
        threshold: 1
      }
    );

    if (lastElementRef.current) {
      observer.observe(lastElementRef.current);
    }

    return () => {
      if (lastElementRef.current) {
        observer.unobserve(lastElementRef.current);
      }
    };
  }, [data]);


  return (
    <>
      <Table
        fieldsHeadings={fieldsHeadings}
        fieldData={fieldsData}
        data={((searchParams?.date) || (searchParams?.search?.length > 0)) ? search : data}
      />
      {empty?.length >= 10 && <div ref={lastElementRef} style={{ height: '4px', width: '100%' }} />}
      {loading && <DataLoader />}
    </>
  );
};

export default Page;
