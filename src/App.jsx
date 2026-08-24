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
import { searchMovies, getMovieDetails, fetchCuratedRow } from './services/omdbApi';
import { movieIDs } from './data/movieids';
import { mockSearchResults } from './data/mockMovies';

function App() {
  const [view, setView] = useState('loading'); // 'loading' | 'home' | 'search' | 'error' | 'watchlist'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // EXTRA FEATURES STATE
  const [compareList, setCompareList] = useState([]);
  const [isLightMode, setIsLightMode] = useState(false);

  // HOMEPAGE MOVIE STATES
  const [heroMovie, setHeroMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);

  // 1. Toggle Theme (Dark / Light Mode)
  const toggleTheme = () => {
    setIsLightMode((prev) => !prev);
    document.body.classList.toggle('light-mode');
  };

  // 2. Handle Movie Comparison Logic
  const handleCompare = async (movie) => {
    const movieId = movie.id || movie.imdbID;

    // If movie is already in compare list, remove it
    if (compareList.some((m) => (m.id || m.imdbID) === movieId)) {
      setCompareList(compareList.filter((m) => (m.id || m.imdbID) !== movieId));
      return;
    }

    // If list has less than 2 movies, fetch full details and add to compare list
    if (compareList.length < 2) {
      let fullDetails = movie;
      if (!movie.plot || !movie.director) {
        fullDetails = (await getMovieDetails(movieId)) || movie;
      }
      setCompareList([...compareList, fullDetails]);
    }
  };

  // 3. Load Homepage Curated Data with 3.5s Safety Timeout Fallback
  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      try {
        // Safety timeout to prevent getting stuck on loading screen
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('API Timeout')), 3500)
        );

        const fetchData = Promise.all([
          getMovieDetails(movieIDs.hero),
          fetchCuratedRow(movieIDs.trending),
          fetchCuratedRow(movieIDs.popular),
          fetchCuratedRow(movieIDs.topRated),
          fetchCuratedRow(movieIDs.comingSoon),
        ]);

        const [hero, trending, popular, topRated, comingSoon] = await Promise.race([
          fetchData,
          timeoutPromise,
        ]);

        if (isMounted) {
          setHeroMovie(hero || mockSearchResults[1]);
          setTrendingMovies(trending.length ? trending : mockSearchResults);
          setPopularMovies(popular.length ? popular : mockSearchResults);
          setTopRatedMovies(topRated.length ? topRated : mockSearchResults);
          setComingSoonMovies(comingSoon.length ? comingSoon : mockSearchResults.slice(0, 3));
          setView('home');
        }
      } catch (err) {
        console.warn('OMDb API slow or offline, using fallback data:', err);
        if (isMounted) {
          setHeroMovie(mockSearchResults[1]);
          setTrendingMovies(mockSearchResults);
          setPopularMovies(mockSearchResults);
          setTopRatedMovies(mockSearchResults);
          setComingSoonMovies(mockSearchResults.slice(0, 3));
          setView('home');
        }
      }
    };

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  // 4. Handle Search Submission via OMDb API
  const handleSearch = async (query) => {
    if (!query?.trim()) return;

    setSearchQuery(query);
    setView('loading');
    setErrorMessage('');

    try {
      const results = await searchMovies(query);
      setSearchResults(results.length ? results : mockSearchResults);
      setView('search');
    } catch (err) {
      console.warn('Search failed, showing fallback results:', err);
      setSearchResults(mockSearchResults);
      setView('search');
    }
  };

  // 5. Handle Movie Card Click to Open Detail Modal
  const handleMovieClick = async (movie) => {
    const movieId = movie.id || movie.imdbID;

    // Use existing details if available
    if (movie.plot && movie.director) {
      setSelectedMovie(movie);
      return;
    }

    setModalLoading(true);
    try {
      const details = await getMovieDetails(movieId);
      setSelectedMovie(details || movie);
    } catch (err) {
      setSelectedMovie(movie);
    } finally{
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => setSelectedMovie(null);

  const handleBackHome = () => {
    setView('home');
    setSearchQuery('');
    setSearchResults([]);
  };

  // Render Loading View
  if (view === 'loading') return <LoadingState />;

  // Render Error View
  if (view === 'error') {
    return (
      <ErrorState
        message={errorMessage || 'Failed to load movie data.'}
        onRetry={() => window.location.reload()}
        onHome={handleBackHome}
      />
    );
  }

  return (
    <div className="bg-[#080808] min-h-screen transition-colors">
      {/* Navbar */}
      <Navbar
        onSearch={handleSearch}
        onViewChange={setView}
        currentView={view}
        toggleTheme={toggleTheme}
        isLightMode={isLightMode}
      />

      {/* View 1: Home View */}
      {view === 'home' && (
        <>
          <Hero movie={heroMovie} onMovieClick={handleMovieClick} />
          <ContentStream
            trending={trendingMovies}
            popular={popularMovies}
            topRated={topRatedMovies}
            comingSoon={comingSoonMovies}
            onMovieClick={handleMovieClick}
            onCompare={handleCompare}
            compareList={compareList}
          />
        </>
      )}

      {/* View 2: Search Results View */}
      {view === 'search' && (
        <SearchResults
          query={searchQuery}
          results={searchResults}
          onMovieClick={handleMovieClick}
          onCompare={handleCompare}
          compareList={compareList}
          onBack={handleBackHome}
          onSearch={handleSearch}
        />
      )}

      {/* View 3: Watchlist Page View */}
      {view === 'watchlist' && (
        <Watchlist
          onMovieClick={handleMovieClick}
          onCompare={handleCompare}
          compareList={compareList}
        />
      )}

      {/* Footer */}
      <Footer />

      {/* Modal 1: Modal Loading Overlay */}
      {modalLoading && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60">
          <div className="flex items-center gap-3 bg-[#111] px-6 py-4 rounded-xl border border-neutral-800">
            <div className="w-5 h-5 border-2 border-[#FFB800] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-white">Loading details...</span>
          </div>
        </div>
      )}

      {/* Modal 2: Movie Detail Modal */}
      {selectedMovie && !modalLoading && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}

      {/* Modal 3: Movie Comparison Modal (Opens automatically when 2 movies are selected) */}
      {compareList.length === 2 && (
        <CompareModal
          movies={compareList}
          onClose={() => setCompareList([])}
        />
      )}

      {/* Floating Notification Toast when 1 movie is selected for comparison */}
      {compareList.length === 1 && (
        <div className="fixed bottom-6 right-6 bg-[#FFB800] text-black px-5 py-3 rounded-xl font-bold shadow-2xl z-50 animate-bounce flex items-center gap-3 border border-yellow-300">
          <span>Comparing 1 movie: <strong>{compareList[0]?.title}</strong></span>
          <span className="text-xs font-normal opacity-80">(Select 1 more)</span>
          <button
            onClick={() => setCompareList([])}
            className="ml-2 text-xs bg-black text-white px-2 py-1 rounded hover:bg-neutral-800 cursor-pointer"
          >
            Cancel ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default App;