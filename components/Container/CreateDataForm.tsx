"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdEdit, MdDelete } from "react-icons/md";

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
  const [Remaining, setRemaining] = useState("");
  const [GrossSales, setGrossSales] = useState("");
  const [PlaceSales, setPlaceSales] = useState("");
  const [PaymentMode, setPaymentMode] = useState("");
  const [editData, setEditData] = useState<any>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("White Box");

  // Fetch Username
  useEffect(() => {
    const fetchUsername = async () => {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("id");

      if (userId) {
        try {
          const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
          const data = await response.json();
          setUsername(data.name || "");
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUsername();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ContainerNo) {
      toast.error("Container No is required", { autoClose: 1000 });
      return;
    }

    const url = editData ? `/api/Container/UpdateContainer` : `/api/Container/SaveContainer`;
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
        Remaining,
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
      toast.error(editData ? "Failed to update data" : "Failed to add data", { autoClose: 1000 });
    }
  };

  const fetchData = async () => {
    const response = await fetch("/api/Container/GetAllContainer");
    const data = await response.json();
    const filteredData = data.filter((container: any) => container.ContainerNo === post?.ContainerNo);
    setTableData(filteredData);
  };

  useEffect(() => {
    fetchData();
  }, [post?.ContainerNo]);

  const resetForm = () => {
    setContainerNo(post?.ContainerNo || "");
    setUsername("");
    setLocation("");
    setBoxType("");
    setDateOrder("");
    setBuyersName("");
    setBoxSales("");
    setPrice("");
    setRemaining("");
    setGrossSales("");
    setPlaceSales("");
    setPaymentMode("");
    setEditData(null);
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer className="text-xs" />
      <div className="flex flex-col items-start gap-2">
        <h3 className="text-xs font-semibold text-gray-700">User: {Username}</h3>
        <h2 className="text-xs font-semibold text-gray-700 mb-6">
          Container Van No. {post?.ContainerNo}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Username">Username</label>
          <input
            type="text"
            id="Username"
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded text-xs"
            required
          />
        </div>
        {/* Add other form fields here */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-white bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              type="submit"
              className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
            >
              {editData ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateDataForm;
 