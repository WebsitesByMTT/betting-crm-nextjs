"use client";
import React, { useEffect, useRef } from "react";
import ResolveButton from "./ResolveButton";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useAppSelector } from "@/utils/hooks";
import EditButton from "./EditBetButton";

const Playerbets = ({ headers, data }: any) => {
  
  const activeid: any = useAppSelector((state) => state.globlestate.betId);
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const pathname = usePathname();
  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const elementColor = currentTheme === "dark" ? "#cfd1d0" : "#4B5563";
    const element = document.getElementById(activeid);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.style.transition =
          "background-color 0.5s ease, opacity 0.5s ease";
        element.style.backgroundColor = elementColor;
        element.style.opacity = "0.8";

        setTimeout(() => {
          element.style.backgroundColor = "transparent";
          element.style.opacity = "1";
        }, 1500);
      }, 100);
    }
  }, [pathname, isMounted.current, activeid, currentTheme]);
  return (
    <table className="w-[850px] md:w-[calc(100%-2rem)] mx-auto h-auto">
      <thead>
        <tr className="text-xl">
          {headers.map((item: any, index: number) => (
            <th
              key={index}
              className="font-extralight uppercase py-5  border-white dark:border-black dark:border-opacity-20 border-opacity-20"
            >
              <div className="flex w-full items-center justify-center gap-2">
                <span>{item.icon}</span>
                <span className="text-sm md:text-base dark:text-black dark:font-light text-white">
                  {item.text}
                </span>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="">
        {data &&
          data.length > 0 &&
          data.map((item: any) => (
            <>
              {item.betType === "single" ? (
                item.data.map((data: any, dataIndex: any) => (
                  <tr
                    id={item._id}
                    key={`${item._id}-${dataIndex}-single`}
                    className="text-center font-extralight hover:bg-black dark:hover:bg-gray-100 border-white border-opacity-10"
                  >
                    <td className="w-[20%] py-2 md:py-4">
                      <div className="w-full flex flex-col gap-1 px-3">
                        <span
                          className={`text-white font-medium dark:text-black dark:text-opacity-85 text-left text-sm md:text-lg`}
                        >
                          {data.sport_title}
                        </span>
                        <span className="text-[9px]  md:text-[13px] text-left">
                          <span
                            className={
                              data.bet_on.name === data.teams[0].name
                                ? "text-[#FFC400]"
                                : "dark:text-black text-white"
                            }
                          >
                            {data.teams[0].name}
                          </span>{" "}
                          <span className="text-white dark:text-black">
                            v/s
                          </span>{" "}
                          <span
                            className={
                              data.bet_on.name === data.teams[1].name
                                ? "text-[#FFC400]"
                                : "dark:text-black text-white"
                            }
                          >
                            {data.teams[1].name}
                          </span>
                        </span>
                        <span
                          className={`text-[9px] md:text-[11px] px-3 py-1.5  border-[1px] border-white dark:border-black dark:border-opacity-30 dark:text-black border-opacity-30 text-white text-opacity-60 rounded-lg w-fit`}
                        >
                          {new Date(data.commence_time).toLocaleDateString(
                            "en-US",
                            { day: "numeric", month: "short", year: "numeric" }
                          )}{" "}
                          At{" "}
                          <span className="text-right">
                            {new Date(data.commence_time).toLocaleTimeString(
                              "en-US",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td
                      className={`text-white dark:text-black text-sm md:text-lg`}
                    >
                      $ {item.amount}
                    </td>
                    <td className="uppercase text-sm md:text-lg dark:text-black text-white">
                      <div className="flex flex-col">
                        <span>{data.category}</span>
                        <span className={`text-[.84rem] ${data.category == 'h2h' && 'hidden'}  text-white dark:text-black`}>{data?.bet_on?.points}</span>
                      </div>
                    </td>
                    <td className="text-sm md:text-lg">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm dark:text-black text-white">
                          {data.oddsFormat}
                        </span>
                        <span className="text-white dark:text-black">
                          {data.bet_on.odds}
                        </span>
                      </div>
                    </td>
                    <td className="text-sm text-white dark:text-black md:text-lg">
                      {item.possibleWinningAmount.toFixed(3)}
                    </td>
                    <td
                      className={`text-sm font-semibold ${data.status === "lost"
                        ? "text-gray-500"
                        : data.status === "won"
                          ? "text-green-500"
                          : data.status === "pending"
                            ? "text-yellow-500"
                            : "text-red-500"
                        } md:text-lg capitalize `}
                    >
                      {data.status}
                    </td>
                    <td className="text-white">
                      <ResolveButton id={data._id + ""} />
                      <EditButton id={data._id + ""} betdata={item} />
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  {item.betType === "combo" && (
                    <tr className="text-white bg-black inline-block dark:bg-gray-100 dark:text-black dark:text-opacity-70 px-5 py-1.5 rounded-tl-2xl rounded-tr-2xl border-t-[1px] border-t-[#f3aa3589]">
                      <td>Combo</td>
                    </tr>
                  )}
                  {item.data.map((data: any, dataIndex: any) => (
                    <tr
                      id={item._id}
                      key={`${item._id}-${dataIndex}-combo`}
                      className={`text-center  font-extralight border-[#f3aa3589] border-[1px] hover:bg-black dark:hover:bg-gray-100`}
                    >
                      <td className="w-[20%] py-4">
                        <div className="w-full flex flex-col gap-1 px-3">
                          <span
                            className={`text-white
                 dark:text-black dark:text-opacity-85
                 font-medium text-left text-sm md:text-lg`}
                          >
                            {data.sport_title}
                          </span>
                          <span className="text-[9px]  md:text-[13px] text-left">
                            <span
                              className={
                                data.bet_on.name === data.teams[0].name
                                  ? "text-[#FFC400]"
                                  : "dark:text-black text-white"
                              }
                            >
                              {data.teams[0].name}
                            </span>{" "}
                            <span className="dark:text-black text-white">
                              v/s
                            </span>{" "}
                            <span
                              className={
                                data.bet_on.name === data.teams[1].name
                                  ? "text-[#FFC400]"
                                  : "dark:text-black text-white"
                              }
                            >
                              {data.teams[1].name}
                            </span>
                          </span>
                          <span
                            className={`text-[9px] md:text-[11px] px-3 py-1.5  border-[1px] border-white dark:border-black dark:border-opacity-30 dark:text-black border-opacity-30 text-white text-opacity-60 rounded-lg w-fit`}
                          >
                            {new Date(data.commence_time).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}{" "}
                            At{" "}
                            <span className="text-right">
                              {new Date(data.commence_time).toLocaleTimeString(
                                "en-US",
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="text-sm md:text-lg text-gray-500">
                        --/--
                      </td>
                      <td
                        className={`uppercase text-sm md:text-lg dark:text-black text-white`}
                      >
                        <div className="flex flex-col">
                          <span>{data.category}</span>
                          <span className={`text-[.84rem] ${data.category == 'h2h' && 'hidden'}  text-white dark:text-black`}>{data?.bet_on?.points}</span>
                        </div>
                      </td>
                      <td className="text-sm md:text-lg">
                        <div className="flex flex-col gap-2">
                          <span
                            className={`text-sm text-white dark:text-black`}
                          >
                            {data.oddsFormat}
                          </span>
                          <span className={`text-white dark:text-black`}>
                            {data.bet_on.odds}
                          </span>
                        </div>
                      </td>
                      <td className="text-sm md:text-lg text-gray-500">
                        --/--
                      </td>
                      <td
                        className={`text-sm font-semibold ${data.status === "lost"
                          ? "text-gray-500"
                          : data.status === "won"
                            ? "text-green-500 shadow-md"
                            : data.status === "pending"
                              ? "text-yellow-500"
                              : "text-red-500"
                          } md:text-lg capitalize `}
                      >
                        {data.status}
                      </td>
                      <td className="text-white">
                        <ResolveButton id={data._id + ""} />
                        <EditButton id={data._id + ""} betdata={item} />
                      </td>
                    </tr>
                  ))}
                  <tr className="text-center font-extralight dark:bg-gradient-to-b dark:from-gray-100 dark:to-gray-100 bg-gradient-to-b from-[#1c1a2176] to-[#0d0c156d] border-[1px] border-[#f3aa357c]">
                    <td className="py-3"></td>
                    <td
                      className={`py-3 text-lf text-white dark:text-black
                              `}
                    >
                      $ {item.amount}
                    </td>
                    <td className="py-3"></td>
                    <td className="py-3"></td>
                    <td
                      className={`py-3 text-lf text-white dark:text-black
                              `}
                    >
                      {item.possibleWinningAmount.toFixed(3)}
                    </td>
                    <td
                      className={`text-sm font-semibold ${data.status === "lost"
                        ? "text-gray-500"
                        : data.status === "won"
                          ? "text-green-500 shadow-md"
                          : data.status === "pending"
                            ? "text-yellow-500"
                            : "text-red-500"
                        } md:text-lg capitalize `}
                    >
                      {item.status}
                    </td>

                    <td className="text-white"></td>
                  </tr>
                </>
              )}
            </>
          ))}
      </tbody>
    </table>
  );
};

export default Playerbets;