"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { ChartOptions } from "chart.js"; // Import ChartOptions type

// Registering chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SalesCommodity {
  commodityName: string; // Commodity
  totalBoxSales: number; // Total Box Sales for each commodity
  totalPrice: number; // Total Price for each commodity
}

interface ChartProps {
    filteredCommodity: SalesCommodity[]; // Expecting filtered data in SalesData[] type
}

interface PendienteProps {
  Location: string;
  Role: string;
}

const ChartPendiente: React.FC<PendienteProps> = ({ Location, Role }) => {
  const [filteredCommodity, setFilteredCommodity] = useState<SalesCommodity[]>([]);

  // Fetch the aggregated sales data from the API
  useEffect(() => {
    const fetchCommodityData = async () => {
      try {
        const response = await fetch(`/api/Dashboard/FetchSalesCommodity?location=${Location}&role=${Role}`);
        if (!response.ok) throw new Error("Failed to fetch sales data");

        const data: SalesCommodity[] = await response.json();
        setFilteredCommodity(data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchCommodityData();
  }, [Location, Role]);

  // Chart data configuration
  const chartData = {
    labels: filteredCommodity.map(item => item.commodityName), // Commodity names
    datasets: [
      {
        label: "Total Box Sales",
        data: filteredCommodity.map(item => item.totalBoxSales), // Box Sales for each commodity
        backgroundColor: "#4B9CE2", // Color for bars
        borderColor: "#2D6A9A", // Border color for bars
        borderWidth: 1,
      },
      {
        label: "Total Price",
        data: filteredCommodity.map(item => item.totalPrice), // Total Price for each commodity
        backgroundColor: "#FFA500", // Color for bars
        borderColor: "#CC8400", // Border color for bars
        borderWidth: 1,
      },
    ],
  };

  // Define the type of chartOptions
  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: "y", // Horizontal bar chart
    plugins: {
      title: {
        display: true,
        text: "Box Sales and Prices by Commodity",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-1 gap-4">
      {/* Bar Chart Card */}
      <div className="bg-white shadow-md rounded-lg p-4 w-full">
        <div style={{ width: "100%" }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default ChartPendiente;
