import {
  useEffect,
} from 'react';

const getInitials = (name) => {
  if (!name) return '';

  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

const MovieModal = ({
  movie,
  onClose,
  onCompare,
  compareList = [],
  onWatchlist,
  isInWatchlist = false,
}) => {

  const movieId =
    movie?.id ||
    movie?.imdbID;

  // =====================================================
  // LOCK BODY SCROLL
  // =====================================================

  useEffect(() => {
    document.body.style.overflow =
      'hidden';

    return () => {
      document.body.style.overflow =
        'unset';
    };
  }, []);

  // =====================================================
  // ESCAPE KEY
  // =====================================================

  useEffect(() => {

    const handleKeyDown = (
      event
    ) => {
      if (
        event.key === 'Escape'
      ) {
        onClose();
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };

  }, [onClose]);

  if (!movie) return null;

  // =====================================================
  // COMPARE STATUS
  // =====================================================

  const isComparing =
    compareList.some(
      (m) =>
        (m.id ||
          m.imdbID) ===
        movieId
    );

  // =====================================================
  // TRAILER
  // =====================================================

  const handleWatchTrailer =
    () => {

      const query =
        encodeURIComponent(
          `${movie.title} trailer`
        );

      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        '_blank'
      );
    };

  // =====================================================
  // WATCHLIST
  // SAME APP STATE AS HEART
  // =====================================================

  const handleToggleWatchlist =
    () => {

      if (onWatchlist) {
        onWatchlist(movie);
      }

    };

  // =====================================================
  // COMPARE
  // =====================================================

  const handleCompare = () => {

    if (onCompare) {
      onCompare(movie);
    }

  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/80
        backdrop-blur-sm
        p-4
        md:p-10
        animate-modal-backdrop
      "
      onClick={onClose}
    >

      {/* ==============================================
          CLOSE BUTTON
      ============================================== */}

      <button
        onClick={onClose}
        className="
          fixed
          top-6
          right-6
          md:top-10
          md:right-10
          z-[110]
          text-gray-400
          hover:text-white
          bg-black/60
          hover:bg-black/80
          p-2.5
          rounded-full
          transition-all
        "
        aria-label="Close modal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line
            x1="18"
            y1="6"
            x2="6"
            y2="18"
          />
          <line
            x1="6"
            y1="6"
            x2="18"
            y2="18"
          />
        </svg>
      </button>

      {/* ==============================================
          MODAL
      ============================================== */}

      <div
        className="
          relative
          w-full
          max-w-4xl
          max-h-[90vh]
          bg-[#161616]
          text-white
          rounded-xl
          shadow-2xl
          border
          border-white/10
          overflow-y-auto
          custom-scrollbar
          p-6
          md:p-8
          animate-modal-content
        "
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <div className="
          flex
          flex-col
          md:flex-row
          gap-6
          md:gap-8
        ">

          {/* ==========================================
              LEFT COLUMN
          ========================================== */}

          <div className="
            w-full
            md:w-64
            flex-shrink-0
            flex
            flex-col
            gap-3
          ">

            {/* POSTER */}

            <div className="
              w-full
              overflow-hidden
              rounded-lg
              shadow-md
              aspect-[2/3]
              bg-neutral-900
              border
              border-white/5
            ">

              <img
                src={
                  movie.poster ||
                  movie.posterUrl
                }
                alt={
                  movie.title
                }
                className="
                  w-full
                  h-full
                  object-cover
                "
              />

            </div>

            {/* TRAILER */}

            <button
              type="button"
              onClick={
                handleWatchTrailer
              }
              className="
                w-full
                mt-2
                bg-[#f3cb15]
                hover:bg-[#e0ba10]
                text-black
                font-bold
                py-3
                px-4
                rounded-lg
                flex
                items-center
                justify-center
                gap-2
                transition-all
                cursor-pointer
              "
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="black"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>

              <span>
                Watch Trailer
              </span>

            </button>

            {/* WATCHLIST */}

            <button
              type="button"
              onClick={
                handleToggleWatchlist
              }
              className={`
                w-full
                py-3
                px-4
                rounded-lg
                flex
                items-center
                justify-center
                gap-2
                transition-all
                cursor-pointer
                font-semibold

                ${
                  isInWatchlist
                    ? 'bg-[#f3cb15]/10 text-[#f3cb15] border border-[#f3cb15]/50'
                    : 'bg-[#2a2a2a] hover:bg-[#333333] text-white border border-transparent'
                }
              `}
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={
                  isInWatchlist
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

              <span>
                {isInWatchlist
                  ? 'In Watchlist'
                  : 'Watchlist'}
              </span>

            </button>

            {/* COMPARE */}

            <button
              type="button"
              onClick={
                handleCompare
              }
              className={`
                w-full
                py-3
                px-4
                rounded-lg
                flex
                items-center
                justify-center
                gap-2
                transition-all
                cursor-pointer
                font-semibold

                ${
                  isComparing
                    ? 'bg-[#f3cb15] text-black'
                    : 'bg-[#2a2a2a] hover:bg-[#333333] text-white'
                }
              `}
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
              </svg>

              <span>
                {isComparing
                  ? 'Comparing...'
                  : 'Compare'}
              </span>

            </button>

          </div>

          {/* ==========================================
              RIGHT COLUMN
          ========================================== */}

          <div className="
            flex-1
            flex
            flex-col
            pt-1
          ">

            {/* TITLE */}

            <h1 className="
              text-3xl
              md:text-4xl
              font-extrabold
              tracking-tight
              uppercase
              m-0
              leading-none
            ">
              {movie.title}
            </h1>

            {/* META */}

            <div className="
              flex
              items-center
              flex-wrap
              gap-x-3
              gap-y-2
              text-sm
              text-gray-400
              font-medium
              mt-4
            ">

              <span>
                {movie.year}
              </span>

              <span className="text-gray-600">
                |
              </span>

              <span className="
                border
                border-gray-600
                px-1.5
                py-0.5
                rounded
                text-xs
                tracking-wider
              ">
                {movie.ageRating ||
                  movie.certification ||
                  'PG-13'}
              </span>

              <span className="text-gray-600">
                |
              </span>

              <span>
                {movie.runtime ||
                  movie.duration}
              </span>

              <span className="text-gray-600">
                |
              </span>

              <span className="
                flex
                items-center
                gap-1.5
                text-[#f3cb15]
                font-bold
              ">

                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="#f3cb15"
                >
                  <path d="M7 0.583L8.98 4.594L13.417 5.239L10.208 8.365L10.965 12.784L7 10.699L3.035 12.784L3.792 8.365L0.583 5.239L5.02 4.594L7 0.583Z" />
                </svg>

                {movie.rating}

              </span>

            </div>

            {/* GENRES */}

            <div className="
              flex
              flex-wrap
              gap-2
              mt-4
            ">

              {movie.genres?.map(
                (genre, idx) => (

                  <span
                    key={idx}
                    className="
                      bg-[#242424]
                      text-gray-300
                      text-xs
                      px-3
                      py-1.5
                      rounded-md
                      font-medium
                    "
                  >
                    {genre}
                  </span>

                )
              )}

            </div>

            {/* PLOT */}

            <p className="
              text-gray-300
              text-[14px]
              leading-relaxed
              mt-5
            ">
              {movie.plot ||
                movie.overview}
            </p>

            {/* CAST */}

            <div className="mt-6">

              <h3 className="
                text-[15px]
                font-bold
                text-white
                mb-4
              ">
                Cast & Crew
              </h3>

              <div className="
                flex
                flex-wrap
                gap-x-8
                gap-y-4
                mb-5
              ">

                {movie.cast
                  ?.slice(0, 3)
                  .map(
                    (
                      actor,
                      index
                    ) => (

                      <div
                        key={index}
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <div className="
                          w-11
                          h-11
                          rounded-full
                          bg-[#2a2a2a]
                          text-gray-300
                          font-bold
                          flex
                          items-center
                          justify-center
                          text-sm
                          border
                          border-white/5
                          flex-shrink-0
                        ">
                          {getInitials(
                            actor.name
                          )}
                        </div>

                        <div className="
                          flex
                          flex-col
                        ">

                          <span className="
                            text-[14px]
                            font-semibold
                            text-white
                          ">
                            {actor.name}
                          </span>

                          <span className="
                            text-[12px]
                            text-gray-400
                          ">
                            {actor.role ||
                              'Actor'}
                          </span>

                        </div>

                      </div>

                    )
                  )}

              </div>

              {/* DIRECTOR */}

              <div className="
                text-[14px]
                text-gray-300
              ">
                Director:{' '}

                <span className="
                  text-[#f3cb15]
                  font-semibold
                ">
                  {movie.director ||
                    'Unknown'}
                </span>
              </div>

            </div>

            {/* MORE LIKE THIS */}

            {movie.similarMovies &&
              movie.similarMovies.length >
                0 && (

                <div className="
                  mt-8
                  border-t
                  border-white/10
                  pt-6
                ">

                  <h3 className="
                    text-[15px]
                    font-bold
                    text-white
                    mb-4
                  ">
                    More like this
                  </h3>

                  <div className="
                    grid
                    grid-cols-4
                    gap-3
                  ">

                    {movie.similarMovies
                      .slice(0, 4)
                      .map(
                        (
                          simMovie,
                          idx
                        ) => (

                          <div
                            key={idx}
                            className="
                              aspect-[2/3]
                              rounded-md
                              overflow-hidden
                              bg-[#242424]
                              hover:opacity-80
                              transition
                              cursor-pointer
                            "
                          >

                            <img
                              src={
                                simMovie.posterUrl ||
                                simMovie.poster
                              }
                              alt={
                                simMovie.title
                              }
                              className="
                                w-full
                                h-full
                                object-cover
                              "
                            />

                          </div>

                        )
                      )}

                  </div>

                </div>

              )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default MovieModal;