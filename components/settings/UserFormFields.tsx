import React from "react";

interface FormFieldsProps {
  name: string;
  setname: (value: string) => void;
  email: string;
  setemail: (value: string) => void;
  password: string;
  setpassword: (value: string) => void;
  editPost?: any;
}

const UserFormFields: React.FC<FormFieldsProps> = ({
  name,
  setname,
  email,
  setemail,
  password,
  setpassword,
  editPost
}) => {

  return (
    <>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="name">Fullname</label>
        <input type="text" id="name" value={name} onChange={(e) => setname(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="email">Email</label>
        <input type="text" id="email" value={email} onChange={(e) => setemail(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="password">Password</label>
        <input type="text" id="password" value={password} onChange={(e) => setpassword(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
    </>
  );
};

export default UserFormFields;
