"use client"; // Ensures client-side rendering

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/SessionChecker";
import UserFetcher from "../../../components/UserFetcher";

// Pages
import PedienteForm from "../../../components/Pediente/PedienteForm";
import PedienteTable from "../../../components/Pediente/PedienteTable";

// Toasts
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const PedientePage: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editPost, setEditPost] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(1000);

    // Fetch Data from the API
    const fetchDatabase = async () => {
        try {
            const response = await fetch("/api/Pediente/FetchPediente");
            const data = await response.json();
            console.log("Fetched Data: ", data); // Log the fetched data for debugging
            setPosts(data);
        } catch (error) {
            toast.error("Error fetching accounts.");
            console.error("Error fetching accounts:", error);
        }
    };

    useEffect(() => {
        fetchDatabase();
    }, []);

    const handleEdit = (post: any) => {
        setEditPost(post);
        setShowForm(true);
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const response = await fetch("/api/Pediente/UpdateStatus", {
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

    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4">
                            <div className="grid grid-cols-1 md:grid-cols-1">
                                {showForm ? (
                                    <PedienteForm
                                        onCancel={() => {
                                            setShowForm(false);
                                            setEditPost(null);
                                        }}
                                        refreshUser={fetchDatabase}
                                        userName={user ? user.userName : ""}
                                        Location={user ? user.Location : ""}
                                        editPost={editPost}
                                    />
                                ) : (
                                    <>
                                        <h2 className="text-lg font-bold mb-2">Pendiente Frozen</h2>
                                        <p className="text-sm text-gray-600 mb-4">
                                            The "Pendiente Frozen" section showcases items that are still pending or in process within the frozen goods inventory. These are products that have not yet been fully processed, shipped, or finalized for distribution. It allows users to track and manage the status of these frozen items, ensuring that everything is accounted for and ready for the next steps in the supply chain. Below is a detailed list of these frozen items that are awaiting finalization, categorized based on their location and role for better organization.
                                        </p>
                                        <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                            <PedienteTable
                                                posts={currentPosts} // Pass paginated posts here
                                                Role={user ? user.Role : ""}
                                                Location={user ? user.Location : ""}
                                                handleEdit={handleEdit}
                                                handleStatusUpdate={handleStatusUpdate}
                                            />
                                        </div>
                                    </>
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

export default PedientePage;
