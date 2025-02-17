"use client";

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./ContainerFormFields";

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
  const [SpsicNo, setSpsicNo] = useState(editData?.SpsicNo || "");
  const [DateArrived, setDateArrived] = useState(editData?.DateArrived || "");
  const [DateSoldout, setDateSoldout] = useState(editData?.DateSoldout || "");
  const [SupplierName, setSupplierName] = useState(editData?.SupplierName || "");

  const [ContainerNo, setContainerNo] = useState(editData?.ContainerNo || "");
  const [ContainerType, setContainerType] = useState(editData?.ContainerType || "");

  const [Country, setCountry] = useState(editData?.Country || "");
  const [Boxes, setBoxes] = useState(editData?.Boxes || "");
  const [TotalQuantity, setTotalQuantity] = useState(editData?.TotalQuantity || "");
  const [TotalGrossSales, setTotalGrossSales] = useState(editData?.TotalGrossSales || "");
  const [Commodity, setCommodity] = useState(editData?.Commodity || "");
  const [Size, setSize] = useState(editData?.Size || "");
  const [Freezing, setFreezing] = useState(editData?.Freezing || "");
  const [Status, setStatus] = useState(editData?.Status || "");
  const [BoxType, setBoxType] = useState(editData?.BoxType || "");
  const [Remarks, setRemarks] = useState(editData?.Remarks || "");

  const [PlaceSales, setPlaceSales] = useState(editData?.PlaceSales || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editData ? `/api/Container/EditContainer` : `/api/Container/CreateContainer`;
    const method = editData ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ReferenceNumber, Location, SpsicNo, DateArrived, DateSoldout, SupplierName, ContainerNo, ContainerType, Country, Boxes,
        TotalQuantity, TotalGrossSales, Commodity, Size, Freezing, Status, BoxType, Remarks, PlaceSales,
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
        <h2 className="text-xs font-bold mb-4">{editData ? "Edit Container" : "Add Container"}</h2>
        <FormFields
          Location={Location} setLocation={setLocation} 

          ReferenceNumber={ReferenceNumber} setReferenceNumber={setReferenceNumber}
          SpsicNo={SpsicNo} setSpsicNo={setSpsicNo}
          DateArrived={DateArrived} setDateArrived={setDateArrived}
          DateSoldout={DateSoldout} setDateSoldout={setDateSoldout}
          SupplierName={SupplierName} setSupplierName={setSupplierName}

          ContainerNo={ContainerNo} setContainerNo={setContainerNo}
          ContainerType={ContainerType} setContainerType={setContainerType}
          
          setCountry={setCountry} Country={Country}
          setTotalQuantity={setTotalQuantity} TotalQuantity={TotalQuantity}
          setTotalGrossSales={setTotalGrossSales} TotalGrossSales={TotalGrossSales}
          setBoxes={setBoxes} Boxes={Boxes}
          setCommodity={setCommodity} Commodity={Commodity}
          setSize={setSize} Size={Size}
          setFreezing={setFreezing} Freezing={Freezing}
          setStatus={setStatus} Status={Status}
          setBoxType={setBoxType} BoxType={BoxType}
          setRemarks={setRemarks} Remarks={Remarks}

          PlaceSales={PlaceSales} setPlaceSales={setPlaceSales}

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
