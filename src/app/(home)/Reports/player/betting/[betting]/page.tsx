"use client";
import { getPlayerBettings, getSubordinatesReport } from "@/utils/action";
import DateFilter from "@/components/ui/DateFilter";
import SearchBar from "@/components/ui/SearchBar";
import Sport from "@/components/svg/Sport";
import Bet from "@/components/svg/Bet";
import Market from "@/components/svg/Market";
import Odds from "@/components/svg/odds";
import Amount from "@/components/svg/Amount";
import Status from "@/components/svg/Status";
import Action from "@/components/svg/Action";
import SubordinatesReport from "@/components/ui/SubordinatesReport";
import ReportTabs from "../../../ReportTabs";
import PlayerBets from "@/components/ui/Playerbets";
import { redirect } from "next/navigation";
import Beton from "@/components/svg/Beton";
import { useEffect, useRef, useState } from "react";
import DataLoader from "@/components/ui/DataLoader";

// Fetch player bets

const Page = ({ params, searchParams }: any) => {
  const [pageCount, setPageCount] = useState<number>(1);
  const lastElementRef = useRef(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<any[]>([]);
  const [report, setReport] = useState([]);
  const [empty, setEmpty] = useState([]);

  const handelReport = async () => {
    const fetchedReportData = await getSubordinatesReport(params?.betting);
    setReport(fetchedReportData);
  };
  useEffect(() => {
    handelReport();
  }, [params?.betting]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading

        const result = await getPlayerBettings(
          params?.betting,
          searchParams?.search,
          searchParams?.date,
          pageCount,
          10
        );
        setEmpty(result?.data);
        if (result?.data?.statuscode === 401) {
          redirect("/logout");
        }
        if (searchParams?.search?.length > 0 || searchParams?.date) {
          setData([]);
          setPageCount(1);
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
  }, [params?.betting, searchParams?.search, searchParams?.date, pageCount]);

  // Memoize headers and tabs
  const headers = [
    { icon: <Sport />, text: "sport" },
    { icon: <Bet />, text: "Stake" },
    { icon: <Market />, text: "Category" },
    { icon: <Beton />, text: "Bet On" },
    { icon: <Odds />, text: "odds" },
    { icon: <Amount />, text: "Possible Winning" },
    { icon: <Status />, text: "status" },
    { icon: <Action />, text: "action" },
  ];

  const tabs = [
    { name: "Coins", route: `/Reports/player/coins/${params?.betting}` },
    { name: "Betting", route: `/Reports/player/betting/${params?.betting}` },
    { name: "Activity", route: `/Reports/player/activity/${params?.betting}` },
  ];

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
        ` `;
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
  }, [data, search]);

  return (
    <div className="flex-1 h-screen overflow-y-scroll">
      <div className="px-4 md:px-10 py-5">
        {report && <SubordinatesReport reportData={report} />}
        <div className="md:flex items-center justify-between">
          {tabs && <ReportTabs params={params?.report} tabs={tabs} />}
          <div className="space-y-2 md:space-y-0 md:flex w-full md:w-[40%] pb-2 gap-3">
            <DateFilter />
            <div className="md:w-[80%] w-[100%]">
              <SearchBar />
            </div>
          </div>
        </div>
        <div className="h-[calc(100%-13vh)] hideScrollBar border-[1px] border-white dark:border-black dark:border-opacity-10 bg-[#0E0F0F] dark:bg-white border-opacity-10 rounded-2xl overflow-y-scroll">
          <PlayerBets
            searchquery={searchParams?.search}
            searchDate={searchParams?.date}
            headers={headers}
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
        </div>
      </div>
    </div>
  );
};

export default Page;
