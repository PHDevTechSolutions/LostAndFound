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

const ContainerTable: React.FC<ContainerTableProps> = ({ posts, handleEdit, handleDelete, Role, Location }) => {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useEffect(() => {
    // I-filter ang posts depende sa role at location
    const updatedPosts = posts.filter((post) => {
      if (Role === "Staff") {
        return post.Location === Location;
      }
      if (Role === "Admin") {
        return post.Location === Location;
      }
      return true;
    });

    setFilteredPosts(updatedPosts);
  }, [posts, Role, Location]);

  // Compute totals
  const totalInvoiceAmount = filteredPosts.reduce((sum, post) => sum + (post.InvoiceAmount || 0), 0);
  const totalFirstPayment = filteredPosts.reduce((sum, post) => sum + (Number(post.FirstPayment) || 0), 0);
  const totalSecondPayment = filteredPosts.reduce((sum, post) => sum + (Number(post.SecondPayment) || 0), 0);
  const totalThirdPayment = filteredPosts.reduce((sum, post) => sum + (Number(post.ThirdPayment) || 0), 0);
  const totalFinalPayment = filteredPosts.reduce((sum, post) => sum + (post.FinalPayment || 0), 0);
  const totalPayments = totalFirstPayment + totalSecondPayment + totalThirdPayment + totalFinalPayment;
  const totalBalance = totalInvoiceAmount - totalPayments;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-max bg-white border border-gray-300 shadow-md text-xs">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {[
              "Invoice Date", "Supplier Name", "Invoice Number", "Description", "Type of Fish", "Freezing",
              "Weight", "Unit Price", "Invoice Amount", "First Payment", "Second Payment", "Third Payment",
              "Final Payment", "Total Payment", "Discount", "Balance", "Commission", "Cable Fee", "Date Approval", "Status", "Remarks", "Actions"
            ].map((header) => (
              <th key={header} className="p-2 border whitespace-nowrap">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => {
              const totalPayment =
                (Number(post.FirstPayment) || 0) +
                (Number(post.SecondPayment) || 0) +
                (Number(post.ThirdPayment) || 0) +
                (Number(post.FinalPayment) || 0);

              const balance = (post.InvoiceAmount || 0) - totalPayment;

              return (
                <tr key={post._id} className="text-center border-b">
                  <td className="p-2 border whitespace-nowrap">{post.InvoiceDate}</td>
                  <td className="p-2 border whitespace-nowrap capitalize">{post.SupplierName}</td>
                  <td className="p-2 border whitespace-nowrap uppercase">{post.InvoiceNumber}</td>
                  <td className="p-2 border whitespace-nowrap capitalize">{post.Description}</td>
                  <td className="p-2 border whitespace-nowrap">{post.TypeFish}</td>
                  <td className="p-2 border whitespace-nowrap">{post.Freezing}</td>
                  <td className="p-2 border whitespace-nowrap">{post.Weight}</td>
                  <td className="p-2 border whitespace-nowrap">₱{post.UnitPrice.toLocaleString()}</td>
                  <td className="p-2 border whitespace-nowrap">₱{post.InvoiceAmount.toLocaleString()}</td>
                  <td className="p-2 border whitespace-nowrap">₱{post.FirstPayment}</td>
                  <td className="p-2 border whitespace-nowrap">₱{post.SecondPayment}</td>
                  <td className="p-2 border whitespace-nowrap">₱{post.ThirdPayment}</td>
                  <td className="p-2 border whitespace-nowrap">₱{post.FinalPayment.toLocaleString()}</td>
                  <td className="p-2 border whitespace-nowrap font-semibold text-green-600">₱{totalPayment.toLocaleString()}</td>
                  <td className="p-2 border whitespace-nowrap">₱{post.Discount.toLocaleString()}</td>
                  <td className="p-2 border whitespace-nowrap font-semibold text-red-600">₱{balance.toLocaleString()}</td>
                  <td className="p-2 border whitespace-nowrap">₱{post.Commission.toLocaleString()}</td>
                  <td className="p-2 border whitespace-nowrap">{post.CableFee}</td>
                  <td className="p-2 border whitespace-nowrap">{post.DateApproval}</td>
                  <td className={`p-2 border whitespace-nowrap ${STATUS_COLORS[post.Status] || "text-gray-600"}`}>
                    {post.Status}
                  </td>
                  <td className="p-2 border whitespace-nowrap capitalize">{post.Remarks}</td>
                  <td className="p-2 border whitespace-nowrap flex justify-center items-center space-x-2">
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
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={21} className="p-4 text-center text-gray-500">
                No records found
              </td>
            </tr>
          )}
          {/* Total Row */}
          <tr className="bg-gray-200 font-semibold text-gray-800 text-center">
            <td colSpan={8} className="p-2 border">TOTAL</td>
            <td className="p-2 border">₱{totalInvoiceAmount.toLocaleString()}</td>
            <td className="p-2 border">₱{totalFirstPayment.toLocaleString()}</td>
            <td className="p-2 border">₱{totalSecondPayment.toLocaleString()}</td>
            <td className="p-2 border">₱{totalThirdPayment.toLocaleString()}</td>
            <td className="p-2 border">₱{totalFinalPayment.toLocaleString()}</td>
            <td className="p-2 border text-green-600">₱{totalPayments.toLocaleString()}</td>
            <td className="p-2 border">-</td>
            <td className="p-2 border text-red-600">₱{totalBalance.toLocaleString()}</td>
            <td colSpan={6} className="p-2 border">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ContainerTable;
