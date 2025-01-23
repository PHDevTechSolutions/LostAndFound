"use client";
import React from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface ChartProps {
  lineChartData: any;
  barChartData: any;
}

const DashboardChart: React.FC<ChartProps> = ({ lineChartData, barChartData }) => {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Line Chart Card */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div style={{ position: "relative", height: "300px" }}>
          <Line data={lineChartData} options={{ responsive: true, plugins: { title: { display: true, text: "Gross Sales Over Time" } } }} />
        </div>
      </div>

      {/* Bar Chart Card */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div style={{ position: "relative", height: "300px" }}>
          <Bar data={barChartData} options={{ responsive: true, plugins: { title: { display: true, text: "Gross Sales by Date" } } }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardChart;
