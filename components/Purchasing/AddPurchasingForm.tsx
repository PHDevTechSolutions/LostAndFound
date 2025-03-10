"use client";

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./PurchasingFormFields";

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
  
  const [InvoiceDate, setInvoiceDate] = useState(editData?.InvoiceDate || "");
  const [SupplierName, setSupplierName] = useState(editData?.SupplierName || "");
  const [InvoiceNumber, setInvoiceNumber] = useState(editData?.InvoiceNumber || "");
  const [Description, setDescription] = useState(editData?.Description || "");
  const [TypeFish, setTypeFish] = useState(editData?.TypeFish || "");
  const [Freezing, setFreezing] = useState(editData?.Freezing || "");
  const [Weight, setWeight] = useState(editData?.Weight || "");
  const [UnitPrice, setUnitPrice] = useState(editData?.UnitPrice || "");
  const [InvoiceAmount, setInvoiceAmount] = useState(editData?.InvoiceAmount || "");
  const [FirstPayment, setFirstPayment] = useState(editData?.FirstPayment || "");
  const [SecondPayment, setSecondPayment] = useState(editData?.SecondPayment || "");
  const [ThirdPayment, setThirdPayment] = useState(editData?.ThirdPayment || "");
  const [FinalPayment, setFinalPayment] = useState(editData?.FinalPayment || "");
  const [Discount, setDiscount] = useState(editData?.Discount || "");
  const [Commission, setCommission] = useState(editData?.Commission || "");
  const [CableFee, setCableFee] = useState(editData?.CableFee || "");
  const [DateApproval, setDateApproval] = useState(editData?.DateApproval || "");
  const [Status, setStatus] = useState(editData?.Status || "");
  const [Remarks, setRemarks] = useState(editData?.Remarks || "");
  const [Action, setAction] = useState(editData?.Action || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editData ? `/api/Purchasing/EditRecord` : `/api/Purchasing/CreateRecord`;
    const method = editData ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ReferenceNumber, Location, InvoiceDate, SupplierName, InvoiceNumber, Description, TypeFish, Freezing, Weight, UnitPrice, 
        InvoiceAmount, FirstPayment, SecondPayment, ThirdPayment, FinalPayment, Discount, Commission, CableFee, DateApproval, Status, Remarks, Action,
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

          SupplierName={SupplierName} setSupplierName={setSupplierName}
          InvoiceDate={InvoiceDate} setInvoiceDate={setInvoiceDate}
          InvoiceNumber={InvoiceNumber} setInvoiceNumber={setInvoiceNumber}
          Description={Description} setDescription={setDescription}
          TypeFish={TypeFish} setTypeFish={setTypeFish}
          Freezing={Freezing} setFreezing={setFreezing}
          Weight={Weight} setWeight={setWeight}
          UnitPrice={UnitPrice} setUnitPrice={setUnitPrice}
          InvoiceAmount={InvoiceAmount} setInvoiceAmount={setInvoiceAmount}
          FirstPayment={FirstPayment} setFirstPayment={setFirstPayment}
          SecondPayment={SecondPayment} setSecondPayment={setSecondPayment}
          ThirdPayment={ThirdPayment} setThirdPayment={setThirdPayment}
          FinalPayment={FinalPayment} setFinalPayment={setFinalPayment}
          Discount={Discount} setDiscount={setDiscount}
          Commission={Commission} setCommission={setCommission}
          CableFee={CableFee} setCableFee={setCableFee}
          DateApproval={DateApproval} setDateApproval={setDateApproval}
          Status={Status} setStatus={setStatus}
          Remarks={Remarks} setRemarks={setRemarks}
          Action={Action} setAction={setAction}

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
