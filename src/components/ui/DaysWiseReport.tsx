'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const DaysWiseReport = () => {
    const router = useRouter()
    const [days, setDays] = useState('today')
    useEffect(() => {
        router.push(`/?report=${days}`)
    }, [days])
    return (
        <div className='pb-2'>
            <select value={days} onChange={(e) => setDays(e.target.value)} className="cursor-pointer outline-none mr-auto max-w-[150px] bg-black dark:bg-gray-200 dark:text-black text-white border-[1px]  border-gray-300 dark:border-gray-300  text-sm rounded-lg  block w-full p-[.5rem]  dark:placeholder-gray-400">
                <option value={'today'}>Today</option>
                <option value={'week'}>Weakly</option>
                <option value={'month'}>Monthly</option>
            </select>
        </div>

    )
}

export default DaysWiseReport
