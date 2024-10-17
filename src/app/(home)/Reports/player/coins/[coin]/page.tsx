"use client";
import Table from "@/components/ui/Table";
import SearchBar from "@/components/ui/SearchBar";
import SubordinatesReport from "@/components/ui/SubordinatesReport";
import { getPlayerTransactions, getSubordinatesReport } from "@/utils/action";
import ReportTabs from "../../../ReportTabs";
import DateFilter from "@/components/ui/DateFilter";
import { useEffect, useRef, useState } from "react";
import DataLoader from "@/components/ui/DataLoader";

const Page = ({ params, searchParams }: any) => {
  const [data, setData] = useState<any[]>([]);
  const lastElementRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState<number>(1);
  const [report, setReport] = useState([]);
  const [search, setSearch] = useState<any[]>([]);
  const [empty, setEmpty] = useState([]);
  const handelReport = async () => {
    const fetchedReportData = await getSubordinatesReport(params?.coin);
    setReport(fetchedReportData);
  };
  useEffect(() => {
    handelReport();
  }, [params?.coin]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const result = await getPlayerTransactions(
          params?.coin,
          searchParams?.search,
          searchParams?.date,
          searchParams?.search?.length > 0 || searchParams?.date
            ? 1
            : pageCount,
          10
        );
        setEmpty(result?.data);
        if (searchParams?.search?.length > 0 || searchParams?.date) {
          setSearch([...result?.data]);
        } else {
          const newData = result?.data?.filter(
            (item: any) =>
              !data.some((stateItem) => stateItem?._id === item?._id)
          );
          setData([...data, ...newData]);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, [params?.coin, searchParams?.search, searchParams?.date, pageCount]);

  // Use IntersectionObserver to detect when the last element is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (searchParams?.search?.length > 0 || searchParams?.date) {
          setPageCount(1);
        }
        if (entries[0]?.isIntersecting && data?.length >= 10) {
          setPageCount((prevPageCount) => prevPageCount + 1);
        }
      },
      {
        threshold: 1,
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

  const fieldsHeadings = ["Amount", "Type", "Sender", "Receiver", "Date"];
  const fieldsData = ["amount", "type", "sender", "receiver", "date"];
  const tabs = [
    { name: "Coins", route: `/Reports/player/coins/${params?.coin}` },
    { name: "Betting", route: `/Reports/player/betting/${params?.coin}` },
    { name: "Activity", route: `/Reports/player/activity/${params?.coin}` },
  ];
  return (
    <>
      <div className="flex-1 h-screen overflow-y-scroll ">
        <div className="px-4 md:px-10 py-5">
          <SubordinatesReport reportData={report} />
          <div className="md:flex items-center justify-between">
            <ReportTabs params={params?.report} tabs={tabs} />
            <div className="space-y-2 md:space-y-0 md:flex w-full md:w-[40%] pb-2 gap-3">
              <div>
                <DateFilter />
              </div>
              <div className="md:w-[80%] w-[100%]">
                <SearchBar />
              </div>
            </div>
          </div>
          <>
            <Table
              fieldsHeadings={fieldsHeadings}
              fieldData={fieldsData}
              data={
                searchParams?.date || searchParams?.search?.length > 0
                  ? search
                  : data
              }
            />
            {empty?.length >= 10 && (
              <div
                ref={lastElementRef}
                style={{ height: "4px", width: "100%" }}
              />
            )}
            {loading && <DataLoader />}
          </>
        </div>
      </div>
    </>
  );
};

export default Page;
