"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./ContainerFormFields";

interface AddContainerProps { 
  onCancel: () => void; 
  refreshPosts: () => void;  // Add a refreshPosts callback
  userName: string; 
  editData?: any; // Optional prop for the post being edited
}

const AddContainerForm: React.FC<AddContainerProps> = ({ onCancel, refreshPosts, editData }) => {
  const [Vendor, setVendor] = useState(editData ? editData.Vendor : "");
  const [SpsicNo, setSpsicNo] = useState(editData ? editData.SpsicNo: "");
  const [DateArrived, setDateArrived] = useState(editData ? editData.DateArrived: "");
  const [DateSoldout, setDateSoldout] = useState(editData ? editData.DateSoldout: "");
  const [SupplierName, setSupplierName] = useState(editData ? editData.SupplierName: "");
  const [ContainerNo, setContainerNo] = useState(editData ? editData.ContainerNo: "");
  const [Country, setCountry] = useState(editData ? editData.Country: "");
  const [Beginning, setBeginning] = useState(editData ? editData.Beginning: "");
  const [Commodity, setCommodity] = useState(editData ? editData.Commodity: "");
  const [Size, setSize] = useState(editData ? editData.Size: "");
  const [Freezing, setFreezing] = useState(editData ? editData.Freezing: "");
  const [Remarks, setRemarks] = useState(editData ? editData.Remarks: "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editData ? `/api/Container/EditContainer` : `/api/Container/CreateContainer`; // API endpoint changes based on edit or add
    const method = editData ? "PUT" : "POST"; // HTTP method changes based on edit or add

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Vendor, SpsicNo, DateArrived, DateSoldout, SupplierName, ContainerNo, Country, Beginning, Commodity, Size, Freezing, Remarks,
        id: editData ? editData._id : undefined, // Send post ID if editing
      }),
    });

    if (response.ok) {
      toast.success(editData ? "Data updated successfully" : "Data added successfully", {
        autoClose: 1000,
        onClose: () => {
          onCancel(); // Hide the form after submission
          refreshPosts(); // Refresh accounts after successful submission
        }
      });
    } else {
      toast.error(editData ? "Failed to Update Data" : "Failed to Add Data", {
        autoClose: 1000
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
        <h2 className="text-xs font-bold mb-4">{editData ? "Edit Container" : "Add Container"}</h2>
        <FormFields
          Vendor={Vendor} setVendor={setVendor}
          SpsicNo={SpsicNo} setSpsicNo={setSpsicNo}
          DateArrived={DateArrived} setDateArrived={setDateArrived}
          DateSoldout={DateSoldout} setDateSoldout={setDateSoldout}
          SupplierName={SupplierName} setSupplierName={setSupplierName}
          ContainerNo={ContainerNo} setContainerNo={setContainerNo}
          setCountry={setCountry} Country={Country}
          setBeginning={setBeginning} Beginning={Beginning}
          setCommodity={setCommodity} Commodity={Commodity}
          setSize={setSize} Size={Size}
          setFreezing={setFreezing} Freezing={Freezing}
          setRemarks={setRemarks} Remarks={Remarks}
          editData={editData}
        />
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded text-xs">{editData ? "Update" : "Submit"}</button>
          <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded text-xs" onClick={onCancel}>Cancel</button>
        </div>
      </form>
      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default AddContainerForm;
