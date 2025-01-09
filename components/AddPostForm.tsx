"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface AddPostFormProps { 
  onCancel: () => void; 
  refreshPosts: () => void;  // Add a refreshPosts callback
  userName: string; 
  editPost?: any; // Optional prop for the post being edited
}

const AddPostForm: React.FC<AddPostFormProps> = ({ onCancel, refreshPosts, userName, editPost }) => {
  const [title, setTitle] = useState(editPost ? editPost.title : "");
  const [description, setDescription] = useState(editPost ? editPost.description : "");
  const [status, setStatus] = useState(editPost ? editPost.status : "");
  const [link, setLink] = useState(editPost ? editPost.link : "");
  const [author, setAuthor] = useState(userName);
  const [categories, setCategories] = useState(editPost ? editPost.categories : "");
  const [tags, setTags] = useState(editPost ? editPost.tags : "");
  const [featureImage, setFeatureImage] = useState<File | null>(null);

  useEffect(() => {
    setAuthor(userName);
  }, [userName]);

  useEffect(() => {
    if (!editPost) {
      const generatedLink = `blogs/${title.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "")}`;
      setLink(generatedLink);
    }
  }, [title, editPost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editPost ? `/api/blog/editPost` : `/api/blog/posts`; // API endpoint changes based on edit or add
    const method = editPost ? "PUT" : "POST"; // HTTP method changes based on edit or add

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title, 
        description, 
        status, 
        link, 
        author, 
        categories, 
        tags, 
        featureImage,
        id: editPost ? editPost._id : undefined, // Send post ID if editing
      }),
    });

    if (response.ok) {
      toast.success(editPost ? "Post updated successfully" : "Post added successfully", {
        autoClose: 1000,
        onClose: () => {
          onCancel(); // Hide the form after submission
          refreshPosts(); // Refresh posts after successful submission
        }
      });
    } else {
      toast.error(editPost ? "Failed to update post" : "Failed to add post", {
        autoClose: 1000
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFeatureImage(e.target.files[0]);
    }
  };

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "private", label: "Private" },
    { value: "schedule", label: "Schedule" },
    { value: "publish", label: "Publish" },
    { value: "password_protected", label: "Password Protected" },
    { value: "sticky", label: "Sticky" },
  ];

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
        <h2 className="text-xs font-bold mb-4">{editPost ? "Edit Post" : "Add New Post"}</h2>
        <div className="mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="title">Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="description">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" rows={4}></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="status">Status</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs">
            <option value="">Select status</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="link">Link</label>
          <input type="text" id="link" value={link} onChange={(e) => setLink(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" readOnly={!editPost}/>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="author">Author</label>
          <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" disabled/>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="categories">Categories</label>
          <input type="text" id="categories" value={categories} onChange={(e) => setCategories(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="tags">Tags</label>
          <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="featureImage">Feature Image</label>
          <input type="file" id="featureImage" onChange={handleFileChange} className="w-full px-3 py-2 border rounded text-xs"/>
        </div>
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded text-xs">{editPost ? "Update" : "Submit"}</button>
          <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded text-xs" onClick={onCancel}>Cancel</button>
        </div>
      </form>
      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default AddPostForm;
