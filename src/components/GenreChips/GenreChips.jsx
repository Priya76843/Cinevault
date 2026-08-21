import React from 'react';

const GenreChips = ({ genres = [], selectedGenre, onSelectGenre }) => {
  const allGenres = ['All', ...genres];

  return (
    <div id="genres" className="mb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white m-0">Browse by Genre</h2>
          {selectedGenre && selectedGenre !== 'All' && (
            <span className="text-xs bg-[#FFB800]/20 text-[#FFB800] px-2.5 py-0.5 rounded-full font-semibold">
              Filtering: {selectedGenre}
            </span>
          )}
        </div>

        {selectedGenre && selectedGenre !== 'All' && (
          <button
            onClick={() => onSelectGenre(null)}
            className="text-xs text-neutral-400 hover:text-[#FFB800] transition-colors cursor-pointer"
          >
            Clear Filter ✕
          </button>
        )}
      </div>

      {/* Genre Chips List */}
      <div className="flex flex-wrap gap-2.5">
        {allGenres.map((genre) => {
          const isActive =
            selectedGenre === genre ||
            (!selectedGenre && genre === 'All');

          return (
            <button
              key={genre}
              onClick={() => onSelectGenre(genre === 'All' ? null : genre)}
              className={`px-5 py-2 rounded-full text-[13px] font-medium border transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#FFB800] text-black border-[#FFB800] font-bold shadow-md shadow-[#FFB800]/20'
                  : 'bg-neutral-900 text-white border-neutral-800 hover:bg-[#FFB800] hover:text-black hover:border-[#FFB800]'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GenreChips;