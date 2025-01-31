"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/SessionChecker";
import UserFetcher from "../../../components/UserFetcher";

// Pages
import SearchFilters from "../../../components/Pediente/SearchFilters";
import PedienteTable from "../../../components/Pediente/PedienteTable";
import Pagination from "../../../components/Pediente/Pagination";

// Toasts
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
            const response = await fetch("/api/Pediente/FetchPediente");
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


    // Filter Data based on search term and city address
    const filteredAccounts = posts.filter((post) => {
        const inSearchTerm =
            post.ContainerNo.toUpperCase().includes(searchTerm.toUpperCase()) ||
            post.BuyersName.toUpperCase().includes(searchTerm.toUpperCase()) ||
            post.PlaceSales.toLowerCase().includes(searchTerm.toLowerCase());

        const dateArrive = new Date(post.DateOrder).getTime();
        const dateSoldout = new Date(post.DateOrder).getTime();
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
                                <>
                                    <h2 className="text-lg font-bold mb-2">Pediente</h2>
                                    <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                        <SearchFilters
                                            searchTerm={searchTerm}
                                            setSearchTerm={setSearchTerm}
                                            postsPerPage={postsPerPage}
                                            setPostsPerPage={setPostsPerPage}
                                            dateRange={dateRange}
                                            setDateRange={setDateRange}
                                        />
                                        <PedienteTable
                                            posts={currentPosts}
                                            handleEdit={handleEdit}
                                            handleDelete={confirmDelete}
                                            handleCreateData={handleCreateData}
                                            Role={user ? user.Role : ""}
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
                            </div>
                        </div>
                    )}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default ContainerList;
