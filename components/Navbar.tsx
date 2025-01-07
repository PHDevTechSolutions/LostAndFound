"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get email from query parameters using URLSearchParams
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");

    if (email) {
      // Fetch user data from the server using the query parameter
      fetch(`/api/user?email=${encodeURIComponent(email)}`)
        .then(response => response.json())
        .then(data => setUserName(data.name))
        .catch(error => console.error("Error fetching user data:", error));
    }
  }, []);

  const handleLogout = async () => {
    // Clear any authentication tokens or session data
    await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Redirect to the login page
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center p-4 m-2 bg-gray-800 text-white rounded">
      <h1 className="text-xl">Dashboard</h1>
      <div className="flex items-center">
        <span className="mr-4">Hello, {userName}</span>
        <button
          className="bg-red-500 px-4 py-2 rounded"
          onClick={() => setShowLogoutModal(true)}
        >
          Logout
        </button>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center text-gray-800">
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded text-gray-800"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 px-4 py-2 text-white rounded"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
