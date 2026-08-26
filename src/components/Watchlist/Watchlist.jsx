import MovieCard from '../MovieCard/MovieCard';

const Watchlist = ({
  watchlist = [],
  onMovieClick,
  onRemove,
}) => {
  return (
    <main className="max-w-[1440px] mx-auto px-20 py-12 min-h-[70vh] text-white">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3 m-0">

          <span className="text-red-500">
            ♥
          </span>

          My Watchlist

        </h1>

        <p className="text-neutral-400 text-sm mt-1.5 m-0">

          You have {watchlist.length}{' '}

          movie
          {watchlist.length !== 1
            ? 's'
            : ''}{' '}

          saved in your watchlist.

        </p>

      </div>

      {/* ======================================
          MOVIES
      ====================================== */}

      {watchlist.length > 0 ? (

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

          {watchlist.map(
            (movie, index) => (

              <MovieCard
                key={
                  movie.id ||
                  movie.imdbID ||
                  index
                }

                movie={movie}

                onClick={onMovieClick}

                // HEART REMOVES FROM WATCHLIST
                onFavorite={onRemove}

                isFavorite={true}
              />

            )
          )}

        </div>

      ) : (

        /* ====================================
            EMPTY STATE
        ==================================== */

        <div className="py-20 text-center border border-neutral-800/80 rounded-2xl bg-neutral-950/50">

          <span className="text-4xl mb-3 block">
            🔖
          </span>

          <h3 className="text-xl text-white font-bold mb-2">
            Your watchlist is empty
          </h3>

          <p className="text-neutral-500 text-sm max-w-md mx-auto">
            Click the heart icon on any movie
            to add it to your watchlist.
          </p>

        </div>

      )}

    </main>
  );
};

export default Watchlist;