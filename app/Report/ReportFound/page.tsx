"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/UserFetcher/UserFetcher";

// Pages
import AddAccountForm from "../../../components/Report/ReportFound/ReportFoundForm";
import Table from "../../../components/Report/ReportFound/ReportFoundItemTable";
import SearchFilters from "../../../components/Report/ReportFound/SearchFilters";

// Toasts
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { HiMiniPlus } from "react-icons/hi2";

const ReportItem: React.FC = () => {
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
        UserId: "", Firstname: "", Lastname: "", Email: "", Role: "", Location: "", userName: "", ItemFinder: "",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    // Fetch Data from the API
    const fetchDatabase = async () => {
        try {
            const response = await fetch("/api/Report/ReportFound/FetchRecord");
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
                        userName: data.userName || "",
                        ItemFinder: `${data.Firstname} ${data.Lastname}`
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

    const filteredAccounts = posts.filter((post) => {
        // Check if either the Email or Username matches
        const isUserEmailMatch = post.Email === userDetails.Email;
        const isUserUserNameMatch = post.ItemFinder === userDetails.ItemFinder;
    
        // Combine the email or username condition with OR (||)
        const isUserMatch = isUserEmailMatch || isUserUserNameMatch;
    
        // Search term filter
        const inSearchTerm =
            post.ItemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.ReferenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
        // Date range filter
        const DateLost = new Date(post.DateLost).getTime();
        const rangeStart = dateRange.start ? new Date(dateRange.start).getTime() : null;
        const rangeEnd = dateRange.end ? new Date(dateRange.end).getTime() : null;
    
        const inDateRange =
            (!rangeStart || DateLost >= rangeStart) &&
            (!rangeEnd || DateLost <= rangeEnd);
    
        // Final combined condition (OR condition for email or username)
        return isUserMatch && inSearchTerm && inDateRange;
    });
    
    

    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredAccounts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredAccounts.length / postsPerPage);

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
            const response = await fetch(`/api/Report/ReportFound/DeleteRecord`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: postToDelete }),
            });

            if (response.ok) {
                setPosts(posts.filter((post) => post._id !== postToDelete));
                toast.success("Report Item Deleted Successfully.");
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
                                        ItemFinder={userDetails.ItemFinder}
                                        editData={editData}
                                    />
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-4">
                                            <button className="bg-[#2563EB] text-white px-4 text-xs py-2 rounded flex gap-1" onClick={() => setShowForm(true)}>
                                                <HiMiniPlus size={15} />Add/Report Found Item
                                            </button>
                                        </div>
                                        <h2 className="text-lg font-bold mb-2">School Found Items</h2>
                                        <p className="text-sm text-gray-600 mb-4">
                                            The "School Found Items" section serves as a centralized list of belongings that have been reported or submitted as found within the school premises. It allows users to easily view, track, and identify lost items, promoting their timely return to rightful owners. This feature helps maintain order and accountability by documenting essential details such as item names, owners (if known), and associated reference numbers. By keeping a clear and accessible record of found items, the system supports responsible handling and efficient retrieval of lost property.
                                        </p>

                                        <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                            <SearchFilters
                                                searchTerm={searchTerm}
                                                setSearchTerm={setSearchTerm}
                                                postsPerPage={postsPerPage}
                                                setPostsPerPage={setPostsPerPage}
                                            />
                                            <Table
                                                posts={currentPosts}
                                                handleEdit={handleEdit}
                                                handleDelete={confirmDelete}
                                                Role={user ? user.Role : ""}
                                                Location={user ? user.Location : ""}
                                            />

                                            <div className="text-xs mt-2">
                                                Showing {indexOfFirstPost + 1} to {Math.min(indexOfLastPost, filteredAccounts.length)} of {filteredAccounts.length} entries
                                            </div>
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

export default ReportItem;
