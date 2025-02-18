import React, { useMemo, useState } from "react";
import Form from "./Form";
import { BsThreeDotsVertical } from "react-icons/bs"; // For the 3 dots icon
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface Post {
    _id: string;
    createdAt: string;
    DateOrder: string;
    BuyersName: string;
    PlaceSales: string;
    ContainerNo: string;
    Commodity: string;
    Size: string;
    BoxSales: number;
    Price: number;
    GrossSales: string;
    PayAmount: string;
    BalanceAmount: string;
    Status: string;
    Location: string;
    PaymentMode: string;
}

const STATUS_COLORS: { [key: string]: string } = {
    "New Debt": "border-gray-300",
    "Paid Balance": "border-yellow-300",
    "Fully Paid": "border-green-300",
};

interface PedienteTableProps {
    posts: Post[];
    handleEdit: (post: Post) => void;
    handleStatusUpdate: (postId: string, newStatus: string) => void;
    Role: string;
    Location: string;
}

const groupByBuyer = (posts: Post[]) => {
    return posts.reduce((acc, post) => {
        const { BuyersName, Location, PaymentMode } = post;
        if (PaymentMode === "PDC" && post.Location === Location) {
            if (!acc[BuyersName]) acc[BuyersName] = [];
            acc[BuyersName].push(post);
        }
        return acc;
    }, {} as Record<string, Post[]>);
};

// Sorting by DateOrder (assuming DateOrder is a string in ISO format or a Date object)
const sortByLatestDate = (groupedPosts: Record<string, Post[]>) => {
    Object.keys(groupedPosts).forEach(buyer => {
        groupedPosts[buyer].sort((a, b) => {
            const dateA = new Date(a.DateOrder);
            const dateB = new Date(b.DateOrder);
            return dateB.getTime() - dateA.getTime(); // Sort in descending order
        });
    });
    return groupedPosts;
};

const formatCurrency = (amount: number): string => {
    return `₱${parseFloat(amount.toString()).toLocaleString()}`;
};

const PedienteTable: React.FC<PedienteTableProps> = React.memo(({ posts, Location, handleEdit, handleStatusUpdate }) => {
    const [menuVisible, setMenuVisible] = useState<{ [key: string]: boolean }>({});
    const [statusMenuVisible, setStatusMenuVisible] = useState<{ [key: string]: boolean }>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

    const toggleMenu = (id: string) => {
        setMenuVisible(prevState => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const toggleStatusMenu = (postId: string) => {
        setStatusMenuVisible(prev => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    const updateStatus = (postId: string, newStatus: string) => {
        handleStatusUpdate(postId, newStatus);
        setStatusMenuVisible({});
    };

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const postDate = new Date(post.DateOrder).toISOString().split('T')[0]; // Format post date as YYYY-MM-DD
            return (
                post.PaymentMode === "PDC" &&
                post.Location === Location &&
                post.BuyersName.toUpperCase().includes(searchTerm) &&
                (dateRange.start ? postDate >= dateRange.start : true) &&
                (dateRange.end ? postDate <= dateRange.end : true)
            );
        });
    }, [posts, Location, searchTerm, dateRange]);

    const groupedPosts = groupByBuyer(filteredPosts);
    const sortedGroupedPosts = sortByLatestDate(groupedPosts);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const getBeginningBalance = (posts: Post[], currentDate: string) => {
        const previousDay = new Date(currentDate);
        previousDay.setDate(previousDay.getDate() - 1);
        const previousDateStr = previousDay.toISOString().split('T')[0];

        // Fetch posts from the previous day
        const previousDayPosts = posts.filter(post => post.PaymentMode === "PDC" && post.DateOrder === previousDateStr);

        if (previousDayPosts.length > 0) {
            // If data exists for the previous day, sum up the GrossSales
            return previousDayPosts.reduce((acc, post) => acc + (parseFloat(post.GrossSales) || 0), 0);
        } else {
            // If no data for the previous day, try the day before that
            previousDay.setDate(previousDay.getDate() - 1);
            const twoDaysAgoStr = previousDay.toISOString().split('T')[0];

            const twoDaysAgoPosts = posts.filter(post => post.PaymentMode === "PDC" && post.DateOrder === twoDaysAgoStr);
            return twoDaysAgoPosts.reduce((acc, post) => acc + (parseFloat(post.GrossSales) || 0), 0);
        }
    };

    const beginningBalance = getBeginningBalance(posts, yesterdayStr);

    // Calculate Grand Totals
    let grandTotalQty = 0;
    let grandTotalDebt = 0;
    let grandTotalPayment = 0;
    let grandTotalBalance = 0;

    Object.entries(groupedPosts).forEach(([buyer, buyerPosts]) => {
        buyerPosts.forEach(post => {
            const boxSales = Number(post.BoxSales) || 0;
            const grossSales = parseFloat(post.GrossSales) || 0;
            const payAmount = parseFloat(post.PayAmount) || 0;

            grandTotalQty += boxSales;
            grandTotalDebt += grossSales;
            grandTotalPayment += payAmount;
            grandTotalBalance += grossSales - payAmount;
        });
    });

    // Ensure that NaN values are replaced with 0
    grandTotalQty = isNaN(grandTotalQty) ? 0 : grandTotalQty;
    grandTotalDebt = isNaN(grandTotalDebt) ? 0 : grandTotalDebt;
    grandTotalPayment = isNaN(grandTotalPayment) ? 0 : grandTotalPayment;
    grandTotalBalance = isNaN(grandTotalBalance) ? 0 : grandTotalBalance;

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Pendiente");

        // Define columns
        worksheet.columns = [
            { header: "Date Order", key: "DateOrder", width: 15 },
            { header: "Buyer Name", key: "BuyersName", width: 20 },
            { header: "Place of Sales", key: "PlaceSales", width: 20 },
            { header: "Container No", key: "ContainerNo", width: 15 },
            { header: "Commodity", key: "Commodity", width: 20 },
            { header: "Size", key: "Size", width: 10 },
            { header: "Box Sales", key: "BoxSales", width: 10 },
            { header: "Price", key: "Price", width: 15 },
            { header: "Gross Sales", key: "GrossSales", width: 15 },
            { header: "Payment Amount", key: "PayAmount", width: 15 },
            { header: "Balance Amount", key: "BalanceAmount", width: 15 },
            { header: "Status", key: "Status", width: 15 },
            { header: "Location", key: "Location", width: 15 },
            { header: "Payment Mode", key: "PaymentMode", width: 15 }
        ];

        // Initialize grand total counters
        let grandTotalDebt = 0;
        let grandTotalPayment = 0;
        let grandTotalBalance = 0;

        // Group data by BuyersName
        Object.entries(groupByBuyer(filteredPosts)).forEach(([buyer, buyerPosts]) => {
            let totalDebt = 0;
            let totalPayment = 0;
            let totalBalance = 0;

            buyerPosts.forEach(post => {
                const grossSales = parseFloat(post.GrossSales) || 0;
                const payAmount = parseFloat(post.PayAmount) || 0;
                const balance = grossSales - payAmount;

                totalDebt += grossSales;
                totalPayment += payAmount;
                totalBalance += balance;

                worksheet.addRow(post);
            });

            // Update grand totals
            grandTotalDebt += totalDebt;
            grandTotalPayment += totalPayment;
            grandTotalBalance += totalBalance;

            // Add subtotal row for each buyer
            worksheet.addRow({
                BuyersName: `${buyer} (Subtotal)`,
                GrossSales: totalDebt,
                PayAmount: totalPayment,
                BalanceAmount: totalBalance
            });

            // Style subtotal row
            const lastRow = worksheet.lastRow;
            if (lastRow) {
                lastRow.eachCell(cell => {
                    cell.font = { bold: true };
                    cell.alignment = { horizontal: "left" };
                });
            }

            // Add an empty row for spacing
            worksheet.addRow({});
        });

        // Add Grand Total row at the end
        worksheet.addRow({
            BuyersName: "GRAND TOTAL",
            GrossSales: grandTotalDebt,
            PayAmount: grandTotalPayment,
            BalanceAmount: grandTotalBalance
        });

        // Style the Grand Total row
        const grandTotalRow = worksheet.lastRow;
        if (grandTotalRow) {
            grandTotalRow.eachCell(cell => {
                cell.font = { bold: true, size: 12 };
                cell.alignment = { horizontal: "left" };
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFF00" } // Yellow background
                };
            });
        }

        // Save the file
        const buffer = await workbook.xlsx.writeBuffer();
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const fileName = `JJ-Ventures-Frozen-Pendiente-${formattedDate}.xlsx`;

        saveAs(new Blob([buffer]), fileName);
    };

    const toggleExpand = (buyer: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [buyer]: !prev[buyer],
        }));
    };

    return (
        <div>
            <Form beginningBalance={beginningBalance} totalAmount={grandTotalDebt} totalPayment={grandTotalPayment} totalBalance={grandTotalBalance} />
            <div className="flex items-center gap-2 mt-4 mb-4">
                {/* Search Bar */}
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value.toLocaleUpperCase())} className="border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize" />
                {/* Date Range Filters */}
                <div className="flex gap-2">
                    <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} className="border px-3 py-2 rounded text-xs" />
                    <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} className="border px-3 py-2 rounded text-xs" />
                </div>
                <button onClick={exportToExcel} className="bg-green-800 text-white px-4 py-2 rounded text-xs">Export to Excel</button>
            </div>
            {/* Display Filtered and Grouped Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">
                {Object.entries(groupedPosts).map(([buyer, buyerPosts]) => {
                    const totalQty = buyerPosts.reduce((acc, post) => acc + (Number(post.BoxSales) || 0), 0);
                    const totalDebt = buyerPosts.reduce((acc, post) => acc + parseFloat(post.GrossSales), 0);
                    const totalPayment = buyerPosts.reduce((acc, post) => acc + parseFloat(post.PayAmount), 0);
                    const totalBalance = buyerPosts.reduce((acc, post) => acc + (parseFloat(post.GrossSales) - parseFloat(post.PayAmount)), 0);

                    const isExpanded = expandedGroups[buyer];
                    const visiblePosts = isExpanded ? buyerPosts : buyerPosts.slice(0, 4);

                    return (
                        <div key={buyer} className="relative border-b-2 rounded-md shadow-md p-4 flex flex-col mb-2">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xs font-semibold text-gray-800 text-center uppercase">{buyer}</h3>
                            </div>

                            <div className="mt-4 text-xs capitalize flex-grow grid grid-cols-4 gap-2">
                                {visiblePosts.map((post) => {
                                    const balance = parseFloat(post.GrossSales) - parseFloat(post.PayAmount); // Calculate balance for each post
                                    const cardClasses = STATUS_COLORS[post.Status] || "bg-white border-gray-200";
                                    return (
                                        <div key={post._id} className={`relative border rounded-md shadow-md p-4 flex flex-col mb-2 ${cardClasses}`}>
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="text-xs font-semibold text-gray-800 text-left">Container No. {post.ContainerNo}</h4>
                                                <button className="text-gray-500 hover:text-gray-800" onClick={() => toggleMenu(post._id)}>
                                                    <BsThreeDotsVertical size={12} />
                                                </button>
                                            </div>

                                            <div className="flex justify-between">
                                                <div className="w-full text-left">
                                                    <p><strong>Date:</strong> {post.DateOrder}</p>
                                                    <p><strong>Breakdown:</strong> {post.PlaceSales}</p>
                                                    <p><strong>Commodity:</strong> {post.Commodity}</p>
                                                    <p><strong>Size:</strong> {post.Size}</p>
                                                    <p><strong>Qty:</strong> {post.BoxSales}</p>
                                                    <p className="mt-2"><strong>Sales Price:</strong> {formatCurrency(post.Price)}</p>
                                                    <p><strong>Total Debt:</strong> {formatCurrency(parseFloat(post.GrossSales) || 0)}</p>
                                                    <p><strong>Payment:</strong> {formatCurrency(parseFloat(post.PayAmount) || 0)}</p>
                                                    <p><strong>Balance:</strong> {formatCurrency(balance || 0)}</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 border-t border-gray-900 pt-2 text-xs text-gray-900 flex justify-between items-center">
                                                <span><strong>Status:</strong> {post.Status}</span>
                                            </div>

                                            {/* Dropdown Menu */}
                                            {menuVisible[post._id] && (
                                                <div className="absolute right-4 top-12 bg-white shadow-lg rounded-lg border w-32 z-10 text-xs">
                                                    <button onClick={() => handleEdit(post)} className="w-full px-4 py-2 hover:bg-gray-100 text-left">Edit</button>
                                                    <button onClick={() => toggleStatusMenu(post._id)} className="w-full px-4 py-2 hover:bg-gray-100 text-left">Change Status</button>
                                                </div>
                                            )}

                                            {/* Status Change Menu */}
                                            {statusMenuVisible[post._id] && (
                                                <div className="absolute right-16 top-20 bg-white shadow-lg rounded-lg border w-50 z-20 text-xs">
                                                    {Object.keys(STATUS_COLORS).map((status) => (
                                                        <button key={status} onClick={() => updateStatus(post._id, status)} className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100">
                                                            <span className={`w-3 h-3 rounded-full border border-black ${STATUS_COLORS[status].split(" ")[0]}`}></span>
                                                            {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {buyerPosts.length > 4 && (
                                <button onClick={() => toggleExpand(buyer)} className="mt-2 text-blue-500 text-xs hover:underline">
                                    {isExpanded ? "View Less" : "View More"}
                                </button>
                            )}

                            <div className="border-t border-gray-900 mt-3 pt-2 text-xs">
                                <div className="flex flex-wrap gap-4">
                                    <span className="flex items-center gap-1 font-bold">QTY: {totalQty || 0}</span> |
                                    <span className="flex items-center gap-1 font-bold">Total Debt: {formatCurrency(totalDebt || 0)}</span> |
                                    <span className="flex items-center gap-1 font-bold">Total Payment: {formatCurrency(totalPayment || 0)}</span> |
                                    <span className="flex items-center gap-1 font-bold">Total Balance: {formatCurrency(totalBalance || 0)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filteredPosts.length === 0 && <p className="text-center text-xs col-span-full">No records found</p>}
                <div className="border-t border-gray-900 mt-3 pt-2 text-xs">
                    <div className="flex flex-wrap gap-4">
                        <span className="flex items-center gap-1 font-bold">QTY: {grandTotalQty || 0}</span> |
                        <span className="flex items-center gap-1 font-bold">Beginning Balance: {formatCurrency(beginningBalance || 0)}</span> |
                        <span className="flex items-center gap-1 font-bold">Total Debt: {formatCurrency(grandTotalDebt || 0)}</span> |
                        <span className="flex items-center gap-1 font-bold">Total Payment: {formatCurrency(grandTotalPayment || 0)}</span> |
                        <span className="flex items-center gap-1 font-bold">Total Balance: {formatCurrency(grandTotalBalance || 0)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default PedienteTable;
