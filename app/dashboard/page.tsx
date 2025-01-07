"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for an active session
    fetch("/api/session")
      .then(response => response.json())
      .then(data => {
        if (!data.isLoggedIn) {
          router.push("/login"); // Redirect to login if not logged in
        } else {
          setLoading(false); // Allow access if logged in
        }
      })
      .catch(() => {
        router.push("/login"); // Redirect to login on error
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-4">
          <h1 className="text-3xl font-bold text-center mb-4">Dashboard</h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
