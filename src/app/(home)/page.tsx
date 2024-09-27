import Header from "@/component/common/Header";
import ArrowUp from "@/component/svg/ArrowUp";
import Card from "@/component/ui/Card";
import DaysWiseReport from "@/component/ui/DaysWiseReport";
import RecentBets from "@/component/ui/RecentBets";
import RecentTransaction from "@/component/ui/RecentTransaction";
import { config } from "@/utils/config";
import { getCookie, getCurrentUser } from "@/utils/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function getSummary(days:string) {
  const user: any = await getCurrentUser()
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/auth/summary/${user?.userId}?period=${days}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      }
    })
    

    if (!response.ok) {
      const error = await response.json();
      
      return { error: error.message,statuscode: response.status};
    }

    const data = await response.json();
    const summary = data;
    return summary;
  } catch (error) {
    
  } finally {
    revalidatePath("/");
  }
}


export default async function Home({searchParams}:any) {
  const summary = await getSummary(searchParams?.report);

  const user: any = await getCurrentUser()
  const userRole: string = user?.role;

  if (summary?.statuscode===401) {
    redirect('/logout')
  }
  const TopCards = {
    admin: [
      {
        Text: "Bets",
        counts: formatNumber(summary?.betTotals?.totalPeriod) || '0',
        arrow: <ArrowUp />,
      },
      {
        Text: "Transactions",
        counts: formatNumber(summary?.transactionTotals?.totalPeriod)||'0',
        percentage: formatNumber(summary?.transactionTotals?.countPeriod||'0'),
        arrow: summary?.transactionTotals?.countPeriod&&<ArrowUp />,
      },
      {
        Text: "players",
        counts: formatNumber(summary?.playerCounts?.playersPeriod)||'0',
        arrow: <ArrowUp />,
      }, 
      {
        Text: "Subordinates",
        counts: formatNumber(summary?.subordinateCounts?.subordinatesPeriod)||'0',
        arrow: <ArrowUp />,
      },],
    distributor: [
      {
        Text: "Transactions",
        counts: formatNumber(summary?.transactionTotals?.totalPeriod)||'0',
        percentage: formatNumber(summary?.transactionTotals?.countPeriod||'0'),
        arrow: summary?.transactionTotals?.countPeriod&&<ArrowUp />,
      },
      {
        Text: "Recharged",
        counts: formatNumber(summary?.playerCounts?.playersPeriod)||'0',
        arrow: <ArrowUp />,
      },
      {
        Text: "Redeemed",
        counts: formatNumber(summary?.playerCounts?.playersPeriod)||'0',
        arrow: <ArrowUp />,
      },
      {
        Text: "Subordinates",
        counts: formatNumber(summary?.subordinateCounts?.subordinatesPeriod)||'0',
        arrow: <ArrowUp />,
      }],
    subdistributor: [
      {
        Text: "Transactions",
        counts: formatNumber(summary?.transactionTotals?.totalPeriod)||'0',
        percentage: formatNumber(summary?.transactionTotals?.countPeriod||'0'),
        arrow: summary?.transactionTotals?.countPeriod&&<ArrowUp />,
      },
      {
        Text: "Recharged",
        counts: formatNumber(summary?.playerCounts?.playersPeriod)||'0',
        arrow: <ArrowUp />,
      },
      {
        Text: "Redeemed",
        counts: formatNumber(summary?.playerCounts?.playersPeriod)||'0',
        arrow: <ArrowUp />,
      },
      {
        Text: "Subordinates",
        counts: formatNumber(summary?.subordinateCounts?.subordinatesPeriod)||'0',
        arrow: <ArrowUp />,
      }],
    agent: [
      {
        Text: "Bets",
        counts: formatNumber(summary?.betTotals?.totalPeriod)||'0',
        arrow: <ArrowUp />,
      },
      {
        Text: "Transactions",
        counts: formatNumber(summary?.transactionTotals?.totalPeriod)||'0',
        percentage: formatNumber(summary?.transactionTotals?.countPeriod||'0'),
        arrow: summary?.transactionTotals?.countPeriod&&<ArrowUp />,
      },
      {
        Text: "Recharged",
        counts: formatNumber(summary?.playerCounts?.playersPeriod)||'0',
        arrow: <ArrowUp />,
      },
      {
        Text: "Redeemed",
        counts: formatNumber(summary?.playerCounts?.playersPeriod)||'0',
        arrow: <ArrowUp />,
      },
      {
        Text: "players",
        counts: formatNumber(summary?.playerCounts?.playersPeriod)||'0',
        arrow: <ArrowUp />,
      },
     ]
  };

  function formatNumber(num: number): string {
    if (num === 0 || isNaN(num)) {
      return '0';
    }
  
    const absNum = Math.abs(num);
  
    if (absNum >= 1e12) { // Trillion or Lakh Crore
      return `${Math.round((absNum / 1e12) * 100) / 100}T`;
    } else if (absNum >= 1e9) { // Billion or Crore
      return `${Math.round((absNum / 1e9) * 100) / 100}B`;
    } else if (absNum >= 1e7) { // Million or Ten Lakh (Crore in Indian system)
      return `${Math.round((absNum / 1e7) * 100) / 100}Cr`;
    } else if (absNum >= 1e5) { // Lakh
      return `${Math.round((absNum / 1e5) * 100) / 100}L`;
    } else if (absNum >= 1e3) { // Thousand
      return `${Math.round((absNum / 1e3) * 100) / 100}K`;
    } else { // Below Thousand
      return String(num);
    }
  }
  
  return (
    <div className="flex-1">
      <Header />
      <div className="p-2">
          <DaysWiseReport />
        <div className="grid pt-3 grid-cols-12 gap-2 xl:w-[92%] md:gap-y-5   md:gap-5 ">
          <Card TopCards={TopCards[userRole as keyof typeof TopCards]} />
        </div>
        <div className="items-start space-y-5 xl:space-y-0 xl:space-x-5  xl:flex  md:w-full pt-5">
          <RecentTransaction  data={summary?.lastTransactions} />
          {summary?.lastBets?.length > 0 && <RecentBets data={summary?.lastBets} />}
        </div>
      </div>
    </div>
  );
}
