import React, { useState } from "react";

interface Post {
    _id: string;
    ReferenceNumber: string;
    ContainerNo: string;
    Country: string;
    DateArrived: string;
    DateSoldout: string;
    SupplierName: string;
    Commodity: string;
    BoxType: string;
    Boxes: string;
    Size: string;
    Freezing: string;
    GrossSales: string;
    DateOrder: string;
    Location: string;
    Price: string;
    createdAt: string;
    PaymentMode: string;
}

interface ContainerTableProps {
    posts: Post[];
    handleEdit: (post: Post) => void;
    Role: string;
    Location: string;
}

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
        const isPaymentModeCash = post.PaymentMode === "Cash";
        return isYearMatched && isLocationMatched && isPaymentModeCash;
    });

    const groupedPosts = filteredPosts.reduce((acc, post) => {
        const groupKey = `${post.ContainerNo}-${post.Commodity}-${post.Size}-${post.Freezing}-${post.BoxType}`;
        if (!acc[groupKey]) {
            acc[groupKey] = {
                ContainerNo: post.ContainerNo,
                Country: post.Country,
                DateArrived: post.DateArrived,
                DateSoldout: post.DateSoldout,
                SupplierName: post.SupplierName,
                Boxes: post.Boxes,
                Commodity: post.Commodity,
                Size: post.Size,
                Freezing: post.Freezing,
                BoxType: post.BoxType,
                Price: post.Price,
                GrossSales: 0,
                monthlySales: Array(12).fill(0),
            };
        }
        const monthIndex = new Date(post.DateOrder).getMonth();
        const grossSales = parseFloat(post.GrossSales);
        if (!isNaN(grossSales)) {
            acc[groupKey].monthlySales[monthIndex] += grossSales;
            acc[groupKey].GrossSales += grossSales;
        }
        return acc;
    }, {} as Record<string, any>);

    const groupedPostsArray = Object.values(groupedPosts);

    const years = Array.from(
        new Set(posts.map((post) => new Date(post.DateOrder).getFullYear().toString()))
    );

    const formatCurrency = (value: string | number): string => {
        const num = typeof value === "string" ? parseFloat(value) : value;
        return !isNaN(num)
            ? num.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
            : "-";
    };

    // Total calculation for tfoot
    const totals = {
        monthly: Array(12).fill(0),
        grossSales: 0,
        endingInventory: 0,
        price: 0,
        boxes: 0,
    };

    groupedPostsArray.forEach((post) => {
        post.monthlySales.forEach((sale: number, idx: number) => {
            totals.monthly[idx] += sale;
        });
        totals.grossSales += post.GrossSales;
        totals.price += parseFloat(post.Price);
        totals.boxes += parseFloat(post.Boxes);
        totals.endingInventory += parseFloat(post.Price) * parseFloat(post.Boxes);
    });

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
                        <option key={`year-${year}`} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            <table className="w-full bg-white border border-gray-300 shadow-md text-xs">
                <thead className="bg-gray-100 text-gray-700 text-left whitespace-nowrap">
                    <tr>
                        {[
                            "Container No",
                            "Date Arrived",
                            "Date Soldout",
                            "Supplier",
                            "Country",
                            "Boxes",
                            "Commodity",
                            "Size",
                            "Type of Freezing",
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
                            "Total Sales",
                            "Ending Inventory",
                            "Price",
                            "Ending Inventory as of Dec",
                        ].map((header, index) => (
                            <th key={`header-${index}`} className="p-2 border">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {groupedPostsArray.map((post) => (
                        <tr
                            key={`row-${post.ContainerNo}-${post.Commodity}-${post.Size}-${post.Freezing}-${post.BoxType}`}
                            className="text-left border-b capitalize whitespace-nowrap"
                        >
                            <td className="p-2 border">{post.ContainerNo}</td>
                            <td className="p-2 border">{post.DateArrived}</td>
                            <td className="p-2 border">{post.DateSoldout}</td>
                            <td className="p-2 border">{post.SupplierName}</td>
                            <td className="p-2 border">{post.Country}</td>
                            <td className="p-2 border">{post.BoxType}</td>
                            <td className="p-2 border">{post.Commodity}</td>
                            <td className="p-2 border">{post.Size}</td>
                            <td className="p-2 border">{post.Freezing}</td>
                            {post.monthlySales.map((sales: number, index: number) => (
                                <td key={index} className="p-2 border text-right">
                                    {formatCurrency(sales)}
                                </td>
                            ))}
                            <td className="p-2 border text-right font-semibold">
                                {formatCurrency(post.GrossSales)}
                            </td>
                            <td className="p-2 border text-right">
                                {formatCurrency(post.Boxes)}
                            </td>
                            <td className="p-2 border text-right">
                                {formatCurrency(post.Price)}
                            </td>
                            <td className="p-2 border text-right font-semibold">
                                {formatCurrency(parseFloat(post.Price) * parseFloat(post.Boxes))}
                            </td>
                        </tr>
                    ))}
                </tbody>

                {/* FOOTER (TOTALS) */}
                <tfoot className="bg-gray-100 font-semibold">
                    <tr>
                        <td colSpan={9} className="p-2 border text-right">
                            Total:
                        </td>
                        {totals.monthly.map((val: number, index: number) => (
                            <td key={index} className="p-2 border text-right">
                                {formatCurrency(val)}
                            </td>
                        ))}
                        <td className="p-2 border text-right">
                            {formatCurrency(totals.grossSales)}
                        </td>
                        <td className="p-2 border text-right">
                            {formatCurrency(totals.boxes)} {/* ✅ Boxes Total */}
                        </td>
                        <td className="p-2 border text-right">
                            {formatCurrency(totals.price)}
                        </td>
                        <td className="p-2 border text-right">
                            {formatCurrency(totals.endingInventory)}
                        </td>
                    </tr>
                </tfoot>

            </table>
        </div>
    );
};

export default ContainerTable;
