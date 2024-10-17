"use client"
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const LastItemDetector = ({ data, searchquery, searchDate}: any) => {
    const lastItemRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();
    const [count, setCount] = useState(1);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting&&data?.length>=10&&(!searchquery || searchquery?.length === 0)&&(!searchDate || searchDate===undefined)) {
                    console.log(`Last item ${count} is in view!`);
                    setCount((prev)=>prev+1);
                    if (data.length>0) {
                     router.push(`${pathname}?page=${count}&limit=${10}`);
                    }
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1,
            }
        );

        if (lastItemRef.current) {
            observer.observe(lastItemRef.current);
        }

        return () => {
            if (lastItemRef.current) {
                observer.unobserve(lastItemRef.current);
            }
        };
    }, [data]);


    if (!data || data.length === 0) return null;

    return <div ref={lastItemRef} style={{ height: '10px', width: '100%' }} />;
};

export default LastItemDetector;