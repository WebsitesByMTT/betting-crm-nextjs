import Table from "@/component/ui/Table";
import { getAllBets } from "@/utils/action";
import { getCurrentUser } from "@/utils/utils";

const page = async () => {
  const user = await getCurrentUser()
  const data = await getAllBets(user);
  const fieldsHeadings = [
    "Username",
    "Status",
    "Odds",
    "Amount",
    "Match Info",
    "Pick"
  ];  

  const fieldsData = [
    "player",
    "status",
    "odds",
    "amount",
    "match_info",
    "pick"
  ]
  return (<Table  fieldsHeadings={fieldsHeadings} fieldData = {fieldsData} data={data}  />);
};

export default page;
