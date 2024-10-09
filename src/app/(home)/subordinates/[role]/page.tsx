import LastItemDetector from "@/component/ui/LastItemDetector";
import Table from "@/component/ui/Table";
import { getSubordinates } from "@/utils/action";

const Page = async ({ params, searchParams }: any) => {
  const data = await getSubordinates(
    params?.role,
    searchParams?.search,
    searchParams?.date,
    searchParams?.page,
    searchParams?.limit,
  );

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

  return (
    <>
      <Table fieldsHeadings={fieldsHeadings} searchDate={searchParams?.date} searchquery={searchParams?.search} fieldData={fieldsData} data={data?.data} />
      <LastItemDetector searchDate={searchParams?.date} searchquery={searchParams?.search} data={data.data} />
    </>
  );
};

export default Page;