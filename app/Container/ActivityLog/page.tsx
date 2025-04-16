"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/SessionChecker";
import UserFetcher from "../../../components/UserFetcher";
import ActivityTable from "../../../components/ActivityLogs/ActivityTable";

const ActivityLog: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchDatabase = async () => {
    try {
      const response = await fetch("/api/ActivityLog/FetchActivityLogs");
      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabase();
  }, []);

  // Sort and filter posts based on date range
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredPosts = sortedPosts.filter((post) => {
    const postDate = new Date(post.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (
      (!start || postDate >= start) && (!end || postDate <= end)
    );
  });

  // Pagination
  const itemsPerPage = 5;
  const totalItems = filteredPosts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <SessionChecker>
      <ParentLayout>
        <UserFetcher>
          {() => (
            <div className="container mx-auto p-4">
              {/* Title and Controls in a single row */}
              <div className="flex flex-wrap justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
                <h2 className="text-lg font-bold w-full md:w-auto">Activity Logs</h2>

                {/* Date Range Filter and Pagination Controls */}
                <div className="flex flex-wrap space-x-4 w-full md:w-auto">
                  {/* Date Range Filter */}
                  <div className="flex space-x-2 w-full md:w-auto">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="p-2 border border-gray-300 rounded text-xs w-full md:w-auto"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="p-2 border border-gray-300 rounded text-xs w-full md:w-auto"
                    />
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex space-x-2 w-full md:w-auto mt-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 text-xs w-full md:w-auto"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-xs text-gray-500 w-full md:w-auto">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 text-xs w-full md:w-auto"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                The "Activity Logs" section serves as a comprehensive record of all actions and changes made within the system. It tracks every data update, including who created or modified each entry, and provides information on the location where the activity took place. This feature is essential for auditing purposes, ensuring transparency and accountability for all user actions within the platform. By reviewing the activity logs, users can easily track updates, identify changes, and maintain a clear history of system interactions.
              </p>

              {/* Table */}
              <div className="bg-white overflow-auto max-h-[600px]">
                {loading ? (
                  <div className="text-center">Loading...</div>
                ) : (
                  <ActivityTable posts={currentItems} />
                )}
              </div>
            </div>
          )}
        </UserFetcher>
      </ParentLayout>
    </SessionChecker>
  );
};

export default ActivityLog;
