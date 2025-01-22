import React from "react";

interface UserFieldsProps{ 
    Firstname: string;
    setFirstname: (value: string) => void;
    Lastname: string;
    setLastname: (value: string) => void;
    Email: string;
    setEmail: (value: string) => void;
    Location: string;
    setLocation: (value: string) => void;
    UserName: string;
    setUserName: (value: string) => void;
    Password: string;
    setPassword: (value: string) => void;
    Role: string;
    setRole: (value: string) => void;

}

const UserFields: React.FC<UserFieldsProps> = ({ Firstname, setFirstname, Lastname, setLastname, Email, setEmail, Location, setLocation, UserName, setUserName, Password, setPassword, Role, setRole }) => {
    return (
        <>
        <div className="mb-4">
            <label className="block text-xs font-bold mb-2" htmlFor="firstname">Firstname</label>
            <input type="text" id="Firstname" value={Firstname} onChange={(e) => setFirstname(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required/>
        </div> 
        <div className="mb-4">
            <label className="block text-xs font-bold mb-2" htmlFor="lastname">Lastname</label>
            <input type="text" id="Lastname" value={Lastname} onChange={(e) => setLastname(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required/>
        </div> 
        <div className="mb-4">
            <label className="block text-xs font-bold mb-2" htmlFor="email">Email</label>
            <input type="text" id="Email" value={Email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required/>
        </div> 
        <div className="mb-4">
            <label className="block text-xs font-bold mb-2" htmlFor="location">Location</label>
            <input type="text" id="Location" value={Location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required/>
        </div> 
        <div className="mb-4">
            <label className="block text-xs font-bold mb-2" htmlFor="username">Username</label>
            <input type="text" id="UserName" value={UserName} onChange={(e) => setUserName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required/>
        </div> 
        <div className="mb-4">
            <label className="block text-xs font-bold mb-2" htmlFor="password">Password</label>
            <input type="text" id="Password" value={Password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required/>
        </div> 
        <div className="mb-4">
            <label className="block text-xs font-bold mb-2" htmlFor="role">Role</label>
            <input type="text" id="Role" value={Role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required/>
        </div> 
        </>
    )

}

export default UserFields;