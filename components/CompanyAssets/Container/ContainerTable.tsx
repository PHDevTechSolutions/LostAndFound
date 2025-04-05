import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";

interface Post {
    _id: string;
    SpsicNo: string;
    DateArrived: string;
    DateSoldout: string;
    SupplierName: string;
    Country: string;
    ContainerNo: string;
    Boxes: string;
    Commodity: string;
    Size: string;
    Freezing: string;
    TotalQuantity: string;
    PurchasePrice: string;
    ShippingLine: string;
    BankCharges: string;
    Brokerage: string;
    OtherCharges: string;
    BoarderExam: string;
    ShippingLineRepresentation: string;
    Representation: string;
    SPSApplicationFee: string;
    TruckingCharges: string;
    Intercommerce: string;
    Erfi: string;
    SellingFee: string;
    StorageOrca: string;
    StorageBelen: string;
    PowerCharges: string;
    LoadingCharges: string;
    Location: string;
    createdAt: string;
}

interface ContainerTableProps {
    posts: Post[];
    handleEdit: (post: Post) => void;
    Role: string;
    Location: string;
}

// Format currency values
const formatCurrency = (value: string): string => {
    const num = parseFloat(value);
    return !isNaN(num)
        ? num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : "-";
};

// Calculate total of all numeric values except excluded fields
const calculateRowTotal = (post: Post): number => {
    const excludedFields = [
        "SpsicNo", "DateArrived", "DateSoldout", "SupplierName", "Country",
        "ContainerNo", "Boxes", "Commodity", "Size", "Freezing", "TotalQuantity",
        "Location", "_id"
    ];

    return Object.entries(post).reduce((acc, [key, value]) => {
        if (!excludedFields.includes(key)) {
            const numeric = parseFloat(value as string);
            if (!isNaN(numeric)) acc += numeric;
        }
        return acc;
    }, 0);
};

// Calculate Cost of Sales (Total - LoadingCharges - SellingFee - Representation - BoarderExam)
const calculateCostOfSales = (post: Post): number => {
    const total = calculateRowTotal(post); 
    const loadingCharges = parseFloat(post.LoadingCharges) || 0;
    const sellingFee = parseFloat(post.SellingFee) || 0;
    const representation = parseFloat(post.Representation) || 0;
    const boarderExam = parseFloat(post.BoarderExam) || 0;

    return total - (loadingCharges + sellingFee + representation + boarderExam);
};

const ContainerTable: React.FC<ContainerTableProps> = ({
    posts,
    handleEdit,
    Role,
    Location,
}) => {
    const [selectedYear, setSelectedYear] = useState<string>("");

    const filteredPosts = posts.filter((post) => {
        const postYear = new Date(post.createdAt).getFullYear().toString();
        const isYearMatched = selectedYear ? postYear === selectedYear : true;
        const isLocationMatched =
            Role === "Staff" || Role === "Admin" ? post.Location === Location : true;

        return isYearMatched && isLocationMatched;
    });

    // Get unique years from the posts
    const years = Array.from(
        new Set(posts.map((post) => new Date(post.createdAt).getFullYear().toString()))
    );

    // Calculate the total Cost of Sales for all filtered posts
    const totalCostOfSales = filteredPosts.reduce((total, post) => {
        return total + calculateCostOfSales(post);
    }, 0);

    return (
        <div className="overflow-x-auto">
            <div className="mb-4">
                <label htmlFor="yearFilter" className="mr-2 text-xs">
                    Filter by Year:
                </label>
                <select
                    id="yearFilter"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-3 py-2 border rounded text-xs"
                >
                    <option value="">All</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <table className="w-full bg-white border border-gray-300 shadow-md text-xs">
                <thead className="bg-gray-100 text-gray-700 text-left whitespace-nowrap">
                    <tr>
                        {[ 
                            "SPSIC No.", "Date Arrived", "Date Soldout", "Supplier", "Country", "Container No",
                            "Boxes", "Commmodity", "Size", "Type of Freezing", "Beginning", "Purchase Price",
                            "Shipping Line", "Bank Charges", "Brokerage", "Other Charges", "Representation - Boarder Exam",
                            "Shipping Lines Representation", "Representation", "SPS Application Fee", "Trucking Charges",
                            "Intercommerce Application Fee", "Erfi", "Selling Fee", "Storage Orca", "Storage Belen",
                            "Power Charges", "Loading/Unloading Charges", "Total", "Cost of Sales", "Actions"
                        ].map((header, i) => (
                            <th key={i} className="p-2 border">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredPosts.map(post => {
                        const rowTotal = calculateRowTotal(post);
                        const costOfSales = calculateCostOfSales(post);

                        return (
                            <tr key={post._id} className="text-left border-b capitalize whitespace-nowrap">
                                <td className="p-2 border">{post.SpsicNo}</td>
                                <td className="p-2 border">{post.DateArrived}</td>
                                <td className="p-2 border">{post.DateSoldout}</td>
                                <td className="p-2 border">{post.SupplierName}</td>
                                <td className="p-2 border">{post.Country}</td>
                                <td className="p-2 border">{post.ContainerNo}</td>
                                <td className="p-2 border">{post.Boxes}</td>
                                <td className="p-2 border">{post.Commodity}</td>
                                <td className="p-2 border">{post.Size}</td>
                                <td className="p-2 border">{post.Freezing}</td>
                                <td className="p-2 border">{post.TotalQuantity}</td>
                                <td className="p-2 border text-right pr-4">{formatCurrency(post.PurchasePrice)}</td>
                                <td className="p-2 border text-right pr-4">{formatCurrency(post.ShippingLine)}</td>
                                <td className="p-2 border text-right pr-4">{formatCurrency(post.BankCharges)}</td>
                                <td className="p-2 border text-right pr-4">{formatCurrency(post.Brokerage)}</td>
                                <td className="p-2 border text-right pr-4">{formatCurrency(post.OtherCharges)}</td>
                                <td className="p-2 border text-right pr-4">{formatCurrency(post.BoarderExam)}</td>
                                <td className="p-2 border text-right pr-4">{formatCurrency(post.ShippingLineRepresentation)}</td>
                                <td className="p-2 border text-right pr-4">{formatCurrency(post.Representation)}</td>
                                <td className="p-2 border text-right pr-4">{formatCurrency(post.SPSApplicationFee)}</td>
                                <td className="p-2 border text-right pr-4">{formatCurrency(post.TruckingCharges)}</td>
                                <td className="p-2 border text-right pr-4">{formatCurrency(post.Intercommerce)}</td>
                                <td className="p-2 border text-right pr-4">{formatCurrency(post.Erfi)}</td>
                                <td className="p-2 border text-right pr-4">{formatCurrency(post.SellingFee)}</td>
                                <td className="p-2 border text-right pr-4">{formatCurrency(post.StorageOrca)}</td>
                                <td className="p-2 border text-right pr-4">{formatCurrency(post.StorageBelen)}</td>
                                <td className="p-2 border text-right pr-4">{formatCurrency(post.PowerCharges)}</td>
                                <td className="p-2 border text-right pr-4">{formatCurrency(post.LoadingCharges)}</td>
                                <td className="p-2 border font-semibold text-right pr-4">
                                    {rowTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="p-2 border text-right pr-4">
                                    {formatCurrency(costOfSales.toString())}
                                </td>
                                <td className="p-2 border text-right pr-4 flex justify-center space-x-2">
                                    <button onClick={() => handleEdit(post)} className="px-2 py-1 text-xs">
                                        <CiEdit size={15} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot className="bg-gray-100 font-semibold text-gray-700">
                    <tr>
                        <td colSpan={29} className="p-2 text-right pr-4">Total Cost of Sales:</td>
                        <td className="p-2 text-right pr-4">
                            {formatCurrency(totalCostOfSales.toString())}
                        </td>
                        <td className="p-2"></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default ContainerTable;
