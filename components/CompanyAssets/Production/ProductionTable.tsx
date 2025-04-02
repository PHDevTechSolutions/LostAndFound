import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Post {
  _id: string;
  DateRecord: string;
  ModeType: string;
  Amount: string;
  Location: string;
  ReferenceNumber: string;
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
  const [activeTab, setActiveTab] = useState<string>("Q1");
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );

  const uniqueYears = Array.from(
    new Set(posts.map((post) => new Date(post.DateRecord).getFullYear()))
  ).sort((a, b) => b - a);

  const updatedPosts = posts
    .filter((post) => {
      if (Role === "Staff" || Role === "Admin") {
        return post.Location === Location;
      }
      return true;
    })
    .map((post) => ({
      ...post,
      Month: new Date(post.DateRecord).toLocaleString("en-US", { month: "long" }),
      MonthIndex: new Date(post.DateRecord).getMonth(),
      Year: new Date(post.DateRecord).getFullYear().toString(),
    }));

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const quarterMap: Record<string, number[]> = {
    Q1: [0, 1, 2],
    Q2: [3, 4, 5],
    Q3: [6, 7, 8],
    Q4: [9, 10, 11],
  };

  const lessCosModeTypes = ["Purchases - Supplies", "Purchases - Packaging"];

  const groupedData: Record<string, any> = {
    Sales: {},
    "Less: COS": {},
    "Less: Expenses": {},
  };

  updatedPosts.forEach((post) => {
    const modeTypeKey = post.ModeType;
    let group = "Less: Expenses";

    if (lessCosModeTypes.includes(modeTypeKey)) {
      group = "Less: COS";
    } else if (modeTypeKey.includes("Sales")) {
      group = "Sales";
    }

    if (!groupedData[group][modeTypeKey]) {
      groupedData[group][modeTypeKey] = {
        ModeType: post.ModeType,
        monthlyAmounts: Array(12).fill(0),
        quarterlyTotals: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 },
        totalAmount: 0,
      };
    }

    const amount = parseFloat(post.Amount) || 0;

    groupedData[group][modeTypeKey].monthlyAmounts[post.MonthIndex] += amount;

    Object.keys(quarterMap).forEach((quarter) => {
      if (quarterMap[quarter].includes(post.MonthIndex)) {
        groupedData[group][modeTypeKey].quarterlyTotals[quarter] += amount;
      }
    });

    groupedData[group][modeTypeKey].totalAmount += amount;
  });

  const calculateGrossProfit = (monthIndex: number) => {
    const salesTotal =
      groupedData["Sales"]?.["Sales"]?.monthlyAmounts[monthIndex] || 0;
    const cosTotal =
      (groupedData["Less: COS"]?.["Purchases - Supplies"]?.monthlyAmounts[monthIndex] || 0) +
      (groupedData["Less: COS"]?.["Purchases - Packaging"]?.monthlyAmounts[monthIndex] || 0);

    return salesTotal - cosTotal;
  };

  const calculateQuarterGrossProfit = (quarter: string) => {
    const monthIndexes = quarterMap[quarter];
    let grossProfitTotal = 0;
    monthIndexes.forEach((monthIndex) => {
      grossProfitTotal += calculateGrossProfit(monthIndex);
    });
    return grossProfitTotal;
  };

  const renderTableForQuarter = (quarter: string) => {
    const quarterMonths = quarterMap[quarter].map((index) => months[index]);

    // Calculate Total Expenses for each month
    const calculateTotalExpensesForMonth = (monthIndex: number) => {
      let totalExpenses = 0;
      Object.keys(groupedData["Less: Expenses"]).forEach((modeTypeKey) => {
        totalExpenses += groupedData["Less: Expenses"][modeTypeKey].monthlyAmounts[monthIndex];
      });
      return totalExpenses;
    };

    // Calculate Total Expenses for the quarter
    const calculateTotalExpensesForQuarter = () => {
      let totalExpenses = 0;
      quarterMap[quarter].forEach((monthIndex) => {
        totalExpenses += calculateTotalExpensesForMonth(monthIndex);
      });
      return totalExpenses;
    };

    // Calculate Net Income (Loss) Before Expenses (Gross Profit - Total Expenses)
    const calculateNetIncomeBeforeExpenses = (monthIndex: number) => {
      const grossProfit = calculateGrossProfit(monthIndex);
      const totalExpenses = calculateTotalExpensesForMonth(monthIndex);
      return grossProfit - totalExpenses;
    };

    const calculateQuarterNetIncomeBeforeExpenses = (quarter: string) => {
      let netIncomeTotal = 0;
      quarterMap[quarter].forEach((monthIndex) => {
        netIncomeTotal += calculateNetIncomeBeforeExpenses(monthIndex);
      });
      return netIncomeTotal;
    };

    return (
      <table className="w-full bg-white border border-gray-300 text-xs mb-6 table-fixed">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-2 border text-left sticky left-0 bg-gray-100 z-10 w-40 overflow-hidden whitespace-nowrap">
              JJ Production Minalin P&L
            </th>
            {quarterMonths.map((month) => (
              <th key={month} className="p-2 border text-left w-24 truncate">
                {month}
              </th>
            ))}
            <th className="p-2 border text-left w-24">{quarter}</th>
            <th className="p-2 border text-left sticky right-0 bg-gray-100 z-10 w-24">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedData).map((groupKey) => {
            const dataGroup = groupedData[groupKey];

            return (
              <React.Fragment key={groupKey}>
                {Object.keys(dataGroup).map((modeTypeKey) => {
                  const data = dataGroup[modeTypeKey];

                  return (
                    <tr key={modeTypeKey} className="text-left capitalize">
                      <td className="p-2 border sticky left-0 bg-white z-10 w-40 overflow-hidden whitespace-nowrap">
                        {data.ModeType}
                      </td>
                      {quarterMap[quarter].map((monthIndex) => (
                        <td
                          key={months[monthIndex]}
                          className="p-2 border text-left w-24 truncate"
                        >
                          {data.monthlyAmounts[monthIndex].toLocaleString()}
                        </td>
                      ))}
                      <td className="p-2 border font-bold text-left w-24">
                        {data.quarterlyTotals[quarter].toLocaleString()}
                      </td>
                      <td className="p-2 border font-bold text-left sticky right-0 bg-white z-10 w-24">
                        {data.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            );
          })}

          {/* Gross Profit Row */}
          {Object.keys(groupedData).map((groupKey) => {
            if (groupKey === "Less: COS") {
              return (
                <tr key="gross-profit" className="text-left capitalize font-bold bg-gray-50">
                  <td className="p-2 border sticky left-0 bg-white z-10 w-48">
                    Gross Profit
                  </td>
                  {quarterMap[quarter].map((monthIndex) => {
                    const grossProfit = calculateGrossProfit(monthIndex);
                    return (
                      <td
                        key={months[monthIndex]}
                        className="p-2 border text-left w-24 truncate"
                      >
                        {grossProfit.toLocaleString()}
                      </td>
                    );
                  })}
                  <td className="p-2 border font-bold text-left w-24">
                    {calculateQuarterGrossProfit(quarter).toLocaleString()}
                  </td>
                  <td className="p-2 border font-bold text-left sticky right-0 bg-white z-10 w-24">
                    {calculateQuarterGrossProfit(quarter).toLocaleString()}
                  </td>
                </tr>
              );
            }
            return null;
          })}

          {/* Total Expenses Row */}
          <tr key="total-expenses" className="text-left capitalize font-bold bg-gray-50">
            <td className="p-2 border sticky left-0 bg-white z-10 w-48">
              Total Expenses
            </td>
            {quarterMap[quarter].map((monthIndex) => (
              <td
                key={`expense-${monthIndex}`}
                className="p-2 border text-left w-24 truncate"
              >
                {calculateTotalExpensesForMonth(monthIndex).toLocaleString()}
              </td>
            ))}
            <td className="p-2 border font-bold text-left w-24">
              {calculateTotalExpensesForQuarter().toLocaleString()}
            </td>
            <td className="p-2 border font-bold text-left sticky right-0 bg-white z-10 w-24">
              {calculateTotalExpensesForQuarter().toLocaleString()}
            </td>
          </tr>

          {/* Net Income Before Expenses Row */}
          <tr key="net-income-before-expenses" className="text-left capitalize font-bold bg-gray-100">
            <td className="p-2 border sticky left-0 bg-white z-10 w-48">
              Net Income (Loss) Before Expenses
            </td>
            {quarterMap[quarter].map((monthIndex) => {
              const netIncome = calculateNetIncomeBeforeExpenses(monthIndex);
              return (
                <td
                  key={`net-income-${monthIndex}`}
                  className="p-2 border text-left w-24 truncate"
                >
                  {netIncome.toLocaleString()}
                </td>
              );
            })}
            <td className="p-2 border font-bold text-left w-24">
              {calculateQuarterNetIncomeBeforeExpenses(quarter).toLocaleString()}
            </td>
            <td className="p-2 border font-bold text-left sticky right-0 bg-white z-10 w-24">
              {calculateQuarterNetIncomeBeforeExpenses(quarter).toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const renderHistoryTable = () => {
    return (
      <table className="w-full bg-white border border-gray-300 shadow-md text-xs mb-6 table-fixed">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-2 border text-left w-48">Reference Number</th>
            <th className="p-2 border text-left w-48">Mode Type</th>
            <th className="p-2 border text-left w-32">Date Record</th>
            <th className="p-2 border text-left w-28">Amount</th>
            <th className="p-2 border text-left w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {updatedPosts.map((post) => (
            <tr key={post._id} className="text-left capitalize">
              <td className="p-2 border">{post.ReferenceNumber}</td>
              <td className="p-2 border">{post.ModeType}</td>
              <td className="p-2 border">
                {new Date(post.DateRecord).toLocaleDateString()}
              </td>
              <td className="p-2 border">
                {parseFloat(post.Amount).toLocaleString()}
              </td>
              <td className="p-2 flex space-x-2">
                <button onClick={() => handleEdit(post)}>
                  <FaEdit />
                </button>
                {Role !== "Staff" && (
                  <button onClick={() => handleDelete(post._id)}>
                    <FaTrash />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="overflow-x-auto w-full">
      <div className="mb-4">
        <label className="text-xs font-bold mr-2">Filter by Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-2 py-1 border rounded text-xs"
        >
          {uniqueYears.map((year) => (
            <option key={year} value={year.toString()}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="flex space-x-2 mb-4">
        {["Q1", "Q2", "Q3", "Q4", "History"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border rounded text-xs ${activeTab === tab ? "bg-gray-300" : "bg-gray-100"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "History" ? renderHistoryTable() : renderTableForQuarter(activeTab)}
    </div>
  );
};

export default ContainerTable;
