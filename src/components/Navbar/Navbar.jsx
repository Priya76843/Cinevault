import React, { useState, useEffect } from 'react';

const Navbar = ({
  onSearch,
  onViewChange,
  currentView = 'home',
  toggleTheme,
  isLightMode,
}) => {
  const [activeLink, setActiveLink] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [favCount, setFavCount] = useState(0);

  // Sync favorites count from localStorage
  useEffect(() => {
    const syncFavorites = () => {
      try {
        const saved = JSON.parse(
          localStorage.getItem('cinevault_favorites') ||
          localStorage.getItem('cinevault_watchlist') ||
          '[]'
        );
        setFavCount(saved.length);
      } catch {
        setFavCount(0);
      }
    };

    syncFavorites();
    window.addEventListener('cinevault-favorites-updated', syncFavorites);
    return () => window.removeEventListener('cinevault-favorites-updated', syncFavorites);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Trending', id: 'trending' },
    { name: 'Top Rated', id: 'top-rated' },
    { name: 'Genres', id: 'genres' },
  ];

  const handleNavClick = (link) => {
    setActiveLink(link.name);

    if (currentView !== 'home' && onViewChange) {
      onViewChange('home');
      setTimeout(() => {
        const section = document.getElementById(link.id);
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      const section = document.getElementById(link.id);
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => handleNavClick({ name: 'Home', id: 'home' })}
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
          {navLinks.map((link) => (
            <li
              key={link.name}
              onClick={() => handleNavClick(link)}
              className={`relative cursor-pointer text-[15px] font-medium transition-colors ${
                activeLink === link.name && currentView === 'home'
                  ? 'text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {link.name}
              {activeLink === link.name && currentView === 'home' && (
                <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#FFB800] rounded-full" />
              )}
            </li>
          ))}
        </ul>

        {/* Right Action Group */}
        <div className="flex items-center gap-3">
          
          {/* 🔴 CLICKABLE HEART FAVORITES BUTTON 🔴 */}
          <button
            type="button"
            onClick={() => onViewChange && onViewChange('watchlist')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
              currentView === 'watchlist'
                ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-md'
                : 'bg-neutral-900 border-neutral-800 text-red-500 hover:border-red-500/50'
            }`}
            title="Click to view saved Favorites"
          >
            <span className="text-sm">♥</span>
            <span className="text-white">{favCount}</span>
          </button>

          {/* Theme Toggle */}
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

          {/* Search Form */}
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