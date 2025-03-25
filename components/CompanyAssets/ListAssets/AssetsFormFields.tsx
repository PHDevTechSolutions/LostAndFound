import React, { useState, useEffect } from "react";

interface FormFieldsProps {
    // Location Tagging
    Location: string; setLocation: (value: string) => void;
    ReferenceNumber: string; setReferenceNumber: (value: string) => void;

    DateBuy: string; setDateBuy: (value: string) => void;
    ItemPurchased: string; setItemPurchased: (value: string) => void;
    Type: string; setType: (value: string) => void;
    Quantity: string; setQuantity: (value: string) => void;
    AmountPrice: string; setAmountPrice: (value: string) => void;
    AccumulatedDepreciation: string; setAccumulatedDepreciation: (value: string) => void;
    AdditionalAssets: string; setAdditionalAssets: (value: string) => void;
    CoveredMonth: string; setCoveredMonth: (value: string) => void;
    editData?: any;
}

const ContainerFormFields: React.FC<FormFieldsProps> = ({
    Location, setLocation,
    ReferenceNumber, setReferenceNumber,
    DateBuy, setDateBuy,
    ItemPurchased, setItemPurchased,
    Type, setType,
    Quantity, setQuantity,
    AmountPrice, setAmountPrice,
    AccumulatedDepreciation, setAccumulatedDepreciation,
    AdditionalAssets, setAdditionalAssets,
    CoveredMonth, setCoveredMonth,
    editData,
}) => {
    // State for CoveredMonth checkboxes
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
    const [depreciationType, setDepreciationType] = useState<string>("");

    // Generate Reference Number on Component Mount
    const generateReferenceNumber = () => {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        const randomNumber = Math.floor(Math.random() * 1000);
        return `JJV-${randomString}-${randomNumber}`;
    };

    useEffect(() => {
        setReferenceNumber(generateReferenceNumber());
    }, []);

    // Automatically calculate Accumulated Depreciation based on AmountPrice
    useEffect(() => {
        if (AmountPrice && depreciationType) {
            let divisor = depreciationType === "36" ? 36 : 60;
            const depreciation = (parseFloat(AmountPrice) / divisor).toFixed(2);
            setAccumulatedDepreciation(depreciation);
        }
    }, [AmountPrice, depreciationType, setAccumulatedDepreciation]);

    // Handle CoveredMonth checkbox change
    const handleCheckboxChange = (month: string) => {
        if (selectedMonths.includes(month)) {
            // Remove if unchecked
            const updatedMonths = selectedMonths.filter((m) => m !== month);
            setSelectedMonths(updatedMonths);
        } else {
            // Add if checked
            setSelectedMonths([...selectedMonths, month]);
        }
    };

    // Generate CoveredMonth format for submission
    useEffect(() => {
        const formattedMonths = selectedMonths
            .map((month) => `${month} - 1500`)
            .join(", ");
        setCoveredMonth(formattedMonths);
    }, [selectedMonths, setCoveredMonth]);

    useEffect(() => {
        const formattedMonths = selectedMonths
            .map((month) => `${month} - ${AccumulatedDepreciation || 0}`)
            .join(", ");
        setCoveredMonth(formattedMonths);
    }, [selectedMonths, AccumulatedDepreciation, setCoveredMonth]);

    return (
        <>
            <div className="flex flex-wrap -mx-4">
                {/* Date Purchased */}
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="DatePurchased">Date</label>
                    <input type="date" id="DateBuy" value={DateBuy || ""} onChange={(e) => setDateBuy(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                    <input type="hidden" id="Location" value={Location || ""} />
                    <input type="hidden" id="ReferenceNumber" value={ReferenceNumber} />
                </div>

                {/* Item Purchased */}
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ItemPurchased">Name of Item Purchased</label>
                    <input type="text" id="ItemPurchased" value={ItemPurchased || ""} onChange={(e) => setItemPurchased(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" />
                </div>

                {/* Type Dropdown */}
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Type">Type</label>
                    <select value={Type || ""} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required>
                        <option value="">Select Type</option>
                        <option value="Office Supplies">Office Supplies</option>
                        <option value="Office Furnitures">Office Furnitures</option>
                        <option value="Office Appliances">Office Appliances</option>
                    </select>
                </div>

                {/* Quantity */}
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Quantity">Quantity</label>
                    <input type="number" id="Quantity" value={Quantity || ""} onChange={(e) => setQuantity(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" />
                </div>

                {/* Amount / Price */}
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="AmountPrice">Amount / Price</label>
                    <input type="number" id="AmountPrice" value={AmountPrice || ""} onChange={(e) => setAmountPrice(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" />
                </div>

                {/* Accumulated Depreciation */}
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="AccumulatedDepreciation">Accumulated Depreciation</label>
                    <input type="number" id="AccumulatedDepreciation" value={AccumulatedDepreciation || ""} className="w-full px-3 py-2 border rounded text-xs uppercase" readOnly />
                    <select
                        className="w-full mt-2 px-3 py-2 border rounded text-xs"
                        value={depreciationType}
                        onChange={(e) => setDepreciationType(e.target.value)}
                    >
                        <option value="">Select Division Type</option>
                        <option value="36">Divided by 36</option>
                        <option value="60">Divided by 60</option>
                    </select>
                </div>

                {/* Additional Assets */}
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="AdditionalAssets">Additional Assets</label>
                    <input type="number" id="AdditionalAssets" value={AdditionalAssets || ""} onChange={(e) => setAdditionalAssets(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" />
                </div>

                {/* Checkbox Covered Month */}
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="CoveredMonth">Covered Month</label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",].map((month) => (
                            <label key={month} className="flex items-center">
                                <input type="checkbox" value={month} checked={selectedMonths.includes(month)} onChange={() => handleCheckboxChange(month)} className="mr-2" />
                                {month}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Hidden field for CoveredMonth format */}
                <input type="hidden" name="CoveredMonth" value={CoveredMonth} />

                {/* Visible fields for selected Covered Months */}
                {selectedMonths.length > 0 && (
                    <div className="w-full px-4 mb-4 border border-dashed border-gray-300 p-2 rounded-lg">
                        <label className="block text-xs font-bold mb-2">Depreciation Details</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                            {selectedMonths.map((month) => (
                                <div key={`visible_${month}`} className="flex justify-between items-center bg-white p-2 mb-2 border rounded">
                                    <span className="text-xs font-semibold">{month}</span>
                                    <input type="number" name={`depreciation_${month}`} value={AccumulatedDepreciation || "0"} readOnly className="w-1/3 px-3 py-1 border rounded text-xs text-right" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ContainerFormFields;
