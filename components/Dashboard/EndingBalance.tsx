"use client";

import React, { useState, useEffect } from "react";

const EndingBalance: React.FC = () => {
  const [totalBalanceToday, settotalBalanceToday] = useState<number>(0);

  useEffect(() => {
    const EndingBalance = async () => {
      try {
        const response = await fetch("/api/Dashboard/FetchBalance");
        if (!response.ok) throw new Error("Failed to fetch collection");

        const result = await response.json();
        const BalanceToday = result.totalBalanceToday || 0;

        settotalBalanceToday(BalanceToday);
      } catch (error) {
        console.error("Error fetching receivable:", error);
      }
    };

    EndingBalance();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 text-center">
      <h3 className="text-xs font-semibold">Ending Balance</h3>
      <p className="text-2xl font-bold">₱{totalBalanceToday.toLocaleString()}</p>
    </div>
  );
};

export default EndingBalance;
