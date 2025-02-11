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
import CardInventory from "../../components/Dashboard/CardInventory";
import CardSoldout from "../../components/Dashboard/CardSoldout";

import ChartPendiente from "../../components/Dashboard/ChartPendiente";
import CardSales from "../../components/Dashboard/CardSales";

interface SalesData {
  _id: string;
  totalGrossSales: number;
}

const DashboardPage: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");

  // Fetch sales data only once when the component mounts
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
  }, []);

  // Filter sales data based on selected month and year
  const getFilteredData = () => {
    return salesData.filter(item => {
      const month = new Date(item._id).getMonth() + 1;
      const year = new Date(item._id).getFullYear();
      return (
        (selectedMonth === "All" || month === parseInt(selectedMonth, 10)) &&
        (selectedYear === "All" || year === parseInt(selectedYear, 10))
      );
    });
  };

  

  return (
    <SessionChecker>
      <ParentLayout>
        <div className="container mx-auto p-4">
          {/* Containers Cards Section */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Containers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <CardInventory />
              <CardSoldout />
              <CardSales />
            </div>
          </div>

          {/* Filters Section */}
          <ChartFilter
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
          <div className="mb-4">
            {/* Dashboard Chart */}
          <DashboardChart filteredData={getFilteredData()} />
          </div>

           {/* Frozen Pendiente Cards Section */}
           <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Frozen Pendiente</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <BeginningBalanceCard />
              <AddReceivable />
              <LessCollection />
              <EndingBalance />
            </div>
          </div>
          
          <div className="mb-4">
          <ChartPendiente />
          </div>
        </div>
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
