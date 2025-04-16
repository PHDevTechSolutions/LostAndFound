import React from "react";
import { HiOutlineTrash, HiOutlinePencil } from "react-icons/hi2";

interface Post {
    _id: string;
    DatePurchased: string;
    SupplierBrand: string;
    ItemPurchased: string;
    Type: string;
    Quantity: string;
    PurchasedAmount: string;
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
            Month: new Date(post.DatePurchased).toLocaleString("default", {
                month: "long",
            }),
            Year: new Date(post.DatePurchased).getFullYear().toString(),
        }));

    // Calculate total Purchased Amount
    const totalPurchasedAmount = updatedPosts.reduce(
        (sum, post) => sum + parseFloat(post.PurchasedAmount),
        0
    );

    // Calculate total Purchased Amount per month
    const monthlyTotals: Record<string, number> = updatedPosts.reduce(
        (acc: Record<string, number>, post) => {
            const month = post.Month;
            const amount = parseFloat(post.PurchasedAmount);
            acc[month] = (acc[month] || 0) + amount;
            return acc;
        },
        {}
    );

    // Calculate total Purchased Amount per year
    const yearlyTotals: Record<string, number> = updatedPosts.reduce(
        (acc: Record<string, number>, post) => {
            const year = post.Year;
            const amount = parseFloat(post.PurchasedAmount);
            acc[year] = (acc[year] || 0) + amount;
            return acc;
        },
        {}
    );

    return (
        <div className="overflow-x-auto w-full">
            {/* Main Table */}
            <table className="w-full bg-white border border-gray-300 shadow-md text-xs">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        {[
                            "Reference Number",
                            "Date Purchased",
                            "Supplier Brand",
                            "Item Purchased",
                            "Type",
                            "Quantity",
                            "Purchased Amount",
                            "Month",
                            "Year",
                            "Actions",
                        ].map((header) => (
                            <th key={header} className="p-2 border text-left">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {updatedPosts.map((post) => (
                        <tr key={post._id} className="text-left border-b capitalize">
                            <td className="p-2 border">{post.ReferenceNumber}</td>
                            <td className="p-2 border">{post.DatePurchased}</td>
                            <td className="p-2 border">{post.SupplierBrand}</td>
                            <td className="p-2 border">{post.ItemPurchased}</td>
                            <td className="p-2 border">{post.Type}</td>
                            <td className="p-2 border">{post.Quantity}</td>
                            <td className="p-2 border">₱{parseFloat(post.PurchasedAmount).toLocaleString()}</td>
                            <td className="p-2 border">{post.Month}</td>
                            <td className="p-2 border">{post.Year}</td>
                            <td className="p-2 border flex justify-start space-x-2">
                                <button
                                    onClick={() => handleEdit(post)}
                                    className="px-2 py-1 text-xs bg-[#143c66] hover:bg-blue-900 text-white rounded-md hover:bg-blue-600 flex items-center"
                                >
                                    <HiOutlinePencil size={15} className="mr-1" /> Edit
                                </button>
                                {Role !== "Staff" && (
                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        className="px-2 py-1 text-xs bg-red-700 hover:bg-red-800 text-white rounded-md hover:bg-red-600 flex items-center"
                                    >
                                        <HiOutlineTrash size={15} className="mr-1" /> Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {/* Total Row */}
                    <tr className="bg-gray-200 font-semibold text-gray-800">
                        <td colSpan={6} className="p-2 border text-right">
                            Total Purchased Amount:
                        </td>
                        <td className="p-2 border">₱{totalPurchasedAmount.toLocaleString()}</td>
                        <td colSpan={3} className="p-2 border"></td>
                    </tr>
                </tbody>
            </table>

            {/* Monthly and Yearly Totals Section */}
            <div className="mt-4 bg-gray-100 p-3 rounded-md text-xs">
                <h3 className="font-semibold mb-3">Total Purchased Amount Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                    {/* Monthly Totals Card */}
                    <div className="bg-white border border-gray-300 rounded-md shadow-sm p-3 text-left">
                        <h4 className="font-semibold mb-2">Per Month</h4>
                        <table className="w-full border border-gray-300 text-xs">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="p-2 border">Month</th>
                                    <th className="p-2 border">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(monthlyTotals).map(([month, amount]) => (
                                    <tr key={month} className="text-left border-b">
                                        <td className="p-2 border">{month}</td>
                                        <td className="p-2 border">₱{amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Yearly Totals Card */}
                    <div className="bg-white border border-gray-300 rounded-md shadow-sm p-3 text-left">
                        <h4 className="font-semibold mb-2">Per Year</h4>
                        <table className="w-full border border-gray-300 text-xs">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="p-2 border">Year</th>
                                    <th className="p-2 border">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(yearlyTotals).map(([year, amount]) => (
                                    <tr key={year} className="text-left border-b">
                                        <td className="p-2 border">{year}</td>
                                        <td className="p-2 border">₱{amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContainerTable;
