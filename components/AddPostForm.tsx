"use client";
import React, { useState, useEffect } from "react";

interface AddPostFormProps { 
  onCancel: () => void; 
  userName: string; 
}

const AddPostForm: React.FC<AddPostFormProps> = ({ onCancel, userName }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [link, setLink] = useState("");
  const [author, setAuthor] = useState(userName);
  const [categories, setCategories] = useState("");
  const [tags, setTags] = useState("");
  const [featureImage, setFeatureImage] = useState<File | null>(null);

  useEffect(() => {
    setAuthor(userName);
  }, [userName]);

  useEffect(() => {
    const generatedLink = `blogs/${title.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "")}`;
    setLink(generatedLink);
  }, [title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Call the API to add a new post
    const response = await fetch("/api/posts", {
      method: "POST",
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
        featureImage
      }),
    });

    if (response.ok) {
      console.log("Post added successfully");
      onCancel(); // Hide the form after submission
    } else {
      console.error("Failed to add post");
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
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
      <h2 className="text-xs font-bold mb-4">Add New Post</h2>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="title">Title</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="description">Description</label>

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
        <input type="text" id="link" value={link} onChange={(e) => setLink(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" readOnly/>
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded text-xs">Submit</button>
        <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded text-xs" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default AddPostForm;
