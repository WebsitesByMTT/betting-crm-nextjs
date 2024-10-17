import React from 'react'
import Profile from '../svg/Profile'
import TopCard from './TopCard'
import ArrowUp from '../svg/ArrowUp';

const SubordinatesReport = ({ reportData }: any) => {
  const TopCards = [
    {
      Text: "Credits",
      counts: formatNumber(Math.round(reportData?.credits))||'0',
      arrow: <ArrowUp />,
    },
    {
      Text: "Recharge",
      counts: formatNumber(reportData?.totalRecharge)||'0',
      arrow: <ArrowUp />,
    },
    {
      Text: "Redeem",
      counts: formatNumber(reportData?.totalRedeem)||'0',
      arrow: <ArrowUp />,
    }
  ];

  function formatNumber(num: number) {
    if (num) {
      if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
      if (num >= 100000) return `${(num / 100000).toFixed(2)}L`;
      if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
      return num.toString();
    }
   
  }
  return (
    <div>
      <div className='flex items-center py-6 justify-between'>
        <div className='flex items-center space-x-2'>
          <Profile />
          <div>
            <div className='text-[.9rem] text-white dark:text-black md:text-xl capitalize tracking-wide'>{reportData?.username} <span className='text-[1rem] font-light dark:text-black text-opacity-50 text-white'>({reportData?.role})</span></div>
            <div className='text-white dark:text-black text-[.7rem] text-opacity-40 pt-.5 tracking-wide'>{new Date(reportData?.createdAt).toLocaleDateString('en-Us', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          </div>

        </div>
        <div>
          {reportData?.status === 'active' ? <span className="bg-green-700 bg-opacity-30 capitalize text-green-500 w-[80px] md:w-[100px] inline-block text-center py-1.5 md:py-2 rounded-xl">
            {reportData?.status}
          </span> :
            <span className="bg-red-700 bg-opacity-30  dark:bg-opacity-15   dark:bg-[#ff0000] dark:text-[#6b0000] capitalize text-center text-red-500 w-[80px] md:w-[100px] inline-block py-1.5 md:py-2  rounded-xl">
              {reportData?.status}
            </span>}
        </div>
      </div>
      <div className='grid grid-cols-12 pb-8 pt-4 gap-2 lg:gap-5'>
        <TopCard TopCards={TopCards} />
      </div>
    </div>
  )
}

export default SubordinatesReport
