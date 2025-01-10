"use client";

import React from "react";

interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedChannel: string;
    setSelectedChannel: (channel: string) => void;
    postsPerPage: number;
    setPostsPerPage: (num: number) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    selectedChannel,
    setSelectedChannel,
    postsPerPage,
    setPostsPerPage,
}) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLocaleLowerCase())}
                className="border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
            />
            <input
                type="text"
                placeholder="Filter by Channel"
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow"
            />
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
