//app/dashboard/page.tsx

"use client";
import React from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/SessionChecker";

const DashboardPage: React.FC = () => {

  return (
    <SessionChecker>
      <ParentLayout>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-bold mb-2">Card 1 Title</h2>
            <p className="text-sm text-gray-700">This is the content of the first card. You can add more details here.</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-bold mb-2">Card 2 Title</h2>
            <p className="text-sm text-gray-700">This is the content of the second card. You can add more details here.</p>
          </div>
        </div>
      </div>
    </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
