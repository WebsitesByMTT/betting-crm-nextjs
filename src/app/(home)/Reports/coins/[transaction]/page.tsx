
"use client"
import Table from "@/components/ui/Table";
import ReportTabs from "../../ReportTabs";
import SearchBar from "@/components/ui/SearchBar";
import SubordinatesReport from "@/components/ui/SubordinatesReport";
import { getAllTransactionsSubor, getSubordinatesReport } from "@/utils/action";
import DateFilter from "@/components/ui/DateFilter";
import { useEffect, useRef, useState } from "react";
import DataLoader from "@/components/ui/DataLoader";

const Page = ({ params, searchParams }: any) => {
  const [pageCount, setPageCount] = useState<number>(1);
  const lastElementRef = useRef(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState([]);
  const [search, setSearch] = useState<any[]>([]);
  const [empty, setEmpty] = useState([]);

  const handelReport = async () => {
    const fetchedReportData = await getSubordinatesReport(params?.transaction);
    setReport(fetchedReportData);
  };
  useEffect(() => {
    handelReport();
  }, [params?.transaction]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const result = await getAllTransactionsSubor(
          params?.transaction,
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
  }, [params?.transaction, searchParams?.search, searchParams?.date, pageCount]);


  const fieldsHeadings = ["Amount", "Type", "Sender", "Receiver", "Date"];
  const fieldsData = ["amount", "type", "sender", "receiver", "date"];
  const tabs = [
    { name: "Subordinates", route: `/Reports/${params?.transaction}` },
    { name: "Coins", route: `/Reports/coins/${params?.transaction}` },
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
      <div className="flex-1 h-screen overflow-y-scroll ">
        <div className="md:px-5 py-5">
          <SubordinatesReport reportData={report} />
          <div className="md:flex items-center justify-between">
            <ReportTabs params={params?.report} tabs={tabs} />
            <div className="flex w-[40%] pb-2 gap-3">
              <div>
                <DateFilter />
              </div>
              <div className="md:w-[80%] w-[80%]">
                <SearchBar />
              </div>
            </div>
          </div>
          <>
            <Table
              fieldsHeadings={fieldsHeadings}
              searchDate={searchParams?.date}
              searchquery={searchParams?.search}
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
