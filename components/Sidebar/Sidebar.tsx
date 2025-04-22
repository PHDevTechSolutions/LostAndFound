"use client";

import React, { useState, useEffect } from "react";
import { RxCaretDown, RxCaretLeft } from "react-icons/rx";
import { FaRegCircle  } from "react-icons/fa";
import { HiHome, HiClipboardList, HiPlusCircle, HiUserGroup, HiChartBar, HiCog, HiOutlineClock, } from "react-icons/hi";
import { HiArchiveBox, HiTag } from "react-icons/hi2";

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
          Firstname: data.Firstname || "Leroux",
          Lastname: data.Lastname || "Xchire",
          Location: data.Location || "Metro Manila, Philippines",
          Role: data.Role || "Super Admin",
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
      title: "Report Lost Item",
      icon: HiPlusCircle,
      subItems: [
        { title: "Report Items", href: `/Report/ReportItems${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
    {
      title: "Report Found Item",
      icon: HiPlusCircle,
      subItems: [
        { title: "Report Found Items", href: `/Report/ReportFound${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
    {
      title: "All Reports",
      icon: HiClipboardList,
      subItems: [
        { title: "Lost & Found Items", href: `/Report/AllReport${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
    {
      title: "Approvals",
      icon: HiOutlineClock,
      subItems: [
        { title: "Approve/Pending Reports", href: `/Report/Approval${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
    {
      title: "Resolved Cases",
      icon: HiArchiveBox,
      subItems: [
        { title: "Returned/Found Items", href: `/Report/ResolvedCases${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
    {
      title: "Categories",
      icon: HiTag,
      subItems: [
        { title: "Manage Item Categories", href: `/Item/Categories${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
    {
      title: "User Management",
      icon: HiUserGroup,
      subItems: [
        {
          title: "List of Users", href: `/User/ListofUser${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
        },
      ],
    },
    {
      title: "Reports Analytics",
      icon: HiChartBar,
      subItems: [
        { title: "Graph and Charts", href: `/Report/ReportAnalytics${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
    {
      title: "Settings",
      icon: HiCog,
      subItems: [
        { title: "Update Profile", href: `/Setting/Profile${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
  ];

  // Filter menu items based on the user's role
  const filteredMenuItems = menuItems.filter((item) => {
    if (userDetails.Role === "Subscribers") {
      return item.title === "Report Lost Item" ||
      item.title === "Report Found Item" ||
      item.title === "My Reports" ||
      item.title === "Status Checker" ||
      item.title === "Settings";
    }

    if (userDetails.Role === "Admin") {
      return item.title === "All Reports" ||
      item.title === "Approvals" ||
      item.title === "Resolved Cases" ||
      item.title === "User Management" ||
      item.title === "Categories" ||
      item.title === "Reports Analysis" ||
      item.title === "Settings";
    }

    // Super Admin can see all items
    return true;
  });

  return (
    <div className="relative">
      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-y-0 left-0 z-50 h-screen bg-[#F1F5F9] text-[#334155] border-1  transition-all duration-300 flex flex-col ${
          collapsed ? "w-16" : "w-64"
        } ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <img src="/lostfound-logo.png" alt="Logo" className="h-8 mr-2" />
            <Link href={`/dashboard${userId ? `?id=${encodeURIComponent(userId)}` : ""}`}>
              <h1 className={`text-md font-bold transition-opacity ${collapsed ? "opacity-0" : "opacity-100"}`}>Lost & Found</h1>
            </Link>
          </div>
        </div>

        {/* User Details Section */}
        {!collapsed && (
          <div className="p-8 text-xs text-left border-r-2 shadow-md">
            <p className="font-bold uppercase">
            {userDetails.Lastname}, {userDetails.Firstname}
            </p>
            <p className="text-gray-600">( {userDetails.Role} )</p>
          </div>
        )}

        {/* Menu Section */}
        <div className="flex flex-col items-center rounded-md flex-grow overflow-y-auto text-xs p-2 border-r-2 shadow-md">
        <div className="w-full">
            {userDetails.Role !== "Subscribers" && (
              <Link href={`/dashboard${userId ? `?id=${encodeURIComponent(userId)}` : ''}`} className="flex w-full p-4 text-white mb-1 bg-[#10B981] rounded hover: rounded-md hover:text-white transition-all">
                <HiHome size={15} className="mr-1" />Dashboard
              </Link>
            )}
          </div>
          {filteredMenuItems.map((item, index) => (
            <div key={index} className="w-full">
              <button
                onClick={() => handleToggle(item.title)}
                className={`flex items-center w-full p-4 rounded-md transition-all hover:bg-[#2563EB] hover:text-white ${collapsed ? "justify-center" : ""}`}
              >
                <item.icon size={15} />
                {!collapsed && <span className="ml-2">{item.title}</span>}
                {!collapsed && (
                  <span className="ml-auto">
                    {openSections[item.title] ? <RxCaretDown size={15} /> : <RxCaretLeft size={15} />}
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
                        className="flex items-center w-full p-4 hover:rounded-md hover:bg-[#2563EB] hover:text-white transition-all"
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
