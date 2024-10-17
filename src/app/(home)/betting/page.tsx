"use client";
import DataLoader from "@/components/ui/DataLoader";
import Table from "@/components/ui/Table";
import { getAllBets } from "@/utils/action";
import { getCurrentUser } from "@/utils/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Page = () => {
  const searchParams: any = useSearchParams();
  const [pageCount, setPageCount] = useState<number>(1)
  const lastElementRef = useRef(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState<any[]>([]);
  const [empty,setEmpty]=useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const user = await getCurrentUser();
        const result = await getAllBets(user, searchParams.get('date'), pageCount, 10)
        setEmpty(result?.data)
        if (searchParams.get('search')?.length > 0 || searchParams.get('date')) {
          setData([]);
          setPageCount(1)
          setSearch([...result?.data]);
        } else {
          const newData = result?.data?.filter(
            (item: any) => !data.some((stateItem: any) => stateItem?._id === item?._id)
          );
          setData([...data, ...newData]);
          setSearch([])
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, [searchParams.get('search'), searchParams.get('date'), pageCount]);

  const fieldsHeadings = [
    "Username",
    "Status",
    "Odds",
    "Amount",
    "Match Info",
    "Pick",
  ];

  const fieldsData = [
    "player",
    "status",
    "odds",
    "amount",
    "match_info",
    "pick",
  ];

  // Use IntersectionObserver to detect when the last element is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (searchParams.get('search')?.length > 0 || searchParams.get('date')) {
          setPageCount(1)
        }
        if (entries[0]?.isIntersecting && data?.length >= 10) {
          setPageCount((prevPageCount) => prevPageCount + 1);
        }
      },
      {
        threshold: 1, // Trigger when the last element is fully in view
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
  }, [data, search]);


  return (
    <>
      <Table Page="betting" fieldsHeadings={fieldsHeadings} fieldData={fieldsData} data={((searchParams.get('date')) || (searchParams.get('search')?.length > 0)) ? search : data} />
      {empty?.length>=10&&<div ref={lastElementRef} style={{ height: '4px', width: '100%' }} />}
      {loading&&<DataLoader />}
    </>
  );
};

export default Page;
