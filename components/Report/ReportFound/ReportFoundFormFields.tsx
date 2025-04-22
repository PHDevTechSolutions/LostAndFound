import React, { useState, useEffect } from "react";
import Select from 'react-select';

interface FormFieldsProps {
    ReferenceNumber: string; setReferenceNumber: (value: string) => void;
    Email: string; setEmail: (value: string) => void;

    DateFound: string; setDateFound: (value: string) => void;
    ItemName: string; setItemName: (value: string) => void;
    FoundLocation: string; setFoundLocation: (value: string) => void;
    Message: string; setMessage: (value: string) => void;
    ItemOwner: string; setItemOwner: (value: string) => void;
    ItemFinder: string; setItemFinder: (value: string) => void;
    ItemStatus: string; setItemStatus: (value: string) => void;
    editData?: any;
}

const FormFields: React.FC<FormFieldsProps> = ({
    ReferenceNumber, setReferenceNumber,
    Email, setEmail,

    DateFound, setDateFound,
    ItemName, setItemName,
    FoundLocation, setFoundLocation,
    Message, setMessage,
    ItemOwner, setItemOwner,
    ItemFinder, setItemFinder,
    ItemStatus, setItemStatus,
    editData,
}) => {
    
    const [tickets, setTickets] = useState<any[]>([]);
    useEffect(() => {
        const fetchReports = async () => {
          try {
            const response = await fetch('/api/Report/ReportFound/FetchSubmittedReports');
            const data = await response.json();
            setTickets(data); // fixed: should be setTickets, not setReferenceNumber
          } catch (error) {
            console.error('Error fetching reference numbers:', error);
          }
        };
        fetchReports();
      }, []);

      const referenceNumberOptions = tickets.map(ticket => ({
        value: ticket.ReferenceNumber,
        label: ticket.ReferenceNumber,
      }));

    const handleReferenceNumberChange = async (selectedOption: any) => {
        const selectedReferenceNumber = selectedOption ? selectedOption.value : '';
        setReferenceNumber(selectedReferenceNumber);

        if (selectedReferenceNumber) {
            try {
                const response = await fetch(`/api/Report/ReportFound/FetchSubmittedReports?ReferenceNumber=${encodeURIComponent(selectedReferenceNumber)}`);
                if (response.ok) {
                    const companyDetails = await response.json();
                    setReferenceNumber(companyDetails.ReferenceNumber || '');
                    setItemName(companyDetails.ItemName || '');
                    setItemOwner(companyDetails.ItemOwner || '');
                    setEmail(companyDetails.Email || '');
                } else {
                    console.error(`Company not found: ${selectedReferenceNumber}`);
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
        setReferenceNumber('');
        setItemName('');
        setItemOwner('');
    };

    return (
        <>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="DateFound">Date Found</label>
                    <input type="date" id="DateFound" value={DateFound || ""} onChange={(e) => setDateFound(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
                    <input type="hidden" id="Email" value={Email || ""} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ReferenceNumber">Reference Ticket Number</label>
                    <Select id="ReferenceNumber" options={referenceNumberOptions} onChange={handleReferenceNumberChange} className="w-full text-xs capitalize" placeholder="Select Reference Number" isClearable />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="FoundLocation">Location of Item Found</label>
                    <input type="text" id="FoundLocation" value={FoundLocation || ""} onChange={(e) => setFoundLocation(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ItemName">Item Name</label>
                    <input type="text" id="ItemName" value={ItemName || ""} onChange={(e) => setItemName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" disabled/>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Message">Message / Feedback</label>
                    <textarea id="Message" value={Message || ""} onChange={(e) => setMessage(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" rows={3}></textarea>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ItemOwner">Name of Owner</label>
                    <input type="text" id="ItemOwner" value={ItemOwner || ""} onChange={(e) => setItemOwner(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" disabled/>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ItemFinder">Name of Person Who Discover Lost/Found Items</label>
                    <input type="text" id="ItemFinder" value={ItemFinder || ""} onChange={(e) => setItemFinder(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" disabled/>
                </div>
                

                <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="ItemStatus">ItemStatus</label>
                    <select id="ItemStatus" value={ItemStatus || ""} onChange={(e) => setItemStatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase">
                        <option value="">Select Status</option>
                        <option value="Found">Found</option>
                    </select>
                </div>
            </div>
        </>
    );
};

export default FormFields;
