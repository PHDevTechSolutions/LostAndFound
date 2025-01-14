import React from "react";

interface ContainerOrderTableProps {
    tableData: any[];
}

const ContainerOrderTable: React.FC<ContainerOrderTableProps> = ({ tableData }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 flex-grow basis-[50%]">
            <table className="min-w-full bg-white border text-xs">
                <thead>
                    <tr>
                        <th className="w-1/6 text-left border px-4 py-2">Date</th>
                        <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Buyer's Name</th>
                        <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Box Sales</th>
                        <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Price</th>
                        <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Remaining</th>
                        <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((data: any) => (
                        <tr key={data._id}>
                            <td className="px-4 py-2 border">{data.DateOrder}</td>
                            <td className="px-4 py-2 border hidden md:table-cell">{data.BuyersName}</td>
                            <td className="px-4 py-2 border hidden md:table-cell">{data.BoxSales}</td>
                            <td className="px-4 py-2 border hidden md:table-cell">{data.Price}</td>
                            <td className="px-4 py-2 border hidden md:table-cell">{data.Remaining}</td>
                            <td className="px-4 py-2 border hidden md:table-cell">
                                <button>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContainerOrderTable;
