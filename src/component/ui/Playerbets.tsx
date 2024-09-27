"use client";
import React, { useEffect, useRef, useMemo } from "react";
import ResolveButton from "./ResolveButton";
import EditButton from "./EditBetButton";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useAppSelector } from "@/utils/hooks";

// Utility function for status class
const getStatusClass = (status: string) => {
  switch (status) {
    case "lost":
      return "text-gray-500";
    case "won":
      return "text-green-500 shadow-md";
    case "pending":
      return "text-yellow-500";
    default:
      return "text-red-500";
  }
};

// Utility function to format date and time
const formatDate = (timestamp: string | Date) => {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} At ${date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const PlayerBets = ({ headers, data }: any) => {
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
  }, [pathname, activeid, currentTheme]);

  const renderTableRows = useMemo(() => {
    return data?.map((item: any, ind: any) =>
      item.data.map((bet: any, dataIndex: number) => (
        <tr
          id={item._id}
          key={`${item._id}-${dataIndex}-${item.betType}`}
          className="text-center font-extralight hover:bg-black dark:hover:bg-gray-100 border-white border-opacity-10"
        >
          {/* Sport Information */}
          <td className="w-[20%] py-2 md:py-4">
            <div className="w-full flex flex-col gap-1 px-3">
              <span className="text-white font-medium dark:text-black text-left text-sm md:text-lg">
                {bet.sport_title}
              </span>
              {bet?.teams?.length > 0 ? (
                <span className="text-[9px] md:text-[13px] text-left">
                  <span
                    className={
                      bet?.bet_on?.name === bet?.teams[0]?.name
                        ? "text-[#FFC400]"
                        : "dark:text-black text-white"
                    }
                  >
                    {bet.teams[0]?.name}
                  </span>{" "}
                  <span className="text-white dark:text-black">v/s</span>{" "}
                  <span
                    className={
                      bet?.bet_on?.name === bet?.teams[1]?.name
                        ? "text-[#FFC400]"
                        : "dark:text-black text-white"
                    }
                  >
                    {bet.teams[1]?.name}
                  </span>
                </span>
              ) : (
                <span className="text-[9px] md:text-[13px] text-left">
                  <span
                    className={
                      bet?.bet_on === "home_team"
                        ? "text-[#FFC400]"
                        : "dark:text-black text-white"
                    }
                  >
                    {bet?.home_team?.name}
                  </span>{" "}
                  <span className="text-white dark:text-black">v/s</span>{" "}
                  <span
                    className={
                      bet?.bet_on === "away_team"
                        ? "text-[#FFC400]"
                        : "dark:text-black text-white"
                    }
                  >
                    {bet?.away_team?.name}
                  </span>
                </span>
              )}
              <span className="text-[9px] md:text-[11px] px-3 py-1.5 border-[1px] border-white dark:border-black dark:border-opacity-30 text-white text-opacity-60 rounded-lg w-fit">
                {formatDate(bet.commence_time)}
              </span>
            </div>
          </td>
          {/* Bet Amount */}
          <td className="text-white dark:text-black text-sm md:text-lg">
            $ {item.amount}
          </td>
          {/* Category */}
          {bet?.category ? (
            <td className="uppercase text-sm md:text-lg dark:text-black text-white">
              {bet?.category}
            </td>
          ) : (
            <td className="uppercase text-sm md:text-lg dark:text-black text-white">
              {bet?.market}
            </td>
          )}
          {/* Odds */}
          <td className="text-sm md:text-lg">
            <div className="flex flex-col gap-2">
              <span className="text-sm dark:text-black text-white">
                {bet?.oddsFormat}
              </span>
              {bet?.bet_on?.odds ? (
                <span className="text-white dark:text-black">
                  {bet?.bet_on?.odds}
                </span>
              ) : (
                <span className="text-white dark:text-black">
                  {bet?.bet_on === "away_team"
                    ? bet?.away_team?.odds
                    : bet?.home_team?.odds}
                </span>
              )}
            </div>
          </td>
          {/* Possible Winning Amount */}
          <td className="text-sm text-white dark:text-black md:text-lg">
            {item?.possibleWinningAmount?.toFixed(3)}
          </td>
          {/* Status */}
          <td
            className={`text-sm font-semibold md:text-lg capitalize ${getStatusClass(
              bet.status
            )}`}
          >
            {bet.status}
          </td>
          {/* Action Buttons */}
          <td className="text-white">
            <ResolveButton id={bet._id} />
            <EditButton id={bet._id} betdata={item} />
          </td>
        </tr>
      ))
    );
  }, [data]);

  return (
    <table className="w-[850px] md:w-[calc(100%-2rem)] mx-auto h-auto">
      <thead>
        <tr className="text-xl">
          {headers.map((item: any, index: number) => (
            <th
              key={index}
              className="font-extralight uppercase py-5 border-white dark:border-black dark:border-opacity-20 border-opacity-20"
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
      <tbody>{renderTableRows}</tbody>
    </table>
  );
};

export default PlayerBets;
