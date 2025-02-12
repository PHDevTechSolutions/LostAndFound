"use client";

import React, { useState, useEffect } from "react";
import { motion, animate } from "framer-motion";
import { FaMoneyBillWave } from "react-icons/fa";

interface LessCollectionProps {
  Location: string;
  Role: string;
}

const LessCollection: React.FC<LessCollectionProps> = ({ Location, Role }) => {
  const [totalCollectionToday, setTotalCollectionToday] = useState<number>(0);
  const [displayCollection, setDisplayCollection] = useState<number>(0);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await fetch(`/api/Dashboard/FetchCollection?location=${Location}&role=${Role}`);
        if (!response.ok) throw new Error("Failed to fetch collection");

        const result = await response.json();
        const collectionToday = result.totalCollectionToday || 0;

        // Animate the number transition
        animate(displayCollection, collectionToday, {
          duration: 1.5,
          onUpdate: (val) => setDisplayCollection(Math.floor(val)),
        });

        setTotalCollectionToday(collectionToday);
      } catch (error) {
        console.error("Error fetching collection:", error);
      }
    };

    fetchCollection();
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
        <FaMoneyBillWave className="text-gray-300 text-9xl" />
      </div>

      {/* Content */}
      <h3 className="text-xs font-semibold text-gray-600">Less Collection</h3>
      <motion.p 
        className="text-md md:text-md lg:text-3xl font-bold text-red-600"
        key={displayCollection} // Re-render when value updates
      >
        ₱{displayCollection.toLocaleString()}
      </motion.p>
    </motion.div>
  );
};

export default LessCollection;
