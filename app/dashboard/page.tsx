"use client";
import React, { useEffect, useState } from "react";
import { FaBoxes, FaCheckCircle, FaPlus } from "react-icons/fa";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/SessionChecker";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardPage: React.FC = () => {
  const [inventoryCount, setInventoryCount] = useState<number>(0);
  const [soldOutCount, setSoldOutCount] = useState<number>(0);
  const [isSoldOutCardOpen, setIsSoldOutCardOpen] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: "Total Sales",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
    ],
  });
  const [timePeriod, setTimePeriod] = useState<'day' | 'month' | 'year'>('day'); // Track selected time period

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

    fetchContainerData();
  }, []);

  // Fetch sales data for the chart
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch("/api/Container/GetAllContainer");
        if (!response.ok) throw new Error(`Failed to fetch sales data: ${response.statusText}`);

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Data is in an unexpected format");

        const labels: string[] = [];
        const salesData: number[] = [];

        data.forEach((order: any) => {
          const date = new Date(order.DateOrder);
          let label = '';
          let saleAmount = order.GrossSales;

          // Format the label based on the selected time period
          if (timePeriod === 'day') {
            label = `${date.getDate()}/${date.getMonth() + 1}`; // Day/Month format
          } else if (timePeriod === 'month') {
            label = `${date.getMonth() + 1}/${date.getFullYear()}`; // Month/Year format
          } else if (timePeriod === 'year') {
            label = `${date.getFullYear()}`; // Year format
          }

          // Check if label already exists, if so, add the sales to the existing one
          const existingLabelIndex = labels.indexOf(label);
          if (existingLabelIndex !== -1) {
            // If the label exists, accumulate the sales amount for that period
            salesData[existingLabelIndex] += saleAmount;
          } else {
            // If the label doesn't exist, create a new entry for it
            labels.push(label);
            salesData.push(saleAmount);
          }
        });

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Total Sales",
              data: salesData, // The computed total sales data for each period
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, [timePeriod]); // Re-fetch sales data when time period changes

  return (
    <SessionChecker>
      <ParentLayout>
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
            {/* Inventory Section */}
            <div className="bg-gradient-to-r from-green-400 to-blue-500 shadow-md rounded-lg p-4 flex items-center">
              <FaBoxes className="text-white text-4xl mr-4" />
              <div>
                <h2 className="text-lg font-bold text-white mb-2">{inventoryCount}</h2>
                <p className="text-sm text-white">Number of Containers in Inventory</p>
              </div>
            </div>

            {/* Soldout Section */}
            <div className="bg-gradient-to-r from-red-500 to-yellow-500 shadow-md rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <FaCheckCircle className="text-white text-4xl mr-4" />
                <div>
                  <h2 className="text-lg font-bold text-white mb-2">{soldOutCount}</h2>
                  <p className="text-sm text-white">Number of Containers Sold Out</p>
                </div>
              </div>
              <button
                className="text-white text-2xl"
                onClick={() => setIsSoldOutCardOpen(!isSoldOutCardOpen)} // Toggle the collapsible card
              >
                <FaPlus />
              </button>
            </div>
          </div>

          {/* Collapsible SoldOut Card */}
          {isSoldOutCardOpen && (
            <div className="mt-4">
              <div className="bg-white shadow-md rounded-lg p-4 w-full">
                <p className="text-sm text-gray-700">Details about Soldout containers...</p>
              </div>
            </div>
          )}

          {/* Chart Period Selection */}
          <div className="mt-8 mb-4">
            <label className="text-sm font-semibold mr-2">Select Time Period:</label>
            <select
              className="border rounded-md p-2"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value as 'day' | 'month' | 'year')}
            >
              <option value="day">Day</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>

          {/* Line Chart Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Total Sales by {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}</h3>
            <div className="bg-white shadow-md rounded-lg p-4">
              <Line data={chartData} />
            </div>
          </div>
        </div>
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
