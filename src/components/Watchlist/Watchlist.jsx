import React, { useState, useEffect } from 'react';
import MovieCard from '../MovieCard/MovieCard';

const Watchlist = ({ onMovieClick }) => {
  const [savedMovies, setSavedMovies] = useState([]);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('cinevault_watchlist') || '[]');
    setSavedMovies(list);
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto px-20 py-12 min-h-[60vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Watchlist</h1>
        <p className="text-neutral-400">You have {savedMovies.length} movies saved.</p>
      </div>

      {savedMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {savedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-neutral-800 rounded-xl bg-neutral-900/50">
          <h3 className="text-xl text-white mb-2">Your watchlist is empty</h3>
          <p className="text-neutral-500">Discover movies and click "+ Watchlist" to add them here.</p>
        </div>
      )}
    </div>
  );
};

export default Watchlist;