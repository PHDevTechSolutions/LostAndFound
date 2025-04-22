"use client";

import React, { useState } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import UserFetcher from "../../components/UserFetcher/UserFetcher";

const DashboardPage: React.FC = () => {
  
  return (
    <SessionChecker>
      <ParentLayout>
        <UserFetcher>
          {(user) => {
            const userLocation = user ? user.Location : "";
            const userRole = user ? user.Role : "";

            return (
              <div className="container mx-auto p-4">

                {/* Containers Cards Section */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    
                  </div>
                </div>
              </div>
            );
          }}
        </UserFetcher>
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
