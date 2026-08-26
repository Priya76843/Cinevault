const Hero = ({ movie, onMovieClick }) => {
  // ==========================================
  // DEFAULT HERO BACKDROP
  // ==========================================
  const defaultBanner =
    'https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg';

  // ==========================================
  // FALLBACK MOVIE
  // ==========================================
  const displayMovie = movie || {
    id: 'tt0816692',
    title: 'INTERSTELLAR',
    genre: 'Adventure',
    runtime: '169 min',
    year: '2014',
    rating: '8.7',
    director: 'Christopher Nolan',
    plot: "In the near future around the American Midwest, Cooper, an ex-science engineer and pilot, is tied to his farming land with his daughter Murph and son Tom. As devastating sandstorms ravage Earth's crops, the people of Earth...",
    poster:
      'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    banner: defaultBanner,
  };

  // ==========================================
  // WATCH TRAILER
  // ==========================================
  const handleWatchTrailer = () => {
    const query = encodeURIComponent(
      `${displayMovie.title} trailer`
    );

    window.open(
      `https://www.youtube.com/results?search_query=${query}`,
      '_blank'
    );
  };

  // ==========================================
  // MORE INFO
  // ==========================================
  const handleMoreInfo = () => {
    if (onMovieClick) {
      onMovieClick(displayMovie);
    }
  };

  // ==========================================
  // BACKGROUND IMAGE
  // ==========================================
  const bgImage =
    displayMovie.banner &&
    displayMovie.banner !== displayMovie.poster
      ? displayMovie.banner
      : defaultBanner;

  return (
    <section
      id="home"
      className="
        relative
        w-full
        max-w-[1440px]
        h-[680px]
        mx-auto
        overflow-hidden
        bg-cinedark
      "
    >
      {/* ==========================================
          HERO BACKGROUND
      =========================================== */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            inset-0
            bg-cover
            bg-top
            animate-heroZoom
            will-change-transform
          "
          style={{
            backgroundImage: `url('${bgImage}')`,
          }}
        />
      </div>

      {/* ==========================================
          LEFT DARK GRADIENT
      =========================================== */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-cinedark
          via-cinedark/80
          to-transparent
          z-[1]
        "
      />

      {/* ==========================================
          BOTTOM DARK GRADIENT
      =========================================== */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-cinedark
          via-transparent
          to-transparent
          z-[1]
        "
      />

      {/* ==========================================
          EXTRA IMAGE DARKNESS
      =========================================== */}
      <div
        className="
          absolute
          inset-0
          bg-black/10
          z-[1]
        "
      />

      {/* ==========================================
          HERO CONTENT
      =========================================== */}
      <div
        className="
          relative
          h-full
          flex
          flex-col
          justify-between
          px-20
          py-16
          z-10
        "
      >
        {/* ========================================
            TOP / META SECTION
        ========================================= */}
        <div
          className="
            flex
            flex-col
            gap-5
            mt-16
            max-w-[640px]
          "
        >
          {/* ======================================
              EYEBROW + META
          ====================================== */}
          <div className="flex items-center gap-3">
            <div className="bg-[#FFB800] px-3 py-1 rounded">
              <span
                className="
                  text-[11px]
                  font-bold
                  text-black
                  tracking-wider
                "
              >
                CINEVAULT CHOICE
              </span>
            </div>

            <span
              className="
                text-[13px]
                font-medium
                text-neutral-300
              "
            >
              {displayMovie.genre || 'Adventure'} •{' '}
              {displayMovie.runtime || '169 min'} •{' '}
              {displayMovie.year || '2014'}
            </span>
          </div>

          {/* ======================================
              TITLE
          ====================================== */}
          <h1
            className="
              text-[64px]
              font-black
              text-white
              uppercase
              leading-none
              tracking-tight
              m-0
              truncate
            "
          >
            {displayMovie.title}
          </h1>

          {/* ======================================
              RATING + DIRECTOR
          ====================================== */}
          <div className="flex items-center gap-3">
            {displayMovie.rating &&
              displayMovie.rating !== 'N/A' && (
                <div className="flex items-center gap-1.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M7 0.583L8.98 4.594L13.417 5.239L10.208 8.365L10.965 12.784L7 10.699L3.035 12.784L3.792 8.365L0.583 5.239L5.02 4.594L7 0.583Z"
                      fill="#FFB800"
                    />
                  </svg>

                  <span
                    className="
                      text-[14px]
                      font-semibold
                      text-white
                    "
                  >
                    {displayMovie.rating}
                  </span>
                </div>
              )}

            <span className="text-neutral-600 text-[13px]">
              |
            </span>

            <span
              className="
                text-[13px]
                font-medium
                text-neutral-400
              "
            >
              Directed by{' '}
              {displayMovie.director || 'Unknown'}
            </span>
          </div>

          {/* ======================================
              PLOT
          ====================================== */}
          <p
            className="
              text-[15px]
              text-neutral-300
              leading-relaxed
              m-0
              max-w-[560px]
              line-clamp-3
            "
          >
            {displayMovie.plot ||
              displayMovie.overview ||
              'Discover this movie on CineVault.'}
          </p>
        </div>

        {/* ========================================
            BOTTOM BUTTONS
        ========================================= */}
        <div className="flex items-center gap-3">
          {/* ======================================
              WATCH TRAILER
          ====================================== */}
          <button
            type="button"
            onClick={handleWatchTrailer}
            className="
              flex
              items-center
              gap-2
              bg-[#FFB800]
              text-black
              px-6
              py-3
              rounded-lg
              font-semibold
              text-[15px]
              hover:bg-yellow-400
              hover:scale-[1.03]
              active:scale-95
              transition-all
              duration-300
              cursor-pointer
            "
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="black"
            >
              <path d="M8 5v14l11-7z" />
            </svg>

            Watch Trailer
          </button>

          {/* ======================================
              MORE INFO
          ====================================== */}
          <button
            type="button"
            onClick={handleMoreInfo}
            className="
              flex
              items-center
              gap-2
              bg-neutral-800/80
              hover:bg-neutral-700
              hover:scale-[1.03]
              active:scale-95
              text-white
              border
              border-neutral-700/60
              px-6
              py-3
              rounded-lg
              font-semibold
              text-[15px]
              transition-all
              duration-300
              cursor-pointer
              backdrop-blur-sm
            "
          >
            More Info
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;