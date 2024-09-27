"use client";
import React, { useEffect, useState } from "react";
import LightMode from "../svg/LightMode";
import Setting from "../svg/Setting";
import Notification from "../svg/Notification";
import Logout from "../svg/Logout";
import DarkMode from "../svg/DarkMode";
import { useTheme } from "next-themes";
import { useDispatch } from "react-redux";
import {
  UpdateCredit,
  UpdateHeader,
  UpdateNotification,
} from "@/redux/ReduxSlice";
import HamBurger from "../svg/HamBurger";
import { useRouter } from "next/navigation";
import Infinite from "../svg/Infinite";
import { getCredits } from "@/utils/action";
import toast from "react-hot-toast";
import { useAppSelector } from "@/utils/hooks";
import Cookies from "js-cookie";
const Header = ({ Back }: any) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { systemTheme, theme, setTheme } = useTheme();
  const [user, setUser] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0)
  const allNotifications = useAppSelector((state: any) => state?.globlestate?.AllNotification)?.filter((item: any) => item?.viewed === false)?.length
  useEffect(() => {
    setCount(allNotifications)
  }, [allNotifications])
  useEffect(() => {
    setMounted(true);
  }, []);
  const currentTheme = theme === "system" ? systemTheme : theme;
  const fetchUser = async () => {
    const currentUser = await getCredits();

    if (currentUser.statuscode === 401) {
      router.push("/logout");
    } else {
      setUser(currentUser);
      dispatch(UpdateCredit(false));
    }
  };
  const creditUpdate = useAppSelector(
    (state) => state?.globlestate?.updateCredit
  );
  useEffect(() => {
    fetchUser();
  }, [creditUpdate, mounted]);
  return (
    <div className="text-white pl-5 flex items-center sticky top-0 dark:bg-white dark:text-black dark:text-opacity-75 bg-bg_dashboard z-50 py-4 border-b-[.5px] border-[#313131] dark:border-opacity-10 justify-end">
      <button
        className="xl:hidden"
        onClick={() => dispatch(UpdateHeader(true))}
      >
        <HamBurger />
      </button>
      {Back && (
        <button
          onClick={() => router.back()}
          className="xl:block hidden"
        >
          {Back}
        </button>
      )}
      <div className="flex items-center space-x-4 w-[90%] mx-auto justify-end">
        {user ? (
          <div className="bg-[#E3F5FF] dark:bg-black dark:bg-opacity-40 p-[1px] rounded-xl">
            <div className="flex space-x-2 items-center dark:bg-onDark bg-dark_light_black rounded-xl px-2  md:px-4 py-1 md:py-1.5">
              <span className="text-white text-[.7rem] md:text-[.9] dark:text-black tracking-wider">
                Credits :
              </span>
              <span className="text-white text-opacity-40 text-[.9rem] dark:text-black">
                {user?.credits == null ? <Infinite /> : user?.credits}
              </span>
            </div>
          </div>
        ) : (
          <div className="invisible p-[1px] rounded-xl">
            <div className="flex space-x-2 items-center dark:bg-onDark bg-dark_light_black rounded-xl px-4 py-1.5">
              <span className="text-white text-[.7rem] md:text-[.9] dark:text-black tracking-wider">
                Credits :
              </span>
              <span className="text-white text-opacity-40 text-[.9rem] dark:text-black">
                {user?.credits == null ? <Infinite /> : user?.credits}
              </span>
            </div>
          </div>
        )}
        {!mounted ? null : currentTheme === "dark" ? (
          <button onClick={() => setTheme("light")}>
            <DarkMode />
          </button>
        ) : (
          <button onClick={() => setTheme("dark")}>
            <LightMode />
          </button>
        )}
        <button onClick={() => toast.error("Feature Under Development!")}>
          <Setting />
        </button>
        <button
          className="relative"
          onClick={() => dispatch(UpdateNotification(true))}
        >
          <Notification />
          {count >= 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full min-w-4 min-h-4 flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
        <Logout />
      </div>
    </div>
  );
};

export default Header;
