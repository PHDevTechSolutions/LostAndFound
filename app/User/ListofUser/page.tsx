"use client";

import { useState } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/SessionChecker";
import UserFetcher from "../../../components/UserFetcher";
import AddUserForm from "../../../components/User/AddUserForm";


const ListofUser: React.FC = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(userName) => (
                        <div className="container mx-auto p-4">
                            <div className="grid grid-cols-1 md:grid-cols-1">
                            {showForm ? (
                                    <AddUserForm
                                    onCancel={() => {
                                        setShowForm(false);
                                    }}
                                      // Pass the refreshPosts callback
                                    userName={userName}
                                />
                            ) : (
                                <>
                                <div className="flex justify-between items-center mb-4">
                                    <button className="bg-blue-800 text-white px-4 text-xs py-2 rounded" >Create User</button>
                                </div>
                                </>
                            )}
                            </div>
                        </div>
                    )}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default ListofUser;
