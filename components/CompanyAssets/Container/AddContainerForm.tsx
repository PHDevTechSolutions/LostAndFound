"use client";

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./ContainerFormFields";

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

  const [DateArrived, setDateArrived] = useState(editData?.DateArrived || "");
  const [DateSoldout, setDateSoldout] = useState(editData?.DateSoldout || "");
  const [SupplierName, setSupplierName] = useState(editData?.SupplierName || "");
  const [ContainerNo, setContainerNo] = useState(editData?.ContainerNo || "");
  const [PurchasePrice, setPurchasePrice] = useState(editData?.PurchasePrice || "");
  const [ShippingLine, setShippingLine] = useState(editData?.ShippingLine || "");
  const [BankCharges, setBankCharges] = useState(editData?.BankCharges || "");
  const [Brokerage, setBrokerage] = useState(editData?.Brokerage || "");
  const [OtherCharges, setOtherCharges] = useState(editData?.OtherCharges || "");
  const [BoarderExam, setBoarderExam] = useState(editData?.BoarderExam || "");
  const [ShippingLineRepresentation, setShippingLineRepresentation] = useState(editData?.ShippingLineRepresentation || "");
  const [Representation, setRepresentation] = useState(editData?.Representation || "");
  const [SPSApplicationFee, setSPSApplicationFee] = useState(editData?.SPSApplicationFee || "");
  const [TruckingCharges, setTruckingCharges] = useState(editData?.TruckingCharges || "");
  const [Intercommerce, setIntercommerce] = useState(editData?.Intercommerce || "");
  const [Erfi, setErfi] = useState(editData?.Erfi || "");
  const [SellingFee, setSellingFee] = useState(editData?.SellingFee || "");
  const [StorageOrca, setStorageOrca] = useState(editData?.StorageOrca || "");
  const [StorageBelen, setStorageBelen] = useState(editData?.StorageBelen || "");
  const [PowerCharges, setPowerCharges] = useState(editData?.PowerCharges || "");
  const [LoadingCharges, setLoadingCharges] = useState(editData?.LoadingCharges || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editData ? `/api/CompanyAssets/Container/EditContainer` : `/api/CompanyAssets/Container/CreateRecord`;
    const method = editData ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ReferenceNumber, Location, DateArrived, DateSoldout, SupplierName, ContainerNo, PurchasePrice, ShippingLine,
        BankCharges, Brokerage, OtherCharges, BoarderExam, ShippingLineRepresentation, Representation, SPSApplicationFee,
        TruckingCharges, Intercommerce, Erfi, SellingFee, StorageOrca, StorageBelen, PowerCharges, LoadingCharges, id: editData?._id,
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

          DateArrived={DateArrived} setDateArrived={setDateArrived}
          DateSoldout={DateSoldout} setDateSoldout={setDateSoldout}
          SupplierName={SupplierName} setSupplierName={setSupplierName}
          ContainerNo={ContainerNo} setContainerNo={setContainerNo}
          PurchasePrice={PurchasePrice} setPurchasePrice={setPurchasePrice}
          ShippingLine={ShippingLine} setShippingLine={setShippingLine}
          BankCharges={BankCharges} setBankCharges={setBankCharges}
          Brokerage={Brokerage} setBrokerage={setBrokerage}
          OtherCharges={OtherCharges} setOtherCharges={setOtherCharges}
          BoarderExam={BoarderExam} setBoarderExam={setBoarderExam}
          ShippingLineRepresentation={ShippingLineRepresentation} setShippingLineRepresentation={setShippingLineRepresentation}
          Representation={Representation} setRepresentation={setRepresentation}
          SPSApplicationFee={SPSApplicationFee} setSPSApplicationFee={setSPSApplicationFee}
          TruckingCharges={TruckingCharges} setTruckingCharges={setTruckingCharges}
          Intercommerce={Intercommerce} setIntercommerce={setIntercommerce}
          Erfi={Erfi} setErfi={setErfi}
          SellingFee={SellingFee} setSellingFee={setSellingFee}
          StorageOrca={StorageOrca} setStorageOrca={setStorageOrca}
          StorageBelen={StorageBelen} setStorageBelen={setStorageBelen}
          PowerCharges={PowerCharges} setPowerCharges={setPowerCharges}
          LoadingCharges={LoadingCharges} setLoadingCharges={setLoadingCharges}

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
            <HiXMark size={15} />Cancel
          </button>
        </div>
      </form>
      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default AddContainerForm;
