import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Post {
    _id: string;
    DateRecord: string;
    ModeType: string;
    Amount: string;
    Location: string;
    ReferenceNumber: string;
}

interface ContainerTableProps {
    posts: Post[];
    handleEdit: (post: Post) => void;
    handleDelete: (postId: string) => void;
    Role: string;
    Location: string;
}

const ContainerTable: React.FC<ContainerTableProps> = ({
    posts,
    handleEdit,
    handleDelete,
    Role,
    Location,
}) => {
    const [activeTab, setActiveTab] = useState<string>("Months");
    const [selectedYear, setSelectedYear] = useState<string>(
        new Date().getFullYear().toString()
    );

    const uniqueYears = Array.from(
        new Set(posts.map((post) => new Date(post.DateRecord).getFullYear()))
    ).sort((a, b) => b - a);

    // Filter posts based on Role, Location, and Year
    const updatedPosts = posts
        .filter((post) => {
            const postYear = new Date(post.DateRecord).getFullYear().toString();
            const locationCheck =
                Role === "Staff" || Role === "Admin" ? post.Location === Location : true;
            return locationCheck && postYear === selectedYear;
        })
        .map((post) => ({
            ...post,
            Month: new Date(post.DateRecord).toLocaleString("en-US", {
                month: "long",
            }),
            MonthIndex: new Date(post.DateRecord).getMonth(),
            Year: new Date(post.DateRecord).getFullYear().toString(),
        }));

    // Define months
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

    // Define "Less: COS" ModeType values
    const lessCosModeTypes = [
        "Beg. Inventory",
        "Purchases - Importation",
        "Good Available for Sales",
        "Less: Ending Inventory",
        "Sales Total",
        "Freight & Other Charges",
        "Salaries & Wages",
        "Cold Storage",
    ];

    // Define "Sales" ModeType values
    const salesTypes = ["Sales"];

    // Define "Others" ModeType values
    const othersModeTypes = [
        "Other Income",
        "Other Income (Net, Bank, Interest)",
        "Other Expense - Budegero/Elois Exp and Food Allowance",
    ];


    // Group data by ModeType with Sales included
    const groupedData: Record<string, any> = {
        Sales: {},
        "Cost of Sales:": {},
        Expenses: {},
        Others: {},
    };

    updatedPosts.forEach((post) => {
        const modeTypeKey = post.ModeType;
        let group = "Expenses";

        if (lessCosModeTypes.includes(modeTypeKey)) {
            group = "Cost of Sales:";
        } else if (salesTypes.includes(modeTypeKey)) {
            group = "Sales";
        } else if (["Other Income", "Other Income (Net, Bank, Interest)", "Other Expense - Budegero/Elois Exp and Food Allowance"].includes(modeTypeKey)) {
            group = "Others"; // Group for Others
        }

        if (!groupedData[group][modeTypeKey]) {
            groupedData[group][modeTypeKey] = {
                ModeType: post.ModeType,
                monthlyAmounts: Array(12).fill(0),
                totalAmount: 0,
            };
        }

        const amount = parseFloat(post.Amount) || 0;

        groupedData[group][modeTypeKey].monthlyAmounts[post.MonthIndex] += amount;
        groupedData[group][modeTypeKey].totalAmount += amount;
    });

    // ✅ Calculate "Good Available for Sales" by summing "Beg. Inventory" + "Purchases - Importation"
    const begInventory = groupedData["Cost of Sales:"]["Beg. Inventory"]
        ?.monthlyAmounts || Array(12).fill(0);
    const purchasesImportation =
        groupedData["Cost of Sales:"]["Purchases - Importation"]?.monthlyAmounts ||
        Array(12).fill(0);

    const goodAvailableForSales = {
        ModeType: "Good Available for Sales",
        monthlyAmounts: Array(12).fill(0),
        totalAmount: 0,
    };

    goodAvailableForSales.monthlyAmounts = begInventory.map(
        (value: number, index: number) => value + purchasesImportation[index]
    );

    goodAvailableForSales.totalAmount = goodAvailableForSales.monthlyAmounts.reduce(
        (acc: number, value: number) => acc + value,
        0
    );

    // ✅ Assign "Good Available for Sales" to Cost of Sales group
    groupedData["Cost of Sales:"]["Good Available for Sales"] =
        goodAvailableForSales;

    // ✅ Calculate "Total" after "Less: Ending Inventory"
    const endingInventory =
        groupedData["Cost of Sales:"]["Less: Ending Inventory"]?.monthlyAmounts ||
        Array(12).fill(0);

    const totalAfterEndingInventory = {
        ModeType: "Sales Total",
        monthlyAmounts: Array(12).fill(0),
        totalAmount: 0,
    };

    totalAfterEndingInventory.monthlyAmounts = goodAvailableForSales.monthlyAmounts.map(
        (value: number, index: number) => value - endingInventory[index]
    );

    totalAfterEndingInventory.totalAmount = totalAfterEndingInventory.monthlyAmounts.reduce(
        (acc: number, value: number) => acc + value,
        0
    );

    // ✅ Assign "Total" to Cost of Sales group before Freight & Other Charges
    groupedData["Cost of Sales:"]["Sales Total"] = totalAfterEndingInventory;

    const freightCharges = groupedData["Cost of Sales:"]["Freight & Other Charges"]
        ?.monthlyAmounts || Array(12).fill(0);
    const salariesWages = groupedData["Cost of Sales:"]["Salaries & Wages"]
        ?.monthlyAmounts || Array(12).fill(0);
    const coldStorage =
        groupedData["Cost of Sales:"]["Cold Storage"]?.monthlyAmounts || Array(12).fill(0);

    // ✅ Correct Grand Total Calculation for Cost of Sales
    const grandTotalCostOfSales = {
        ModeType: "Total Cost of Sales",
        monthlyAmounts: Array(12).fill(0),
        totalAmount: 0,
    };

    grandTotalCostOfSales.monthlyAmounts = totalAfterEndingInventory.monthlyAmounts.map(
        (value: number, index: number) =>
            value + freightCharges[index] + salariesWages[index] + coldStorage[index]
    );

    grandTotalCostOfSales.totalAmount = grandTotalCostOfSales.monthlyAmounts.reduce(
        (acc: number, value: number) => acc + value,
        0
    );

    // ✅ Assign Grand Total properly for Cost of Sales
    groupedData["Cost of Sales:"]["Total Cost of Sales"] = grandTotalCostOfSales;

    // ✅ Calculate Gross Profit by subtracting Total Cost of Sales from Sales
    const grossProfit = {
        ModeType: "Gross Profit",
        monthlyAmounts: Array(12).fill(0),
        totalAmount: 0,
    };

    const salesTotal = groupedData["Sales"]["Sales"]?.monthlyAmounts || Array(12).fill(0);

    grossProfit.monthlyAmounts = salesTotal.map(
        (value: number, index: number) => value - grandTotalCostOfSales.monthlyAmounts[index]
    );

    grossProfit.totalAmount = grossProfit.monthlyAmounts.reduce(
        (acc: number, value: number) => acc + value,
        0
    );

    // ✅ Calculate Grand Total for Expenses
    const calculateGroupGrandTotal = (group: string) => {
        const dataGroup = groupedData[group];
        const grandTotal = {
            monthlyAmounts: Array(12).fill(0),
            totalAmount: 0,
        };

        Object.keys(dataGroup).forEach((modeTypeKey) => {
            const data = dataGroup[modeTypeKey];
            data.monthlyAmounts.forEach((amount: number, monthIndex: number) => {
                grandTotal.monthlyAmounts[monthIndex] += amount;
            });
            grandTotal.totalAmount += data.totalAmount;
        });

        // ✅ Assign the computed Grand Total back to the group
        groupedData[group]["Total Expenses"] = {
            ModeType: "Total Expenses",
            monthlyAmounts: grandTotal.monthlyAmounts,
            totalAmount: grandTotal.totalAmount,
        };
    };

    // ✅ Calculate Grand Total for Expenses
    calculateGroupGrandTotal("Expenses");

    // ✅ Get Correct Total Expenses
    const totalExpenses = groupedData["Expenses"]["Total Expenses"]?.monthlyAmounts || Array(12).fill(0);

    // ✅ Calculate Profit (Loss) from Operations (Gross Profit - Total Expenses)
    const profitLossFromOperations = {
        ModeType: "Profit (Loss) from Operations",
        monthlyAmounts: Array(12).fill(0),
        totalAmount: 0,
    };

    profitLossFromOperations.monthlyAmounts = grossProfit.monthlyAmounts.map(
        (value: number, index: number) => {
            const grossProfitValue = Number(value) || 0;
            const expenseValue = Number(totalExpenses[index]) || 0;
            return expenseValue - grossProfitValue;
        }
    );

    profitLossFromOperations.totalAmount = profitLossFromOperations.monthlyAmounts.reduce(
        (acc: number, value: number) => acc + value,
        0
    );

    // ✅ Sort Cost of Sales group by order
    groupedData["Cost of Sales:"] = Object.fromEntries(
        [
            "Beg. Inventory",
            "Purchases - Importation",
            "Good Available for Sales",
            "Less: Ending Inventory",
            "Sales Total",
            "Freight & Other Charges",
            "Salaries & Wages",
            "Cold Storage",
            "Total Cost of Sales",
        ]
            .filter((type) => groupedData["Cost of Sales:"][type])
            .map((type) => [type, groupedData["Cost of Sales:"][type]])
    );

    // Calculate Profit (Loss) for the Period
    const profitLossForPeriod = {
        ModeType: "Profit (Loss) for the Period",
        monthlyAmounts: Array(12).fill(0),
        totalAmount: 0,
    };

    // Summing Profit (Loss) from Operations, Other Income, and Other Income (Net, Bank, Interest)
    profitLossForPeriod.monthlyAmounts = profitLossFromOperations.monthlyAmounts.map(
        (value: number, index: number) => {
            const profitLossValue = Number(value) || 0;
            const otherIncomeValue = Number(
                groupedData["Others"]["Other Income"]?.monthlyAmounts[index] || 0
            );
            const otherIncomeNetValue = Number(
                groupedData["Others"]["Other Income (Net, Bank, Interest)"]?.monthlyAmounts[index] || 0
            );
            return profitLossValue + otherIncomeValue + otherIncomeNetValue;
        }
    );

    profitLossForPeriod.totalAmount = profitLossForPeriod.monthlyAmounts.reduce(
        (acc: number, value: number) => acc + value,
        0
    );

    // Assign calculated Profit (Loss) for the Period to groupedData
    groupedData["Others"]["Profit (Loss) for the Period"] = profitLossForPeriod;

    // ✅ Render table based on months and group with Grand Total
    const renderTableForMonths = (group: string) => {
        const dataGroup = groupedData[group];

        return (
            <table className="w-full bg-white border border-gray-300 text-xs mb-6">
                <thead className="bg-gray-100 text-gray-700">
                    <tr className="whitespace-nowrap p-2">
                        <th className="p-2 border text-left sticky left-0 bg-gray-100 z-10 w-48 overflow-hidden whitespace-nowrap"></th>
                        {months.map((month) => (
                            <th key={month} className="p-2 border text-left w-20 truncate whitespace-nowrap">{month}</th>
                        ))}
                        <th className="p-2 border text-left sticky right-0 bg-gray-100 z-10 w-28 whitespace-nowrap">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(dataGroup).map((modeTypeKey) => {
                        const data = dataGroup[modeTypeKey];

                        return (
                            <tr key={modeTypeKey} className="text-left capitalize">
                                <td className="p-2  sticky left-0 bg-white z-10 w-48 overflow-hidden whitespace-nowrap">{data.ModeType}</td>

                                {months.map((_, monthIndex) => (
                                    <td key={monthIndex} className="p-2 border text-left w-20 truncate whitespace-nowrap">{data.monthlyAmounts[monthIndex].toLocaleString()}</td>
                                ))}

                                <td className="p-2 border font-bold text-left sticky right-0 bg-white z-10 w-28 whitespace-nowrap">{data.totalAmount.toLocaleString()}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    const renderHistoryTable = () => {
        return (
            <table className="w-full bg-white border border-gray-300 shadow-md text-xs mb-6 table-fixed">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="p-2 border text-left w-48">Reference Number</th>
                        <th className="p-2 border text-left w-48">Mode Type</th>
                        <th className="p-2 border text-left w-32">Date Record</th>
                        <th className="p-2 border text-left w-28">Amount</th>
                        <th className="p-2 border text-left w-32">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {updatedPosts.map((post) => (
                        <tr key={post._id} className="text-left capitalize">
                            <td className="p-2 border">{post.ReferenceNumber}</td>
                            <td className="p-2 border">{post.ModeType}</td>
                            <td className="p-2 border">
                                {new Date(post.DateRecord).toLocaleDateString()}
                            </td>
                            <td className="p-2 border">
                                {parseFloat(post.Amount).toLocaleString()}
                            </td>
                            <td className="p-2 flex space-x-2">
                                <button onClick={() => handleEdit(post)}>
                                    <FaEdit />
                                </button>
                                {Role !== "Staff" && (
                                    <button onClick={() => handleDelete(post._id)}>
                                        <FaTrash />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="overflow-x-auto w-full">
            {/* Filter by Year */}
            <div className="mb-4">
                <label className="text-xs font-bold mr-2">Filter by Year:</label>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-2 py-1 border rounded text-xs"
                >
                    {uniqueYears.map((year) => (
                        <option key={year} value={year.toString()}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-2 mb-4">
                {["Months", "History"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-xs font-bold uppercase border-b-2 ${activeTab === tab
                            ? "border-blue-500 text-blue-500"
                            : "border-gray-300 text-gray-500"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === "History" ? (
                <>
                    <h3 className="text-sm font-bold mb-2">Transaction History's</h3>
                    {renderHistoryTable()}
                </>
            ) : (
                <>
                    {["Sales", "Cost of Sales:", "Expenses"].map((group, index) => (
                        <div key={group} className="mb-8">
                            <h3 className="text-lg font-bold mb-2">{group}</h3>
                            {renderTableForMonths(group)}
                            {group === "Cost of Sales:" && (
                                <table className="w-full bg-white border border-gray-300 text-xs mb-6">
                                    <thead className="bg-gray-100 text-gray-700">
                                        <tr className="whitespace-nowrap p-2">
                                            <th className="p-2 border text-left sticky left-0 bg-gray-100 z-10 w-48 overflow-hidden whitespace-nowrap"></th>
                                            {months.map((month) => (
                                                <th key={month} className="p-2 border text-left w-20 truncate whitespace-nowrap"></th>
                                            ))}
                                            <th className="p-2 border text-left sticky right-0 bg-gray-100 z-10 w-28 whitespace-nowrap">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="text-left font-bold capitalize">
                                            <td className="p-2 border sticky left-0 bg-white z-10 w-48 overflow-hidden whitespace-nowrap">Gross Profit</td>
                                            {grossProfit.monthlyAmounts.map((amount, monthIndex) => (
                                                <td key={monthIndex} className="p-2 border text-left w-20 truncate whitespace-nowrap">{amount.toLocaleString()}</td>
                                            ))}
                                            <td className="p-2 border font-bold text-left sticky right-0 bg-white z-10 w-28 whitespace-nowrap">
                                                {grossProfit.totalAmount.toLocaleString()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ))}
                    {/* ✅ Profit (Loss) from Operations Below Expenses */}
                    <table className="w-full bg-white border border-gray-300 text-xs mb-6">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr className="whitespace-nowrap p-2">
                                <th className="p-2 border text-left sticky left-0 bg-gray-100 z-10 w-48 overflow-hidden whitespace-nowrap"></th>
                                {months.map((month) => (
                                    <th key={month} className="p-2 border text-left w-20 truncate whitespace-nowrap"></th>
                                ))}
                                <th className="p-2 border text-left sticky right-0 bg-gray-100 z-10 w-28 whitespace-nowrap">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-left font-bold capitalize">
                                <td className="p-2 border sticky left-0 bg-white z-10 w-48 overflow-hidden whitespace-nowrap">Profit (Loss) from Operations</td>
                                {profitLossFromOperations.monthlyAmounts.map((amount, monthIndex) => (
                                    <td key={monthIndex} className="p-2 border text-left w-20 truncate whitespace-nowrap">{amount.toLocaleString()}</td>
                                ))}
                                <td className="p-2 border font-bold text-left sticky right-0 bg-white z-10 w-28 whitespace-nowrap">{profitLossFromOperations.totalAmount.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Others */}
                    <table className="w-full bg-white border border-gray-300 text-xs mb-6">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr className="whitespace-nowrap p-2">
                                <th className="p-2 border text-left sticky left-0 bg-gray-100 z-10 w-48 overflow-hidden whitespace-nowrap"></th>
                                {months.map((month) => (
                                    <th key={month} className="p-2 border text-left w-20 truncate whitespace-nowrap"></th>
                                ))}
                                <th className="p-2 border text-left sticky right-0 bg-gray-100 z-10 w-28 whitespace-nowrap">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(groupedData["Others"]).map((modeTypeKey) => {
                                const data = groupedData["Others"][modeTypeKey];
                                return (
                                    <tr key={modeTypeKey} className="text-left capitalize">
                                        <td className="p-2 sticky left-0 bg-white z-10 w-48 overflow-hidden whitespace-nowrap">
                                            {data.ModeType}
                                        </td>
                                        {data.monthlyAmounts.map((amount: number, monthIndex: number) => (
                                            <td key={monthIndex} className="p-2 border text-left w-20 truncate whitespace-nowrap">
                                                {amount.toLocaleString()}
                                            </td>
                                        ))}
                                        <td className="p-2 border font-bold text-left sticky right-0 bg-white z-10 w-28 whitespace-nowrap">
                                            {data.totalAmount.toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}

                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default ContainerTable;
