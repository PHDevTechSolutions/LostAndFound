import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";

interface TableProps {
  filteredData: any[];
  handleEdit: (data: any) => void;
  handleDelete: (id: string) => void;
  totalBoxSales: number;
  totalPrice: number;
  totalGrossSales: number;
}

const Table: React.FC<TableProps> = ({
  filteredData,
  handleEdit,
  handleDelete,
  totalBoxSales,
  totalPrice,
  totalGrossSales,
}) => {
  return (
      <table className="min-w-full bg-white border text-xs overflow">
        <thead>
          <tr>
            <th className="w-1/6 text-left border px-4 py-2">Date</th>
            <th className="w-1/6 text-left border px-4 py-2">Buyer's Name</th>
            <th className="w-1/6 text-left border px-4 py-2">Box Sales</th>
            <th className="w-1/6 text-left border px-4 py-2">Price</th>
            <th className="w-1/6 text-left border px-4 py-2">Gross Sales Per Day</th>
            <th className="w-1/6 text-left border px-4 py-2">Place of Sales</th>
            <th className="w-1/6 text-left border px-4 py-2">Mode of Payment</th>
            <th className="w-1/6 text-left border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((data) => (
            <tr key={data._id}>
              <td className="px-4 py-2 border">{data.DateOrder}</td>
              <td className="px-4 py-2 border">{data.BuyersName}</td>
              <td className="px-4 py-2 border">{data.BoxSales}</td>
              <td className="px-4 py-2 border">{data.Price}</td>
              <td className="px-4 py-2 border">{data.GrossSales}</td>
              <td className="px-4 py-2 border">{data.PlaceSales}</td>
              <td className="px-4 py-2 border">{data.PaymentMode}</td>
              <td className="px-4 py-2 border">
                <button className="mr-2" onClick={() => handleEdit(data)}>
                  <MdEdit />
                </button>
                <button onClick={() => handleDelete(data._id)}>
                  <MdDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} className="text-xs font-semibold text-right border px-4 py-2">
              Total
            </td>
            <td className="text-xs font-semibold border px-4 py-2">{totalBoxSales}</td>
            <td className="text-xs font-semibold border px-4 py-2">
              ₱{new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2 }).format(totalPrice)}
            </td>
            <td className="text-xs font-semibold border px-4 py-2">
              ₱{new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2 }).format(totalGrossSales)}
            </td>
            <td colSpan={3}></td>
          </tr>
        </tfoot>
      </table>
  );
};

export default Table;
