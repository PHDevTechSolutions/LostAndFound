"use client";

import React, { useState, useEffect } from "react";
import { motion, animate } from "framer-motion";
import { FaBalanceScale } from "react-icons/fa";

interface EndingBalanceProps {
  Location: string;
}

const EndingBalance: React.FC<EndingBalanceProps> = ({ Location }) => {
  const [totalBalanceToday, setTotalBalanceToday] = useState<number>(0);
  const [displayBalance, setDisplayBalance] = useState<number>(0);

  useEffect(() => {
    const fetchEndingBalance = async () => {
      try {
        const response = await fetch(`/api/Dashboard/FetchBalance?location=${Location}`);
        if (!response.ok) throw new Error("Failed to fetch balance");

        const result = await response.json();
        const balanceToday = result.totalBalanceToday || 0;

        // Animate the number transition
        animate(displayBalance, balanceToday, {
          duration: 1.5,
          onUpdate: (val) => setDisplayBalance(Math.floor(val)),
        });

        setTotalBalanceToday(balanceToday);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchEndingBalance();
  }, [Location]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white shadow-md rounded-xl p-12 text-center overflow-hidden"
    >
      {/* Background Icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <FaBalanceScale className="text-gray-300 text-9xl" />
      </div>

      {/* Content */}
      <h3 className="text-xs font-semibold text-gray-600">Ending Balance</h3>
      <motion.p 
        className="text-3xl font-bold text-blue-600"
        key={displayBalance} // Re-render when value updates
      >
        ₱{displayBalance.toLocaleString()}
      </motion.p>
    </motion.div>
  );
};

export default EndingBalance;
