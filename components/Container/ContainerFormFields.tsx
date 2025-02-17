import React, { useState, useEffect } from "react";

interface FormFieldsProps {
  //Location Tagging
  Location: string;
  setLocation: (value: string) => void;

  ReferenceNumber: string;
  setReferenceNumber: (value: string) => void;

  SpsicNo: string;
  setSpsicNo: (value: string) => void;
  DateArrived: string;
  setDateArrived: (value: string) => void;
  DateSoldout: string;
  setDateSoldout: (value: string) => void;
  SupplierName: string;
  setSupplierName: (value: string) => void;

  ContainerNo: string;
  setContainerNo: (value: string) => void;
  ContainerType: string;
  setContainerType: (value: string) => void;


  Country: string;
  setCountry: (value: string) => void;
  Boxes: number;
  setBoxes: (value: number) => void;
  TotalQuantity: number;
  setTotalQuantity: (value: number) => void;

  TotalGrossSales: string;
  setTotalGrossSales: (value: string) => void;

  Commodity: string;
  setCommodity: (value: string) => void;
  Size: string;
  setSize: (value: string) => void;
  Freezing: string;
  setFreezing: (value: string) => void;
  Status: string;
  setStatus: (value: string) => void;
  BoxType: string;
  setBoxType: (value: string) => void;
  Remarks: string;
  setRemarks: (value: string) => void;

  PlaceSales: string;
  setPlaceSales: (value: string) => void;

  editData?: any;
}

const ContainerFormFields: React.FC<FormFieldsProps> = ({
  //Location Tagging
  Location,
  setLocation,

  ReferenceNumber,
  setReferenceNumber,

  SpsicNo,
  setSpsicNo,
  DateArrived,
  setDateArrived,
  DateSoldout,
  setDateSoldout,
  SupplierName,
  setSupplierName,

  ContainerNo,
  setContainerNo,
  ContainerType,
  setContainerType,

  Country,
  setCountry,
  Boxes,
  setBoxes,
  TotalQuantity,
  setTotalQuantity,

  TotalGrossSales,
  setTotalGrossSales,

  Commodity,
  setCommodity,
  Size,
  setSize,
  Freezing,
  setFreezing,
  BoxType,
  setBoxType,
  Status,
  setStatus,
  Remarks,
  setRemarks,

  PlaceSales,
  setPlaceSales,
  editData,
}) => {

  const totalQuantityValue = TotalQuantity ?? 0;
  const boxesValue = Boxes ?? 0;

  useEffect(() => {
    if (totalQuantityValue !== boxesValue) {
      setBoxes(totalQuantityValue);
    }
  }, [totalQuantityValue, setBoxes, boxesValue]);

  const handleTotalQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow only numeric input
    if (/^\d*$/.test(value)) {
      const numericValue = Number(value);
      setTotalQuantity(numericValue);
      setBoxes(numericValue);
    }
  };


  const handleBoxesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setBoxes(value);
    setTotalQuantity(value);
  };

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
          <label className="block text-xs font-bold mb-2" htmlFor="SPSIC No">SPSIC No.</label>
          <input type="text" id="SpsicNo" value={SpsicNo || ""} onChange={(e) => setSpsicNo(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
          <input type="hidden" id="Location" value={Location || ""} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
          <input type="hidden" id="ReferenceNumber" value={ReferenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required/>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Date Arrived">Date Arrived</label>
          <input type="date" id="DateArrived" value={DateArrived || ""} onChange={(e) => setDateArrived(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
        </div>

        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Date Soldout">Date Soldout</label>
          <input type="date" id="DateSoldout" value={DateSoldout || ""} onChange={(e) => setDateSoldout(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
        </div>

        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Supplier Name">Supplier</label>
          <input type="text" id="SupplierName" value={SupplierName || ""} onChange={(e) => setSupplierName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Container No">Container No.</label>
          <input type="text" id="ContainerNo" value={ContainerNo || ""} onChange={(e) => setContainerNo(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" />
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Container Type">Container Type</label>
          <select id="ContainerType" value={ContainerType || ""} onChange={(e) => setContainerType(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" >
            <option value="">Select Type</option>
            <option value="Concord">Concord</option>
            <option value="JS">JS</option>
            <option value="Manor">Manor</option>
            <option value="Jumbo">Jumbo</option>
          </select>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Country">Country</label>
          <select id="Country" value={Country || ""} onChange={(e) => setCountry(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" >
            <option value="">Select Country</option>
            <option value="China">China</option>
            <option value="Vietnam">Vietnam</option>
          </select>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Type of Freezing">Boxes</label>
          <select id="BoxType" value={BoxType || ""} onChange={(e) => setBoxType(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
            <option value="">Select Boxes</option>
            <option value="7 Star White">7 Star White</option>
            <option value="Brown Box">Brown Box</option>
            <option value="Brown Box 2L">Brown Box 2L</option>
            <option value="Brown Box Lapad">Brown Box Lapad</option>
            <option value="Top Frozen Brown">Top Frozen Brown</option>
            <option value="Wax 13.5 Kgs">Wax 13.5 Kgs</option>
            <option value="Wax 13 to 13.5kls">Wax 13 to 13.5kls</option>
            <option value="White Box Ocean Tres">White Box Ocean Tres</option>
            <option value="White Box">White Box</option>
            <option value="White Box 2L">White Box 2L</option>
            <option value="White Box Lapad">White Box Lapad</option>
          </select>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Storage Type">Storage Type</label>
          <select id="PlaceSales" value={PlaceSales || ""} onChange={(e) => setPlaceSales(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" >
            <option value="">Select Type</option>
            <option value="BELEN">BELEN STORAGE</option>
            <option value="BELEN-KH">BELEN-KH STORAGE</option>
            <option value="BELEN-CS">BELEN-CS STORAGE</option>
            <option value="JJV-JS">JJV-JS STORAGE</option>
            <option value="JJV-LH">JJV-LH STORAGE</option>
            <option value="JJV-JS">JJV-JS STORAGE</option>
            <option value="JJV-TD">JJV-TD STORAGE</option>
            <option value="JJV-NP">JJV-NP STORAGE</option>
          </select>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Commodity">Commodity</label>
          <select id="Commodity" value={Commodity || ""} onChange={(e) => setCommodity(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
            <option value="">Select Commodity</option>
            <option value="Chabeta">Chabeta</option>
            <option value="Galunggong (Female)">Galunggong (Female)</option>
            <option value="Galunggon (Male)">Galunggon (Male)</option>
            <option value="Matambaka">Matambaka</option>
            <option value="Pampano">Pampano</option>
            <option value="Salmon">Salmon</option>
            <option value="Tulingan">Tulingan</option>
            <option value="Yellow Tail">Yellow Tail</option>
          </select>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Size">Size</label>
          <input type="text" id="Size" value={Size || ""} onChange={(e) => setSize(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
        </div>

        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Type of Freezing">Type of Freezing</label>
          <select id="Freezing" value={Freezing || ""} onChange={(e) => setFreezing(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
            <option value="">Select Freezing</option>
            <option value="BQF">BQF</option>
            <option value="IQF">IQF</option>
          </select>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="TotalQuantity">Beginning</label>
          <input type="text" id="TotalQuantity" value={totalQuantityValue} onChange={handleTotalQuantityChange} className="w-full px-3 py-2 border rounded text-xs" />
          <input type="hidden" id="Boxes" value={boxesValue} onChange={handleBoxesChange} className="w-full px-3 py-2 border rounded text-xs" disabled />
          <input type="hidden" id="TotalGrossSales" value={TotalGrossSales || ""} onChange={(e) => setTotalGrossSales(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
        </div>

        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Status">Status</label>
          <select id="Status" value={Status || ""} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
            <option value="">Select Status</option>
            <option value="Inventory">Inventory</option>
            <option value="Soldout">Soldout</option>
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
