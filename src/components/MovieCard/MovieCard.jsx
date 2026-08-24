import React from 'react';

const MovieCard = ({ movie, onClick, onCompare, compareList = [] }) => {
  const movieId = movie.id || movie.imdbID;
  const isComparing = compareList.some((m) => (m.id || m.imdbID) === movieId);

  const handleCompareClick = (e) => {
    e.stopPropagation(); // Prevents opening detail modal
    if (onCompare) {
      onCompare(movie);
    }
  };

  return (
    <div
      className="cursor-pointer group transition-transform hover:-translate-y-1 relative"
      onClick={() => onClick && onClick(movie)}
    >
      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-neutral-900">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
          }}
        />

        {/* ALWAYS VISIBLE COMPARE BUTTON */}
        <button
          type="button"
          onClick={handleCompareClick}
          className={`absolute top-2 left-2 px-2.5 py-1 rounded text-[11px] font-bold shadow-lg z-20 cursor-pointer border ${
            isComparing
              ? 'bg-[#FFB800] text-black border-[#FFB800]'
              : 'bg-black/90 text-white border-neutral-700 hover:bg-[#FFB800] hover:text-black hover:border-[#FFB800]'
          }`}
        >
          {isComparing ? '✓ Comparing' : '+ Compare'}
        </button>

        {/* Rating Badge */}
        {movie.rating && movie.rating !== 'N/A' && (
          <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1 text-[11px] font-semibold text-white z-10">
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 0.583L8.98 4.594L13.417 5.239L10.208 8.365L10.965 12.784L7 10.699L3.035 12.784L3.792 8.365L0.583 5.239L5.02 4.594L7 0.583Z"
                fill="#FFB800"
              />
            </svg>
            <span>{movie.rating}</span>
          </div>
        )}
      </div>

      <div className="pt-2.5 flex flex-col gap-0.5">
        <span className="text-[11px] text-neutral-500 font-medium">
          {movie.year}
        </span>
        <h3 className="text-sm font-semibold text-white truncate m-0">
          {movie.title}
        </h3>
        <span className="text-[11px] text-[#FFB800] font-medium">
          {movie.genre}
        </span>
      </div>
    </div>
  );
};

export default MovieCard;