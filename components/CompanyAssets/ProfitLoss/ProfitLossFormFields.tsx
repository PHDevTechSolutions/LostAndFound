import React, { useState, useEffect } from "react";

interface FormFieldsProps {
  // Location Tagging
  Location: string;
  setLocation: (value: string) => void;
  ReferenceNumber: string;
  setReferenceNumber: (value: string) => void;

  DateRecord: string;
  setDateRecord: (value: string) => void;
  ModeType: string;
  setModeType: (value: string) => void;
  Amount: string;
  setAmount: (value: string) => void;

  editData?: any;
}

const ContainerFormFields: React.FC<FormFieldsProps> = ({
  // Location Tagging
  Location,
  setLocation,
  ReferenceNumber,
  setReferenceNumber,
  DateRecord,
  setDateRecord,
  ModeType,
  setModeType,
  Amount,
  setAmount,
  editData,
}) => {
  const generateReferenceNumber = () => {
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase(); // Random letters and numbers
    const randomNumber = Math.floor(Math.random() * 1000); // Random number between 0-999
    return `JJV-${randomString}-${randomNumber}`;
  };

  useEffect(() => {
    // Set initial ReferenceNumber on component mount
    setReferenceNumber(generateReferenceNumber());
  }, []);

  // List of months
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate year range dynamically
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // Split DateRecord into month and year
  const [selectedMonth, setSelectedMonth] = useState<string>(
    DateRecord?.split("-")[1] || "01"
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    DateRecord?.split("-")[0] || currentYear.toString()
  );

  // Update DateRecord on month/year change
  useEffect(() => {
    const formattedDate = `${selectedYear}-${selectedMonth.padStart(2, "0")}`;
    setDateRecord(formattedDate);
  }, [selectedMonth, selectedYear, setDateRecord]);

  return (
    <>
      <div className="flex flex-wrap -mx-4">
        {/* Month & Year Select */}
        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="DateRecord">
            Month & Year
          </label>
          <div className="flex space-x-2">
            {/* Month Dropdown */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-1/2 px-3 py-2 border rounded text-xs"
            >
              {months.map((month, index) => (
                <option key={index} value={(index + 1).toString().padStart(2, "0")}>
                  {month}
                </option>
              ))}
            </select>

            {/* Year Dropdown */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-1/2 px-3 py-2 border rounded text-xs"
            >
              {years.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <input
            type="hidden"
            id="DateRecord"
            value={DateRecord}
            onChange={(e) => setDateRecord(e.target.value)}
          />
        </div>

        {/* Mode Type */}
        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="ModeType">
            Type
          </label>
          <select
            value={ModeType || ""}
            onChange={(e) => setModeType(e.target.value)}
            className="w-full px-3 py-2 border rounded text-xs capitalize"
            required
          >
            <option value="">Select Type</option>
            <option value="Sales">Sales</option>
            <option value="Beg. Inventory">Beg. Inventory</option>
            <option value="Purchases - Importation">Purchases - Importation</option>
            <option value="Good Available for Sales">Good Available for Sales</option>
            <option value="Less: Ending Inventory">Less: Ending Inventory</option>
            <option value="Freight & Other Charges">
              Freight & Other Charges
            </option>
            <option value="Salaries & Wages">Salaries & Wages</option>
            <option value="Cold Storage">Cold Storage</option>
            <option value="Utilities">Utilities</option>
            <option value="Employee Benefits">Employee Benefits</option>
            <option value="SSS/Philhealth/HDMF">SSS/Philhealth/HDMF</option>
            <option value="Fuel & Oil">Fuel & Oil</option>
            <option value="Meals & Representation">
              Meals & Representation
            </option>
            <option value="Miscellaneous">Miscellaneous</option>
            <option value="Office & Pantry Supplies">
              Office & Pantry Supplies
            </option>
            <option value="Permit/Insurance - Car">
              Permit/Insurance - Car
            </option>
            <option value="Commision Expense">Commision Expense</option>
            <option value="Prof Fee">Prof Fee</option>
            <option value="Reimbursement">Reimbursement</option>
            <option value="Sambat Expense">Sambat Expense</option>
            <option value="Rental">Rental</option>
            <option value="Repairs & maintenance">
              Repairs and maintenance
            </option>
            <option value="Salaries - OJT">Salaries - OJT</option>
            <option value="Salaries - Santulan">Salaries - Santulan</option>
            <option value="Salaries - Labor/Checker">
              Salaries - Labor/Checker
            </option>
            <option value="Signing Bonus">Signing Bonus</option>
            <option value="Taxes & Licenses">Taxes & Licenses</option>
            <option value="Unaccounted/Various Expense">
              Unaccounted/Various Expense
            </option>
            <option value="Transpo & Travel">Transpo & Travel</option>
            <option value="Depreciation Expense">
              Depreciation Expense
            </option>
            <option value="Other Income">Other Income</option>
            <option value="Other Income (Net, Bank, Interest)">
              Other Income (Net, Bank, Interest)
            </option>
            <option value="Other Expense - Budegero/Elois Exp and Food Allowance">
              Other Expense - Budegero/Elois Exp and Food Allowance
            </option>
          </select>
        </div>

        {/* Amount */}
        <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
          <label className="block text-xs font-bold mb-2" htmlFor="Amount">
            Amount
          </label>
          <input
            type="text"
            id="Amount"
            value={Amount || ""}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded text-xs uppercase"
          />
        </div>
      </div>
    </>
  );
};

export default ContainerFormFields;
