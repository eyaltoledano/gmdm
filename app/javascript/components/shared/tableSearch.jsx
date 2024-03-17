// tableSearch.js
import React, { useState } from 'react';

const TableSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm, filter);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form space-x-2">
      <div className="join">
        <div>
          <div>
            <input 
              type="text" 
              className="input input-bordered join-item search-input" 
              placeholder="Find a token by ID" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <select 
          className="select select-bordered join-item"
          value={filter} // Use value prop instead of selected on option
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="tokenId">Token ID</option>
          <option value="trait">Trait</option>
        </select>
        <div className="indicator">
          <span className="indicator-item badge badge-secondary">new</span> 
          <button type="submit" className="btn join-item">Search</button>
        </div>
      </div>
    </form>
  );
};

export default TableSearch;
