"use client";

import React, { useState, useEffect } from "react";

const AddReceivable: React.FC = () => {
  const [totalGrossSalesToday, setTotalGrossSalesToday] = useState<number>(0);

  useEffect(() => {
    const fetchReceivable = async () => {
      try {
        const response = await fetch("/api/Dashboard/FetchReceivable");
        if (!response.ok) throw new Error("Failed to fetch receivable");

        const result = await response.json();
        const grossSalesToday = result.totalGrossSalesToday || 0;

        setTotalGrossSalesToday(grossSalesToday);
      } catch (error) {
        console.error("Error fetching receivable:", error);
      }
    };

    fetchReceivable();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 text-center">
      <h3 className="text-xs font-semibold">Add Receivable</h3>
      <p className="text-2xl font-bold">₱{totalGrossSalesToday.toLocaleString()}</p>
    </div>
  );
};

export default AddReceivable;
