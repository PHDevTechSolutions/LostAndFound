import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Post {
    _id: string;
    DateBuy: string;
    ItemPurchased: string;
    Type: string;
    Quantity: string;
    AmountPrice: string;
    AccumulatedDepreciation: string;
    AdditionalAssets: string;
    Location: string;
    ReferenceNumber: string;
    CoveredMonth: string;
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
    // Filter posts based on Role and Location
    const [monthFilter, setMonthFilter] = useState<string>("");
    const [yearFilter, setYearFilter] = useState<string>("");

    // Extract unique years from posts
    const uniqueYears = Array.from(
        new Set(posts.map((post) => new Date(post.DateBuy).getFullYear().toString()))
    );

    // Filter and map posts
    const updatedPosts = posts
        .filter((post) => {
            if (Role === "Staff" || Role === "Admin") {
                return post.Location === Location;
            }
            return true;
        })
        .map((post) => ({
            ...post,
            Month: new Date(post.DateBuy).toLocaleString("default", {
                month: "long",
            }),
            Year: new Date(post.DateBuy).getFullYear().toString(),
        }))
        .filter((post) => {
            const monthMatch = monthFilter ? post.Month === monthFilter : true;
            const yearMatch = yearFilter ? post.Year === yearFilter : true;
            return monthMatch && yearMatch;
        });

    // Function to parse CoveredMonth data
    const parseCoveredMonth = (coveredMonth: string) => {
        const monthValues: Record<string, string> = {};
        if (coveredMonth) {
            coveredMonth.split(", ").forEach((item) => {
                const [month, value] = item.split(" - ");
                monthValues[month.trim()] = value?.trim() || "0";
            });
        }
        return monthValues;
    };

    // Calculate total depreciation and book value
    const calculateDepreciation = (coveredMonth: string) => {
        const monthValues = parseCoveredMonth(coveredMonth);
        return Object.values(monthValues).reduce(
            (total, value) => total + parseFloat(value || "0"),
            0
        );
    };

    const calculateBookValue = (
        amountPrice: string,
        accumulatedDepreciation: string,
        totalDepreciation: number
    ) => {
        return (
            parseFloat(amountPrice) -
            parseFloat(accumulatedDepreciation) -
            totalDepreciation
        );
    };

    // Calculate grand totals
    const grandTotals = updatedPosts.reduce(
        (totals, post) => {
            const monthValues = parseCoveredMonth(post.CoveredMonth);
            const totalDepreciation = calculateDepreciation(post.CoveredMonth);
            const bookValue = calculateBookValue(
                post.AmountPrice,
                post.AccumulatedDepreciation,
                totalDepreciation
            );

            totals.AmountPrice += parseFloat(post.AmountPrice) || 0;
            totals.AccumulatedDepreciation += parseFloat(post.AccumulatedDepreciation) || 0;
            totals.AdditionalAssets += parseFloat(post.AdditionalAssets) || 0;
            totals.Depreciation += totalDepreciation;
            totals.BookValue += bookValue;

            Object.keys(monthValues).forEach((month) => {
                totals.Monthly[month] =
                    (totals.Monthly[month] || 0) + parseFloat(monthValues[month] || "0");
            });

            return totals;
        },
        {
            AmountPrice: 0,
            AccumulatedDepreciation: 0,
            AdditionalAssets: 0,
            Depreciation: 0,
            BookValue: 0,
            Monthly: {} as Record<string, number>,
        }
    );

    return (
        <div className="overflow-x-auto w-full">
            {/* Filters Section */}
            <div className="flex justify-start space-x-4 mb-4">
                {/* Month Filter */}
                <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="px-3 py-2 border rounded text-xs capitalize"
                >
                    <option value="">Filter by Month</option>
                    {[
                        "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December",
                    ].map((month) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                </select>

                {/* Year Filter */}
                <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="px-3 py-2 border rounded text-xs capitalize"
                >
                    <option value="">Filter by Year</option>
                    {uniqueYears.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            {/* Main Table */}
            <table className="w-full bg-white border border-gray-300 shadow-md text-xs">
                <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                    <tr>
                        {[
                            "Reference Number", "Date Purchased", "Item Purchased", "Type",
                            "Amount / Price", "Accumulated Depreciation", "Additional Assets",
                            "January", "February", "March", "April", "May", "June", "July",
                            "August", "September", "October", "November", "December",
                            "Depreciation", "Book Value", "Actions",
                        ].map((header) => (
                            <th key={header} className="p-2 border text-left">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {updatedPosts.map((post) => {
                        const monthValues = parseCoveredMonth(post.CoveredMonth);
                        const totalDepreciation = calculateDepreciation(post.CoveredMonth);
                        const bookValue = calculateBookValue(
                            post.AmountPrice,
                            post.AccumulatedDepreciation,
                            totalDepreciation
                        );
                        return (
                            <tr
                                key={post._id}
                                className="text-left border-b capitalize whitespace-nowrap"
                            >
                                <td className="p-2 border">{post.ReferenceNumber}</td>
                                <td className="p-2 border">{post.DateBuy}</td>
                                <td className="p-2 border">
                                    {post.ItemPurchased} / {post.Quantity} Pcs
                                </td>
                                <td className="p-2 border">{post.Type}</td>
                                <td className="p-2 border">
                                    {isNaN(parseFloat(post.AmountPrice)) ? "-" : parseFloat(post.AmountPrice).toLocaleString()}
                                </td>
                                <td className="p-2 border">
                                    {isNaN(parseFloat(post.AccumulatedDepreciation)) ? "-" : parseFloat(post.AccumulatedDepreciation).toLocaleString()}
                                </td>
                                <td className="p-2 border">
                                    {isNaN(parseFloat(post.AdditionalAssets)) ? " -" : parseFloat(post.AdditionalAssets).toLocaleString()}
                                </td>

                                {/* Monthly Depreciation */}
                                {[
                                    "January", "February", "March", "April", "May", "June",
                                    "July", "August", "September", "October", "November", "December",
                                ].map((month) => (
                                    <td key={month} className="p-2 border text-right">
                                       
                                        {isNaN(parseFloat(monthValues[month])) ? " -" : parseFloat(monthValues[month]).toLocaleString()}
                                    </td>
                                ))}
                                <td className="p-2 border text-right font-bold">
                                    ₱{totalDepreciation.toLocaleString()}
                                </td>
                                <td
                                    className={`p-2 border text-right font-bold ${bookValue < 0 ? "text-red-500" : "text-green-500"
                                        }`}
                                >
                                    ₱{bookValue.toLocaleString()}
                                </td>
                                {/* Action Buttons */}
                                <td className="p-2 flex justify-start space-x-2">
                                    {Role !== "Staff" && (
                                        <button
                                            onClick={() => handleDelete(post._id)}
                                            className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                                        >
                                            <FaTrash className="mr-1" /> Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}

                    {/* Grand Totals Row */}
                    <tr className="bg-gray-200 font-bold text-left">
                        <td colSpan={4} className="p-4 border text-right">
                            Total
                        </td>
                        <td className="p-2 border">
                            {grandTotals.AmountPrice.toLocaleString()}
                        </td>
                        <td className="p-2 border">
                            {grandTotals.AccumulatedDepreciation.toLocaleString()}
                        </td>
                        <td className="p-2 border">
                            {grandTotals.AdditionalAssets.toLocaleString()}
                        </td>
                        {[
                            "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December",
                        ].map((month) => (
                            <td key={month} className="p-2 border text-right">
                                {(grandTotals.Monthly[month] || 0).toLocaleString()}
                            </td>
                        ))}
                        <td className="p-2 border text-right">
                            {grandTotals.Depreciation.toLocaleString()}
                        </td>
                        <td className="p-2 border text-right">
                            {grandTotals.BookValue.toLocaleString()}
                        </td>
                        <td className="p-2 border"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ContainerTable;
