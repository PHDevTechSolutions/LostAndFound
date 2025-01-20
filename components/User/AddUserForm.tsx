import React, { useState } from "react";
import UserFields from "./UserFields";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface AddUserFormProps {
    onCancel: () => void;
    userName: string;

}
const AddUserForm: React.FC<AddUserFormProps> = ({ onCancel, userName }) => {
    const [UserName, setUserName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = `/api/User/CreateUser`;
        const method = "POST";
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify({
                UserName,
            }),
        });

        if (response.ok) {
            toast.success("User Added Successfully", {
                autoClose: 900,
                onClose: () => {
                    onCancel();
                }
            });

        } else {
            toast.error("User Added Unsuccessful", {
                autoClose: 900,

            });
        }

    };

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
                <h2>Add New User </h2>
                <UserFields 
                UserName={UserName}
                setUserName={setUserName}
                />
                <div className="flex justify-between">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded text-xs" type="submit">Submit</button>
                </div>
                <ToastContainer className="text-xs" autoClose={900} />
            </form>
        </>
    );

};


export default AddUserForm;