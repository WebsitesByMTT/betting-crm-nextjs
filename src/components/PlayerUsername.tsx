'use client'
import { setBetId } from '@/redux/ReduxSlice'
import { useAppDispatch } from '@/utils/hooks'
import Link from 'next/link'
import React from 'react'

const PlayerUsername = ({ idx, username, id }: { idx: number, username: string, id: Number }) => {
    const dispatch = useAppDispatch()
    const handelClick = (id:Number) => {
        dispatch(setBetId(id))
    }
    return (
        <td key={idx}>
            <Link href={`/Reports/player/betting/${username}`} className='flex'>
                <button onClick={() => handelClick(id)} className='text-left'>
                    {username ? username : "N/A"}
                </button>
            </Link>

        </td>
    )
}

export default PlayerUsername
