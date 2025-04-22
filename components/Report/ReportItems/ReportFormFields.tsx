import React, { useState, useEffect } from "react";

interface FormFieldsProps {
    ReferenceNumber: string; setReferenceNumber: (value: string) => void;
    Email: string; setEmail: (value: string) => void;

    DateLost: string; setDateLost: (value: string) => void;
    ItemName: string; setItemName: (value: string) => void;
    ItemQuantity: string; setItemQuantity: (value: string) => void;
    ItemCategories: string; setItemCategories: (value: string) => void;
    ItemDescription: string; setItemDescription: (value: string) => void;
    ItemOwner: string; setItemOwner: (value: string) => void;
    ContactNumber: string; setContactNumber: (value: string) => void;
    RoomSection: string; setRoomSection: (value: string) => void;
    Department: string; setDepartment: (value: string) => void;
    ItemStatus: string; setItemStatus: (value: string) => void;
    ItemProgress: string; setItemProgress: (value: string) => void;
    ItemImage: File | null; setItemImage: React.Dispatch<React.SetStateAction<File | null>>;
    editData?: any;
}

const FormFields: React.FC<FormFieldsProps> = ({
    ReferenceNumber, setReferenceNumber,
    Email, setEmail,

    DateLost, setDateLost,
    ItemName, setItemName,
    ItemQuantity, setItemQuantity,
    ItemCategories, setItemCategories,
    ItemDescription, setItemDescription,
    ItemOwner, setItemOwner,
    ContactNumber, setContactNumber,
    RoomSection, setRoomSection,
    Department, setDepartment,
    ItemStatus, setItemStatus,
    ItemProgress, setItemProgress,
    ItemImage, setItemImage,
    editData,
}) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const generateReferenceNumber = () => {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase(); // Random letters and numbers
        const randomNumber = Math.floor(Math.random() * 1000); // Random number between 0-999
        return `Lost-Items-${randomString}-${randomNumber}`;
    };

    useEffect(() => {
        // Set initial ReferenceNumber on component mount
        setReferenceNumber(generateReferenceNumber());
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setItemImage(file);
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
        }
    };

    return (
        <>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="DateLost">Date Lost</label>
                    <input type="date" id="DateLost" value={DateLost || ""} onChange={(e) => setDateLost(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                    <input type="hidden" id="ReferenceNumber" value={ReferenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
                    <input type="hidden" id="Email" value={Email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ItemName">Name of Item Lost</label>
                    <input type="text" id="ItemName" value={ItemName || ""} onChange={(e) => setItemName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ItemQuantity">Quantity (Optional)</label>
                    <input type="number" id="ItemQuantity" value={ItemQuantity || ""} onChange={(e) => setItemQuantity(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ItemCategories">Categories</label>
                    <select id="ItemCategories" value={ItemCategories || ""} onChange={(e) => setItemCategories(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required>
                        <option value="">Select Status</option>
                        <option value="Art Supplies">Art Supplies</option>
                        <option value="Bluetooth Speaker">Bluetooth Speaker</option>
                        <option value="Chargers & Cables">Chargers & Cables</option>
                        <option value="Clipboard">Clipboard</option>
                        <option value="Correction Tape / Fluid">Correction Tape / Fluid</option>
                        <option value="Desktop">Desktop</option>
                        <option value="E-Reader">E-Reader</option>
                        <option value="External Hard Drive">External Hard Drive</option>
                        <option value="Fitness Tracker">Fitness Tracker</option>
                        <option value="Gaming Console">Gaming Console</option>
                        <option value="Gaming Controller">Gaming Controller</option>
                        <option value="ID Lace / Holder">ID Lace / Holder</option>
                        <option value="Headphones/ Earphones">Headphones/ Earphones</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Math & Science Tools">Math & Science Tools</option>
                        <option value="Mini PC">Mini PC</option>
                        <option value="Microphone">Microphone</option>
                        <option value="Monitor">Monitor</option>
                        <option value="Mouse / Keyboard">Mouse / Keyboard</option>
                        <option value="Name Tag">Name Tag</option>
                        <option value="Organizers & Storage">Organizers & Storage</option>
                        <option value="Paper Products">Paper Products</option>
                        <option value="Power Bank">Power Bank</option>
                        <option value="Printer">Printer</option>
                        <option value="Projector">Projector</option>
                        <option value="Router">Router</option>
                        <option value="Scanner">Scanner</option>
                        <option value="Smart Glasses">Smart Glasses</option>
                        <option value="Smartphone">Smartphone</option>
                        <option value="Smartwatch">Smartwatch</option>
                        <option value="Tablet">Tablet</option>
                        <option value="USB Flash Drive">USB Flash Drive</option>
                        <option value="VR Headset">VR Headset</option>
                        <option value="Webcam">Webcam</option>
                        <option value="Writing Tools">Writing Tools</option>
                    </select>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ItemDescription">Description of Items/Brand/Specifications</label>
                    <textarea id="ItemDescription" value={ItemDescription || ""} onChange={(e) => setItemDescription(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" rows={3}></textarea>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ItemOwner">Name of Owner</label>
                    <input type="text" id="ItemOwner" value={ItemOwner || ""} onChange={(e) => setItemOwner(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ItemImage">Item Image</label>
                    <input type="file" id="ItemImage" onChange={handleImageChange} className="w-full px-3 py-2 border rounded text-xs uppercase" />
                    {imagePreview && (
                        <div className="mt-2">
                            <img src={imagePreview} alt="Image Preview" className="w-24 h-24 object-cover rounded" />
                        </div>
                    )}
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ContactNumber">Contact Number</label>
                    <input type="text" id="ContactNumber" value={ContactNumber || ""} onChange={(e) => setContactNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" />
                </div>


                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="RoomSection">Room / Section</label>
                    <input type="text" id="RoomSection" value={RoomSection || ""} onChange={(e) => setRoomSection(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Department">Department</label>
                    <input type="text" id="Department" value={Department || ""} onChange={(e) => setDepartment(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ItemStatus">Status</label>
                    <select id="ItemStatus" value={ItemStatus || ""} onChange={(e) => setItemStatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required>
                        <option value="">Select Status</option>
                        <option value="Lost">Lost</option>
                        <option value="Found">Found</option>
                    </select>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ItemProgress">Item Progress</label>

                    {editData?.ItemProgress === "Approve" ? (
                        <input
                            type="text"
                            id="ItemProgress"
                            value="Approve"
                            readOnly
                            className="w-full px-3 py-2 border rounded text-xs uppercase bg-gray-100"
                        />
                    ) : (
                        <select
                            id="ItemProgress"
                            value={ItemProgress || ""} onChange={(e) => setItemProgress(e.target.value)}
                            className="w-full px-3 py-2 border rounded text-xs uppercase"
                        >   
                            <option value="">Select Progress</option>
                            <option value="Pending">Pending</option>

                        </select>
                    )}
                </div>


            </div>
        </>
    );
};

export default FormFields;
