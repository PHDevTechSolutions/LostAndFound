import React, { useState, useEffect } from "react";

interface FormFieldsProps {
    //Location Tagging
    Location: string; setLocation: (value: string) => void;
    ReferenceNumber: string; setReferenceNumber: (value: string) => void;
    DateArrived: string; setDateArrived: (value: string) => void;
    DateSoldout: string; setDateSoldout: (value: string) => void;
    SupplierName: string; setSupplierName: (value: string) => void;
    ContainerNo: string; setContainerNo: (value: string) => void;
    PurchasePrice: string; setPurchasePrice: (value: string) => void;
    ShippingLine: string; setShippingLine: (value: string) => void;
    BankCharges: string; setBankCharges: (value: string) => void;
    Brokerage: string; setBrokerage: (value: string) => void;
    OtherCharges: string; setOtherCharges: (value: string) => void;
    BoarderExam: string; setBoarderExam: (value: string) => void;
    ShippingLineRepresentation: string; setShippingLineRepresentation: (value: string) => void;
    Representation: string; setRepresentation: (value: string) => void;
    SPSApplicationFee: string; setSPSApplicationFee: (value: string) => void;
    TruckingCharges: string; setTruckingCharges: (value: string) => void;
    Intercommerce: string; setIntercommerce: (value: string) => void;
    Erfi: string; setErfi: (value: string) => void;
    SellingFee: string; setSellingFee: (value: string) => void;
    StorageOrca: string; setStorageOrca: (value: string) => void;
    StorageBelen: string; setStorageBelen: (value: string) => void;
    PowerCharges: string; setPowerCharges: (value: string) => void;
    LoadingCharges: string; setLoadingCharges: (value: string) => void;
    editData?: any;
}

const ContainerFormFields: React.FC<FormFieldsProps> = ({
    //Location Tagging
    Location, setLocation,
    ReferenceNumber, setReferenceNumber,
    DateArrived, setDateArrived,
    DateSoldout, setDateSoldout,
    SupplierName, setSupplierName,
    ContainerNo, setContainerNo,
    PurchasePrice, setPurchasePrice,
    ShippingLine, setShippingLine,
    BankCharges, setBankCharges,
    Brokerage, setBrokerage,
    OtherCharges, setOtherCharges,
    BoarderExam, setBoarderExam,
    ShippingLineRepresentation, setShippingLineRepresentation,
    Representation, setRepresentation,
    SPSApplicationFee, setSPSApplicationFee,
    TruckingCharges, setTruckingCharges,
    Intercommerce, setIntercommerce,
    Erfi, setErfi,
    SellingFee, setSellingFee,
    StorageOrca, setStorageOrca,
    StorageBelen, setStorageBelen,
    PowerCharges, setPowerCharges,
    LoadingCharges, setLoadingCharges,
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
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="PettyCashDate">Date Arrived</label>
                    <input type="date" id="" value={DateArrived || ""} onChange={(e) => setDateArrived(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                    <input type="hidden" id="Location" value={Location || ""} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
                    <input type="hidden" id="ReferenceNumber" value={ReferenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="DateSoldout">Date Soldout</label>
                    <input type="date" id="DateSoldout" value={DateSoldout || ""} onChange={(e) => setDateSoldout(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Supplier">Supplier</label>
                    <input type="text" id="Supplier" value={SupplierName || ""} onChange={(e) => setSupplierName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ContainerNo">Container No</label>
                    <input type="text" id="ContainerNo" value={ContainerNo || ""} onChange={(e) => setContainerNo(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" disabled />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="PurchasePrice">Purchase Price</label>
                    <input type="text" id="PurchasePrice" value={PurchasePrice || ""} onChange={(e) => setPurchasePrice(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ShippingLine">Shipping Line</label>
                    <input type="text" id="ShippingLine" value={ShippingLine || ""} onChange={(e) => setShippingLine(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="BankCharges">Bank Charges</label>
                    <input type="text" id="BankCharges" value={BankCharges || ""} onChange={(e) => setBankCharges(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Brokerage">Brokerage</label>
                    <input type="text" id="Brokerage" value={Brokerage || ""} onChange={(e) => setBrokerage(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="OtherCharges">Other Charges</label>
                    <input type="text" id="OtherCharges" value={OtherCharges || ""} onChange={(e) => setOtherCharges(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="BoarderExam">Representation - Boarder Exam</label>
                    <input type="text" id="BoarderExam" value={BoarderExam || ""} onChange={(e) => setBoarderExam(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ShippingLineRepresentation">Shipping Lines Representation</label>
                    <input type="text" id="ShippingLineRepresentation" value={ShippingLineRepresentation || ""} onChange={(e) => setShippingLineRepresentation(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Representation">Representation</label>
                    <input type="text" id="Representation" value={Representation || ""} onChange={(e) => setRepresentation(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="SPSApplicationFee">SPS Application Fee</label>
                    <input type="text" id="SPSApplicationFee" value={SPSApplicationFee || ""} onChange={(e) => setSPSApplicationFee(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="TruckingCharges">TruckingCharges</label>
                    <input type="text" id="TruckingCharges" value={TruckingCharges || ""} onChange={(e) => setTruckingCharges(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Intercommerce">Intercommerce</label>
                    <input type="text" id="Intercommerce" value={Intercommerce || ""} onChange={(e) => setIntercommerce(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Erfi">Erfi</label>
                    <input type="text" id="Erfi" value={Erfi || ""} onChange={(e) => setErfi(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="SellingFee">Selling Fee</label>
                    <input type="text" id="SellingFee" value={SellingFee || ""} onChange={(e) => setSellingFee(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="StorageOrca">Storage Orca</label>
                    <input type="text" id="StorageOrca" value={StorageOrca || ""} onChange={(e) => setStorageOrca(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="StorageBelen">Storage Belen</label>
                    <input type="text" id="StorageBelen" value={StorageBelen || ""} onChange={(e) => setStorageBelen(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="PowerCharges">Power Charges</label>
                    <input type="text" id="PowerCharges" value={PowerCharges || ""} onChange={(e) => setPowerCharges(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="LoadingCharges">Loading/Unloading Charges</label>
                    <input type="text" id="LoadingCharges" value={LoadingCharges || ""} onChange={(e) => setLoadingCharges(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

            </div>
        </>
    );
};

export default ContainerFormFields;
