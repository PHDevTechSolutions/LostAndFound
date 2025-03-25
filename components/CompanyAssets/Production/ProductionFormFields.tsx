import React, { useState, useEffect } from "react";

interface FormFieldsProps {
    //Location Tagging
    Location: string; setLocation: (value: string) => void;
    ReferenceNumber: string; setReferenceNumber: (value: string) => void;

    DateRecord: string; setDateRecord: (value: string) => void;
    ModeType: string; setModeType: (value: string) => void;
    Amount: string; setAmount: (value: string) => void;

    editData?: any;
}

const ContainerFormFields: React.FC<FormFieldsProps> = ({
    //Location Tagging
    Location, setLocation,
    ReferenceNumber, setReferenceNumber,

    DateRecord, setDateRecord,
    ModeType, setModeType,
    Amount, setAmount,
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
                    <label className="block text-xs font-bold mb-2" htmlFor="DateRecord">Date</label>
                    <input type="date" id="DateRecord" value={DateRecord || ""} onChange={(e) => setDateRecord(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                    <input type="hidden" id="Location" value={Location || ""} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
                    <input type="hidden" id="ReferenceNumber" value={ReferenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ModeType">Type</label>
                    <select value={ModeType || ""} onChange={(e) => setModeType(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required>
                        <option value="">Select Type</option>
                        <option value="Purchases - Supplies">Purchases - Supplies</option>
                        <option value="Purchases - Packaging">Purchases - Packaging</option>
                        <option value="Salaries & Wages">Salaries & Wages</option>
                        <option value="Repairs & Maintenance - Car">Repairs & Maintenance - Car</option>
                        <option value="Repairs & Maintenance - Tools">Repairs & Maintenance - Tools</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Office Supplies">Office Supplies</option>
                        <option value="Allowances">Allowances</option>
                        <option value="Transpo & Travel">Transpo & Travel</option>
                        <option value="Travel-Toll Fees & Parking">Travel-Toll Fees & Parking</option>
                        <option value="Fuel & Oil">Fuel & Oil</option>
                        <option value="Cleaning & Disinfecting">Cleaning & Disinfecting</option>
                        <option value="Consultancy Fee">Consultancy Fee</option>
                        <option value="Meals">Meals</option>
                        <option value="Rental - Car">Rental - Car</option>
                        <option value="Rental - Warehouse Minalin">Rental - Warehouse Minalin</option>
                        <option value="Uniform ( Tshirt )">Uniform ( Tshirt )</option>
                        <option value="Depreciation">Depreciation</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                        <option value="Unliquidated">Unliquidated</option>
                    </select>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Amount">Amount</label>
                    <input type="text" id="Amount" value={Amount || ""} onChange={(e) => setAmount(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" />
                </div>

            </div>
        </>
    );
};

export default ContainerFormFields;
