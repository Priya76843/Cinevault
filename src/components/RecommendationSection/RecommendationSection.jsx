import React, { useEffect, useMemo, useState } from 'react';
import MovieSection from '../MovieSection/MovieSection';

const RecommendationSection = ({
  favorites = [],
  movies = [],
  onMovieClick,
  onCompare,
  compareList = [],
}) => {
  const [isVisible, setIsVisible] =
    useState(false);

  // ==========================================
  // ✨ ANIMATION
  // ==========================================
  useEffect(() => {
    if (favorites.length > 0) {
      setIsVisible(false);

      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);

      return () => clearTimeout(timer);
    }

    setIsVisible(true);
  }, [favorites]);

  // ==========================================
  // 🎯 PERSONALIZATION ENGINE
  // ==========================================
  const recommendations = useMemo(() => {
    if (
      !favorites.length ||
      !movies.length
    ) {
      return [];
    }

    // ----------------------------------------
    // 1. Calculate user's genre preferences
    // ----------------------------------------
    const genreScores = {};

    favorites.forEach((movie) => {
      let movieGenres = [];

      if (
        Array.isArray(movie.genres)
      ) {
        movieGenres = movie.genres;
      } else if (movie.genre) {
        movieGenres =
          movie.genre
            .split(',')
            .map((genre) =>
              genre.trim()
            );
      }

      movieGenres.forEach((genre) => {
        const normalized =
          genre.toLowerCase().trim();

        if (!normalized) return;

        genreScores[normalized] =
          (genreScores[normalized] || 0) + 1;
      });
    });

    // ----------------------------------------
    // 2. Get favorite IDs
    // ----------------------------------------
    const favoriteIds = new Set(
      favorites.map(
        (movie) =>
          movie.id || movie.imdbID
      )
    );

    // ----------------------------------------
    // 3. Remove duplicate movies
    // ----------------------------------------
    const uniqueMovies = Array.from(
      new Map(
        movies.map((movie) => [
          movie.id || movie.imdbID,
          movie,
        ])
      ).values()
    );

    // ----------------------------------------
    // 4. Score each movie
    // ----------------------------------------
    const scoredMovies =
      uniqueMovies
        .filter((movie) => {
          const id =
            movie.id || movie.imdbID;

          // Don't recommend a movie
          // that the user already liked
          return !favoriteIds.has(id);
        })
        .map((movie) => {
          let movieGenres = [];

          if (
            Array.isArray(movie.genres)
          ) {
            movieGenres =
              movie.genres;
          } else if (movie.genre) {
            movieGenres =
              movie.genre
                .split(',')
                .map((genre) =>
                  genre.trim()
                );
          }

          let score = 0;

          movieGenres.forEach(
            (genre) => {
              const normalized =
                genre.toLowerCase().trim();

              if (
                genreScores[normalized]
              ) {
                score +=
                  genreScores[normalized];
              }
            }
          );

          // Small rating bonus
          const rating =
            parseFloat(movie.rating);

          if (!isNaN(rating)) {
            score += rating / 10;
          }

          return {
            ...movie,
            recommendationScore: score,
          };
        });

    // ----------------------------------------
    // 5. Sort highest match first
    // ----------------------------------------
    return scoredMovies
      .filter(
        (movie) =>
          movie.recommendationScore > 0
      )
      .sort(
        (a, b) =>
          b.recommendationScore -
          a.recommendationScore
      )
      .slice(0, 5);
  }, [favorites, movies]);

  // ==========================================
  // NO FAVORITES
  // ==========================================
  if (favorites.length === 0) {
    return (
      <section className="mb-10">

        <div className="relative overflow-hidden rounded-2xl bg-neutral-950 border border-neutral-900 p-7">

          {/* Animated glow */}
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#FFB800]/10 rounded-full blur-3xl animate-pulse" />

          <div className="relative flex items-center gap-4">

            <div className="w-14 h-14 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/20 flex items-center justify-center text-2xl">
              ❤️
            </div>

            <div>

              <h2 className="text-xl font-bold text-white">
                ✨ Personalized for you
              </h2>

              <p className="text-sm text-neutral-500 mt-1">
                Favorite movies using the ❤️
                button and we'll learn your taste.
              </p>

            </div>

          </div>

        </div>

      </section>
    );
  }

  // ==========================================
  // FAVORITES EXIST BUT NO MATCHES
  // ==========================================
  if (recommendations.length === 0) {
    return (
      <section className="mb-10">

        <div
          className={`relative overflow-hidden rounded-2xl bg-neutral-950 border border-[#FFB800]/20 p-7 transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >

          <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#FFB800]/10 rounded-full blur-3xl animate-pulse" />

          <div className="relative">

            <div className="flex items-center gap-2">

              <span className="text-xl animate-pulse">
                ✨
              </span>

              <h2 className="text-xl font-bold text-white">
                Personalized for you
              </h2>

            </div>

            <p className="text-sm text-neutral-500 mt-2">
              We're learning from your favorite
              movies. Favorite more movies to get
              better recommendations.
            </p>

          </div>

        </div>

      </section>
    );
  }

  // ==========================================
  // ✨ PERSONALIZED RESULTS
  // ==========================================
  return (
    <section className="mb-10">

      {/* HEADER */}
      <div
        className={`relative mb-5 transition-all duration-700 ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-5'
        }`}
      >

        {/* Glow */}
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#FFB800]/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

        <div className="relative flex items-center justify-between">

          <div>

            <div className="flex items-center gap-2">

              <span className="text-xl animate-pulse">
                ✨
              </span>

              <h2 className="text-xl font-bold text-white m-0">
                Personalized for you
              </h2>

            </div>

            <p className="text-xs text-neutral-500 mt-1">
              Recommendations based on your ❤️
              favorites
            </p>

          </div>

          {/* PERSONALIZED BADGE */}
          <div className="hidden sm:flex items-center gap-2 bg-[#FFB800]/10 border border-[#FFB800]/20 px-3 py-1.5 rounded-full">

            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse" />

            <span className="text-[10px] text-[#FFB800] font-bold tracking-wider">
              PERSONALIZED
            </span>

          </div>

        </div>

      </div>

      {/* MOVIES */}
      <div
        className={`transition-all duration-1000 ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-6'
        }`}
      >

        <MovieSection
          title=""
          movies={recommendations}
          cols={5}
          onMovieClick={onMovieClick}
          onCompare={onCompare}
          compareList={compareList}
        />

      </div>

    </section>
  );
};

export default RecommendationSection;