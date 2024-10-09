'use client'
import { getActivitiesByDateAndPlayer, getBetsAndTransactions } from '@/utils/action';
import React, { useEffect, useState } from 'react'
import Activity from './Activity';
import Profile from '../svg/Profile';
import { TimeRange } from '@/utils/Types';


const DateWiseActivity = ({ AvailableDates, playerId, username }: any) => {
  const [activities, setActivities] = useState([]);
  const [activitytime, setActivitytime] = useState<TimeRange | null>(null);
  const [session, setSession] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [inputdate, setInputDate] = useState('');

  useEffect(() => {
    if (AvailableDates.length > 0) {
      const formattedDate = AvailableDates?.filter((date: any) =>
        new Date(date?.date).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) ===
        new Date(inputdate).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      );
      setSelectedDate(formattedDate?.[0]?.date || '');
      if (!formattedDate?.[0]?.date) {
        setSession([])
      }
    }

  }, [inputdate]);

  const GetSessions = async () => {
    try {
      const session = await getActivitiesByDateAndPlayer(selectedDate, playerId);
      console.log(session, "sessipn");
      
      if (session) {
        setSession(session);
      }
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    if (selectedDate) {
      GetSessions();
    } else {
      setSession([]);
    }
  }, [selectedDate]);

  const handelGetActivities = async (startTime: string, endTime: string, id: string) => {
    try {
      const activity = await getBetsAndTransactions(startTime, endTime, id);
      console.log(activity, "activity");
      
      if (activity) {
        setActivities(activity);
      }
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    if (activitytime) {
      handelGetActivities(activitytime?.startTime, activitytime?.endTime, playerId);
    } else {
      setActivities([]);
    }
  }, [activitytime]);

  return (
    <div className='px-4'>
      <div className='flex items-center space-x-2 pb-4'>
        <Profile />
        <div className='text-white dark:text-black dark:text-opacity-70 capitalize'>{username}</div>
      </div>
      <div className='md:flex space-y-2 md:space-y-0 items-center md:space-x-2'>
        <div className='w-[100%] lg:w-[30%]'>
          <label className="block text-sm font-medium dark:text-gray-700 text-gray-300 mb-2">Select a date</label>
          <div className="relative">
            <input
              onChange={(e) => setInputDate(e.target.value)}
              type="date"
              value={inputdate}
              className="block w-full cursor-pointer px-4 py-2 text-gray-300 bg-gray-800 dark:bg-gray-300 dark:text-gray-700 border-[3px] border-transparent rounded-md focus:ring-blue-200 focus:border-blue-200 focus:outline-none"
            />
            <div className="absolute inset-y-0 cursor-pointer right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div className='w-[100%] lg:w-[30%]'>
          <label className="block text-sm font-medium dark:text-gray-700 text-gray-300 mb-2">Select Available Dates</label>
          <div className="relative">
            <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="block cursor-pointer appearance-none w-full bg-gray-800 dark:bg-gray-300 dark:text-gray-700  text-gray-300 py-3.5 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200">
              <option value={''}>Select</option>
              {
                AvailableDates?.length > 0 && AvailableDates.map((date: any, index: number) => (
                  <option key={index} id={date?.player} value={date?.date}>
                    {new Date(date?.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </option>
                ))
              }
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" fill-rule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className='pt-7'>
        {session.length > 0 && (<div className='pb-5 transition-all w-full md:w-[30%]'>
          <div className='text-white dark:text-gray-700 pb-1 text-sm'>Check Activity</div>
          <select onChange={(e: any) => setActivitytime(JSON.parse(e.target.value))} className='w-full cursor-pointer py-2 outline-none dark:bg-gray-300 dark:text-gray-700 rounded-md bg-gray-700 text-white'>
            <option value={JSON.stringify('')}>Select Time</option>
            {
              session?.length > 0 && session?.map((item: any, ind: number) => (
                <option key={ind} value={JSON.stringify(item)} >{new Date(item?.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' })} - {new Date(item?.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' })}</option>
              ))
            }
          </select>
        </div>)}
        <Activity activities={activities} />
      </div>
    </div>
  )
}

export default DateWiseActivity
