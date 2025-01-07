"use client";

import React, { useState } from "react";
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from 'react-icons/io';
import { FaBlog, FaBriefcase, FaCameraRetro, FaShopify, FaPhoneAlt, FaUserAlt, FaTools } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { PiBlueprintFill } from "react-icons/pi";
import { FaBoxArchive } from "react-icons/fa6";
import { SiGoogleanalytics } from "react-icons/si";
import { IoSettings } from "react-icons/io5";
import Link from 'next/link';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<any>({});

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
        { title: 'All Blogs', href: '/blogs/all' },
        { title: 'Categories', href: '/blogs/categories' },
        { title: 'Tags', href: '/blogs/tags' },
      ],
    },
    {
      title: 'Projects',
      icon: PiBlueprintFill,
      subItems: [
        { title: 'All Projects', href: '/projects/all' },
        { title: 'Categories', href: '/projects/categories' },
      ],
    },
    {
      title: 'Job Opening',
      icon: FaBriefcase,
      subItems: [
        { title: 'Job Opening', href: '/job-opening' },
        { title: 'Add New Job', href: '/job-opening/new' },
        { title: 'Applications/Applicants', href: '/job-opening/applicants' },
        { title: 'Settings', href: '/job-opening/settings' },
      ],
    },
    {
      title: 'Media',
      icon: FaCameraRetro,
      subItems: [
        { title: 'Library', href: '/media/library' },
      ],
    },
    {
      title: 'Shop',
      icon: FaShopify,
      subItems: [
        { title: 'Orders', href: '/shop/orders' },
        { title: 'Customers', href: '/shop/customers' },
        { title: 'Carts', href: '/shop/carts' },
        { title: 'Reports', href: '/shop/reports' },
        { title: 'Settings', href: '/shop/settings' },
      ],
    },
    {
      title: 'Products',
      icon: FaBoxArchive,
      subItems: [
        { title: 'All Products', href: '/products/all' },
        { title: 'Categories', href: '/products/categories' },
        { title: 'Tags', href: '/products/tags' },
        { title: 'Attributes', href: '/products/attributes' },
        { title: 'Reviews', href: '/products/reviews' },
      ],
    },
    {
      title: 'Analytics',
      icon: SiGoogleanalytics,
      subItems: [
        { title: 'Overview', href: '/analytics/overview' },
        { title: 'Products', href: '/analytics/products' },
        { title: 'Orders', href: '/analytics/orders' },
      ],
    },
    {
      title: 'Email & Contacts',
      icon: FaPhoneAlt,
      subItems: [
        { title: 'Submissions', href: '/email-contacts/submissions' },
        { title: 'Settings', href: '/email-contacts/settings' },
        { title: 'Tools', href: '/email-contacts/tools' },
        { title: 'SMTP', href: '/email-contacts/smtp' },
      ],
    },
    {
      title: 'Users',
      icon: FaUserAlt,
      subItems: [
        { title: 'All Users', href: '/users/all' },
        { title: 'Find Spam Users', href: '/users/find-spam' },
      ],
    },
    {
      title: 'Tools',
      icon: FaTools,
      subItems: [
        { title: 'Import Data', href: '/tools/import' },
        { title: 'Export Data', href: '/tools/export' },
      ],
    },
    {
      title: 'Settings',
      icon: IoSettings,
      subItems: [
        { title: 'General', href: '/settings/general' },
        { title: 'Permalinks', href: '/settings/permalinks' },
        { title: 'Privacy', href: '/settings/privacy' },
      ],
    },
  ];

  return (
    <div className={`h-screen bg-gray-800 text-white transition-all duration-300 ${collapsed ? "w-16" : "w-64"} flex flex-col justify-between`}>
      <div className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <img src="/react.svg" alt="Logo" className="h-8 mr-2"/>
        <h1 className={`text-xl font-bold transition-opacity ${collapsed ? "opacity-0" : "opacity-100"}`}>
          Eco-React
        </h1>
        </div>
        <div onClick={toggleSidebar} className="flex items-center justify-center w-8 h-8 cursor-pointer">
          {collapsed ? <IoIosArrowDropleftCircle /> : <IoIosArrowDroprightCircle />}
        </div>
      </div>
      <div className="flex flex-col items-center flex-grow overflow-y-auto">
        {menuItems.map((item, index) => (
          <div key={index} className="w-full">
            <button
              onClick={() => handleToggle(item.title)}
              className={`flex items-center w-full p-4 hover:bg-gray-700 ${collapsed ? "justify-center" : ""}`}
            >
              <item.icon size={24} />
              {!collapsed && <span className="ml-2">{item.title}</span>}
            </button>
            {openSections[item.title] && !collapsed && (
              <div className="ml-8 space-y-2">
                {item.subItems.map((subItem, subIndex) => (
                  <Link key={subIndex} href={subItem.href} className="block hover:bg-gray-700 p-2 rounded-md">
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
