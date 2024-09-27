import Table from "@/component/ui/Table";
import { getAllBets } from "@/utils/action";
import { getCurrentUser } from "@/utils/utils";

const page = async ({ searchParams }: any) => {
  const user: any = await getCurrentUser();
   const data = await getAllBets(user,searchParams.date);
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
    <Table
      Page="betting"
      fieldsHeadings={fieldsHeadings}
      fieldData={fieldsData}
      data={data}
    />
  );
};

export default page;
