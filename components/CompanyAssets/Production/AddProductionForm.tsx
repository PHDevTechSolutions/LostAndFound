"use client";

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./ProductionFormFields";

import { HiOutlineCheck, HiXMark, HiOutlinePencil } from "react-icons/hi2";

interface AddContainerProps {
  onCancel: () => void;
  refreshPosts: () => void;
  userName: string;
  editData?: any;
  Location: string;
}

const AddContainerForm: React.FC<AddContainerProps> = ({ onCancel, refreshPosts, userName, editData, Location: propLocation }) => {
  const [Location, setLocation] = useState(editData?.Location || propLocation || "");
  const [ReferenceNumber, setReferenceNumber] = useState(editData?.ReferenceNumber || "");

  const [DateRecord, setDateRecord] = useState(editData?.DateRecord || "");
  const [ModeType, setModeType] = useState(editData?.ModeType || "");
  const [Amount, setAmount] = useState(editData?.Amount || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editData ? `/api/CompanyAssets/Production/EditRecord` : `/api/CompanyAssets/Production/CreateRecord`;
    const method = editData ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ReferenceNumber, Location, DateRecord, ModeType, Amount,
        userName,
        id: editData?._id,
      }),
    });

    if (response.ok) {
      toast.success(editData ? "Data updated successfully" : "Data added successfully", {
        autoClose: 1000,
        onClose: () => {
          onCancel();
          refreshPosts();
        },
      });
    } else {
      toast.error(editData ? "Failed to Update Data" : "Failed to Add Data", {
        autoClose: 1000,
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
        <h2 className="text-xs font-bold mb-4">{editData ? "Edit Record" : "Add Record"}</h2>
        <FormFields
          Location={Location} setLocation={setLocation}
          ReferenceNumber={ReferenceNumber} setReferenceNumber={setReferenceNumber}

          DateRecord={DateRecord} setDateRecord={setDateRecord}
          ModeType={ModeType} setModeType={setModeType}
          Amount={Amount} setAmount={setAmount}

          editData={editData}
        />
        <div className="flex justify-between">
          <button type="submit" className="hover:bg-blue-900 bg-[#143c66] text-white px-4 py-2 rounded text-xs flex gap-1">
            {editData ? (
              <>
                <HiOutlinePencil size={14} />
                Update
              </>
            ) : (
              <>
                <HiOutlineCheck size={14} />
                Submit
              </>
            )}
          </button>
          <button type="button" className="hover:bg-gray-100 bg-white border px-4 py-2 rounded text-xs flex gap-1" onClick={onCancel}>
            <HiXMark size={15} /> Cancel
          </button>
        </div>
      </form>
      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default AddContainerForm;
