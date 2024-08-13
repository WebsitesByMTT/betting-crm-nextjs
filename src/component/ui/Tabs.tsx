'use client'
import { TabProps } from "@/utils/Types";
import Link from "next/link";
import { useState } from "react";

const Tabs: React.FC<TabProps> = ({ tabs}) => {
  const [activeTab, setActiveTab] = useState("agent");
  return (
    <div className="translate-y-[4px] space-x-4 flex items-center">
      {tabs?.map((tab, ind) => (
        <div key={ind} className="relative">
ß          <Link
            href={`/subordinates/${tab}`}
            onClick={()=>setActiveTab(tab)}
            className={`${
              tab === activeTab
                ? "bg-[#0E0F0F] rounded-t-[2rem] text-white"
                : "bg-[#E3F5FF] rounded-[1rem] text-black"
            } uppercase text-lg py-2 inline-block border-l-[1px] border-[#313131] border-t-[1px] px-8 border-r-[1px]`}
          >
            {tab}
          </Link>

          {tab === activeTab && (
            <span className="inline-block p-5 bg-[#0E0F0F] border-t-[1px] border-[#313131] absolute -bottom-4 rotate-[52deg] -right-[.6rem]"></span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
  