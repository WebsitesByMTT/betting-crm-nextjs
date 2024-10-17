import { BannerData, EditFormData, ModalProps } from "@/utils/Types";
import React, { useEffect, useState } from "react";
import ChevronDown from "../svg/ChevronDown";
import {
  deletePlayer,
  deleteSubordinates,
  fetchSportsCategory,
  resolveStatus,
  transactions,
  updateBet,
  updatePlayer,
  updateSubordinates,
  uploadBanner,
} from "@/utils/action";
import toast from "react-hot-toast";
import ReactDOM from "react-dom";
import Loader from "./Loader";
import { UpdateCredit } from "@/redux/ReduxSlice";
import { useDispatch } from "react-redux";
import Select from "react-select";
import Image from "next/image";
import { redirect } from "next/navigation";

const Modal: React.FC<ModalProps> = ({
  betId,
  isOpen,
  onClose,
  Type,
  data,
  betData

}) => {
  //FIX: modal close
  const [load, setLoad] = useState(false);
  const [betStatus, setBetStatus] = useState<string>("lost");
  const dispatch = useDispatch();
  const [customStatus, setCustomStatus] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<any>();
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const caseType = Type === "Recharge" ? "Recharge" : "Redeem";
  //banner
  const [bannerData, setBannerData] = useState<BannerData>({
    category: ["All"],
    banner: null,
    title: "",
  });


  //Edit
  const [formData, setFormData] = useState<EditFormData>({
    password: "",
    status: data?.status,
  });



  const [betDetailStatus, setBetDetailStatus] = useState<any>();
  const [parentbetData, setParentBetData] = useState({
    betType: betData?.betType,
    amount: betData?.amount,
    isResolved: betData?.isResolved,
    possibleWinningAmount: betData?.possibleWinningAmount,
    betDetailData: betData?.data
  });

  const [betDetails, setBetDetails] = useState<any>(null);

  // Update state when betId or betData changes
  useEffect(() => {
    const clickedBetDetail = parentbetData?.betDetailData?.find((detail: any) => detail._id === betId);
    setBetDetailStatus(clickedBetDetail?.status);

    if (clickedBetDetail) {
      setBetDetails({
        detailId: clickedBetDetail._id,
        category: clickedBetDetail.category,
        status: clickedBetDetail.status,
        isResolved: clickedBetDetail.isResolved,
        bet_on: clickedBetDetail.bet_on,  // Ensure `bet_on` is set
      });
    } else {
      setBetDetails(null);
    }
  }, [betId, betData]);



  const handleChangeBet = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParentBetData({ ...betData, [e.target.name]: e.target.value });
  };
  // console.log(betDetailStatus, "bet detail status");
  useEffect(() => {
    if (betDetails) {
      const updatedBetDetails = {
        ...betDetails,
        status: betDetailStatus
      };
      setBetDetails(updatedBetDetails);
    }
  }, [betDetailStatus]);

  useEffect(() => {
    if (betDetails) {
      const updatedBetDetails = {
        ...betDetails,
        status: customStatus
      };
      setBetDetails(updatedBetDetails);
    }
  }, [customStatus]);



  const handleChangeBetDetail = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (betDetails) {
      const { name, value } = e.target;
      let updatedBetDetails;
      if (name === 'odds') {
        updatedBetDetails = {
          ...betDetails,
          bet_on: {
            ...betDetails.bet_on,
            odds: value,
          }
        };

      } else {
        updatedBetDetails = {
          ...betDetails,
          [name]: value,
        };
      }

      // Ensure the status is also updated
      updatedBetDetails.status = betDetailStatus === 'custom' ? customStatus : betDetailStatus;

      setBetDetails(updatedBetDetails);
    }
  };
  const handleBetUpdate = async () => {
    const payload = {
      betId: betData._id,
      betData: parentbetData,
      betDetails,
    };

    try {
      setLoad(true);
      const response = await updateBet(payload)
      if (response.error) {
        toast.error(response?.error || "Can't Update Agent");
        if (response.statuscode === 401) {
          redirect('/logout')
        }
        onClose();
      } else {
        toast.success(response?.message);
        onClose();
      }
      setLoad(false);
    } catch (error) {
      // console.log(error);
      setLoad(false);
    }
  };
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("HERE");
     console.log();
     
    const newStatus = e.target.value;
    if(betDetails.isResolved && newStatus === "pending"){
      console.log("HERE");
      
      toast.error("Can't update a resolved bet to pending")
      return;
    }

    setBetDetailStatus(newStatus);
    if (newStatus !== 'custom') {
      setCustomStatus('');
    }
  };

  const handelSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (data?.role !== "player") {
      try {
        setLoad(true);
        const response = await updateSubordinates(formData, data?._id);
        if (response.error) {
          toast.error(response?.error || "Can't Update Agent");
          if (response.statuscode === 401) {
            console.log('hi i am updatesubordinate', response)
            redirect('/logout')
          }
        } else {
          toast.success(response?.message);
        }
        onClose();
        setLoad(false);
      } catch (error) {
        setLoad(false);
      }
    } else {
      try {
        setLoad(true);
        const response = await updatePlayer(formData, data?._id);
        if (response.error) {
          toast.error(response?.error || "Can't Update Player");
          if (response.statuscode === 401) {
            redirect('/logout')
          }
        } else {
          toast.success(response?.responseData?.message);
        }
        onClose();
        setLoad(false);
      } catch (error) {
        setLoad(false);
      }
    }
  };

  const handleBannerSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (bannerData.banner === null) {
      return toast.error("Banner image is required");
    }
    if (bannerData.category.length === 0) {
      return toast.error("Category is required");
    }
    // console.log(bannerData);
    const formData = new FormData();
    formData.append("category", JSON.stringify(bannerData.category));
    formData.append("banner", bannerData.banner);
    formData.append("title", bannerData.title);
    setLoad(true);
    const response = await uploadBanner(formData);
    setLoad(false);
    if (response.error) {
      toast.error(response?.error);
      if (response.statuscode === 401) {
        redirect('/logout')
      }
    } else {
      toast.success(response.message);
    }
    setBannerData({
      ...bannerData,
      category: ["All"],
      title: "",
    });
    handleClearFile();
    onClose();
  };

  const fetchCategoryData = async () => {
    const category = await fetchSportsCategory();
    if (category?.length > 0) {
      const options = category?.map((category: any) => ({
        value: category,
        label: category,
      }));
      setCategories(options);
    }
  };

  useEffect(() => {
    if (Type === "Banner") fetchCategoryData();
  }, [isOpen]);

  const onConfirm = async () => {
    const id = data?._id;
    if (data?.role !== "player") {
      try {
        setLoad(true);
        const response = await deleteSubordinates(id);
        if (response.error) {
          toast.error(response?.error || "Can't Delete Agent");
          if (response.statuscode === 401) {
            redirect('/logout')
          }
        }
        onClose();
        setLoad(false);
      } catch (error) {
        setLoad(false);
      }
    } else {
      try {
        setLoad(true);
        const response = await deletePlayer(id);
        if (response.error) {
          toast.error(response?.error || "Can't Delete Player");
          if (response.statuscode === 401) {
            redirect('/logout')
          }
        }
        onClose();
        setLoad(false);
      } catch (error) {
        setLoad(false);
      }
    }
  };
  //Edit
  //Recharge
  const [transaction, setTransaction] = useState("");
  const handleRecharge = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const type = Type?.toLowerCase();
    const dataObject = {
      reciever: data._id,
      amount: transaction,
      type: type,
    };
    try {
      setLoad(true);
      const response = await transactions(dataObject);
      if (response.error) {
        toast.error(response?.error);
        if (response.statuscode === 401) {
          redirect('/logout')
        }
        onClose();
        setLoad(false);
        return;
      }
      onClose();
      toast.success(`${caseType} Successful!`);
      setLoad(false);
      dispatch(UpdateCredit(true));
    } catch (error) {
      setLoad(false);
    }
  };

  if (!isOpen) return null;
  const modalElement = document.getElementById("modal");

  if (!modalElement) {
    toast.error('Element with id "modal" not found');
    return null;
  }

  //Handel Resolve Bete Api
  const handelBetResolve = async (id: string, status: string) => {
    const data = {
      status: status,
    };
    try {
      const response = await resolveStatus(data, id);
      if (response) {
        // console.log(response, "bet resolve status");
        toast.success(`${response?.responseData?.message}`);
        onClose();
      }
    } catch (error) {
      toast.error("Bet could not be resolved");
      onClose();
    }
  };

  //Banner
  const handleClearFile = () => {
    setBannerData({
      ...bannerData,
      banner: null,
      title: "",
    });
    setBannerPreview(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files.length > 0) {
      const selectedFile = files[0];

      setBannerData({
        ...bannerData,
        banner: selectedFile,
        title: selectedFile.name,
      });

      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        // console.log(event.target?.result);
        setBannerPreview(event.target?.result ?? null);
      };
      fileReader.readAsDataURL(selectedFile);
    } else {
      setBannerPreview(null);
    }
  };

  const handleSelect = (e: any) => {
    const selectedOptions = Array.isArray(e) ? e.map((x) => x.value) : [];

    setBannerData({
      ...bannerData,
      category: selectedOptions,
    });
  };

  const calculateTotalOdds = () => {
    let totalOdds = 1;
    for (const bet of parentbetData.betDetailData) {
      const odds =
        bet.bet_on.odds;
      totalOdds *= odds;
    }
    return totalOdds;
  }


  const calculatePossibleWinningAmount = (amount: any, odds: any) => {
    let possibleWinningAmount;
    if (parentbetData.betType === "combo") {
      const totalOdds = calculateTotalOdds();
      possibleWinningAmount = totalOdds * amount;
    } else {
      possibleWinningAmount = amount * odds;
    }

    const updatedBet = {
      ...parentbetData,
      amount: amount,

      possibleWinningAmount: possibleWinningAmount
    };
    setParentBetData(updatedBet)
  };


  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(e.target.value) || 0;

    setParentBetData((prev: any) => {
      const odds = betDetails.bet_on.odds || 0;

      const newPossibleWinningAmount = calculatePossibleWinningAmount(newAmount, odds);
      return {
        ...prev,
        possibleWinningAmount: newPossibleWinningAmount,
      };
    });
  };




  const handleOddsChange = (e: any) => {
    const newOdds = parseFloat(e.target.value);
    console.log(newOdds);

    setBetDetails((prev: any) => {
      const updatedBetDetails = {
        ...prev,
        bet_on: {
          ...prev.bet_on,
          odds: newOdds,  // Correctly access and update the odds inside bet_on
        }

      };

      return {
        ...updatedBetDetails,
        possibleWinningAmount: calculatePossibleWinningAmount(parentbetData.amount, newOdds),
      };
    });
  };

  const handelClose = () => {
    onClose();
    setFormData({
      password: "",
      status: data?.status,
    })
    setTransaction("")
  }

  switch (Type) {
    case "Delete":
      return ReactDOM.createPortal(
        <>
          <div
            className="fixed inset-0 flex items-center justify-center z-[100]"
            onClick={handelClose}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white transition-all p-6 rounded-lg w-96 mx-auto my-8 space-y-4"
              >
                <p className="text-lg text-black text-center font-semibold">
                  Are you sure you want to delete?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    className="px-6 py-1.5 bg-red-500 text-white rounded-3xl hover:bg-red-600 transition duration-200 ease-in-out"
                    onClick={onConfirm}
                  >
                    Yes
                  </button>
                  <button
                    className="px-6 py-1.5 rounded-3xl bg-gray-300 text-black hover:bg-gray-400 transition duration-200 ease-in-out"
                    onClick={handelClose}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Loader show={load} />
        </>,
        modalElement
      );
    case "Edit":
      return ReactDOM.createPortal(
        <>
          <div
            className="fixed inset-0 flex items-center justify-center z-[100]"
            onClick={handelClose}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div
                onClick={(e) => e.stopPropagation()}
                className="px-12 py-14 border-[1px] border-[#464646] w-[90%] md:w-[70%] lg:w-[50%]  xl:w-[30%] rounded-[2.5rem] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] dark:bg-white bg-[#0E0E0E]"
              >
                <form onSubmit={handelSubmit}>
                  <div>
                    <div className="text-white text-opacity-40 dark:text-black text-base pl-2 pb-2">
                      Update Password
                    </div>
                    <div className="bg-[#1A1A1A] flex pl-4 items-center dark:bg-onDark dark:border-opacity-30 mb-5 border-opacity-60 border-dark_black rounded-lg border-[1px] ">
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter new password"
                        value={formData?.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="outline-none w-full bg-[#1A1A1A] placeholder:text-xs dark:bg-onDark dark:placeholder:text-black  rounded-lg px-3 text-base text-white dark:text-black md:placeholder:text-xl placeholder:font-extralight placeholder:text-white placeholder:text-opacity-50 py-2.5"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-white text-opacity-40 dark:text-black text-base pl-2 pb-2">
                      Update Status
                    </div>
                    <div className="bg-[#1A1A1A] flex pl-4 items-center  dark:bg-onDark dark:border-opacity-30 mb-5 border-opacity-60 border-dark_black rounded-lg border-[1px] relative">
                      <select
                        name="status"
                        value={formData?.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className={`outline-none w-full bg-[#1A1A1A] ${formData?.status === "active"
                          ? " text-green-500"
                          : "text-red-500"
                          } rounded-lg px-3 text-base dark:bg-onDark dark:text-black  text-opacity-40 py-2.5 appearance-none`}
                        style={{ paddingRight: "30px" }}
                      >
                        <option value="">Select</option>
                        <option value="active" className="text-green-500">
                          Active
                        </option>
                        <option value="inactive">InActive</option>
                      </select>
                      <span className="pr-4 text-white dark:text-black text-opacity-40">
                        <ChevronDown />
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-4 justify-center pt-4">
                    <button
                      type="submit"
                      className="text-white w-[90%] bg-[#c6c6c63b]  uppercase border-[2px] dark:text-black border-black dark:border-opacity-50 text-sm text-center py-3 rounded-xl shadow-sm"
                    >
                      SAVE
                    </button>
                    <button
                      onClick={handelClose}
                      className="text-white w-[90%] bg-[#c6c6c63b] uppercase border-[2px] dark:text-black border-black dark:border-opacity-50 text-sm text-center py-3 rounded-xl shadow-sm"
                    >
                      CANCLE
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <Loader show={load} />
        </>,
        modalElement
      );

    case caseType:
      return ReactDOM.createPortal(
        <>
          <div
            className="fixed z-[100] inset-0 flex items-center justify-center"
            onClick={handelClose}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div
                onClick={(e) => e.stopPropagation()}
                className="px-12 py-14 border-[1px] dark:bg-white dark:border-opacity-70 border-[#464646] w-[90%] md:w-[70%] lg:w-[50%]  xl:w-[30%] rounded-[2.5rem] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#0E0E0E]"
              >
                <form onSubmit={handleRecharge}>
                  <div>
                    <div className="text-white dark:text-black text-opacity-40 text-base pl-2 pb-2">
                      {caseType}
                    </div>
                    <div className="bg-[#1A1A1A] flex pl-4 items-center dark:bg-onDark dark:border-opacity-40 mb-5 border-opacity-60 border-dark_black rounded-lg border-[2px] ">
                      <input
                        type="text"
                        placeholder="Enter amount"
                        value={transaction}
                        onChange={(e) => setTransaction(e.target.value)}
                        className="outline-none w-full bg-[#1A1A1A] placeholder:text-xs rounded-lg px-3 text-base dark:text-black dark:bg-onDark dark:placeholder:text-black text-white md:placeholder:text-xl placeholder:font-extralight placeholder:text-white placeholder:text-opacity-50 py-2.5"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4 justify-center pt-4">
                    <button
                      onClick={handelClose}
                      className="text-white w-[90%] bg-[#c6c6c63b] uppercase border-[2px]  dark:text-black border-black dark:border-opacity-40 text-sm text-center py-3 rounded-xl shadow-sm"
                    >
                      CANCLE
                    </button>
                    <button
                      type="submit"
                      className="text-white w-[90%] bg-[#c6c6c63b] dark:text-black uppercase border-[2px] border-black dark:border-opacity-40 text-sm text-center py-3 rounded-xl shadow-sm"
                    >
                      SAVE
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <Loader show={load} />
        </>,
        modalElement
      );
    case "resolve":
      return ReactDOM.createPortal(
        <>
          <div
            className="fixed z-[100] inset-0 flex items-center justify-center"
            onClick={handelClose}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div
                onClick={(e) => e.stopPropagation()}
                className="px-12 py-14 border-[1px] dark:bg-white dark:border-opacity-70 border-[#464646] w-[90%] md:w-[70%] lg:w-[50%]  xl:w-[30%] rounded-[2.5rem] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#0E0E0E]"
              >
                <div className="text-white pb-1.5">Select Status</div>
                <select
                  onChange={(e) => setBetStatus(e.target.value)}
                  className="w-full bg-gray-800 py-2 rounded-md text-white"
                >
                  <option value="lost">Lost</option>
                  <option value="won">Won</option>
                </select>
                <div className="flex justify-center pt-5">
                  <button
                    onClick={() => handelBetResolve(betId!, betStatus)}
                    className="bg-gray-900 px-5 py-2 rounded-lg text-white"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>,
        modalElement
      );
    case "edit":
      return ReactDOM.createPortal(
        <>
          <div
            className="fixed z-[100] inset-0 flex items-center justify-center"
            onClick={handelClose}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div
                onClick={(e) => e.stopPropagation()}
                className="px-12 py-14 border-[1px] dark:bg-white dark:border-opacity-70 border-[#464646] w-[90%] md:w-[70%] lg:w-[50%]  xl:w-[30%] rounded-[2.5rem] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#0E0E0E]"
              >
                {/* Input field for Bet */}
                <div className="text-white pb-1.5">Edit Bet</div>
                <input
                  type="text"
                  name="amount"
                  value={parentbetData?.amount}
                  onChange={handleAmountChange} // Use the handleAmountChange function to update state

                  className="w-full bg-gray-800 dark:bg-gray-200 dark:text-black p-2 rounded-md text-white mb-4"
                  placeholder="Enter Bet"
                />

                {/* Input field for Market */}
                <div className="text-white pb-1.5">Edit Market</div>
                <input
                  type="text"
                  value={betDetails?.category}
                  name="category"
                  onChange={(e) => handleChangeBetDetail(e)}
                  className="w-full bg-gray-800 p-2 rounded-md dark:bg-gray-200 dark:text-black text-white mb-4"
                  placeholder="Enter Market"
                />

                {/* Input field for Odds */}
                <div className="text-white pb-1.5">Edit Odds</div>
                <input
                  type="number"
                  name="odds"
                  value={betDetails?.bet_on.odds}
                  onChange={(e) => {
                    handleChangeBetDetail
                    handleOddsChange(e)
                  }
                  }
                  className="w-full bg-gray-800 p-2 dark:bg-gray-200 dark:text-black rounded-md text-white mb-4"
                  placeholder="Enter Odds"
                />

                {/* Input field for Amount Won */}
                <div className="text-white pb-1.5">Edit Amount Won</div>
                <input
                  type="number"
                  disabled
                  value={parentbetData.possibleWinningAmount}
                  onChange={(e) => setParentBetData({ ...parentbetData, possibleWinningAmount: e.target.value })}
                  className="w-full bg-gray-800 p-2 dark:bg-gray-200 dark:text-black rounded-md text-white mb-4"
                  placeholder="Enter Amount Won"
                />

                {/* Select field for Status */}
                <div className="text-white p-1.5">Edit Status</div>
                <select
                  name="status"
                  onChange={handleStatusChange}
                  className="w-full bg-gray-800 p-2 dark:bg-gray-200 dark:text-black rounded-md text-white mb-4"
                  value={betDetailStatus}
                >
                  <option value="lost">Lost</option>
                  <option value="won">Won</option>
                  <option value="pending">Pending</option>
                  <option value="redeem">Redeem</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="custom">Custom</option>
                  <option value="draw">Draw</option>
                  <option value="failed">Failed</option>
                </select>

                {/* Conditionally render custom status input */}
                {betDetailStatus === 'custom' && (
                  <div className="text-white pb-1.5">
                    <label htmlFor="customStatus">Enter Custom Status</label>
                    <input
                      type="text"
                      id="customStatus"
                      value={customStatus}
                      onChange={(e) => setCustomStatus(e.target.value)}
                      className="w-full bg-gray-800 py-2 rounded-md text-white mb-4"
                      placeholder="Enter Custom Status"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center pt-5">
                  <button
                    onClick={() => handleBetUpdate()}
                    className="bg-gray-900 px-5 py-2 dark:bg-gray-200 dark:text-black rounded-lg text-white"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>,
        modalElement
      );


    case "Banner":
      return ReactDOM.createPortal(
        <>
          <div
            className="fixed inset-0 flex items-center justify-center z-[100]"
            onClick={handelClose}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div
                onClick={(e) => e.stopPropagation()}
                className="px-12 py-14 border-[1px] border-[#464646] w-[90%] md:w-[70%] lg:w-[50%]  xl:w-[30%] rounded-[2.5rem] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] dark:bg-white bg-[#0E0E0E]"
              >
                <form
                  onSubmit={handleBannerSubmit}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <div className="text-white text-opacity-40 dark:text-black text-base pl-2 pb-2">
                      Add Banner
                    </div>
                    <div>
                      {!bannerPreview ? (
                        <>
                          <label
                            htmlFor="fileUpload"
                            className={`border-[1px] dark:border-opacity-30 dark:border-[#2826265f] dark:text-[#2826265f] dark:hover:border-black dark:hover:text-black border-[#dfdfdf4a] text-[#dfdfdf4a] hover:text-white transition-all duration-150 hover:border-white rounded-xl w-full text-center py-8 cursor-pointer font-light flex justify-center group ${bannerData.banner && "!text-white border-white"
                              }`}
                          >
                            {!bannerData.banner && (
                              <span className="flex">
                                <span className="mr-2 h-6">
                                  <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 32 32"
                                    fill="auto"
                                    className="h-full w-full group-hover:fill-white transition-all duration-150 fill-[#dfdfdf4a] dark:fill-[#2826265f] dark:group-hover:fill-black"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M28 18.0001V26.0001C28 26.2653 27.8946 26.5196 27.7071 26.7072C27.5196 26.8947 27.2652 27.0001 27 27.0001H5C4.73478 27.0001 4.48043 26.8947 4.29289 26.7072C4.10536 26.5196 4 26.2653 4 26.0001V18.0001C4 17.7348 4.10536 17.4805 4.29289 17.2929C4.48043 17.1054 4.73478 17.0001 5 17.0001C5.26522 17.0001 5.51957 17.1054 5.70711 17.2929C5.89464 17.4805 6 17.7348 6 18.0001V25.0001H26V18.0001C26 17.7348 26.1054 17.4805 26.2929 17.2929C26.4804 17.1054 26.7348 17.0001 27 17.0001C27.2652 17.0001 27.5196 17.1054 27.7071 17.2929C27.8946 17.4805 28 17.7348 28 18.0001ZM11.7075 9.70755L15 6.4138V18.0001C15 18.2653 15.1054 18.5196 15.2929 18.7072C15.4804 18.8947 15.7348 19.0001 16 19.0001C16.2652 19.0001 16.5196 18.8947 16.7071 18.7072C16.8946 18.5196 17 18.2653 17 18.0001V6.4138L20.2925 9.70755C20.4801 9.8952 20.7346 10.0006 21 10.0006C21.2654 10.0006 21.5199 9.8952 21.7075 9.70755C21.8951 9.51991 22.0006 9.26542 22.0006 9.00005C22.0006 8.73469 21.8951 8.48019 21.7075 8.29255L16.7075 3.29255C16.6146 3.19958 16.5043 3.12582 16.3829 3.07549C16.2615 3.02517 16.1314 2.99927 16 2.99927C15.8686 2.99927 15.7385 3.02517 15.6171 3.07549C15.4957 3.12582 15.3854 3.19958 15.2925 3.29255L10.2925 8.29255C10.1049 8.48019 9.99944 8.73469 9.99944 9.00005C9.99944 9.26542 10.1049 9.51991 10.2925 9.70755C10.4801 9.8952 10.7346 10.0006 11 10.0006C11.2654 10.0006 11.5199 9.8952 11.7075 9.70755Z"
                                      fill="auto"
                                    />
                                  </svg>
                                </span>
                                Upload Banner
                              </span>
                            )}
                          </label>
                          <input
                            onChange={handleChange}
                            type="file"
                            className="hidden"
                            id="fileUpload"
                            accept="image/*"
                            name="banner"
                          // ref={fileInputRef}
                          />
                        </>
                      ) : (
                        <div className="relative w-full flex items-start">
                          <Image
                            src={bannerPreview}
                            alt="banner-Preview"
                            className="h-auto max-h-[10rem] w-full object-contain"
                          />
                          <button
                            type="button"
                            className=" dark:text-white px-[5px] focus:outline-none absolute -right-4 -top-3 bg-[#dfdfdf91] dark:bg-[#05040488] rounded-full text-sm"
                            onClick={handleClearFile}
                          >
                            X
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-white text-opacity-40 dark:text-black text-base pl-2 pb-2">
                      Add Category
                    </div>
                    <div className="bg-[#1A1A1A] flex items-center  dark:bg-onDark dark:border-opacity-30 mb-5 border-opacity-60 border-dark_black rounded-lg border-[1px] relative">
                      <Select
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            background: "transparent",
                            display: "flex",
                            flexWrap: "nowrap",
                            borderColor: "transparent",
                            overflowY: "scroll",
                            border: "0",
                          }),
                          menu: (provided) => ({
                            ...provided,
                            background: "#1A1A1A",
                            color: "#fff",
                          }),
                        }}
                        options={categories}
                        value={categories.filter((obj) =>
                          bannerData.category.includes(obj.value)
                        )}
                        onChange={handleSelect}
                        className="basic-multi-select w-full outline-none focus:outline-none bg-[#343232bd] rounded-lg"
                        classNamePrefix="select"
                        placeholder="Select category"
                        isMulti
                        isClearable
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 justify-center pt-4">
                    <button
                      type="submit"
                      className="text-white w-[90%] bg-[#c6c6c63b]  uppercase border-[2px] dark:text-black border-black dark:border-opacity-50 text-sm text-center py-3 rounded-xl shadow-sm"
                    >
                      Upload
                    </button>
                    <button
                      onClick={handelClose}
                      className="text-white w-[90%] bg-[#c6c6c63b] uppercase border-[2px] dark:text-black border-black dark:border-opacity-50 text-sm text-center py-3 rounded-xl shadow-sm"
                    >
                      cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <Loader show={load} />
        </>,
        modalElement
      );
    default:
      return null;
  }
};

export default Modal;