const API_KEY =
  import.meta.env.VITE_OMDB_API_KEY;

const BASE_URL = 'https://www.omdbapi.com/';

// ==================================================
// DEV NETWORK MODE
// ==================================================
//
// Normal:
//   Uses 24-hour cache.
//
// Force Network:
//   Bypasses cache and makes real OMDb requests.
//
// Enable in browser console:
//
// localStorage.setItem(
//   'cinevault-force-network',
//   'true'
// );
//
// Then refresh.
//
// Disable:
//
// localStorage.removeItem(
//   'cinevault-force-network'
// );
//
// Then refresh.
//

const FORCE_NETWORK =
  import.meta.env.DEV &&
  localStorage.getItem(
    'cinevault-force-network'
  ) === 'true';

// ==================================================
// CACHE CONFIGURATION
// ==================================================

// Movie details are cached for 24 hours.
const DETAIL_CACHE_KEY =
  'cinevault-omdb-details';

const SEARCH_CACHE_KEY =
  'cinevault-omdb-search';

const CACHE_DURATION =
  24 * 60 * 60 * 1000;

// ==================================================
// IN-MEMORY CACHE
// ==================================================

const detailCache =
  new Map();

const searchCache =
  new Map();

// ==================================================
// PENDING REQUESTS
// ==================================================

// Prevent duplicate movie-detail requests.
const pendingDetailRequests =
  new Map();

// Prevent duplicate search requests.
const pendingSearchRequests =
  new Map();

// ==================================================
// LOCAL STORAGE HELPERS
// ==================================================

const loadLocalCache = (
  key
) => {
  try {
    const saved =
      localStorage.getItem(key);

    if (!saved) {
      return {};
    }

    const parsed =
      JSON.parse(saved);

    return (
      parsed &&
      typeof parsed === 'object'
    )
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

const saveLocalCache = (
  key,
  cache
) => {
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
  loadLocalCache(
    DETAIL_CACHE_KEY
  );

const persistedSearchCache =
  loadLocalCache(
    SEARCH_CACHE_KEY
  );

// ==================================================
// GET CACHED MOVIE
// ==================================================

const getCachedMovie = (
  imdbID
) => {
  if (!imdbID) {
    return null;
  }

  // ----------------------------------------------
  // 1. MEMORY CACHE
  // ----------------------------------------------

  if (
    detailCache.has(imdbID)
  ) {
    return detailCache.get(
      imdbID
    );
  }

  // ----------------------------------------------
  // 2. LOCAL STORAGE CACHE
  // ----------------------------------------------

  const cached =
    persistedDetailCache[
      imdbID
    ];

  if (!cached) {
    return null;
  }

  // ----------------------------------------------
  // 3. EXPIRATION CHECK
  // ----------------------------------------------

  if (
    !cached.timestamp ||
    Date.now() -
      cached.timestamp >
      CACHE_DURATION
  ) {
    delete persistedDetailCache[
      imdbID
    ];

    saveLocalCache(
      DETAIL_CACHE_KEY,
      persistedDetailCache
    );

    return null;
  }

  // ----------------------------------------------
  // 4. RESTORE TO MEMORY
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
  if (
    !imdbID ||
    !movie
  ) {
    return;
  }

  // Memory cache
  detailCache.set(
    imdbID,
    movie
  );

  // localStorage cache
  persistedDetailCache[
    imdbID
  ] = {
    timestamp:
      Date.now(),

    data:
      movie,
  };

  saveLocalCache(
    DETAIL_CACHE_KEY,
    persistedDetailCache
  );
};

// ==================================================
// FORMAT OMDb MOVIE
// ==================================================

const formatMovie = (
  data
) => {
  if (!data) {
    return null;
  }

  return {
    id:
      data.imdbID,

    title:
      data.Title,

    year:
      data.Year,

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
            .map(
              (g) =>
                g.trim()
            )[0]
        : 'Movie',

    genres:
      data.Genre &&
      data.Genre !== 'N/A'
        ? data.Genre
            .split(',')
            .map(
              (g) =>
                g.trim()
            )
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
            .map(
              (name, i) => ({
                name,

                role:
                  'Cast',

                avatar:
                  `https://i.pravatar.cc/150?img=${
                    (i % 50) + 1
                  }`,
              })
            )
        : [],
  };
};

// ==================================================
// GET MOVIE DETAILS
// ==================================================

export const getMovieDetails =
  async (
    imdbID
  ) => {

    if (!imdbID) {
      return null;
    }

    // ==================================================
    // CACHE CHECK
    // ==================================================
    //
    // In normal mode:
    //   Memory cache
    //       ↓
    //   localStorage
    //       ↓
    //   OMDb
    //
    // In force-network mode:
    //   Skip cache
    //       ↓
    //   OMDb
    //

    if (!FORCE_NETWORK) {

      const cachedMovie =
        getCachedMovie(
          imdbID
        );

      if (cachedMovie) {
        console.log(
          `🎬 Detail cache hit: ${imdbID}`
        );

        return cachedMovie;
      }

    } else {

      console.log(
        `🌐 FORCE NETWORK: ${imdbID}`
      );
    }

    // ==================================================
    // PREVENT DUPLICATE REQUESTS
    // ==================================================

    if (
      pendingDetailRequests.has(
        imdbID
      )
    ) {
      console.log(
        `⏳ Sharing pending detail request: ${imdbID}`
      );

      return pendingDetailRequests.get(
        imdbID
      );
    }

    // ==================================================
    // CREATE REQUEST
    // ==================================================

    const request =
      (async () => {

        try {

          console.log(
            `🌐 Fetching movie details: ${imdbID}`
          );

          const res =
            await fetch(
              `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`
            );

          const data =
            await res.json();

          // ----------------------------------------------
          // API ERROR
          // ----------------------------------------------

          if (
            data.Response ===
            'False'
          ) {
            console.warn(
              `OMDb: ${
                data.Error ||
                'Movie not found'
              }`
            );

            return null;
          }

          // ----------------------------------------------
          // FORMAT MOVIE
          // ----------------------------------------------

          const formattedMovie =
            formatMovie(
              data
            );

          // ----------------------------------------------
          // SAVE TO CACHE
          // ----------------------------------------------

          cacheMovie(
            imdbID,
            formattedMovie
          );

          console.log(
            `💾 Cached movie details: ${imdbID}`
          );

          return formattedMovie;

        } catch (error) {

          console.error(
            `Error fetching ID ${imdbID}:`,
            error
          );

          return null;

        } finally {

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
    query
      .trim()
      .toLowerCase();

  // ----------------------------------------------
  // MEMORY CACHE
  // ----------------------------------------------

  if (
    searchCache.has(
      normalizedQuery
    )
  ) {
    return searchCache.get(
      normalizedQuery
    );
  }

  // ----------------------------------------------
  // LOCAL STORAGE CACHE
  // ----------------------------------------------

  const cached =
    persistedSearchCache[
      normalizedQuery
    ];

  if (!cached) {
    return null;
  }

  // ----------------------------------------------
  // EXPIRATION CHECK
  // ----------------------------------------------

  if (
    !cached.timestamp ||
    Date.now() -
      cached.timestamp >
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

  // ----------------------------------------------
  // RESTORE TO MEMORY
  // ----------------------------------------------

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
    query
      .trim()
      .toLowerCase();

  // Memory cache
  searchCache.set(
    normalizedQuery,
    results
  );

  // localStorage cache
  persistedSearchCache[
    normalizedQuery
  ] = {
    timestamp:
      Date.now(),

    data:
      results,
  };

  saveLocalCache(
    SEARCH_CACHE_KEY,
    persistedSearchCache
  );
};

// ==================================================
// SEARCH MOVIES
// ==================================================

export const searchMovies =
  async (
    query
  ) => {

    if (
      !query?.trim()
    ) {
      return [];
    }

    const normalizedQuery =
      query
        .trim()
        .toLowerCase();

    // ==================================================
    // CACHE CHECK
    // ==================================================

    if (!FORCE_NETWORK) {

      // ----------------------------------------------
      // MEMORY CACHE
      // ----------------------------------------------

      if (
        searchCache.has(
          normalizedQuery
        )
      ) {
        console.log(
          `🔎 Search memory cache hit: "${normalizedQuery}"`
        );

        return searchCache.get(
          normalizedQuery
        );
      }

      // ----------------------------------------------
      // LOCAL STORAGE CACHE
      // ----------------------------------------------

      const cachedSearch =
        getCachedSearch(
          query
        );

      if (cachedSearch) {

        console.log(
          `💾 Search localStorage cache hit: "${normalizedQuery}"`
        );

        return cachedSearch;
      }

    } else {

      console.log(
        `🌐 FORCE NETWORK SEARCH: "${normalizedQuery}"`
      );
    }

    // ==================================================
    // PREVENT DUPLICATE SEARCH REQUESTS
    // ==================================================

    if (
      pendingSearchRequests.has(
        normalizedQuery
      )
    ) {

      console.log(
        `⏳ Sharing pending search request: "${normalizedQuery}"`
      );

      return pendingSearchRequests.get(
        normalizedQuery
      );
    }

    // ==================================================
    // CREATE SEARCH REQUEST
    // ==================================================

    const request =
      (async () => {

        try {

          console.log(
            `🌐 Searching OMDb: "${normalizedQuery}"`
          );

          // --------------------------------------------
          // ONLY ONE OMDb SEARCH REQUEST
          // --------------------------------------------

          const res =
            await fetch(
              `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
                query.trim()
              )}&type=movie`
            );

          const data =
            await res.json();

          // --------------------------------------------
          // API ERROR
          // --------------------------------------------

          if (
            data.Response ===
            'False'
          ) {

            cacheSearch(
              query,
              []
            );

            return [];
          }

          // --------------------------------------------
          // SEARCH RESULTS
          // --------------------------------------------

          const rawResults =
            (
              data.Search ||
              []
            ).slice(
              0,
              6
            );

          // --------------------------------------------
          // IMPORTANT:
          // DO NOT FETCH DETAILS HERE.
          //
          // This prevents:
          //
          // 1 search request
          // +
          // 6 detail requests
          //
          // Instead:
          //
          // 1 search request only.
          // --------------------------------------------

          const results =
            rawResults.map(
              (item) => ({
                id:
                  item.imdbID,

                title:
                  item.Title,

                year:
                  item.Year,

                poster:
                  item.Poster !==
                  'N/A'
                    ? item.Poster
                    : 'https://via.placeholder.com/300x450?text=No+Poster',

                rating:
                  null,

                genre:
                  'Movie',

                genres:
                  ['Movie'],
              })
            );

          // --------------------------------------------
          // CACHE SEARCH RESULTS
          // --------------------------------------------

          cacheSearch(
            query,
            results
          );

          console.log(
            `💾 Cached search: "${normalizedQuery}"`
          );

          return results;

        } catch (error) {

          console.error(
            'Search error:',
            error
          );

          throw new Error(
            'Failed to fetch search results from OMDb API.',
            {
              cause:
                error,
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

export const fetchCuratedRow =
  async (
    idArray
  ) => {

    if (
      !Array.isArray(
        idArray
      ) ||
      idArray.length === 0
    ) {
      return [];
    }

    // ==================================================
    // REMOVE DUPLICATE IDS
    // ==================================================

    const uniqueIds = [
      ...new Set(
        idArray.filter(
          Boolean
        )
      ),
    ];

    // ==================================================
    // FETCH MOVIES
    // ==================================================

    const movies =
      await Promise.all(
        uniqueIds.map(
          (id) =>
            getMovieDetails(
              id
            )
        )
      );

    return movies.filter(
      Boolean
    );
  };

// ==================================================
// PERSONALIZED RECOMMENDATIONS
// ==================================================

export const getPersonalizedRecommendations =
  async (
    watchlist
  ) => {

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

      const genreFrequency =
        {};

      watchlist.forEach(
        (movie) => {

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

          genres.forEach(
            (genre) => {

              const normalized =
                genre
                  .toLowerCase()
                  .trim();

              if (
                normalized &&
                normalized !==
                  'movie'
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
            }
          );
        }
      );

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
          .slice(
            0,
            2
          );

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
              genre ===
              'sci-fi'
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
              !isNaN(
                rating
              )
            ) {

              score +=
                rating * 3;
            }

            // Recent movie bonus
            const currentYear =
              new Date()
                .getFullYear();

            const movieYear =
              parseInt(
                String(
                  movie.year ||
                    ''
                ).substring(
                  0,
                  4
                ),
                10
              );

            if (
              !isNaN(
                movieYear
              )
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

// ==================================================
// OPTIONAL CACHE CLEAR FUNCTIONS
// ==================================================

export const clearMovieCache =
  () => {

    detailCache.clear();

    deleteAllLocalStorageEntries(
      DETAIL_CACHE_KEY
    );

    console.log(
      '🗑️ Movie detail cache cleared'
    );
  };

export const clearSearchCache =
  () => {

    searchCache.clear();

    deleteAllLocalStorageEntries(
      SEARCH_CACHE_KEY
    );

    console.log(
      '🗑️ Search cache cleared'
    );
  };

export const clearAllMovieCache =
  () => {

    detailCache.clear();
    searchCache.clear();

    deleteAllLocalStorageEntries(
      DETAIL_CACHE_KEY
    );

    deleteAllLocalStorageEntries(
      SEARCH_CACHE_KEY
    );

    console.log(
      '🗑️ All CineVault API caches cleared'
    );
  };

// ==================================================
// LOCAL STORAGE CACHE DELETE HELPER
// ==================================================

const deleteAllLocalStorageEntries =
  (key) => {

    try {

      localStorage.removeItem(
        key
      );

    } catch (error) {

      console.warn(
        `Failed to clear cache "${key}":`,
        error
      );
    }
  };