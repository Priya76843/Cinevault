// import React from 'react';

const CompareModal = ({ movies = [], onClose }) => {
  if (movies.length !== 2) return null;
  const [m1, m2] = movies;

  // 🤖 SMART AI VERDICT ENGINE
  const getAIVerdict = () => {
    const r1 = parseFloat(m1.rating) || 0;
    const r2 = parseFloat(m2.rating) || 0;

    let winner = null;
    let loser = null;
    let margin = 0;

    if (r1 > r2) {
      winner = m1;
      loser = m2;
      margin = (r1 - r2).toFixed(1);
    } else if (r2 > r1) {
      winner = m2;
      loser = m1;
      margin = (r2 - r1).toFixed(1);
    }

    if (!winner) {
      return {
        title: "It's a Dead Tie!",
        summary: `Both **${m1.title}** and **${m2.title}** share an identical IMDb score of **${m1.rating || 'N/A'}**. If you want a ${m1.genre} film by ${m1.director}, choose **${m1.title}**. If you prefer ${m2.genre} by ${m2.director}, go for **${m2.title}**!`,
      };
    }

    return {
      title: `✨ AI Recommends: ${winner.title}`,
      summary: `**${winner.title}** leads with an IMDb score of **⭐ ${winner.rating}** (+${margin} higher than **${loser.title}**). Directed by **${winner.director}**, it stands out as the superior pick for **${winner.genre}** fans. However, if you're looking for a shorter runtime (${loser.runtime || 'N/A'}), **${loser.title}** is still worth watching!`,
    };
  };

  const aiVerdict = getAIVerdict();

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div 
        className="relative w-full max-w-4xl bg-[#0c0c10] rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 p-8 max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
          <h2 className="text-2xl font-bold text-white m-0 flex items-center gap-2">
            🎬 Movie Comparison
          </h2>
          <button 
            onClick={onClose} 
            className="bg-neutral-800 hover:bg-[#FFB800] hover:text-black text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            ✕ Close
          </button>
        </div>

        {/* 🤖 AI CINEVAULT VERDICT BOX */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#FFB800]/15 via-neutral-900 to-neutral-900 border border-[#FFB800]/40 shadow-lg">
          <div className="flex items-center gap-2 text-[#FFB800] font-bold text-sm mb-1">
            <span className="text-base">🤖</span>
            <span>{aiVerdict.title}</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed m-0">
            {aiVerdict.summary.split('**').map((text, i) =>
              i % 2 === 1 ? <strong key={i} className="text-white">{text}</strong> : text
            )}
          </p>
        </div>

        {/* 1. Header Row: Posters & Titles */}
        <div className="grid grid-cols-3 gap-6 items-end pb-6 border-b border-neutral-800">
          <div>{/* Empty top-left cell */}</div>

          {/* Movie 1 Header */}
          <div className="text-center flex flex-col items-center gap-3 border-r border-neutral-800 pr-6">
            <img 
              src={m1.poster} 
              alt={m1.title} 
              className="w-32 h-44 object-cover rounded-lg shadow-lg border border-neutral-800" 
            />
            <h3 className="text-base font-bold text-[#FFB800] m-0 max-w-full truncate">{m1.title}</h3>
          </div>

          {/* Movie 2 Header */}
          <div className="text-center flex flex-col items-center gap-3 pl-6">
            <img 
              src={m2.poster} 
              alt={m2.title} 
              className="w-32 h-44 object-cover rounded-lg shadow-lg border border-neutral-800" 
            />
            <h3 className="text-base font-bold text-[#FFB800] m-0 max-w-full truncate">{m2.title}</h3>
          </div>
        </div>

        {/* 2. Guaranteed Aligned Data Rows */}
        <div className="divide-y divide-neutral-800/60 text-sm">
          
          {/* Row 1: Rating */}
          <div className="grid grid-cols-3 gap-6 py-4 items-center">
            <span className="text-neutral-400 font-semibold uppercase text-xs tracking-wider">RATING</span>
            <div className="text-center font-bold text-white border-r border-neutral-800 pr-6 flex items-center justify-center gap-1">
              ⭐ {m1.rating || 'N/A'}
            </div>
            <div className="text-center font-bold text-white pl-6 flex items-center justify-center gap-1">
              ⭐ {m2.rating || 'N/A'}
            </div>
          </div>

          {/* Row 2: Release Year */}
          <div className="grid grid-cols-3 gap-6 py-4 items-center">
            <span className="text-neutral-400 font-semibold uppercase text-xs tracking-wider">RELEASE YEAR</span>
            <div className="text-center text-white border-r border-neutral-800 pr-6">{m1.year}</div>
            <div className="text-center text-white pl-6">{m2.year}</div>
          </div>

          {/* Row 3: Runtime */}
          <div className="grid grid-cols-3 gap-6 py-4 items-center">
            <span className="text-neutral-400 font-semibold uppercase text-xs tracking-wider">RUNTIME</span>
            <div className="text-center text-white border-r border-neutral-800 pr-6">{m1.runtime || 'N/A'}</div>
            <div className="text-center text-white pl-6">{m2.runtime || 'N/A'}</div>
          </div>

          {/* Row 4: Primary Genre */}
          <div className="grid grid-cols-3 gap-6 py-4 items-center">
            <span className="text-neutral-400 font-semibold uppercase text-xs tracking-wider">PRIMARY GENRE</span>
            <div className="text-center text-white border-r border-neutral-800 pr-6">{m1.genre || 'N/A'}</div>
            <div className="text-center text-white pl-6">{m2.genre || 'N/A'}</div>
          </div>

          {/* Row 5: Director */}
          <div className="grid grid-cols-3 gap-6 py-4 items-center">
            <span className="text-neutral-400 font-semibold uppercase text-xs tracking-wider">DIRECTOR</span>
            <div className="text-center text-white border-r border-neutral-800 pr-6 truncate">{m1.director || 'N/A'}</div>
            <div className="text-center text-white pl-6 truncate">{m2.director || 'N/A'}</div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CompareModal;