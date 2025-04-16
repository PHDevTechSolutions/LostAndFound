"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/SessionChecker";
import UserFetcher from "../../../components/UserFetcher";

// Pages
import AddAccountForm from "../../../components/CompanyAssets/ProfitLoss/AddProfitLossForm";
import SearchFilters from "../../../components/CompanyAssets/Production/SearchFilters";
import ContainerTable from "../../../components/CompanyAssets/ProfitLoss/ProfitLossTable";

// Toasts
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { HiMiniPlus } from "react-icons/hi2";

const ContainerList: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLocation, setSelectedLocation] = useState<string>("");

    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
        start: "",
        end: "",
    });

    const [userDetails, setUserDetails] = useState({
        UserId: "", Firstname: "", Lastname: "", Email: "", Role: "", Location: "",
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    // Fetch Data from the API
    const fetchDatabase = async () => {
        try {
            const response = await fetch("/api/CompanyAssets/ProfitLoss/FetchRecord");
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            setError("Error fetching accounts.");
            toast.error("Error fetching accounts.");
            console.error("Error fetching accounts:", error);
        }
    };

    useEffect(() => {
        fetchDatabase();
    }, []);

    // Fetch user data based on query parameters (user ID)
    useEffect(() => {
        const fetchUserData = async () => {
            const params = new URLSearchParams(window.location.search);
            const userId = params.get("id");

            if (userId) {
                try {
                    const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
                    if (!response.ok) throw new Error("Failed to fetch user data");
                    const data = await response.json();
                    setUserDetails({
                        UserId: data._id,
                        Firstname: data.Firstname || "",
                        Lastname: data.Lastname || "",
                        Email: data.Email || "",
                        Role: data.Role || "",
                        Location: data.Location || "",
                    });
                } catch (err) {
                    console.error("Error fetching user data:", err);
                    setError("Failed to load user data.");
                } finally {
                    setLoading(false);
                }
            } else {
                setError("User ID is missing.");
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Filter Data based on search term and city address
    const filteredAccounts = posts.filter((post) => {
        const inSearchTerm =
            post.ReferenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.ModeType.toLowerCase().includes(searchTerm.toLowerCase());

        const inLocation =
            !selectedLocation || post.Location.toLowerCase() === selectedLocation.toLowerCase();

        const DatePurchased = new Date(post.DatePurchased).getTime();
        const rangeStart = dateRange.start ? new Date(dateRange.start).getTime() : null;
        const rangeEnd = dateRange.end ? new Date(dateRange.end).getTime() : null;

        const inDateRange =
            (!rangeStart || DatePurchased >= rangeStart) &&
            (!rangeEnd || DatePurchased <= rangeEnd);

        return inSearchTerm && inLocation && inDateRange;
    });

    // Edit post function
    const handleEdit = (post: any) => {
        setEditData(post);
        setShowForm(true);
    };

    // Show delete modal
    const confirmDelete = (postId: string) => {
        setPostToDelete(postId);
        setShowDeleteModal(true);
    };

    // Delete post function
    const handleDelete = async () => {
        if (!postToDelete) return;
        try {
            const response = await fetch(`/api/CompanyAssets/ProfitLoss/DeleteRecord`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: postToDelete }),
            });

            if (response.ok) {
                setPosts(posts.filter((post) => post._id !== postToDelete));
                toast.success("Data deleted successfully.");
            } else {
                toast.error("Failed to delete data.");
            }
        } catch (error) {
            toast.error("Failed to delete data.");
            console.error("Error deleting data:", error);
        } finally {
            setShowDeleteModal(false);
            setPostToDelete(null);
        }
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4">
                            <div className="grid grid-cols-1 md:grid-cols-1">
                                {showForm ? (
                                    <AddAccountForm
                                        onCancel={() => {
                                            setShowForm(false);
                                            setEditData(null);
                                        }}
                                        refreshPosts={fetchDatabase}  // Pass the refreshPosts callback
                                        userName={user ? user.userName : ""}
                                        Location={user ? user.Location : ""}
                                        editData={editData}
                                    />
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-4">
                                            <button className="hover:bg-blue-900 bg-[#143c66] text-white px-4 text-xs py-2 rounded flex gap-1" onClick={() => setShowForm(true)}>
                                                <HiMiniPlus size={15} />Add Record
                                            </button>
                                        </div>
                                        <h2 className="text-lg font-bold mb-2">Profit & Loss</h2>
                                        <p className="text-sm text-gray-600 mb-4">
                                            The "Profit & Loss" section provides a detailed analysis of the company's financial performance, tracking profits and losses on a monthly and yearly basis. This section allows users to view how revenue and expenses fluctuate over time, providing insights into the financial health of the business. Additionally, it includes historical data to help users analyze trends, identify patterns, and make informed decisions for future financial planning. By tracking both short-term and long-term financial data, this feature ensures comprehensive visibility into the company’s profitability, supporting better decision-making and strategic planning.
                                        </p>

                                        <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                            <SearchFilters
                                                searchTerm={searchTerm}
                                                setSearchTerm={setSearchTerm}
                                                dateRange={dateRange}
                                                setDateRange={setDateRange}
                                            />
                                            <ContainerTable
                                                posts={filteredAccounts}
                                                handleEdit={handleEdit}
                                                handleDelete={confirmDelete}
                                                Role={user ? user.Role : ""}
                                                Location={user ? user.Location : ""}
                                            />
                                        </div>
                                    </>
                                )}

                                {showDeleteModal && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                        <div className="bg-white p-4 rounded shadow-lg">
                                            <h2 className="text-xs font-bold mb-4">Confirm Deletion</h2>
                                            <p className="text-xs">Are you sure you want to delete this account?</p>
                                            <div className="mt-4 flex justify-end">
                                                <button className="bg-red-500 text-white text-xs px-4 py-2 rounded mr-2" onClick={handleDelete}>Delete</button>
                                                <button className="bg-gray-300 text-xs px-4 py-2 rounded" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <ToastContainer className="text-xs" autoClose={1000} />
                            </div>
                        </div>
                    )}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default ContainerList;
