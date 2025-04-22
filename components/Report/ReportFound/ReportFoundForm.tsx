"use client";

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./ReportFoundFormFields";
import { HiOutlineCheck, HiXMark, HiOutlinePencil } from "react-icons/hi2";

interface FormProps {
  onCancel: () => void;
  refreshPosts: () => void;
  userName: string;
  ItemFinder: string;
  editData?: any;
}

const Form: React.FC<FormProps> = ({ onCancel, refreshPosts, editData, ItemFinder: initialItemFinder, }) => {
  const [ReferenceNumber, setReferenceNumber] = useState(editData?.ReferenceNumber || "");
  const [Email, setEmail] = useState(editData?.Email || "");
  const [ItemFinder, setItemFinder] = useState(initialItemFinder);

  const [DateFound, setDateFound] = useState(editData?.DateFound || "");
  const [ItemName, setItemName] = useState(editData?.ItemName || "");
  const [FoundLocation, setFoundLocation] = useState(editData?.FoundLocation || "");
  const [Message, setMessage] = useState(editData?.Message || "");
  const [ItemOwner, setItemOwner] = useState(editData?.ItemOwner || "");
  const [ItemStatus, setItemStatus] = useState(editData?.ItemStatus || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editData ? `/api/Report/ReportFound/EditRecord` : `/api/Report/ReportFound/CreateRecord`;
    const method = editData ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ReferenceNumber, Email, DateFound, ItemName, FoundLocation, Message, ItemOwner, ItemFinder, ItemStatus,
        id: editData?._id,
      }),
    });

    if (response.ok) {
      toast.success(editData ? "Report Item Found Updated Successfully" : "Report Found Item Added Successfully", {
        autoClose: 1000,
        onClose: () => {
          onCancel();
          refreshPosts();
        },
      });
    } else {
      toast.error(editData ? "Failed to Update Report Item" : "Failed to Add Report Item", {
        autoClose: 1000,
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
        <h2 className="text-xs font-bold mb-4">{editData ? "Update or Change Record" : "Specify Report / Report Information"}</h2>
        <FormFields
          ReferenceNumber={ReferenceNumber} setReferenceNumber={setReferenceNumber}
          Email={Email} setEmail={setEmail}

          DateFound={DateFound} setDateFound={setDateFound}
          ItemName={ItemName} setItemName={setItemName}
          FoundLocation={FoundLocation} setFoundLocation={setFoundLocation}
          Message={Message} setMessage={setMessage}
          ItemOwner={ItemOwner} setItemOwner={setItemOwner}
          ItemFinder={ItemFinder} setItemFinder={setItemFinder}
          ItemStatus={ItemStatus} setItemStatus={setItemStatus}

          editData={editData}
        />
        <div className="flex justify-between">
          <button type="submit" className="bg-[#2563EB] hover:bg-blue-900 text-white px-4 py-2 rounded text-xs flex gap-1">
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
            <HiXMark size={15} />Cancel
          </button>
        </div>
      </form>
      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default Form;
