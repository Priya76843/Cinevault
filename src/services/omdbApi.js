const API_KEY =
  import.meta.env.VITE_OMDB_API_KEY || 'd05bd4cd';

const BASE_URL = 'https://www.omdbapi.com/';

// ==================================================
// CACHE CONFIGURATION
// ==================================================

// Movie details are cached for 24 hours.
const DETAIL_CACHE_KEY = 'cinevault-omdb-details';
const SEARCH_CACHE_KEY = 'cinevault-omdb-search';

const CACHE_DURATION = 24 * 60 * 60 * 1000;

// In-memory cache
const detailCache = new Map();
const searchCache = new Map();

// Tracks requests that are currently running.
// If multiple components request the same movie,
// they will share ONE API request.
const pendingDetailRequests = new Map();
const pendingSearchRequests = new Map();

// ==================================================
// LOCAL STORAGE HELPERS
// ==================================================

const loadLocalCache = (key) => {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return {};
    }

    const parsed = JSON.parse(saved);

    return parsed && typeof parsed === 'object'
      ? parsed
      : {};
  } catch (error) {
    console.warn(
      `Failed to read cache "${key}":`,
      error
    );

    return {};
  }
};

const saveLocalCache = (key, cache) => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(cache)
    );
  } catch (error) {
    console.warn(
      `Failed to save cache "${key}":`,
      error
    );
  }
};

// ==================================================
// LOAD PERSISTENT CACHES
// ==================================================

const persistedDetailCache =
  loadLocalCache(DETAIL_CACHE_KEY);

const persistedSearchCache =
  loadLocalCache(SEARCH_CACHE_KEY);

// ==================================================
// GET CACHED MOVIE
// ==================================================

const getCachedMovie = (imdbID) => {
  if (!imdbID) {
    return null;
  }

  // ----------------------------------------------
  // 1. Check memory cache
  // ----------------------------------------------

  if (detailCache.has(imdbID)) {
    return detailCache.get(imdbID);
  }

  // ----------------------------------------------
  // 2. Check localStorage cache
  // ----------------------------------------------

  const cached =
    persistedDetailCache[imdbID];

  if (!cached) {
    return null;
  }

  // ----------------------------------------------
  // Check expiration
  // ----------------------------------------------

  if (
    !cached.timestamp ||
    Date.now() - cached.timestamp >
      CACHE_DURATION
  ) {
    delete persistedDetailCache[imdbID];

    saveLocalCache(
      DETAIL_CACHE_KEY,
      persistedDetailCache
    );

    return null;
  }

  // ----------------------------------------------
  // Restore into memory
  // ----------------------------------------------

  detailCache.set(
    imdbID,
    cached.data
  );

  return cached.data;
};

// ==================================================
// CACHE MOVIE
// ==================================================

const cacheMovie = (
  imdbID,
  movie
) => {
  if (!imdbID || !movie) {
    return;
  }

  // Memory cache
  detailCache.set(
    imdbID,
    movie
  );

  // Persistent cache
  persistedDetailCache[imdbID] = {
    timestamp: Date.now(),
    data: movie,
  };

  saveLocalCache(
    DETAIL_CACHE_KEY,
    persistedDetailCache
  );
};

// ==================================================
// GET MOVIE DETAILS
// ==================================================

export const getMovieDetails = async (
  imdbID
) => {
  if (!imdbID) {
    return null;
  }

  // ==================================================
  // CACHE CHECK
  // ==================================================

  const cachedMovie =
    getCachedMovie(imdbID);

  if (cachedMovie) {
    return cachedMovie;
  }

  // ==================================================
  // PREVENT DUPLICATE REQUESTS
  // ==================================================

  if (
    pendingDetailRequests.has(imdbID)
  ) {
    return pendingDetailRequests.get(
      imdbID
    );
  }

  // ==================================================
  // CREATE REQUEST
  // ==================================================

  const request = (async () => {
    try {
      const res = await fetch(
        `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`
      );

      const data = await res.json();

      // ----------------------------------------------
      // API ERROR
      // ----------------------------------------------

      if (data.Response === 'False') {
        console.warn(
          `OMDb: ${data.Error || 'Movie not found'}`
        );

        return null;
      }

      // ----------------------------------------------
      // FORMAT MOVIE
      // ----------------------------------------------

      const formattedMovie = {
        id: data.imdbID,

        title: data.Title,

        year: data.Year,

        ageRating:
          data.Rated !== 'N/A'
            ? data.Rated
            : 'NR',

        runtime:
          data.Runtime !== 'N/A'
            ? data.Runtime
            : 'N/A',

        rating:
          data.imdbRating !== 'N/A'
            ? data.imdbRating
            : null,

        genre:
          data.Genre &&
          data.Genre !== 'N/A'
            ? data.Genre
                .split(',')
                .map((g) => g.trim())[0]
            : 'Movie',

        genres:
          data.Genre &&
          data.Genre !== 'N/A'
            ? data.Genre
                .split(',')
                .map((g) => g.trim())
            : ['Movie'],

        director:
          data.Director !== 'N/A'
            ? data.Director
            : 'Unknown',

        plot:
          data.Plot !== 'N/A'
            ? data.Plot
            : 'No plot available.',

        poster:
          data.Poster !== 'N/A'
            ? data.Poster
            : 'https://via.placeholder.com/300x450?text=No+Poster',

        banner:
          data.Poster !== 'N/A'
            ? data.Poster
            : 'https://via.placeholder.com/1280x720?text=No+Banner',

        cast:
          data.Actors &&
          data.Actors !== 'N/A'
            ? data.Actors
                .split(', ')
                .map((name, i) => ({
                  name,

                  role: 'Cast',

                  avatar:
                    `https://i.pravatar.cc/150?img=${
                      (i % 50) + 1
                    }`,
                }))
            : [],
      };

      // ----------------------------------------------
      // SAVE TO BOTH CACHES
      // ----------------------------------------------

      cacheMovie(
        imdbID,
        formattedMovie
      );

      return formattedMovie;

    } catch (error) {
      console.error(
        `Error fetching ID ${imdbID}:`,
        error
      );

      return null;

    } finally {
      // --------------------------------------------
      // Remove completed request
      // --------------------------------------------

      pendingDetailRequests.delete(
        imdbID
      );
    }
  })();

  // Store running request
  pendingDetailRequests.set(
    imdbID,
    request
  );

  return request;
};

// ==================================================
// GET CACHED SEARCH
// ==================================================

const getCachedSearch = (
  query
) => {
  const normalizedQuery =
    query.trim().toLowerCase();

  const cached =
    persistedSearchCache[
      normalizedQuery
    ];

  if (!cached) {
    return null;
  }

  // ----------------------------------------------
  // Check expiration
  // ----------------------------------------------

  if (
    !cached.timestamp ||
    Date.now() - cached.timestamp >
      CACHE_DURATION
  ) {
    delete persistedSearchCache[
      normalizedQuery
    ];

    saveLocalCache(
      SEARCH_CACHE_KEY,
      persistedSearchCache
    );

    return null;
  }

  // Restore memory cache
  searchCache.set(
    normalizedQuery,
    cached.data
  );

  return cached.data;
};

// ==================================================
// CACHE SEARCH
// ==================================================

const cacheSearch = (
  query,
  results
) => {
  const normalizedQuery =
    query.trim().toLowerCase();

  searchCache.set(
    normalizedQuery,
    results
  );

  persistedSearchCache[
    normalizedQuery
  ] = {
    timestamp: Date.now(),
    data: results,
  };

  saveLocalCache(
    SEARCH_CACHE_KEY,
    persistedSearchCache
  );
};

// ==================================================
// SEARCH MOVIES
// ==================================================

export const searchMovies = async (
  query
) => {
  if (!query?.trim()) {
    return [];
  }

  const normalizedQuery =
    query.trim().toLowerCase();

  // ==================================================
  // MEMORY CACHE
  // ==================================================

  if (
    searchCache.has(
      normalizedQuery
    )
  ) {
    return searchCache.get(
      normalizedQuery
    );
  }

  // ==================================================
  // LOCAL STORAGE CACHE
  // ==================================================

  const cachedSearch =
    getCachedSearch(query);

  if (cachedSearch) {
    return cachedSearch;
  }

  // ==================================================
  // PREVENT DUPLICATE SEARCH REQUESTS
  // ==================================================

  if (
    pendingSearchRequests.has(
      normalizedQuery
    )
  ) {
    return pendingSearchRequests.get(
      normalizedQuery
    );
  }

  // ==================================================
  // CREATE SEARCH REQUEST
  // ==================================================

  const request = (async () => {
    try {
      // --------------------------------------------
      // ONE SEARCH REQUEST
      // --------------------------------------------

      const res = await fetch(
        `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
          query.trim()
        )}&type=movie`
      );

      const data = await res.json();

      if (data.Response === 'False') {
        cacheSearch(
          query,
          []
        );

        return [];
      }

      // --------------------------------------------
      // Take top 6 results
      // --------------------------------------------

      const rawResults = (
        data.Search || []
      ).slice(0, 6);

      // --------------------------------------------
      // Hydrate results
      // --------------------------------------------

      const hydratedMovies =
        await Promise.all(
          rawResults.map(
            async (item) => {
              const details =
                await getMovieDetails(
                  item.imdbID
                );

              // --------------------------------
              // Use full cached/API details
              // --------------------------------

              if (details) {
                return details;
              }

              // --------------------------------
              // Fallback search result
              // --------------------------------

              return {
                id: item.imdbID,

                title: item.Title,

                year: item.Year,

                poster:
                  item.Poster !== 'N/A'
                    ? item.Poster
                    : 'https://via.placeholder.com/300x450?text=No+Poster',

                rating: null,

                genre: 'Movie',

                genres: ['Movie'],
              };
            }
          )
        );

      const results =
        hydratedMovies.filter(Boolean);

      // --------------------------------------------
      // Cache complete search
      // --------------------------------------------

      cacheSearch(
        query,
        results
      );

      return results;

    } catch (error) {
      console.error(
        'Search error:',
        error
      );

      throw new Error(
        'Failed to fetch search results from OMDb.',
        {
          cause: error,
        }
      );

    } finally {
      pendingSearchRequests.delete(
        normalizedQuery
      );
    }
  })();

  pendingSearchRequests.set(
    normalizedQuery,
    request
  );

  return request;
};

// ==================================================
// FETCH CURATED HOMEPAGE ROW
// ==================================================

export const fetchCuratedRow = async (
  idArray
) => {
  if (
    !Array.isArray(idArray) ||
    idArray.length === 0
  ) {
    return [];
  }

  // ==================================================
  // REMOVE DUPLICATE IDS
  // ==================================================

  const uniqueIds =
    [...new Set(
      idArray.filter(Boolean)
    )];

  // ==================================================
  // FETCH MOVIES
  // ==================================================

  const movies =
    await Promise.all(
      uniqueIds.map((id) =>
        getMovieDetails(id)
      )
    );

  return movies.filter(Boolean);
};

// ==================================================
// PERSONALIZED RECOMMENDATIONS
// ==================================================

export const getPersonalizedRecommendations =
  async (watchlist) => {

    if (
      !watchlist ||
      watchlist.length === 0
    ) {
      return [];
    }

    try {

      // --------------------------------------------
      // STEP 1: FIND PREFERRED GENRES
      // --------------------------------------------

      const genreFrequency = {};

      watchlist.forEach((movie) => {

        const genres =
          movie.genres ||
          (
            movie.genre
              ? movie.genre
                  .split(',')
                  .map(
                    (g) =>
                      g.trim()
                  )
              : []
          );

        genres.forEach((genre) => {

          const normalized =
            genre
              .toLowerCase()
              .trim();

          if (
            normalized &&
            normalized !== 'movie'
          ) {
            genreFrequency[
              normalized
            ] =
              (
                genreFrequency[
                  normalized
                ] || 0
              ) + 1;
          }
        });
      });

      // --------------------------------------------
      // STEP 2: SORT GENRES
      // --------------------------------------------

      const preferredGenres =
        Object.entries(
          genreFrequency
        )
          .sort(
            (a, b) =>
              b[1] - a[1]
          )
          .slice(0, 2);

      if (
        !preferredGenres.length
      ) {
        return [];
      }

      // --------------------------------------------
      // STEP 3: SEARCH PREFERRED GENRES
      // --------------------------------------------

      const searchPromises =
        preferredGenres.map(
          async ([genre]) => {

            let searchTerm =
              genre;

            if (
              genre === 'sci-fi'
            ) {
              searchTerm =
                'science fiction';
            }

            return searchMovies(
              searchTerm
            );
          }
        );

      const searchResults =
        await Promise.all(
          searchPromises
        );

      // --------------------------------------------
      // STEP 4: COMBINE
      // --------------------------------------------

      const combinedMovies =
        searchResults.flat();

      // --------------------------------------------
      // STEP 5: REMOVE DUPLICATES
      // --------------------------------------------

      const uniqueMovies =
        Array.from(
          new Map(
            combinedMovies.map(
              (movie) => [
                movie.id ||
                  movie.imdbID,
                movie,
              ]
            )
          ).values()
        );

      // --------------------------------------------
      // STEP 6: EXCLUDE WATCHLIST
      // --------------------------------------------

      const watchlistIds =
        new Set(
          watchlist.map(
            (movie) =>
              movie.id ||
              movie.imdbID
          )
        );

      const candidateMovies =
        uniqueMovies.filter(
          (movie) => {

            const movieId =
              movie.id ||
              movie.imdbID;

            return (
              movieId &&
              !watchlistIds.has(
                movieId
              )
            );
          }
        );

      // --------------------------------------------
      // STEP 7: SCORE MOVIES
      // --------------------------------------------

      const scoredMovies =
        candidateMovies.map(
          (movie) => {

            let score = 0;

            const movieGenres =
              movie.genres ||
              (
                movie.genre
                  ? movie.genre
                      .split(',')
                      .map(
                        (g) =>
                          g.trim()
                      )
                  : []
              );

            // Genre matching
            movieGenres.forEach(
              (genre) => {

                const normalized =
                  genre
                    .toLowerCase()
                    .trim();

                if (
                  genreFrequency[
                    normalized
                  ]
                ) {
                  score +=
                    genreFrequency[
                      normalized
                    ] * 20;
                }
              }
            );

            // IMDb rating
            const rating =
              parseFloat(
                movie.rating
              );

            if (
              !isNaN(rating)
            ) {
              score +=
                rating * 3;
            }

            // Recent movie bonus
            const currentYear =
              new Date().getFullYear();

            const movieYear =
              parseInt(
                String(
                  movie.year || ''
                ).substring(
                  0,
                  4
                ),
                10
              );

            if (
              !isNaN(movieYear)
            ) {

              const age =
                currentYear -
                movieYear;

              if (
                age <= 3
              ) {
                score += 4;

              } else if (
                age <= 8
              ) {
                score += 2;
              }
            }

            return {
              ...movie,

              recommendationScore:
                score,
            };
          }
        );

      // --------------------------------------------
      // STEP 8: SORT
      // --------------------------------------------

      scoredMovies.sort(
        (a, b) =>
          b.recommendationScore -
          a.recommendationScore
      );

      // --------------------------------------------
      // STEP 9: TOP 5
      // --------------------------------------------

      return scoredMovies.slice(
        0,
        5
      );

    } catch (error) {

      console.error(
        'Recommendation error:',
        error
      );

      return [];
    }
  };