import LastItemDetector from "@/component/ui/LastItemDetector";
import Table from "@/component/ui/Table";
import { getAllTransactions } from "@/utils/action";
import { getCurrentUser } from "@/utils/utils";

const page = async ({ searchParams }: any) => {
  const user = await getCurrentUser();
  const data = await getAllTransactions(
    user,
    searchParams?.search,
    searchParams?.date,
    searchParams?.page,
    searchParams?.limit
  );
  const fieldsHeadings = ["Amount", "Type", "Sender", "Receiver", "Date"];
  const fieldsData = ["amount", "type", "sender", "receiver", "date"];
  return (
    <>
      <Table Page="transactions" width={'w-[20px]'} fieldsHeadings={fieldsHeadings} searchDate={searchParams?.date} searchquery={searchParams?.search} fieldData={fieldsData} data={data?.data} />
      <LastItemDetector searchDate={searchParams?.date} searchquery={searchParams?.search} data={data?.data} />
    </>
  );
};

export default page;
