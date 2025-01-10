"use client";

import React, { useState, useEffect } from "react";
import { FaBlog, PiBlueprintFill } from "./Sidebar/icons"; 
import { FaBuildingUser } from "react-icons/fa6";
import { FaHeadphonesSimple } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";

import Link from 'next/link';
import { useRouter } from "next/navigation";

const Sidebar: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<any>({});
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUserId(params.get("id"));
  }, []);

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
      title: 'Blogs',
      icon: FaBlog,
      subItems: [
        { title: 'All Blogs', href: `/blogs/all${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Categories', href: `/blogs/categories${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Tags', href: `/blogs/tags${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Client Accounts',
      icon: FaBuildingUser ,
      subItems: [
        { title: 'List of Accounts', href: `/accounts/AccountList${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Call Monitoring',
      icon: FaHeadphonesSimple,
      subItems: [
        { title: 'Tickets', href: `/monitoring/Activities${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Settings',
      icon: IoMdSettings,
      subItems: [
        { title: 'Create User', href: `/setting/CreateUser${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 h-screen bg-gray-800 text-white transition-all duration-300 flex flex-col ${collapsed ? "w-16" : "w-64"} ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <img src="/react.svg" alt="Logo" className="h-8 mr-2"/>
          <Link href={`/dashboard${userId ? `?id=${encodeURIComponent(userId)}` : ''}`}>
            <h1 className={`text-md font-bold transition-opacity ${collapsed ? "opacity-0" : "opacity-100"}`}>
              Eco-React
            </h1>
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center flex-grow overflow-y-auto text-xs">
        {menuItems.map((item, index) => (
          <div key={index} className="w-full">
            <button
              onClick={() => handleToggle(item.title)}
              className={`flex items-center w-full p-4 hover:bg-gray-700 ${collapsed ? "justify-center" : ""}`}
            >
              <item.icon size={18} />
              {!collapsed && <span className="ml-2">{item.title}</span>}
            </button>
            {openSections[item.title] && !collapsed && (
              <div className="ml-8 space-y-2">
                {item.subItems.map((subItem, subIndex) => (
                  <Link key={subIndex} href={subItem.href} prefetch={true} className="block hover:bg-gray-700 p-2 rounded-md">
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
