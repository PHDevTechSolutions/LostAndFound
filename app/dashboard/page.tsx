"use client";

import React, { useEffect, useState } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/SessionChecker";
import UserFetcher from "../../components/UserFetcher";

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


const DashboardPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");


  return (
    <SessionChecker>
      <ParentLayout>
        <UserFetcher>
          {(user) => (
            <div className="container mx-auto p-4">
              {/* Filters Section */}
              <ChartFilter
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
              />

              {/* Containers Cards Section */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Containers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <CardInventory Location={user ? user.Location : ""} />
                  <CardSoldout Location={user ? user.Location : ""} />
                  <CardSales selectedMonth={selectedMonth} selectedYear={selectedYear} Location={user ? user.Location : ""} />
                </div>
              </div>

              <div className="mb-4">
                {/* Dashboard Chart */}
                <DashboardChart Location={user ? user.Location : ""} />
              </div>

              {/* Frozen Pendiente Cards Section */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Frozen Pendiente</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <BeginningBalanceCard Location={user ? user.Location : ""} />
                  <AddReceivable selectedMonth={selectedMonth} selectedYear={selectedYear} Location={user ? user.Location : ""} />
                  <LessCollection Location={user ? user.Location : ""} />
                  <EndingBalance Location={user ? user.Location : ""} />
                </div>
              </div>

              <div className="mb-4">
                <ChartPendiente Location={user ? user.Location : ""} />
              </div>
            </div>
          )}
        </UserFetcher>
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
