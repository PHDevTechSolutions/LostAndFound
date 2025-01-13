"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("All fields are required!"); // Show error toast if fields are empty
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Registration successful!"); // Show success toast
        setTimeout(() => { 
            router.push("/login"); 
        }, 1200); // 1.5 seconds delay
      } else {
        toast.error(result.message || "Registration failed!"); // Show error toast
      }
    } catch (error) {
      toast.error("An error occurred while registering!"); // Show general error toast
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <ToastContainer className="text-xs"/>
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-md">
        <div className="hidden md:block md:w-1/2 p-8">
          <Image src="/images/illustration/illustration.svg" alt="Illustration" width={350} height={350} className="object-cover h-full w-full rounded-l-lg" />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Sign Up to JJ-Venture</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your name" />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your email" />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <input type="password" placeholder="6+ Characters, 1 Capital letter" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mb-4">
              <button type="submit" className="w-full text-xs py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 shadow-lg">Create Account</button>
            </div>
          </form>
          <div className="flex justify-center mb-4">
            <button className="w-full py-3 bg-red-700 text-xs text-white font-medium rounded-md hover:bg-red-800 shadow-lg flex items-center justify-center">
              <FcGoogle className="mr-2" /> Sign in with Google
            </button>
          </div>
          <div className="text-center text-xs">
            Don’t have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
