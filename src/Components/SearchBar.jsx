import React from "react";

function SearchBar({ searchTerm, setSearchTerm, handleSearch }) {
  return (
    <form onSubmit={handleSearch} className="flex mb-4 w-full max-w-lg">
      <input
        type="text"
        placeholder="Search by city name"
        className="rounded-l-lg border border-purple-300 px-4 py-2 w-full focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        type="submit"
        className="rounded-r-lg bg-purple-600 text-white px-4 py-2 hover:bg-purple-700 focus:outline-none"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;
