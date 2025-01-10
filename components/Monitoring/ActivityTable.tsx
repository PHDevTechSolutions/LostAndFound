"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { BsPlusCircle } from "react-icons/bs";

const socket = io("http://localhost:3001");

interface ActivityTableProps {
    posts: any[];
    handleEdit: (post: any) => void;
    handleDelete: (postId: string) => void;
}

const ActivityTable: React.FC<ActivityTableProps> = ({ posts, handleEdit, handleDelete }) => {
    const [updatedPosts, setUpdatedPosts] = useState<any[]>(posts);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    useEffect(() => {
        // Update local state when posts prop changes
        setUpdatedPosts(posts);
    }, [posts]);

    useEffect(() => {
        // Listen to newPost event from the server
        socket.on("newPost", (newPost) => {
            setUpdatedPosts((prevPosts) => [newPost, ...prevPosts]);
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
            <table className="bg-white border text-xs">
                <thead>
                    <tr>
                        <th className="w-1/6 text-left border whitespace-nowrap px-4 py-2">Company Name</th>
                        <th className="w-1/6 text-left border whitespace-nowrap px-4 py-2 hidden md:table-cell">Customer Name</th>
                        <th className="w-1/6 text-left border whitespace-nowrap px-4 py-2 hidden md:table-cell">Gender</th>
                        <th className="w-1/6 text-left whitespace-nowrap border px-4 py-2 hidden md:table-cell">Contact Number</th>
                        <th className="w-1/6 text-left whitespace-nowrap border px-4 py-2 hidden md:table-cell">City Address</th>
                        <th className="w-1/6 text-left whitespace-nowrap border px-4 py-2 hidden md:table-cell">Channel</th>
                        <th className="w-1/6 text-left whitespace-nowrap border px-4 py-2 hidden md:table-cell">Wrap-Up</th>
                        <th className="w-1/6 text-left whitespace-nowrap border px-4 py-2 hidden md:table-cell">Source</th>
                        <th className="w-1/6 text-left whitespace-nowrap border px-4 py-2 hidden md:table-cell">Customer Type</th>
                        <th className="w-1/6 text-left whitespace-nowrap border px-4 py-2 hidden md:table-cell">Customer Status</th>
                        <th className="w-1/6 text-left whitespace-nowrap border px-4 py-2 hidden md:table-cell">Status</th>
                        <th className="w-1/6 text-left whitespace-nowrap border px-4 py-2 hidden md:table-cell">Order #</th>
                        <th className="w-1/6 text-left whitespace-nowrap border px-4 py-2 hidden md:table-cell">Amount</th>
                        <th className="w-1/6 text-left whitespace-nowrap border px-4 py-2 hidden md:table-cell">QTY Sold</th>
                        <th className="w-1/6 text-left whitespace-nowrap border px-4 py-2 hidden md:table-cell">Sales Manager</th>
                        <th className="w-1/6 text-left whitespace-nowrap border px-4 py-2 hidden md:table-cell">Sales Agent</th>
                        <th className="w-1/6 text-left whitespace-nowrap border px-4 py-2 hidden md:table-cell">Actions</th>
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
                                    <td className="px-4 py-2 border whitespace-nowrap"><BsPlusCircle className="inline-block mr-2 md:hidden" /> {post.companyName}</td>
                                    <td className="px-4 py-2 border whitespace-nowrap hidden md:table-cell">{post.customerName}</td>
                                    <td className="px-4 py-2 border whitespace-nowrap hidden md:table-cell">{post.gender}</td>
                                    <td className="px-4 py-2 border whitespace-nowrap hidden md:table-cell">{post.contactNumber}</td>
                                    <td className="px-4 py-2 whitespace-nowrap border hidden md:table-cell">{post.channel}</td>
                                    <td className="px-4 py-2 whitespace-nowrap border hidden md:table-cell">{post.cityAddress}</td>
                                    <td className="px-4 py-2 whitespace-nowrap border hidden md:table-cell">{post.wrapUp}</td>
                                    <td className="px-4 py-2 whitespace-nowrap border hidden md:table-cell">{post.source}</td>
                                    <td className="px-4 py-2 whitespace-nowrap border hidden md:table-cell">{post.customerType}</td>
                                    <td className="px-4 py-2 whitespace-nowrap border hidden md:table-cell">{post.customerStatus}</td>
                                    <td className="px-4 py-2 whitespace-nowrap border hidden md:table-cell">{post.cStatus}</td>
                                    <td className="px-4 py-2 whitespace-nowrap border hidden md:table-cell">{post.orderNumber}</td>
                                    <td className="px-4 py-2 whitespace-nowrap border hidden md:table-cell">{post.amount}</td>
                                    <td className="px-4 py-2 whitespace-nowrap border hidden md:table-cell">{post.qtySold}</td>
                                    <td className="px-4 py-2 whitespace-nowrap border hidden md:table-cell">{post.salesManager}</td>
                                    <td className="px-4 py-2 whitespace-nowrap border hidden md:table-cell">{post.salesAgent}</td>
                                    <td className="px-4 py-2 whitespace-nowrap border hidden md:table-cell">
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
                                    <tr className="bg-gray-50 md:hidden">
                                        <td className="px-4 py-2" colSpan={6}>
                                            <div>
                                                <strong>Company Name:</strong> {post.companyName}
                                            </div>
                                            <div>
                                                <strong>Customer Name:</strong> {post.customerName}
                                            </div>
                                            <div>
                                                <strong>Gender:</strong> {post.gender}
                                            </div>
                                            <div>
                                                <strong>Contact Number:</strong> {post.contactNumber}
                                            </div>
                                            <div>
                                                <strong>City Address:</strong> {post.cityAddress}
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

export default ActivityTable;
