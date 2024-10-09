import LastItemDetector from "@/component/ui/LastItemDetector";
import Table from "@/component/ui/Table";
import { getAllBets } from "@/utils/action";
import { getCurrentUser } from "@/utils/utils";

const page = async ({ searchParams }: any) => {
  const user: any = await getCurrentUser();
   const data = await getAllBets(user,searchParams.date,searchParams.page,searchParams.limit);
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
  
  return (
    <>
    <Table Page="betting"  fieldsHeadings={fieldsHeadings} searchDate={searchParams?.date} searchquery={searchParams?.search} fieldData={fieldsData} data={data?.data} />
    <LastItemDetector searchDate={searchParams?.date} searchquery={searchParams?.search} data={data?.data} />
  </>
  );
};

export default page;
