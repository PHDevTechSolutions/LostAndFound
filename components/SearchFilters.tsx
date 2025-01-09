"use client";
import React from "react";

interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedMonth: string;
    setSelectedMonth: (month: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    selectedTag: string;
    setSelectedTag: (tag: string) => void;
    postsPerPage: number;
    setPostsPerPage: (num: number) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    selectedMonth,
    setSelectedMonth,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    postsPerPage,
    setPostsPerPage,
}) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow"
            />
            <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow"
            >
                <option value="">Filter by Month</option>
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
            <input
                type="text"
                placeholder="Filter by Category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow"
            />
            <input
                type="text"
                placeholder="Filter by Tag"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow"
            />
            <select
                value={postsPerPage}
                onChange={(e) => setPostsPerPage(parseInt(e.target.value))}
                className="border px-3 py-2 rounded text-xs w-full md:w-auto"
            >
                <option value={5}>5</option>  {/* Dapat 5, hindi 1 */}
                <option value={10}>10</option>
                <option value={15}>15</option>
            </select>

        </div>
    );
};

export default SearchFilters;
