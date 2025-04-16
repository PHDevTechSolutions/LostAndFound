"use client";

import React, { useEffect } from "react";
import { HiOutlineCheck, HiXMark, HiOutlinePencil } from "react-icons/hi2";
import { HiOutlineRefresh } from "react-icons/hi";


interface OrderFormFieldsProps {
    ContainerNo: string;
    setContainerNo: React.Dispatch<React.SetStateAction<string>>;

    ReferenceNumber: string;
    setReferenceNumber: React.Dispatch<React.SetStateAction<string>>;

    ContainerType: string;
    setContainerType: React.Dispatch<React.SetStateAction<string>>;
    Size: string;
    setSize: React.Dispatch<React.SetStateAction<string>>;
    Commodity: string;
    setCommodity: React.Dispatch<React.SetStateAction<string>>;
    userName: string;
    setuserName: React.Dispatch<React.SetStateAction<string>>;
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
    Boxes: string;
    setBoxes: React.Dispatch<React.SetStateAction<string>>;

    GrossSales: string;
    setGrossSales: React.Dispatch<React.SetStateAction<string>>;

    PlaceSales: string;
    setPlaceSales: React.Dispatch<React.SetStateAction<string>>;
    PaymentMode: string;
    setPaymentMode: React.Dispatch<React.SetStateAction<string>>;

    Freezing: string;
    setFreezing: React.Dispatch<React.SetStateAction<string>>;

    editData: any;
    onCancel: () => void;
    handleSubmit: (e: React.FormEvent) => void;
}

const OrderFormFields: React.FC<OrderFormFieldsProps> = ({
    ReferenceNumber, setReferenceNumber, ContainerNo, setContainerNo, ContainerType, setContainerType, Commodity, setCommodity, Size, setSize,
    userName, setuserName, Location, setLocation,
    DateOrder, setDateOrder, BuyersName, setBuyersName,
    BoxSales, setBoxSales, handleBoxSalesChange, Price, setPrice,
    handlePriceChange, Boxes, setBoxes, GrossSales, setGrossSales,
    PlaceSales, setPlaceSales, PaymentMode, setPaymentMode, Freezing, setFreezing,
    editData, onCancel, handleSubmit,
}) => {

    const handleReset = () => {
        setDateOrder("");
        setBuyersName("");
        setBoxSales("");
        setPrice("");
        setGrossSales("");
        setPaymentMode("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="hidden" id="ReferenceNumber" value={ReferenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} disabled={!!editData} className="w-full px-3 py-2 border rounded text-xs mb-4" />
            <input type="hidden" id="containerNo" value={ContainerNo} onChange={(e) => setContainerNo(e.target.value)} disabled={!!editData} className="w-full px-3 py-2 border rounded text-xs mb-4" />
            <input type="hidden" id="ContainerType" value={ContainerType} onChange={(e) => setContainerType(e.target.value)} disabled={!!editData} className="w-full px-3 py-2 border rounded text-xs mb-4" />
            <input type="hidden" id="Size" value={Size} onChange={(e) => setSize(e.target.value)} className="w-full px-3 py-2 border rounded text-xs mb-4" disabled />
            <input type="hidden" id="Commodity" value={Commodity} onChange={(e) => setCommodity(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" disabled />
            <input type="hidden" id="Username" value={userName} onChange={(e) => setuserName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />
            <input type="hidden" id="Location" value={Location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" disabled />
            <input type="hidden" id="Freezing" value={Freezing} onChange={(e) => setFreezing(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" disabled />

            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="DateOrder">Date</label>
                <input type="date" id="DateOrder" value={DateOrder} onChange={(e) => setDateOrder(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="BuyersName">Buyer's Name</label>
                <input type="text" id="BuyersName" value={BuyersName} onChange={(e) => setBuyersName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="BoxSales">Box Sales</label>
                <input type="number" id="BoxSales" value={BoxSales} onChange={handleBoxSalesChange} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="Price">Price</label>
                <input type="number" id="Price" value={Price} onChange={handlePriceChange} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="Remaining">Remaining Boxes</label>
                <input type="number" id="Boxes" value={Boxes} onChange={(e) => setBoxes(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="GrossSales">Gross Sales Per Day</label>
                <input type="text" id="GrossSales" value={GrossSales} onChange={(e) => setGrossSales(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" disabled />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-bold mb-2" htmlFor="PlaceSales">Place of Sales</label>
                <input id="PlaceSales" value={PlaceSales} onChange={(e) => setPlaceSales(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" disabled />
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
                <button type="button" onClick={onCancel} className="text-xs border bg-white hover:bg-gray-100 px-4 py-2 rounded-md flex gap-1"><HiXMark size={15} />Cancel</button>
                <div className="flex gap-2">
                    <button type="button" onClick={handleReset} className="text-xs text-white bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-md flex gap-1"><HiOutlineRefresh size={15} />Reset</button>
                    <button type="submit" className="text-xs text-white bg-[#143c66] hover:bg-blue-900 px-4 py-2 rounded-md flex gap-1">
                        {editData ? (
                            <>
                                <HiOutlinePencil size={14} />
                                Update
                            </>
                        ) : (
                            <>
                                <HiOutlineCheck size={14} />
                                Save
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default OrderFormFields;