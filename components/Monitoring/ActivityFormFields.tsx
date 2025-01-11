import React, { useState, useEffect } from 'react';
import Select from 'react-select';

interface FormFieldsProps {
    companyName: string; setCompanyName: (value: string) => void;
    customerName: string; setCustomerName: (value: string) => void;
    gender: string; setGender: (value: string) => void;
    contactNumber: string; setContactNumber: (value: string) => void;
    cityAddress: string; setCityAddress: (value: string) => void;
    channel: string; setChannel: (value: string) => void;
    wrapUp: string; setWrapUp: (value: string) => void;
    source: string; setSource: (value: string) => void;
    customerType: string; setCustomerType: (value: string) => void;
    customerStatus: string; setCustomerStatus: (value: string) => void;
    cStatus: string; setCstatus: (value: string) => void;
    orderNumber: string; setOrderNumber: (value: string) => void;
    amount: string; setAmount: (value: string) => void;
    qtySold: string; setQtySold: (value: string) => void;
    salesManager: string; setSalesManager: (value: string) => void;
    salesAgent: string; setSalesAgent: (value: string) => void;
    ticketReceived: string; setTicketReceived: (value: string) => void;
    ticketEndorsed: string; setTicketEndorsed: (value: string) => void;
    editPost?: any;
}

const ActivityFormFields: React.FC<FormFieldsProps> = ({
    companyName, setCompanyName, customerName, setCustomerName,
    gender, setGender, contactNumber, setContactNumber,
    cityAddress, setCityAddress, channel, setChannel,
    wrapUp, setWrapUp, source, setSource,
    customerType, setCustomerType, customerStatus, setCustomerStatus,
    cStatus, setCstatus, orderNumber, setOrderNumber,
    amount, setAmount, qtySold, setQtySold,
    salesManager, setSalesManager, salesAgent, setSalesAgent,
    ticketReceived, setTicketReceived, ticketEndorsed, setTicketEndorsed,
    editPost
}) => {
    const [companies, setCompanies] = useState<any[]>([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('/api/companies');
                const data = await response.json();
                setCompanies(data);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };
        fetchCompanies();
    }, []);

    const companyOptions = companies.map((company) => ({
        value: company.companyName,
        label: company.companyName,
    }));

    const handleCompanyChange = async (selectedOption: any) => {
        const selectedCompany = selectedOption ? selectedOption.value : '';
        setCompanyName(selectedCompany);

        if (selectedCompany) {
            try {
                const response = await fetch(`/api/companies?companyName=${encodeURIComponent(selectedCompany)}`);
                if (response.ok) {
                    const companyDetails = await response.json();
                    setCustomerName(companyDetails.customerName || '');
                    setGender(companyDetails.gender || '');
                    setContactNumber(companyDetails.contactNumber || '');
                    setCityAddress(companyDetails.cityAddress || '');
                } else {
                    console.error(`Company not found: ${selectedCompany}`);
                    resetFields();
                }
            } catch (error) {
                console.error('Error fetching company details:', error);
                resetFields();
            }
        } else {
            resetFields();
        }
    };

    const resetFields = () => {
        setCustomerName('');
        setGender('');
        setContactNumber('');
        setCityAddress('');
    };

    return (
        <>
            <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                <h1 className="text-lg font-bold mb-2">Account Information</h1>
                <div className="flex flex-wrap -mx-4">
                    <div className="w-full sm:w-1/2 md:w-1/3 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="companyname">Company Name</label>
                        {editPost ? (
                            <input type="text" id="companyname" value={companyName} readOnly className="w-full px-3 py-2 border bg-gray-50 rounded text-xs" />
                        ) : (
                            <Select id="companyname" options={companyOptions} onChange={handleCompanyChange} className="w-full text-xs" placeholder="Select Company" isClearable />
                        )}
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/3 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="customername">Customer Name</label>
                        <input type="text" id="customername" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/3 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="gender">Gender</label>
                        <input type="text" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="contactnumber">Contact Number</label>
                        <input type="text" id="contactnumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                        <label className="block text-xs font-bold mb-2" htmlFor="cityaddress">City Address</label>
                        <input type="text" id="cityaddress" value={cityAddress} onChange={(e) => setCityAddress(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ticketreceived">Ticket Received</label>
                    <input
                        type="datetime-local"
                        id="ticketreceived"
                        value={ticketReceived}
                        onChange={(e) => setTicketReceived(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-xs"
                    />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ticketendorsed">Ticket Endorsed</label>
                    <input
                        type="datetime-local"
                        id="ticketendorsed"
                        value={ticketEndorsed}
                        onChange={(e) => setTicketEndorsed(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-xs"
                    />
                </div>
            </div>

            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="channel">Channel</label>
                    <select id="channel" value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                        <option value="">Select Channel</option>
                        <option value="Email">Email</option>
                        <option value="Shopee">Shopee</option>
                        <option value="Voice Call">Voice Call</option>
                    </select>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="wrapup">Wrap-Up</label>
                    <select id="wrapup" value={wrapUp} onChange={(e) => setWrapUp(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                        <option value="">Select</option>
                        <option value="Customer Inquiry Sales">Customer Inquiry Sales</option>
                        <option value="Customer Inquiry Non-Sales">Customer Inquiry Non-Sales</option>
                        <option value="Follow Up Sales">Follow Up Sales</option>
                        <option value="After Sales">After Sales</option>
                        <option value="Customer Complaint">Customer Complaint</option>
                        <option value="Customer Feedback/Recommendation">Customer Feedback/Recommendation</option>
                        <option value="Job Inquiry">Job Inquiry</option>
                        <option value="Job Applicants">Job Applicants</option>
                        <option value="Supplier/Vendor Product Offer">Supplier/Vendor Product Offer</option>
                        <option value="Follow Up Non-Sales">Follow Up Non-Sales</option>
                        <option value="Internal Whistle Blower">Internal Whistle Blower</option>
                        <option value="Threats/Extortion/Intimidation">Threats/Extortion/Intimidation</option>
                        <option value="Prank Call">Prank Call</option>
                        <option value="Supplier Accreditation Request">Supplier Accreditation Request</option>
                        <option value="Internal Concern">Internal Concern</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="source">Source</label>
                    <select id="source" value={source} onChange={(e) => setSource(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                        <option value="">Select Source</option>
                        <option value="FB Main">FB Main</option>
                        <option value="FB ES Home">FB ES Home</option>
                        <option value="Viber">Viber</option>
                        <option value="Catalogue">Catalogue</option>
                        <option value="Call">Call</option>
                        <option value="Website">Website</option>
                        <option value="Word of Mouth">Word of Mouth</option>
                        <option value="Quotation Docs">Quotation Docs</option>
                        <option value="Google Search">Google Search</option>
                        <option value="Ads">Ads</option>
                        <option value="Email">Email</option>
                        <option value="Agent Call">Agent Call</option>
                        <option value="Shopee">Shopee</option>
                        <option value="Lazada">Lazada</option>
                        <option value="Tiktok">Tiktok</option>
                    </select>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="customertype">Customer Type</label>
                    <select id="customertype" value={customerType} onChange={(e) => setCustomerType(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                        <option value="">Select Type</option>
                        <option value="B2B">B2B</option>
                        <option value="B2C">B2C</option>
                        <option value="B2G">B2G</option>
                        <option value="Gentrade">Gentrade</option>
                        <option value="Modern Trade">Modern Trade</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="customerstatus">Customer Status</label>
                    <select id="customerstatus" value={customerStatus} onChange={(e) => setCustomerStatus(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                        <option value="">Select Customer Status</option>
                        <option value="New">New</option>
                        <option value="Existing">Existing</option>
                    </select>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="status">Status</label>
                    <select id="cstatus" value={cStatus} onChange={(e) => setCstatus(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded text-xs">
                        <option value="">Select Status</option>
                        <option value="Pending Quotation">Pending Quotation</option>
                        <option value="Created Sales Order">Created Sales Order</option>
                        <option value="Paid">Paid</option>
                        <option value="Not Converted To Sales">Not Converted To Sales</option>
                        <option value="Endorsed">Endorsed</option>
                        <option value="Pending Delivery">Pending Delivery</option>
                        <option value="Closed">Closed</option>
                        <option value="Pending">Pending</option>
                        <option value="Quotation Sent">Quotation Sent</option>
                        <option value="For Occular Inspection">For Occular Inspection</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ordernumber">Order Number</label>
                    <input type="text" id="ordernumber" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="amount">Amount</label>
                    <input type="text" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                </div>
            </div>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/3 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="qtysold">QTY Sold</label>
                    <input type="text" id="qtysold" value={qtySold} onChange={(e) => setQtySold(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/3 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="salesmanager">Sales Manager</label>
                    <input type="text" id="salesmanager" value={salesManager} onChange={(e) => setSalesManager(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/3 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="salesagent">Sales Agent</label>
                    <input type="text" id="salesagent" value={salesAgent} onChange={(e) => setSalesAgent(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                </div>
            </div>
        </>
    );
};

export default ActivityFormFields;
