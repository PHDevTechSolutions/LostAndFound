"use client";

import React, { useState, useEffect } from "react";
import { motion, animate } from "framer-motion";
import { FaMoneyBillWave } from "react-icons/fa"

const CardSales: React.FC = () => {
  const [totalSales, setTotalSales] = useState<number>(0);
  const [displaySalesToday, setDisplaySalesToday] = useState<number>(0);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch("/api/Dashboard/FetchSalesToday");
        if (!response.ok) throw new Error("Failed to fetch sales data");

        const result = await response.json();
        const totalGrossSalesToday = result.totalGrossSalesToday || 0;

        // Animate the number transition
        animate(displaySalesToday, totalGrossSalesToday, {
          duration: 1.5,
          onUpdate: (val) => setDisplaySalesToday(Math.floor(val)),
        });

        setTotalSales(totalGrossSalesToday);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white shadow-lg rounded-xl p-12 text-center overflow-hidden"
    >
      {/* Background Icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <FaMoneyBillWave className="text-gray-300 text-9xl" />
      </div>

      {/* Content */}
      <h3 className="text-xs font-semibold text-gray-600">Total Sales Today (Cash)</h3>
      <motion.p
        className="text-3xl font-bold text-gray-800"
        key={displaySalesToday} // Re-render when value updates
      >
        {displaySalesToday.toLocaleString()}
      </motion.p>
    </motion.div>
  );
};

export default CardSales;
