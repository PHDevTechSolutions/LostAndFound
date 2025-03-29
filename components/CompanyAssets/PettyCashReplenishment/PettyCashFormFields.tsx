import React, { useState, useEffect } from "react";

interface FormFieldsProps {
    //Location Tagging
    Location: string; setLocation: (value: string) => void;
    ReferenceNumber: string; setReferenceNumber: (value: string) => void;
    
    PettyCashDate: string; setPettyCashDate: (value: string) => void;
    Payee: string; setPayee: (value: string) => void;
    Particular: string; setParticular: (value: string) => void;
    Amount: string; setAmount: (value: string) => void;
    Transpo: string; setTranspo: (value: string) => void;
    MealsTranspo: string; setMealsTranspo: (value: string) => void;
    NotarialFee: string; setNotarialFee: (value: string) => void;
    Misc: string; setMisc: (value: string) => void;
    ProdSupplies: string; setProdSupplies: (value: string) => void;
    Advances: string; setAdvances: (value: string) => void;
    TollFee: string; setTollFee: (value: string) => void;
    Parking: string; setParking: (value: string) => void;
    Gasoline: string; setGasoline: (value: string) => void;
    Tax: string; setTax: (value: string) => void;
    Supplies: string; setSupplies: (value: string) => void;
    Communication: string; setCommunication: (value: string) => void;
    Utilities: string; setUtilities: (value: string) => void;
    Repairs: string; setRepairs: (value: string) => void;
    ServiceCharges: string; setServiceCharges: (value: string) => void; 
    Remarks: string; setRemarks: (value: string) => void;
    editData?: any;
}

const ContainerFormFields: React.FC<FormFieldsProps> = ({
    //Location Tagging
    Location, setLocation,
    ReferenceNumber, setReferenceNumber,

    PettyCashDate, setPettyCashDate,
    Payee, setPayee,
    Particular, setParticular,
    Amount, setAmount,
    Transpo, setTranspo,
    MealsTranspo, setMealsTranspo,
    NotarialFee, setNotarialFee,
    Misc, setMisc,
    ProdSupplies, setProdSupplies,
    Advances, setAdvances,
    TollFee, setTollFee,
    Parking, setParking,
    Gasoline, setGasoline,
    Tax, setTax,
    Supplies, setSupplies,
    Communication, setCommunication,
    Utilities, setUtilities,
    Repairs, setRepairs,
    ServiceCharges, setServiceCharges,
    Remarks, setRemarks,

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
                    <label className="block text-xs font-bold mb-2" htmlFor="PettyCashDate">Petty Cash Date</label>
                    <input type="date" id="PettyCashDate" value={PettyCashDate || ""} onChange={(e) => setPettyCashDate(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                    <input type="hidden" id="Location" value={Location || ""} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
                    <input type="hidden" id="ReferenceNumber" value={ReferenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Payee">Payee</label>
                    <input type="text" id="Payee" value={Payee || ""} onChange={(e) => setPayee(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Particular">Particular</label>
                    <input type="text" id="Particular" value={Particular || ""} onChange={(e) => setParticular(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Amount">Amount</label>
                    <input type="text" id="Amount" value={Amount || ""} onChange={(e) => setAmount(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Transpo">Transpo</label>
                    <input type="text" id="Transpo" value={Transpo || ""} onChange={(e) => setTranspo(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="MealsTranspo">Meals and Transporation</label>
                    <input type="text" id="MealsTranspo" value={MealsTranspo || ""} onChange={(e) => setMealsTranspo(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="NotarialFee">Notarial Fee</label>
                    <input type="text" id="NotarialFee" value={NotarialFee || ""} onChange={(e) => setNotarialFee(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Misc">Misc</label>
                    <input type="text" id="Misc" value={Misc || ""} onChange={(e) => setMisc(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ProdSupplies">Prod. Supplies</label>
                    <input type="text" id="ProdSupplies" value={ProdSupplies || ""} onChange={(e) => setProdSupplies(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Advances">Advances</label>
                    <input type="text" id="Advances" value={Advances || ""} onChange={(e) => setAdvances(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="TollFee">Toll Fee</label>
                    <input type="text" id="TollFee" value={TollFee || ""} onChange={(e) => setTollFee(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Parking">Parking</label>
                    <input type="text" id="Parking" value={Parking || ""} onChange={(e) => setParking(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Gasoline">Gasoline</label>
                    <input type="text" id="Gasoline" value={Gasoline || ""} onChange={(e) => setGasoline(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Tax">Tax</label>
                    <input type="text" id="Tax" value={Tax || ""} onChange={(e) => setTax(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Supplies">Supplies</label>
                    <input type="text" id="Supplies" value={Supplies || ""} onChange={(e) => setSupplies(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Communication">Communication</label>
                    <input type="text" id="Communication" value={Communication || ""} onChange={(e) => setCommunication(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Utilities">Utilities</label>
                    <input type="text" id="Utilities" value={Utilities || ""} onChange={(e) => setUtilities(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Repairs">Repairs</label>
                    <input type="text" id="Repairs" value={Repairs || ""} onChange={(e) => setRepairs(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ServiceCharges">Service Charges/Fees</label>
                    <input type="text" id="ServiceCharges" value={ServiceCharges || ""} onChange={(e) => setServiceCharges(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                </div>

                <div className="w-full sm:w-1/1 md:w-1/1 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Remarks">Remarks</label>
                    <textarea id="Remarks" value={Remarks || ""} onChange={(e) => setRemarks(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" rows={5}></textarea>
                </div>

            </div>
        </>
    );
};

export default ContainerFormFields;
