"use client";

import React from "react";

interface OrderFormFieldsProps {
    ContainerNo: string;
    setContainerNo: React.Dispatch<React.SetStateAction<string>>;
    BoxType: string;
    setBoxType: React.Dispatch<React.SetStateAction<string>>;
    Username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    Location: string;
    setLocation: React.Dispatch<React.SetStateAction<string>>;
    DateOrder: string;
    setDateOrder: React.Dispatch<React.SetStateAction<string>>;
    BuyersName: string;
    setBuyersName: React.Dispatch<React.SetStateAction<string>>;
    BoxSales: string;
    setBoxSales: React.Dispatch<React.SetStateAction<string>>;
    handleBoxSalesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    Price: string;
    setPrice: React.Dispatch<React.SetStateAction<string>>;
    handlePriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    Beginning: string;
    setBeginning: React.Dispatch<React.SetStateAction<string>>;
    GrossSales: string;
    setGrossSales: React.Dispatch<React.SetStateAction<string>>;
    PlaceSales: string;
    setPlaceSales: React.Dispatch<React.SetStateAction<string>>;
    PaymentMode: string;
    setPaymentMode: React.Dispatch<React.SetStateAction<string>>;
    editData: any;
    onCancel: () => void;
    handleSubmit: (e: React.FormEvent) => void;
    resetForm: () => void;
}

const OrderFormFields: React.FC<OrderFormFieldsProps> = ({
    ContainerNo,
    setContainerNo,
    BoxType,
    setBoxType,
    Username,
    setUsername,
    Location,
    setLocation,
    DateOrder,
    setDateOrder,
    BuyersName,
    setBuyersName,
    BoxSales,
    setBoxSales,
    handleBoxSalesChange,
    Price,
    setPrice,
    handlePriceChange,
    Beginning,
    setBeginning,
    GrossSales,
    setGrossSales,
    PlaceSales,
    setPlaceSales,
    PaymentMode,
    setPaymentMode,
    editData,
    onCancel,
    handleSubmit,
    resetForm
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <input id="containerNo" type="hidden" value={ContainerNo} onChange={(e) => setContainerNo(e.target.value)} disabled={!!editData} className="w-full px-3 py-2 border rounded text-xs mb-4" placeholder="Enter Container No." />
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="BoxType">Box Type</label>
                <select id="BoxType" value={BoxType} onChange={(e) => setBoxType(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
                    <option value="">Select Box</option>
                    <option value="Brown Box">Brown Box</option>
                    <option value="White Box">White Box</option>
                </select>
            </div>
            <div className="mb-4">
                <input type="hidden" id="Username" value={Username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" disabled />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="Location">Warehouse Location</label>
                <select id="Location" value={Location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
                    <option value="">Select Location</option>
                    <option value="Navotas">Navotas</option>
                    <option value="Sambat">Sambat</option>
                    <option value="Minalin">Minalin</option>
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
                <input type="text" id="BoxSales" value={BoxSales} onChange={handleBoxSalesChange} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="Price">Price</label>
                <input type="number" id="Price" value={Price} onChange={handlePriceChange} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="Remaining">Remaining Boxes</label>
                <input type="number" id="Remaining" value={Beginning} onChange={(e) => setBeginning(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="GrossSales">Gross Sales Per Day</label>
                <input type="text" id="GrossSales" value={GrossSales} onChange={(e) => setGrossSales(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="PlaceSales">Place of Sales</label>
                <input type="text" id="PlaceSales" value={PlaceSales} onChange={(e) => setPlaceSales(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="PaymentMode">Mode of Payment</label>
                <select id="PaymentMode" value={PaymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required >
                    <option value="">Select Mode</option>
                    <option value="Cash">Cash</option>
                    <option value="PDC">PDC</option>
                </select>
            </div>
            <div className="flex justify-between">
                <button type="button" onClick={onCancel} className="text-xs text-white bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded-md">Cancel</button>
                <div className="flex gap-2">
                    <button type="submit" className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">{editData ? "Update" : "Save"}</button>
                    <button type="button" onClick={resetForm} className="text-xs text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md">Reset</button>
                </div>
            </div>
        </form>
    );
};

export default OrderFormFields;
