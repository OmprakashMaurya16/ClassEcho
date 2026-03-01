import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

const SearchBar = ({ value, onChange }) => (
  <div className="flex items-center gap-2 w-full">
    <div className="relative flex-1">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search size={18} />
      </span>
      <input
        type="text"
        placeholder="Search faculty by name, ID"
        value={value}
        onChange={onChange}
        className="w-full py-2.5 pl-10 pr-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50 text-sm cursor-text"
      />
    </div>
  </div>
);

export default SearchBar;
