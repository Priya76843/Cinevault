import { useState } from 'react';

import MovieSection from './MovieSection/MovieSection';

import RecommendationSection from './RecommendationSection/RecommendationSection';

const ContentStream = ({
  trending = [],
  popular = [],
  topRated = [],
  comingSoon = [],
  favorites = [],
  onMovieClick,
  onCompare,
  compareList = [],
  onFavorite,
  isFavorite,
  onGenreChange,
}) => {

  const [
    selectedGenre,
    setSelectedGenre,
  ] = useState(null);

  const genres = [
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Sci-Fi',
    'Horror',
    'Romance',
    'Thriller',
  ];

  // =====================================================
  // ALL MOVIES
  // =====================================================

  const allMovies = [
    ...trending,
    ...popular,
    ...topRated,
    ...comingSoon,
  ];

  // =====================================================
  // REMOVE DUPLICATES
  // =====================================================

  const uniqueMovies =
    Array.from(
      new Map(
        allMovies.map(
          (movie) => [
            movie.id ||
              movie.imdbID,
            movie,
          ]
        )
      ).values()
    );

  // =====================================================
  // FILTER BY GENRE
  // =====================================================

  const filterByGenre = (
    movieList
  ) => {

    if (!selectedGenre) {
      return movieList;
    }

    return movieList.filter(
      (movie) => {

        if (
          Array.isArray(
            movie.genres
          ) &&
          movie.genres.length > 0
        ) {
          return movie.genres.some(
            (genre) =>
              genre
                .toLowerCase()
                .includes(
                  selectedGenre.toLowerCase()
                )
          );
        }

        if (movie.genre) {
          return movie.genre
            .toLowerCase()
            .includes(
              selectedGenre.toLowerCase()
            );
        }

        return false;
      }
    );
  };

  // =====================================================
  // GENRE CLICK
  // =====================================================

  const handleGenreClick = (
    genre
  ) => {

    if (
      selectedGenre === genre
    ) {
      setSelectedGenre(null);

      // Tell App that genre was cleared
      onGenreChange?.(null);

      return;
    }

    setSelectedGenre(genre);

    // Tell App that a genre is active
    onGenreChange?.(genre);

    setTimeout(() => {
      const target =
        document.getElementById(
          'genre-results'
        );

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);
  };

  // =====================================================
  // CLEAR GENRE
  // =====================================================

  const handleClearGenre = () => {

    setSelectedGenre(null);

    // Tell App that genre was cleared
    onGenreChange?.(null);

    setTimeout(() => {

      const target =
        document.getElementById(
          'genres'
        );

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }

    }, 100);
  };

  const genreMovies =
    filterByGenre(
      uniqueMovies
    );

  return (
    <section
      className="
        bg-[#080808]
        px-20
        py-10
        max-w-[1440px]
        mx-auto
        text-white
      "
    >

      {/* ==================================================
          SELECTED GENRE
      ================================================== */}

      {selectedGenre ? (

        <div
          id="genre-results"
          className="mb-10 scroll-mt-24"
        >

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-2xl font-bold text-white m-0">
              {selectedGenre} Movies
            </h2>

            <button
              type="button"
              onClick={
                handleClearGenre
              }
              className="
                text-xs
                bg-[#FFB800]
                text-black
                font-bold
                px-4
                py-2
                rounded-lg
                hover:bg-yellow-400
                transition-colors
                cursor-pointer
              "
            >
              Clear Filter ✕
            </button>

          </div>

          {genreMovies.length > 0 ? (

            <MovieSection
              title=""
              movies={genreMovies}
              cols={5}
              onMovieClick={
                onMovieClick
              }
              onCompare={
                onCompare
              }
              compareList={
                compareList
              }
              onFavorite={
                onFavorite
              }
              isFavorite={
                isFavorite
              }
            />

          ) : (

            <div
              className="
                py-20
                text-center
                border
                border-neutral-800
                rounded-2xl
                bg-neutral-950/50
              "
            >

              <div className="text-4xl mb-4">
                🎬
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                No {selectedGenre} Movies Found
              </h3>

              <p className="text-sm text-neutral-500">
                Try selecting another genre.
              </p>

            </div>

          )}

        </div>

      ) : (

        <>
          {/* ==================================================
              TRENDING
          ================================================== */}

          <div id="trending">

            <MovieSection
              title="Trending Now"
              movies={trending}
              cols={5}
              onMovieClick={
                onMovieClick
              }
              onCompare={
                onCompare
              }
              compareList={
                compareList
              }
              onFavorite={
                onFavorite
              }
              isFavorite={
                isFavorite
              }
            />

          </div>

          {/* ==================================================
              POPULAR
          ================================================== */}

          <MovieSection
            title="Popular Movies"
            movies={popular}
            cols={8}
            onMovieClick={
              onMovieClick
            }
            onCompare={
              onCompare
            }
            compareList={
              compareList
            }
            onFavorite={
              onFavorite
            }
            isFavorite={
              isFavorite
            }
          />

          {/* ==================================================
              TOP RATED
          ================================================== */}

          <div id="top-rated">

            <MovieSection
              title="Top Rated Masterworks"
              movies={topRated}
              cols={5}
              onMovieClick={
                onMovieClick
              }
              onCompare={
                onCompare
              }
              compareList={
                compareList
              }
              onFavorite={
                onFavorite
              }
              isFavorite={
                isFavorite
              }
            />

          </div>

          {/* ==================================================
              RECOMMENDATIONS
          ================================================== */}

          <RecommendationSection
            favorites={favorites}
            movies={uniqueMovies}
            onMovieClick={
              onMovieClick
            }
            onCompare={
              onCompare
            }
            compareList={
              compareList
            }
          />

          {/* ==================================================
              COMING SOON
          ================================================== */}

          <div className="mb-10">

            <h2 className="text-2xl font-bold text-white mb-4">
              Coming Soon
            </h2>

            <div className="grid grid-cols-3 gap-5">

              {comingSoon
                .slice(0, 3)
                .map(
                  (
                    movie,
                    index
                  ) => (

                    <div
                      key={
                        movie.id ||
                        movie.imdbID ||
                        index
                      }
                      onClick={() =>
                        onMovieClick?.(
                          movie
                        )
                      }
                      className="
                        animate-card-enter
                        flex
                        gap-4
                        bg-neutral-950
                        border
                        border-neutral-900
                        rounded-xl
                        p-4
                        cursor-pointer
                        hover:border-[#FFB800]
                        hover:bg-neutral-900
                        transition-all
                      "
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >

                      <img
                        src={
                          movie.poster
                        }
                        alt={
                          movie.title
                        }
                        className="
                          w-24
                          h-32
                          object-cover
                          rounded-lg
                          flex-shrink-0
                        "
                        onError={(
                          e
                        ) => {
                          e.currentTarget.src =
                            'https://via.placeholder.com/300x450?text=No+Poster';
                        }}
                      />

                      <div
                        className="
                          flex
                          flex-col
                          gap-2
                          justify-center
                          overflow-hidden
                        "
                      >

                        <span
                          className="
                            text-[10px]
                            text-[#FFB800]
                            font-bold
                            tracking-wider
                            uppercase
                          "
                        >
                          RELEASING{' '}
                          {movie.releaseDate ||
                            'SOON'}
                        </span>

                        <h3
                          className="
                            text-lg
                            font-bold
                            text-white
                            m-0
                            leading-tight
                            truncate
                          "
                        >
                          {movie.title}
                        </h3>

                        <p
                          className="
                            text-[13px]
                            text-neutral-400
                            leading-relaxed
                            m-0
                            line-clamp-2
                          "
                        >
                          {movie.plot ||
                            movie.description ||
                            'Full plot details coming soon...'}
                        </p>

                      </div>

                    </div>

                  )
                )}

            </div>

          </div>
        </>
      )}

      {/* ==================================================
          BROWSE BY GENRE
      ================================================== */}

      <div
        id="genres"
        className="mb-10 scroll-mt-24"
      >

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-bold text-white m-0">
            Browse by Genre
          </h2>

          {selectedGenre && (
            <button
              type="button"
              onClick={
                handleClearGenre
              }
              className="
                text-xs
                text-neutral-400
                hover:text-[#FFB800]
                transition-colors
                cursor-pointer
              "
            >
              Clear Filter ✕
            </button>
          )}

        </div>

        <div className="flex flex-wrap gap-2.5">

          {genres.map(
            (genre) => {

              const isActive =
                selectedGenre ===
                genre;

              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() =>
                    handleGenreClick(
                      genre
                    )
                  }
                  className={`
                    px-5
                    py-2
                    rounded-full
                    text-[13px]
                    font-medium
                    border
                    transition-all
                    cursor-pointer

                    ${
                      isActive
                        ? 'bg-[#FFB800] text-black border-[#FFB800] font-bold shadow-md scale-105'
                        : 'bg-neutral-900 text-white border-neutral-800 hover:bg-[#FFB800] hover:text-black hover:border-[#FFB800]'
                    }
                  `}
                >
                  {genre}
                </button>
              );

            }
          )}

        </div>

      </div>

    </section>
  );
};

export default ContentStream;