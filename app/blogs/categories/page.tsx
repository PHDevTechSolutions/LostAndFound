"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";

const CategoriesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    if (userId) {
      // Fetch user data using userId
      fetch(`/api/user?id=${encodeURIComponent(userId)}`)
        .then(response => response.json())
        .then(data => {
          setUserName(data.name);
          setUserEmail(data.email);
          setLoading(false); // Allow access if logged in
        })
        .catch(() => {
          router.push("/login"); // Redirect to login on error
        });
    } else {
      router.push("/login"); // Redirect to login if no userId
    }
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ParentLayout>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-bold mb-2">Hello, {userName}</h2>
            <p className="text-sm text-gray-700">Email: {userEmail}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-bold mb-2">Welcome to the Categories Page</h2>
            <p className="text-sm text-gray-700">Here you can find all blog categories.</p>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
};

export default CategoriesPage;
