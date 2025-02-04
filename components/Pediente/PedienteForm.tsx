"use client";

import React, { useState } from "react";
import UserFields from "./PedienteFormFields";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


// Not For Creating Data
interface PedienteFormProps {
    onCancel: () => void;
    refreshUser: () => void;
    userName: any; 
    editPost?: any;
}
// End

const PedienteForm: React.FC<PedienteFormProps> = ({ onCancel, refreshUser, editPost}) => {
    const [userName, setuserName] = useState(editPost ? editPost.userName : "");

    const [DateOrder, setDateOrder] = useState(editPost ? editPost.DateOrder : "");
    const [BuyersName, setBuyersName] = useState(editPost ? editPost.BuyersName : "");
    const [PlaceSales, setPlaceSales] = useState(editPost ? editPost.PlaceSales : "");
    const [ContainerNo, setContainerNo] = useState(editPost ? editPost.ContainerNo : "");
    const [Size, setSize] = useState(editPost ? editPost.Size : "");
    const [BoxSales, setBoxSales] = useState(editPost ? editPost.BoxSales : "");
    const [Price, setPrice] = useState(editPost ? editPost.Price : "");
    const [GrossSales, setGrossSales] = useState(editPost ? editPost.GrossSales : "");
    const [PayAmount, setPayAmount] = useState(editPost ? editPost.PayAmount : "");
    const [BalanceAmount, setBalanceAmount] = useState(editPost ? editPost.BalanceAmount : "");
    const [Status, setStatus] = useState<string>(editPost ? editPost.Status : "");

    const [paymentHistory, setPaymentHistory] = useState<{ amount: string; status: string; date: string; containerNo: string; buyersName: string; _id: string; }[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editPost ? `/api/Pediente/EditPediente` : `/api/User/CreateUser`;
        const method = editPost ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify({
                userName,
                DateOrder,
                BuyersName,
                PlaceSales,
                ContainerNo,
                Size,
                BoxSales,
                Price,
                GrossSales,
                PayAmount,
                BalanceAmount,
                Status,
                id: editPost ? editPost._id : undefined,
            }),
        });

        if (response.ok) {
            toast.success(editPost ? "Data updated successfully" : "Data added successfully", {
              autoClose: 1000,
              onClose: () => {
                onCancel(); // Hide the form after submission
                refreshUser(); // Refresh accounts after successful submission
              }
            });
          } else {
            toast.error(editPost ? "Failed to Update Data" : "Failed to Add Data", {
              autoClose: 1000
            });
          }
        };

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
            <h2 className="text-xs font-bold mb-4">{editPost ? "Edit Buyer's Information" : "Add User"}</h2>
                <UserFields 
                userName={userName} setuserName={setuserName}
                DateOrder={DateOrder} setDateOrder={setDateOrder}
                BuyersName={BuyersName} setBuyersName={setBuyersName}
                PlaceSales={PlaceSales} setPlaceSales={setPlaceSales}
                ContainerNo={ContainerNo} setContainerNo={setContainerNo}
                Size={Size} setSize={setSize}
                BoxSales={BoxSales} setBoxSales={setBoxSales}
                Price={Price} setPrice={setPrice}
                GrossSales={GrossSales} setGrossSales={setGrossSales}
                PayAmount={PayAmount} setPayAmount={setPayAmount}
                BalanceAmount={BalanceAmount} setBalanceAmount={setBalanceAmount}
                Status={Status} setStatus={setStatus}
                paymentHistory={paymentHistory} setPaymentHistory={setPaymentHistory}
                editPost={editPost}
                />
                <div className="flex justify-between">
                    <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded text-xs" onClick={onCancel}>Cancel</button>
                </div>
                <ToastContainer className="text-xs" autoClose={900} />
            </form>
        </>
    );

};


export default PedienteForm;