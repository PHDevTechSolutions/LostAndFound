"use client";

import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement,} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface SalesData {
  _id: string;
  totalGrossSales: number;
}

interface DashboardChartProps {
  selectedMonth: string;
  selectedYear: string;
  Location: string;
  Role: string;
}

const DashboardChart: React.FC<DashboardChartProps> = ({ selectedMonth, selectedYear, Location, Role }) => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);

  // Fetch sales data when the component mounts or Location changes
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const url = `/api/Dashboard/FetchSales?location=${Location}&role=${Role}&month=${selectedMonth}&year=${selectedYear}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch sales data");

        const data = await response.json();
        setSalesData(data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, [selectedMonth, selectedYear, Location, Role]);

  // Filter sales data based on selected month and year
  const getFilteredData = () => {
    return salesData.filter((item) => {
      const month = new Date(item._id).getMonth() + 1;
      const year = new Date(item._id).getFullYear();
      return (
        (selectedMonth === "All" || month === parseInt(selectedMonth, 10)) &&
        (selectedYear === "All" || year === parseInt(selectedYear, 10))
      );
    });
  };

  const filteredData = getFilteredData();

  // Ensure filteredData is not empty before attempting to generate chart data
  if (filteredData.length === 0) {
    return (
      <div className="mt-8">
        <p>No sales data available for the selected filters.</p>
      </div>
    );
  }

  // Prepare data for the line chart
  const lineChartData = {
    labels: filteredData.map((item) => item._id),
    datasets: [
      {
        label: "Gross Sales",
        data: filteredData.map((item) => item.totalGrossSales),
        borderColor: "rgba(20, 60, 102, 0.8)",
        backgroundColor: "rgba(20, 60, 102, 1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Prepare data for the bar chart
  const barChartData = {
    labels: filteredData.map((item) => item._id),
    datasets: [
      {
        label: "Gross Sales",
        data: filteredData.map((item) => item.totalGrossSales),
        backgroundColor: "rgba(20, 60, 102, 0.8)",
        borderColor: "rgba(20, 60, 102, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Line Chart Card */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div style={{ position: "relative", height: "300px" }}>
          <Line
            data={lineChartData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Gross Sales Over Time",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Bar Chart Card */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div style={{ position: "relative", height: "300px" }}>
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Gross Sales by Date",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardChart;
