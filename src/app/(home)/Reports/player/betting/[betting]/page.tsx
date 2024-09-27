import { config } from "@/utils/config";
import { getCookie } from "@/utils/utils";
import { revalidatePath } from "next/cache";
import { getSubordinatesReport } from "@/utils/action";
import DateFilter from "@/component/ui/DateFilter";
import SearchBar from "@/component/ui/SearchBar";
import Sport from "@/component/svg/Sport";
import Bet from "@/component/svg/Bet";
import Market from "@/component/svg/Market";
import Odds from "@/component/svg/odds";
import Amount from "@/component/svg/Amount";
import Status from "@/component/svg/Status";
import Action from "@/component/svg/Action";
import SubordinatesReport from "@/component/ui/SubordinatesReport";
import ReportTabs from "../../../ReportTabs";
import PlayerBets from "@/component/ui/Playerbets";
import { redirect } from "next/navigation";

// Fetch player bets
async function getPlayerBettings(
  username: string,
  searchString: string,
  dateString: string
) {
  const token = await getCookie();
  let url:string = `api/bets/${username}/bets?type=username&status=all`;

  if (searchString?.length > 0) {
    url += `?search=${encodeURIComponent(String(searchString))}`;
  }
  if (dateString?.length > 0) {
    url += `&date=${encodeURIComponent(String(dateString))}`;
  }

  try {
    const response:any = await fetch(`${config.server}/${url}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      
      return { error: error.message,statuscode: response.status};
    } 

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: "Failed to fetch data" };
  } finally {
    revalidatePath("/"); // Only call this if necessary
  }
}

const Page = async ({ params, searchParams }: any) => {
  const data = await getPlayerBettings(params?.betting, searchParams?.search, searchParams?.date);
  const reportData = await getSubordinatesReport(params?.betting);
  if (data?.statuscode === 401) {
    
    redirect('/logout')
  }
  // Memoize headers and tabs
  const headers = [
    { icon: <Sport />, text: "sport" },
    { icon: <Bet />, text: "Stake" },
    { icon: <Market />, text: "Category" },
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

  return (
    <div className="flex-1 h-screen overflow-y-scroll">
      <div className="px-4 md:px-10 py-5">
        {reportData && <SubordinatesReport reportData={reportData} />}
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
            <PlayerBets headers={headers} data={data} />
        </div>
      </div>
    </div>
  );
};

export default Page;
