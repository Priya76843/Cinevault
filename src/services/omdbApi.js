const API_BASE_URL = 'https://www.omdbapi.com/';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

// In-memory cache
const movieCache = new Map();


// Get full movie details using IMDb ID

export async function getMovieById(imdbID, plot = 'short') {
  if (!imdbID) {
    throw new Error('IMDb ID is required.');
  }

  // Create a unique cache key
  const cacheKey = `${imdbID}-${plot}`;

  // Return cached movie if already fetched
  if (movieCache.has(cacheKey)) {
    return movieCache.get(cacheKey);
  }

  const url = new URL(API_BASE_URL);

  url.searchParams.set('apikey', API_KEY);
  url.searchParams.set('i', imdbID);
  url.searchParams.set('plot', plot);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`OMDb request failed: ${response.status}`);
  }

  const data = await response.json();

  // OMDb can return HTTP 200 even when the API reports an error
  if (data.Response === 'False') {
    throw new Error(data.Error || 'Movie not found.');
  }

  // Store successful response in cache
  movieCache.set(cacheKey, data);

  return data;
}

// Search movies by title
 
export async function searchMovies(query, page = 1) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const url = new URL(API_BASE_URL);

  url.searchParams.set('apikey', API_KEY);
  url.searchParams.set('s', trimmedQuery);
  url.searchParams.set('type', 'movie');
  url.searchParams.set('page', page);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`OMDb request failed: ${response.status}`);
  }

  const data = await response.json();

  if (data.Response === 'False') {
    return [];
  }

  return data.Search || [];
}

//Get multiple movies by IMDb IDs
 
export async function getMoviesByIds(imdbIDs, plot = 'short') {
  const movies = await Promise.all(
    imdbIDs.map((imdbID) => getMovieById(imdbID, plot))
  );

  return movies.filter(Boolean);
}

//   Clear the in-memory movie cache

export function clearMovieCache() {
  movieCache.clear();
}