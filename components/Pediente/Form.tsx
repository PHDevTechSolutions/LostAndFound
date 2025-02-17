import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface FormProps {
    beginningBalance: number;
    totalPayment: number;
    totalBalance: number;
    totalAmount: number;
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
};

const Form: React.FC<FormProps> = ({ beginningBalance, totalAmount, totalPayment, totalBalance }) => {
    const [dateToday, setDateToday] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = {
            beginningBalance,
            addReceivable: formatCurrency(totalAmount),
            lessCollection: formatCurrency(totalPayment),
            totalBalance: formatCurrency(totalBalance),
            dateToday,
        };

        try {
            const response = await fetch("/api/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Email sent successfully!");
            } else {
                toast.error(result.message || "Failed to send email.");
            }
        } catch (error) {
            console.error("Error sending email:", error);
            toast.error("Failed to send email.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-wrap mx-auto mt-4 mb-4 border p-4 shadow-md rounded-md">
                    <div className="w-full sm:w-1/2 md:w-1/5 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="BeginningBalance">Beginning Balance</label>
                        <input type="text" id="BeginningBalance" value={formatCurrency(beginningBalance)} className="w-full px-3 py-2 border rounded text-xs bg-gray-100" readOnly />
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/5 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="AddReceivable">Add Receivable</label>
                        <input type="text" id="AddReceivable" value={formatCurrency(totalAmount)} className="w-full px-3 py-2 border rounded text-xs bg-gray-100" readOnly />
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/5 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="LessCollection">Less Collection</label>
                        <input type="text" id="LessCollection" value={formatCurrency(totalPayment)} className="w-full px-3 py-2 border rounded text-xs bg-gray-100" readOnly />
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/5 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="TotalBalance">Total Balance</label>
                        <input type="text" id="TotalBalance" value={formatCurrency(totalBalance)} className="w-full px-3 py-2 border rounded text-xs bg-gray-100" readOnly />
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/5 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="DateToday">Date Today</label>
                        <input type="datetime-local" id="DateToday" className="w-full px-3 py-2 border rounded text-xs" onChange={(e) => setDateToday(e.target.value)} />
                    </div>
                    <div className="flex justify-between p-4 pt-0">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded text-xs">Send to Email</button>
                    </div>
                </div>
            </form>

            {/* ToastContainer should be inside the JSX */}
            <ToastContainer className="text-xs" autoClose={1000} />
        </div>
    );
};

export default Form;
