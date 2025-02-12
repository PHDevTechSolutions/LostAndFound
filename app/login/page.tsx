"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

const Login: React.FC = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!Email || !Password) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email, Password }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Login successful!");
        setTimeout(() => {
          router.push(`/dashboard?id=${encodeURIComponent(result.userId)}`);
        }, 1500);
      } else {
        toast.error(result.message || "Login failed!");
      }
    } catch (error) {
      toast.error("An error occurred while logging in!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center relative p-4"
      style={{ backgroundImage: "url('/shipping.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <ToastContainer className="text-xs" />
      <div className="relative z-10 w-full max-w-md p-8 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-xl text-center">
      <Image src="/jjventure.png" alt="JJ Venture Logo" width={100} height={100} className="mx-auto mb-4 bg-gray-100 rounded-full shadow-xl"/>

        <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-4">
            <label className="block text-xs font-medium text-white mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-white mb-1">Password</label>
            <input
              type="password"
              placeholder="6+ Characters, 1 Capital letter"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full text-xs py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 shadow-lg"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
        <div className="text-center text-xs text-white">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-300 hover:underline">
            Sign Up
          </Link>
        </div>
        <footer className="mt-4 text-center text-xs text-white">
          <p>JJ Venture Sources, Inc 2025 - PHDev-Tech Solutions</p>
        </footer>
      </div>
    </div>
  );
};

export default Login;