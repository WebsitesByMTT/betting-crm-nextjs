"use client";
import React, { useState } from "react";
import Search from "../svg/Search";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const DateFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const param = searchParams.get("search");
    if (param) {
      router.replace(`${pathname}?search=${param}&date=${e.target.value}`);
    } else {
      router.replace(`${pathname}/?date=${e.target.value}`);
    }
  };

  if (pathname === "/subordinates/add") {
    return;
  }
  return (
    <div className="dark:bg-light_black bg-onDark rounded-3xl flex w-full items-center space-x-1 py-[1px]">
      <input
        value={search}
        onChange={(e) => handleClick(e)}
        type="date"
        className="bg-transparent w-full px-3 py-[5px] outline-none text-black dark:text-white app"
      />
    </div>
  );
};

export default DateFilter;
