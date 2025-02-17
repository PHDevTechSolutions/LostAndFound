import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoPrint } from "react-icons/io5";
import { FaRegFileExcel } from "react-icons/fa";
import { BsPlusCircle } from "react-icons/bs";
import ExcelJS from "exceljs";
const saveAs = require("file-saver").saveAs;

interface TableProps {
  filteredData: any[];
  handleEdit: (data: any) => void;
  handleDelete: (id: string) => void;
  totalBoxSales: number;
  totalPrice: number;
  totalGrossSales: number;
  ReferenceNumber: string;
  post: { Vendor: string; ContainerNo: string; ReferenceNumber: string;};
}

const Table: React.FC<TableProps> = React.memo(
  ({ filteredData, handleEdit, handleDelete, totalBoxSales, totalPrice, totalGrossSales, post }) => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const tableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (totalGrossSales !== 0 && totalGrossSales !== undefined && totalGrossSales !== null) {
        const updateGrossSalesInDatabase = async () => {
          try {
            const response = await fetch("/api/Container/UpdateGrossSales", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                referenceNumber: post?.ReferenceNumber,  // Correct field name for ReferenceNumber
                grossSales: totalGrossSales,
              }),
            });
    
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
    
            if (data.success) {
              console.log("Gross Sales updated successfully!");
            } else {
              console.error("Failed to update Gross Sales:", data.message || "Unknown error");
            }
          } catch (error) {
            // Check if error is an instance of Error to handle it correctly
            const errorMessage = error instanceof Error ? error.message : error;
            console.error("Error updating Gross Sales:", errorMessage);
          }
        };
    
        updateGrossSalesInDatabase();
      }
    }, [totalGrossSales, post?.ReferenceNumber]);
    
    
    const handlePrint = useCallback(() => {
      if (tableRef.current) {
        const printContent = `
          <div>
            <h2>${post?.Vendor}</h2>
            <h2>Container Van No.: ${post?.ContainerNo}</h2>
            ${tableRef.current.innerHTML}
          </div>
        `;
        const printWindow = window.open("", "_blank", "width=800,height=600");
        if (printWindow) {
          printWindow.document.open();
          printWindow.document.write(`
            <html>
              <head>
                <title>Print Table</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  table { width: 100%; border-collapse: collapse; }
                  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                  th { background-color: #f4f4f4; }
                  h2 { font-size: 0.75rem; }
                </style>
              </head>
              <body>
                <div>${printContent}</div>
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
          printWindow.onafterprint = () => printWindow.close();
        }
      }
    }, [post]);

    const exportToExcel = useCallback(async () => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sales Data");

      // Add headers
      worksheet.addRow([`Vendor: ${post?.Vendor || "N/A"}`]);
      worksheet.addRow([`Container No: ${post?.ContainerNo || "N/A"}`]);
      worksheet.addRow([
        "Size",
        "Username",
        "Location",
        "DateOrder",
        "BuyersName",
        "BoxSales",
        "Price",
        "GrossSales",
        "PlaceSales",
        "PaymentMode",
      ]);

      // Add data
      filteredData.forEach((data) => {
        worksheet.addRow([
          data.Size || "",
          data.userName || "",
          data.Location || "",
          data.DateOrder || "",
          data.BuyersName || "",
          data.BoxSales || "",
          data.Price || "",
          data.GrossSales || "",
          data.PlaceSales || "",
          data.PaymentMode || "",
        ]);
      });

      // Style headers
      worksheet.getRow(3).eachCell((cell) => {
        cell.font = { bold: true };
      });

      // Save to file
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), "JJV-Ventures-System-data.xlsx");
    }, [filteredData, post]);

    const toggleRow = useCallback((dataId: string) => {
      setExpandedRows((prev) => {
        const newExpandedRows = new Set(prev);
        if (newExpandedRows.has(dataId)) {
          newExpandedRows.delete(dataId);
        } else {
          newExpandedRows.add(dataId);
        }
        return newExpandedRows;
      });
    }, []);

    const renderTableRows = useMemo(() => {
      return filteredData.map((data) => (
        <React.Fragment key={data._id}>
          <tr onClick={() => toggleRow(data._id)} className="cursor-pointer">
            <td className="px-4 py-2 border hidden md:table-cell">{data.DateOrder}</td>
            <td className="px-4 py-2 border uppercase">
              {data.BuyersName}
              <BsPlusCircle className="inline-block mr-2 md:hidden" />
            </td>
            <td className="px-4 py-2 border">{data.BoxSales}</td>
            <td className="px-4 py-2 border">{data.Price}</td>
            <td className="px-4 py-2 border">{data.GrossSales}</td>
            <td className="px-4 py-2 border hidden md:table-cell uppercase">{data.PlaceSales}</td>
            <td className="px-4 py-2 border">{data.PaymentMode}</td>
            <td className="px-4 py-2 border hidden md:table-cell">
              <button className="mr-2" onClick={() => handleEdit(data)}>
                <MdEdit />
              </button>
              <button onClick={() => handleDelete(data._id)}>
                <MdDelete />
              </button>
            </td>
          </tr>

          {expandedRows.has(data._id) && (
            <tr className="md:hidden bg-gray-100">
              <td colSpan={7} className="px-4 py-2">
                <div><strong>Date:</strong> {data.DateOrder}</div>
                <div><strong>Buyer's Name:</strong> {data.BuyersName}</div>
                <div><strong>Box Sales:</strong> {data.BoxSales}</div>
                <div><strong>Price:</strong> {data.Price}</div>
                <div><strong>Gross Sales:</strong> {data.GrossSales}</div>
                <div><strong>Place of Sales:</strong> {data.PlaceSales}</div>
                <div><strong>Mode of Payment:</strong> {data.PaymentMode}</div>
                <div className="mt-2">
                  <button
                    onClick={() => handleEdit(data)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(data._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      ));
    }, [filteredData, expandedRows, handleDelete, handleEdit, toggleRow]);

    return (
      <div>
        <button onClick={handlePrint} className="text-sm text-white bg-gray-500 hover:bg-blue-900 px-4 py-2 rounded-md mb-2"><IoPrint /></button>
        <button onClick={exportToExcel} className="text-sm text-white bg-green-600 hover:bg-green-900 px-4 py-2 rounded-md mb-2 ml-2"><FaRegFileExcel /></button>
        <div ref={tableRef}>
          <table className="min-w-full bg-white border text-xs">
            <thead>
              <tr>
                <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Date</th>
                <th className="w-1/6 text-left border px-4 py-2">Buyer's Name</th>
                <th className="w-1/6 text-left border px-4 py-2">Box Sales</th>
                <th className="w-1/6 text-left border px-4 py-2">Price</th>
                <th className="w-1/6 text-left border px-4 py-2">Gross Sales Per Day</th>
                <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Place of Sales</th>
                <th className="w-1/6 text-left border px-4 py-2">Mode of Payment</th>
                <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Actions</th>
              </tr>
            </thead>
            <tbody>{renderTableRows}</tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="text-xs font-semibold text-right border px-4 py-2">Total</td>
                <td className="text-xs font-semibold border px-4 py-2">{totalBoxSales}</td>
                <td className="text-xs font-semibold border px-4 py-2">₱{new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2 }).format(totalPrice)}</td>
                <td className="text-xs font-semibold border px-4 py-2">₱{new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2 }).format(totalGrossSales)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }
);

export default Table;
