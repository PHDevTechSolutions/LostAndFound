import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Post {
  _id: string;
  ReferenceNumber: string;
  Location: string;
  PettyCashDate: string;
  Payee: string;
  Particular: string;
  Amount: number;
  Transpo: number;
  MealsTranspo: number;
  NotarialFee: number;
  Misc: number;
  ProdSupplies: number;
  Advances: number;
  TollFee: number;
  Parking: number;
  Gasoline: number;
  Tax: number;
  Supplies: number;
  Communication: number;
  Utilities: number;
  Repairs: number;
  ServiceCharges: number;
  Remarks: string;
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
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [monthFilter, setMonthFilter] = useState<string>("All");
  const [yearFilter, setYearFilter] = useState<string>("All");

  useEffect(() => {
    // Filter posts based on Role and Location
    let updatedPosts = posts.filter((post) => {
      if (Role === "Staff" || Role === "Admin") {
        return post.Location === Location;
      }
      return true;
    });

    // Filter posts based on the selected month and year
    if (monthFilter !== "All") {
      updatedPosts = updatedPosts.filter((post) => {
        const postMonth = new Date(post.PettyCashDate).getMonth() + 1;
        return postMonth === parseInt(monthFilter, 10);
      });
    }

    if (yearFilter !== "All") {
      updatedPosts = updatedPosts.filter((post) => {
        const postYear = new Date(post.PettyCashDate).getFullYear();
        return postYear === parseInt(yearFilter, 10);
      });
    }

    setFilteredPosts(updatedPosts);
  }, [posts, Role, Location, monthFilter, yearFilter]);

  // Get all unique years and months from the posts
  const years = Array.from(
    new Set(posts.map((post) => new Date(post.PettyCashDate).getFullYear()))
  );
  const months = Array.from(
    new Set(posts.map((post) => new Date(post.PettyCashDate).getMonth() + 1))
  );

  // Calculate totals for each column
  const totals = filteredPosts.reduce(
    (acc, post) => {
      acc.Amount += Number(post.Amount) || 0;
      acc.Transpo += Number(post.Transpo) || 0;
      acc.MealsTranspo += Number(post.MealsTranspo) || 0;
      acc.NotarialFee += Number(post.NotarialFee) || 0;
      acc.Misc += Number(post.Misc) || 0;
      acc.ProdSupplies += Number(post.ProdSupplies) || 0;
      acc.Advances += Number(post.Advances) || 0;
      acc.TollFee += Number(post.TollFee) || 0;
      acc.Parking += Number(post.Parking) || 0;
      acc.Gasoline += Number(post.Gasoline) || 0;
      acc.Tax += Number(post.Tax) || 0;
      acc.Supplies += Number(post.Supplies) || 0;
      acc.Communication += Number(post.Communication) || 0;
      acc.Utilities += Number(post.Utilities) || 0;
      acc.Repairs += Number(post.Repairs) || 0;
      acc.ServiceCharges += Number(post.ServiceCharges) || 0;
      return acc;
    },
    {
      Amount: 0,
      Transpo: 0,
      MealsTranspo: 0,
      NotarialFee: 0,
      Misc: 0,
      ProdSupplies: 0,
      Advances: 0,
      TollFee: 0,
      Parking: 0,
      Gasoline: 0,
      Tax: 0,
      Supplies: 0,
      Communication: 0,
      Utilities: 0,
      Repairs: 0,
      ServiceCharges: 0,
    }
  );
  

  return (
    <div className="overflow-x-auto">
      {/* Filter Section */}
      <div className="flex space-x-4 mb-4">
        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="-full px-3 py-2 border rounded text-xs capitalize"
        >
          <option value="All">All Months</option>
          {months.map((month) => (
            <option key={month} value={String(month)}>
              {new Date(0, month - 1).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="-full px-3 py-2 border rounded text-xs capitalize"
        >
          <option value="All">All Years</option>
          {years.map((year) => (
            <option key={year} value={String(year)}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Main Table */}
      <table className="min-w-max bg-white border border-gray-300 shadow-md text-xs">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {[
              "Petty Cash Date",
              "Payee",
              "Particular",
              "Amount",
              "Transpo",
              "Meals Transpo",
              "Notarial Fee",
              "Misc",
              "Prod Supplies",
              "Advances",
              "Toll Fee",
              "Parking",
              "Gasoline",
              "Tax",
              "Supplies",
              "Communication",
              "Utilities",
              "Repairs",
              "Service Charges",
              "Remarks",
              "Actions",
            ].map((header) => (
              <th key={header} className="p-2 border whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredPosts.map((post) => {
            return (
              <tr key={post._id} className="text-left border-b capitalize">
                <td className="p-2 border">{post.PettyCashDate}</td>
                <td className="p-2 border">{post.Payee}</td>
                <td className="p-2 border">{post.Particular}</td>
                <td className="p-2 border">{post.Amount.toLocaleString()}</td>
                <td className="p-2 border">{post.Transpo.toLocaleString()}</td>
                <td className="p-2 border">{post.MealsTranspo.toLocaleString()}</td>
                <td className="p-2 border">{post.NotarialFee.toLocaleString()}</td>
                <td className="p-2 border">{post.Misc.toLocaleString()}</td>
                <td className="p-2 border">{post.ProdSupplies.toLocaleString()}</td>
                <td className="p-2 border">{post.Advances.toLocaleString()}</td>
                <td className="p-2 border">{post.TollFee.toLocaleString()}</td>
                <td className="p-2 border">{post.Parking.toLocaleString()}</td>
                <td className="p-2 border">{post.Gasoline.toLocaleString()}</td>
                <td className="p-2 border">{post.Tax.toLocaleString()}</td>
                <td className="p-2 border">{post.Supplies.toLocaleString()}</td>
                <td className="p-2 border">{post.Communication.toLocaleString()}</td>
                <td className="p-2 border">{post.Utilities.toLocaleString()}</td>
                <td className="p-2 border">{post.Repairs.toLocaleString()}</td>
                <td className="p-2 border">{post.ServiceCharges.toLocaleString()}</td>
                <td className="p-2 border">{post.Remarks}</td>
                <td className="p-2 border flex justify-center space-x-2">
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
          })}
        </tbody>
        <tfoot className="bg-gray-100 text-gray-700 font-bold">
          <tr>
            <td className="p-2 border text-right" colSpan={3}>
              Total:
            </td>
            <td className="p-2 border">{totals.Amount.toLocaleString()}</td>
            <td className="p-2 border">{totals.Transpo.toLocaleString()}</td>
            <td className="p-2 border">{totals.MealsTranspo.toLocaleString()}</td>
            <td className="p-2 border">{totals.NotarialFee.toLocaleString()}</td>
            <td className="p-2 border">{totals.Misc.toLocaleString()}</td>
            <td className="p-2 border">{totals.ProdSupplies.toLocaleString()}</td>
            <td className="p-2 border">{totals.Advances.toLocaleString()}</td>
            <td className="p-2 border">{totals.TollFee.toLocaleString()}</td>
            <td className="p-2 border">{totals.Parking.toLocaleString()}</td>
            <td className="p-2 border">{totals.Gasoline.toLocaleString()}</td>
            <td className="p-2 border">{totals.Tax.toLocaleString()}</td>
            <td className="p-2 border">{totals.Supplies.toLocaleString()}</td>
            <td className="p-2 border">{totals.Communication.toLocaleString()}</td>
            <td className="p-2 border">{totals.Utilities.toLocaleString()}</td>
            <td className="p-2 border">{totals.Repairs.toLocaleString()}</td>
            <td className="p-2 border">{totals.ServiceCharges.toLocaleString()}</td>
            <td className="p-2 border"></td>
            <td className="p-2 border"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ContainerTable;
