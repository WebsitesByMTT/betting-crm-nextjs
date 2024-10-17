import React from "react";
import Redeem from "../svg/Redeem";
import Recharge from "../svg/Recharge";
import { TransactionProps } from "@/utils/Types";
import { formatDate } from "@/utils/utils";

const RecentTransaction: React.FC<TransactionProps> = ({ data }) => {

  return (
    <div className="border-[1px] flex-1 border-[rgb(40,40,40)] dark:border-opacity-10 text-white dark:bg-white  rounded-3xl">
      <div className="text-white px-6 tracking-wide text-[.9rem] md:text-base py-2 m-3 dark:text-black dark:bg-onDark bg-light_black rounded-3xl inline-block">
        Recent Transactions
      </div>
      {/* Transaction Table */}
      <div>
        <div className="h-full dark:bg-white relative  rounded-3xl">
          {data?.map((item: any, index: any) => (
            <div key={index}>
              <div className="flex  justify-between border-b-[1px] hover:bg-black hover:rounded-3xl transition-all lg:my-1 dark:hover:bg-gray-100 border-white border-opacity-10 dark:border-black dark:border-opacity-10 pb-3 lg:mx-4 pt-8 px-1 md:px-8">
                <div className="flex space-x-2  w-[50%] md:w-full md:space-x-4">
                  {item?.type === "redeem" ? <Redeem /> : <Recharge />}
                  <div>
                    <div className="text-[.8rem] md:text-[1rem] text-white dark:text-black tracking-widest capitalize">
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
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default RecentTransaction;
