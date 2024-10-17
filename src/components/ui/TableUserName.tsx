
import { TableUserNameProps } from '@/utils/Types'
import { getCurrentUser, rolesHierarchy } from '@/utils/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const TableUserName: React.FC<TableUserNameProps> = async ({ username, index, Id, role = '' }) => {
    const user: any = await getCurrentUser();
    const userRole: string = user?.role;
    let tabs = await rolesHierarchy(userRole)
    return (
        <>
            <td
                key={index}
            >
                <Link  href={tabs.includes(role) ? (role === 'player' ? `/Reports/player/coins/${username}` : `/Reports/${username}`) : ''} className="flex cursor-pointer items-center  pb-2 pl-2 justify-start space-x-2 py-4">
                    <div>
                        <Image
                            alt="profile"
                            src={"/assets/images/profile.png"}
                            width={200}
                            height={200}
                            className="w-[30px] md:block hidden border-[2px] border-[#858585] rounded-full"
                        />
                    </div>
                    <span className='hover:scale-105 transition-all'>{username}</span>

                </Link>

            </td>
        </>
    )
}

export default TableUserName
