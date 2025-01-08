"use client";
import React from "react";

interface PostsTableProps {
    posts: any[];
    handleEdit: (post: any) => void;
    handleDelete: (postId: string) => void;
}

const PostsTable: React.FC<PostsTableProps> = ({ posts, handleEdit, handleDelete }) => {
    return (
        <table className="min-w-full bg-white border text-xs">
            <thead>
                <tr>
                    <th className="py-2 px-4 border">Title</th>
                    <th className="py-2 px-4 border">Author</th>
                    <th className="py-2 px-4 border">Categories</th>
                    <th className="py-2 px-4 border">Tags</th>
                    <th className="py-2 px-4 border">Date</th>
                    <th className="py-2 px-4 border">Actions</th>
                </tr>
            </thead>
            <tbody>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <tr key={post._id}>
                            <td className="py-2 px-4 border capitalize">{post.title}</td>
                            <td className="py-2 px-4 border capitalize">{post.author}</td>
                            <td className="py-2 px-4 border capitalize">{post.categories}</td>
                            <td className="py-2 px-4 border capitalize">{post.tags}</td>
                            <td className="py-2 px-4 border">{new Date(post.createdAt).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border">
                                <button
                                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 text-xs"
                                    onClick={() => handleEdit(post)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                    onClick={() => handleDelete(post._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6} className="py-2 px-4 border text-center">No posts available</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default PostsTable;
