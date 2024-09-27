"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export const getCookie = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  return token;
};

export const deleteCookie = async () => {
  cookies().delete("token");
};

export const getCurrentUser = async () => {
  const token = await getCookie();
  const user = jwt.decode(token as string);
  return user;
  
};

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    
    return formattedDate;
  };
  
export const rolesHierarchy = (role:string): string[] => {
  switch (role) {
    case 'admin':
    return ["all","distributor", "subdistributor", "agent", "player"];
    case 'distributor':
      return ["subdistributor"];
    case 'subdistributor':
      return ["agent"];
    case 'agent':
      return ["player"];
    default:
      return redirect('/logout');
  }
};



