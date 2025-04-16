"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/SessionChecker";
import UserFetcher from "../../../components/UserFetcher";

// Pages
import AddAccountForm from "../../../components/Container/AddContainerForm";
import CreateDataForm from "../../../components/Container/CreateDataForm";
import SearchFilters from "../../../components/Container/SearchFilters";
import ContainerTable from "../../../components/Container/ContainerTable";
import Pagination from "../../../components/Container/Pagination";

// Toasts
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { HiMiniPlus } from "react-icons/hi2";

const ContainerList: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
        start: "",
        end: "",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [postForCreate, setPostForCreate] = useState<any>(null);

    // Fetch Data from the API
    const fetchDatabase = async () => {
        try {
            const response = await fetch("/api/Container/FetchContainer");
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            toast.error("Error fetching accounts.");
            console.error("Error fetching accounts:", error);
        }
    };

    useEffect(() => {
        fetchDatabase();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const response = await fetch("/api/Container/UpdateStatus", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, Status: newStatus }),
            });

            if (response.ok) {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === id ? { ...post, Status: newStatus } : post
                    )
                );
                toast.success("Status updated successfully.");
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Failed to update status.");
            }
        } catch (error) {
            toast.error("Failed to update status.");
            console.error("Error updating status:", error);
        }
    };


    // Filter Data based on search term and city address
    const filteredAccounts = posts.filter((post) => {
        const inSearchTerm =
            post.SpsicNo.toUpperCase().includes(searchTerm.toUpperCase()) ||
            post.ContainerNo.toUpperCase().includes(searchTerm.toUpperCase()) ||
            post.SupplierName.toLowerCase().includes(searchTerm.toLowerCase());

        const dateArrive = new Date(post.DateArrived).getTime();
        const dateSoldout = new Date(post.DateSoldout).getTime();
        const rangeStart = dateRange.start ? new Date(dateRange.start).getTime() : null;
        const rangeEnd = dateRange.end ? new Date(dateRange.end).getTime() : null;

        const inDateRange =
            (!rangeStart || dateArrive >= rangeStart) &&
            (!rangeEnd || dateSoldout <= rangeEnd);

        return inSearchTerm && inDateRange;
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
            const response = await fetch(`/api/Container/DeleteContainer`, {
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

    const handleCreateData = (postId: string) => {
        const selectedPost = posts.find((post) => post._id === postId);
        setPostForCreate(selectedPost); // Pass the selected post details
        setShowCreateForm(true);
        setShowForm(false); // Ensure other forms are closed
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4">
                            <div className="grid grid-cols-1 md:grid-cols-1">
                                {showCreateForm ? (
                                    <CreateDataForm
                                        post={postForCreate} // Pass the selected post details
                                        onCancel={() => setShowCreateForm(false)} // Close the form
                                    />
                                ) : showForm ? (
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
                                            <button className="bg-[#143c66] text-white px-4 text-xs py-2 rounded flex gap-1" onClick={() => setShowForm(true)}>
                                                <HiMiniPlus size={15} /> Add Fishing Container
                                            </button>
                                        </div>
                                        <h2 className="text-lg font-bold mb-2">List of Containers</h2>
                                        <p className="text-sm text-gray-600 mb-4">
                                            These containers serve as secure and temperature-controlled storage units for both fresh and frozen fish products. Each container is carefully monitored to ensure proper preservation of the seafood during handling, transport, and storage. Whether it's freshly caught fish or frozen stock, these fishing containers are essential for maintaining quality and safety from the sea to distribution points.
                                        </p>
                                        <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                            <SearchFilters
                                                searchTerm={searchTerm}
                                                setSearchTerm={setSearchTerm}
                                                postsPerPage={postsPerPage}
                                                setPostsPerPage={setPostsPerPage}
                                                dateRange={dateRange}
                                                setDateRange={setDateRange}
                                            />
                                            <ContainerTable
                                                posts={currentPosts}
                                                handleEdit={handleEdit}
                                                handleDelete={confirmDelete}
                                                handleStatusUpdate={handleStatusUpdate}
                                                handleCreateData={handleCreateData}
                                                Role={user ? user.Role : ""}
                                                Location={user ? user.Location : ""}
                                            />

                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                setCurrentPage={setCurrentPage}
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

export default ContainerList;
