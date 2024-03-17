import React, { useState, useEffect } from 'react';

const TableSearch = ({ initialSearchTerm = '', initialFilter = 'all', onSearch }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filter, setFilter] = useState(initialFilter);

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
    setFilter(initialFilter);
  }, [initialSearchTerm, initialFilter]);

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
              placeholder="Find a token by ID or trait" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <select 
          className="select select-bordered join-item"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="tokenId">Token ID</option>
          <option value="trait">Trait</option>
        </select>
        <div className="indicator">
          <button type="submit" className="btn join-item">Search</button>
        </div>
      </div>
    </form>
  );
};

export default TableSearch;
