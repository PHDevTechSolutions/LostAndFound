"use client";

import React from "react";

interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedLocation: string;
    setselectedLocation: (Status: string) => void;
    postsPerPage: number;
    setPostsPerPage: (num: number) => void;
    dateRange: { start: string; end: string };
    setDateRange: (range: { start: string; end: string }) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    postsPerPage,
    selectedLocation,
    setselectedLocation,
    setPostsPerPage,
    dateRange,
    setDateRange,

}) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLocaleUpperCase())}
                className="border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
            />

            {/* Filter by Channel */}
            <select
                value={selectedLocation}
                onChange={(e) => setselectedLocation(e.target.value)}
                className="border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow"
            >
                <option value="">Select Location</option>
                <option value="Navotas">Navotas</option>
                <option value="Minalin">Minalin</option>
                <option value="Sambat">Sambat</option>
            </select>
            
            <div className="flex gap-2">
                <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="border px-3 py-2 rounded text-xs"
                />
                <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="border px-3 py-2 rounded text-xs"
                />
            </div>
            <select
                value={postsPerPage}
                onChange={(e) => setPostsPerPage(parseInt(e.target.value))}
                className="border px-3 py-2 rounded text-xs w-full md:w-auto"
            >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
            </select>
        </div>
    );
};

export default SearchFilters;
