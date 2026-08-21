import React from 'react';

const ComingSoon = ({ movies }) => {
  return (
    <div className="mb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white m-0">Coming Soon</h2>
      </div>

      {/* Cards Grid - 3 equal cards spanning full width */}
      <div className="grid grid-cols-3 gap-5">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex gap-4 bg-neutral-950 border border-neutral-900 rounded-xl p-4 cursor-pointer hover:border-cineyellow hover:bg-neutral-900 transition-all"
          >
            {/* Poster - Larger, portrait orientation */}
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-24 h-32 object-cover rounded-lg flex-shrink-0"
            />

            {/* Info */}
            <div className="flex flex-col gap-2 overflow-hidden justify-center">
              {/* Release Date Badge - Small yellow text */}
              <span className="text-[10px] text-cineyellow font-bold tracking-wider uppercase">
                RELEASING {movie.releaseDate}
              </span>

              {/* Title - Larger, bold white */}
              <h3 className="text-lg font-bold text-white m-0 leading-tight">
                {movie.title}
              </h3>

              {/* Description - 2 lines truncated */}
              <p className="text-[13px] text-neutral-400 leading-relaxed m-0 line-clamp-2">
                {movie.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComingSoon;