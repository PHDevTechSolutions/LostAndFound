"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./ActivityFormFields";

interface AddAccountFormProps { 
  onCancel: () => void; 
  refreshPosts: () => void;  // Add a refreshPosts callback
  userName: string; 
  editPost?: any; // Optional prop for the post being edited
}

const AddAccountForm: React.FC<AddAccountFormProps> = ({ onCancel, refreshPosts, userName, editPost }) => {
  const [companyName, setCompanyName] = useState(editPost ? editPost.companyName : "");
  const [customerName, setCustomerName] = useState(editPost ? editPost.customerName : "");
  const [gender, setGender] = useState(editPost ? editPost.gender : "");
  const [contactNumber, setContactNumber] = useState(editPost ? editPost.contactNumber : "");
  const [cityAddress, setCityAddress] = useState(editPost ? editPost.cityAddress : "");
  const [channel, setChannel] = useState(editPost ? editPost.channel : "");
  const [wrapUp, setWrapUp] = useState(editPost ? editPost.wrapUp : "");
  const [source, setSource] = useState(editPost ? editPost.source : "");
  const [customerType, setCustomerType] = useState(editPost ? editPost.customerType : "");
  const [customerStatus, setCustomerStatus] = useState(editPost ? editPost.customerStatus : "");
  const [cStatus, setCstatus] = useState(editPost ? editPost.cStatus : "");
  const [orderNumber, setOrderNumber] = useState(editPost ? editPost.orderNumber : "");
  const [amount, setAmount] = useState(editPost ? editPost.amount : "");
  const [qtySold, setQtySold] = useState(editPost ? editPost.qtySold : "");
  const [salesManager, setSalesManager] = useState(editPost ? editPost.salesManager : "");
  const [salesAgent, setSalesAgent] = useState(editPost ? editPost.salesAgent : "");
  const [ticketReceived, setTicketReceived] = useState(editPost ? editPost.ticketReceived: "");
  const [ticketEndorsed, setTicketEndorsed] = useState(editPost ? editPost.ticketEndorsed: "");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editPost ? `/api/monitoring/editActivity` : `/api/monitoring/createActivity`; // API endpoint changes based on edit or add
    const method = editPost ? "PUT" : "POST"; // HTTP method changes based on edit or add

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        companyName, customerName, gender, contactNumber, cityAddress, channel, wrapUp, source, customerType, customerStatus, cStatus, orderNumber, amount, qtySold, salesManager, salesAgent, ticketReceived, ticketEndorsed,
        id: editPost ? editPost._id : undefined, // Send post ID if editing
      }),
    });

    if (response.ok) {
      toast.success(editPost ? "Account updated successfully" : "Account added successfully", {
        autoClose: 1000,
        onClose: () => {
          onCancel(); // Hide the form after submission
          refreshPosts(); // Refresh accounts after successful submission
        }
      });
    } else {
      toast.error(editPost ? "Failed to update account" : "Failed to add account", {
        autoClose: 1000
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
        <h2 className="text-xs font-bold mb-4">{editPost ? "Edit Account" : "Add New Account"}</h2>
        <FormFields
          companyName={companyName}
          setCompanyName={setCompanyName}
          customerName={customerName}
          setCustomerName={setCustomerName}
          gender={gender}
          setGender={setGender}
          contactNumber={contactNumber}
          setContactNumber={setContactNumber}
          cityAddress={cityAddress}
          setCityAddress={setCityAddress}
          channel={channel}
          setChannel={setChannel}
          wrapUp={wrapUp}
          setWrapUp={setWrapUp}
          source={source}
          setSource={setSource}
          customerType={customerType}
          setCustomerType={setCustomerType}
          customerStatus={customerStatus}
          setCustomerStatus={setCustomerStatus}
          cStatus={cStatus}
          setCstatus={setCstatus}
          orderNumber={orderNumber}
          setOrderNumber={setOrderNumber}
          amount={amount}
          setAmount={setAmount}
          qtySold={qtySold}
          setQtySold={setQtySold}
          salesManager={salesManager}
          setSalesManager={setSalesManager}
          salesAgent={salesAgent}
          setSalesAgent={setSalesAgent}
          ticketReceived={ticketReceived}
          setTicketReceived={setTicketReceived}
          ticketEndorsed={ticketEndorsed}
          setTicketEndorsed={setTicketEndorsed}
          editPost={editPost}
        />
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded text-xs">{editPost ? "Update" : "Submit"}</button>
          <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded text-xs" onClick={onCancel}>Cancel</button>
        </div>
      </form>
      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default AddAccountForm;

