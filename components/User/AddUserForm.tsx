"use client";

import React, { useState } from "react";
import UserFields from "./UserFields";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { HiOutlineCheck, HiXMark, HiOutlinePencil } from "react-icons/hi2";

// Not For Creating Data
interface AddUserFormProps {
    onCancel: () => void;
    refreshUser: () => void;
    userName: any;
    editPost?: any;
}
// End

const AddUserForm: React.FC<AddUserFormProps> = ({ onCancel, refreshUser, editPost }) => {
    const [Firstname, setFirstname] = useState(editPost ? editPost.Firstname : "");
    const [Lastname, setLastname] = useState(editPost ? editPost.Lastname : "");
    const [Email, setEmail] = useState(editPost ? editPost.Email : "");
    const [Location, setLocation] = useState(editPost ? editPost.Location : "");
    const [userName, setuserName] = useState(editPost ? editPost.userName : "");
    const [Password, setPassword] = useState(editPost ? editPost.Password : "");
    const [Role, setRole] = useState(editPost ? editPost.role : "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editPost ? `/api/User/EditUser` : `/api/User/CreateUser`;
        const method = editPost ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify({
                Firstname,
                Lastname,
                Email,
                Location,
                userName,
                Password,
                Role,
                id: editPost ? editPost._id : undefined,
            }),
        });

        if (response.ok) {
            toast.success(editPost ? "Data updated successfully" : "Data added successfully", {
                autoClose: 1000,
                onClose: () => {
                    onCancel(); // Hide the form after submission
                    refreshUser(); // Refresh accounts after successful submission
                }
            });
        } else {
            toast.error(editPost ? "Failed to Update Data" : "Failed to Add Data", {
                autoClose: 1000
            });
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
                <h2 className="text-xs font-bold mb-4">{editPost ? "Edit User" : "Add User"}</h2>
                <UserFields
                    Firstname={Firstname} setFirstname={setFirstname}
                    Lastname={Lastname} setLastname={setLastname}
                    Email={Email} setEmail={setEmail}
                    Location={Location} setLocation={setLocation}
                    userName={userName} setuserName={setuserName}
                    Password={Password} setPassword={setPassword}
                    Role={Role} setRole={setRole}
                    editPost={editPost}
                />
                <div className="flex justify-between">
                    <button type="submit" className="hover:bg-blue-900 bg-[#143c66] text-white px-4 py-2 rounded text-xs flex gap-1">
                        {editPost ? (
                            <>
                                <HiOutlinePencil size={15} />
                                Update
                            </>
                        ) : (
                            <>
                                <HiOutlineCheck size={15} />
                                Submit
                            </>
                        )}
                    </button>
                    <button type="button" className="hover:bg-gray-100 bg-white border px-4 py-2 rounded text-xs flex gap-1" onClick={onCancel}>
                        <HiXMark size={15} />Cancel</button>
                </div>
                <ToastContainer className="text-xs" autoClose={900} />
            </form>
        </>
    );

};


export default AddUserForm;