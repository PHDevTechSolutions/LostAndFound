"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { BsPlusCircle } from "react-icons/bs";

const socket = io("http://localhost:3001");

interface UsersTableProps {
    posts: any[];
    handleEdit: (post: any) => void;
    handleDelete: (postId: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ posts, handleEdit, handleDelete }) => {
    const [updatedUser, setUpdatedUser] = useState<any[]>(posts);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    useEffect(() => {
        // Update local state when posts prop changes
        setUpdatedUser(posts);
    }, [posts]);

    useEffect(() => {
        // Listen to newPost event from the server
        socket.on("newPost", (newPost) => {
            setUpdatedUser((prevPosts) => [newPost, ...prevPosts]);
        });

        return () => {
            socket.off("newPost");
        };
    }, []);

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
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border text-xs">
                <thead>
                    <tr>
                        <th className="w-1/6 text-left border px-4 py-2">Fullname</th>
                        <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Email</th>
                        <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Password</th>
                        <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {updatedUser.length > 0 ? (
                        updatedUser.map((post) => (
                            <React.Fragment key={post._id}>
                                <tr
                                    className="bg-gray-10 cursor-pointer"
                                    onClick={() => toggleRow(post._id)}
                                >
                                    <td className="px-4 py-2 border"><BsPlusCircle className="inline-block mr-2 md:hidden " /> {post.name}</td>
                                    <td className="px-4 py-2 border hidden md:table-cell">{post.email}</td>
                                    <td className="px-4 py-2 border hidden md:table-cell">{post.password}</td>
                                    <td className="px-4 py-2 border hidden md:table-cell">
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
                                    </td>
                                </tr>
                                {expandedRows.has(post._id) && (
                                    <tr className="bg-gray-10 md:hidden">
                                        <td className="px-4 py-2" colSpan={6}>
                                            <div>
                                                <strong>Fullname:</strong> {post.name}
                                            </div>
                                            <div>
                                                <strong>Email:</strong> {post.email}
                                            </div>
                                            <div>
                                                <strong>Password:</strong> {post.password}
                                            </div>
                                            <div className="mt-2">
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
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="py-2 px-4 border text-center">No accounts available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;
