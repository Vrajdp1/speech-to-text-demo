"use client";
import React, { useState } from "react";
import { Mic, Search } from "lucide-react";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleVoiceSearch = () => {
    // Add voice search functionality here
  };

  return (
    <div className="max-w-2xl mx-auto p-4 mt-5">
      <div className="flex items-center border rounded-full shadow-md p-4 bg-gray-200">
        <Search className="text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow outline-none px-3 text-lg"
        />
        <button onClick={handleVoiceSearch} className="ml-2">
          <Mic className="text-gray-500 hover:text-black cursor-pointer" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
