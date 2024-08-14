'use client'
import { TabProps } from "@/utils/Types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Tabs: React.FC<TabProps> = ({ tabs}) => {
  const pathname = usePathname();
  const initialTab:any = pathname.split('/').pop(); 

  const [activeTab, setActiveTab] = useState<any>(
    tabs.includes(initialTab) ? initialTab : tabs[0]
  );
  
    return (
      <div className="md:translate-y-[4px] space-x-2 pb-2 md:pb-0 md:space-x-4 flex  items-center ">
        {tabs?.map((tab, ind) => (
          <div key={ind} className="relative">
            {ind !== 0 && tab == activeTab  && (
              <span className="p-5 bg-[#0E0F0F] md:inline-block hidden border-t-[1px] border-[#313131] absolute -bottom-4 -rotate-[52deg] -left-[.6rem]"></span>
            )}
            <Link href={`/subordinates/${tab}`}
            onClick={()=>setActiveTab(tab)}
            className={`${
                  tab === activeTab
                    ? "bg-[#0E0F0F] rounded-[1rem] md:rounded-none md:rounded-t-[2rem] text-white "
                    : "bg-[#E3F5FF] rounded-[1rem]  text-black"
                }   uppercase text-xs md:text-lg py-2 inline-block border-[1px] md:border-b-0 md:border-l-[1px] border-[#313131]   md:border-t-[1px] px-4 md:px-8 border-r-[1px]`}>
                {tab}
            </Link>
  
            {tab == activeTab && (
              <span className=" p-5 md:inline-block hidden bg-[#0E0F0F] border-t-[1px] border-[#313131] absolute -bottom-4 rotate-[52deg] -right-[.6rem]"></span>
            )}
          </div>
        ))}
      </div>
    );

};

export default Tabs;
  