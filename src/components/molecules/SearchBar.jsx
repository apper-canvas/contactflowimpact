import { useState } from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search...",
  className,
  debounceMs = 300 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);

  const handleSearch = (value) => {
    setSearchTerm(value);
    
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      onSearch(value);
    }, debounceMs);
    
    setDebounceTimer(timer);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="h-4 w-4 text-neutral-400" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10 pr-10"
      />
      {searchTerm && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-neutral-50 rounded-r-lg transition-colors duration-200"
          type="button"
        >
          <ApperIcon name="X" className="h-4 w-4 text-neutral-400 hover:text-neutral-600" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;