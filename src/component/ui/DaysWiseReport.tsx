"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const DaysWiseReport = () => {
    const router = useRouter()
    const [days, setDays] = useState(30)
    useEffect(() => {
        router.push(`/?report=${days}`)
    }, [days])
    return (
        <div className='w-[92%]'>
            <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="cursor-pointer ml-auto max-w-[150px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option value={1}>Today</option>
                <option value={7}>Weakly</option>
                <option value={30}>Monthly</option>
            </select>
        </div>

    )
}

export default DaysWiseReport
