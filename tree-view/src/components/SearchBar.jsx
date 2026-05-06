import React, { useState } from 'react';
import './SearchBar.css';

/**
 * Search bar with real-time filtering and match count.
 */
const SearchBar = ({ searchTerm, onSearchChange, matchCount }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`search-bar ${isFocused ? 'search-bar--focused' : ''}`}>
      <div className="search-bar__icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <input
        id="search-input"
        type="text"
        className="search-bar__input"
        placeholder="Search nodes..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {searchTerm && (
        <div className="search-bar__meta">
          <span className="search-bar__count">
            {matchCount} match{matchCount !== 1 ? 'es' : ''}
          </span>
          <button className="search-bar__clear" onClick={() => onSearchChange('')} aria-label="Clear search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
