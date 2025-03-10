import React, { useState, useEffect } from "react";

interface FormFieldsProps {
  //Location Tagging
  Location: string;
  setLocation: (value: string) => void;
  ReferenceNumber: string;
  setReferenceNumber: (value: string) => void;

  InvoiceDate: string;
  setInvoiceDate: (value: string) => void;
  SupplierName: string;
  setSupplierName: (value: string) => void;
  InvoiceNumber: string;
  setInvoiceNumber: (value: string) => void;
  Description: string;
  setDescription: (value: string) => void;
  TypeFish: string;
  setTypeFish: (value: string) => void;
  Freezing: string;
  setFreezing: (value: string) => void;
  Weight: number;
  setWeight: (value: number) => void;
  UnitPrice: number;
  setUnitPrice: (value: number) => void;
  InvoiceAmount: number;
  setInvoiceAmount: (value: number) => void;
  FirstPayment: number;
  setFirstPayment: (value: number) => void;
  SecondPayment: number;
  setSecondPayment: (value: number) => void;
  ThirdPayment: number;
  setThirdPayment: (value: number) => void;
  FinalPayment: number;
  setFinalPayment: (value: number) => void;
  Discount: number;
  setDiscount: (value: number) => void;

  Commission: number;
  setCommission: (value: number) => void;
  CableFee: number;
  setCableFee: (value: number) => void;
  DateApproval: string;
  setDateApproval: (value: string) => void;
  Status: string;
  setStatus: (value: string) => void;
  Remarks: string;
  setRemarks: (value: string) => void;

  editData?: any;
}

const ContainerFormFields: React.FC<FormFieldsProps> = ({
  //Location Tagging
  Location, setLocation,
  ReferenceNumber, setReferenceNumber,

  InvoiceDate, setInvoiceDate,
  SupplierName, setSupplierName,
  InvoiceNumber, setInvoiceNumber,
  Description, setDescription,
  TypeFish, setTypeFish,
  Freezing, setFreezing,
  Weight, setWeight,
  UnitPrice, setUnitPrice,
  InvoiceAmount, setInvoiceAmount,
  FirstPayment, setFirstPayment,
  SecondPayment, setSecondPayment,
  ThirdPayment, setThirdPayment,
  FinalPayment, setFinalPayment,
  Discount, setDiscount,
  Commission, setCommission,
  CableFee, setCableFee,
  DateApproval, setDateApproval,
  Status, setStatus,
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
          <label className="block text-xs font-bold mb-2" htmlFor="InvoiceDate">Invoice Date</label>
          <input type="date" id="InvoiceDate" value={InvoiceDate || ""} onChange={(e) => setInvoiceDate(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
          <input type="hidden" id="Location" value={Location || ""} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
          <input type="hidden" id="ReferenceNumber" value={ReferenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required/>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="SupplierName">Supplier</label>
          <input type="text" id="SupplierName" value={SupplierName || ""} onChange={(e) => setSupplierName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
        </div>

        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="InvoiceNumber">Invoice Number</label>
          <input type="text" id="InvoiceNumber" value={InvoiceNumber || ""} onChange={(e) => setInvoiceNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" />
        </div>

        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Description">Description of Goods / Size</label>
          <textarea id="Description" value={Description || ""} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" rows={5} required></textarea>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="TypeFish">Type of Fish</label>
          <select id="TypeFish" value={TypeFish || ""} onChange={(e) => setTypeFish(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize">
            <option>Select Type</option>
            <option value="Galunggong (Female)">Galunggong (Female)</option>
            <option value="Galunggong (Male)">Galunggong (Male)</option>
            <option value="Chabeta">Chabeta</option>
            <option value="Matambaka">Matambaka</option>
            <option value="Pampano">Pampano</option>
            <option value="Salmon">Salmon</option>
            <option value="Tulingan">Tulingan</option>
            <option value="Yellow Tail">Yellow Tail</option>
          </select>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Type of Freezing">Type of Freezing</label>
          <select id="Freezing" value={Freezing || ""} onChange={(e) => setFreezing(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
            <option value="">Select Freezing</option>
            <option value="BQF">BQF</option>
            <option value="IQF">IQF</option>
          </select>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Weight">Weight KGS</label>
          <input type="number" id="Weight" value={Weight || ""} onChange={(e) => setWeight(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border rounded text-xs" />
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="UnitPrice">Unit Price USD/KG.</label>
          <input type="number" id="UnitPrice" value={UnitPrice || ""} onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border rounded text-xs" />
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="InvoiceAmount">Invoice Amount in (USD)</label>
          <input type="number" id="InvoiceAmount" value={InvoiceAmount || ""} onChange={(e) => setInvoiceAmount(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border rounded text-xs" />
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="FirstPayment">1st Payment</label>
          <input type="number" id="FirstPayment" value={FirstPayment || ""} onChange={(e) => setFirstPayment(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border rounded text-xs" />
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="SecondPayment">2nd Payment</label>
          <input type="number" id="SecondPayment" value={SecondPayment || ""} onChange={(e) => setSecondPayment(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border rounded text-xs" />
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="ThirdPayment">3rd Payment</label>
          <input type="number" id="ThirdPayment" value={ThirdPayment || ""} onChange={(e) => setThirdPayment(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border rounded text-xs" />
        </div>

        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="FinalPayment">Final Payment</label>
          <input type="number" id="FinalPayment" value={FinalPayment || ""} onChange={(e) => setFinalPayment(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border rounded text-xs" />
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Discount">Discount</label>
          <input type="number" id="Discount" value={Discount || ""} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border rounded text-xs" />
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Commission">Commission</label>
          <input type="number" id="Commission" value={Commission || ""} onChange={(e) => setCommission(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border rounded text-xs" />
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="CableFee">Cable Fee</label>
          <input type="number" id="CableFee" value={CableFee || ""} onChange={(e) => setCableFee(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border rounded text-xs" />
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="DateApproval">Date of IP Approval</label>
          <input type="date" id="DateApproval" value={DateApproval || ""} onChange={(e) => setDateApproval(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
        </div>

        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Status">Status</label>
          <select id="Status" value={Status || ""} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
            <option value="">Select Status</option>
            <option value="With IP">With IP</option>
            <option value="TBA">TBA</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap -mx-4">
        <div className="w-full sm:w-1/1 md:w-1/1 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Remarks">Remarks</label>
          <textarea id="Remarks" value={Remarks || ""} onChange={(e) => setRemarks(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" rows={3}></textarea>
        </div>
      </div>
    </>
  );
};

export default ContainerFormFields;
