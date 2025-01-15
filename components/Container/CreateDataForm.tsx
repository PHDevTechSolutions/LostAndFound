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
  const [formState, setFormState] = useState({
    ContainerNo: post?.ContainerNo || "",
    Username: "",
    Location: "",
    BoxType: "",
    DateOrder: "",
    BuyersName: "",
    BoxSales: "",
    Price: "",
    Remaining: "",
    GrossSales: "",
    PlaceSales: "",
    PaymentMode: "",
  });

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
          setFormState((prev) => ({ ...prev, Username: data.name || "" }));
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUsername();
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/Container/GetAllContainer");
      const data = await response.json();
      setTableData(data.filter((container: any) => container.ContainerNo === post?.ContainerNo));
    };

    fetchData();
  }, [post?.ContainerNo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormState((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.ContainerNo) {
      toast.error("Container No is required", { autoClose: 1000 });
      return;
    }

    const url = editData ? `/api/Container/UpdateContainer` : `/api/Container/SaveContainer`;
    const method = editData ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formState, id: editData?._id }),
    });

    if (response.ok) {
      toast.success(editData ? "Data updated successfully" : "Data added successfully", {
        autoClose: 1000,
        onClose: () => {
          resetForm();
          fetchData();
        },
      });
    } else {
      toast.error(editData ? "Failed to update data" : "Failed to add data", { autoClose: 1000 });
    }
  };

  const handleEdit = (data: any) => {
    setFormState(data);
    setEditData(data);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    const response = await fetch(`/api/Container/RemoveContainer`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      toast.success("Data deleted successfully", { autoClose: 1000 });
      fetchData();
    } else {
      toast.error("Failed to delete data", { autoClose: 1000 });
    }
  };

  const resetForm = () => {
    setFormState({
      ContainerNo: post?.ContainerNo || "",
      Username: "",
      Location: "",
      BoxType: "",
      DateOrder: "",
      BuyersName: "",
      BoxSales: "",
      Price: "",
      Remaining: "",
      GrossSales: "",
      PlaceSales: "",
      PaymentMode: "",
    });
    setEditData(null);
  };

  const filteredData = tableData.filter((data) => data.BoxType === activeTab);

  return (
    <div className="container mx-auto p-4">
      <ToastContainer className="text-xs" />
      <div className="flex flex-col items-start gap-2 mb-6">
        <h2 className="text-xs font-semibold text-gray-700">{post?.Vendor}</h2>
        <h2 className="text-xs font-semibold text-gray-700">Container Van No. {post?.ContainerNo}</h2>
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Form Section */}
        <div className="bg-white shadow-md rounded-lg p-4 flex-grow basis-[20%]">
          <form onSubmit={handleSubmit}>
            {Object.entries(formState).map(([key, value]) =>
              key === "ContainerNo" ? (
                <input
                  key={key}
                  id={key}
                  type="hidden"
                  value={value}
                  onChange={handleChange}
                  disabled={!!editData}
                />
              ) : (
                <div key={key} className="mb-4">
                  <label className="block text-xs font-bold mb-2 capitalize" htmlFor={key}>
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    id={key}
                    type={key === "DateOrder" ? "date" : "text"}
                    value={value}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded text-xs"
                    required
                  />
                </div>
              )
            )}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-white bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
              >
                {editData ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>

        {/* Table Section */}
        <div className="bg-white shadow-md rounded-lg p-4 flex-grow basis-[70%]">
          <div className="flex border-b mb-4 text-xs">
            {["White Box", "Brown Box"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 ${activeTab === tab ? "border-b-2 border-blue-500 font-bold" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <table className="min-w-full bg-white border text-xs">
            <thead>
              <tr>
                {["Username", "Location", "Date", "Buyer's Name", "Actions"].map((header) => (
                  <th key={header} className="text-left border px-4 py-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((data) => (
                <tr key={data._id}>
                  <td className="border px-4 py-2">{data.Username}</td>
                  <td className="border px-4 py-2">{data.Location}</td>
                  <td className="border px-4 py-2">{data.DateOrder}</td>
                  <td className="border px-4 py-2">{data.BuyersName}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button onClick={() => handleEdit(data)}>
                      <MdEdit />
                    </button>
                    <button onClick={() => handleDelete(data._id)}>
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateDataForm;
