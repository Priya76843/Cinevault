import React, { useState } from 'react';

const MovieModal = ({ movie, onClose }) => {
  if (!movie) return null;

  const movieId = movie.id || movie.imdbID;

  // Check if movie is already in watchlist on open
  const [inWatchlist, setInWatchlist] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cinevault_watchlist') || '[]');
      return saved.some((item) => (item.id || item.imdbID) === movieId);
    } catch {
      return false;
    }
  });

  // Toggle watchlist in localStorage
  const handleToggleWatchlist = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('cinevault_watchlist') || '[]');
      let updated;

      if (inWatchlist) {
        // Remove from watchlist
        updated = saved.filter((item) => (item.id || item.imdbID) !== movieId);
        setInWatchlist(false);
      } else {
        // Add full movie object so Watchlist page can render it
        updated = [...saved, movie];
        setInWatchlist(true);
      }

      localStorage.setItem('cinevault_watchlist', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to update watchlist:', err);
    }
  };

  // Opens YouTube trailer in new tab
  const handleWatchTrailer = () => {
    const query = encodeURIComponent(`${movie.title} trailer`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[840px] bg-[#0c0c10] rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Image */}
        <div className="relative w-full h-[240px] flex-shrink-0">
          <img
            src={movie.banner || movie.poster}
            alt="Backdrop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c10] via-transparent to-black/30"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-[#FFB800] hover:text-black text-white rounded-full transition-colors z-10 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-col md:flex-row gap-8 px-10 pb-10 pt-2 overflow-y-auto no-scrollbar">
          
          {/* Left Column: Poster & Buttons */}
          <div className="w-full md:w-[200px] flex-shrink-0 flex flex-col gap-3">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg -mt-16 relative z-10 border border-neutral-800"
            />

            {/* Watch Trailer */}
            <button
              onClick={handleWatchTrailer}
              className="w-full bg-[#FFB800] text-black font-bold text-[13px] py-2.5 rounded hover:bg-yellow-400 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="black">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Trailer
            </button>

            {/* Watchlist Toggle */}
            <button
              onClick={handleToggleWatchlist}
              className={`w-full font-semibold text-[13px] py-2.5 rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                inWatchlist
                  ? 'bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/50 font-bold'
                  : 'bg-transparent border border-neutral-700 text-white hover:bg-neutral-800'
              }`}
            >
              {inWatchlist ? '✓ In Watchlist' : '+ Watchlist'}
            </button>
          </div>

          {/* Right Column: Details */}
          <div className="flex-1 flex flex-col pt-2">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight m-0">
              {movie.title}
            </h2>

            <div className="flex items-center gap-2.5 text-[13px] text-neutral-400 mt-2 font-medium">
              <span>{movie.year}</span>
              <span className="text-neutral-700">|</span>
              <span>{movie.ageRating || 'PG-13'}</span>
              <span className="text-neutral-700">|</span>
              <span>{movie.runtime}</span>
              <span className="text-neutral-700">|</span>
              <div className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="#FFB800">
                  <path d="M7 0.583L8.98 4.594L13.417 5.239L10.208 8.365L10.965 12.784L7 10.699L3.035 12.784L3.792 8.365L0.583 5.239L5.02 4.594L7 0.583Z" />
                </svg>
                <span className="text-[#FFB800]">{movie.rating}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {movie.genres?.map((genre) => (
                <span
                  key={genre}
                  className="bg-[#1a1a24] text-neutral-300 text-[11px] px-2.5 py-1 rounded font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>

            <p className="text-[13px] text-neutral-400 leading-relaxed mt-5 m-0">
              {movie.plot}
            </p>

            <div className="mt-6">
              <h3 className="text-white text-[13px] font-bold mb-3">Cast & Crew</h3>
              <div className="flex flex-wrap gap-6">
                {movie.cast?.map((actor, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img
                      src={actor.avatar}
                      alt={actor.name}
                      className="w-10 h-10 rounded-full object-cover bg-neutral-800"
                    />
                    <div className="flex flex-col">
                      <span className="text-[12px] font-semibold text-white">
                        {actor.name}
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        {actor.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 text-[12px]">
              <span className="text-white font-semibold">Director: </span>
              <span className="text-neutral-400">{movie.director}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;