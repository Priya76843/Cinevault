//import React from 'react';
import MovieCard from '../MovieCard/MovieCard';

const SearchResults = ({
  query = '',
  results = [],
  onMovieClick,
  onCompare,
  compareList = [],
  onBack,

  // ⭐ FAVORITE PROPS
  onFavorite,
  isFavorite,
}) => {
  return (
    <main className="flex-1 max-w-[1440px] w-full mx-auto px-20 py-12">

      {/* Header */}
      <div className="mb-8">

        <button
          onClick={onBack}
          className="text-[13px] text-neutral-400 hover:text-[#FFB800] mb-3 transition-colors flex items-center gap-1 cursor-pointer"
        >
          ← Back to Home
        </button>

        <h1 className="text-[28px] font-bold text-white m-0 tracking-tight">
          Search Results for "{query}"
        </h1>

        <p className="text-[13px] text-neutral-500 mt-1.5 m-0">
          Showing {results.length} match
          {results.length !== 1 ? 'es' : ''} within the archive.
        </p>

      </div>

      {/* 6-Column Grid */}
      {results.length > 0 ? (

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">

          {results.map((movie, index) => (

            <MovieCard
              key={
                movie.id ||
                movie.imdbID ||
                index
              }

              movie={movie}

              onClick={onMovieClick}

              onCompare={onCompare}

              compareList={compareList}

              // ⭐ FAVORITE SYNC
              onFavorite={onFavorite}

              isFavorite={
                isFavorite
                  ? isFavorite(movie)
                  : false
              }
            />

          ))}

        </div>

      ) : (

        <div className="py-24 text-center">

          <p className="text-xl text-neutral-400 m-0">
            No movies found
          </p>

          <p className="text-sm text-neutral-600 mt-2 m-0">
            Try a different title, genre, or keyword
          </p>

        </div>

      )}

      {/* Bottom Help Text */}
      <div className="mt-20 flex items-center justify-center gap-2 text-neutral-500 text-xs">

        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
          />

          <line
            x1="12"
            y1="16"
            x2="12"
            y2="12"
          />

          <line
            x1="12"
            y1="8"
            x2="12.01"
            y2="8"
          />
        </svg>

        <span>
          Don't see what you're looking for?
          Try searching by actor, director,
          or different tags.
        </span>

      </div>

    </main>
  );
};

export default SearchResults;