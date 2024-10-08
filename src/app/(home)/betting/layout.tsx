import type { Metadata } from "next";
import Header from "@/component/common/Header";
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
  return (
    <>
      <div className="flex-1">
        <Header />

        <div className="px-4 md:px-10 pt-5">
          <div className="w-full py-3 flex justify-end">
            <div>
              <DateFilter />
            </div>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
