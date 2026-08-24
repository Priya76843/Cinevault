import React, { useState } from 'react';

const Navbar = ({
  onSearch,
  onViewChange,
  currentView = 'home',
  toggleTheme,
  isLightMode,
}) => {
  const [activeLink, setActiveLink] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');

  // Navigation Links including Watchlist
  const navLinks = [
    { name: 'Home', id: 'home', type: 'scroll' },
    { name: 'Trending', id: 'trending', type: 'scroll' },
    { name: 'Top Rated', id: 'top-rated', type: 'scroll' },
    { name: 'Genres', id: 'genres', type: 'scroll' },

  ];

  const handleNavClick = (link) => {
    setActiveLink(link.name);

    if (link.type === 'view') {
      // Switches page view (e.g. to 'watchlist')
      if (onViewChange) onViewChange(link.id);
    } else {
      // Scroll link ('home', 'trending', 'top-rated', 'genres')
      if (currentView !== 'home' && onViewChange) {
        onViewChange('home');
        // Small delay to allow home page to render before scrolling
        setTimeout(() => {
          const section = document.getElementById(link.id);
          if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        const section = document.getElementById(link.id);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <nav className="bg-cinedark/95 backdrop-blur-md border-b border-neutral-900 sticky top-0 z-50 px-10 py-4 w-full transition-colors">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-10">
        
        {/* Logo Section */}
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => handleNavClick({ name: 'Home', id: 'home', type: 'scroll' })}
        >
          <div className="w-8 h-8 bg-[#FFB800] rounded-md flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="black">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-white text-xl font-bold tracking-wide">
            CineVault
          </span>
        </div>

        {/* Nav Links */}
        <ul className="flex list-none gap-8 flex-1 justify-center m-0 p-0">
          {navLinks.map((link) => {
            const isActive =
              (currentView === 'watchlist' && link.id === 'watchlist') ||
              (currentView === 'home' && activeLink === link.name);

            return (
              <li
                key={link.name}
                onClick={() => handleNavClick(link)}
                className={`relative cursor-pointer text-[15px] font-medium transition-colors ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#FFB800] rounded-full" />
                )}
              </li>
            );
          })}
        </ul>

        {/* Action Group: Theme Toggle & Search Form */}
        <div className="flex items-center gap-3">
          
          {/* Light / Dark Mode Toggle Button */}
          {toggleTheme && (
            <button
              type="button"
              onClick={toggleTheme}
              title={isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              className="w-9 h-9 flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-lg text-base hover:border-[#FFB800] transition-colors cursor-pointer"
            >
              {isLightMode ? '🌙' : '☀️'}
            </button>
          )}

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2 w-72 focus-within:border-[#FFB800] transition-colors"
          >
            <svg
              className="w-4 h-4 text-neutral-500 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search movies, genres, cast..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-white text-sm w-full placeholder:text-neutral-500"
            />
          </form>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;