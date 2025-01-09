"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/SessionChecker";
import UserFetcher from "../../../components/UserFetcher";
import AddPostForm from "../../../components/AddPostForm";
import SearchFilters from "../../../components/SearchFilters";
import PostsTable from "../../../components/Blogs/PostsTable";
import Pagination from "../../../components/Pagination";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const BlogPage: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editPost, setEditPost] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

    // Fetch blog posts from the API
    const fetchPosts = async () => {
        try {
            const response = await fetch("/api/blog/fetchPosts");
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Filter posts based on search term, month, category, and tag
    const filteredPosts = posts.filter((post) => {
        const postDate = new Date(post.createdAt);
        const postMonth = postDate.getMonth() + 1;
        return (
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedMonth ? postMonth === parseInt(selectedMonth) : true) &&
            (selectedCategory ? post.categories.includes(selectedCategory) : true) &&
            (selectedTag ? post.tags.includes(selectedTag) : true)
        );
    });

    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    // Edit post function
    const handleEdit = (post: any) => {
        setEditPost(post);
        setShowForm(true);
    };

    // Show delete modal
    const confirmDelete = (postId: string) => {
        setPostToDelete(postId);
        setShowDeleteModal(true);
    };

    // Delete post function
    const handleDelete = async () => {
        if (!postToDelete) return;
        try {
            const response = await fetch(`/api/blog/deletePost`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: postToDelete }),
            });

            if (response.ok) {
                setPosts(posts.filter((post) => post._id !== postToDelete));
                toast.success("Post deleted successfully.");
            } else {
                toast.error("Failed to delete post.");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post.");
        } finally {
            setShowDeleteModal(false);
            setPostToDelete(null);
        }
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(userName, userEmail) => (
                        <div className="container mx-auto p-4">
                            {showForm ? (
                                <AddPostForm
                                    onCancel={() => {
                                        setShowForm(false);
                                        setEditPost(null);
                                    }}
                                    refreshPosts={fetchPosts}  // Pass the refreshPosts callback
                                    userName={userName}
                                    editPost={editPost}
                                />
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
                                    <SearchFilters
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm}
                                        selectedMonth={selectedMonth}
                                        setSelectedMonth={setSelectedMonth}
                                        selectedCategory={selectedCategory}
                                        setSelectedCategory={setSelectedCategory}
                                        selectedTag={selectedTag}
                                        setSelectedTag={setSelectedTag}
                                        postsPerPage={postsPerPage}
                                        setPostsPerPage={setPostsPerPage}
                                    />
                                    <PostsTable
                                        posts={currentPosts}
                                        handleEdit={handleEdit}
                                        handleDelete={confirmDelete}
                                    />
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        setCurrentPage={setCurrentPage}
                                    />
                                    <div className="text-xs mt-2">
                                        Showing {indexOfFirstPost + 1} to {Math.min(indexOfLastPost, filteredPosts.length)} of {filteredPosts.length} entries
                                    </div>
                                </>
                            )}

                            {showDeleteModal && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                    <div className="bg-white p-4 rounded shadow-lg">
                                        <h2 className="text-xs font-bold mb-4">Confirm Deletion</h2>
                                        <p className="text-xs">Are you sure you want to delete this post?</p>
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                className="bg-red-500 text-white text-xs px-4 py-2 rounded mr-2"
                                                onClick={handleDelete}
                                            >
                                                Delete
                                            </button>
                                            <button
                                                className="bg-gray-300 text-xs px-4 py-2 rounded"
                                                onClick={() => setShowDeleteModal(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <ToastContainer />
                        </div>
                    )}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default BlogPage;
