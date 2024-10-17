import Sidebar from "@/components/common/Sidebar";
import type { Metadata } from "next";
import Notifications from "@/components/ui/Notifications";

export const metadata: Metadata = {
  title: "CRM - Betting Paradise",
  description: "Betting Paradise Crm.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="md:flex  dark:bg-white bg-bg_dashboard">
        <Sidebar />
        <div className="h-screen flex overflow-y-scroll w-full">
          <div className="h-screen transition-all flex overflow-y-scroll w-full">
            {children}
          </div>
          <Notifications />
        </div>
      </div>
    </>
  );
}
