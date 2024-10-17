
"use client";
import { useEffect, useRef, useState } from "react";
import Table from "@/components/ui/Table";
import { getSubordinateInsights, getSubordinates } from "@/utils/action";
import DataLoader from "@/components/ui/DataLoader";
import toast from "react-hot-toast";
import { ChartConfig } from "@/components/ui/chart";
import LineChartData from "@/components/ui/LineChartData";


const Page = ({ params, searchParams }: any) => {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageCount, setPageCount] = useState<number>(1);
  const lastElementRef = useRef(null);
  const [empty, setEmpty] = useState([]);
  const [subordinateData, setSubordinateData] = useState<any>();
  const datakey = ["users", "players"];
  const chartConfig = {
    users: {
      label: "Users",
      color: "#0000FF",
    },
    players: {
      label: "Players",
      color: "#ff0000",
    },
  } satisfies ChartConfig;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const result = await getSubordinates(
          params?.role,
          searchParams?.search,
          searchParams?.date,
          (searchParams?.date || searchParams?.search?.length > 0)?1:pageCount,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSubordinateInsights();
        console.log(data);
        if (data?.error) {
          return toast.error(data?.error);
        }

        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const chartData = monthNames.map((month, index) => {
          const monthData =
            data.find((item: any) => item.month === index + 1) || {};
          return {
            month,
            users: monthData.users || 0,
            players: monthData.players || 0,
          };
        });

        console.log(chartData);
        setSubordinateData(chartData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchData();
  }, []);

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
      <LineChartData
        type="subordinates"
        chartData={subordinateData}
        chartConfig={chartConfig}
        dataKey={datakey}
      />
      <Table
        fieldsHeadings={fieldsHeadings}
        fieldData={fieldsData}
        data={
          searchParams?.date || searchParams?.search?.length > 0 ? search : data
        }
      />
      {empty?.length >= 10 && (
        <div ref={lastElementRef} style={{ height: "4px", width: "100%" }} />
      )}
      {loading && <DataLoader />}
    </>
  );
};

export default Page;
