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
    const [Username, setUsername] = useState(post?.Username || ""); // Prepopulate if available
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

    const handleEdit = (data: any) => {
        setContainerNo(data.ContainerNo);
        setUsername(data.Username);
        setLocation(data.Location);
        setBoxType(data.BoxType);
        setDateOrder(data.DateOrder);
        setBuyersName(data.BuyersName);
        setBoxSales(data.BoxSales);
        setPrice(data.Price);
        setRemaining(data.Remaining);
        setGrossSales(data.GrossSales);
        setPlaceSales(data.PlaceSales);
        setPaymentMode(data.PaymentMode);
        setEditData(data);
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
        setRemaining("");
        setGrossSales("");
        setPlaceSales("");
        setPaymentMode("");
        setEditData(null);
    };

    useEffect(() => {
        fetchData();
    }, [post?.ContainerNo]);

    return (
        <div className="container mx-auto p-4">
            <ToastContainer className="text-xs" />
            <div className="flex flex-col items-start gap-2">
                <h2 className="text-xs font-semibold text-gray-700 mb-6">
                    Container Van No. {post?.ContainerNo}
                </h2>
            </div>

            <div className="flex flex-wrap gap-4">
                <div className="bg-white shadow-md rounded-lg p-4 flex-grow basis-[20%]">
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
                        {/* Add other input fields here */}
                        <div className="flex justify-between">
                            <button type="button" onClick={onCancel} className="text-xs text-white bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded-md">Cancel</button>
                            <div className="flex gap-2">
                                <button type="submit" className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">{editData ? "Update" : "Save"}</button>
                                <button type="button" onClick={resetForm} className="text-xs text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md">Reset</button>
                            </div>
                        </div>
                    </form>
                </div>
                {/* Additional components such as the table */}
            </div>
        </div>
    );
};

export default CreateDataForm;
