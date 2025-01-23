"use client";
import React, { useEffect, useState } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/SessionChecker";
import CardInventory from "../../components/Dashboard/CardInventory";
import CardSoldout from "../../components/Dashboard/CardSoldout";
import DashboardChart from "../../components/Dashboard/Charts"; // Import the chart component
import ChartFilter from "../../components/Dashboard/ChartFilter"; // Import the filter component

interface SalesData {
  _id: string; // DateOrder
  totalGrossSales: number;
}

const DashboardPage: React.FC = () => {
  const [inventoryCount, setInventoryCount] = useState<number>(0);
  const [soldOutCount, setSoldOutCount] = useState<number>(0);
  const [isSoldOutCardOpen, setIsSoldOutCardOpen] = useState<boolean>(false);
  const [salesData, setSalesData] = useState<SalesData[]>([]);

  // Filter selections
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");

  // Fetch container data for inventory count and sold out count
  useEffect(() => {
    const fetchContainerData = async () => {
      try {
        const response = await fetch("/api/Container/FetchContainer");
        if (!response.ok) throw new Error(`Failed to fetch container data: ${response.statusText}`);

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Data is in an unexpected format");

        const inventory = data.filter((container: any) => container.Status?.toLowerCase().trim() !== "soldout");
        const soldOut = data.filter((container: any) => container.Status?.toLowerCase().trim() === "soldout");

        setInventoryCount(inventory.length);
        setSoldOutCount(soldOut.length);
      } catch (error) {
        console.error("Error fetching container data:", error);
      }
    };

    const fetchSalesData = async () => {
      try {
        const response = await fetch("/api/Dashboard/FetchSales");
        if (!response.ok) throw new Error(`Failed to fetch sales data: ${response.statusText}`);

        const data = await response.json();
        setSalesData(data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchContainerData();
    fetchSalesData();
  }, []);

  // Filter data based on month and year
  const filteredData = salesData.filter(item => {
    const month = new Date(item._id).getMonth() + 1;
    const year = new Date(item._id).getFullYear();
    return (
      (selectedMonth === "All" || month === parseInt(selectedMonth, 10)) &&
      (selectedYear === "All" || year === parseInt(selectedYear, 10))
    );
  });

  // Prepare data for the line chart
  const lineChartData = {
    labels: filteredData.map(item => item._id),
    datasets: [
      {
        label: "Gross Sales",
        data: filteredData.map(item => item.totalGrossSales),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Prepare data for the bar chart
  const barChartData = {
    labels: filteredData.map(item => item._id),
    datasets: [
      {
        label: "Gross Sales",
        data: filteredData.map(item => item.totalGrossSales),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <SessionChecker>
      <ParentLayout>
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
            {/* Inventory Section */}
            <CardInventory inventoryCount={inventoryCount} />

            {/* Soldout Section */}
            <CardSoldout
              soldOutCount={soldOutCount}
              isSoldOutCardOpen={isSoldOutCardOpen}
              setIsSoldOutCardOpen={setIsSoldOutCardOpen}
            />
          </div>

          {/* Filters Section */}
          <ChartFilter
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />

          {/* Render the DashboardChart component */}
          <DashboardChart lineChartData={lineChartData} barChartData={barChartData} />
        </div>
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
