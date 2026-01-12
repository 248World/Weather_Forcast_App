import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch, placeholder, tip }) => {
  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          <i className="fas fa-search"></i> Search
        </button>
      </form>
      <p className="search-tip">
        <i className="fas fa-info-circle"></i> {tip}
      </p>
    </div>
  );
};

export default SearchBar;