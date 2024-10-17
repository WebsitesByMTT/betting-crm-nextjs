'use client'
import { TabProps } from "@/utils/Types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Back from "../svg/Back";

const Tabs: React.FC<TabProps> = ({ tabs, initialTab }) => {
  const pathname = usePathname();
  const router = useRouter()

  if (pathname === '/subordinates/add') {
    return (
      <button onClick={()=>router.back()}>
        <Back/>
      </button>
    )
  }
  
  return (
    <div className={`md:translate-y-[2px] z-10 gap-2 md:gap-x-4 pb-2 md:pb-0   flex-wrap lg:flex-nowrap flex items-center`}>
      {tabs?.map((tab, ind) => (
        <div key={ind} className="relative ">
          {ind !== 0 && `/${initialTab}/${tab}`==pathname && (
            <span className="p-5 bg-[#0E0F0F] rounded-bl-[200rem] dark:bg-white dark:border-opacity-10 md:inline-block hidden border-t-[1px] border-[#313131] absolute -bottom-4 -rotate-[52deg] -left-[.6rem]"></span>
          )}
          <div>
            <Link
              href={`/${initialTab}/${tab}`}
              className={`${`/${initialTab}/${tab}`==pathname
                ? "bg-[#0E0F0F] dark:bg-white dark:text-black rounded-[1rem] md:rounded-none md:rounded-t-[2rem] text-white "
                : "bg-[#E3F5FF] rounded-[1rem] border-none text-black"
                }   capitalize cursor-pointer text-xs md:text-lg py-2 inline-block border-[1px] dark:border-opacity-10 md:border-b-0 md:border-l-[1px] border-[#313131]   md:border-t-[1px] px-4 md:px-8 border-r-[1px]`}>
              {tab}
            </Link>

            {`/${initialTab}/${tab}`==pathname && (
              <span className=" p-5 md:inline-block hidden bg-[#0E0F0F] dark:bg-white dark:border-opacity-10 border-t-[1px] border-[#313131] absolute -bottom-4 rotate-[52deg] rounded-br-[200rem]  -right-[.6rem]"></span>
            )}
          </div>
        </div>
      ))}
    </div>

  )

};

export default Tabs;
