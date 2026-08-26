const API_KEY =
  import.meta.env.VITE_OMDB_API_KEY || 'd05bd4cd';

const BASE_URL = 'https://www.omdbapi.com/';

// Requirement: Cache detail responses in memory
const detailCache = new Map();

// --------------------------------------------------
// GET MOVIE DETAILS
// --------------------------------------------------
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
      throw new Error(
        data.Error || 'Movie not found'
      );
    }

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
        data.Genre && data.Genre !== 'N/A'
          ? data.Genre.split(',')[0].trim()
          : 'Movie',

      genres:
        data.Genre && data.Genre !== 'N/A'
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
                avatar: `https://i.pravatar.cc/150?img=${
                  (i % 50) + 1
                }`,
              }))
          : [],
    };

    detailCache.set(
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
  }
};

// --------------------------------------------------
// SEARCH MOVIES
// --------------------------------------------------
export const searchMovies = async (query) => {
  if (!query?.trim()) return [];

  try {
    const res = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
        query.trim()
      )}&type=movie`
    );

    const data = await res.json();

    if (data.Response === 'False') {
      return [];
    }

    // Take top 6 results
    const rawResults = (
      data.Search || []
    ).slice(0, 6);

    // Hydrate results with full details
    const hydratedMovies = await Promise.all(
      rawResults.map(async (item) => {
        const details =
          await getMovieDetails(
            item.imdbID
          );

        if (details) {
          return details;
        }

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
      })
    );

    return hydratedMovies.filter(Boolean);
  } catch (error) {
    console.error(
      'Search error:',
      error
    );

    // Preserve the original error
    throw new Error(
      'Failed to fetch search results from OMDb.',
      {
        cause: error,
      }
    );
  }
};

// --------------------------------------------------
// FETCH CURATED HOMEPAGE ROW
// --------------------------------------------------
export const fetchCuratedRow = async (
  idArray
) => {
  const movies = await Promise.all(
    idArray.map((id) =>
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
      // STEP 1: Find user's preferred genres
      // --------------------------------------------
      const genreFrequency = {};

      watchlist.forEach((movie) => {
        const genres =
          movie.genres ||
          (
            movie.genre
              ? movie.genre
                  .split(',')
                  .map((g) => g.trim())
              : []
          );

        genres.forEach((genre) => {
          const normalized =
            genre.toLowerCase().trim();

          if (
            normalized &&
            normalized !== 'movie'
          ) {
            genreFrequency[normalized] =
              (genreFrequency[normalized] || 0) +
              1;
          }
        });
      });

      // --------------------------------------------
      // STEP 2: Sort genres by frequency
      // --------------------------------------------
      const preferredGenres =
        Object.entries(
          genreFrequency
        )
          .sort(
            (a, b) => b[1] - a[1]
          )
          .slice(0, 2);

      if (!preferredGenres.length) {
        return [];
      }

      // --------------------------------------------
      // STEP 3: Search OMDb for preferred genres
      //
      // OMDb doesn't support genre=.
      // We use genre words as search queries,
      // then verify actual genres from movie details.
      // --------------------------------------------
      const searchPromises =
        preferredGenres.map(
          async ([genre]) => {
            let searchTerm = genre;

            // Better search phrases for OMDb
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
      // STEP 4: Combine results
      // --------------------------------------------
      const combinedMovies =
        searchResults.flat();

      // --------------------------------------------
      // STEP 5: Remove duplicate movies
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
      // STEP 6: Exclude watchlist movies
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
      // STEP 7: Score candidates
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
                ).substring(0, 4),
                10
              );

            if (
              !isNaN(movieYear)
            ) {
              const age =
                currentYear -
                movieYear;

              if (age <= 3) {
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
      // STEP 8: Sort highest score first
      // --------------------------------------------
      scoredMovies.sort(
        (a, b) =>
          b.recommendationScore -
          a.recommendationScore
      );

      // --------------------------------------------
      // STEP 9: Return top 5
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