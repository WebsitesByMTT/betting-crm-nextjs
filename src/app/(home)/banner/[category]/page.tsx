"use client";
import Back from "@/component/svg/Back";
import ChevronDown from "@/component/svg/ChevronDown";
import Loader from "@/component/ui/Loader";
import UploadBanner from "@/component/ui/UploadBanner";
import { deleteBanners, getBanners, updateBannerStatus } from "@/utils/action";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = (params: any) => {
  const [banners, setBanners] = useState<[]>([]);
  const [status, setStatus] = useState<string>("active");
  const router = useRouter();
  const [selectedBanner, setSelectedBanner] = useState<string[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [load, setLoad] = useState(false);
  const category =
    params.params.category && decodeURIComponent(params.params.category);

  const fetchData = async (category: string, status: string) => {
    const bannerData = await getBanners(category, status);
    setBanners(bannerData?.banners);
  };

  useEffect(() => {
    fetchData(category, status);
  }, [status]);

  useEffect(() => {
    fetchData(category, status);
  }, [refresh]);

  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedBanner((prev) => [...prev, id]);
    } else {
      setSelectedBanner((prev) => prev.filter((bannerId) => bannerId !== id));
    }
  };

  const handleUpdate = async (newStatus: string) => {
    setLoad(true);
    const response = await updateBannerStatus(selectedBanner, newStatus);
    setLoad(false);
    if (response.statuscode===401) {
      toast.error(response.error)
       router.push('/logout');
    }
    toast.success(response.message);
    fetchData(category, status);
    setSelectedBanner([]);
  };

  const handleDelete = async () => {
    setLoad(true);
    const response = await deleteBanners(selectedBanner);
    setLoad(false);
    if (response.statuscode===401) {
      toast.error(response.error)
       router.push('/logout');
    }
    toast.success(response.message);
    fetchData(category, status);
    setSelectedBanner([]);
  };

  return (
    <div>
      <div className="w-full md:flex pb-3 md:pb-0  justify-between">
        <div className="flex gap-2 w-full py-4 items-center">
          <button onClick={() => router.back()}>
            <Back />
          </button>
          <h3 className="dark:text-black text-white md:text-xl font-semibold capitalize">
            {category}
          </h3>
        </div>
        <div className="flex w-full gap-3 items-center justify-center">
          <div className="bg-[#1A1A1A] flex items-center  dark:bg-onDark dark:border-opacity-30 border-opacity-60 border-dark_black rounded-lg border-[1px] relative">
            <select
              name="category"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`outline-none w-full bg-[#1A1A1A] rounded-lg px-1 md:px-3 dark:bg-onDark text-white dark:text-black  text-opacity-40 appearance-none`}
              style={{ paddingRight: "30px" }}
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
            <span className=" text-white dark:text-black text-opacity-40 p-1 md:p-2">
              <ChevronDown />
            </span>
          </div>
          <UploadBanner refresh={refresh} setRefresh={setRefresh} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-x-4 gap-y-4 border-2 h-[75vh] overflow-y-scroll p-2 px-4 rounded-2xl border-[#dfdfdf40] ">
        {banners?.length > 0 ? (
          banners?.map((data: any, index) => (
            <div
              key={index}
              className="flex items-center justify-center w-full h-[12vh] md:h-[23vh] relative"
            >
              <Image src={data.url} alt={data.title} fill objectFit="contain" />
              <button onClick={() => {}} className="absolute left-4 md:top-4">
                <input
                  type="checkbox"
                  checked={selectedBanner.includes(data._id)}
                  onChange={(e) =>
                    handleCheckboxChange(data._id, e.target.checked)
                  }
                />
              </button>
            </div>
          ))
        ) : (
          <div className="text-white dark:text-black col-span-2 text-center py-5 text-xl">
            Nothing to show here
          </div>
        )}
      </div>
      {selectedBanner?.length > 0 && (
        <div className="flex justify-end gap-5 w-full text-white pt-4">
          <button
            onClick={() =>
              handleUpdate(status === "active" ? "inactive" : "active")
            }
            className="bg-[#fBBd0a] bg-opacity-30 whitespace-nowrap dark:bg-opacity-15   dark:bg-[#ff0000] dark:text-[#6b0000] border-[1px] border-[#fBBd0a] text-[#fBBd0a] px-5 inline-block py-1.5 md:py-2  rounded-xl"
          >
            Make {status === "active" ? "Inactive" : "Active"}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-700 bg-opacity-30  dark:bg-opacity-15  dark:bg-[#ff0000] dark:text-[#6b0000]  border-[1px] border-red-500 text-red-500 px-5 inline-block py-1.5 md:py-2  rounded-xl"
          >
            Delete
          </button>
        </div>
      )}
      <Loader show={load} />
    </div>
  );
};

export default Page;
