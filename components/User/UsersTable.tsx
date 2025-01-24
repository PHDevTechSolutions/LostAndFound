"use client";

import React, { useEffect, useState } from "react";

interface UsersTableProps{
    posts: any[];
    handleEdit: (post: any) => void;
    handleDelete: (postId: string) => void;
}

const UsersTable: React.FC<UsersTableProps> =({ posts, handleDelete, handleEdit}) => {
    const [updatedPosts, setupdatesPosts] = useState<any[]>(posts);
    
    useEffect(() => {
        setupdatesPosts(posts);
    }, [posts]);

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
                                <tr>
                                    <td className="px-4 py-2 border">{post.UserName}</td>
                                    <td className="px-4 py-2 border">{post.Password}</td>
                                    <td className="px-4 py-2 border">{post.Email}</td>
                                    <td className="px-4 py-2 border">{post.Role}</td>
                                </tr>
                            </React.Fragment>
                        ))
                    ):(
                        <tr>
                            <td colSpan={4}></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

};
export default UsersTable;