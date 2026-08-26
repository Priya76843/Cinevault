import {
  useState,
  useEffect,
  useCallback,
} from 'react';

import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import ContentStream from './components/ContentStream';
import Footer from './components/Footer/Footer';
import SearchResults from './components/SearchResults/SearchResults';
import MovieModal from './components/MovieModal/MovieModal';
import LoadingState from './components/Loading/LoadingState';
import ErrorState from './components/ErrorMessage/ErrorState';
import CompareModal from './components/CompareModal/CompareModal';
import CompareAnimation from './components/CompareAnimation/CompareAnimation';
import Watchlist from './components/Watchlist/Watchlist';

import {
  searchMovies,
  getMovieDetails,
  fetchCuratedRow,
} from './services/omdbApi';

import { movieIDs } from './data/movieIds';

const FAVORITES_KEY = 'cinevault_favorites';
const WATCHLIST_KEY = 'cinevault-watchlist';

function App() {

  // =====================================================
  // MAIN VIEW
  // =====================================================

  const [view, setView] = useState('loading');

  const [searchQuery, setSearchQuery] = useState('');

  const [searchResults, setSearchResults] = useState([]);

  const [selectedMovie, setSelectedMovie] = useState(null);

  const [modalLoading, setModalLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  // =====================================================
  // COMPARE
  // =====================================================

  const [compareList, setCompareList] = useState([]);

  const [showCompareAnimation, setShowCompareAnimation] =
    useState(false);

  // =====================================================
  // THEME
  // =====================================================

  const [isLightMode, setIsLightMode] = useState(false);

  // =====================================================
  // WATCHLIST
  // =====================================================

  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved =
        localStorage.getItem(WATCHLIST_KEY);

      if (!saved) return [];

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch (error) {
      console.error(
        'Failed to load watchlist:',
        error
      );

      return [];
    }
  });

  // =====================================================
  // FAVORITES
  // =====================================================

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved =
        localStorage.getItem(FAVORITES_KEY);

      if (!saved) return [];

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch (error) {
      console.error(
        'Failed to load favorites:',
        error
      );

      return [];
    }
  });

  // =====================================================
  // HOMEPAGE DATA
  // =====================================================

  const [heroMovie, setHeroMovie] =
    useState(null);

  const [trendingMovies, setTrendingMovies] =
    useState([]);

  const [popularMovies, setPopularMovies] =
    useState([]);

  const [topRatedMovies, setTopRatedMovies] =
    useState([]);

  const [comingSoonMovies, setComingSoonMovies] =
    useState([]);

  // =====================================================
  // SAVE WATCHLIST
  // =====================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        WATCHLIST_KEY,
        JSON.stringify(watchlist)
      );
    } catch (error) {
      console.error(
        'Failed to save watchlist:',
        error
      );
    }
  }, [watchlist]);

  // =====================================================
  // SAVE FAVORITES
  // =====================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
      );
    } catch (error) {
      console.error(
        'Failed to save favorites:',
        error
      );
    }
  }, [favorites]);

  // =====================================================
  // CHECK WATCHLIST
  // =====================================================

  const isInWatchlist = useCallback(
    (movie) => {
      if (!movie) return false;

      const movieId =
        movie.id || movie.imdbID;

      if (!movieId) return false;

      return watchlist.some(
        (item) =>
          (item.id || item.imdbID) === movieId
      );
    },
    [watchlist]
  );

  // =====================================================
  // TOGGLE WATCHLIST
  // =====================================================

  const handleWatchlist = useCallback(
    (movie) => {
      if (!movie) return;

      const movieId =
        movie.id || movie.imdbID;

      if (!movieId) return;

      setWatchlist((prev) => {
        const exists = prev.some(
          (item) =>
            (item.id || item.imdbID) === movieId
        );

        if (exists) {
          return prev.filter(
            (item) =>
              (item.id || item.imdbID) !== movieId
          );
        }

        return [
          ...prev,
          movie,
        ];
      });
    },
    []
  );

  // =====================================================
  // FAVORITE FUNCTIONS
  // =====================================================

  const isFavorite = useCallback(
    (movie) => {
      if (!movie) return false;

      const movieId =
        movie.id || movie.imdbID;

      if (!movieId) return false;

      return favorites.some(
        (item) =>
          (item.id || item.imdbID) === movieId
      );
    },
    [favorites]
  );

  const handleFavorite = useCallback(
    (movie) => {
      if (!movie) return;

      const movieId =
        movie.id || movie.imdbID;

      if (!movieId) return;

      setFavorites((prev) => {
        const exists = prev.some(
          (item) =>
            (item.id || item.imdbID) === movieId
        );

        if (exists) {
          return prev.filter(
            (item) =>
              (item.id || item.imdbID) !== movieId
          );
        }

        return [
          ...prev,
          movie,
        ];
      });
    },
    []
  );

  // =====================================================
  // THEME
  // =====================================================

  const toggleTheme = () => {
    setIsLightMode((prev) => {
      const newValue = !prev;

      document.body.classList.toggle(
        'light-mode',
        newValue
      );

      return newValue;
    });
  };

  // =====================================================
  // COMPARE
  // =====================================================

  const handleCompare = useCallback(
    (movie) => {
      if (!movie) return;

      const movieId =
        movie.id || movie.imdbID;

      if (!movieId) return;

      const alreadyComparing =
        compareList.some(
          (item) =>
            (item.id || item.imdbID) === movieId
        );

      // ==========================================
      // REMOVE MOVIE
      // ==========================================

      if (alreadyComparing) {
        setCompareList((prev) =>
          prev.filter(
            (item) =>
              (item.id || item.imdbID) !== movieId
          )
        );

        return;
      }

      // ==========================================
      // ADD MOVIE
      // ==========================================

      if (compareList.length < 2) {

        setCompareList((prev) => {
          const updated = [
            ...prev,
            movie,
          ];

          // ========================================
          // SECOND MOVIE SELECTED
          // START COLLISION
          // ========================================

          if (updated.length === 2) {
            setShowCompareAnimation(true);
          }

          return updated;
        });

        setSelectedMovie(null);
      }
    },
    [compareList]
  );

  // =====================================================
  // LOAD HOMEPAGE DATA
  // =====================================================

  const loadHomeData = useCallback(
    async () => {
      try {
        setView('loading');
        setErrorMessage('');

        const timeoutPromise =
          new Promise((_, reject) => {
            setTimeout(() => {
              reject(
                new Error(
                  'Network request timed out. Please check your connection or API key.'
                )
              );
            }, 5000);
          });

        const fetchData =
          Promise.all([
            getMovieDetails(
              movieIDs.hero
            ),

            fetchCuratedRow(
              movieIDs.trending
            ),

            fetchCuratedRow(
              movieIDs.popular
            ),

            fetchCuratedRow(
              movieIDs.topRated
            ),

            fetchCuratedRow(
              movieIDs.comingSoon
            ),
          ]);

        const [
          hero,
          trending,
          popular,
          topRated,
          comingSoon,
        ] = await Promise.race([
          fetchData,
          timeoutPromise,
        ]);

        if (
          !hero &&
          !trending.length
        ) {
          throw new Error(
            'Failed to retrieve movie data from OMDb API.'
          );
        }

        setHeroMovie(hero);

        setTrendingMovies(
          trending
        );

        setPopularMovies(
          popular
        );

        setTopRatedMovies(
          topRated
        );

        setComingSoonMovies(
          comingSoon
        );

        setView('home');

      } catch (error) {

        console.error(
          'OMDb Load Error:',
          error
        );

        setErrorMessage(
          error.message ||
          'Failed to load movie data from OMDb API.'
        );

        setView('error');
      }
    },
    []
  );

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const timer =
      setTimeout(() => {
        loadHomeData();
      }, 0);

    return () =>
      clearTimeout(timer);
  }, [loadHomeData]);

  // =====================================================
  // SEARCH FOCUS
  // =====================================================

  const handleSearchFocus =
    useCallback(() => {
      setView('search');
    }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = async (
    query
  ) => {
    if (!query?.trim()) return;

    setSearchQuery(query);

    setView('loading');

    setErrorMessage('');

    try {

      const results =
        await searchMovies(query);

      setSearchResults(
        results
      );

      setView('search');

    } catch (error) {

      console.error(
        'Search Error:',
        error
      );

      setErrorMessage(
        error.message ||
        'Failed to fetch search results from OMDb API.'
      );

      setView('error');
    }
  };

  // =====================================================
  // OPEN MOVIE MODAL
  // =====================================================

  const handleMovieClick = async (
    movie
  ) => {
    if (!movie) return;

    const movieId =
      movie.id || movie.imdbID;

    if (!movieId) return;

    if (
      movie.plot &&
      movie.director
    ) {
      setSelectedMovie(movie);
      return;
    }

    setModalLoading(true);

    try {

      const details =
        await getMovieDetails(
          movieId
        );

      setSelectedMovie(
        details || movie
      );

    } catch (error) {

      console.error(
        'Movie details error:',
        error
      );

      setSelectedMovie(movie);

    } finally {

      setModalLoading(false);
    }
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  // =====================================================
  // BACK HOME
  // =====================================================

  const handleBackHome = () => {
    setView('home');
    setSearchQuery('');
    setSearchResults([]);
    setErrorMessage('');
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (view === 'loading') {
    return <LoadingState />;
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (view === 'error') {
    return (
      <ErrorState
        message={
          errorMessage ||
          'Failed to load movie data from OMDb API.'
        }
        onRetry={loadHomeData}
        onHome={handleBackHome}
      />
    );
  }

  // =====================================================
  // MAIN APP
  // =====================================================

  return (
    <div className="
      bg-[#080808]
      min-h-screen
      transition-colors
      duration-300
    ">

      {/* ================================================
          NAVBAR
      ================================================= */}

      <Navbar
        onSearch={handleSearch}
        onSearchFocus={handleSearchFocus}
        onViewChange={setView}
        currentView={view}
        toggleTheme={toggleTheme}
        isLightMode={isLightMode}
        favorites={watchlist}
      />

      {/* ================================================
          HOME
      ================================================= */}

      {view === 'home' && (
        <>
          <Hero
            movie={heroMovie}
            onMovieClick={handleMovieClick}
          />

          <ContentStream
            trending={trendingMovies}
            popular={popularMovies}
            topRated={topRatedMovies}
            comingSoon={comingSoonMovies}

            favorites={favorites}

            onMovieClick={handleMovieClick}

            onCompare={handleCompare}

            compareList={compareList}

            // HEART = WATCHLIST
            onFavorite={handleWatchlist}
            isFavorite={isInWatchlist}
          />
        </>
      )}

      {/* ================================================
          SEARCH
      ================================================= */}

      {view === 'search' && (
        <SearchResults
          query={searchQuery}
          results={searchResults}
          onMovieClick={handleMovieClick}
          onBack={handleBackHome}
          onSearch={handleSearch}

          // HEART = WATCHLIST
          favorites={watchlist}
          onFavorite={handleWatchlist}
          isFavorite={isInWatchlist}
        />
      )}

      {/* ================================================
          WATCHLIST
      ================================================= */}

      {view === 'watchlist' && (
        <Watchlist
          watchlist={watchlist}
          onMovieClick={handleMovieClick}
          onRemove={handleWatchlist}
        />
      )}

      {/* ================================================
          FOOTER
      ================================================= */}

      <Footer />

      {/* ================================================
          MODAL LOADING
      ================================================= */}

      {modalLoading && (
        <div className="
          fixed
          inset-0
          z-[110]
          flex
          items-center
          justify-center
          bg-black/60
          backdrop-blur-sm
        ">

          <div className="
            flex
            items-center
            gap-3
            bg-[#111]
            px-6
            py-4
            rounded-xl
            border
            border-neutral-800
            shadow-2xl
          ">

            <div className="
              w-5
              h-5
              border-2
              border-[#FFB800]
              border-t-transparent
              rounded-full
              animate-spin
            " />

            <span className="text-sm text-white">
              Loading details...
            </span>

          </div>

        </div>
      )}

      {/* ================================================
          MOVIE MODAL
      ================================================= */}

      {selectedMovie &&
        !modalLoading && (
          <MovieModal
            movie={selectedMovie}
            onClose={handleCloseModal}
            onCompare={handleCompare}
            compareList={compareList}

            // SAME WATCHLIST STATE
            onWatchlist={handleWatchlist}

            isInWatchlist={isInWatchlist(
              selectedMovie
            )}
          />
        )}

      {/* ================================================
          COMPARE COLLISION ANIMATION
      ================================================= */}

      {showCompareAnimation &&
        compareList.length === 2 && (
          <CompareAnimation
            movieA={compareList[0]}
            movieB={compareList[1]}
            onComplete={() => {
              setShowCompareAnimation(false);
            }}
          />
        )}

      {/* ================================================
          COMPARE MODAL
      ================================================= */}

      {compareList.length === 2 &&
        !showCompareAnimation && (
          <CompareModal
            movies={compareList}
            onClose={() => {
              setCompareList([]);
            }}
          />
        )}

      {/* ================================================
          COMPARE NOTIFICATION
      ================================================= */}

      {compareList.length === 1 &&
        !showCompareAnimation && (
          <div className="
            fixed
            bottom-6
            right-6
            bg-[#FFB800]
            text-black
            px-5
            py-3
            rounded-xl
            font-bold
            shadow-2xl
            z-[150]
            animate-bounce
            flex
            items-center
            gap-3
            border
            border-yellow-300
          ">

            <span>
              Comparing 1 movie:{' '}
              <strong>
                {compareList[0]?.title}
              </strong>
            </span>

            <span className="
              text-xs
              font-normal
              opacity-80
            ">
              Open another movie & click Compare
            </span>

            <button
              type="button"
              onClick={() =>
                setCompareList([])
              }
              className="
                ml-2
                text-xs
                bg-black
                text-white
                px-2.5
                py-1
                rounded
                hover:bg-neutral-800
                cursor-pointer
              "
            >
              Cancel ✕
            </button>

          </div>
        )}

    </div>
  );
}

export default App;