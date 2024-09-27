"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Close from "../svg/Close";
import { getCurrentUser } from "@/utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { UpdateHeader } from "@/redux/ReduxSlice";
import Profile from "../svg/Profile";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const Sidebar = ({ params }: any) => {
  const isOpen = useSelector(
    (state: { globlestate: { openHeader: Boolean } }) =>
      state?.globlestate.openHeader
  );
  const dispatch = useDispatch();
  const router = usePathname();
  const navigate = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [nav, setNav] = useState([
    {
      text: "Home",
      Link: "/",
    },
    {
      text: "Subordinates",
      Link: "/subordinates/all",
    },
    {
      text: "transactions",
      Link: "/transactions",
    },
    {
      text: "betting",
      Link: "/betting",
    },
  ]);
  const fetchUser = async () => {
    const currentUser: any = await getCurrentUser();
    if (currentUser?.role === "player") {
      navigate.push("/logout");
    }
    setUser(currentUser);
   
    switch (currentUser?.role) {
      case "distributor":
        setNav((prevNav) =>
          prevNav.map((navItem) =>
            navItem.text === "Subordinates"
              ? { ...navItem, Link: "/subordinates/subdistributor" }
              : navItem
          )
        );
        break;
      case "subdistributor":
        setNav((prevNav) =>
          prevNav.map((navItem) =>
            navItem.text === "Subordinates"
              ? { ...navItem, Link: "/subordinates/agent" }
              : navItem
          )
        );
        break;
      case "agent":
        setNav((prevNav) =>
          prevNav.map((navItem) =>
            navItem.text === "Subordinates"
              ? { ...navItem, Link: "/subordinates/player" }
              : navItem
          )
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <div
        className={`flex flex-col fixed ${
          !isOpen ? "-left-[200%]" : "left-0"
        } z-[55] transition-all xl:sticky xl:top-0 w-[55%] md:w-[40%] xl:w-[15%] h-screen dark:bg-white bg-dark_black items-center justify-between px-4 py-10 border-r-[.5px] dark:border-opacity-10 border-[#313131]`}
      >
        <button
          onClick={() => dispatch(UpdateHeader(false))}
          className="xl:hidden absolute top-2 left-2"
        >
          <Close />
        </button>
        <div>
          <div className="flex items-center justify-center">
            <Image
              src="/assets/images/Dark_Logo.svg"
              alt="logo"
              width={200}
              height={100}
              className="mx-auto w-[120px] md:w-[160px] dark:hidden block"
              quality={100}
            />
            <Image
              src="/assets/images/Light_Logo.svg"
              alt="logo"
              width={200}
              height={100}
              className="mx-auto w-[120px] md:w-[160px] dark:block hidden"
              quality={100}
            />
          </div>
          {/* DropDown */}
          <div>
            <ul className="pt-12 space-y-1">
              {nav?.map((nav, ind) => (
                <div key={ind}>
                  <li
                    key={ind}
                    onClick={() => dispatch(UpdateHeader(false))}
                    className="flex flex-col items-center justify-center font-light dark:text-black text-white"
                  >
                    <Link
                      href={nav.Link}
                      className={`rounded-xl uppercase ${
                        router === nav.Link
                          ? "border-white border border-opacity-30 dark:border-gray-600 dark:border-[1.5px] dark:bg-onDark bg-light_black"
                          : ""
                      } py-2 w-full px-5 lg:px-0 text-center`}
                    >
                      {nav.text}
                    </Link>
                  </li>
                  <span className="w-[80%] opacity-35 -translate-y-2 inline-block mt-1 h-[1px] mx-[15%] rounded-full bg-gradient-to-r dark:from-[#2e2e2e00] dark:to-[#2e2e2e00] dark:via-[#313131] via-[#979797] from-[#313131] to-[#313131] "></span>
                </div>
              ))}
              {user?.role === "admin" && (
                <>
                  {" "}
                  <li
                    onClick={() => dispatch(UpdateHeader(false))}
                    className="flex flex-col items-center justify-center font-light dark:text-black text-white"
                  >
                    <Link
                      href="/banner"
                      className={`rounded-xl uppercase ${
                        router === "/banner"
                          ? "border-white border border-opacity-30 dark:border-gray-600 dark:border-[1.5px] dark:bg-onDark bg-light_black"
                          : ""
                      } py-2 w-full px-5 lg:px-0 text-center`}
                    >
                      Banner
                    </Link>
                  </li>
                  <span className="w-[80%] opacity-35 -translate-y-2 inline-block mt-1 h-[1px] mx-[15%] rounded-full bg-gradient-to-r dark:from-[#2e2e2e00] dark:to-[#2e2e2e00] dark:via-[#313131] via-[#979797] from-[#313131] to-[#313131] "></span>
                </>
              )}
            </ul>
          </div>
        </div>
        {/* Profile */}
        <div className="flex items-center space-x-4">
          <Profile />
          <div>
            <div className="text-white dark:text-black dark:text-opacity-80  capitalize tracking-wide text-base font-semibold">
              {user?.username}
            </div>
            <div className="text-white dark:text-black dark:text-opacity-50 text-opacity-50 text-sm font-semibold">
              {user?.role}
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed  transition-all top-0 left-0 w-full z-[53] h-screen lg:hidden bg-black bg-opacity-35"
          onClick={() => dispatch(UpdateHeader(false))}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
