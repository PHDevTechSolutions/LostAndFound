import React, { useMemo, useState } from "react";
import { HiOutlineTrash, HiOutlinePencil } from "react-icons/hi2";

interface Post {
    _id: string;
    ReferenceNumber: string;
    ItemName: string;
    ItemQuantity: string;
    ItemCategories: string;
    ItemOwner: string;
    ContactNumber: string;
    RoomSection: string;
    Department: string;
    ItemStatus: string;
    ItemProgress: string;
    DateLost: string;
}

interface TableProps {
    posts: Post[];
    handleEdit: (post: Post) => void;
    handleDelete: (postId: string) => void;
    Role: string;
    Location: string;
}

const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "lost":
            return "bg-gray-600 text-white";
        case "pending":
            return "bg-red-600 text-white";    
        case "approve":
                return "bg-green-600 text-white";        
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const ITEMS_PER_PAGE = 10;

const Table: React.FC<TableProps> = ({
    posts,
    handleEdit,
    handleDelete,
    Role,
    Location,
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    const paginatedPosts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return posts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [posts, currentPage]);

    const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);

    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full bg-white border border-gray-300 text-xs">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        {[  
                            "Ticket Number",
                            "Item Name",
                            "Item Quantity",
                            "Categories",
                            "Item Owner",
                            "Contact Number",
                            "Room/Section",
                            "Department",
                            "Date Lost",
                            "Status",
                            "Progress",
                            "Actions",
                        ].map((header) => (
                            <th key={header} className="p-2 border text-left whitespace-nowrap">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {paginatedPosts.map((post) => (
                        <tr key={post._id} className="text-left border-b capitalize">
                            <td className="p-2 border">{post.ReferenceNumber}</td>
                            <td className="p-2 border">{post.ItemName}</td>
                            <td className="p-2 border">{post.ItemQuantity}</td>
                            <td className="p-2 border">{post.ItemCategories}</td>
                            <td className="p-2 border">{post.ItemOwner}</td>
                            <td className="p-2 border">{post.ContactNumber}</td>
                            <td className="p-2 border">{post.RoomSection}</td>
                            <td className="p-2 border">{post.Department}</td>
                            <td className="p-2 border">{post.DateLost}</td>
                            <td className="p-2 border">
                                <span
                                    className={`px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusBadgeColor(
                                        post.ItemStatus
                                    )}`}
                                >
                                    {post.ItemStatus}
                                </span>
                            </td>
                            <td className="p-2 border">
                                <span
                                    className={`px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusBadgeColor(
                                        post.ItemProgress
                                    )}`}
                                >
                                    {post.ItemProgress}
                                </span>
                            </td>
                            <td className="p-2 border">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(post)}
                                        className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-800 text-white rounded-md flex items-center"
                                    >
                                        <HiOutlinePencil size={15} className="mr-1" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        className="px-2 py-1 text-xs bg-red-600 hover:bg-red-800 text-white rounded-md flex items-center"
                                    >
                                        <HiOutlineTrash size={15} className="mr-1" /> Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 text-xs">
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <div className="space-x-2">
                    <button
                        onClick={() => changePage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button
                        onClick={() => changePage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Table;
