"use client";

import React from "react";

interface ChartFilterProps {
  selectedMonth: string;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>;
  selectedYear: string;
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>;
  selectedLocation: string;
  setSelectedLocation: React.Dispatch<React.SetStateAction<string>>;
  userRole: string; // Add userRole as a prop
}

const ChartFilter: React.FC<ChartFilterProps> = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  selectedLocation,
  setSelectedLocation,
  userRole, // Access user role here
}) => {
  // Location list (can be dynamically fetched from an API if necessary)
  const locations = ["Navotas", "Minalin", "Sambat"];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-6 gap-4 mb-4">
      {/* Month Filter */}
      <select
        className="px-3 py-2 border rounded text-xs"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        <option value="All">All Months</option>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>

      {/* Year Filter */}
      <select
        className="px-3 py-2 border rounded text-xs"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        <option value="All">All Years</option>
        {[...Array(6)].map((_, i) => (
          <option key={i} value={(2025 - i).toString()}>
            {2025 - i}
          </option>
        ))}
      </select>

      {/* Location Filter - Display only for Directors and Super Admin */}
      {userRole === "Directors" || userRole === "Super Admin" ? (
        <select
          className="px-3 py-2 border rounded text-xs"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="All">Select Location</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      ) : (
        <span className="px-3 py-2 border rounded text-xs">Location Filter Disabled</span>
      )}
    </div>
  );
};

export default ChartFilter;
