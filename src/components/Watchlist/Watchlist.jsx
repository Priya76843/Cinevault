import React, { useState, useEffect } from 'react';
import MovieCard from '../MovieCard/MovieCard';

const Watchlist = ({ onMovieClick, onCompare, compareList }) => {
  const [savedMovies, setSavedMovies] = useState([]);

  useEffect(() => {
    const loadSavedMovies = () => {
      try {
        const list = JSON.parse(
          localStorage.getItem('cinevault_favorites') ||
          localStorage.getItem('cinevault_watchlist') ||
          '[]'
        );
        setSavedMovies(list);
      } catch {
        setSavedMovies([]);
      }
    };

    loadSavedMovies();

    // Listen for custom event when heart is clicked
    window.addEventListener('cinevault-favorites-updated', loadSavedMovies);
    return () => window.removeEventListener('cinevault-favorites-updated', loadSavedMovies);
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto px-20 py-12 min-h-[60vh] text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3 m-0">
          <span className="text-red-500">♥</span> My Saved Favorites
        </h1>
        <p className="text-neutral-400 text-sm mt-1.5 m-0">
          You have {savedMovies.length} movie{savedMovies.length !== 1 ? 's' : ''} saved in your library.
        </p>
      </div>

      {savedMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {savedMovies.map((movie, index) => (
            <MovieCard
              key={movie.id || movie.imdbID || index}
              movie={movie}
              onClick={onMovieClick}
              onCompare={onCompare}
              compareList={compareList}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-neutral-800/80 rounded-2xl bg-neutral-950/50">
          <span className="text-4xl mb-3 block">💔</span>
          <h3 className="text-xl text-white font-bold mb-2">No favorites saved yet</h3>
          <p className="text-neutral-500 text-sm max-w-md mx-auto">
            Hover over any movie poster and click the heart icon, or click "+ Watchlist" in the movie details modal to save them here!
          </p>
        </div>
      )}
    </div>
  );
};

export default Watchlist;