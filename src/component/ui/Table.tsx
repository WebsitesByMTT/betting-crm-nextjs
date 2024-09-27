import React from "react";
import { TableProps } from "@/utils/Types";
import { formatDate, getCurrentUser, rolesHierarchy } from "@/utils/utils";
import TableThreeDots from "./TableThreeDots";
import TableUserName from "./TableUserName";
import PlayerUsername from "../PlayerUsername";

const Table: React.FC<TableProps> = async ({
  fieldsHeadings,
  fieldData,
  data = [],
  Page,
  width,
}) => {
  const user: any = await getCurrentUser();
  const userRole: string = user?.role;
  let tabs = await rolesHierarchy(userRole);

  return (
    <>
      <div className="bg-[#0E0F0F]  overflow-x-scroll  dark:bg-white pb-5">
        <div
          className={` dark:bg-white  md:border-[1px]  ${width} md:w-full rounded-b-2xl rounded-bl-2xl  ${
            Page ? "rounded-tl-2xl" : " md:rounded-tl-none"
          }  rounded-r-2xl dark:border-opacity-10 p-3 border-[#313131]`}
        >
          <table className="w-full ">
            <thead className="text-white border-b  dark:text-black border-[#858585] ">
              <tr>
                {fieldsHeadings?.map((item: string, ind: number) => (
                  <th
                    className={`font-normal ${
                      item === "Created At" ? "hidden xl:block " : ""
                    } ${item === "Match Info" ? "hidden xl:block " : ""} ${
                      item === "Status" ? "hidden xl:block " : ""
                    } ${
                      item === "Username" ? "text-start" : "text-center"
                    } text-[.8rem] md:text-base pb-2`}
                    key={ind}
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className=" text-center">
              {data.length > 0 &&
                data?.map((data: any, ind: number) => {
                  const formattedDate = formatDate(
                    data?.createdAt || data?.date
                  );
                  return (
                    <tr
                      id={data._id}
                      key={data._id}
                      className="text-center hover:bg-black dark:hover:bg-gray-100  transition-all text-[.8rem] md:text-base font-extralight border-b-[1px] border-white border-opacity-10 dark:border-black dark:border-opacity-10  text-opacity-50 dark:text-black text-white"
                    >
                      {fieldData.map((field, idx) => {
                        const date =
                          field === "createdAt" ? "createdAt" : "date";
                        const active = field === "type" ? "type" : "status";
                        switch (field) {
                          case "username":
                            return (
                              <TableUserName
                                role={data?.role}
                                username={data[field]}
                                Id={data._id}
                                index={idx}
                              />
                            );
                          case active:
                            return (
                              <td
                                key={idx}
                                className={`pt-4 ${
                                  field === "status"
                                    ? "hidden xl:inline-block"
                                    : ""
                                } pb-2`}
                              >
                                {["active", "recharge", "Success"].includes(
                                  data[field]
                                ) ? (
                                  <span className="bg-green-700 bg-opacity-30   text-green-500 dark:bg-[#00FF1E] dark:bg-opacity-15 dark:text-[#006b45]  w-[80px] md:w-[100px] inline-block py-1.5 md:py-2 rounded-xl">
                                    {data[field]}
                                  </span>
                                ) : ["redeem", "inactive", "fail"].includes(
                                    data[field]
                                  ) ? (
                                  <span className="bg-red-700 bg-opacity-30  dark:bg-opacity-15   dark:bg-[#ff0000] dark:text-[#6b0000]  text-red-500 w-[80px] md:w-[100px] inline-block py-1.5 md:py-2  rounded-xl">
                                    {data[field]}
                                  </span>
                                ) : (
                                  <span className="bg-[#ff9f04] bg-opacity-15 text-[#f97c23] w-[80px] md:w-[100px] inline-block py-1.5 md:py-2  rounded-xl">
                                    {data[field]}
                                  </span>
                                )}
                              </td>
                            );

                          case date:
                            return (
                              <td
                                key={idx}
                                className={`pt-4  pb-2 ${
                                  date === "createdAt"
                                    ? "hidden xl:inline-block"
                                    : ""
                                }`}
                              >
                                {formattedDate}
                              </td>
                            );

                          case "sender":
                          case "receiver":
                            return (
                              <td key={idx} className="pt-4 pb-2">
                                {data[field]}
                              </td>
                            );

                          case "odds":
                            return (
                              <>
                                {data.data[0]?.bet_on.odds ? (
                                  <td key={idx} className="pt-4 pb-2">
                                    {data.data[0]?.bet_on.odds}
                                  </td>
                                ) : (
                                  <td key={idx} className="pt-4 pb-2">
                                    {data.data[0]?.bet_on === "home_team"
                                      ? data?.data[0]?.home_team?.odds
                                      : data?.data[0]?.away_team?.odds}
                                  </td>
                                )}
                              </>
                            );

                          case "match_info":
                            return (
                              <td
                                key={idx}
                                className="pt-4 pb-2 xl:inline-block hidden"
                              >
                                {data?.data[0]?.teams?.length > 0 ? (
                                  <span>{`${
                                    data.data[0]?.teams.find(
                                      (team: any) =>
                                        team.name ===
                                        data?.data[0]?.bet_on?.name
                                    )?.name
                                  } vs ${
                                    data.data[0]?.teams.find(
                                      (team: any) =>
                                        team?.name !==
                                        data?.data[0]?.bet_on?.name
                                    )?.name
                                  }`}</span>
                                ) : (
                                  <span>{`${data.data[0]?.home_team?.name} vs ${data.data[0]?.away_team?.name}`}</span>
                                )}
                              </td>
                            );

                          case "pick":
                            return (
                              <>
                                {data.data[0]?.bet_on?.name ? (
                                  <td key={idx} className="pt-4">
                                    {data.data[0]?.bet_on?.name}
                                  </td>
                                ) : (
                                  <td key={idx} className="pt-4">
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
                                idx={idx}
                                username={data[field].username}
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
                              <td key={idx} className="pt-4 pb-2">
                                {typeof data[field] === "number"
                                  ? Math.round(data[field])
                                  : data[field]}
                              </td>
                            );
                        }
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Table;