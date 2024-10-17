import { TopCardItem } from '@/utils/Types';
import React from 'react';

interface CardProps {
  TopCards: TopCardItem[];
}

const Card: React.FC<CardProps> = ({ TopCards }) => {
  return (
    <>
      {TopCards?.map((item, index) => (
        <div key={index} className={`col-span-6 md:col-span-4 xl:col-span-3 ${index%2==0?'bg-[#E3F5FF]':'bg-[#E5ECF6]'} w-[100%] p-3 md:px-5 md:py-2 rounded-2xl`}>
          <span className="text-dark_black capitalize text-lg">{item?.Text}</span>
          <div className="flex items-center justify-between pt-4">
            <div className="text-2xl md:text-5xl text-black">{item?.counts}</div>
            <div className="flex items-center space-x-2">
              <div className="text-sm md:text-base font-extralight text-black text-opacity-80">
                {item?.percentage}
              </div>
              {item?.arrow}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Card;