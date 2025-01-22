import React, { useState } from "react";
import UserFields from "./UserFields";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Not For Creating Data
interface AddUserFormProps {
    onCancel: () => void;
    userName: string; 
    editPost?: any;

}
// End

const AddUserForm: React.FC<AddUserFormProps> = ({ onCancel, userName, editPost}) => {
    const [Firstname, setFirstname] = useState(editPost ? editPost.Firstname : "");
    const [Lastname, setLastname] = useState(editPost ? editPost.Lastname : "");
    const [Email, setEmail] = useState(editPost ? editPost.Email : "");
    const [Location, setLocation] = useState(editPost ? editPost.Location : "");
    const [UserName, setUserName] = useState(editPost ? editPost.UserName : "");
    const [Password, setPassword] = useState(editPost ? editPost.Password : "");
    const [Role, setRole] = useState(editPost ? editPost.Role : "");

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
                Firstname,
                Lastname,
                Email,
                Location,
                UserName,
                Password,
                Role
              
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
                Firstname={Firstname}
                setFirstname={setFirstname}
                Lastname={Lastname}
                setLastname={setLastname}
                Email={Email}
                setEmail={setEmail}
                Location={Location}
                setLocation={setLocation}
                UserName={UserName}
                setUserName={setUserName}
                Password={Password}
                setPassword={setPassword}
                Role={Role}
                setRole={setRole}
            
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