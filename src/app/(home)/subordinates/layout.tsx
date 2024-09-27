import type { Metadata } from "next";
import Header from "@/component/common/Header";
import Tabs from "@/component/ui/Tabs";
import { getCurrentUser, rolesHierarchy } from "@/utils/utils";
import Link from "next/link";
import SearchBar from "@/component/ui/SearchBar";
import DateFilter from "@/component/ui/DateFilter";

export const metadata: Metadata = {
  title: "CRM - Betting Paradise",
  description: "Betting Paradise CRM.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user: any = await getCurrentUser();
  const userRole: string = user?.role;
  let tabs = await rolesHierarchy(userRole);
  return (
    <>
      <div className="flex-1">
        <Header />
        <div className="px-2 md:px-10 pt-5">
          <div className="md:flex pb-4 items-center space-y-2 md:space-y-0 md:space-x-2 justify-between">
            <div className="w-full md:w-[70%] xl:w-[50%]">
              <SearchBar />
            </div>
            <div className="flex gap-4">
              <div>
                <DateFilter />
              </div>
              <Link href={"/subordinates/add"}>
                <button className="text-white dark:bg-gray-600 bg-light_black px-6 rounded-lg py-1.5">
                  Add+
                </button>
              </Link>
            </div>
          </div>
          <Tabs tabs={tabs} initialTab="subordinates" />
          {children}
        </div>
      </div>
    </>
  );
}
