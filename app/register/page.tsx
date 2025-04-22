"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

const Register: React.FC = () => {
  const [userName, setuserName] = useState("");
  const [Email, setEmail] = useState("");
  const [Firstname, setFirstname] = useState("");
  const [Lastname, setLastname] = useState("");
  const [Password, setPassword] = useState("");
  const router = useRouter();

  const Role = "Subscribers"; // Hidden default role

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || !Email || !Password || !Firstname || !Lastname) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, Email, Password, Firstname, Lastname, Role }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Registration successful!");
        setTimeout(() => {
          router.push("/login");
        }, 1200);
      } else {
        toast.error(result.message || "Registration failed!");
      }
    } catch (error) {
      toast.error("An error occurred while registering!");
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
          <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Username</label>
              <input type="text" value={userName} onChange={(e) => setuserName(e.target.value)} className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize" placeholder="Enter your Username" />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Firstname</label>
              <input type="text" value={Firstname} onChange={(e) => setFirstname(e.target.value)} className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize" placeholder="Enter your Firstname" />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Lastname</label>
              <input type="text" value={Lastname} onChange={(e) => setLastname(e.target.value)} className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize" placeholder="Enter your Lastname" />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={Email} onChange={(e) => setEmail(e.target.value)} className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your Email" />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <input type="password" placeholder="6+ Characters, 1 Capital letter" value={Password} onChange={(e) => setPassword(e.target.value)} className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mb-4">
              <button type="submit" className="w-full text-xs py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 shadow-lg">Create Account</button>
            </div>
          </form>
          <div className="text-center text-xs">
            Don’t have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">Sign In</Link>
          </div>
          <footer className="absolute bottom-4 right-4 text-xs text-gray-600">
            <p>Lost and Found Software - PHDev-Tech Solutions</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Register;
