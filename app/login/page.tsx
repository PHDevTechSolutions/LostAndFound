//app/login/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required!"); // Show error toast if fields are empty
      return;
    }

    setLoading(true); // Set loading state

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Login successful!"); // Show success toast
        // Delay the redirect to allow the toast to be displayed
        setTimeout(() => {
          router.push(`/dashboard?id=${encodeURIComponent(result.userId)}`);
        }, 1500); // 1.5 seconds delay
      } else {
        toast.error(result.message || "Login failed!"); // Show error toast
      }
    } catch (error) {
      toast.error("An error occurred while logging in!"); // Show general error toast
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <ToastContainer className="text-xs" />
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-md">
        <div className="hidden md:block md:w-1/2 p-8">
          <Image src="/images/illustration/illustration.svg" alt="Illustration" width={350} height={350} className="object-cover h-full w-full rounded-l-lg" />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Sign In to JJ-Venture</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="6+ Characters, 1 Capital letter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <button type="submit" className="w-full text-xs py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 shadow-lg" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>
          <div className="flex justify-center mb-4">
            <button className="w-full py-3 bg-gray-200 text-xs text-dark font-medium rounded-md hover:bg-gray-100 shadow-lg flex items-center justify-center" disabled={loading}>
              <FcGoogle className="mr-2" /> Sign in with Google
            </button>
          </div>
          <div className="text-center text-xs">
            Don’t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">Sign Up</Link>
          </div>
          <footer className="absolute bottom-4 right-4 text-xs text-gray-600">
          <p>JJ Venture Sources, Inc 2025 - PHDev-Tech Solutions</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;

