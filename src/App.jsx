import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import ContentStream from './components/ContentStream';
import Footer from './components/Footer/Footer';
import SearchResults from './components/SearchResults/SearchResults';
import MovieModal from './components/MovieModal/MovieModal';
import LoadingState from './components/Loading/LoadingState';
import ErrorState from './components/ErrorMessage/ErrorState';
import CompareModal from './components/CompareModal/CompareModal';
import Watchlist from './components/Watchlist/Watchlist';

import {
  searchMovies,
  getMovieDetails,
  fetchCuratedRow,
} from './services/omdbApi';

import { movieIDs } from './data/movieids';

const FAVORITES_KEY = 'cinevault_favorites';

function App() {
  const [view, setView] = useState('loading');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // COMPARE & THEME STATE
  const [compareList, setCompareList] = useState([]);
  const [isLightMode, setIsLightMode] = useState(false);

  // WATCHLIST STATE
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const savedWatchlist =
        localStorage.getItem('cinevault-watchlist');

      return savedWatchlist
        ? JSON.parse(savedWatchlist)
        : [];
    } catch {
      return [];
    }
  });

  // FAVORITES STATE
  // ❤️ This is used for personalized recommendations
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites =
        localStorage.getItem(FAVORITES_KEY);

      return savedFavorites
        ? JSON.parse(savedFavorites)
        : [];
    } catch {
      return [];
    }
  });

  // HOMEPAGE STATES
  const [heroMovie, setHeroMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);

  // SAVE WATCHLIST TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem(
      'cinevault-watchlist',
      JSON.stringify(watchlist)
    );
  }, [watchlist]);

  // SAVE FAVORITES TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favorites)
    );
  }, [favorites]);

  // KEEP FAVORITES STATE IN SYNC WITH MOVIECARD
  useEffect(() => {
    const syncFavorites = () => {
      try {
        const savedFavorites =
          localStorage.getItem(FAVORITES_KEY);

        setFavorites(
          savedFavorites
            ? JSON.parse(savedFavorites)
            : []
        );
      } catch {
        setFavorites([]);
      }
    };

    window.addEventListener(
      'cinevault-favorites-updated',
      syncFavorites
    );

    return () => {
      window.removeEventListener(
        'cinevault-favorites-updated',
        syncFavorites
      );
    };
  }, []);

  // HANDLE FAVORITE
  // ❤️ This is the main personalization signal
  const handleFavorite = (movie) => {
    const movieId = movie.id || movie.imdbID;

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

      return [...prev, movie];
    });
  };

  // TOGGLE DARK/LIGHT MODE
  const toggleTheme = () => {
    setIsLightMode((prev) => !prev);
    document.body.classList.toggle('light-mode');
  };

  // HANDLE WATCHLIST ADD/REMOVE
  const handleWatchlist = (movie) => {
    const movieId = movie.id || movie.imdbID;

    setWatchlist((prev) => {
      const exists = prev.some(
        (m) =>
          (m.id || m.imdbID) === movieId
      );

      if (exists) {
        return prev.filter(
          (m) =>
            (m.id || m.imdbID) !== movieId
        );
      }

      return [...prev, movie];
    });
  };

  // CHECK WHETHER MOVIE IS IN WATCHLIST
  const isInWatchlist = (movie) => {
    if (!movie) return false;

    const movieId = movie.id || movie.imdbID;

    return watchlist.some(
      (m) =>
        (m.id || m.imdbID) === movieId
    );
  };

  // HANDLE COMPARE
  const handleCompare = (movie) => {
    const movieId = movie.id || movie.imdbID;

    // Remove if already selected
    if (
      compareList.some(
        (m) =>
          (m.id || m.imdbID) === movieId
      )
    ) {
      setCompareList(
        compareList.filter(
          (m) =>
            (m.id || m.imdbID) !== movieId
        )
      );

      return;
    }

    // Maximum 2 movies
    if (compareList.length < 2) {
      setCompareList([
        ...compareList,
        movie,
      ]);

      setSelectedMovie(null);
    }
  };

  // LOAD HOMEPAGE DATA
  const loadHomeData = async () => {
    let isMounted = true;

    try {
      setView('loading');
      setErrorMessage('');

      // 5-second timeout
      const timeoutPromise = new Promise(
        (_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  'Network request timed out. Please check your connection or API key.'
                )
              ),
            5000
          )
      );

      const fetchData = Promise.all([
        getMovieDetails(movieIDs.hero),
        fetchCuratedRow(movieIDs.trending),
        fetchCuratedRow(movieIDs.popular),
        fetchCuratedRow(movieIDs.topRated),
        fetchCuratedRow(movieIDs.comingSoon),
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

      if (isMounted) {
        if (!hero && !trending.length) {
          throw new Error(
            'Failed to retrieve movie data from OMDb API.'
          );
        }

        setHeroMovie(hero);
        setTrendingMovies(trending);
        setPopularMovies(popular);
        setTopRatedMovies(topRated);
        setComingSoonMovies(comingSoon);

        setView('home');
      }
    } catch (err) {
      if (isMounted) {
        console.error(
          'OMDb Load Error:',
          err
        );

        setErrorMessage(
          err.message ||
            'Failed to load movie data from OMDb API.'
        );

        setView('error');
      }
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    loadHomeData();
  }, []);

  // SEARCH HANDLER
  const handleSearch = async (query) => {
    if (!query?.trim()) return;

    setSearchQuery(query);
    setView('loading');
    setErrorMessage('');

    try {
      const results =
        await searchMovies(query);

      setSearchResults(results);
      setView('search');
    } catch (err) {
      console.error(
        'Search Error:',
        err
      );

      setErrorMessage(
        err.message ||
          'Failed to fetch search results from OMDb API.'
      );

      setView('error');
    }
  };

  // OPEN MOVIE DETAIL MODAL
  const handleMovieClick = async (movie) => {
    const movieId =
      movie.id || movie.imdbID;

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
        await getMovieDetails(movieId);

      setSelectedMovie(
        details || movie
      );
    } catch (err) {
      setSelectedMovie(movie);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handleBackHome = () => {
    setView('home');
    setSearchQuery('');
    setSearchResults([]);
    setErrorMessage('');
  };

  // LOADING
  if (view === 'loading') {
    return <LoadingState />;
  }

  // ERROR
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

  return (
    <div className="bg-[#080808] min-h-screen transition-colors">

      {/* NAVBAR */}
      <Navbar
        onSearch={handleSearch}
        onViewChange={setView}
        currentView={view}
        toggleTheme={toggleTheme}
        isLightMode={isLightMode}
      />

      {/* HOME */}
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

            // ❤️ Favorites drive personalization
            favorites={favorites}

            onMovieClick={handleMovieClick}
            onCompare={handleCompare}
            compareList={compareList}
            onFavorite={handleFavorite}
          />
        </>
      )}

      {/* SEARCH */}
      {view === 'search' && (
        <SearchResults
          query={searchQuery}
          results={searchResults}
          onMovieClick={handleMovieClick}
          onBack={handleBackHome}
          onSearch={handleSearch}
        />
      )}

      {/* WATCHLIST */}
      {view === 'watchlist' && (
        <Watchlist
          watchlist={watchlist}
          onMovieClick={handleMovieClick}
          onCompare={handleCompare}
          compareList={compareList}
          onRemove={handleWatchlist}
        />
      )}

      <Footer />

      {/* MODAL LOADING */}
      {modalLoading && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60">

          <div className="flex items-center gap-3 bg-[#111] px-6 py-4 rounded-xl border border-neutral-800">

            <div className="w-5 h-5 border-2 border-[#FFB800] border-t-transparent rounded-full animate-spin" />

            <span className="text-sm text-white">
              Loading details...
            </span>

          </div>
        </div>
      )}

      {/* MOVIE MODAL */}
      {selectedMovie &&
        !modalLoading && (
          <MovieModal
            movie={selectedMovie}
            onClose={handleCloseModal}
            onCompare={handleCompare}
            compareList={compareList}
            onWatchlist={handleWatchlist}
            isInWatchlist={isInWatchlist(
              selectedMovie
            )}
          />
        )}

      {/* COMPARE MODAL */}
      {compareList.length === 2 && (
        <CompareModal
          movies={compareList}
          onClose={() =>
            setCompareList([])
          }
        />
      )}

      {/* COMPARE NOTIFICATION */}
      {compareList.length === 1 && (
        <div className="fixed bottom-6 right-6 bg-[#FFB800] text-black px-5 py-3 rounded-xl font-bold shadow-2xl z-[150] animate-bounce flex items-center gap-3 border border-yellow-300">

          <span>
            Comparing 1 movie:{' '}
            <strong>
              {compareList[0]?.title}
            </strong>
          </span>

          <span className="text-xs font-normal opacity-80">
            (Open another movie & click Compare)
          </span>

          <button
            onClick={() =>
              setCompareList([])
            }
            className="ml-2 text-xs bg-black text-white px-2.5 py-1 rounded hover:bg-neutral-800 cursor-pointer"
          >
            Cancel ✕
          </button>

        </div>
      )}

    </div>
  );
}

export default App;