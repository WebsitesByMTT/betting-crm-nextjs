"use client";
import React, { useEffect, useRef, useMemo, useState } from "react";
import ResolveButton from "./ResolveButton";
import EditButton from "./EditBetButton";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useAppSelector } from "@/utils/hooks";
import { getScores } from "@/utils/action";

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
const PlayerBets = ({ headers, data, searchquery, searchDate }: any) => {
  const activeid: any = useAppSelector((state) => state.globlestate.betId);
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const pathname = usePathname();
  const isMounted = useRef(false);
  const [searchState, setSearchState] = useState<any[]>([]);
  const [scoresData, setScoresData] = useState<any[]>([]);
  const [uniqueId, setUniqueId] = useState('')
  

  const handelShowScore = async (eventId: string, uniqueId: string) => {
    setUniqueId(uniqueId)
    try {
      const response = await getScores(eventId)
      if (response) {
        setScoresData(response)
      }
    } catch (error) {

    }
  }



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
    return ((searchquery?.length > 0) || (searchDate)) ? searchState?.length > 0 &&
      searchState?.map((item: any, ind: any) => {
        const comboRow =
          item.betType === "combo" ? (
            <tr className="text-white font-semibold" key={`combo-${item._id}`}>
              <td
                className="bg-black px-5 py-1 dark:bg-gray-200 dark:text-black  rounded-tl-2xl border-[#f3aa3589] border-x-[1px] border-b-[1px] rounded-tr-2xl  inline-block mt-2"
                colSpan={8}
              >
                Combo
              </td>
            </tr> 
          ) : null;

        const betRows = item.data.map((bet: any, dataIndex: number) => (
          <>
            <tr
              onClick={() => handelShowScore(bet?.event_id, item?._id)}
              id={item._id}
              key={`${item._id}-${dataIndex}-${item.betType}`}
              className={`${item.betType === "single"
                ? "border-white border-opacity-10"
                : `border-[#ffc40061] border-x-[1px] ${item.betType === "combo" && dataIndex === 0
                  ? "border-t-[1px]"
                  : ""
                }  ${item.betType === "combo" &&
                  dataIndex === item?.data?.length - 1
                  ? "border-b-[1px]"
                  : ""
                }`
                } text-center font-extralight hover:bg-black dark:hover:bg-gray-100`}
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
                  <span className="text-[9px] md:text-[11px] px-3 py-1.5 border-[1px] dark:text-black  border-white dark:border-black dark:border-opacity-30 text-white text-opacity-60 rounded-lg w-fit">
                    {formatDate(bet.commence_time)}
                  </span>
                </div>
              </td>
              {/* Bet Amount */}
              {item.betType === "single" ? (
                <td className="text-white dark:text-black text-sm md:text-lg">
                  $ {item.amount}
                </td>
              ) : (
                <td className="text-white dark:text-black text-sm md:text-lg">
                  --/--
                </td>
              )}
              {/* Category */}
              <td className="uppercase text-sm md:text-lg dark:text-black text-white">
                <div className="flex items-center flex-col">
                  <span>{bet?.category || bet?.market}</span>
                  {bet?.category !== "h2h" && <span className="text-white text-opacity-60 text-[.9rem] dark:text-black">{bet?.bet_on?.points}</span>}
                </div>
              </td>
              <td className="uppercase text-sm  dark:text-black text-white">
                {bet?.bet_on?.name}
              </td>
              {/* Odds */}
              <td className="text-sm md:text-lg">
                <div className="flex flex-col gap-2">
                  <span className="text-sm dark:text-black text-white">
                    {bet?.oddsFormat}
                  </span>
                  <span className="text-white dark:text-black">
                    {bet?.bet_on?.odds ||
                      (bet?.bet_on === "away_team"
                        ? bet?.away_team?.odds
                        : bet?.home_team?.odds)}
                  </span>
                </div>
              </td>
              {/* Possible Winning Amount */}
              {item.betType === "single" ? (
                <td className="text-sm text-white dark:text-black md:text-lg">
                  {item?.possibleWinningAmount?.toFixed(3)}
                </td>
              ) : (
                <td className="text-sm text-white dark:text-black md:text-lg">
                  --/--
                </td>
              )}
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
            {/* Scores */}
            {(bet?.event_id === scoresData[0]?.event_id) && uniqueId === item?._id && <>
              <tr className={`${item.betType === "combo" && ' border-l-[.7px] border-r-[.7px] border-opacity-40 border-[#FFC400]'} text-white text-opacity-60`}>
                <td
                  className="font-light uppercase px-4"
                  colSpan={7}
                >
                  Scores
                </td>
              </tr>
              {(scoresData?.length > 0) ? (
                <tr className={` text-white ${item.betType === "combo" && ' border-l-[.7px] border-r-[.7px] border-opacity-40 border-[#FFC400]'} text-center`}>
                  <td
                    className="font-extralight py-2 text-[#FFC400]"
                    colSpan={2}
                  >
                    {scoresData[0]?.home_team}
                  </td>
                  <td className="font-semibold py-2">
                    {scoresData[0]?.home_score}
                  </td>
                  <td
                    className="text-center text-[#dfdfdf74] font-extralight"
                    colSpan={1}
                  >
                    vs
                  </td>
                  <td
                    className="font-extralight py-2 text-[#FFC400]"
                    colSpan={2}
                  >
                    {scoresData[0]?.away_team}
                  </td>
                  <td className="font-semibold py-2">
                    {scoresData[0]?.away_score}
                  </td>
                </tr>
              ) : (
                <tr className="">
                  <td
                    className="font-light text-[#FFC400] text-center"
                    colSpan={7}
                  >
                    Scores not available
                  </td>
                </tr>
              )}
            </>}
            {/* Scores */}
            {item?.betType === "combo" && dataIndex === item?.data?.length - 1 && (
              <tr
                id={item._id}
                key={`${item._id}-${dataIndex}-${item.betType}-total`}
                className={`border-[#ffc40061] border-[1px] text-center font-extralight hover:bg-black dark:hover:bg-gray-100`}
              >
                {/* Sport Information */}
                <td className="w-[20%] py-2 md:py-4"></td>
                {/* Bet Amount */}
                <td className="text-white dark:text-black text-sm md:text-lg py-2 md:py-4">
                  $ {item?.amount}
                </td>
                {/* Category */}
                <td className="uppercase text-sm md:text-lg dark:text-black text-white"></td>
                {/* Odds */}
                <td className="text-sm md:text-lg py-2 md:py-4"></td>
                {/* Possible Winning Amount */}
                <td className="text-sm text-white dark:text-black md:text-lg py-2 md:py-4">
                  {item?.possibleWinningAmount?.toFixed(3)}
                </td>
                {/* Status */}
                <td
                  className={`text-sm font-semibold md:text-lg capitalize py-2 md:py-4 ${getStatusClass(
                    item?.status
                  )}`}
                >
                  {item.status}
                </td>
                {/* Action Buttons */}
                <td className="text-white"></td>
              </tr>
            )}
          </>
        ));

        return [comboRow, ...betRows];
      }) :
      data?.flatMap((item: any, ind: any) => {
        const comboRow =
          item.betType === "combo" ? (
            <tr className="text-white font-semibold" key={`combo-${item._id}`}>
              <td
                className="bg-black px-5 py-1 dark:bg-gray-200 dark:text-black rounded-tl-2xl border-[#f3aa3589] border-x-[1px] border-b-[1px] rounded-tr-2xl  inline-block mt-2"
                colSpan={8}
              >
                Combo
              </td>
            </tr>
          ) : null;

        const betRows = item.data.map((bet: any, dataIndex: number) => (
          <>
            <tr
              onClick={() => handelShowScore(bet?.event_id, item?._id)}
              id={item._id}
              key={`${item._id}-${dataIndex}-${item.betType}`}
              className={`${item.betType === "single"
                ? "border-white border-opacity-10"
                : `border-[#ffc40061] border-x-[1px] ${item.betType === "combo" && dataIndex === 0
                  ? "border-t-[1px]"
                  : ""
                }  ${item.betType === "combo" &&
                  dataIndex === item?.data?.length - 1
                  ? "border-b-[1px]"
                  : ""
                }`
                } text-center font-extralight hover:bg-black dark:hover:bg-gray-100`}
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
                  <span className="text-[9px] md:text-[11px] px-3 py-1.5 dark:text-black border-[1px] border-white dark:border-black dark:border-opacity-30 text-white text-opacity-60 rounded-lg w-fit">
                    {formatDate(bet.commence_time)}
                  </span>
                </div>
              </td>
              {/* Bet Amount */}
              {item.betType === "single" ? (
                <td className="text-white dark:text-black text-sm md:text-lg">
                  $ {item.amount}
                </td>
              ) : (
                <td className="text-white dark:text-black text-sm md:text-lg">
                  --/--
                </td>
              )}
              {/* Category */}

              <td className="uppercase text-sm md:text-lg dark:text-black text-white">
                <div className="flex items-center flex-col">
                  <span>{bet?.category || bet?.market}</span>
                  {bet?.category !== "h2h" && <span className="text-white text-opacity-60 text-[.9rem] dark:text-black">{bet?.bet_on?.points}</span>}
                </div>
              </td>
              <td className="uppercase text-sm  dark:text-black text-white">
                {bet?.bet_on?.name}
              </td>
              {/* Odds */}
              <td className="text-sm md:text-lg">
                <div className="flex flex-col gap-2">
                  <span className="text-sm dark:text-black text-white">
                    {bet?.oddsFormat}
                  </span>
                  <span className="text-white dark:text-black">
                    {bet?.bet_on?.odds ||
                      (bet?.bet_on === "away_team"
                        ? bet?.away_team?.odds
                        : bet?.home_team?.odds)}
                  </span>
                </div>
              </td>
              {/* Possible Winning Amount */}
              {item.betType === "single" ? (
                <td className="text-sm text-white dark:text-black md:text-lg">
                  {item?.possibleWinningAmount?.toFixed(3)}
                </td>
              ) : (
                <td className="text-sm text-white dark:text-black md:text-lg">
                  --/--
                </td>
              )}
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
            {/* Scores */}
            {(bet?.event_id === scoresData[0]?.event_id) && uniqueId === item?._id && <>
              <tr className={`${item.betType === "combo" && ' border-l-[.7px] border-r-[.7px] border-opacity-40 border-[#FFC400]'} text-white text-opacity-60`}>
                <td
                  className="font-light uppercase px-4"
                  colSpan={7}
                >
                  Scores
                </td>
              </tr>
              {(scoresData?.length > 0) ? (
                <tr className={` text-white ${item.betType === "combo" && ' border-l-[.7px] border-r-[.7px] border-opacity-40 border-[#FFC400]'} text-center`}>
                  <td
                    className="font-extralight py-2 text-[#FFC400]"
                    colSpan={2}
                  >
                    {scoresData[0]?.home_team}
                  </td>
                  <td className="font-semibold py-2">
                    {scoresData[0]?.home_score}
                  </td>
                  <td
                    className="text-center text-[#dfdfdf74] font-extralight"
                    colSpan={1}
                  >
                    vs
                  </td>
                  <td
                    className="font-extralight py-2 text-[#FFC400]"
                    colSpan={2}
                  >
                    {scoresData[0]?.away_team}
                  </td>
                  <td className="font-semibold py-2">
                    {scoresData[0]?.away_score}
                  </td>
                </tr>
              ) : (
                <tr className="">
                  <td
                    className="font-light text-[#FFC400] text-center"
                    colSpan={7}
                  >
                    Scores not available
                  </td>
                </tr>
              )}
            </>}
            {/* Scores */}
            {item?.betType === "combo" && dataIndex === item?.data?.length - 1 && (
              <tr
                id={item._id}
                key={`${item._id}-${dataIndex}-${item.betType}-total`}
                className={`border-[#ffc40061] border-[1px] text-center font-extralight hover:bg-black dark:hover:bg-gray-100`}
              >
                {/* Sport Information */}
                <td className="w-[20%] py-2 md:py-4"></td>
                {/* Bet Amount */}
                <td className="text-white dark:text-black text-sm md:text-lg py-2 md:py-4">
                  $ {item?.amount}
                </td>
                {/* Category */}
                <td className="uppercase text-sm md:text-lg dark:text-black text-white"></td>
                {/* Odds */}
                <td className="text-sm md:text-lg py-2 md:py-4"></td>
                {/* Possible Winning Amount */}
                <td className="text-sm text-white dark:text-black md:text-lg py-2 md:py-4">
                  {item?.possibleWinningAmount?.toFixed(3)}
                </td>
                {/* Status */}
                <td
                  className={`text-sm font-semibold md:text-lg capitalize py-2 md:py-4 ${getStatusClass(
                    item?.status
                  )}`}
                >
                  {item.status}
                </td>
                {/* Action Buttons */}
                <td className="text-white"></td>
              </tr>
            )}
          </>

        ));

        return [comboRow, ...betRows];
      });
  }, [data, searchState, scoresData]);

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
