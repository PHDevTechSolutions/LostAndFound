"use client";

import React, { useState, useEffect } from "react";

const LessCollection: React.FC = () => {
  const [totalCollectionToday, settotalCollectionToday] = useState<number>(0);

  useEffect(() => {
    const lessCollection = async () => {
      try {
        const response = await fetch("/api/Dashboard/FetchCollection");
        if (!response.ok) throw new Error("Failed to fetch collection");

        const result = await response.json();
        const CollectionToday = result.totalCollectionToday || 0;

        settotalCollectionToday(CollectionToday);
      } catch (error) {
        console.error("Error fetching receivable:", error);
      }
    };

    lessCollection();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 text-center">
      <h3 className="text-xs font-semibold">Less Collection</h3>
      <p className="text-2xl font-bold">₱{totalCollectionToday.toLocaleString()}</p>
    </div>
  );
};

export default LessCollection;
