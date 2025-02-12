"use client";

import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/SessionChecker";
import UserFetcher from "../../../components/UserFetcher";

// Pages
import PedienteForm from "../../../components/PedienteManual/PedienteForm";
import SearchFilters from "../../../components/PedienteManual/SearchFilters";
import PedienteTable from "../../../components/PedienteManual/PedienteTable";
import Pagination from "../../../components/Pediente/Pagination";

// Toasts
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const PedientePage: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editPost, setEditPost] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [startDate, setStartDate] = useState("");  // Start date for filtering
    const [endDate, setEndDate] = useState("");  // End date for filtering

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(1000);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [postForCreate, setPostForCreate] = useState<any>(null);

    // Fetch Data from the API
    const fetchDatabase = async () => {
        try {
            const response = await fetch("/api/PedienteManual/FetchPediente");
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
    
        const postDate = new Date(post.DatePediente).toISOString().split("T")[0]; // Convert to YYYY-MM-DD
    
        const isDateInRange =
            (!startDate || postDate >= startDate) &&
            (!endDate || postDate <= endDate);
    
        return inSearchTerm && isDateInRange;
    });
    

    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredAccounts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredAccounts.length / postsPerPage);

    // Edit post function
    const handleEdit = (post: any) => {
        setEditPost(post);
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
            const response = await fetch(`/api/PedienteManual/DeletePediente`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: postToDelete }),
            });

            if (response.ok) {
                setPosts(posts.filter((post) => post._id !== postToDelete));
                toast.success("Account deleted successfully.");
            } else {
                toast.error("Failed to delete account.");
            }
        } catch (error) {
            toast.error("Failed to delete account.");
            console.error("Error deleting account:", error);
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


    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Frozen Pendiente");
    
        // Add headers to the worksheet
        worksheet.columns = [
            { header: "Date Order", key: "DateOrder" },
            { header: "Buyers Name", key: "BuyersName" },
            { header: "Place Sales", key: "PlaceSales" },
            { header: "Container Number", key: "ContainerNo" },
            { header: "Commmodity", key: "Commodity" },
            { header: "Size", key: "Size" },
            { header: "Box Sales", key: "BoxSales" },
            { header: "Price", key: "Price" },
            { header: "Pay Amount", key: "PayAmount" },
            { header: "Status", key: "Status" }
        ];

        // Filter data to include only records with "PO Received" remarks
        const filteredData = filteredAccounts.filter(post => post.PaymentMode === "PDC");
    
        // Add data to the worksheet
        filteredData.forEach((post) => {
            worksheet.addRow({
                DateOrder: new Date(post.DateOrder).toLocaleString(), // Format the date as needed
                BuyersName: post.BuyersName,
                PlaceSales: post.PlaceSales,
                ContainerNo: post.ContainerNo,
                Commodity: post.Commodity,
                Size: post.Size,
                BoxSales: post.BoxSales,
                Price: post.Price,
                PayAmount: post.PayAmount,
                Status: post.Status,
                PaymentMode: post.PaymentMode
            });
        });
    
        // Create the Excel file and trigger the download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        saveAs(blob, "frozen_pediente.xlsx");
    };

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
                                        <div className="flex justify-between items-center mb-4">
                                            <button className="bg-blue-800 text-white px-4 text-xs py-2 rounded" onClick={() => setShowForm(true)}>
                                                Add Balance
                                            </button>
                                            <button onClick={exportToExcel} className="mb-4 px-4 py-2 bg-green-700 text-white text-xs rounded">Export to Excel</button>
                                        </div>
                                        <h2 className="text-lg font-bold mb-2">Pendiente Frozen</h2>
                                        <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                            <SearchFilters
                                                searchTerm={searchTerm}
                                                setSearchTerm={setSearchTerm}
                                                postsPerPage={postsPerPage}
                                                setPostsPerPage={setPostsPerPage}
                                                startDate={startDate}
                                                setStartDate={setStartDate}
                                                endDate={endDate}
                                                setEndDate={setEndDate}
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

export default PedientePage;
