import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Post {
  _id: string;
  InvoiceDate: string;
  SupplierName: string;
  InvoiceNumber: string;
  Description: string;
  TypeFish: string;
  Freezing: string;
  Weight: string;
  UnitPrice: number;
  InvoiceAmount: number;
  FirstPayment: string;
  SecondPayment: string;
  ThirdPayment: string;
  FinalPayment: number;
  Discount: number;
  Commission: number;
  CableFee: string;
  DateApproval: string;
  Status: string;
  Remarks: string;
  Location: string;
  Action: string;
}

const STATUS_COLORS: { [key: string]: string } = {
  "With IP": "text-blue-500",
  TBA: "text-red-500",
};

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
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState("unpaid");

  useEffect(() => {
    // Filter posts based on Role and Location
    const updatedPosts = posts.filter((post) => {
      if (Role === "Staff" || Role === "Admin") {
        return post.Location === Location;
      }
      return true;
    });

    setFilteredPosts(updatedPosts);
  }, [posts, Role, Location]);

  // Filtered posts based on the active tab
  const displayedPosts = filteredPosts.filter((post) =>
    activeTab === "unpaid" ? post.Action === "Unpaid" : post.Action === "Paid"
  );

  // Compute totals only for the displayed posts
  const totalInvoiceAmount = displayedPosts.reduce(
    (sum, post) => sum + post.InvoiceAmount,
    0
  );
  const totalFirstPayment = displayedPosts.reduce(
    (sum, post) => sum + (Number(post.FirstPayment) || 0),
    0
  );
  const totalSecondPayment = displayedPosts.reduce(
    (sum, post) => sum + (Number(post.SecondPayment) || 0),
    0
  );
  const totalThirdPayment = displayedPosts.reduce(
    (sum, post) => sum + (Number(post.ThirdPayment) || 0),
    0
  );
  const totalFinalPayment = displayedPosts.reduce(
    (sum, post) => sum + (post.FinalPayment || 0),
    0
  );
  const totalPayments =
    totalFirstPayment + totalSecondPayment + totalThirdPayment + totalFinalPayment;
  const totalBalance = totalInvoiceAmount - totalPayments;

  return (
    <div className="overflow-x-auto">
      <div className="flex border-b text-xs">
        <button
          className={`p-2 ${
            activeTab === "unpaid" ? "border-b-2 border-blue-500 font-semibold" : ""
          }`}
          onClick={() => setActiveTab("unpaid")}
        >
          Unpaid
        </button>
        <button
          className={`p-2 ${
            activeTab === "paid" ? "border-b-2 border-blue-500 font-semibold" : ""
          }`}
          onClick={() => setActiveTab("paid")}
        >
          Paid
        </button>
      </div>

      {/* Main Table */}
      <table className="min-w-max bg-white border border-gray-300 shadow-md text-xs">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {[
              "Invoice Date", "Supplier Name", "Invoice Number", "Description", "Type of Fish", "Freezing", "Weight", "Unit Price", "Invoice Amount", "First Payment",
              "Second Payment", "Third Payment", "Final Payment", "Total Payment", "Discount", "Balance", "Commission", "Cable Fee", "Date Approval", "Status", "Remarks", "Actions",
            ].map((header) => (
              <th key={header} className="p-2 border whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayedPosts.map((post) => {
            const invoiceAmount = parseFloat(post.Weight) * post.UnitPrice;
            const totalPayment =
              (Number(post.FirstPayment) || 0) +
              (Number(post.SecondPayment) || 0) +
              (Number(post.ThirdPayment) || 0) +
              (Number(post.FinalPayment) || 0);
            const balance = invoiceAmount - totalPayment;
            const isPaid = post.Action === "Paid";

            return (
              <tr key={post._id} className="text-center border-b">
                <td className="p-2 border">{post.InvoiceDate}</td>
                <td className="p-2 border">{post.SupplierName}</td>
                <td className="p-2 border">{post.InvoiceNumber}</td>
                <td className="p-2 border">{post.Description}</td>
                <td className="p-2 border">{post.TypeFish}</td>
                <td className="p-2 border">{post.Freezing}</td>
                <td className="p-2 border">{post.Weight}</td>
                <td className="p-2 border">₱{post.UnitPrice.toLocaleString()}</td>
                <td className="p-2 border">₱{invoiceAmount.toLocaleString()}</td>
                <td className="p-2 border">₱{post.FirstPayment}</td>
                <td className="p-2 border">₱{post.SecondPayment}</td>
                <td className="p-2 border">₱{post.ThirdPayment}</td>
                <td className="p-2 border">₱{post.FinalPayment.toLocaleString()}</td>
                <td className="p-2 border text-green-600">₱{totalPayment.toLocaleString()}</td>
                <td className="p-2 border">₱{post.Discount.toLocaleString()}</td>
                <td className="p-2 border text-red-600">₱{balance.toLocaleString()}</td>
                <td className="p-2 border">₱{post.Commission}</td>
                <td className="p-2 border">{post.CableFee}</td>
                <td className="p-2 border">{post.DateApproval}</td>
                <td className={`p-2 border ${STATUS_COLORS[post.Status] || "text-gray-600"}`}>
                  {post.Status} / {post.Action}
                </td>
                <td className="p-2 border">{isPaid ? "Done" : post.Remarks}</td>
                <td className="p-2 border flex justify-center space-x-2">
                  {!isPaid && (
                    <>
                      <button
                        onClick={() => handleEdit(post)}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                      {Role !== "Staff" && (
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                        >
                          <FaTrash className="mr-1" /> Delete
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            );
          })}
          <tr className="bg-gray-200 font-semibold text-gray-800 text-center">
            <td colSpan={8} className="p-2 border">TOTAL</td>
            <td className="p-2 border">₱{totalInvoiceAmount.toLocaleString()}</td>
            <td className="p-2 border">₱{totalFirstPayment.toLocaleString()}</td>
            <td className="p-2 border">₱{totalSecondPayment.toLocaleString()}</td>
            <td className="p-2 border">₱{totalThirdPayment.toLocaleString()}</td>
            <td className="p-2 border">₱{totalFinalPayment.toLocaleString()}</td>
            <td className="p-2 border text-green-600">₱{totalPayments.toLocaleString()}</td>
            <td colSpan={8} className="p-2 border">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ContainerTable;
