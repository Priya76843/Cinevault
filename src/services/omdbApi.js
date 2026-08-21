const API_KEY = import.meta.env.VITE_OMDB_API_KEY || 'd05bd4cd';
const BASE_URL = 'https://www.omdbapi.com/';

// Requirement: Cache detail responses in memory (Max 1000 calls/day limit)
const detailCache = new Map();

// Requirement: Movie details by IMDb ID (i=) with full plot
export const getMovieDetails = async (imdbID) => {
  if (!imdbID) return null;

  // Return cached result if available
  if (detailCache.has(imdbID)) {
    return detailCache.get(imdbID);
  }

  try {
    const res = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`
    );
    const data = await res.json();

    if (data.Response === 'False') {
      throw new Error(data.Error || 'Movie not found');
    }

    // Requirement: Treat Poster === "N/A" and imdbRating === "N/A" as missing
    const formattedMovie = {
      id: data.imdbID,
      title: data.Title,
      year: data.Year,
      ageRating: data.Rated !== 'N/A' ? data.Rated : 'NR',
      runtime: data.Runtime !== 'N/A' ? data.Runtime : 'N/A',
      rating: data.imdbRating !== 'N/A' ? data.imdbRating : null,
      genre: data.Genre && data.Genre !== 'N/A' ? data.Genre.split(',')[0].trim() : 'Movie',
      genres: data.Genre && data.Genre !== 'N/A' ? data.Genre.split(',').map((g) => g.trim()) : ['Movie'],
      director: data.Director !== 'N/A' ? data.Director : 'Unknown',
      plot: data.Plot !== 'N/A' ? data.Plot : 'No plot available.',
      poster: data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/300x450?text=No+Poster',
      banner: data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/1280x720?text=No+Banner',
      cast: data.Actors && data.Actors !== 'N/A'
        ? data.Actors.split(', ').map((name, i) => ({
            name,
            role: 'Cast',
            avatar: `https://i.pravatar.cc/150?img=${(i % 50) + 1}`,
          }))
        : [],
    };

    // Save to cache
    detailCache.set(imdbID, formattedMovie);
    return formattedMovie;
  } catch (error) {
    console.error(`Error fetching ID ${imdbID}:`, error);
    return null;
  }
};

// Requirement: Search uses s= first, then hydrates top results with i= so cards show rating & genre
export const searchMovies = async (query) => {
  if (!query?.trim()) return [];

  try {
    const res = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query.trim())}&type=movie`
    );
    const data = await res.json();

    if (data.Response === 'False') {
      return [];
    }

    // Take top 6 results
    const rawResults = (data.Search || []).slice(0, 6);

    // Hydrate each search result with i= to get imdbRating and Genre
    const hydratedMovies = await Promise.all(
      rawResults.map(async (item) => {
        const details = await getMovieDetails(item.imdbID);
        if (details) return details;

        return {
          id: item.imdbID,
          title: item.Title,
          year: item.Year,
          poster: item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/300x450?text=No+Poster',
          rating: null,
          genre: 'Movie',
        };
      })
    );

    return hydratedMovies.filter(Boolean);
  } catch (error) {
    console.error('Search error:', error);
    throw new Error('Failed to fetch search results from OMDb.');
  }
};

// Requirement: Fetch curated list of IMDb IDs for homepage rows
export const fetchCuratedRow = async (idArray) => {
  const movies = await Promise.all(idArray.map((id) => getMovieDetails(id)));
  return movies.filter(Boolean);
};