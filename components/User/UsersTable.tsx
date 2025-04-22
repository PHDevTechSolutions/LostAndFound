import React, { useMemo, useState } from "react";
import { HiOutlineTrash, HiOutlinePencil } from "react-icons/hi2";

interface Post {
    _id: string;
    Firstname: string;
    Lastname: string;
    Email: string;
    Role: string;
}

interface ContainerTableProps {
    posts: Post[];
    handleEdit: (post: Post) => void;
    handleDelete: (postId: string) => void;
    Role: string;
    Location: string;
}

const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "subscribers":
            return "bg-[#2563EB] text-white";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const ITEMS_PER_PAGE = 10;

const ReportItemTable: React.FC<ContainerTableProps> = ({
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
                            "Fullname",
                            "Email",
                            "Role",
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
                        <tr key={post._id} className="text-left border-b">
                            <td className="p-2 border capitalize">{post.Lastname}, {post.Firstname}</td>
                            <td className="p-2 border">{post.Email}</td>
                            <td className="p-2 border">
                                <span
                                    className={`px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusBadgeColor(
                                        post.Role
                                    )}`}
                                >
                                    {post.Role}
                                </span>
                            </td>
                            <td className="p-2 border">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(post)}
                                        className="px-2 py-1 text-xs bg-[#2563EB] hover:bg-blue-800 text-white rounded-md flex items-center"
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

export default ReportItemTable;
