"use server";
import { revalidatePath } from "next/cache";
import { config } from "./config";
import Cookies from "js-cookie";
import { getCookie, getCurrentUser } from "./utils";
import { redirect } from "next/navigation";

export const loginUser = async (data: any) => {
  try {
    const response = await fetch(`${config.server}/api/auth/login?origin=crm`, {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const responseData = await response.json();
    const token = responseData?.token;
    if (token) {
      Cookies.set("token", token);
    }
    return responseData;
  } catch (error) {
    console.log("error:", error);
  }
};
export const GetCaptcha = async () => {
  try {
    const response = await fetch(`${config.server}/api/auth/captcha`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const responseData = await response.json();
    return { responseData };
  } catch (error) {
    console.log("error:", error);
  } finally {
    revalidatePath("/");
  }
};
export const updateSubordinates = async (data: any, Id: any) => {
  const token = await getCookie();

  try {
    const response = await fetch(`${config.server}/api/subordinates/${Id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }
    const resdata = await response.json();
    return resdata;
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  } finally {
    revalidatePath("/");
  }
};
export const deleteSubordinates = async (id: any) => {
  const token = await getCookie();

  try {
    const response = await fetch(`${config.server}/api/subordinates/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }
    const responseData = await response.json();
    return { responseData };
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  } finally {
    revalidatePath("/subordinates");
  }
};
export const createSubordinates = async (data: any) => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/subordinates`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }
    const responseData = await response.json();
    return { responseData };
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  } finally {
    revalidatePath("/subordinates");
  }
};
export const updatePlayer = async (data: any, Id: any) => {
  const token = await getCookie();

  try {
    const response = await fetch(`${config.server}/api/players/${Id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }
    const responseData = await response.json();
    return { responseData };
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  } finally {
    revalidatePath("/");
  }
};
export const deletePlayer = async (id: any) => {
  const token = await getCookie();

  try {
    const response = await fetch(`${config.server}/api/players/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }
    const responseData = await response.json();
    return { responseData };
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  } finally {
    revalidatePath("/");
  }
};
export const createPlayer = async (data: any) => {
  const token = await getCookie();

  try {
    const response = await fetch(`${config.server}/api/players`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }
    const responseData = await response.json();
    return { responseData };
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  } finally {
    revalidatePath("/");
  }
};
export const transactions = async (data: any) => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/transactions/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }
    const responseData: any = await response.json();
    const respMessage = responseData.message;

    return respMessage;
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  } finally {
    revalidatePath("/");
  }
};
export const getBetsForPlayer = async (userId: any) => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/bets/player/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }
    const data = await response.json();
    const bets = data.Bets;

    return bets;
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  }
};
export const getCredits = async () => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/auth`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }

    const data = await response.json();
    const credits = data;

    return credits;
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  }
};
export const getSubordinatesReport = async (username: string) => {
  const token = await getCookie();
  try {
    const response = await fetch(
      `${config.server}/api/subordinates/${username}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }

    const data = await response.json();
    const report = data;
    return report;
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  } finally {
    revalidatePath("/");
  }
};
export async function getAllBets(
  user: any,
  dateString: string,
  page: number,
  limit: number
) {
  const token = await getCookie();
  let url = `/api/bets?page=${page || 1}&limit=${limit || 10}`;
  if (user?.role === "admin") {
    if (dateString?.length > 0) {
      url += `&date=${dateString}`;
    }
  } else {
    url += `/${user?.userId}`;
    if (dateString) {
      url += `&date=${dateString}`;
    }
  }
  console.log(url, "betting");
  try {
    const response = await fetch(`${config.server}${url}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }
    const data = await response.json();
    const bet = data;
    return bet;
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  }
}
export async function getAllTransactions(
  user: any,
  searchString: string,
  dateString: String,
  page: number,
  limit: number
) {
  let transaction: string = `/api/transactions?page=${page || 1}&limit=${
    limit || 10
  }`;
  if (searchString?.length > 0) {
    transaction += `&search=${encodeURIComponent(String(searchString))}`;
  }
  if (dateString?.length > 0) {
    transaction += `&date=${dateString}`;
  }
  let transaction_subordinates: string = `/api/transactions/${user?.username}/subordinate?type=username`;
  if (searchString?.length > 0) {
    transaction_subordinates += `&search=${encodeURIComponent(
      String(searchString)
    )}`;
  }
  if (dateString?.length > 0) {
    transaction_subordinates += `&date=${dateString}`;
  }
  const token = await getCookie();
  try {
    const response = await fetch(
      `${config.server}${
        user?.role == "admin" ? transaction : transaction_subordinates
      }`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }
    const data = await response.json();
    const transactions = data;
    return transactions;
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  }
}

export async function getSubordinates(
  role: string,
  searchString: string,
  dateString: string,
  page: number,
  limit: number
) {
  console.log(page, "Page", limit, "page");
  const token = await getCookie();
  const user: any = await getCurrentUser();
  let url: string = `/api/subordinates?type=${role}&page=${page || 1}&limit=${
    limit || 10
  }`;
  if (searchString?.length > 0) {
    url += `&search=${encodeURIComponent(String(searchString))}`;
  }
  if (dateString?.length > 0) {
    url += `&date=${dateString}`;
  }

  let subordinatesurl: string = `/api/subordinates/${user?.username}/subordinates?type=username`;
  if (searchString?.length > 0) {
    subordinatesurl += `&search=${encodeURIComponent(String(searchString))}`;
  }
  if (dateString?.length > 0) {
    subordinatesurl += `&date=${dateString}`;
  }
  try {
    const response = await fetch(
      `${config.server}${user?.role === "admin" ? url : subordinatesurl}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }

    const data = await response.json();
    const all = data;
    return all;
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  } finally {
    revalidatePath("/subordinates");
  }
}

export async function getUserNotifications() {
  const token = await getCookie();
  try {
    const response = await fetch(
      `${config.server}/api/notifications?viewedStuatus=${true}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }
    const data = await response.json();
    //sort data according to createdAt

    data.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return data;
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  } finally {
    revalidatePath("/");
  }
}

export const setViewedNotification = async (notificationId: any) => {
  const token = await getCookie();

  try {
    const response = await fetch(
      `${config.server}/api/notifications?notificationId=${notificationId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }
    const responseData = await response.json();
    return { responseData };
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  } finally {
    revalidatePath("/");
  }
};

export const resolveStatus = async (data: any, Id: any) => {
  const token = await getCookie();

  try {
    const response = await fetch(`${config.server}/api/bets/resolve/${Id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }
    const responseData = await response.json();
    return { responseData };
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  } finally {
    revalidatePath("/");
  }
};

export const fetchSportsCategory = async () => {
  const token = await getCookie();

  try {
    const response = await fetch(`${config.server}/api/banner/category`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
    console.log(error);
  }
};

export const uploadBanner = async (data: any) => {
  const token = await getCookie();

  try {
    const response = await fetch(`${config.server}/api/banner`, {
      method: "POST",
      credentials: "include",
      headers: {
        Cookie: `userToken=${token}`,
      },
      body: data,
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
    console.log(error);
  }
};

export const getBanners = async (category: string, status: string) => {
  const token = await getCookie();
  try {
    const response = await fetch(
      `${config.server}/api/banner?category=${category}&status=${status}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  }
};

export const updateBannerStatus = async (banners: string[], status: string) => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/banner`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
      body: JSON.stringify({ banners, status }),
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  }
};

export const deleteBanners = async (banners: string[]) => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/banner`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
      body: JSON.stringify({ banners }),
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  }
};

export async function getDailyActivity(username: string) {
  const token = await getCookie();
  try {
    const response = await fetch(
      `${config.server}/api/userActivities/${username}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }
    const data = await response.json();

    return data;
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  }
}

export async function getActivitiesByDateAndPlayer(
  date: string,
  playerId: string
) {
  const token = await getCookie();
  try {
    const response = await fetch(
      `${config.server}/api/userActivities?date=${encodeURIComponent(
        date
      )}&playerId=${encodeURIComponent(playerId)}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }

    const data = await response.json();    
    return data;
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
  }
}

export async function getBetsAndTransactions(
  startTime: string,
  endTime: string,
  playerId: string
) {
  const token = await getCookie();
  const Time_id = {
    startTime: startTime,
    endTime: endTime,
    playerId: playerId,
  };

  try {
    const response = await fetch(`${config.server}/api/userActivities`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
      body: JSON.stringify(Time_id),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }

    const data = await response.json();

    return data;
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
    return { error: "An error occurred while fetching bets and transactions." };
  }
}

export async function updateBet(payload: any) {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/bets`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message, statuscode: response?.status };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    Cookies.remove("token");
    redirect("/login");
    return { error: "An error occurred while fetching bets and transactions." };
  } finally {
    revalidatePath("/");
  }
}
export async function getPlayerTransactions(
  username: string,
  searchString: string,
  dateString: string,
  page: number,
  limit: number
) {
  let transaction_subordinates: string = `/api/transactions/${username}/players?type=username&page=${page || 1}&limit=${limit || 10}`;
  if (searchString?.length > 0) {
    transaction_subordinates += `&search=${encodeURIComponent(
      String(searchString)
    )}`;
  }
  if (dateString?.length > 0) {
    transaction_subordinates += `&date=${encodeURIComponent(
      String(dateString)
    )}`;
  }
  const token = await getCookie();
  try {
    const response = await fetch(
      `${config.server}${transaction_subordinates}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    const transactions = data;
    return transactions;
  } catch (error) {
    console.log(error);
  }
}

export async function getPlayerBettings(
  username: string,
  searchString: string,
  dateString: string,
  page: number,
  limit: number
) {
  const token = await getCookie();
  let url:string = `api/bets/${username}/bets?type=username&status=all&page=${page||1}&limit=${limit||10}`;


  if (searchString?.length > 0) {
    url += `?search=${encodeURIComponent(String(searchString))}`;
  }
  if (dateString?.length > 0) {
    url += `&date=${encodeURIComponent(String(dateString))}`;
  }

  try {
    const response:any = await fetch(`${config.server}/${url}`, {

      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message,statuscode: response.status};
    } 


    const data = await response.json();
    return data;
  } catch (error) {
    return { error: "Failed to fetch data" };
  } finally {
    revalidatePath("/"); // Only call this if necessary
  }
}

export async function getAllTransactionsSubor(
  username: string,
  searchString: string,
  dateString: string,
  page: number,
  limit: number
) {
  let transaction_subordinates: string = `/api/transactions/${username}/subordinate?type=username&page=${page||10}&limit=${limit||10}`;

  if (searchString?.length > 0) {
    transaction_subordinates += `&search=${encodeURIComponent(
      String(searchString)
    )}`;
  }
  if (dateString?.length > 0) {
    transaction_subordinates += `&date=${encodeURIComponent(
      String(dateString)
    )}`;
  }
  const token = await getCookie();

  try {
    const response = await fetch(
      `${config.server}${transaction_subordinates}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }

    const data = await response.json();
    const transactions = data;
    return transactions;
  } catch (error) {
  } finally {
    revalidatePath("/");
  }
}

export async function getAllSubordinates(
  username: string,
  searchString: string,
  dateString: string,
  page: number,
  limit: number
) {
  const token = await getCookie();
  let subordinatesurl: string = `${config.server}/api/subordinates/${username}/subordinates?type=username&page=${page||1}&limit=${limit||10}`;

  if (searchString?.length > 0) {
    subordinatesurl += `&search=${encodeURIComponent(String(searchString))}`;
  }
  if (dateString?.length > 0) {
    subordinatesurl += `&date=${encodeURIComponent(String(dateString))}`;
  }
  try {
    const response = await fetch(subordinatesurl, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    const all = data;
    return all;
  } catch (error) {
  } finally {
    revalidatePath("/");
  }
}

export const getScores = async (eventId: string | null) => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/score/${eventId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log("error:", error);
  }
};

export const getTransactionInsights = async (user: any) => {
  const token = await getCookie();
  let url = "api/transactions/";
  if (user?.role === "admin") {
    url += "admin";
  } else {
    url += "user";
  }
  try {
    const response = await fetch(`${config.server}/${url}?year=2024`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log("error:", error);
  }
};

export const getSubordinateInsights = async () => {
  const token = await getCookie();
  try {
    const response = await fetch(
      `${config.server}/api/auth/createdUser?year=2024`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log("error:", error);
  }
};