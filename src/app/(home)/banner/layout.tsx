import type { Metadata } from "next";
import Header from "@/components/common/Header";

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
        <div className="px-4 md:px-10 pt-5">{children}</div>
      </div>
    </>
  );
}
