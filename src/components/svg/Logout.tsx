import { useRouter } from "next/navigation";
import React from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const Logout = () => {
  const router = useRouter();
  const deleteCookieHandler = () => {
    try {
      Cookies.remove("token");
      router.push("/login");
      toast.success('Logout successfully !')
    } catch (error: any) {
      console.log(error.message);

    }
  };


  return (
    <button onClick={deleteCookieHandler}>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="23"
          height="23"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide cursor-pointer lucide-log-out"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
      </div>
    </button>
  );
};

export default Logout;
