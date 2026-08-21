import React from 'react';

const Hero = ({ movie, onMovieClick }) => {
  // Fallback movie if API is loading
  const displayMovie = movie || {
    id: 'tt0816692',
    title: 'INTERSTELLAR',
    genre: 'Adventure',
    runtime: '169 min',
    year: '2014',
    rating: '8.7',
    director: 'Christopher Nolan',
    plot: 'In the near future around the American Midwest, Cooper, an ex-science engineer and pilot, is tied to his farming land with his daughter Murph and son Tom. As devastating sandstorms ravage Earth\'s crops, the people of Earth...',
    poster: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=1920&q=80',
  };

  // Requirement: Opens YouTube search for trailer
  const handleWatchTrailer = () => {
    const query = encodeURIComponent(`${displayMovie.title} trailer`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  // Opens the Movie Detail Modal when clicking "More Info"
  const handleMoreInfo = () => {
    if (onMovieClick) {
      onMovieClick(displayMovie);
    }
  };

  return (
    <section 
      id="home"
      className="relative w-full max-w-[1440px] h-[680px] mx-auto overflow-hidden bg-cinedark"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${displayMovie.banner || displayMovie.poster}')` }}
      ></div>

      {/* Dark Overlays for Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-cinedark via-cinedark/80 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-cinedark via-transparent to-transparent"></div>

      {/* Hero Content Container */}
      <div className="relative h-full flex flex-col justify-between px-20 py-16 z-10">
        
        {/* TOP / META SECTION */}
        <div className="flex flex-col gap-5 mt-16 max-w-[640px]">
          
          {/* Eyebrow Badge + Meta */}
          <div className="flex items-center gap-3">
            <div className="bg-[#FFB800] px-3 py-1 rounded">
              <span className="text-[11px] font-bold text-black tracking-wider">
                CINEVAULT CHOICE
              </span>
            </div>
            <span className="text-[13px] font-medium text-neutral-300">
              {displayMovie.genre} • {displayMovie.runtime} • {displayMovie.year}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-[64px] font-black text-white uppercase leading-none tracking-tight m-0 truncate">
            {displayMovie.title}
          </h1>

          {/* Rating & Director */}
          <div className="flex items-center gap-3">
            {displayMovie.rating && (
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 0.583L8.98 4.594L13.417 5.239L10.208 8.365L10.965 12.784L7 10.699L3.035 12.784L3.792 8.365L0.583 5.239L5.02 4.594L7 0.583Z"
                    fill="#FFB800"
                  />
                </svg>
                <span className="text-[14px] font-semibold text-white">{displayMovie.rating}</span>
              </div>
            )}
            <span className="text-neutral-600 text-[13px]">|</span>
            <span className="text-[13px] font-medium text-neutral-400">
              Directed by {displayMovie.director}
            </span>
          </div>

          {/* Plot */}
          <p className="text-[15px] text-neutral-300 leading-relaxed m-0 max-w-[560px] line-clamp-3">
            {displayMovie.plot}
          </p>
        </div>

        {/* BOTTOM BUTTONS SECTION */}
        <div className="flex items-center gap-3">
          {/* Watch Trailer Button (Yellow) */}
          <button 
            onClick={handleWatchTrailer}
            className="flex items-center gap-2 bg-[#FFB800] text-black px-6 py-3 rounded-lg font-semibold text-[15px] hover:bg-yellow-400 transition-all cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="black">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Trailer
          </button>

          {/* More Info Button (Translucent Dark matching Figma) */}
          <button 
            onClick={handleMoreInfo}
            className="flex items-center gap-2 bg-neutral-800/80 hover:bg-neutral-700 text-white border border-neutral-700/60 px-6 py-3 rounded-lg font-semibold text-[15px] transition-all cursor-pointer backdrop-blur-sm"
          >
            More Info
          </button>
        </div>

      </div>
    </section>
  );
};

export default Hero;