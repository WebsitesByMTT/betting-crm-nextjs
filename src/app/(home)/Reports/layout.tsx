import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Back from "@/components/svg/Back";

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
      <div className="flex-1 h-screen overflow-y-scroll ">
        <Header Back={<Back />} />
        <div className="md:px-10 py-5">{children}</div>
      </div>
    </>
  );
}
