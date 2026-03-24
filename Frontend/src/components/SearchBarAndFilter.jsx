
import { Search, SlidersHorizontal } from "lucide-react";

const SearchBarAndFilter = ({
  search, onSearch, dept, onDept, departments = [], placeholder = "Search faculty name or ID…",
}) => (
  <div className="flex flex-col sm:flex-row gap-3 mb-6">
    <div className="relative flex-1">
      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input
        type="text" value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
      />
    </div>
    <div className="relative sm:w-48 lg:w-56">
      <SlidersHorizontal size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <select value={dept} onChange={(e) => onDept(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition cursor-pointer appearance-none text-gray-700"
        style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}>
        <option value="">All Departments</option>
        {departments.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
    </div>
  </div>
);
 
export default SearchBarAndFilter;