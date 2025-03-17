"use client";
import React, { useState } from "react";
import { Mic, Search } from "lucide-react";
import { useRouter } from 'next/navigation';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
const router = useRouter();
  const handleVoiceSearch = () => {
    // Add voice search functionality here
  };

  const handleSearch = (event) => {
    event.preventDefault(); // Prevent the default form submission
    router.push(`../components/search?q=${encodeURIComponent(searchQuery)}`); // Redirect to the search page with the search query
};


  return (
    <div className="max-w-2xl mx-auto p-4 mt-5">
    <form onSubmit={handleSearch}>
      <div className="flex items-center border rounded-full shadow-md p-4 bg-gray-200">
        <Search className="text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          required
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow outline-none px-3 text-lg"
        />
        <button onClick={handleVoiceSearch} className="ml-2">
          <Mic className="text-gray-500 hover:text-black cursor-pointer" />
        </button>
      </div>
      </form>
    </div>
  );
};

export default SearchBar;
