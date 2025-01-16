"use client";

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
    const [Username, setUsername] = useState("");
    const [Location, setLocation] = useState("");
    const [BoxType, setBoxType] = useState("");
    const [DateOrder, setDateOrder] = useState("");
    const [BuyersName, setBuyersName] = useState("");
    const [BoxSales, setBoxSales] = useState("");
    const [Price, setPrice] = useState("");
    const [Boxes, setBoxes] = useState(post?.Boxes || "");
    const [GrossSales, setGrossSales] = useState("");
    const [PlaceSales, setPlaceSales] = useState("");
    const [PaymentMode, setPaymentMode] = useState("");
    const [editData, setEditData] = useState<any>(null);
    const [tableData, setTableData] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("White Box");

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
                Boxes,
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
        setUsername("");
        setLocation("");
        setBoxType("");
        setDateOrder("");
        setBuyersName("");
        setBoxSales("");
        setPrice("");
        setBoxes(post?.Boxes || "");
        setGrossSales("");
        setPlaceSales("");
        setPaymentMode("");
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
        setUsername(data.Username);
        setLocation(data.Location);
        setBoxType(data.BoxType);
        setDateOrder(data.DateOrder);
        setBuyersName(data.BuyersName);
        setBoxSales(data.BoxSales);
        setPrice(data.Price);
        setBoxes(data.Boxes);
        setGrossSales(data.GrossSales);
        setPlaceSales(data.PlaceSales);
        setPaymentMode(data.PaymentMode);
        setEditData(data);
    };

    const handleBoxSalesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const sales = parseInt(e.target.value) || 0;
        const price = parseFloat(Price) || 0;
        const currentBoxes = parseInt(Boxes) || 0;

        if (sales > currentBoxes) {
            toast.error("Box sales cannot exceed available boxes.", { autoClose: 1000 });
            setBoxSales(currentBoxes.toString());
            return;
        }

        const remainingBoxes = currentBoxes - sales;
        setBoxSales(sales.toString());
        setGrossSales((sales * price).toString());
        setBoxes(remainingBoxes.toString());

        try {
            const response = await fetch('/api/Container/UpdateBoxes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: post._id, Boxes: remainingBoxes }),
            });

            if (response.ok) {
                toast.success('Boxes updated in database', { autoClose: 1000 });
            } else {
                toast.error('Failed to update boxes in database', { autoClose: 1000 });
            }
        } catch (error) {
            console.error('Error updating boxes:', error);
            toast.error('An error occurred while updating boxes', { autoClose: 1000 });
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const price = parseFloat(e.target.value) || 0;
        const sales = parseInt(BoxSales) || 0;

        setPrice(price.toString());
        setGrossSales((sales * price).toString());
    };

    useEffect(() => {
        if (post) {
            setContainerNo(post.ContainerNo);
            setBoxes(post.Boxes);
        }
    }, [post]);

    const filteredData = tableData.filter((data) => data.BoxType === activeTab);

   return (
    <div>
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
                        <input type="hidden" id="Username" value={Username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required disabled />
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="BoxSales">Box Sales</label>
                        <input type="text" id="BoxSales" value={BoxSales} onChange={handleBoxSalesChange} className="w-full px-3 py-2 border rounded text-xs" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="Price">Price</label>
                        <input type="number" id="Price" value={Price} onChange={handlePriceChange} className="w-full px-3 py-2 border rounded text-xs" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="Remaining">Remaining</label>
                        <input type="number" id="Remaining" value={Boxes} className="w-full px-3 py-2 border rounded text-xs" required />
                    </div>
                    <div className="flex justify-between">
                        <button type="button" onClick={onCancel} className="text-xs text-white bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded-md">Cancel</button>
                        <button type="submit" className="text-xs text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
);

};

export default CreateDataForm;

