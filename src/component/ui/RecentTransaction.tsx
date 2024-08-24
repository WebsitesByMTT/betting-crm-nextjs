import React from "react";
import Redeem from "../svg/Redeem";
import Recharge from "../svg/Recharge";
import { TransactionProps } from "@/utils/Types";
import { formatDate } from "@/utils/utils";

const RecentTransaction: React.FC<TransactionProps> = ({ data }) => {

  return (
    <div className="border-[1px] flex-1 border-[rgb(40,40,40)] dark:border-opacity-30 text-white dark:bg-white  rounded-3xl">
      <div className="text-white px-6 tracking-wide text-[.9rem] md:text-base py-2 m-3 dark:text-black dark:bg-onDark bg-light_black rounded-3xl inline-block">
        Recent Transactions
      </div>
      {/* Transaction Table */}
      <div className="lg:h-[44vh] xl:h-[62vh] lg:overflow-y-scroll">
        <div className="h-full dark:bg-white relative  rounded-3xl">
          {data?.map((item: any, index: any) => (
            <div key={index}>
              <div className="flex  justify-between pt-8 px-1 md:px-8">
                <div className="flex space-x-2  w-[50%] md:space-x-4">
                  {item?.type === "redeem" ? <Redeem /> : <Recharge />}
                  <div>
                    <div className="text-[.8rem]  text-white dark:text-black tracking-widest capitalize">
                      {item?.type}
                    </div>
                    <div className="flex items-center pt-3 space-x-2">
                      <div className="bg-dark_light_black dark:bg-onDark  px-2 py-1 flex items-center rounded-[.3rem] space-x-4">
                        <span className="text-white dark:text-[#9FA1A2]  text-opacity-30 text-[.8rem] ">
                          Sender
                        </span>
                        <span className="text-white dark:text-black  text-opacity-70 text-[.7rem] ">
                          {item?.sender?.username}
                        </span>
                      </div>
                      <div className="bg-dark_light_black dark:bg-onDark  px-2 py-1 flex items-center rounded-[.3rem] space-x-4">
                        <span className="text-white dark:text-[#9FA1A2] text-opacity-30 text-[.8rem]">
                          Receiver
                        </span>
                        <span className="text-white dark:text-black  text-opacity-70 text-[.7rem]">
                          {item?.receiver?.username}
                        </span>
                      </div>
                    </div>
                    <div className="text-white dark:text-black text-xs font-extralight text-opacity-30 pt-2">
                      {formatDate(item?.date)}
                    </div>
                  </div>
                </div>
                <div className="text-sm dark:text-black dark:text-opacity-60 text-[#A0AEC0]">
                  <span>{item?.type === "redeem" ? "-" : "+"}</span>
                  {item?.amount}
                </div>
              </div>
              <span className="inline-block w-[92%] mx-[4%] h-[1.5px] bg-[#282828]"></span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default RecentTransaction;
