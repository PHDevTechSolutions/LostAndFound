"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/SessionChecker";
import UserFetcher from "../../../components/UserFetcher";
import { HiMiniPlus } from "react-icons/hi2";


// Pages
import AddAccountForm from "../../../components/CompanyAssets/Container/AddContainerForm";
import ContainerTable from "../../../components/CompanyAssets/Container/ContainerTable";

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
            const response = await fetch("/api/CompanyAssets/Container/FetchContainer");
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
                                            <button className="bg-[#143c66] text-white px-4 text-xs py-2 rounded flex gap-1" onClick={() => setShowForm(true)}>
                                                <HiMiniPlus size={15} /> Add Record
                                            </button>
                                        </div>
                                        <h2 className="text-lg font-bold mb-2">Container JJV</h2>
                                        <p className="text-sm text-gray-600 mb-4">
                                            The "Container JJV" section tracks all expenses related to the purchase and acquisition of containers, providing a comprehensive breakdown of the costs involved. This includes not only the container's base price but also additional charges such as shipping fees, line handling costs, bank charges, and brokerage fees. By consolidating all these expenses in one place, this section ensures full transparency and helps users track the total investment required for each container. This detailed record allows for more accurate financial planning and cost analysis, ensuring that all associated costs are accounted for and managed effectively.
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
