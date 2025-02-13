import React, { useState, useEffect } from "react";
import Select from 'react-select';

interface Payment {
    amount: string;
    status: string;
    date: string;
    containerNo: string;
    buyersName: string;
    _id: string;
}

interface PedienteFormFieldsProps {
    Location: string; setLocation: (value: string) => void;
    userName: string; setuserName: (value: string) => void;
    DatePediente: string; setDatePediente: (value: string) => void;
    DateOrder: string; setDateOrder: (value: string) => void;
    BuyersName: string; setBuyersName: (value: string) => void;
    PlaceSales: string; setPlaceSales: (value: string) => void;
    ContainerNo: string; setContainerNo: (value: string) => void;
    Commodity: string; setCommodity: (value: string) => void;
    Size: string; setSize: (value: string) => void;
    BoxSales: string; setBoxSales: (value: string) => void;
    Price: string; setPrice: (value: string) => void;
    PaymentMode: string; setPaymentMode: (value: string) => void;
    GrossSales: string; setGrossSales: (value: string) => void;
    PayAmount: string; setPayAmount: (value: string) => void;
    BalanceAmount: string; setBalanceAmount: (value: string) => void;
    Status: string; setStatus: (value: string) => void;
    editPost?: any;
}

const PedienteFormFields: React.FC<PedienteFormFieldsProps> = ({
    Location, setLocation,
    userName, setuserName,
    DatePediente, setDatePediente,
    DateOrder, setDateOrder,
    BuyersName, setBuyersName,
    PlaceSales, setPlaceSales,
    ContainerNo, setContainerNo,
    Commodity, setCommodity,
    Size, setSize,
    BoxSales, setBoxSales,
    Price, setPrice,
    GrossSales, setGrossSales,
    PaymentMode, setPaymentMode,
    PayAmount, setPayAmount,
    BalanceAmount, setBalanceAmount,
    Status, setStatus,
    editPost,
}) => {
    const [customerList, setCustomerList] = useState<any[]>([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch(`/api/customer?Location=${encodeURIComponent(Location)}`);
                const data = await response.json();

                // Assuming the server already filters by Location, you may not need to filter it again.
                setCustomerList(data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };
        fetchCustomers();
    }, [Location]); // Refetch when Location changes

    useEffect(() => {
        // Automatically set today's date
        const today = new Date().toISOString().split("T")[0];
        setDatePediente(today);
      }, []);

    const customerOptions = customerList.map((customer) => ({
        value: customer.BuyersName,  // Use the BuyersName or any other unique identifier
        label: `${customer.BuyersName} | ${customer.ContainerNo} | ${customer.DateOrder} | ${customer.Size} | ${customer.GrossSales}`,
    }));

    const handleCustomerChange = async (selectedOption: any) => {
        const selectedCustomer = selectedOption ? selectedOption.value : '';
        setBuyersName(selectedCustomer);

        if (selectedCustomer) {
            try {
                const response = await fetch(`/api/customer?BuyersName=${encodeURIComponent(selectedCustomer)}&Location=${encodeURIComponent(Location)}`);
                if (response.ok) {
                    const customerDetails = await response.json();
                    setBuyersName(customerDetails.BuyersName || '');
                    setDateOrder(customerDetails.DateOrder || '');
                    setPlaceSales(customerDetails.PlaceSales || '');
                    setContainerNo(customerDetails.ContainerNo || '');
                    setCommodity(customerDetails.Commodity || '');
                    setSize(customerDetails.Size || '');
                    setBoxSales(customerDetails.BoxSales || '');
                    setPrice(customerDetails.Price || '');
                    setGrossSales(customerDetails.GrossSales || '');
                    setPaymentMode(customerDetails.PaymentMode || '');

                } else {
                    console.error(`Customer not found: ${selectedCustomer}`);
                    resetFields();
                }
            } catch (error) {
                console.error('Error fetching customer details:', error);
                resetFields();
            }
        } else {
            resetFields();
        }
    };

    const resetFields = () => {
        setBuyersName('');
        setDateOrder('');
        setPlaceSales('');
        setContainerNo('');
        setCommodity('');
        setSize('');
        setBoxSales('');
        setPrice('');
        setGrossSales('');
        setPaymentMode('');
    };

    useEffect(() => {
        const payAmountNum = parseFloat(PayAmount) || 0;
        const grossSalesNum = parseFloat(GrossSales) || 0;
        const balance = grossSalesNum - payAmountNum;

        setBalanceAmount(balance.toFixed(2)); // Keep 2 decimal places
    }, [PayAmount, GrossSales, setBalanceAmount]);

    return (
        <>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="DatePediente">Date</label>
                    <input type="hidden" id="Location" value={Location || ""} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
                    <input type="date" id="DatePediente" value={DatePediente} onChange={(e) => setDatePediente(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="BuyersName">Buyers Name</label>
                    {editPost ? (
                        <input type="text" id="BuyersName" value={BuyersName} readOnly className="w-full px-3 py-2 border bg-gray-50 rounded text-xs" />
                    ) : (
                        <Select id="BuyersName" options={customerOptions} onChange={handleCustomerChange} className="w-full text-xs capitalize" placeholder="Select Company" isClearable />
                    )}
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="DateOrder">Date Order</label>
                    <input type="date" id="DateOrder" value={DateOrder} onChange={(e) => setDateOrder(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize bg-gray-50" />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="PlaceSales">Place of Sales</label>
                    <input type="text" id="PlaceSales" value={PlaceSales} onChange={(e) => setPlaceSales(e.target.value)} className="w-full px-3 py-2 border rounded text-xs bg-gray-50" />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ContainerNo">Container No</label>
                    <input type="text" id="ContainerNo" value={ContainerNo} onChange={(e) => setContainerNo(e.target.value)} className="w-full px-3 py-2 border rounded text-xs bg-gray-50" />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Commodity">Commodity</label>

                    <select id="Commodity" value={Commodity || ""} onChange={(e) => setCommodity(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
                        <option value="">Select Commodity</option>
                        <option value="Chabeta">Chabeta</option>
                        <option value="Galunggong (Female)">Galunggong (Female)</option>
                        <option value="Galunggon (Male)">Galunggon (Male)</option>
                        <option value="Matambaka">Matambaka</option>
                        <option value="Pampano">Pampano</option>
                        <option value="Salmon">Salmon</option>
                        <option value="Tulingan">Tulingan</option>
                        <option value="Yellow Tail">Yellow Tail</option>
                    </select>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Size">Size</label>
                    <input type="text" id="Size" value={Size} onChange={(e) => setSize(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize bg-gray-50" />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="BoxSales">BoxSales</label>
                    <input type="text" id="BoxSales" value={BoxSales} onChange={(e) => setBoxSales(e.target.value)} className="w-full px-3 py-2 border rounded text-xs bg-gray-50" />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Price">Sales Price</label>
                    <input type="text" id="Price" value={Price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 border rounded text-xs bg-gray-50" />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="GrossSales">Total Debt</label>
                    <input type="text" id="GrossSales" value={GrossSales} onChange={(e) => setGrossSales(e.target.value)} className="w-full px-3 py-2 border rounded text-xs bg-gray-50" />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="PaymentMode">Mode of Payment</label>
                    <input type="text" id="PaymentMode" value={PaymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-full px-3 py-2 border rounded text-xs bg-gray-50" />
                </div>
                <div className="w-full sm:w-1/4 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="PayAmount">Payment Amount</label>
                    <input type="text" id="PayAmount" value={PayAmount ?? ""} onChange={(e) => { const value = e.target.value; if (/^\d*\.?\d*$/.test(value)) { setPayAmount(value); } }} className="w-full px-3 py-2 border rounded text-xs" />
                </div>
                <div className="w-full sm:w-1/4 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="BalanceAmount">Total Balance</label>
                    <input type="text" id="BalanceAmount" value={BalanceAmount ?? ""} onChange={(e) => setBalanceAmount(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" readOnly />
                </div>
                <div className="w-full sm:w-1/4 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Status">Status</label>
                    <select id="Status" value={Status ?? ""} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
                        <option value="">Select Status</option>
                        <option value="New Debt">New Debt</option>
                        <option value="Paid Balance">Paid Balance</option>
                        <option value="Fully Paid">Fully Paid</option>
                    </select>
                </div>
            </div>
        </>
    );
};

export default PedienteFormFields;
