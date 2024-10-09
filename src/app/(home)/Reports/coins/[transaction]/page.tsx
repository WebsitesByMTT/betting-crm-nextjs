import Table from "@/component/ui/Table";
import { config } from "@/utils/config";
import { getCookie } from "@/utils/utils";
import { revalidatePath } from "next/cache";
import ReportTabs from "../../ReportTabs";
import SearchBar from "@/component/ui/SearchBar";
import SubordinatesReport from "@/component/ui/SubordinatesReport";
import { getSubordinatesReport } from "@/utils/action";
import DateFilter from "@/component/ui/DateFilter";
import LastItemDetector from "@/component/ui/LastItemDetector";

async function getAllTransactions(
  username: string,
  searchString: string,
  dateString: string,
  page: number,
  limit: number
) {
  let transaction_subordinates: string = `/api/transactions/${username}/subordinate?type=username&page=${page||10}&limit=${limit||10}`;
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
  const data = await getAllTransactions(
    params?.transaction,
    searchParams?.search,
    searchParams?.date,
    searchParams?.page,
    searchParams?.limit,
  );

  const reportData = await getSubordinatesReport(params?.transaction);

  const fieldsHeadings = ["Amount", "Type", "Sender", "Receiver", "Date"];

  const fieldsData = ["amount", "type", "sender", "receiver", "date"];

  const tabs = [
    { name: "Subordinates", route: `/Reports/${params?.transaction}` },
    { name: "Coins", route: `/Reports/coins/${params?.transaction}` },
  ];
  return (
    <>
      <div
        className="flex-1 h-screen overflow-y-scroll "
      >
        <div className="md:px-5 py-5">
          <SubordinatesReport reportData={reportData} />
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
            <Table fieldsHeadings={fieldsHeadings} searchDate={searchParams?.date} searchquery={searchParams?.search} fieldData={fieldsData} data={data?.data} />
            <LastItemDetector searchDate={searchParams?.date} searchquery={searchParams?.search} data={data?.data} />
          </>
        </div>
      </div>
    </>
  );
};

export default page;
