import React from "react";

interface FormFieldsProps {
  companyName: string;
  setCompanyName: (value: string) => void;
  customerName: string;
  setCustomerName: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  contactNumber: string;
  setContactNumber: (value: string) => void;
  cityAddress: string;
  setCityAddress: (value: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editPost?: any;
}

const AccountFormFields: React.FC<FormFieldsProps> = ({ companyName, setCompanyName, customerName, setCustomerName, gender, setGender, contactNumber, setContactNumber, cityAddress, setCityAddress, 
  handleFileChange, editPost
}) => {
  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  return (
    <>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="companyname">Company Name</label>
        <input type="text" id="companyname" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="customername">Customer Name</label>
        <input type="text" id="customername" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="gender">Gender</label>
        <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-3 py-2 border rounded text-xs">
          <option value="">Select Gender</option>
          {genderOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="contactnumber">Contact Number</label>
        <input type="text" id="contactnumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="cityaddress">City Address</label>
        <input type="text" id="cityaddress" value={cityAddress} onChange={(e) => setCityAddress(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
    </>
  );
};

export default AccountFormFields;
