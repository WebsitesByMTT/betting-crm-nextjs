"use client";
import React, { useEffect, useState } from "react";
import { AddFormData } from "@/utils/Types";
import ChevronDown from "@/component/svg/ChevronDown";
import toast from "react-hot-toast";
import { getCurrentUser, rolesHierarchy } from "@/utils/utils";
import Loader from "@/component/ui/Loader";
import { createPlayer, createSubordinates } from "@/utils/action";
import Down from "@/component/svg/Down";
import { useRouter } from "next/navigation";

const Page: React.FC = () => {
  const [load, setLoad] = useState(false)
  const router = useRouter();
  const [formData, setFormData] = useState<AddFormData>({
    username: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    role: "",
  });

  const [selectRole, setSelectRole] = useState<string[]>([]);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const user: any = await getCurrentUser();
        const role = user?.role;
        if (role) {
          const response = await rolesHierarchy(role)
          setSelectRole(response)
        }
      } catch (error) {
      }
    };

    fetchRole();
  }, []);

  const validateForm = () => {
    const newErrors = { username: "", password: "", role: "" };

    if (!formData.username) {
      newErrors.username = "Username is required.";
    } else if (formData.username.length < 4) {
      newErrors.username = "Username should contain at least 4 letters.";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username =
        "Username should not contain special characters except for hyphens (-) and underscores (_).";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 4) {
      newErrors.password = "Password should be a minimum of 4 characters.";
    }

    if (!formData.role) {
      newErrors.role = "Please select a role.";
    }

    setErrors(newErrors);

    return !newErrors.username && !newErrors.password && !newErrors.role;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const dataObject: AddFormData = {
      ...formData,
      username: formData.username.trim(),
      password: formData.password.trim(),
    };

    try {
      setLoad(true)
      let response:any;
      if (formData?.role === 'player') {
        response = await createPlayer(dataObject);
      } else {
        response = await createSubordinates(dataObject);
      }
      if (response) {
        toast.error(response?.error || `Can't create ${formData.role}`);
        if (response?.statuscode===401) {
          router.push('/logout')
        }
      } else {
        toast.success(`${formData.role} Created Successfully!`);
        setFormData({ username: "", password: "", role: "" });
        setErrors({ username: "", password: "", role: "" });
      }
      setLoad(false)
    } catch (error) {
      setLoad(false)
    }

  };

  return (
    <>
      <div className="pt-3 h-screen xl:h-auto lg:min-h-[85vh] md:bg-[#0E0F0F] dark:bg-white md:p-5 dark:border-opacity-10 lg:border-[1px] rounded-b-2xl rounded-bl-2xl md:rounded-tl-none rounded-r-2xl border-[#313131]">
        <div className="px-5 md:px-12 py-14 border-[1px] border-[#464646] w-[100%] dark:border-opacity-30 md:w-[70%] lg:w-[50%]  xl:w-[45%] rounded-[1.5rem] md:rounded-[2.5rem] mx-auto dark:bg-white bg-[#0E0E0E]">
          <form onSubmit={handleSubmit}>
            <div>
              <div className="text-white dark:text-black  text-opacity-40 text-base pl-2 pb-2">
                Username
              </div>
              <div className="bg-[#1A1A1A] dark:bg-onDark dark:border-opacity-10 flex pl-4 items-center mb-5 border-opacity-20 border-dark_black rounded-lg border-[2px] ">
                <input
                  type="text"
                  name="UserName"
                  placeholder="e.g. Anika"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="outline-none w-full dark:bg-onDark bg-[#1A1A1A] dark:placeholder:text-black dark:text-black placeholder:text-xs rounded-lg px-3 text-base text-white md:placeholder:text-xl placeholder:font-extralight placeholder:text-white placeholder:text-opacity-50 py-2.5"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs pl-2">{errors.username}</p>
              )}
            </div>
            <div>
              <div className="text-white text-opacity-40 dark:text-black text-base pl-2 pb-2">
                Password
              </div>
              <div className="bg-[#1A1A1A] dark:bg-onDark dark:border-opacity-10 flex pl-4 items-center mb-5 border-opacity-60 border-dark_black rounded-lg border-[2px] ">
                <input
                  type="password"
                  name="Password"
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="outline-none w-full dark:bg-onDark bg-[#1A1A1A] dark:placeholder:text-black dark:text-black placeholder:text-xs rounded-lg px-3 text-base text-white md:placeholder:text-xl placeholder:font-extralight placeholder:text-white placeholder:text-opacity-50 py-2.5"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs pl-2">{errors.password}</p>
              )}
            </div>
            <div>
              <div className="text-white text-opacity-40 dark:text-black text-base pl-2 pb-2">
                Role
              </div>
              <div className="bg-[#1A1A1A] dark:bg-onDark dark:border-opacity-10 flex items-center mb-5 border-opacity-60 border-dark_black rounded-lg border-[2px] ">
                <select
                  name="Role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="outline-none w-full dark:bg-onDark bg-[#1A1A1A] px-5 dark:text-black text-white text-opacity-40 rounded-lg pr-3 text-base py-2.5"
                  style={{ paddingRight: "30px", WebkitAppearance: "none", MozAppearance: "none", appearance: "none" }}
                >
                  <option value={''}>select</option>
                  {selectRole.filter(role => role !== "all").map((role, idx) => (
                    <option key={idx} className="uppercase" value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <span className="pr-4 text-white text-opacity-40 font-bold dark:text-black">
                  <Down />
                </span>
              </div>
              {errors.role && (
                <p className="text-red-500 text-xs pl-2">{errors.role}</p>
              )}
            </div>
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="text-white w-full dark:text-black bg-[#69696933] border-opacity-40 uppercase border-[2px] border-[#AAAAAA] text-xl text-center py-2 rounded-xl"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
      <Loader show={load} />
    </>
  );
};

export default Page;
