import React from "react";

interface FormFieldsProps {
  Vendor: string;
  setVendor: (value: string) => void;
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
  Brand: string;
  setBrand: (value: string) => void;
  Boxes: string;
  setBoxes: (value: string) => void;
  Commodity: string;
  setCommodity: (value: string) => void;
  Size: string;
  setSize: (value: string) => void;
  Freezing: string;
  setFreezing: (value: string) => void;
  Remarks: string;
  setRemarks: (value: string) => void;
  editData?: any;
}

const ContainerFormFields: React.FC<FormFieldsProps> = ({ Vendor, setVendor, SpsicNo, setSpsicNo, DateArrived, setDateArrived, DateSoldout, setDateSoldout, SupplierName, setSupplierName, ContainerNo, setContainerNo, Brand, setBrand, Boxes, setBoxes, Commodity, setCommodity, Size, setSize, Freezing, setFreezing ,Remarks, setRemarks, editData
}) => {

  return (
    <>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="Vendor">Vendor</label>
        <input type="text" id="Vendor" value={Vendor} onChange={(e) => setVendor(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="SPSIC No">SPSIC No.</label>
        <input type="text" id="SpsicNo" value={SpsicNo} onChange={(e) => setSpsicNo(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="Date Arrived">Date Arrived</label>
        <input type="date" id="DateArrived" value={DateArrived} onChange={(e) => setDateArrived(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="Date Soldout">Date Soldout</label>
        <input type="date" id="DateSoldout" value={DateSoldout} onChange={(e) => setDateSoldout(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="Supplier Name">Supplier</label>
        <input type="text" id="SupplierName" value={SupplierName} onChange={(e) => setSupplierName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="Container No">Container No.</label>
        <input type="text" id="ContainerNo" value={ContainerNo} onChange={(e) => setContainerNo(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="Brand">Brand</label>
        
        <select id="Brand" value={Brand} onChange={(e) => setBrand(e.target.value)} className="w-full px-3 py-2 border rounded text-xs">
          <option>  china </option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="Brand">Brand</label>
        <input type="text" id="Brand" value={Brand} onChange={(e) => setBrand(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="Boxes">Boxes</label>
        <input type="text" id="Boxes" value={Brand} onChange={(e) => setBoxes(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="Commodity">Commodity</label>
        <input type="text" id="Commodity" value={Brand} onChange={(e) => setCommodity(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="Size">Size</label>
        <input type="text" id="Remarks" value={Size} onChange={(e) => setSize(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="Type of Freezing">Freezing</label>
        <input type="text" id="Freezing" value={Freezing} onChange={(e) => setFreezing(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="Remarks">Remarks</label>
        <input type="text" id="Remarks" value={Remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
    </>
  );
};

export default ContainerFormFields;
