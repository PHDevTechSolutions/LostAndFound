"use client";

import React, { useState, useEffect } from "react";
import { motion, animate } from "framer-motion";
import { FaHandHoldingUsd  } from "react-icons/fa";

interface AddReceivableProps {
  selectedMonth: string;
  selectedYear: string;
  Location: string;
  Role: string;
}

const AddReceivable: React.FC<AddReceivableProps> = ({ Location, Role }) => {
  const [totalGrossSalesToday, setTotalGrossSalesToday] = useState<number>(0);
  const [displayReceivable, setDisplayReceivable] = useState<number>(0);

  useEffect(() => {
    const fetchReceivable = async () => {
      try {
        const response = await fetch(`/api/Dashboard/FetchReceivable?location=${Location}&role=${Role}`);
        if (!response.ok) throw new Error("Failed to fetch receivable");

        const result = await response.json();
        const grossSalesToday = result.totalGrossSalesToday || 0;

        // Animate the number transition
        animate(displayReceivable, grossSalesToday, {
          duration: 1.5,
          onUpdate: (val) => setDisplayReceivable(Math.floor(val)),
        });

        setTotalGrossSalesToday(grossSalesToday);
      } catch (error) {
        console.error("Error fetching receivable:", error);
      }
    };

    fetchReceivable();
  }, [Location, Role]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white shadow-md rounded-xl p-12 text-center overflow-hidden"
    >
      {/* Background Icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <FaHandHoldingUsd className="text-gray-300 text-9xl" />
      </div>

      {/* Content */}
      <h3 className="text-xs font-semibold text-gray-600">Add Receivable</h3>
      <motion.p 
        className="text-3xl font-bold text-green-600"
        key={displayReceivable} // Re-render when value updates
      >
        ₱{displayReceivable.toLocaleString()}
      </motion.p>
    </motion.div>
  );
};

export default AddReceivable;
