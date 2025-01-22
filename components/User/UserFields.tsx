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
        <div className="flex flex-wrap -mx-4">
            <label className="block text-xs font-bold mb-2" htmlFor="Firstname">Firstname</label>
            <input type="text" id="Firstname" value={Firstname} onChange={(e) => setFirstname(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required/>
        </div> 
        <div className="flex flex-wrap -mx-4">
            <label className="block text-xs font-bold mb-2" htmlFor="Lastname">Lastname</label>
            <input type="text" id="Lastname" value={Lastname} onChange={(e) => setLastname(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required/>
        </div> 
        <div className="flex flex-wrap -mx-4">
            <label className="block text-xs font-bold mb-2" htmlFor="Email">Email</label>
            <input type="text" id="Email" value={Email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required/>
        </div> 
        <div className="flex flex-wrap -mx-4">
            <label className="block text-xs font-bold mb-2" htmlFor="Location">Location</label>
            <select id="Location" value={Location || ""} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required >
            <option value="Navotas">Navotas</option>
            <option value="Sambat">Sambat</option>
            <option value="Minalin">Minalin</option>
          </select>
        </div> 
        <div className="flex flex-wrap -mx-4">
            <label className="block text-xs font-bold mb-2" htmlFor="Username">Username</label>
            <input type="text" id="UserName" value={UserName} onChange={(e) => setUserName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required/>
        </div> 
        <div className="flex flex-wrap -mx-4">
            <label className="block text-xs font-bold mb-2" htmlFor="Password">Password</label>
            <input type="text" id="Password" value={Password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required/>
        </div> 
        <div className="flex flex-wrap -mx-4">
            <label className="block text-xs font-bold mb-2" htmlFor="Role">Role</label>
            <select id="Role" value={Role || ""} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required >
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>
        </div> 
        </>
    )

}

export default UserFields;