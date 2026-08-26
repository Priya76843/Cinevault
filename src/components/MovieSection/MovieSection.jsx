import React from 'react';
import MovieCard from '../MovieCard/MovieCard';

const MovieSection = ({
  title,
  movies = [],
  cols = 5,
  onMovieClick,
  onCompare,
  compareList = [],
  onFavorite,
}) => {
  const gridColsClass = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    8: 'grid-cols-8',
  }[cols] || 'grid-cols-5';

  const gapClass =
    cols === 8 ? 'gap-3.5' : 'gap-5';

  return (
    <div className="mb-10">

      {/* Section Header */}
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white m-0">
            {title}
          </h2>
        </div>
      )}

      {/* Movie Grid */}
      <div
        className={`grid ${gridColsClass} ${gapClass}`}
      >
        {movies.map((movie, index) => (
          <MovieCard
            key={
              movie.id ||
              movie.imdbID ||
              index
            }
            movie={movie}
            onClick={onMovieClick}
            onCompare={onCompare}
            compareList={compareList}
            onFavorite={onFavorite}
          />
        ))}
      </div>

    </div>
  );
};

export default MovieSection;