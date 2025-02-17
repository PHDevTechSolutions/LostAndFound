import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { BsThreeDotsVertical } from "react-icons/bs";

const socket = io("http://localhost:3001");

interface ContainerCardsProps {
    posts: Post[];
    handleEdit: (post: Post) => void;
    handleDelete: (postId: string) => void;
    handleCreateData: (postId: string) => void;
    Role: string;
    Location: string;
}

interface Post {
    _id: string;
    SpsicNo: string;
    DateArrived: string;
    DateSoldout: string;
    SupplierName: string;
    ContainerNo: string;
    ContainerType: string;
    Commodity: string;
    TotalQuantity: number;
    Boxes: number;
    BoxType: string;
    Size: string;
    Status: string;
    Remaining: number;
    Country: number;
    Freezing: number;
    Location: string;
    PlaceSales: string;
    GrossSales: number;
    ReferenceNumber: string;  // Assuming the reference number field
}

const ContainerCards: React.FC<ContainerCardsProps> = ({
    posts,
    handleEdit,
    handleDelete,
    handleCreateData,
    Role,
    Location,
}) => {
    const [updatedPosts, setUpdatedPosts] = useState<Post[]>(posts);
    const [menuVisible, setMenuVisible] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        console.log("Posts data:", posts);
        setUpdatedPosts(posts);
    }, [posts]);


    useEffect(() => {
        const newPostListener = (newPost: Post) => {
            setUpdatedPosts((prevPosts) => {
                if (prevPosts.find((post) => post._id === newPost._id)) return prevPosts;
                return [newPost, ...prevPosts];
            });
        };

        socket.on("newPost", newPostListener);
        return () => {
            socket.off("newPost", newPostListener);
        };
    }, []);

    const toggleMenu = (postId: string) => {
        setMenuVisible((prev) => ({ ...prev, [postId]: !prev[postId] }));
    };

    // Filter posts based on location and role
    const filteredPosts = updatedPosts.filter((post) => {
        if (Role === "Staff") {
            return post.Location === Location;
        }
        if (Role === "Admin") {
            return post.Location === Location;
        }
        return true;
    });

    // Group by ContainerType and calculate total values per group
    const groupedPosts = filteredPosts.reduce((acc, post) => {
        const GrossSales = post.GrossSales ? parseFloat(post.GrossSales.toString()) : 0;
        console.log(`GrossSales for ${post.ContainerNo}:`, GrossSales);

        if (!acc[post.ContainerType]) {
            acc[post.ContainerType] = { posts: [], totalQuantity: 0, totalBelen: 0, totalOrca: 0, totalGrossSales: 0 };
        }
        acc[post.ContainerType].posts.push(post);
        acc[post.ContainerType].totalQuantity += post.TotalQuantity;
        acc[post.ContainerType].totalBelen += post.Boxes;
        acc[post.ContainerType].totalOrca += post.TotalQuantity - post.Boxes;
        acc[post.ContainerType].totalGrossSales += GrossSales; // Add GrossSales to the total for the container type
        return acc;
    }, {} as Record<string, { posts: Post[]; totalQuantity: number; totalBelen: number; totalOrca: number; totalGrossSales: number }>);

    // Calculate overall totals across all groups
    const overallTotalQuantity = Object.values(groupedPosts).reduce((sum, group) => sum + group.totalQuantity, 0);
    const overallTotalBelen = Object.values(groupedPosts).reduce((sum, group) => sum + group.totalBelen, 0);
    const overallTotalOrca = Object.values(groupedPosts).reduce((sum, group) => sum + group.totalOrca, 0);
    const overallTotalGrossSales = Object.values(groupedPosts).reduce((sum, group) => sum + group.totalGrossSales, 0); // Overall total GrossSales

    return (
        <div className="p-4">
            {/* Main Header with Total Counts */}
            <div className="bg-gray-300 p-4 rounded-lg text-center font-bold text-sm mb-4">
                Total: {overallTotalQuantity} | Belen Storage: {overallTotalBelen} | Orca: {overallTotalOrca} | Total Sales: {overallTotalGrossSales.toFixed(2)}</div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                {Object.entries(groupedPosts).length > 0 ? (
                    Object.entries(groupedPosts).map(([containerType, group]) => (
                        <div key={containerType} className="bg-white border rounded-xl shadow-md p-4">
                            {/* Main Card Header */}
                            <div className="bg-gray-200 p-3 shadow-lg rounded-lg flex justify-between items-center">
                                <h3 className="text-xs font-semibold text-gray-800">
                                    {containerType} (Total: {group.totalQuantity} | Belen: {group.totalBelen} | Orca: {group.totalOrca} | Sales: {group.totalGrossSales.toFixed(2)})
                                </h3>
                            </div>

                            {/* Sub Cards for Each Container */}
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                {group.posts.map((post) => {
                                    // Determine card color based on status
                                    const cardClasses =
                                        post.Status === "Inventory"
                                            ? "bg-blue-300 border-blue-500"
                                            : post.Status === "Soldout"
                                                ? "bg-orange-300 border-orange-500"
                                                : "bg-gray-100 border-gray-200";

                                    return (
                                        <div key={post._id} className={`relative ${cardClasses} border rounded-xl p-3`}>
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-xs font-semibold">{post.PlaceSales}</h4>
                                                <button
                                                    onClick={() => toggleMenu(post._id)}
                                                    className="text-gray-500 hover:text-gray-800"
                                                >
                                                    <BsThreeDotsVertical size={18} />
                                                </button>
                                            </div>
                                            <div className="text-xs capitalize mt-2">
                                                <p><strong>Reference No:</strong> {post.ReferenceNumber}</p>
                                                <p><strong>Container No:</strong> {post.ContainerNo}</p>
                                                <p><strong>Country:</strong> {post.Country}</p>
                                                <p><strong>Commodity:</strong> {post.Commodity} | <strong>{post.BoxType}</strong></p>
                                                <p><strong>Size:</strong> {post.Size} | <strong>{post.Freezing}</strong></p>
                                                <p className="mt-2"><strong>Belen Storage:</strong> {post.Boxes}</p>
                                                <p><strong>Orca:</strong> {post.TotalQuantity - post.Boxes}</p>
                                                <p><strong>Total:</strong> {post.TotalQuantity}</p>
                                                <p className="mt-2"><strong>Total Sales:</strong> {post.GrossSales}</p>
                                                <p className="mt-2"><strong>Total PDC:</strong> </p>
                                                <p className="mt-2"><strong>Total Cash:</strong> </p>
                                            </div>

                                            {/* Card Footer */}

                                            <div className="border-t border-gray-900 mt-3 pt-2 text-xs flex justify-between items-center">
                                                <span className="flex items-center gap-1 font-bold">{post.Status} / {post.Location}</span>
                                            </div>

                                            {/* Dropdown Menu */}
                                            {menuVisible[post._id] && (
                                                <div className="absolute right-4 top-10 bg-white shadow-lg rounded-lg border w-32 z-10 text-xs">
                                                    <button
                                                        onClick={() => handleEdit(post)}
                                                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Edit
                                                    </button>
                                                    {Role !== "Staff" && (
                                                        <button
                                                            onClick={() => handleDelete(post._id)}
                                                            className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-xs col-span-full">No records found</p>
                )}
            </div>
        </div>
    );
};

export default ContainerCards;
