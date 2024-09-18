"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Close from "../svg/Close";
import { UpdateNotification } from "@/redux/ReduxSlice";
import { getUserNotifications, setViewedNotification } from "@/utils/action";
import Alert from "../svg/Alert";
import Message from "../svg/Message";
import Info from "../svg/Info";
import { config } from "@/utils/config";
import Link from "next/link";
import { getCookie } from "@/utils/utils";
import { EventSourcePolyfill } from "event-source-polyfill";

const Notifications = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state: { globlestate: { openNotification: Boolean } }) =>
      state?.globlestate.openNotification
  );

  const [notifications, setNotifications] = useState<any[]>([]);

  const getLiveNotification = async (onmessage: any, onerror: any) => {
    const token = await getCookie();

    const eventSource = new EventSourcePolyfill(
      `${config.server}/api/notifications/sse`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    eventSource.onmessage = (event: any) => {
      const data = JSON.parse(event.data);
      onmessage(data);
    };

    eventSource.onerror = (err: any) => {
      onerror(err);
    };

    return eventSource;
  };

  useEffect(() => {
    const onmessage = (data: any) => {
      setNotifications((prev) => {
        if (!prev.some((notification) => notification._id === data._id)) {
          return [data, ...prev];
        }
        return prev;
      });
    };

    const onerror = async (err: any) => {
      if (err.status === 401) {
        console.error("Unauthorized access - re-establishing connection");
      }
    };

    let eventSource: any;
    getLiveNotification(onmessage, onerror).then((source) => {
      eventSource = source;
    });

    // Clean up the connection when the component unmounts
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const handleViewNotification = async (Id: any) => {
    const data: any = await setViewedNotification(Id);
    getNotification();
  };

  const getNotification = async () => {
    const data: any = await getUserNotifications();
    setNotifications(data);
  };
  useEffect(() => {
    getNotification();
  }, []);

  return (
    <div
      className={` ${
        isOpen
          ? "right-[0%] top-0 fixed xl:static transition-all "
          : "-right-[100%] top-0 fixed xl:static transition-all "
      }   ${
        isOpen ? "flex-.2 transition-all" : "w-[0%] hidden"
      } z-50 h-screen px-5 py-5 dark:bg-white bg-bg_dashboard  border-l-[1px] dark:border-opacity-10 xl:col-span-0 border-[#282828]`}
    >
      <button
        className={`absolute top-2 cursor-pointer ${
          isOpen ? "block" : "hidden"
        } right-2`}
        onClick={() => dispatch(UpdateNotification(false))}
      >
        <Close />
      </button>
      <div className="text-white bg-[#232525] dark:bg-onDark dark:text-black px-6 md:px-8 py-1.5  text-[.9rem] md:text-lg rounded-3xl tracking-wide inline-block">
        Notification
      </div>
      <div className="flex flex-col gap-2 py-4 px-2 overflow-y-scroll h-[90vh]">
        {/* //WARN: remove this */}
        {/* <p className="text-white text-[.8rem] md:text-lg"> */}
        {/*   {JSON.stringify(notifications, null, 2)} */}
        {/* </p> */}

        {notifications?.map((item, index) => (
          <Link
            key={index}
            href={`/Reports/player/betting/${item.data.player}#${item.data.betId}`}
          >
            <div
              className={`p-3 shadow-sm w-[400px] cursor-pointer ${
                item.viewed ? "bg-gray-600" : "bg-black"
              } shadow-black `}
              onClick={() => handleViewNotification(item._id)}
            >
              <div className="flex items-center space-x-3">
                {item.type === "alert" ? (
                  <Alert />
                ) : item.type === "message" ? (
                  <Message />
                ) : (
                  <Info />
                )}
                <div className="text-white text-opacity-70 tracking-wide font-light text-sm">
                  {item?.data.message}
                </div>
              </div>
              <div className="text-[.6rem] text-right text-white text-opacity-70 pt-1">
                {new Date(item?.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                At{" "}
                <span className="text-right">
                  {new Date(item.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
