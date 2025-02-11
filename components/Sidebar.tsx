"use client";

import React, { useState, useEffect } from "react";
import { PiShippingContainer, PiWarehouse } from "react-icons/pi";
import { FaUsersGear, FaPlus, FaMinus } from "react-icons/fa6";
import { IoCogSharp } from "react-icons/io5";
import { FaRegCircle } from "react-icons/fa";
import { MdOutlineSpaceDashboard } from "react-icons/md";


import Link from "next/link";
import { useRouter } from "next/navigation";

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose, }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState({Firstname: "", Lastname: "", Location: "", Role: "",});
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUserId(params.get("id"));
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
        if (!response.ok) throw new Error("Failed to fetch user details");

        const data = await response.json();
        setUserDetails({
          Firstname: data.Firstname || "JJ Venture",
          Lastname: data.Lastname || "Sources Inc",
          Location: data.Location || "",
          Role: data.Role || "",
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleToggle = (section: string) => {
    setOpenSections((prevSections: any) => ({
      ...prevSections,
      [section]: !prevSections[section],
    }));
  };

  const menuItems = [
    {
      title: "Containers",
      icon: PiShippingContainer,
      subItems: [
        {
          title: "List of Containers",
          href: `/Container/ContainerList${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
        },
        {
          title: "Activity Logs",
          href: `/Container/ActivityLog${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
        },
        {
          title: "Pendiente",
          href: `/Container/PedienteManual${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
        },
      ],
    },
    {
      title: "Users",
      icon: FaUsersGear,
      subItems: [
        {
          title: "List of Users",
          href: `/User/ListofUser${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
        },
      ],
    },
    {
      title: "Settings",
      icon: IoCogSharp,
      subItems: [
        {
          title: "Update Profile",
          href: `/Setting/Profile${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
        },
      ],
    },
  ];

  // Filter menu items based on the user's role
  const filteredMenuItems = menuItems.filter((item) => {
    if (userDetails.Role === "Staff") {
      // Staff can only see Containers and Settings
      return item.title === "Containers" || item.title === "Settings";
    }
    // Admin and Super Admin can see all items
    return true;
  });

  return (
    <div className="relative">
      {/* Sidebar Overlay */}
  
      <div
        className={`fixed inset-y-0 left-0 z-50 h-screen bg-gray-100 text-dark border-1 shadow transition-all duration-300 flex flex-col ${
          collapsed ? "w-16" : "w-64"
        } ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border">
          <div className="flex items-center">
            <img src="/jjv.png" alt="Logo" className="h-8 mr-2" />
            <Link
              href={`/dashboard${userId ? `?id=${encodeURIComponent(userId)}` : ""}`}
            >
              <h1
                className={`text-md font-bold transition-opacity ${collapsed ? "opacity-0" : "opacity-100"}`}
              >
                JJ Venture Sources, Inc
              </h1>
            </Link>
          </div>
        </div>

        {/* User Details Section */}
        {!collapsed && (
          <div className="p-8 text-xs text-left border-b">
            <p className="font-bold uppercase">
            {userDetails.Lastname}, {userDetails.Firstname}
            </p>
            <p className="text-gray-600">{userDetails.Location}</p>
            <p className="text-gray-600">( {userDetails.Role} )</p>
          </div>
        )}

        {/* Menu Section */}
        <div className="flex flex-col items-center rounded-md flex-grow overflow-y-auto text-xs p-2">
        <div className="w-full">
          <Link href={`/dashboard${userId ? `?id=${encodeURIComponent(userId)}` : ''}`} className="flex items-center w-full p-4 hover:bg-gray-700 rounded hover: rounded-md hover:text-white transition-all"><MdOutlineSpaceDashboard size={22} className="mr-1"/>Dashboard</Link>
        </div>
          {filteredMenuItems.map((item, index) => (
            <div key={index} className="w-full">
              <button
                onClick={() => handleToggle(item.title)}
                className={`flex items-center w-full p-4 hover:rounded-md hover:bg-gray-700 hover:text-white transition-all ${collapsed ? "justify-center" : ""}`}
              >
                <item.icon size={18} />
                {!collapsed && <span className="ml-2">{item.title}</span>}
                {!collapsed && (
                  <span className="ml-auto">
                    {openSections[item.title] ? <FaMinus size={10} /> : <FaPlus size={10} />}
                  </span>
                )}
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openSections[item.title] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {openSections[item.title] && !collapsed && (
                  <div> {/* Added margin-left for submenu spacing */}
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        prefetch={true}
                        className="flex items-center w-full p-4 hover:rounded-md hover:bg-gray-700 hover:text-white transition-all"
                      >
                        {/* Adding small circle icon for each submenu item */}
                        <FaRegCircle size={10} className="mr-2 ml-2" />
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
