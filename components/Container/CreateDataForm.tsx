"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Table from "./OrderTable";
import OrderFormFields from "./OrderFormFields";

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
    const [Beginning, setBeginning] = useState(post?.Beginning || "");
    const [OriginalBeginning, setOriginalBeginning] = useState(post?.Beginning || "");
    const [GrossSales, setGrossSales] = useState("");
    const [PlaceSales, setPlaceSales] = useState("");
    const [PaymentMode, setPaymentMode] = useState("");
    const [editData, setEditData] = useState<any>(null);
    const [tableData, setTableData] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("White Box");

    useEffect(() => {
        fetchUsername();
        fetchData();
    }, [post]);

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

    const fetchData = async () => {
        const response = await fetch("/api/Container/GetAllContainer");
        const data = await response.json();
        const filteredData = data.filter((container: any) => container.ContainerNo === post?.ContainerNo);
        setTableData(filteredData);
        fetchUpdatedData();
    };

    const fetchUpdatedData = async () => {
        const response = await fetch(`/api/Container/GetAllContainer?id=${post._id}`);
        const data = await response.json();
        setBeginning(data.Beginning);
        setOriginalBeginning(data.Beginning); // Update original boxes with latest value
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ContainerNo) {
            toast.error("Container No is required", { autoClose: 1000 });
            return;
        }

        const url = editData ? `/api/Container/UpdateContainer` : `/api/Container/SaveContainer`;
        const method = editData ? "PUT" : "POST";
        const remainingBeginning = parseInt(Beginning) || 0;

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ContainerNo, Username, Location, BoxType, DateOrder, BuyersName, BoxSales, Price, Remaining, Beginning: remainingBeginning,
                GrossSales, PlaceSales, PaymentMode, id: editData ? editData._id : undefined,
            }),
        });

        if (response.ok) {
            toast.success(editData ? "Data updated successfully" : "Data added successfully", {
                autoClose: 1000,
                onClose: () => {
                    // Update boxes in the database
                    updateBeginningInDatabase(post._id, remainingBeginning);
                },
            });
        } else {
            toast.error(editData ? "Failed to update data" : "Failed to add data", { autoClose: 1000 });
        }
    };

    const updateBeginningInDatabase = async (id: string, remainingBeginning: number) => {
        try {
            const response = await fetch('/api/Container/UpdateBoxes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, Beginning: remainingBeginning }),
            });

            if (response.ok) {
                toast.success('Boxes updated in database', { autoClose: 1000 });
                fetchData(); // Refresh data after updating boxes
            } else {
                toast.error('Failed to update boxes in database', { autoClose: 1000 });
            }
        } catch (error) {
            console.error('Error updating boxes:', error);
            toast.error('An error occurred while updating boxes', { autoClose: 1000 });
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
        setContainerNo(post?.ContainerNo || ""); setUsername(""); setLocation(""); setBoxType(""); setDateOrder(""); setBuyersName(""); setBoxSales("");
        setPrice(""); setRemaining(""); setGrossSales(""); setPlaceSales(""); setPaymentMode(""); setEditData(null);
    };

    const handleEdit = (data: any) => {
        const originalBoxSales = parseInt(BoxSales) || 0;
        const newBoxSales = parseInt(data.BoxSales) || 0;

        let updatedBeginning = parseInt(OriginalBeginning) || 0;

        if (newBoxSales < originalBoxSales) {
            updatedBeginning += originalBoxSales - newBoxSales;
        } else if (newBoxSales > originalBoxSales) {
            updatedBeginning -= newBoxSales - originalBoxSales;
        }

        setContainerNo(data.ContainerNo); setUsername(data.Username); setLocation(data.Location); setBoxType(data.BoxType); setDateOrder(data.DateOrder); setBuyersName(data.BuyersName);
        setBoxSales(data.BoxSales); setPrice(data.Price); setRemaining(data.Remaining); setBeginning(updatedBeginning.toString()); setOriginalBeginning(updatedBeginning.toString());
        setGrossSales(data.GrossSales); setPlaceSales(data.PlaceSales); setPaymentMode(data.PaymentMode); setEditData(data);
    };

    const handleBoxSalesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sales = parseInt(e.target.value) || 0;
        const price = parseFloat(Price) || 0;
        const currentBoxes = parseInt(OriginalBeginning) || 0; // Use original boxes for calculation

        if (sales > currentBoxes) {
            toast.error("Box sales cannot exceed available boxes.", { autoClose: 1000 });
            setBoxSales("");
            setGrossSales("");
            setBeginning(OriginalBeginning); // Reset boxes to original if error
            return;
        }

        const remainingBoxes = currentBoxes - sales;
        setBoxSales(sales.toString());
        setGrossSales((sales * price).toString());
        setBeginning(remainingBoxes.toString());
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const price = parseFloat(e.target.value) || 0;
        const sales = parseInt(BoxSales) || 0;

        setPrice(price.toString());
        setGrossSales((sales * price).toString());
    };

    const filteredData = tableData.filter((data) => data.BoxType === activeTab);

    const calculateTotals = () => {
        let totalBoxSales = 0;
        let totalPrice = 0;
        let totalGrossSales = 0;

        filteredData.forEach((data: any) => {
            totalBoxSales += parseInt(data.BoxSales) || 0;
            totalPrice += parseFloat(data.Price) || 0;
            totalGrossSales += parseFloat(data.GrossSales) || 0;
        });
        return { totalBoxSales, totalPrice, totalGrossSales };
    };

    const { totalBoxSales, totalPrice, totalGrossSales } = calculateTotals();
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
                    <OrderFormFields
                        ContainerNo={ContainerNo}
                        setContainerNo={setContainerNo}
                        BoxType={BoxType}
                        setBoxType={setBoxType}
                        Username={Username}
                        setUsername={setUsername}
                        Location={Location}
                        setLocation={setLocation}
                        DateOrder={DateOrder}
                        setDateOrder={setDateOrder}
                        BuyersName={BuyersName}
                        setBuyersName={setBuyersName}
                        BoxSales={BoxSales}
                        setBoxSales={setBoxSales}
                        handleBoxSalesChange={handleBoxSalesChange}
                        Price={Price}
                        setPrice={setPrice}
                        handlePriceChange={handlePriceChange}
                        Beginning={Beginning}
                        setBeginning={setBeginning}
                        GrossSales={GrossSales}
                        setGrossSales={setGrossSales}
                        PlaceSales={PlaceSales}
                        setPlaceSales={setPlaceSales}
                        PaymentMode={PaymentMode}
                        setPaymentMode={setPaymentMode}
                        editData={editData}
                        onCancel={onCancel}
                        handleSubmit={handleSubmit}
                        resetForm={resetForm}
                    />

                </div>

                {/* Tabbed Table Section */}
                <div className="bg-white shadow-md rounded-lg p-4 flex-grow basis-[70%]">
                    {/* Tab Buttons */}
                    <div className="flex border-b mb-4 text-xs">
                        <button className={`px-4 py-2 ${activeTab === "White Box" ? "border-b-2 border-blue-500 font-bold" : ""}`} onClick={() => setActiveTab("White Box")}>White Box</button>
                        <button className={`px-4 py-2 ${activeTab === "Brown Box" ? "border-b-2 border-blue-500 font-bold" : ""}`} onClick={() => setActiveTab("Brown Box")}>Brown Box</button>
                    </div>

                    {/* Table */}
                    <Table
                        filteredData={filteredData}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        totalBoxSales={totalBoxSales}
                        totalPrice={totalPrice}
                        totalGrossSales={totalGrossSales}
                    />
                    <ToastContainer className="text-xs" />
                </div>
            </div>
        </div>
    );
};

export default CreateDataForm;