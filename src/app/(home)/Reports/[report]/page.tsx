import SearchBar from "@/component/ui/SearchBar";
import Table from "@/component/ui/Table";
import { getCookie } from "@/utils/utils";
import { revalidatePath } from "next/cache";
import ReportTabs from "../ReportTabs";
import { config } from "@/utils/config";
import SubordinatesReport from "@/component/ui/SubordinatesReport";
import { getSubordinatesReport } from "@/utils/action";
import DateFilter from "@/component/ui/DateFilter";
import LastItemDetector from "@/component/ui/LastItemDetector";

async function getAllSubordinates(
  username: string,
  searchString: string,
  dateString: string,
  page: number,
  limit: number
) {
  const token = await getCookie();

  let subordinatesurl: string = `${config.server}/api/subordinates/${username}/subordinates?type=username&page=${page||1}&limit=${limit||10}`;
  if (searchString?.length > 0) {
    subordinatesurl += `&search=${encodeURIComponent(String(searchString))}`;
  }
  if (dateString?.length > 0) {
    subordinatesurl += `&date=${encodeURIComponent(String(dateString))}`;
  }
  try {
    const response = await fetch(subordinatesurl, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    const all = data;
    return all;
  } catch (error) {
  } finally {
    revalidatePath("/");
  }
}

const page = async ({ params, searchParams }: any) => {
  const data = await getAllSubordinates(
    params?.report,
    searchParams?.search,
    searchParams?.date,
    searchParams?.page,
    searchParams?.limit,
  );
  const reportData = await getSubordinatesReport(params?.report);
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

  const tabs = [
    { name: "Subordinates", route: `/Reports/${params?.report}` },
    { name: "Coins", route: `/Reports/coins/${params?.report}` },
  ];
  return (
    <>
      <div className="flex-1 h-screen overflow-y-scroll ">
        <div className="px-4 md:px-10 py-5">
          <SubordinatesReport reportData={reportData} />
          <div className="md:flex items-center justify-between">
            <ReportTabs params={params?.report} tabs={tabs} />
            <div className="flex w-full  md:w-[40%] pb-2 gap-3">
              <div>
                <DateFilter />
              </div>
              <div className="md:w-[80%] w-[100%]">
                <SearchBar />
              </div>
            </div>
          </div>
          <>
            <Table fieldsHeadings={fieldsHeadings} searchDate={searchParams?.date} searchquery={searchParams?.search} fieldData={fieldsData} data={data?.data} />
            <LastItemDetector searchDate={searchParams?.date} searchquery={searchParams?.search} data={data.data} />
          </>
        </div>
      </div>
    </>
  );
};

export default page;
