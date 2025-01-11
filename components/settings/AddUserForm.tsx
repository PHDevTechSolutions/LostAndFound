"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./UserFormFields";

interface AddPostFormProps { 
  onCancel: () => void; 
  refreshPosts: () => void;  // Add a refreshPosts callback
  userName: string; 
  editUser?: any; // Optional prop for the post being edited
}

const AddUserForm: React.FC<AddPostFormProps> = ({ onCancel, refreshPosts, userName, editUser }) => {
  const [name, setname] = useState(editUser ? editUser.name : "");
  const [email, setemail] = useState(editUser ? editUser.email : "");
  const [password, setpassword] = useState(editUser ? editUser.password : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editUser ? `/api/settings/editUser` : `/api/settings/createUser`; // API endpoint changes based on edit or add
    const method = editUser ? "PUT" : "POST"; // HTTP method changes based on edit or add

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name, 
        email, 
        password, 
        id: editUser ? editUser._id : undefined, // Send post ID if editing
      }),
    });

    if (response.ok) {
      toast.success(editUser ? "Post updated successfully" : "Post added successfully", {
        autoClose: 1000,
        onClose: () => {
          onCancel(); // Hide the form after submission
          refreshPosts(); // Refresh posts after successful submission
        }
      });
    } else {
      toast.error(editUser ? "Failed to update post" : "Failed to add post", {
        autoClose: 1000
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
        <h2 className="text-xs font-bold mb-4">{editUser ? "Edit User Information" : "Add New User"}</h2>
        <FormFields
          name={name}
          setname={setname}
          email={email}
          setemail={setemail}
          password={password}
          setpassword={setpassword}
          editPost={editUser}
        />
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded text-xs">{editUser ? "Update" : "Submit"}</button>
          <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded text-xs" onClick={onCancel}>Cancel</button>
        </div>
      </form>
      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default AddUserForm;
