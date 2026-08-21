import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import ContentStream from './components/ContentStream';
import Footer from './components/Footer/Footer';
import SearchResults from './components/SearchResults/SearchResults';
import MovieModal from './components/MovieModal/MovieModal';
import LoadingState from './components/Loading/LoadingState';
import ErrorState from './components/ErrorMessage/ErrorState';
import { searchMovies, getMovieDetails, fetchCuratedRow } from './services/omdbApi';
import { movieIDs } from './data/movieids';
import { mockSearchResults } from './data/mockMovies';

function App() {
  const [view, setView] = useState('loading'); // 'loading' | 'home' | 'search' | 'error'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Homepage data states
  const [heroMovie, setHeroMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      try {
        // Safety timeout (3.5s max wait)
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
        console.warn('OMDb API slow/offline, loading fallback data:', err);
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

  // SEARCH via OMDb
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

  // OPEN MODAL
  const handleMovieClick = async (movie) => {
    if (movie?.plot && movie?.director) {
      setSelectedMovie(movie);
      return;
    }

    setModalLoading(true);
    try {
      const details = await getMovieDetails(movie.id || movie.imdbID);
      setSelectedMovie(details || movie);
    } catch (err) {
      setSelectedMovie(movie);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => setSelectedMovie(null);

  const handleBackHome = () => {
    setView('home');
    setSearchQuery('');
    setSearchResults([]);
  };

  if (view === 'loading') return <LoadingState />;

  if (view === 'error') {
    return (
      <ErrorState
        message={errorMessage}
        onRetry={() => window.location.reload()}
        onHome={handleBackHome}
      />
    );
  }

  return (
    <div className="bg-[#080808] min-h-screen">
      {view === 'home' ? (
        <>
          <Navbar onSearch={handleSearch} />
          {/* ✅ Pass onMovieClick so "More Info" opens the modal */}
          <Hero movie={heroMovie} onMovieClick={handleMovieClick} />
          <ContentStream
            trending={trendingMovies}
            popular={popularMovies}
            topRated={topRatedMovies}
            comingSoon={comingSoonMovies}
            onMovieClick={handleMovieClick}
          />
          <Footer />
        </>
      ) : (
        <SearchResults
          query={searchQuery}
          results={searchResults}
          onMovieClick={handleMovieClick}
          onBack={handleBackHome}
          onSearch={handleSearch}
        />
      )}

      {/* Modal Loading Overlay */}
      {modalLoading && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60">
          <div className="flex items-center gap-3 bg-[#111] px-6 py-4 rounded-xl border border-neutral-800">
            <div className="w-5 h-5 border-2 border-[#FFB800] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-white">Loading details...</span>
          </div>
        </div>
      )}

      {/* Movie Detail Modal */}
      {selectedMovie && !modalLoading && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;