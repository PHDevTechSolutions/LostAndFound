"use client";
import React from "react";

interface ChartFilterProps {
    selectedMonth: string;
    setSelectedMonth: React.Dispatch<React.SetStateAction<string>>;
    selectedYear: string;
    setSelectedYear: React.Dispatch<React.SetStateAction<string>>;
}

const ChartFilter: React.FC<ChartFilterProps> = ({ selectedMonth, setSelectedMonth, selectedYear, setSelectedYear }) => {
    return (
        <div className="mb-4 flex gap-4">
            {/* Month Filter */}
            <select
                className="px-3 py-2 border rounded text-xs"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
            >
                <option value="All">All Months</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
            </select>

            {/* Year Filter */}
            <select
                className="px-3 py-2 border rounded text-xs"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
            >
                <option value="All">All Years</option>
                <option value="2023">2009</option>
                <option value="2023">2010</option>
                <option value="2023">2011</option>
                <option value="2023">2012</option>
                <option value="2023">2013</option>
                <option value="2023">2014</option>
                <option value="2023">2015</option>
                <option value="2023">2016</option>
                <option value="2023">2017</option>
                <option value="2023">2018</option>
                <option value="2023">2019</option>
                <option value="2023">2020</option>
                <option value="2023">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
                <option value="2030">2030</option>
            </select>
        </div>
    );
};

export default ChartFilter;
