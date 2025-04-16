"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/SessionChecker";
import UserFetcher from "../../../components/UserFetcher";

// Pages
import AddAccountForm from "../../../components/CompanyAssets/Container/AddContainerForm";
import ContainerTable from "../../../components/CompanyAssets/Sales/ContainerTable";

// Toasts
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch Data from the API
    const fetchDatabase = async () => {
        try {
            const response = await fetch("/api/CompanyAssets/Sales/FetchContainer");
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
            post.ContainerNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.SupplierName.toLowerCase().includes(searchTerm.toLowerCase());

        const inLocation =
            !selectedLocation || post.Location.toLowerCase() === selectedLocation.toLowerCase();

        const DateArrived = new Date(post.DateArrived).getTime();
        const rangeStart = dateRange.start ? new Date(dateRange.start).getTime() : null;
        const rangeEnd = dateRange.end ? new Date(dateRange.end).getTime() : null;

        const inDateRange =
            (!rangeStart || DateArrived >= rangeStart) &&
            (!rangeEnd || DateArrived <= rangeEnd);

        return inSearchTerm && inLocation && inDateRange;
    });

    // Edit post function
    const handleEdit = (post: any) => {
        setEditData(post);
        setShowForm(true);
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4">
                            <div className="grid grid-cols-1 md:grid-cols-1">
                                <>
                                    <h2 className="text-lg font-bold mb-2">Sales</h2>
                                    <p className="text-sm text-gray-600 mb-4">
                                        The "Sales" section provides a comprehensive view of the company’s sales performance, tracking both monthly and yearly earnings. This section allows users to monitor the total sales revenue generated each month and year, offering valuable insights into business growth and performance trends. By analyzing the data, users can evaluate how sales fluctuate over time and identify peak periods. The section also aggregates total earnings, helping users understand the overall financial health of the business. With this feature, users can make data-driven decisions to optimize sales strategies and enhance profitability.
                                    </p>

                                    <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                        <ContainerTable
                                            posts={filteredAccounts}  // Show all filtered posts without pagination
                                            handleEdit={handleEdit}
                                            Role={user ? user.Role : ""}
                                            Location={user ? user.Location : ""}
                                        />
                                    </div>
                                </>
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
