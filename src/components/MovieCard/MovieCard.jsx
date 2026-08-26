import  {
  useEffect,
  useState,
} from 'react';

const MovieCard = ({
  movie,
  onClick,
  onFavorite,
  isFavorite = false,
}) => {
  const [heartPop, setHeartPop] =
    useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();

    if (onFavorite) {
      onFavorite(movie);
    }

    // ❤️ HEART POP ANIMATION
    setHeartPop(false);

    requestAnimationFrame(() => {
      setHeartPop(true);
    });
  };

  // Reset animation class
  useEffect(() => {
    if (!heartPop) return;

    const timer = setTimeout(() => {
      setHeartPop(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [heartPop]);

  return (
    <div
      className="
        cursor-pointer
        group
        relative
        transition-all
        duration-300
        hover:-translate-y-2
      "
      onClick={() =>
        onClick && onClick(movie)
      }
    >

      {/* ======================================
          POSTER
      ====================================== */}

      <div
        className="
          relative
          w-full
          aspect-[2/3]
          rounded-lg
          overflow-hidden
          bg-neutral-900
          shadow-lg
          transition-all
          duration-300
          group-hover:shadow-2xl
        "
      >

        <img
          src={movie?.poster}
          alt={
            movie?.title || 'Movie'
          }
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-700
            ease-out
            group-hover:scale-110
          "
          onError={(e) => {
            e.currentTarget.src =
              'https://via.placeholder.com/300x450?text=No+Poster';
          }}
        />

        {/* ====================================
            DARK HOVER OVERLAY
        ==================================== */}

        <div
          className="
            absolute
            inset-0
            bg-black/0
            group-hover:bg-black/10
            transition-all
            duration-300
          "
        />

        {/* ====================================
            HEART
        ==================================== */}

        <button
          type="button"
          onClick={
            handleFavoriteClick
          }
          title={
            isFavorite
              ? 'Remove from watchlist'
              : 'Add to watchlist'
          }
          aria-label={
            isFavorite
              ? `Remove ${
                  movie?.title ||
                  'movie'
                } from watchlist`
              : `Add ${
                  movie?.title ||
                  'movie'
                } to watchlist`
          }
          className={`
            absolute
            top-2
            right-2
            w-9
            h-9
            rounded-full
            flex
            items-center
            justify-center
            z-20
            cursor-pointer
            shadow-md
            transition-all
            duration-300

            ${
              isFavorite
                ? 'bg-black/80 text-red-500 opacity-100 scale-105'
                : 'bg-black/70 text-white opacity-0 group-hover:opacity-100 hover:text-red-400 hover:scale-110'
            }

            ${
              heartPop
                ? 'animate-heart-pop'
                : ''
            }
          `}
        >

          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill={
              isFavorite
                ? 'currentColor'
                : 'none'
            }
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>

        </button>

        {/* ====================================
            RATING
        ==================================== */}

        {movie?.rating &&
          movie.rating !== 'N/A' && (

            <div className="
              absolute
              bottom-2
              right-2
              bg-black/75
              backdrop-blur-sm
              px-1.5
              py-0.5
              rounded
              flex
              items-center
              gap-1
              text-[11px]
              font-semibold
              text-white
              z-10
            ">

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
      ====================================== */}

      <div className="pt-2.5 flex flex-col gap-0.5">

        <span className="text-[11px] text-neutral-500 font-medium">
          {movie?.year}
        </span>

        <h3 className="text-sm font-semibold text-white truncate m-0">
          {movie?.title}
        </h3>

        <span className="text-[11px] text-[#FFB800] font-medium">
          {movie?.genre}
        </span>

      </div>

    </div>
  );
};

export default MovieCard;