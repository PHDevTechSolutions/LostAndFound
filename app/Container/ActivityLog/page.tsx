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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Activity Logs</h2>

                {/* Date Range Filter and Pagination Controls */}
                <div className="flex space-x-4">
                  {/* Date Range Filter */}
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="p-2 border border-gray-300 rounded text-xs"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="p-2 border border-gray-300 rounded text-xs"
                    />
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 text-xs"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-xs text-gray-500">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 text-xs"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

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
