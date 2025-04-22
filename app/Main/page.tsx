"use client";

import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiLogIn } from "react-icons/fi";
import { FaSun, FaMoon, FaThList } from "react-icons/fa";
import { MdCategory } from "react-icons/md";

interface Post {
    _id: string;
    ReferenceNumber: string;
    ItemName: string;
    ItemQuantity: string;
    ItemDescription: string;
    ItemCategories: string;
    ContactNumber: string;
    RoomSection: string;
    Department: string;
    ItemStatus: string;
    ItemOwner: string;
    ItemProgress: string;
    DateLost: string;
    ItemImage: string;
}

const ReportItemCards: React.FC = () => {
    const [items, setItems] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Post | null>(null);

    const sidebarRef = useRef<HTMLDivElement>(null); // Sidebar ref
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
    const itemsPerPage = 12;

    const filteredItems = items.filter((item) => {
        const isNameMatch = item.ItemName.toLowerCase().includes(searchTerm.toLowerCase());
        const isReferenceNumberMatch = item.ReferenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const isCategoryMatch = selectedCategory ? item.ItemCategories === selectedCategory : true;
        const isDepartmentMatch = selectedDepartment ? item.Department === selectedDepartment : true;
        const isItemProgressApproved = item.ItemProgress === "Approve"; // Add this condition

        return (
            (isNameMatch || isReferenceNumberMatch) &&
            isCategoryMatch &&
            isDepartmentMatch &&
            isItemProgressApproved // Include this condition in the filter
        );
    });

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const currentItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/Report/ReportItems/FetchRecord");
                const result = await response.json();
                if (response.ok) {
                    setItems(result);
                } else {
                    toast.error(result.message || "Failed to fetch data.");
                }
            } catch (error) {
                toast.error("An error occurred while fetching the items.");
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setSidebarOpen(false);
            }
        };

        if (sidebarOpen) {
            document.addEventListener("click", handleClickOutside);
        } else {
            document.removeEventListener("click", handleClickOutside);
        }

        return () => document.removeEventListener("click", handleClickOutside); // Cleanup on unmount
    }, [sidebarOpen]);

    const uniqueCategories = Array.from(new Set(items.map((item) => item.ItemCategories)));
    const uniqueDepartments = Array.from(new Set(items.map((item) => item.Department)));

    const handleViewInformation = (item: Post) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedItem(null);
    };

    return (
        <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
            <ToastContainer className="text-xs" />

            {/* Navbar */}
            {/* Navbar */}
            <div className="flex justify-between items-center p-4 shadow sticky top-0 z-50 bg-white dark:bg-gray-800">
                <div className="flex gap-2 items-center">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-xl text-black">
                        <FaThList />
                    </button>
                    <input
                        type="text"
                        placeholder="Search item name or reference number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 rounded border text-xs w-48 md:w-64 dark:text-black"
                    />
                </div>

                <div className="flex gap-4 items-center">
                    <button onClick={() => setDarkMode(!darkMode)} className="text-xs text-black">
                        {darkMode ? <FaSun /> : <FaMoon />}
                    </button>
                    <a
                        href="/login"
                        className="bg-blue-600 text-xs hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                        <FiLogIn /> Login
                    </a>
                </div>
            </div>


            <div className="flex">
                {/* Sidebar */}
                <div
                    ref={sidebarRef}
                    className={`fixed top-0 left-0 z-50 w-52 min-h-screen bg-white dark:bg-gray-800 shadow p-4 transition-transform transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } sm:block`}
                >
                    <h2 className="font-semibold mb-4 flex items-center gap-2 text-black">
                        <MdCategory /> Categories
                    </h2>
                    <ul className="space-y-2 text-xs text-black capitalize">
                        <li
                            className={`hover:text-blue-600 cursor-pointer ${selectedCategory === null ? "text-blue-600" : ""}`}
                            onClick={() => setSelectedCategory(null)}
                        >
                            All Categories
                        </li>
                        {uniqueCategories.map((category) => (
                            <li
                                key={category}
                                className={`hover:text-blue-600 cursor-pointer ${selectedCategory === category ? "text-black" : ""}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </li>
                        ))}
                    </ul>

                    <h2 className="font-semibold mt-6 mb-4 flex items-center gap-2 text-black">Department</h2>
                    <ul className="space-y-2 text-xs text-black capitalize">
                        <li
                            className={`hover:text-blue-600 cursor-pointer ${selectedDepartment === null ? "text-blue-600" : ""}`}
                            onClick={() => setSelectedDepartment(null)}
                        >
                            All Departments
                        </li>
                        {uniqueDepartments.map((department) => (
                            <li
                                key={department}
                                className={`hover:text-blue-600 cursor-pointer ${selectedDepartment === department ? "text-blue-600" : ""}`}
                                onClick={() => setSelectedDepartment(department)}
                            >
                                {department}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Modal */}
                {modalOpen && selectedItem && (
                    <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-md font-semibold mb-4">Item Information</h2>
                            <div className="text-xs">
                                <p className="capitalize"><strong>Item Name:</strong> {selectedItem.ItemName}</p>
                                <p><strong>Reference Number:</strong> {selectedItem.ReferenceNumber}</p>
                                <p className="capitalize"><strong>Name of Owner:</strong> {selectedItem.ItemOwner}</p>
                                <p><strong>Contact Number:</strong> {selectedItem.ContactNumber}</p>
                                <p><strong>Category:</strong> {selectedItem.ItemCategories}</p>
                                <p><strong>Quantity:</strong> {selectedItem.ItemQuantity}</p>
                                <p><strong>Room/Section:</strong> {selectedItem.RoomSection}</p>
                                <p className="capitalize"><strong>Department:</strong> {selectedItem.Department}</p>
                                <p className="capitalize"><strong>Description:</strong> {selectedItem.ItemDescription}</p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="mt-4 bg-gray-200 shadow-md text-black px-3 py-2 rounded text-xs"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="flex-1 p-4 ml-0 sm:ml-52">
                    <h1 className="text-xl font-bold mb-4">Lost and Found Software</h1>
                    {loading ? (
                        <div className="text-xs">Loading items...</div>
                    ) : currentItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                            {currentItems.map((item) => (
                                <div key={item._id} className="bg-white dark:bg-gray-700 shadow-md text-black rounded-lg border hover:shadow-lg transition flex flex-col">
                                    {/* Card Image */}
                                    <img
                                        src={item.ItemImage}
                                        alt={item.ItemName}
                                        className="w-full h-auto object-cover rounded-t-lg"
                                    />

                                    {/* Card Header */}
                                    <div className="p-4">
                                        <h2 className="text-xs font-semibold text-blue-600">Ref #: {item.ReferenceNumber}</h2>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-4 mt-0 flex-1">
                                        <p className="capitalize"><strong>Item Name:</strong> {item.ItemName}</p>
                                        <p><strong>Contact #:</strong> {item.ContactNumber}</p>
                                        <p><strong>Category:</strong> {item.ItemCategories}</p>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="p-4 flex justify-between items-center">
                                        <p><strong>Date of Lost:</strong> {item.DateLost}</p>
                                        <button
                                            onClick={() => handleViewInformation(item)}
                                            className="bg-blue-600 text-white text-xs px-4 py-2 rounded"
                                        >
                                            View Information
                                        </button>
                                    </div>
                                </div>

                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 mt-10 text-xs">No records found.</div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6 gap-2">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    className={`px-3 py-1 rounded text-sm border ${currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <footer className="bg-gray-800 text-white p-4 text-xs text-center">
                Lost and Found Software 2025 | PHDevtech Solutions - Leroux Y Xchire
            </footer>
        </div>
    );
};

export default ReportItemCards;
