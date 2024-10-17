"use client"
import React, { useEffect, useState } from "react";
import { TableProps } from "@/utils/Types";
import {getCurrentUser, rolesHierarchy } from "@/utils/utils";
import TableThreeDots from "./TableThreeDots";
import PlayerUsername from "../PlayerUsername";
import Link from "next/link";
import Image from "next/image";

const Table: React.FC<TableProps> = ({
  fieldsHeadings,
  fieldData,
  data = [],
  Page,
  width,
}) => {
  const [tabs, setTabs] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser: any = await getCurrentUser();

      if (currentUser) {
        const userRole = currentUser?.role;
        const roleTabs = await rolesHierarchy(userRole);
        setTabs(roleTabs);
      }
    };

    fetchUserData();
  }, [data]);

  const totals=["Over","Under","Draw"]

  return (
    <>
      <div className="bg-[#0E0F0F] overflow-x-scroll dark:bg-white pb-5">
        <div
          className={`dark:bg-white md:border-[1px] ${width} md:w-full rounded-b-2xl rounded-bl-2xl ${Page ? "rounded-tl-2xl" : "md:rounded-tl-none"
            } rounded-r-2xl dark:border-opacity-10 p-3 border-[#313131]`}
        >
          <table className="w-full">
            <thead className="text-white border-b dark:text-black border-[#858585]">
              <tr>
                {fieldsHeadings?.map((item: string, ind: number) => (
                  <th
                    className={`font-normal ${item === "Created At" ? "hidden xl:block " : ""
                      } ${item === "Match Info" ? "hidden xl:block " : ""} ${item === "Status" ? "hidden xl:block " : ""
                      } ${item === "Username" ? "text-start" : "text-center"} text-[.8rem] md:text-base pb-2`}
                    key={ind}
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-center">
              {data?.flat()?.length > 0 &&
                data?.flat()?.map((data: any, ind: number) => (
                  <tr
                    id={data._id}
                    key={data._id}
                    className="text-center hover:bg-black dark:hover:bg-gray-100  transition-all text-[.8rem] md:text-base font-extralight border-b-[1px] border-white border-opacity-10 dark:border-black dark:border-opacity-10  text-opacity-50 dark:text-black text-white">
                    {
                      fieldData?.map((subitem, subind) => {
                        const date: any =
                          subitem === "createdAt" ? "createdAt" : "date";
                        const active = subitem === "type" ? "type" : "status";
                        switch (subitem) {
                          case "username":
                            return (
                              <td
                                key={subind}
                              >
                                <Link href={tabs?.includes(data?.role) ? (data?.role === 'player' ? `/Reports/player/coins/${data?.username}` : `/Reports/${data?.username}`) : ''} className="flex cursor-pointer items-center  pb-2 pl-2 justify-start space-x-2 py-4">
                                  <div>
                                    <Image
                                      alt="profile"
                                      src={"/assets/images/profile.png"}
                                      width={200}
                                      height={200}
                                      className="w-[30px] md:block hidden border-[2px] border-[#858585] rounded-full"
                                    />
                                  </div>
                                  <span className='hover:scale-105 transition-all'>{data[subitem]}</span>
                                  </Link>
                              </td>
                            );
                          case active:
                            return (
                              <td
                                key={subind}
                                className={`pt-4 ${subitem === "status"
                                  ? "hidden xl:inline-block"
                                  : ""
                                  } pb-2`}
                              >
                                {["active", "recharge", "Success"].includes(
                                  data[subitem]
                                ) ? (
                                  <span className="bg-green-700 bg-opacity-30   text-green-500 dark:bg-[#00FF1E] dark:bg-opacity-15 dark:text-[#006b45]  w-[80px] md:w-[100px] inline-block py-1.5 md:py-2 rounded-xl">
                                    {data[subitem]}
                                  </span>
                                ) : ["redeem", "inactive", "fail"].includes(
                                  data[subitem]
                                ) ? (
                                  <span className="bg-red-700 bg-opacity-30  dark:bg-opacity-15   dark:bg-[#ff0000] dark:text-[#6b0000]  text-red-500 w-[80px] md:w-[100px] inline-block py-1.5 md:py-2  rounded-xl">
                                    {data[subitem]}
                                  </span>
                                ) : (
                                  <span className="bg-[#ff9f04] bg-opacity-15 text-[#f97c23] w-[80px] md:w-[100px] inline-block py-1.5 md:py-2  rounded-xl">
                                    {data[subitem]}
                                  </span>
                                )}
                              </td>
                            );
                          case date:
                            return (
                              <td
                                key={subind}
                                className={`pt-4  pb-2 ${date === "createdAt"
                                  ? "hidden xl:inline-block"
                                  : ""
                                  }`}
                              >
                                {new Date(data[date]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </td>
                            );


                          case "sender":
                          case "receiver":
                            return (
                              <td key={subind} className="pt-4 pb-2">
                                {data[subitem]}
                              </td>
                            );

                          case "odds":
                            return (
                              <>
                                {data.data[0]?.bet_on.odds ? (
                                  <td key={subind} className="pt-4 pb-2">
                                    {data?.data[0]?.bet_on?.odds}
                                  </td>
                                ) : (
                                  <td key={subind} className="pt-4 pb-2">
                                    {data?.data[0]?.bet_on === "home_team"
                                      ? data?.data[0]?.home_team?.odds
                                      : data?.data[0]?.away_team?.odds}
                                  </td>
                                )}
                              </>
                            );

                          case "match_info":
                            return (
                              <td
                                key={subind}
                                className="pt-4 pb-2 xl:inline-block hidden"
                              >
                                {data?.data[0]?.teams?.length > 0 ? (
                                  <span>{`${totals?.includes(data?.data[0]?.bet_on?.name)?data.data[0]?.teams[1]?.name:data.data[0]?.teams.find(
                                    (team: any) =>
                                      team.name ===
                                      data?.data[0]?.bet_on?.name 
                                  )?.name
                                    } vs ${data?.data[0]?.teams.find(
                                      (team: any) =>
                                        team?.name !==
                                        data?.data[0]?.bet_on?.name
                                    )?.name
                                    }`}</span>
                                ) : (
                                  <span>{`${data?.data[0]?.home_team?.name} vs ${data?.data[0]?.away_team?.name}`}</span>
                                )}
                              </td>
                            );

                          case "pick":
                            return (
                              <>
                                {data.data[0]?.bet_on?.name ? (
                                  <td key={subind} className="pt-4">
                                    {data.data[0]?.bet_on?.name}
                                  </td>
                                ) : (
                                  <td key={subind} className="pt-4">
                                    {data.data[0]?.bet_on === "home_team"
                                      ? data.data[0]?.home_team?.name
                                      : data.data[0]?.away_team?.name}
                                  </td>
                                )}
                              </>
                            );

                          case "player":
                            return (
                              <PlayerUsername
                                id={data?._id}
                                idx={subind}
                                username={data[subitem]?.username}
                              />
                            );

                          case "actions":
                            return (
                              <TableThreeDots
                                data={data}
                                isDisable={tabs?.includes(data?.role)}
                              />
                            );
                          default:
                            return (
                              <td key={subind} className="pt-4 pb-2">
                                {typeof data[subitem] === "number"
                                  ? Math.round(data[subitem])
                                  : data[subitem]}
                              </td>
                            );
                        }
                      })
                    }
                  </tr>
                ))
              }
            </tbody>


          </table>
        </div>
      </div>
    </>
  );
};

export default Table;
