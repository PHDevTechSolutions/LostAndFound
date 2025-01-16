"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CreateDataFormProps {
  post: any;
  onCancel: () => void;
}

const CreateDataForm: React.FC<CreateDataFormProps> = ({ post, onCancel }) => {
  const [ContainerNo, setContainerNo] = useState(post?.ContainerNo || "");
  const [Username, setUsername] = useState("");
  const [Location, setLocation] = useState("");
  const [BoxType, setBoxType] = useState("");
  const [DateOrder, setDateOrder] = useState("");
  const [BuyersName, setBuyersName] = useState("");
  const [BoxSales, setBoxSales] = useState("");
  const [Price, setPrice] = useState("");
  const [Boxes, setBoxes] = useState(post?.Boxes || "");
  const [OriginalBoxes, setOriginalBoxes] = useState(post?.Boxes || "");
  const [GrossSales, setGrossSales] = useState("");
  const [PlaceSales, setPlaceSales] = useState("");
  const [PaymentMode, setPaymentMode] = useState("");
  const [editData, setEditData] = useState<any>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("White Box");

  // Fetch table data on load
  useEffect(() => {
    fetchData();
  }, [post]);

  const fetchData = async () => {
    const response = await fetch("/api/Container/GetAllContainer");
    const data = await response.json();
    setTableData(data);
  };

  const fetchUpdatedData = async () => {
    const response = await fetch(`/api/Container/GetContainer?id=${post._id}`);
    const data = await response.json();
    setBoxes(data.Boxes);
    setOriginalBoxes(data.Boxes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ContainerNo) {
      toast.error("Container No is required", { autoClose: 1000 });
      return;
    }

    const remainingBoxes =
      editData && BoxSales
        ? parseInt(OriginalBoxes) - parseInt(BoxSales) + parseInt(editData.BoxSales)
        : parseInt(Boxes);

    const url = editData
      ? `/api/Container/UpdateContainer`
      : `/api/Container/SaveContainer`;

    const method = editData ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ContainerNo,
        Username,
        Location,
        BoxType,
        DateOrder,
        BuyersName,
        BoxSales,
        Price,
        Boxes: remainingBoxes,
        GrossSales,
        PlaceSales,
        PaymentMode,
        id: editData ? editData._id : undefined,
      }),
    });

    if (response.ok) {
      toast.success(editData ? "Data updated successfully" : "Data added successfully", {
        autoClose: 1000,
        onClose: () => {
          fetchData();
          resetForm();
        },
      });
    } else {
      toast.error(editData ? "Failed to update data" : "Failed to add data", {
        autoClose: 1000,
      });
    }
  };

  const handleEdit = (data: any) => {
    setContainerNo(data.ContainerNo);
    setUsername(data.Username);
    setLocation(data.Location);
    setBoxType(data.BoxType);
    setDateOrder(data.DateOrder);
    setBuyersName(data.BuyersName);
    setBoxSales(data.BoxSales);
    setPrice(data.Price);
    setBoxes(data.Boxes);
    setOriginalBoxes(data.Boxes);
    setGrossSales(data.GrossSales);
    setPlaceSales(data.PlaceSales);
    setPaymentMode(data.PaymentMode);
    setEditData(data);
  };

  const handleBoxSalesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSales = parseInt(e.target.value) || 0;
    const originalSales = editData ? parseInt(editData.BoxSales) : 0;
    const currentBoxes = parseInt(OriginalBoxes);

    if (newSales > currentBoxes + originalSales) {
      toast.error("Box sales cannot exceed available boxes.", { autoClose: 1000 });
      setBoxSales("");
      setGrossSales("");
      return;
    }

    const updatedBoxes = currentBoxes + originalSales - newSales;
    setBoxSales(newSales.toString());
    setGrossSales((newSales * parseFloat(Price)).toFixed(2));
    setBoxes(updatedBoxes.toString());
  };

  const resetForm = () => {
    setContainerNo(post?.ContainerNo || "");
    setUsername("");
    setLocation("");
    setBoxType("");
    setDateOrder("");
    setBuyersName("");
    setBoxSales("");
    setPrice("");
    setGrossSales("");
    setPlaceSales("");
    setPaymentMode("");
    setEditData(null);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Container No:</label>
          <input
            type="text"
            value={ContainerNo}
            onChange={(e) => setContainerNo(e.target.value)}
          />
        </div>
        <div>
          <label>Box Sales:</label>
          <input
            type="number"
            value={BoxSales}
            onChange={handleBoxSalesChange}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={Price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label>Remaining Boxes:</label>
          <input type="number" value={Boxes} disabled />
        </div>
        <button type="submit">{editData ? "Update" : "Save"}</button>
        <button type="button" onClick={resetForm}>
          Reset
        </button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Container No</th>
            <th>Box Sales</th>
            <th>Remaining Boxes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data) => (
            <tr key={data._id}>
              <td>{data.ContainerNo}</td>
              <td>{data.BoxSales}</td>
              <td>{data.Boxes}</td>
              <td>
                <button onClick={() => handleEdit(data)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreateDataForm;

