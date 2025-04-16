"use client";

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./PettyCashFormFields";

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

  const [PettyCashDate, setPettyCashDate] = useState(editData?.PettyCashDate || "");
  const [Payee, setPayee] = useState(editData?.Payee || "");
  const [Particular, setParticular] = useState(editData?.Particular || "");
  const [Amount, setAmount] = useState(editData?.Amount || "");
  const [Transpo, setTranspo] = useState(editData?.Transpo || "");
  const [MealsTranspo, setMealsTranspo] = useState(editData?.MealsTranspo || "");
  const [NotarialFee, setNotarialFee] = useState(editData?.NotarialFee || "");
  const [Misc, setMisc] = useState(editData?.Misc || "");
  const [ProdSupplies, setProdSupplies] = useState(editData?.ProdSupplies || "");
  const [Advances, setAdvances] = useState(editData?.Advances || "");
  const [TollFee, setTollFee] = useState(editData?.TollFee || "");
  const [Parking, setParking] = useState(editData?.Parking || "");
  const [Gasoline, setGasoline] = useState(editData?.Gasoline || "");
  const [Tax, setTax] = useState(editData?.Tax || "");
  const [Supplies, setSupplies] = useState(editData?.Supplies || "");
  const [Communication, setCommunication] = useState(editData?.Communication || "");
  const [Utilities, setUtilities] = useState(editData?.Utilities || "");
  const [Repairs, setRepairs] = useState(editData?.Repairs || "");
  const [ServiceCharges, setServiceCharges] = useState(editData?.ServiceCharges || "");
  const [Remarks, setRemarks] = useState(editData?.Remarks || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editData ? `/api/CompanyAssets/PettyCash/EditRecord` : `/api/CompanyAssets/PettyCash/CreateRecord`;
    const method = editData ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ReferenceNumber, Location, PettyCashDate, Payee, Particular, Amount, Transpo, MealsTranspo, NotarialFee, Misc, ProdSupplies, Advances, TollFee,
        Parking, Gasoline, Tax, Supplies, Communication, Utilities, Repairs, ServiceCharges, Remarks, id: editData?._id,
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

          PettyCashDate={PettyCashDate} setPettyCashDate={setPettyCashDate}
          Payee={Payee} setPayee={setPayee}
          Particular={Particular} setParticular={setParticular}
          Amount={Amount} setAmount={setAmount}
          Transpo={Transpo} setTranspo={setTranspo}
          MealsTranspo={MealsTranspo} setMealsTranspo={setMealsTranspo}
          NotarialFee={NotarialFee} setNotarialFee={setNotarialFee}
          Misc={Misc} setMisc={setMisc}
          ProdSupplies={ProdSupplies} setProdSupplies={setProdSupplies}
          Advances={Advances} setAdvances={setAdvances}
          TollFee={TollFee} setTollFee={setTollFee}
          Parking={Parking} setParking={setParking}
          Gasoline={Gasoline} setGasoline={setGasoline}
          Tax={Tax} setTax={setTax}
          Supplies={Supplies} setSupplies={setSupplies}
          Communication={Communication} setCommunication={setCommunication}
          Utilities={Utilities} setUtilities={setUtilities}
          Repairs={Repairs} setRepairs={setRepairs}
          ServiceCharges={ServiceCharges} setServiceCharges={setServiceCharges}
          Remarks={Remarks} setRemarks={setRemarks}

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
