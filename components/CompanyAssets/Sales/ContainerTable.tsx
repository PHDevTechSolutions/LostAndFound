import React, { useState } from "react";

interface Post {
    _id: string;
    ReferenceNumber: string;
    ContainerNo: string;
    Commodity: string;
    Size: string;
    Freezing: string;
    GrossSales: string;
    DateOrder: string;
    Location: string;
    createdAt: string;
    PaymentMode: string; // Added PaymentMode field
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

    // Filter posts based on selected year, location, and PaymentMode
    const filteredPosts = posts.filter((post) => {
        const postYear = new Date(post.createdAt).getFullYear().toString();
        const isYearMatched = selectedYear ? postYear === selectedYear : true;
        const isLocationMatched =
            Role === "Staff" || Role === "Admin" ? post.Location === Location : true;
        const isPaymentModeCash = post.PaymentMode === "Cash"; // Filter by PaymentMode

        return isYearMatched && isLocationMatched && isPaymentModeCash;
    });

    // Group posts by ContainerNo and calculate total sales for each month
    const groupedPosts = filteredPosts.reduce((acc, post) => {
        if (!acc[post.ContainerNo]) {
            acc[post.ContainerNo] = {
                ContainerNo: post.ContainerNo,
                Commodity: post.Commodity,
                Size: post.Size,
                Freezing: post.Freezing,
                GrossSales: 0,
                monthlySales: Array(12).fill(0), // Initialize sales array for each month (Jan-Dec)
            };
        }

        // Add GrossSales to the corresponding month based on DateOrder
        const monthIndex = new Date(post.DateOrder).getMonth(); // 0 = January, 11 = December
        const grossSales = parseFloat(post.GrossSales);

        if (!isNaN(grossSales)) {
            acc[post.ContainerNo].monthlySales[monthIndex] += grossSales;
            acc[post.ContainerNo].GrossSales += grossSales;
        }

        return acc;
    }, {} as Record<string, any>);

    // Convert the grouped data into an array for rendering
    const groupedPostsArray = Object.values(groupedPosts);

    // Get unique years from the posts
    const years = Array.from(
        new Set(posts.map((post) => new Date(post.createdAt).getFullYear().toString()))
    );

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
                            "Container No",
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
                        ].map((header, i) => (
                            <th key={i} className="p-2 border">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {groupedPostsArray.map((post) => (
                        <tr
                            key={post._id} // Using _id as the unique key for each row
                            className="text-left border-b capitalize whitespace-nowrap"
                        >
                            <td className="p-2 border">{post.ContainerNo}</td>
                            <td className="p-2 border">{post.Commodity}</td>
                            <td className="p-2 border">{post.Size}</td>
                            <td className="p-2 border">{post.Freezing}</td>
                            {post.monthlySales.map((sales: number, index: number) => (
                                <td key={`sales-${post._id}-${index}`} className="p-2 border text-right">
                                    {sales.toFixed(2)} {/* Displaying the sales for the specific month */}
                                </td>
                            ))}
                            <td className="p-2 border text-right font-semibold">{post.GrossSales.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default ContainerTable;
