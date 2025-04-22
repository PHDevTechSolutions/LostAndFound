"use client";

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./ApprovalFormFields";
import { HiOutlineCheck, HiXMark, HiOutlinePencil } from "react-icons/hi2";

interface FormProps {
  onCancel: () => void;
  refreshPosts: () => void;
  userName: string;
  editData?: any;
}

const Form: React.FC<FormProps> = ({ onCancel, refreshPosts, editData }) => {
  const [ReferenceNumber, setReferenceNumber] = useState(editData?.ReferenceNumber || "");

  const [DateLost, setDateLost] = useState(editData?.DateLost || "");
  const [ItemName, setItemName] = useState(editData?.ItemName || "");
  const [ItemQuantity, setItemQuantity] = useState(editData?.ItemQuantity || "");
  const [ItemCategories, setItemCategories] = useState(editData?.ItemCategories || "");
  const [ItemDescription, setItemDescription] = useState(editData?.ItemDescription || "");
  const [ItemOwner, setItemOwner] = useState(editData?.ItemOwner || "");
  const [ContactNumber, setContactNumber] = useState(editData?.ContactNumber || "");
  const [RoomSection, setRoomSection] = useState(editData?.RoomSection || "");
  const [Department, setDepartment] = useState(editData?.Department || "");
  const [ItemStatus, setItemStatus] = useState(editData?.ItemStatus || "");
  const [ItemProgress, setItemProgress] = useState(editData?.ItemProgress || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editData ? `/api/Report/ReportItems/EditRecord` : `/api/Report/ReportItems/CreateRecord`;
    const method = editData ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ReferenceNumber, DateLost, ItemName, ItemQuantity, ItemCategories, ItemDescription, ItemOwner, ContactNumber, RoomSection, Department, ItemStatus, ItemProgress,
        id: editData?._id,
      }),
    });

    if (response.ok) {
      toast.success(editData ? "Report Item Updated Successfully" : "Report Item Added Successfully", {
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

          DateLost={DateLost} setDateLost={setDateLost}
          ItemName={ItemName} setItemName={setItemName}
          ItemQuantity={ItemQuantity} setItemQuantity={setItemQuantity}
          ItemCategories={ItemCategories} setItemCategories={setItemCategories}
          ItemDescription={ItemDescription} setItemDescription={setItemDescription}
          ItemOwner={ItemOwner} setItemOwner={setItemOwner}
          ContactNumber={ContactNumber} setContactNumber={setContactNumber}
          RoomSection={RoomSection} setRoomSection={setRoomSection}
          Department={Department} setDepartment={setDepartment}
          ItemStatus={ItemStatus} setItemStatus={setItemStatus}
          ItemProgress={ItemProgress} setItemProgress={setItemProgress}

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
