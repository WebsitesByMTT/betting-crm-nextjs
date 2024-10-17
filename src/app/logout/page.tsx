import DeleteUser from "@/components/ui/DeleteUser";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Logout = async () => {
  async function deleteToken() {
    "use server";
    cookies().delete("token");
    redirect("/login");
  }

  return <DeleteUser deleteToken={deleteToken} />;
};

export default Logout;
