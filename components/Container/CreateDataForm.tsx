"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Table from "./OrderTable";
import OrderFormFields from "./OrderFormFields";
import { FetchUsername } from "../FetchUsername";

interface CreateDataFormProps {
    post: any;
    onCancel: () => void;
}

// Post
const CreateDataForm: React.FC<CreateDataFormProps> = ({ post, onCancel }) => {
    const [ContainerNo, setContainerNo] = useState(post?.ContainerNo || "");
    const [Size, setSize] = useState(post?.Size || "");
    const [userName, setuserName] = useState("");
    const [Location, setLocation] = useState(post?.Location || "");
    const [DateOrder, setDateOrder] = useState("");
    const [BuyersName, setBuyersName] = useState("");
    const [BoxSales, setBoxSales] = useState("");
    const [Price, setPrice] = useState("");
    const [Boxes, setBoxes] = useState(post?.Boxes || "");
    const [OriginalBoxes, setOriginalBoxes] = useState(post?.Boxes || "");
    const [GrossSales, setGrossSales] = useState("");
    const [PlaceSales, setPlaceSales] = useState("BELEN STORAGE");
    const [PaymentMode, setPaymentMode] = useState("");
    const [editData, setEditData] = useState<any>(null);
    const [tableData, setTableData] = useState<any[]>([]);

    //Fetch Username at Data
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get("id");
        if (userId) {
            FetchUsername(userId, setuserName); // Use the function
        }
        fetchData();
    }, [post]);

    //Handle Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate ContainerNo
        if (!ContainerNo) {
            toast.error("Container No is required", { autoClose: 1000 });
            return;
        }
    
        let remainingBoxes = parseInt(Boxes) || 0;
        let newBoxSales = parseInt(BoxSales) || 0;
        
        // Only auto-calculate remainingBoxes on create (if not editing)
        if (!editData) {
            const currentBoxes = parseInt(OriginalBoxes) || 0;
            remainingBoxes = currentBoxes - newBoxSales;
        }
    
        // Determine the URL and method (POST for create, PUT for update)
        const url = editData ? `/api/Container/UpdateContainer` : `/api/Container/SaveContainer`;
        const method = editData ? "PUT" : "POST";
    
        // Send the request to the server
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ContainerNo,
                Size,
                userName,
                Location,
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
    
        // Parse the response
        const data = await response.json();
    
        if (response.ok) {
            toast.success(editData ? "Data updated successfully" : "Data added successfully", {
                autoClose: 1000,
                onClose: async () => {
                    // Reset the form after success
                    handleReset();
    
                    // After adding or updating, update boxes in the database if necessary
                    if (!editData) {
                        // Handle creation scenario, update boxes in the DB (not just on BoxSales change)
                        try {
                            await updateBoxesInDatabase(post._id, remainingBoxes);
                        } catch (error) {
                            toast.error('Failed to update boxes in the database', { autoClose: 1000 });
                        }
                    }
    
                    // Refetch the data to update the table (this should reflect new data)
                    await fetchData();
                },
            });
        } else {
            // Handle errors and duplicate entries
            if (data.message === "Duplicate entry with the same data.") {
                toast.error("Duplicate entry with the same data.", { autoClose: 1000 });
            } else {
                toast.error(editData ? "Failed to update data" : "Failed to add data", { autoClose: 1000 });
            }
        }
    };
    

    //Fetch Data on Table
    const fetchData = async () => {
        const response = await fetch("/api/Container/GetAllContainer");
        const data = await response.json();
        const filteredData = data.filter((container: any) => container.ContainerNo === post?.ContainerNo);
        setTableData(filteredData);
        fetchUpdatedData();
    };
    //Fetch Data on Table
    const fetchUpdatedData = async () => {
        const response = await fetch(`/api/Container/GetContainer?id=${post._id}`);
        const data = await response.json();
        setBoxes(data.Boxes);
        setOriginalBoxes(data.Boxes);
    };

    //Update Boxes ( Remaining Boxes ) Quantity
    const updateBoxesInDatabase = async (id: string, remainingBoxes: number) => {
        try {
            const response = await fetch('/api/Container/UpdateBoxes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, Boxes: remainingBoxes }),
            });

            if (response.ok) {
                toast.success('Boxes updated in database', { autoClose: 1000 });
                fetchData();
            } else {
                toast.error('Failed to update boxes in database', { autoClose: 1000 });
            }
        } catch (error) {
            console.error('Error updating boxes:', error);
            toast.error('An error occurred while updating boxes', { autoClose: 1000 });
        }
    };

    //Edit Fields
    const handleEdit = (data: any) => {
        let updatedBoxes = parseInt(OriginalBoxes) || 0;

        setContainerNo(data.ContainerNo);
        setSize(data.Size);
        setuserName(data.userName);
        setLocation(data.Location);
        setDateOrder(data.DateOrder);
        setBuyersName(data.BuyersName);
        setBoxSales(data.BoxSales);
        setPrice(data.Price);
        setBoxes(updatedBoxes.toString());
        setOriginalBoxes(updatedBoxes.toString());
        setGrossSales(data.GrossSales);
        setPlaceSales(data.PlaceSales);
        setPaymentMode(data.PaymentMode);
        setEditData(data);
    };

    //Delete Data
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

    //Reset Form Fields After Save
    const handleReset = () => {
        setLocation("");
        setDateOrder("");
        setBuyersName("");
        setBoxSales("");
        setPrice("");
        setGrossSales("");
        setPlaceSales("");
        setPaymentMode("");
        setEditData(null);
    };

    // Function to Subtract the Quantity on Remaining Boxes
    const handleBoxSalesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sales = parseInt(e.target.value) || 0;
        const price = parseFloat(Price) || 0;
        const currentBoxes = parseInt(OriginalBoxes) || 0; // Use original boxes for calculation
    
        if (sales > currentBoxes) {
            toast.error("Box sales cannot exceed available boxes.", { autoClose: 1000 });
            setBoxSales("");
            setGrossSales("");
            setBoxes(OriginalBoxes); // Reset boxes to original if error
            return;
        }
    
        const remainingBoxes = currentBoxes - sales;
        setBoxSales(sales.toString());
        setGrossSales((sales * price).toString());
        setBoxes(remainingBoxes.toString());
    };
    

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const price = parseFloat(e.target.value) || 0;
        const sales = parseInt(BoxSales) || 0;

        setPrice(price.toString());
        setGrossSales((sales * price).toString());
    };

    const filteredData = tableData.filter((data) => data.Size === Size); // Filter by Size

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
            <div className="flex flex-wrap gap-4">
                {/* Form Section */}
                <div className="bg-white shadow-md rounded-lg p-4 flex-grow basis-[20%]">
                    <OrderFormFields
                        ContainerNo={ContainerNo} setContainerNo={setContainerNo}
                        Size={Size} setSize={setSize}
                        userName={userName} setuserName={setuserName}
                        Location={Location} setLocation={setLocation} DateOrder={DateOrder}
                        setDateOrder={setDateOrder} BuyersName={BuyersName} setBuyersName={setBuyersName}
                        BoxSales={BoxSales} setBoxSales={setBoxSales} handleBoxSalesChange={handleBoxSalesChange}
                        Price={Price} setPrice={setPrice} handlePriceChange={handlePriceChange}
                        Boxes={Boxes} setBoxes={setBoxes} GrossSales={GrossSales}
                        setGrossSales={setGrossSales} PlaceSales={PlaceSales} setPlaceSales={setPlaceSales}
                        PaymentMode={PaymentMode} setPaymentMode={setPaymentMode} editData={editData}
                        onCancel={onCancel} handleSubmit={handleSubmit}
                    />
                </div>

                {/* Table Section */}
                <div className="bg-white border border-dashed border-gray-300 shadow-md rounded-lg p-4 flex-grow basis-[70%]">
                    <div className="flex flex-col items-start gap-2">
                        <h2 className="text-xs font-semibold text-gray-700">{post?.Vendor}</h2>
                        <h2 className="text-xs font-semibold text-gray-700 mb-6">
                            Container Van No. {post?.ContainerNo}
                        </h2>
                        <h2 className="text-xs font-semibold text gray-700">{post?.BoxType}</h2>
                    </div>
                    <div className="flex mb-4 text-xs font-bold">
                        <h3>Size: {Size}</h3>
                    </div>
                    {/* Table */}
                    <Table
                        filteredData={filteredData}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        totalBoxSales={totalBoxSales}
                        totalPrice={totalPrice}
                        totalGrossSales={totalGrossSales}
                        post={post} // Pass the post prop here
                    />

                </div>
            </div>
        </div>
    );
};

export default CreateDataForm;