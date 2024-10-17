"use client";

import Modal from "@/components/ui/Modal";
import React, { useState } from "react";
import toast from "react-hot-toast";

const UploadBanner: React.FC<any> = ({ refresh, setRefresh }) => {
  const [open, setOPen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [type, setType] = useState("");
  const handelOpen = (state: boolean, Type: string) => {
    setOPen(state);
    setType(Type);
    setToggle(!toggle);
  };

  const handelClose = () => {
    setOPen(false);
    setRefresh(!refresh);
  };
  return (
    <div className="relative">
      <div className="w-full flex justify-end">
        <button
          onClick={() => handelOpen(true, "Banner")}
          className="text-white dark:text-black  dark:bg-[#dee1e3] bg-light_black px-2 md:px-6 rounded-lg py-1 md:py-[7px]"
        >
          Add Banner +
        </button>
        <Modal isOpen={open} Type={type} onClose={handelClose} />
        {toggle && (
          <div
            onClick={() => setToggle(!toggle)}
            className="fixed top-0 left-0 w-full h-screen z-[99]"
          ></div>
        )}
      </div>
    </div>
  );
};

export default UploadBanner;
