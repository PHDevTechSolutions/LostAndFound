import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface ContainerOrderFormFieldsProps {
    onCancel: () => void;
    fetchData: () => void;
}

const ContainerOrderFormFields: React.FC<ContainerOrderFormFieldsProps> = ({ onCancel, fetchData }) => {
    const [ContainerNo, setContainerNo] = useState("");
    const [BoxType, setBoxType] = useState("");
    const [DateOrder, setDateOrder] = useState("");
    const [BuyersName, setBuyersName] = useState("");
    const [BoxSales, setBoxSales] = useState("");
    const [Price, setPrice] = useState("");
    const [editData, setEditData] = useState<any>(null); // Add proper type

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editData ? `/api/Container/UpdateContainer` : `/api/Container/SaveContainer`;
        const method = editData ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ContainerNo, BoxType, DateOrder, BuyersName, BoxSales, Price,
                id: editData ? (editData as { _id: string })._id : undefined,
            }),
        });

        if (response.ok) {
            toast.success(editData ? "Data updated successfully" : "Data added successfully", {
                autoClose: 1000,
                onClose: () => {
                    fetchData(); // Fetch data again after submission
                    resetForm();
                }
            });
        } else {
            toast.error(editData ? "Failed to Update Data" : "Failed to Add Data", {
                autoClose: 1000
            });
        }
    };

    const resetForm = () => {
        setContainerNo("");
        setBoxType("");
        setDateOrder("");
        setBuyersName("");
        setBoxSales("");
        setPrice("");
        setEditData(null);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 flex-grow-0 basis-[30%]">
            <h2 className="text-sm font-semibold text-center text-gray-700 mb-6">
                Container Van No. {ContainerNo}
            </h2>
            <form onSubmit={handleSubmit}>
                <input id="containerNo" type="hidden" value={ContainerNo} onChange={(e) => setContainerNo(e.target.value)} />
                <div className="mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="BoxType">Box Type</label>
                    <select id="BoxType" value={BoxType} onChange={(e) => setBoxType(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
                        <option value="">Select Box</option>
                        <option value="Brown Box">Brown Box</option>
                        <option value="White Box">White Box</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="DateOrder">Date</label>
                    <input type="date" id="DateOrder" value={DateOrder} onChange={(e) => setDateOrder(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
                </div>
                <div className="mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="BuyersName">Buyer's Name</label>
                    <input type="text" id="BuyersName" value={BuyersName} onChange={(e) => setBuyersName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
                </div>
                <div className="mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="BoxSales">Box Sales</label>
                    <input type="number" id="BoxSales" value={BoxSales} onChange={(e) => setBoxSales(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
                </div>
                <div className="mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Price">Price</label>
                    <input type="number" id="Price" value={Price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
                </div>
                <div className="flex justify-between">
                    <button type="button" onClick={onCancel} className="text-xs text-white bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded-md focus:outline-none">Cancel</button>
                    <div className="flex gap-2">
                        <button type="submit" className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md focus:outline-none">{editData ? "Update" : "Save"}</button>
                        <button type="button" onClick={resetForm} className="text-xs text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md focus:outline-none">Reset</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ContainerOrderFormFields;
