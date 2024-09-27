import Table from "@/component/ui/Table";
import { config } from "@/utils/config";
import { getCookie } from "@/utils/utils";
import { revalidatePath } from "next/cache";
import SearchBar from "@/component/ui/SearchBar";
import SubordinatesReport from "@/component/ui/SubordinatesReport";
import { getSubordinatesReport } from "@/utils/action";
import ReportTabs from "../../../ReportTabs";
import DateFilter from "@/component/ui/DateFilter";

async function getPlayerTransactions(
  username: string,
  searchString: string,
  dateString: string
) {
  let transaction_subordinates: string = `/api/transactions/${username}/players?type=username`;
  if (searchString?.length > 0) {
    transaction_subordinates += `&search=${encodeURIComponent(
      String(searchString)
    )}`;
  }
  if (dateString?.length > 0) {
    transaction_subordinates += `&date=${encodeURIComponent(
      String(dateString)
    )}`;
  }
  const token = await getCookie();
  try {
    const response = await fetch(
      `${config.server}${transaction_subordinates}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }

    const data = await response.json();
    const transactions = data;
    return transactions;
  } catch (error) {
  } finally {
    revalidatePath("/");
  }
}

const page = async ({ params, searchParams }: any) => {
  const data = await getPlayerTransactions(
    params?.coin,
    searchParams?.search,
    searchParams?.date
  );
  const reportData = await getSubordinatesReport(params?.coin);
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
          <SubordinatesReport reportData={reportData} />
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
          <Table
            fieldsHeadings={fieldsHeadings}
            fieldData={fieldsData}
            data={data}
          />
        </div>
      </div>
    </>
  );
};

export default page;
