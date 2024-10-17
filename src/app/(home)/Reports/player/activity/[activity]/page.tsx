import DailyActivityViewer from "@/components/ui/DateWiseActivity";
import { getDailyActivity } from "@/utils/action";
import React from "react";

const page = async ({ params }: any) => {
  const player = params.activity;
  const data = await getDailyActivity(player);
  return (
    <DailyActivityViewer
      AvailableDates={data}
      playerId={data[0]?.player}
      username={player}
    />
  );
};

export default page;
