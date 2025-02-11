"use client";

import React, { useState, useEffect } from "react";
import { motion, animate } from "framer-motion";
import { FaRegTimesCircle } from "react-icons/fa";

interface CardSoldoutProps { 
  Location: string;
}

const CardSoldout: React.FC<CardSoldoutProps> = ({ Location }) => {
  const [soldoutCount, setSoldoutCount] = useState<number>(0);
  const [displaySoldoutCount, setDisplaySoldoutCount] = useState<number>(0);

  useEffect(() => {
    const fetchSoldoutCount = async () => {
      try {
        const response = await fetch(`/api/Dashboard/FetchSoldout?location=${Location}`);
        if (!response.ok) throw new Error("Failed to fetch soldout count");

        const result = await response.json();
        const soldoutTotal = result.SoldoutTotal || 0;

        // Animate the number transition
        animate(displaySoldoutCount, soldoutTotal, {
          duration: 1.5,
          onUpdate: (val) => setDisplaySoldoutCount(Math.floor(val)),
        });

        setSoldoutCount(soldoutTotal);
      } catch (error) {
        console.error("Error fetching soldout count:", error);
      }
    };

    fetchSoldoutCount();
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
        <FaRegTimesCircle className="text-gray-300 text-9xl" />
      </div>

      {/* Content */}
      <h3 className="text-xs font-semibold text-gray-600">Total Number of Containers in Soldout</h3>
      <motion.p 
        className="text-3xl font-bold text-gray-800"
        key={displaySoldoutCount} // Re-render when value updates
      >
        {displaySoldoutCount.toLocaleString()}
      </motion.p>
    </motion.div>
  );
};

export default CardSoldout;
