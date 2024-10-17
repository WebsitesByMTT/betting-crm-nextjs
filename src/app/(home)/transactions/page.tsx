"use client";
import { ChartConfig } from "@/components/ui/chart";
import DataLoader from "@/components/ui/DataLoader";
import Table from "@/components/ui/Table";
import LineChartData from "@/components/ui/LineChartData";
import { getAllTransactions, getTransactionInsights } from "@/utils/action";
import { getCurrentUser } from "@/utils/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const searchParams: any = useSearchParams();
  const [pageCount, setPageCount] = useState<number>(1);
  const lastElementRef = useRef(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<any[]>([]);
  const [empty, setEmpty] = useState([]);

  //chart Info
  const [transactionData, setTransactionData] = useState<any>();
  const datakey = ["recharge", "redeem"];
  const chartConfig = {
    recharge: {
      label: "Recharge",
      color: "#00FF1E",
    },
    redeem: {
      label: "Redeem",
      color: "#ff0000",
    },
  } satisfies ChartConfig;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const user = await getCurrentUser();
        const result = await getAllTransactions(
          user,
          searchParams.get("search"),
          searchParams.get("date"),
          searchParams.get("search")?.length > 0 || searchParams.get("date")
            ? 1
            : pageCount,
          10
        );
        const transaction = await getTransactionInsights(user);
        if (transaction?.error) {
          return toast.error(transaction?.error);
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
            transaction?.find((item: any) => item._id === index + 1) || {};
          return {
            month,
            recharge: monthData.totalRechargeAmount || 0,
            redeem: monthData.totalRedeemAmount || 0,
          };
        });
        setTransactionData(chartData);

        setEmpty(result?.data);
        if (
          searchParams.get("search")?.length > 0 ||
          searchParams.get("date")
        ) {
          setSearch([...result?.data]);
        } else {
          const newData = result?.data?.filter(
            (item: any) =>
              !data.some((stateItem: any) => stateItem?._id === item?._id)
          );
          setData([...data, ...newData]);
          setSearch([]);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false); // End loading
      }
    };
    fetchData();
  }, [searchParams.get("search"), searchParams.get("date"), pageCount]);

  const fieldsHeadings = ["Amount", "Type", "Sender", "Receiver", "Date"];
  const fieldsData = ["amount", "type", "sender", "receiver", "date"];

  // Use IntersectionObserver to detect when the last element is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          searchParams.get("search")?.length > 0 ||
          searchParams.get("date")
        ) {
          setPageCount(1);
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
  }, [data]);

  return (
    <>
      <LineChartData
        type="transaction"
        chartData={transactionData}
        chartConfig={chartConfig}
        dataKey={datakey}
      />
      <Table
        Page="transactions"
        width={"w-[20px]"}
        fieldsHeadings={fieldsHeadings}
        fieldData={fieldsData}
        data={
          searchParams.get("date") || searchParams.get("search")?.length > 0
            ? search
            : data
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
