"use client";

import React, { useEffect, useState } from "react";

interface UsersTableProps{
    posts: any[];
    handleEdit: (post: any) => void;
    handleDelete: (postId: string) => void;
}

const UsersTable: React.FC<UsersTableProps> =({ posts, handleDelete, handleEdit}) => {
    const [updatedPosts, setupdatesPosts] = useState<any[]>(posts);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    
    useEffect(() => {
        setupdatesPosts(posts);
    }, [posts]);

    const toggleRow = (postId: string) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(postId)) {
            newExpandedRows.delete(postId);
        } else {
            newExpandedRows.add(postId);
        }
        setExpandedRows(newExpandedRows);
    };


    return (
        <div className=" overflow-x-auto">
            <table className="min-w-full bg-white border text-xs">
                <thead>
                    <tr>
                        <th className="w-1/2 text-center border px-4 py-2"> Username </th>
                        <th className="w-1/2 text-center border px-4 py-2"> Password </th>
                        <th className="w-1/2 text-center border px-4 py-2"> Email </th>
                        <th className="w-1/2 text-center border px-4 py-2"> Role </th>
                    </tr>
                </thead>
                <tbody>
                    {updatedPosts.length > 0 ? (
                        updatedPosts.map((post) => (
                            <React.Fragment key={post._id}>
                                <tr
                                     className="bg-gray-10 cursor-pointer"
                                     onClick={() => toggleRow(post._id)}
                                >
                                    <td className="px-4 py-2 border">{post.UserName}</td>
                                    <td className="px-4 py-2 border">{post.Password}</td>
                                    <td className="px-4 py-2 border">{post.Email}</td>
                                    <td className="px-4 py-2 border">{post.Role}</td>
                                </tr>
                                <button
                                            className="bg-blue-500 text-white px-2 py-1 rounded mr-2 text-xs"
                                            onClick={(e) => { e.stopPropagation(); handleEdit(post); }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-700 text-white px-2 py-1 rounded text-xs"
                                            onClick={(e) => { e.stopPropagation(); handleDelete(post._id); }}
                                        >
                                            Delete
                                        </button>

                            </React.Fragment>
                        ))
                    ):(
                        <tr>
                            <td colSpan={4} className="text-center px-4 py-2 border"></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

};
export default UsersTable;