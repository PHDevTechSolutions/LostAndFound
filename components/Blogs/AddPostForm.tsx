"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./FormFields";
import { generateLink } from "./formUtils";

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
      setLink(generateLink(title));
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

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
        <h2 className="text-xs font-bold mb-4">{editPost ? "Edit Post" : "Add New Post"}</h2>
        <FormFields
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          status={status}
          setStatus={setStatus}
          link={link}
          setLink={setLink}
          author={author}
          setAuthor={setAuthor}
          categories={categories}
          setCategories={setCategories}
          tags={tags}
          setTags={setTags}
          handleFileChange={handleFileChange}
          editPost={editPost}
        />
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
