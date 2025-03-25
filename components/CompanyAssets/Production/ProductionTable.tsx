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
    // State for active tab
    const [activeTab, setActiveTab] = useState<string>("Q1");
    const [selectedYear, setSelectedYear] = useState<string>(
        new Date().getFullYear().toString()
    );

    const uniqueYears = Array.from(
        new Set(posts.map((post) => new Date(post.DateRecord).getFullYear()))
    ).sort((a, b) => b - a);

    // Filter posts based on Role and Location
    const updatedPosts = posts
        .filter((post) => {
            if (Role === "Staff" || Role === "Admin") {
                return post.Location === Location;
            }
            return true;
        })
        .map((post) => ({
            ...post,
            Month: new Date(post.DateRecord).toLocaleString("en-US", {
                month: "long",
            }),
            MonthIndex: new Date(post.DateRecord).getMonth(), // Get month index for accuracy
            Year: new Date(post.DateRecord).getFullYear().toString(),
        }));

    // Define months and quarters
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

    const quarterMap: Record<string, number[]> = {
        Q1: [0, 1, 2], // January, February, March
        Q2: [3, 4, 5], // April, May, June
        Q3: [6, 7, 8], // July, August, September
        Q4: [9, 10, 11], // October, November, December
    };

    // Define "Less: COS" ModeType values
    const lessCosModeTypes = ["Purchases - Supplies", "Purchases - Packaging"];

    // Group data by ModeType
    const groupedData: Record<string, any> = {
        "Less: COS": {},
        "Less: Expenses": {},
    };

    updatedPosts.forEach((post) => {
        const modeTypeKey = post.ModeType;
        const group = lessCosModeTypes.includes(modeTypeKey)
            ? "Less: COS"
            : "Less: Expenses";

        if (!groupedData[group][modeTypeKey]) {
            groupedData[group][modeTypeKey] = {
                ModeType: post.ModeType,
                monthlyAmounts: Array(12).fill(0), // 12 months array initialized with 0
                quarterlyTotals: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 },
                totalAmount: 0,
            };
        }

        const amount = parseFloat(post.Amount) || 0;

        // Add to monthly totals (based on MonthIndex for accuracy)
        groupedData[group][modeTypeKey].monthlyAmounts[post.MonthIndex] += amount;

        // Add to quarterly totals correctly
        Object.keys(quarterMap).forEach((quarter) => {
            if (quarterMap[quarter].includes(post.MonthIndex)) {
                groupedData[group][modeTypeKey].quarterlyTotals[quarter] += amount;
            }
        });

        // Add to total amount
        groupedData[group][modeTypeKey].totalAmount += amount;
    });

    // Calculate total per column for each group
    const calculateGroupTotals = (quarter: string, group: string) => {
        const dataGroup = groupedData[group];
        const totalMonthly = Array(3).fill(0); // 3 months per quarter
        let totalQuarterly = 0;
        let totalOverall = 0;

        Object.values(dataGroup).forEach((data: any) => {
            quarterMap[quarter].forEach((monthIndex, i) => {
                totalMonthly[i] += data.monthlyAmounts[monthIndex] || 0;
            });
            totalQuarterly += data.quarterlyTotals[quarter] || 0;
            totalOverall += data.totalAmount || 0;
        });

        return { totalMonthly, totalQuarterly, totalOverall };
    };

    // Function to render tables based on active quarter and group
    const renderTableForQuarter = (quarter: string, group: string) => {
        // Get the months for the selected quarter
        const quarterMonths = quarterMap[quarter].map((index) => months[index]);
        const dataGroup = groupedData[group];
        const { totalMonthly, totalQuarterly, totalOverall } = calculateGroupTotals(
            quarter,
            group
        );

        return (
            <table className="w-full bg-white border border-gray-300 shadow-md text-xs mb-6 table-fixed">
                <thead className="bg-gray-100 text-gray-700">
                    <tr className="whitespace-nowrap p-2">
                        <th className="p-2 border text-left sticky left-0 bg-gray-100 z-10 w-48 overflow-hidden whitespace-nowrap">
                            Mode Type
                        </th>
                        {quarterMonths.map((month) => (
                            <th key={month} className="p-2 border text-left w-20 truncate">
                                {month}
                            </th>
                        ))}
                        <th className="p-2 border text-left w-20">{quarter}</th>
                        <th className="p-2 border text-left sticky right-32 bg-gray-100 z-10 w-28">
                            Total
                        </th>
                        <th className="p-2 border text-left sticky right-0 bg-gray-100 z-10 w-32">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(dataGroup).map((modeTypeKey) => {
                        const post = posts.find((p) => p.ModeType === modeTypeKey); // Find correct post by ModeType
                        const data = dataGroup[modeTypeKey];

                        return (
                            <tr key={modeTypeKey} className="text-left capitalize">
                                {/* Mode Type */}
                                <td className="p-2 border sticky left-0 bg-white z-10 w-48 overflow-hidden whitespace-nowrap">
                                    {data.ModeType}
                                </td>

                                {/* Monthly Amounts */}
                                {quarterMap[quarter].map((monthIndex) => (
                                    <td
                                        key={months[monthIndex]}
                                        className="p-2 border text-left w-20 truncate"
                                    >
                                        {data.monthlyAmounts[monthIndex].toLocaleString()}
                                    </td>
                                ))}

                                {/* Quarterly Total */}
                                <td className="p-2 border font-bold text-left w-20">
                                    {data.quarterlyTotals[quarter].toLocaleString()}
                                </td>

                                {/* Overall Total */}
                                <td className="p-2 border font-bold text-left sticky right-32 bg-white z-10 w-28">
                                    {data.totalAmount.toLocaleString()}
                                </td>

                                {/* Actions */}
                                <td className="p-2 sticky right-0 bg-white z-10 w-32 flex justify-start space-x-2">
                                    {Role !== "Staff" && post?._id && (
                                        <button onClick={() => handleDelete(post._id)}>
                                            <FaTrash />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}

                    {/* Total Row */}
                    <tr className="bg-gray-200 font-bold">
                        <td className="p-2 border sticky left-0 bg-gray-200 z-10 w-48">
                            Total
                        </td>
                        {totalMonthly.map((amount, i) => (
                            <td key={i} className="p-2 border text-left w-20">
                                {amount.toLocaleString()}
                            </td>
                        ))}
                        <td className="p-2 border text-left w-20">
                            {totalQuarterly.toLocaleString()}
                        </td>
                        <td className="p-2 border text-left sticky right-32 bg-gray-200 z-10 w-28">
                            {totalOverall.toLocaleString()}
                        </td>
                        <td className="p-2 border sticky right-0 bg-gray-200 z-10 w-32"></td>
                    </tr>
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
                            <td className="p-2 border">{parseFloat(post.Amount).toLocaleString()}</td>
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
                {["Q1", "Q2", "Q3", "Q4", "History"].map((quarter) => (
                    <button
                        key={quarter}
                        onClick={() => setActiveTab(quarter)}
                        className={`px-4 py-2 text-xs font-bold uppercase border-b-2 ${activeTab === quarter
                                ? "border-blue-500 text-blue-500"
                                : "border-gray-300 text-gray-500"
                            }`}
                    >
                        {quarter}
                    </button>
                ))}
            </div>

            {activeTab === "History" ? (
                <>
                    <h3 className="text-sm font-bold mb-2">Transaction History</h3>
                    {renderHistoryTable()}
                </>
            ) : (
                <>
                    {/* Render Less: COS group */}
                    <h3 className="text-sm font-bold mb-2">Less: COS</h3>
                    {renderTableForQuarter(activeTab, "Less: COS")}

                    {/* Render Less: Expenses group */}
                    <h3 className="text-sm font-bold mb-2">Less: Expenses</h3>
                    {renderTableForQuarter(activeTab, "Less: Expenses")}
                </>
            )}
        </div>
    );
};

export default ContainerTable;
