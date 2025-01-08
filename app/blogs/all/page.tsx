"use client";
import React, { useState } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/SessionChecker";
import UserFetcher from "../../../components/UserFetcher";
import AddPostForm from "../../../components/AddPostForm";

const BlogPage: React.FC = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(userName, userEmail) => (
                        <div className="container mx-auto p-4">
                            {showForm ? (
                                <AddPostForm onCancel={() => setShowForm(false)} userName={userName} />
                            ) : (
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h2 className="text-lg font-bold mb-2">Hello, {userName}</h2>
                                            <p className="text-sm text-gray-700">Email: {userEmail}</p>
                                        </div>
                                        <button className="bg-blue-500 text-white px-4 text-xs py-2 rounded" onClick={() => setShowForm(true)}>Add Post</button>
                                    </div>
                                    <h2 className="text-lg font-bold mb-2">Blog Posts</h2>
                                    <table className="min-w-full bg-white border">
                                        <thead>
                                            <tr>
                                                <th className="py-2 px-4 border">Title</th>
                                                <th className="py-2 px-4 border">Author</th>
                                                <th className="py-2 px-4 border">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Empty rows for now */}
                                            <tr>
                                                <td className="py-2 px-4 border">Sample Title 1</td>
                                                <td className="py-2 px-4 border">Sample Author 1</td>
                                                <td className="py-2 px-4 border">Sample Date 1</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 px-4 border">Sample Title 2</td>
                                                <td className="py-2 px-4 border">Sample Author 2</td>
                                                <td className="py-2 px-4 border">Sample Date 2</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                    )}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default BlogPage;
