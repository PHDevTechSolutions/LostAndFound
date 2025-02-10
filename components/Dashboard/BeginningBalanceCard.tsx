"use client";

import React, { useState, useEffect } from "react";

const BeginningBalanceCard: React.FC = () => {
  const [beginningBalance, setBeginningBalance] = useState<number>(0);

  useEffect(() => {
    const fetchBeginningBalance = async () => {
      try {
        const response = await fetch("/api/Dashboard/FetchPediente");
        if (!response.ok) throw new Error("Failed to fetch beginning balance");

        const result = await response.json();
        const previousBalance = result.previousBalance || 0;
        setBeginningBalance(previousBalance);
      } catch (error) {
        console.error("Error fetching beginning balance:", error);
      }
    };

    fetchBeginningBalance();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 text-center">
      <h3 className="text-xs font-semibold">Beginning Balance (Previous)</h3>
      <p className="text-2xl font-bold">₱{beginningBalance.toLocaleString()}</p>
    </div>
  );
};

export default BeginningBalanceCard;
