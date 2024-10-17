"use client";
import React, { useState } from "react";
import Search from "../svg/Search";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();

  const handleClick = () => {
    const param = searchParams?.get("date");
    if (param) {
      router.push(`${pathname}?date=${param}&search=${search}`);
    } else {
      router.push(`${pathname}?search=${search}`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleClick();
    }
  };
  if (pathname === "/subordinates/add") {
    return;
  }
  return (
    <div className="bg-light_black dark:bg-onDark rounded-3xl flex w-full items-center space-x-1 p-[1px] pl-2">
      <Search />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyPress}
        type="search"
        className="bg-transparent w-full px-3 py-[.37rem] outline-none dark:text-black text-white"
        placeholder="search"
      />
      <button
        onClick={handleClick}
        className="text-white text-opacity-75 bg-black dark:bg-gray-600 dark:text-opacity-100 dark:text-white py-[.4rem] rounded-r-3xl  px-3"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
