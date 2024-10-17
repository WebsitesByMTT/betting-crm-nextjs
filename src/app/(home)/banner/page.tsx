"use client";

import Modal from "@/components/ui/Modal";
import { fetchSportsCategory, getBanners } from "@/utils/action";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [open, setOPen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [type, setType] = useState("");
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const pathname = usePathname();
  const handelOpen = (state: boolean, Type: string) => {
    setOPen(state);
    setType(Type);
    setToggle(!toggle);
  };

  const handelClose = () => {
    setOPen(false);
  };

  useEffect(() => {
    const fetchData = async (category: string) => {
      const categoriesData = await fetchSportsCategory();
      if (categoriesData?.statuscode === 401) {
        toast.error(categoriesData.error);
        router.push("/logout");
      }
      setCategories(categoriesData);
    };
    fetchData("All");
  }, []);
  return (
    <div className="relative">
      <div className="w-full pb-4 flex justify-end">
        <button
          onClick={() => handelOpen(true, "Banner")}
          className="text-white dark:text-black  dark:bg-[#dee1e3] bg-light_black px-6 rounded-lg py-1.5"
        >
          Add Banner +
        </button>
        <Modal isOpen={open} Type={type} onClose={handelClose} />
        {toggle && (
          <div
            onClick={() => setToggle(!toggle)}
            className="fixed top-0 left-0 w-full h-screen z-[99]"
          ></div>
        )}
      </div>
      <div className="w-full mx-auto !overflow-hidden">
        <div
          className={`w-full z-10 gap-2 md:gap-x-4 pb-2 md:pb-0 grid grid-cols-3 lg:grid-cols-5 items-center`}
        >
          {categories?.map((data, ind) => (
            <div key={ind}>
              <div>
                <Link
                  href={`/banner/${data}`}
                  className={`${
                    `/${data}` == pathname
                      ? "bg-[#0E0F0F] dark:bg-white dark:text-black rounded-[1rem] md:rounded-none md:rounded-t-[2rem] text-white "
                      : "bg-[#E3F5FF] rounded-[1rem] border-none text-black border-2"
                  }   capitalize overflow-x-clip whitespace-nowrap w-full cursor-pointer text-xs md:text-lg py-2 inline-block border-[1px] dark:border-opacity-10 md:border-b-0 md:border-l-[1px] border-[#313131] md:border-t-[1px] px-4 md:px-8 border-r-[1px]`}
                >
                  <span className="h-full">{data}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
