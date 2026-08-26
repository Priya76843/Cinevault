import React, { useState, useEffect } from 'react';

const FAVORITES_KEY = 'cinevault_favorites';

const MovieCard = ({
  movie,
  onClick,
  onFavorite,
}) => {
  const movieId = movie.id || movie.imdbID;

  const [isFavorite, setIsFavorite] = useState(false);

  // ==========================================
  // CHECK FAVORITE STATUS
  // ==========================================
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(FAVORITES_KEY) || '[]'
      );

      setIsFavorite(
        saved.some(
          (item) =>
            (item.id || item.imdbID) === movieId
        )
      );
    } catch {
      setIsFavorite(false);
    }
  }, [movieId]);

  // ==========================================
  // ❤️ FAVORITE BUTTON
  // ==========================================
  const handleFavoriteClick = (e) => {
    e.stopPropagation();

    // Let App.jsx handle the actual favorite logic
    if (onFavorite) {
      onFavorite(movie);
    }

    // Immediately update heart UI
    setIsFavorite((prev) => !prev);
  };

  return (
    <div
      className="cursor-pointer group transition-transform hover:-translate-y-1 relative"
      onClick={() => onClick && onClick(movie)}
    >

      {/* ======================================
          POSTER
      ======================================= */}
      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-neutral-900">

        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              'https://via.placeholder.com/300x450?text=No+Poster';
          }}
        />

        {/* ====================================
            ❤️ HEART
        ==================================== */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          title={
            isFavorite
              ? 'Remove favorite'
              : 'Add favorite'
          }
          aria-label={
            isFavorite
              ? `Remove ${movie.title} from favorites`
              : `Add ${movie.title} to favorites`
          }
          className={`
            absolute
            top-2
            right-2
            w-8
            h-8
            rounded-full
            flex
            items-center
            justify-center
            z-20
            cursor-pointer
            transition-all
            duration-300
            shadow-md

            ${
              isFavorite
                ? 'bg-black/75 text-red-500 opacity-100 scale-105'
                : 'bg-black/70 text-white opacity-0 group-hover:opacity-100 hover:text-red-400 hover:scale-110'
            }
          `}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={
              isFavorite
                ? 'currentColor'
                : 'none'
            }
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* ====================================
            RATING
        ==================================== */}
        {movie.rating &&
          movie.rating !== 'N/A' && (
            <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1 text-[11px] font-semibold text-white z-10">

              <svg
                width="10"
                height="10"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M7 0.583L8.98 4.594L13.417 5.239L10.208 8.365L10.965 12.784L7 10.699L3.035 12.784L3.792 8.365L0.583 5.239L5.02 4.594L7 0.583Z"
                  fill="#FFB800"
                />
              </svg>

              <span>
                {movie.rating}
              </span>

            </div>
          )}

      </div>

      {/* ======================================
          MOVIE INFORMATION
      ======================================= */}
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