import React, { useState } from 'react';
import Down from '../svg/Down';

const Activity = ({ activities }: any) => {
  const [expanded, setExpanded] = useState({ bets: false, transactions: true });

  const toggleExpansion = (type: 'bets' | 'transactions') => {
    setExpanded((prevState) => ({ ...prevState, [type]: !prevState[type] }));
  };

  const formatDate = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })} at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="space-y-6">
      {/* Bets Section */}
      <div className="space-y-2">
        <div
          className="bg-gray-700 dark:bg-gray-300 hover:dark:bg-gray-400 flex items-center justify-between cursor-pointer hover:bg-gray-800 transition-all w-full py-3 rounded-md px-4"
          onClick={() => toggleExpansion('bets')}
        >
          <div className="text-white dark:text-gray-700 font-semibold">Bets</div>
          <div className={`transform transition-transform ${expanded.bets ? 'rotate-180' : ''}`}>
            <Down />
          </div>
        </div>
        <div
          className={`bg-gray-800 dark:bg-gray-300 text-white dark:text-gray-700 rounded-md transition-max-height duration-300 ease-in-out overflow-hidden ${
            expanded.bets ? 'max-h-96 py-3 px-4' : 'max-h-0'
          }`}
        >
          <ul className="space-y-3 overflow-y-auto max-h-60">
            {activities?.bets?.length > 0 ? (
              activities.bets.map((bet: any, index: number) => (
                <li
                  key={index}
                  className="bg-gray-700 dark:bg-gray-200 rounded-md p-3 shadow-md hover:bg-gray-600 transition"
                >
                  <div className="text-base font-semibold">Player: {bet?.playerDetails?.username}</div>
                  <div className="text-sm">Amount: <span className="text-green-400">${bet?.amount}</span></div>
                  <div className={`text-sm ${bet?.status === 'won' ? 'text-green-500' : 'text-red-500'}`}>
                    Status: {bet?.status.charAt(0).toUpperCase() + bet?.status.slice(1)}
                  </div>
                  <div className="mt-2">
                    <span className="font-medium">Bet Details:</span>
                    <ul className="ml-4 mt-1 list-disc">
                      {bet?.betDetails?.map((detail: any, idx: number) => (
                        <li key={idx} className="text-sm">
                          Placed At: {formatDate(detail?.commence_time)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-center text-sm py-2">No bets available</li>
            )}
          </ul>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="space-y-2">
        <div
          className="bg-gray-700 dark:bg-gray-300 hover:dark:bg-gray-400 flex items-center justify-between cursor-pointer hover:bg-gray-800 transition-all w-full py-3 rounded-md px-4"
          onClick={() => toggleExpansion('transactions')}
        >
          <div className="text-white dark:text-gray-700 font-semibold">Transactions</div>
          <div className={`transform transition-transform ${expanded.transactions ? 'rotate-180' : ''}`}>
            <Down />
          </div>
        </div>
        <div
          className={`bg-gray-800 dark:bg-gray-300 text-white dark:text-gray-700 rounded-md transition-max-height duration-300 ease-in-out overflow-hidden ${
            expanded.transactions ? 'max-h-96 py-3 px-4' : 'max-h-0'
          }`}
        >
          <div className="overflow-y-auto max-h-60">
            <table className="w-full text-sm">
              <thead>
                <tr className="font-light text-gray-400">
                  <th className="py-2">Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Receiver</th>
                  <th>Sender</th>
                </tr>
              </thead>
              <tbody>
                {activities?.transactions?.length > 0 ? (
                  activities.transactions.map((item: any, ind: number) => (
                    <tr key={ind} className="text-center bg-gray-700 dark:bg-gray-200 hover:bg-gray-600 transition">
                      <td className="py-2">
                        {item?.type === 'redeem' ? (
                          <span className="bg-red-500 text-red-500 bg-opacity-25 px-4 py-1 rounded-full">Redeem</span>
                        ) : (
                          <span className="bg-green-500 text-green-500 bg-opacity-25 px-4 py-1 rounded-full">Recharge</span>
                        )}
                      </td>
                      <td>${item?.amount}</td>
                      <td>{formatDate(item?.date)}</td>
                      <td>{item?.receiver}</td>
                      <td>{item?.sender}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-3">
                      No transactions available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;
