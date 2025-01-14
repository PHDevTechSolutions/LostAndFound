import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { MdEdit, MdDelete } from "react-icons/md";

interface CreateDataFormProps {
    post: any;
    onCancel: () => void;
}

const CreateDataForm: React.FC<CreateDataFormProps> = ({ post, onCancel }) => {
    const [ContainerNo, setContainerNo] = useState(post?.ContainerNo || "");
    const [BoxType, setBoxType] = useState("");
    const [DateOrder, setDateOrder] = useState("");
    const [BuyersName, setBuyersName] = useState("");
    const [editData, setEditData] = useState<any>(null);
    const [tableData, setTableData] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("White Box");

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
                BoxType,
                DateOrder,
                BuyersName,
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

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this record?");
        if (!confirmDelete) return;

        const response = await fetch(`/api/Container/RemoveContainer`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });

        if (response.ok) {
            toast.success("Data deleted successfully", {
                autoClose: 1000,
                onClose: fetchData,
            });
        } else {
            toast.error("Failed to delete data", { autoClose: 1000 });
        }
    };

    const resetForm = () => {
        setContainerNo(post?.ContainerNo || "");
        setBoxType("");
        setDateOrder("");
        setBuyersName("");
        setEditData(null);
    };

    const fetchData = async () => {
        const response = await fetch("/api/Container/GetAllContainer");
        const data = await response.json();
        const filteredData = data.filter((container: any) => container.ContainerNo === post?.ContainerNo);
        setTableData(filteredData);
    };

    const handleEdit = (data: any) => {
        setContainerNo(data.ContainerNo);
        setBoxType(data.BoxType);
        setDateOrder(data.DateOrder);
        setBuyersName(data.BuyersName);
        setEditData(data);
    };

    useEffect(() => {
        fetchData();
    }, [post?.ContainerNo]);

    const filteredData = tableData.filter((data) => data.BoxType === activeTab);

    return (

        <div className="container mx-auto p-4">
            <ToastContainer className="text-xs" />
            <div className="flex flex-col items-start gap-2">
                <h2 className="text-xs font-semibold text-gray-700">
                    {post?.Vendor}
                </h2>
                <h2 className="text-xs font-semibold text-gray-700 mb-6">
                    Container Van No. {post?.ContainerNo}
                </h2>
            </div>

            <div className="flex flex-wrap gap-4">
                {/* Form Section */}
                <div className="bg-white shadow-md rounded-lg p-4 flex-grow basis-[20%]">
                    <form onSubmit={handleSubmit}>
                        <input id="containerNo" type="hidden" value={ContainerNo} onChange={(e) => setContainerNo(e.target.value)} disabled={!!editData} className="w-full px-3 py-2 border rounded text-xs mb-4" placeholder="Enter Container No." />
                        <div className="mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="BoxType">Box Type</label>
                            <select id="BoxType" value={BoxType} onChange={(e) => setBoxType(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
                                <option value="">Select Box</option>
                                <option value="Brown Box">Brown Box</option>
                                <option value="White Box">White Box</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="DateOrder">Date</label>
                            <input type="date" id="DateOrder" value={DateOrder} onChange={(e) => setDateOrder(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="BuyersName">Buyer's Name</label>
                            <input type="text" id="BuyersName" value={BuyersName} onChange={(e) => setBuyersName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
                        </div>
                        <div className="flex justify-between">
                            <button type="button" onClick={onCancel} className="text-xs text-white bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded-md">Cancel</button>
                            <div className="flex gap-2">
                                <button type="submit" className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">{editData ? "Update" : "Save"}</button>
                                <button type="button" onClick={resetForm} className="text-xs text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md">Reset</button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Tabbed Table Section */}
                <div className="bg-white shadow-md rounded-lg p-4 flex-grow basis-[70%]">
                    {/* Tab Buttons */}
                    <div className="flex border-b mb-4 text-xs">
                        <button className={`px-4 py-2 ${activeTab === "White Box" ? "border-b-2 border-blue-500 font-bold" : ""}`} onClick={() => setActiveTab("White Box")}>White Box</button>
                        <button className={`px-4 py-2 ${activeTab === "Brown Box" ? "border-b-2 border-blue-500 font-bold" : ""}`} onClick={() => setActiveTab("Brown Box")}>Brown Box</button>
                    </div>

                    {/* Table */}
                    <table className="min-w-full bg-white border text-xs">
                        <thead>
                            <tr>
                                <th className="w-1/6 text-left border px-4 py-2">Date</th>
                                <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Buyer's Name</th>
                                <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((data: any) => (
                                <tr key={data._id}>
                                    <td className="px-4 py-2 border">{data.DateOrder}</td>
                                    <td className="px-4 py-2 border hidden md:table-cell">{data.BuyersName}</td>
                                    <td className="px-4 py-2 border hidden md:table-cell flex gap-2">
                                        <button className="mr-2" onClick={() => handleEdit(data)}><MdEdit /></button>
                                        <button onClick={() => handleDelete(data._id)}><MdDelete /></button>
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
