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
  editData?: any;
}

const ContainerFormFields: React.FC<FormFieldsProps> = ({ Vendor, setVendor, SpsicNo, setSpsicNo, DateArrived, setDateArrived, DateSoldout, setDateSoldout, SupplierName, setSupplierName, ContainerNo, setContainerNo, editData
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
    </>
  );
};

export default ContainerFormFields;
