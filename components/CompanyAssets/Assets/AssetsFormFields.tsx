import React, { useState, useEffect } from "react";

interface FormFieldsProps {
    //Location Tagging
    Location: string; setLocation: (value: string) => void;
    ReferenceNumber: string; setReferenceNumber: (value: string) => void;

    DatePurchased: string; setDatePurchased: (value: string) => void;
    SupplierBrand: string; setSupplierBrand: (value: string) => void;
    ItemPurchased: string; setItemPurchased: (value: string) => void;
    Type: string; setType: (value: string) => void;
    Quantity: string; setQuantity: (value: string) => void;
    PurchasedAmount: string; setPurchasedAmount: (value: string) => void;

    editData?: any;
}

const ContainerFormFields: React.FC<FormFieldsProps> = ({
    //Location Tagging
    Location, setLocation,
    ReferenceNumber, setReferenceNumber,

    DatePurchased, setDatePurchased,
    SupplierBrand, setSupplierBrand,
    ItemPurchased, setItemPurchased,
    Type, setType,
    Quantity, setQuantity,
    PurchasedAmount, setPurchasedAmount,

    editData,
}) => {

    const generateReferenceNumber = () => {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase(); // Random letters and numbers
        const randomNumber = Math.floor(Math.random() * 1000); // Random number between 0-999
        return `JJV-${randomString}-${randomNumber}`;
    };

    useEffect(() => {
        // Set initial ReferenceNumber on component mount
        setReferenceNumber(generateReferenceNumber());
    }, []);


    return (
        <>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="DatePurchased">Date Purchased</label>
                    <input type="date" id="DatePurchased" value={DatePurchased || ""} onChange={(e) => setDatePurchased(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                    <input type="hidden" id="Location" value={Location || ""} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
                    <input type="hidden" id="ReferenceNumber" value={ReferenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="SupplierBrand">Supplier / Brand</label>
                    <input type="text" id="SupplierBrand" value={SupplierBrand || ""} onChange={(e) => setSupplierBrand(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ItemPurchased">Name of Item Purchased</label>
                    <input type="text" id="ItemPurchased" value={ItemPurchased || ""} onChange={(e) => setItemPurchased(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Type">Type</label>
                    <select value={Type || ""} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required>
                        <option value="">Select Type</option>
                        <option value="Office Supplies">Office Supplies</option>
                        <option value="Office Furnitures">Office Furnitures</option>
                        <option value="Office Appliances">Office Appliances</option>
                    </select>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Quantity">Quantity</label>
                    <input type="text" id="Quantity" value={Quantity || ""} onChange={(e) => setQuantity(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="PurchasedAmount">Purhased Amount</label>
                    <input type="text" id="PurchasedAmount" value={PurchasedAmount || ""} onChange={(e) => setPurchasedAmount(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" />
                </div>
            </div>
        </>
    );
};

export default ContainerFormFields;
