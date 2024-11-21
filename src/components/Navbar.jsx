import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Navbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <nav className="bg-teal-500 p-4 flex justify-between items-center text-white">
      <Link to="/" className="text-2xl font-bold">HistoryHub</Link>
      <div className="space-x-4 flex items-center">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/create-post" className="hover:underline">Create New Post</Link>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 rounded text-black"
        />
      </div>
    </nav>
  );
};

export default Navbar;