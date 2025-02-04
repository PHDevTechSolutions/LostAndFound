import React, { useState, useEffect } from "react";

interface Payment {
    amount: string;
    status: string;
    date: string;
    containerNo: string;
    buyersName: string;
    _id: string;
}

interface PedienteFormFieldsProps {
    userName: string;
    setuserName: (value: string) => void;
    DateOrder: string;
    setDateOrder: (value: string) => void;
    BuyersName: string;
    setBuyersName: (value: string) => void;
    PlaceSales: string;
    setPlaceSales: (value: string) => void;
    ContainerNo: string;
    setContainerNo: (value: string) => void;
    Size: string;
    setSize: (value: string) => void;
    BoxSales: string;
    setBoxSales: (value: string) => void;
    Price: string;
    setPrice: (value: string) => void;
    GrossSales: string;
    setGrossSales: (value: string) => void;
    PayAmount: string;
    setPayAmount: (value: string) => void;
    BalanceAmount: string;
    setBalanceAmount: (value: string) => void;
    Status: string;
    setStatus: (value: string) => void;
    paymentHistory: Payment[];
    setPaymentHistory: React.Dispatch<React.SetStateAction<Payment[]>>;
    editPost?: any;
}

const PedienteFormFields: React.FC<PedienteFormFieldsProps> = ({
    userName, setuserName,
    DateOrder, setDateOrder,
    BuyersName, setBuyersName,
    PlaceSales, setPlaceSales,
    ContainerNo, setContainerNo,
    Size, setSize,
    BoxSales, setBoxSales,
    Price, setPrice,
    GrossSales, setGrossSales,
    PayAmount, setPayAmount,
    BalanceAmount, setBalanceAmount,
    Status, setStatus,
    paymentHistory, setPaymentHistory,
    editPost,
}) => {

    useEffect(() => {
        const storedHistory = localStorage.getItem("paymentHistory");
        if (storedHistory) {
            setPaymentHistory(JSON.parse(storedHistory));
        }
    }, [setPaymentHistory]);

    useEffect(() => {
        // Calculate the total payment amount based on payment history
        const totalPayment = filteredPaymentHistory.reduce((total, payment) => total + parseFloat(payment.amount || "0"), 0);
        
        // Set PayAmount as the total amount from the payment history
        setPayAmount(totalPayment.toFixed(2));
    }, [paymentHistory, setPayAmount]);

    const [isUpdatingBalance, setIsUpdatingBalance] = useState(false);

    const handleAddPayment = () => {
        setIsUpdatingBalance(false);  // Reset to adding payment mode
    
        if (!BalanceAmount) {
            alert("Please enter a valid payment amount.");
            return;
        }
    
        const newPayment: Payment = {
            amount: BalanceAmount,
            status: Status,  // Will be optional here
            date: new Date().toLocaleDateString(),
            containerNo: ContainerNo,
            buyersName: BuyersName,
            _id: editPost?._id,
        };
    
        const updatedHistory = [...paymentHistory, newPayment];
        setPaymentHistory(updatedHistory);
        localStorage.setItem("paymentHistory", JSON.stringify(updatedHistory));
        setBalanceAmount(""); // Clear BalanceAmount after adding payment
        setStatus(""); // Reset status field
    };

    const handleUpdatePayment = () => {
        setIsUpdatingBalance(true);  // Set to update balance mode
    
        if (!BalanceAmount || !Status) {
            alert("Please enter a valid payment amount and select a status.");
            return;
        }
    
        const updatedHistory = [...paymentHistory];
        const lastPaymentIndex = updatedHistory.length - 1;
    
        if (lastPaymentIndex >= 0) {
            updatedHistory[lastPaymentIndex] = {
                ...updatedHistory[lastPaymentIndex],
                amount: BalanceAmount,
                status: Status,
                date: new Date().toLocaleDateString(),
            };
        }
    
        setPaymentHistory(updatedHistory);
        localStorage.setItem("paymentHistory", JSON.stringify(updatedHistory));
        setBalanceAmount(""); // Clear BalanceAmount after update
        setStatus(""); // Reset status field
    };

    const handleDeletePayment = (index: number) => {
        const updatedHistory = [...paymentHistory];
        updatedHistory.splice(index, 1);

        setPaymentHistory(updatedHistory);
        localStorage.setItem("paymentHistory", JSON.stringify(updatedHistory));
    };

    const filteredPaymentHistory = paymentHistory.filter(payment => 
        payment._id === editPost?._id
    );

    return (
        <>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="DateOrder">Date Order</label>
                    <input type="text" id="DateOrder" value={DateOrder} onChange={(e) => setDateOrder(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize bg-gray-100" readOnly />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="BuyersName">Buyers Name</label>
                    <input type="text" id="BuyersName" value={BuyersName} onChange={(e) => setBuyersName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize bg-gray-100" readOnly />
                </div>
            </div>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="PlaceSales">Place of Sales</label>
                    <input type="email" id="PlaceSales" value={PlaceSales} onChange={(e) => setPlaceSales(e.target.value)} className="w-full px-3 py-2 border rounded text-xs bg-gray-100" readOnly />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ContainerNo">Container No</label>
                    <input type="email" id="ContainerNo" value={ContainerNo} onChange={(e) => setContainerNo(e.target.value)} className="w-full px-3 py-2 border rounded text-xs bg-gray-100" readOnly />
                </div>
            </div>

            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Size">Size</label>
                    <input type="text" id="Size" value={Size} onChange={(e) => setSize(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize bg-gray-100" readOnly />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="BoxSales">BoxSales</label>
                    <input type="text" id="BoxSales" value={BoxSales} onChange={(e) => setBoxSales(e.target.value)} className="w-full px-3 py-2 border rounded text-xs bg-gray-100" readOnly />
                </div>
            </div>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Price">Price</label>
                    <input type="text" id="Price" value={Price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 border rounded text-xs bg-gray-100" readOnly />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="GrossSales">GrossSales</label>
                    <input type="text" id="GrossSales" value={GrossSales} onChange={(e) => setGrossSales(e.target.value)} className="w-full px-3 py-2 border rounded text-xs bg-gray-100" readOnly />
                </div>
            </div>

            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/4 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="BalanceAmount">Enter Amount</label>
                    <input type="text" id="BalanceAmount" value={BalanceAmount ?? ""} onChange={(e) => setBalanceAmount(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                    
                </div>
                <div className="w-full sm:w-1/4 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="PayAmount">Total Pay Amount</label>
                    <input type="text" id="PayAmount" value={PayAmount ?? ""} onChange={(e) => setPayAmount(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />

                </div>
                <div className="w-full sm:w-1/4 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Status">Status</label>
                    <select id="Status" value={Status ?? ""} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
                        <option value="">Select Status</option>
                        <option value="Paid Balance">Paid Balance</option>
                        <option value="Fully Paid">Fully Paid</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-between mb-2">
                <button onClick={handleAddPayment} className="bg-green-800 text-white px-4 py-2 rounded text-xs">Add Payment</button>
                <button type="submit" onClick={editPost ? handleUpdatePayment : undefined} className="bg-blue-500 text-white px-4 py-2 rounded text-xs">{editPost ? "Update Balance" : "Submit"}</button>
            </div>

            {/* Payment History Table */}
            {filteredPaymentHistory.length > 0 && (
                <div className="mt-4 mb-2">
                    <h3 className="text-sm font-bold mb-2">Payment History</h3>
                    <table className="w-full border text-xs">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="border px-2 py-1">Date</th>
                                <th className="border px-2 py-1">Amount</th>
                                <th className="border px-2 py-1">Status</th>
                                <th className="border px-2 py-1">Container No</th>
                                <th className="border px-2 py-1">Buyer's Name</th>
                                <th className="border px-2 py-1">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPaymentHistory.map((payment, index) => (
                                <tr key={index}>
                                    <td className="border px-2 py-1">{payment.date}</td>
                                    <td className="border px-2 py-1">{payment.amount}</td>
                                    <td className="border px-2 py-1">{payment.status}</td>
                                    <td className="border px-2 py-1">{payment.containerNo}</td>
                                    <td className="border px-2 py-1 capitalize">{payment.buyersName}</td>
                                    <td className="border px-2 py-1 text-center">
                                        <button
                                            type="button"
                                            onClick={() => handleDeletePayment(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={1} className="border px-2 py-1 text-right font-bold">Total Amount:</td>
                                <td className="border px-2 py-1 font-bold">
                                {filteredPaymentHistory.reduce((total, payment) => total + parseFloat(payment.amount || "0"), 0).toFixed(2)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </>
    )
}

export default PedienteFormFields;
