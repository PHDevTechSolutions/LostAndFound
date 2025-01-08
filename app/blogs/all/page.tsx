"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/SessionChecker";
import UserFetcher from "../../../components/UserFetcher";
import AddPostForm from "../../../components/AddPostForm";

const BlogPage: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Fetch blog posts from the API
        const fetchPosts = async () => {
            const response = await fetch("/api/fetchPosts");
            const data = await response.json();
            setPosts(data);
        };

        fetchPosts();
    }, []);

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
                                    <table className="min-w-full bg-white border text-xs">
                                        <thead>
                                            <tr>
                                                <th className="py-2 px-4 border">Title</th>
                                                <th className="py-2 px-4 border">Author</th>
                                                <th className="py-2 px-4 border">Categories</th>
                                                <th className="py-2 px-4 border">Tags</th>
                                                <th className="py-2 px-4 border">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {posts.length > 0 ? (
                                                posts.map((post: any) => (
                                                    <tr key={post._id}>
                                                        <td className="py-2 px-4 border">{post.title}</td>
                                                        <td className="py-2 px-4 border">{post.author}</td>
                                                        <td className="py-2 px-4 border">{post.categories}</td>
                                                        <td className="py-2 px-4 border">{post.tags}</td>
                                                        <td className="py-2 px-4 border">{new Date(post.createdAt).toLocaleDateString()}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="py-2 px-4 border text-center">No posts available</td>
                                                </tr>
                                            )}
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
