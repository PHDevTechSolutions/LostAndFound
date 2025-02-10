import React, { useEffect, useState, useCallback, useMemo } from "react";
import io from "socket.io-client";
import { Menu } from "@headlessui/react";
import { BsPlusCircle, BsThreeDotsVertical } from "react-icons/bs";
import Form from "./Form";

const socket = io("http://localhost:3001");

interface Post {
    _id: string;
    DatePediente: string;
    DateOrder: string;
    BuyersName: string;
    PlaceSales: string;
    ContainerNo: string;
    Commodity: string;
    Size: string;
    BoxSales: number;
    Price: number;
    PayAmount: number;
    Status: string;
}

interface PedienteTableProps {
    posts: any[];
    handleEdit: (post: any) => void;
    handleDelete: (postId: string) => void;
    handleCreateData: (postId: string) => void;
    Role: string; // Pass the role here
}

const groupByBuyer = (posts: Post[]) => {
    return posts.reduce((acc, post) => {
        const { BuyersName } = post;
        if (!acc[BuyersName]) acc[BuyersName] = [];
        acc[BuyersName].push(post);
        return acc;
    }, {} as Record<string, Post[]>);
};

const calculateBeginningBalance = (posts: Post[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to 00:00 to compare only the date

    // Find the most recent date before today
    const recentPostDate = posts.reduce((latest, post) => {
        const postDate = new Date(post.DatePediente);
        if (postDate < today && postDate > latest) {
            return postDate;
        }
        return latest;
    }, new Date(0)); // Initial value is the earliest possible date

    // If no recent date is found, return 0 (no balance)
    if (recentPostDate.getTime() === new Date(0).getTime()) {
        return 0;
    }

    const recentPostDateString = recentPostDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    // Filter posts that match the recent date
    const recentPosts = posts.filter(post => {
        const postDate = new Date(post.DatePediente).toISOString().split('T')[0];
        return postDate === recentPostDateString;
    });

    // Sum up the total balance (BoxSales * Price - PayAmount) for the most recent date
    const beginningBalance = recentPosts.reduce((total, post) => {
        const totalAmount = post.BoxSales * post.Price;
        const balance = totalAmount - (post.PayAmount || 0);
        return total + balance;
    }, 0);

    return beginningBalance;
};

const PedienteTable: React.FC<PedienteTableProps> = React.memo(({ posts, handleEdit, handleDelete, handleCreateData, Role }) => {
    const [updatedPosts, setUpdatedPosts] = useState<any[]>(posts);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

    const todayString = new Date().toISOString().split("T")[0]; // Ensure default date is today

    useEffect(() => {
        setDateRange({ startDate: todayString, endDate: todayString });
    }, []);

    useEffect(() => {
        setUpdatedPosts(posts);
    }, [posts]);

    const beginningBalance = useMemo(() => calculateBeginningBalance(updatedPosts), [updatedPosts]);

    const filterPostsByDateRange = (posts: any[], dateRange: { startDate: string, endDate: string }) => {
        const { startDate, endDate } = dateRange;

        if (!startDate && !endDate) return posts; // No filtering if no dates are selected

        const filteredPosts = posts.filter(post => {
            const postDate = new Date(post.DatePediente); // Convert post date to a Date object
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            return (
                (!start || postDate >= start) &&
                (!end || postDate <= end)
            );
        });

        return filteredPosts;
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDateRange((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const filteredPosts = useMemo(() => {
        return filterPostsByDateRange(updatedPosts, dateRange);
    }, [updatedPosts, dateRange]);

    useEffect(() => {
        const newPostListener = (newPost: any) => {
            setUpdatedPosts((prevPosts) => {
                if (prevPosts.find(post => post._id === newPost._id)) return prevPosts;  // Prevent adding duplicate posts
                return [newPost, ...prevPosts];
            });
        };

        socket.on("newPost", newPostListener);
        return () => {
            socket.off("newPost", newPostListener);
        };
    }, []);

    useEffect(() => {
        const filteredPosts = posts.filter(post => post.PaymentMode === "PDC");
        setUpdatedPosts(filteredPosts);
    }, [posts]);

    const toggleRow = useCallback((postId: string) => {
        setExpandedRows(prev => {
            const newExpandedRows = new Set(prev);
            if (newExpandedRows.has(postId)) {
                newExpandedRows.delete(postId);
            } else {
                newExpandedRows.add(postId);
            }
            return newExpandedRows;
        });
    }, []);

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
    };

    const memoizedRows = useMemo(() => {
        const filteredPosts = filterPostsByDateRange(updatedPosts, dateRange);
        const groupedPosts = groupByBuyer(filteredPosts);

        let totalQty = 0;
        let totalAmount = 0;
        let totalPayment = 0;
        let totalBalance = 0;

        const rows = Object.entries(groupedPosts).map(([buyer, posts]) => {
            let groupTotalQty = 0;
            let groupTotalAmount = 0;
            let groupTotalPayment = 0;
            let groupTotalBalance = 0;

            const buyerRows = posts.map((post) => {
                const total = post.BoxSales * post.Price;
                const balance = total - (post.PayAmount || 0);

                groupTotalQty += Number(post.BoxSales) || 0;
                groupTotalAmount += total;
                groupTotalPayment += post.PayAmount || 0;
                groupTotalBalance += balance;

                totalQty += Number(post.BoxSales) || 0;
                totalAmount += total;
                totalPayment += Number(post.PayAmount) || 0;
                totalBalance += balance;

                return (
                    <tr key={post._id}>
                        <td className="px-4 py-2  capitalize">{post.DateOrder}</td>
                        <td className="px-4 py-2  capitalize">{post.BuyersName}</td>
                        <td className="px-4 py-2  hidden md:table-cell">{post.PlaceSales}</td>
                        <td className="px-4 py-2  hidden md:table-cell">{post.ContainerNo}</td>
                        <td className="px-4 py-2  hidden md:table-cell">{post.Commodity}</td>
                        <td className="px-4 py-2  hidden md:table-cell">{post.Size}</td>
                        <td className="px-4 py-2  hidden md:table-cell">{post.BoxSales}</td>
                        <td className="px-4 py-2  hidden md:table-cell">{formatCurrency(post.Price)}</td>
                        <td className="px-4 py-2  hidden md:table-cell">{formatCurrency(total)}</td>
                        <td className="px-4 py-2  hidden md:table-cell">{formatCurrency(post.PayAmount || 0)}</td>
                        <td className="px-4 py-2  hidden md:table-cell">{formatCurrency(balance)}</td>
                        <td className="px-4 py-2  hidden md:table-cell">{post.Status}</td>
                        <td className="px-4 py-2  hidden md:table-cell">
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                                        <BsThreeDotsVertical />
                                    </Menu.Button>
                                </div>
                                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    <div className="py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleEdit(post); }}
                                                    className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                                                        } block w-full text-left px-4 py-2 text-xs`}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </Menu.Item>
                                        {Role !== "Staff" && (
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(post._id); }}
                                                        className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                                                            } block w-full text-left px-4 py-2 text-xs`}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        )}
                                    </div>
                                </Menu.Items>
                            </Menu>
                        </td>
                    </tr>
                );
            });

            return (
                <React.Fragment key={buyer}>
                    {/* Grouped Buyer Row */}
                    <tr className="bg-gray-100 font-semibold">
                        <td colSpan={13} className="px-4 py-2 uppercase">{buyer}</td>
                    </tr>
                    {buyerRows}
                    {/* Group Total Row */}
                    <tr className="bg-gray-300">
                        <td className="px-4 py-2 text-right" colSpan={6}>Group Total:</td>
                        <td className="px-4 py-2" colSpan={2}>{groupTotalQty}</td>
                        <td className="px-4 py-2">{formatCurrency(groupTotalAmount)}</td>
                        <td className="px-4 py-2">{formatCurrency(groupTotalPayment)}</td>
                        <td className="px-4 py-2">{formatCurrency(groupTotalBalance)}</td>
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2"></td>
                    </tr>
                </React.Fragment>
            );
        });

        return { rows, totalQty, totalAmount, totalPayment, totalBalance };
    }, [updatedPosts, dateRange, expandedRows, toggleRow, handleCreateData, handleEdit, handleDelete, Role]);
    const { rows, totalQty, totalAmount, totalPayment, totalBalance } = memoizedRows;

    return (
        <>
            <Form beginningBalance={beginningBalance} totalAmount={totalAmount} totalPayment={totalPayment} totalBalance={totalBalance} />

            <div className="mt-4 p-4 border shadow-md rounded-md">
                <table className="min-w-full bg-white border text-xs">
                    <thead>
                        <tr>
                            <th className="w-1/7 text-left  px-4 py-2">Date</th>
                            <th className="w-1/7 text-left  px-4 py-2">Buy and Sell</th>
                            <th className="w-1/7 text-left  px-4 py-2">Breakdown</th>
                            <th className="w-1/7 text-left  px-4 py-2">Container Van</th>
                            <th className="w-1/7 text-left  px-4 py-2">Commodity</th>
                            <th className="w-1/7 text-left  px-4 py-2">Size</th>
                            <th className="w-1/7 text-left  px-4 py-2">Qty</th>
                            <th className="w-1/7 text-left  px-4 py-2">Sales Price</th>
                            <th className="w-1/7 text-left  px-4 py-2">Total Debt</th>
                            <th className="w-1/7 text-left  px-4 py-2">Payment</th>
                            <th className="w-1/7 text-left  px-4 py-2">Balance</th>
                            <th className="w-1/7 text-left  px-4 py-2">Status</th>
                            <th className="w-1/7 text-left  px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length > 0 ? rows : (
                            <tr>
                                <td colSpan={13} className="py-2 px-4 border text-center">No records found</td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot className="bg-gray-200 font-bold">
                        <tr>
                            <td className="px-4 py-2 border text-right" colSpan={6}>Grand Total:</td>
                            <td className="px-4 py-2" colSpan={2}>{totalQty}</td>
                            <td className="px-4 py-2">{formatCurrency(totalAmount)}</td>
                            <td className="px-4 py-2">{formatCurrency(totalPayment)}</td>
                            <td className="px-4 py-2">{formatCurrency(totalBalance)}</td>
                            <td className="px-4 py-2"></td>
                            <td className="px-4 py-2"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
});

export default PedienteTable;
