"use client";

import React, { useEffect, useState } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/SessionChecker";
import DashboardChart from "../../components/Dashboard/Charts";
import ChartFilter from "../../components/Dashboard/ChartFilter";
import BeginningBalanceCard from "../../components/Dashboard/BeginningBalanceCard";
import AddReceivable from "../../components/Dashboard/AddReceivable";
import LessCollection from "../../components/Dashboard/LessCollection";
import EndingBalance from "../../components/Dashboard/EndingBalance";

interface SalesData {
  _id: string;
  totalGrossSales: number;
}

const DashboardPage: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch("/api/Dashboard/FetchSales");
        if (!response.ok) throw new Error("Failed to fetch sales data");

        const data = await response.json();
        setSalesData(data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []); // Empty dependency array ensures this runs only once

  const filteredData = salesData.filter(item => {
    const month = new Date(item._id).getMonth() + 1;
    const year = new Date(item._id).getFullYear();
    return (
      (selectedMonth === "All" || month === parseInt(selectedMonth, 10)) &&
      (selectedYear === "All" || year === parseInt(selectedYear, 10))
    );
  });

  return (
    <SessionChecker>
      <ParentLayout>
        <div className="container mx-auto p-4">
          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <BeginningBalanceCard />
            <AddReceivable />
            <LessCollection />
            <EndingBalance />
          </div>

          {/* Filters Section */}
          <ChartFilter
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />

          {/* Pass filtered data as props to DashboardChart */}
          <DashboardChart filteredData={filteredData} />
        </div>
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
