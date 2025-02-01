import React, { useEffect, useState, useCallback, useMemo } from "react";
import io from "socket.io-client";
import { Menu } from "@headlessui/react";
import { BsPlusCircle, BsThreeDotsVertical } from "react-icons/bs";

const socket = io("http://localhost:3001");

interface Post {
    _id: string;
    DateOrder: string;
    BuyersName: string;
    PlaceSales: string;
    ContainerNo: string;
    Size: string;
    BoxSales: number;
    Price: number;
    PayAmount: number;
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

const PedienteTable: React.FC<PedienteTableProps> = React.memo(({ posts, handleEdit, handleDelete, handleCreateData, Role }) => {
    const [updatedPosts, setUpdatedPosts] = useState<any[]>(posts);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    useEffect(() => {
        setUpdatedPosts(posts);
    }, [posts]);

    useEffect(() => {
        // Filter posts to include only those with paymentmode === 'PDC'
        const filteredPosts = posts.filter(post => post.PaymentMode === "PDC");
        setUpdatedPosts(filteredPosts);
    }, [posts]);
    

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

    // Memoizing the table rows and summing grouped data
    const memoizedRows = useMemo(() => {
        const groupedPosts = groupByBuyer(updatedPosts);
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

                // Group level totals
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
                        <td className="px-4 py-2  hidden md:table-cell">{post.Size}</td>
                        <td className="px-4 py-2  hidden md:table-cell">{post.BoxSales}</td>
                        <td className="px-4 py-2  hidden md:table-cell">{formatCurrency(post.Price)}</td>
                        <td className="px-4 py-2  hidden md:table-cell">{formatCurrency(total)}</td>
                        <td className="px-4 py-2  hidden md:table-cell">{formatCurrency(post.PayAmount || 0)}</td>
                        <td className="px-4 py-2  hidden md:table-cell">{formatCurrency(balance)}</td>
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
                        <td colSpan={11} className="px-4 py-2 uppercase">{buyer}</td>
                    </tr>
                    {buyerRows}
                    {/* Group Total Row */}
                    <tr className="bg-gray-300">
                        <td className="px-4 py-2 text-right" colSpan={5}>Group Total:</td>
                        <td className="px-4 py-2" colSpan={2}>{groupTotalQty}</td>
                        <td className="px-4 py-2">{formatCurrency(groupTotalAmount)}</td>
                        <td className="px-4 py-2">{formatCurrency(groupTotalPayment)}</td>
                        <td className="px-4 py-2">{formatCurrency(groupTotalBalance)}</td>
                        <td className="px-4 py-2"></td>
                    </tr>
                </React.Fragment>
            );
        });

        return { rows, totalQty, totalAmount, totalPayment, totalBalance };
    }, [updatedPosts, expandedRows, toggleRow, handleCreateData, handleEdit, handleDelete, Role]);

    const { rows, totalQty, totalAmount, totalPayment, totalBalance } = memoizedRows;

    return (
        <div>
            {/* Desktop View - Float Right */}
            <div className="bg-white p-4 mb-2 rounded-sm shadow-md text-xs font-bold w-56 md:flex md:flex-col md:items-start md:float-right hidden md:block">
                <span className="mb-1">Beginning Balance: {formatCurrency(100000)}</span>
                <span className="mb-1">Add Receivable: {formatCurrency(0)}</span>
                <span className="mb-1">Less Collection: {formatCurrency(totalPayment)}</span>
                <span>Ending Balance: {formatCurrency(totalBalance)}</span>
            </div>

            {/* Mobile View - Centered */}
            <div className="bg-white p-4 rounded-lg shadow-md text-xs font-bold w-full text-center block md:hidden">
                <div className="mb-1">Beginning Balance: {formatCurrency(100000)}</div>
                <div className="mb-1">Add Receivable: {formatCurrency(0)}</div>
                <div className="mb-1">Less Collection: {formatCurrency(totalPayment)}</div>
                <div>Ending Balance: {formatCurrency(totalBalance)}</div>
            </div>

            <table className="min-w-full bg-white border text-xs">
                <thead>
                    <tr>
                        <th className="w-1/7 text-left  px-4 py-2">Date</th>
                        <th className="w-1/7 text-left  px-4 py-2">Buy and Sell</th>
                        <th className="w-1/7 text-left  px-4 py-2">Breakdown</th>
                        <th className="w-1/7 text-left  px-4 py-2">Container Van</th>
                        <th className="w-1/7 text-left  px-4 py-2">Size</th>
                        <th className="w-1/7 text-left  px-4 py-2">Qty</th>
                        <th className="w-1/7 text-left  px-4 py-2">Sales Price</th>
                        <th className="w-1/7 text-left  px-4 py-2">Total</th>
                        <th className="w-1/7 text-left  px-4 py-2">Payment</th>
                        <th className="w-1/7 text-left  px-4 py-2">Balance</th>
                        <th className="w-1/7 text-left  px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.length > 0 ? rows : (
                        <tr>
                            <td colSpan={11} className="py-2 px-4 border text-center">No records found</td>
                        </tr>
                    )}
                </tbody>
                <tfoot className="bg-gray-200 font-bold">
                    <tr>
                        <td className="px-4 py-2 border text-right" colSpan={5}>Grand Total:</td>
                        <td className="px-4 py-2" colSpan={2}>{totalQty}</td>
                        <td className="px-4 py-2">{formatCurrency(totalAmount)}</td>
                        <td className="px-4 py-2">{formatCurrency(totalPayment)}</td>
                        <td className="px-4 py-2">{formatCurrency(totalBalance)}</td>
                        <td className="px-4 py-2"></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
});

export default PedienteTable;
