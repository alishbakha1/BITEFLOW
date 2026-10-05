import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search restaurants..."
        className="w-full rounded-full bg-white shadow-lg border border-gray-200 py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-[#FFBA00]"
      />
    </div>
  );
};

export default SearchBar;