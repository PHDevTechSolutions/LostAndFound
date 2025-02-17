import React, { useMemo, useState } from "react";
import Form from "./Form";
import { BsThreeDotsVertical } from "react-icons/bs"; // For the 3 dots icon

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

interface PedienteTableProps {
    posts: Post[];
    handleEdit: (post: Post) => void;
    Role: string;
    Location: string;
}

const groupByBuyer = (posts: Post[]) => {
    return posts.reduce((acc, post) => {
        const { BuyersName } = post;
        const normalizedBuyerName = BuyersName.toLowerCase();  // Normalize to lowercase
        if (!acc[normalizedBuyerName]) acc[normalizedBuyerName] = [];
        acc[normalizedBuyerName].push(post);
        return acc;
    }, {} as Record<string, Post[]>);
};

const formatCurrency = (amount: number): string => {
    return `₱${parseFloat(amount.toString()).toLocaleString()}`;
};

const PedienteTable: React.FC<PedienteTableProps> = React.memo(({ posts, Location, handleEdit }) => {
    const [menuVisible, setMenuVisible] = useState<{ [key: string]: boolean }>({});

    const toggleMenu = (id: string) => {
        setMenuVisible(prevState => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const updatedPosts = useMemo(() => {
        return posts.filter(post => post.PaymentMode === "PDC" && post.Location === Location);
    }, [posts, Location]);

    const groupedPosts = groupByBuyer(updatedPosts);

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

    return (
        <div>
            {/* Pass the grand totals as props to the Form component */}
            <Form beginningBalance={0} totalAmount={grandTotalDebt} totalPayment={grandTotalPayment} totalBalance={grandTotalBalance}/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">
                {Object.entries(groupedPosts).map(([buyer, buyerPosts]) => {
                    const totalQty = buyerPosts.reduce((acc, post) => acc + (Number(post.BoxSales) || 0), 0);
                    const totalDebt = buyerPosts.reduce((acc, post) => acc + parseFloat(post.GrossSales), 0);
                    const totalPayment = buyerPosts.reduce((acc, post) => acc + parseFloat(post.PayAmount), 0);
                    const totalBalance = buyerPosts.reduce((acc, post) => acc + (parseFloat(post.GrossSales) - parseFloat(post.PayAmount)), 0);

                    return (
                        <div key={buyer} className="relative border-b-2 rounded-md shadow-md p-4 flex flex-col mb-2">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xs font-semibold text-gray-800 text-center uppercase">{buyer}</h3>
                            </div>

                            <div className="mt-4 text-xs capitalize flex-grow grid grid-cols-4 gap-2">
                                {buyerPosts.map((post) => {
                                    const balance = parseFloat(post.GrossSales) - parseFloat(post.PayAmount); // Calculate balance for each post
                                    return (
                                        <div key={post._id} className="mb-4 border p-4 rounded-md bg-white shadow-sm relative"> {/* Added relative positioning here */}
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

                                            <div className="mt-4 border-t pt-2 text-xs text-gray-600 flex justify-between items-center">
                                                <span><strong>Status:</strong> {post.Status}</span>
                                            </div>

                                            {/* Dropdown Menu */}
                                            {menuVisible[post._id] && (
                                                <div className="absolute right-4 top-12 bg-white shadow-lg rounded-lg border w-32 z-10 text-xs">
                                                    <button onClick={() => handleEdit(post)} className="w-full px-4 py-2 hover:bg-gray-100 text-left">Edit</button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

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
                {updatedPosts.length === 0 && <p className="text-center text-xs col-span-full">No records found</p>}
            </div>
        </div>
    );
});

export default PedienteTable;
