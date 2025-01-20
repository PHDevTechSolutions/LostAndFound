import React from "react";

interface UserFieldsProps{ 
    UserName: string;
    setUserName: (value: string) => void;

}

const UserFields: React.FC<UserFieldsProps> = ({ UserName, setUserName }) => {
    return (
        <>
        <div className="mb-4">
            <label className="block text-xs font-bold mb-2" htmlFor="username">User Name</label>
            <input type="text" id="Username" value={UserName} onChange={(e) => setUserName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
        </div> 

        </>
    )

}

export default UserFields;