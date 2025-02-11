"use client";

import React, { useState, useEffect } from "react";
import { motion, animate } from "framer-motion";
import { FaBox } from "react-icons/fa";

const CardInventory: React.FC = () => {
  const [inventoryCount, setInventoryCount] = useState<number>(0);
  const [displayInventoryCount, setDisplayInventoryCount] = useState<number>(0);

  useEffect(() => {
    const fetchInventoryCount = async () => {
      try {
        const response = await fetch("/api/Dashboard/FetchInventory");
        if (!response.ok) throw new Error("Failed to fetch inventory count");

        const result = await response.json();
        const inventoryTotal = result.inventoryTotal || 0;

        // Animate the number transition
        animate(displayInventoryCount, inventoryTotal, {
          duration: 1.5,
          onUpdate: (val) => setDisplayInventoryCount(Math.floor(val)),
        });

        setInventoryCount(inventoryTotal);
      } catch (error) {
        console.error("Error fetching inventory count:", error);
      }
    };

    fetchInventoryCount();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white shadow-md rounded-xl p-12 text-center overflow-hidden"
    >
      {/* Background Icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <FaBox className="text-gray-300 text-9xl" />
      </div>

      {/* Content */}
      <h3 className="text-xs font-semibold text-gray-600">Total Number of Containers in Inventory</h3>
      <motion.p 
        className="text-3xl font-bold text-gray-800"
        key={displayInventoryCount} // Re-render when value updates
      >
        {displayInventoryCount.toLocaleString()}
      </motion.p>
    </motion.div>
  );
};

export default CardInventory;
