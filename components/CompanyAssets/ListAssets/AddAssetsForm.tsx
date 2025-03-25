"use client";

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./AssetsFormFields";

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
  
  const [DateBuy, setDateBuy] = useState(editData?.DateBuy || "");
  const [ItemPurchased, setItemPurchased] = useState(editData?.ItemPurchased || "");
  const [Type, setType] = useState(editData?.Type || "");
  const [Quantity, setQuantity] = useState(editData?.Quantity || "");
  const [AmountPrice, setAmountPrice] = useState(editData?.AmountPrice || "");
  const [AccumulatedDepreciation, setAccumulatedDepreciation] = useState(editData?.AccumulatedDepreciation || "");
  const [AdditionalAssets, setAdditionalAssets] = useState(editData?.AdditionalAssets || "");
  const [CoveredMonth, setCoveredMonth] = useState(editData?.CoveredMonth || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editData ? `/api/CompanyAssets/ListAssets/EditRecord` : `/api/CompanyAssets/ListAssets/CreateRecord`;
    const method = editData ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ReferenceNumber, Location, DateBuy, ItemPurchased, Type, Quantity, AmountPrice, AccumulatedDepreciation, AdditionalAssets, CoveredMonth,
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

          DateBuy={DateBuy} setDateBuy={setDateBuy}
          ItemPurchased={ItemPurchased} setItemPurchased={setItemPurchased}
          Type={Type} setType={setType}
          Quantity={Quantity} setQuantity={setQuantity}
          AmountPrice={AmountPrice} setAmountPrice={setAmountPrice}
          AccumulatedDepreciation={AccumulatedDepreciation} setAccumulatedDepreciation={setAccumulatedDepreciation}
          AdditionalAssets={AdditionalAssets} setAdditionalAssets={setAdditionalAssets}
          CoveredMonth={CoveredMonth} setCoveredMonth={setCoveredMonth}
    
          editData={editData}
        />
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded text-xs">
            {editData ? "Update" : "Submit"}
          </button>
          <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded text-xs" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default AddContainerForm;
