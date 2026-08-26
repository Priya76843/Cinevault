import React from 'react';

const CompareModal = ({ movies = [], onClose }) => {
  if (movies.length !== 2) return null;

  const [m1, m2] = movies;

  // =====================================================
  // HELPERS
  // =====================================================

  // Safely convert rating to a number.
  // Handles:
  // "7.1"
  // "7.1/10"
  // "N/A"
  // undefined
  // null
  const getRatingNumber = (rating) => {
    if (
      rating === undefined ||
      rating === null ||
      rating === '' ||
      rating === 'N/A'
    ) {
      return null;
    }

    const match = String(rating).match(
      /(\d+(?:\.\d+)?)/
    );

    if (!match) return null;

    const value = parseFloat(match[1]);

    return Number.isFinite(value)
      ? value
      : null;
  };

  // Safely convert runtime to minutes.
  // Handles:
  // "132 min"
  // "135 min"
  // "2h 12min"
  // "N/A"
  const getRuntimeMinutes = (runtime) => {
    if (
      runtime === undefined ||
      runtime === null ||
      runtime === '' ||
      runtime === 'N/A'
    ) {
      return null;
    }

    const runtimeString = String(runtime)
      .toLowerCase()
      .trim();

    // ---------------------------------------------
    // Format: "2h 12min"
    // ---------------------------------------------

    const hourMatch =
      runtimeString.match(
        /(\d+)\s*h/
      );

    const minuteMatch =
      runtimeString.match(
        /(\d+)\s*m/
      );

    if (hourMatch) {
      const hours =
        parseInt(hourMatch[1], 10) || 0;

      const minutes =
        minuteMatch
          ? parseInt(
              minuteMatch[1],
              10
            )
          : 0;

      return (
        hours * 60 +
        minutes
      );
    }

    // ---------------------------------------------
    // Format: "132 min"
    // ---------------------------------------------

    const onlyMinutes =
      runtimeString.match(
        /(\d+)/
      );

    if (onlyMinutes) {
      const minutes =
        parseInt(
          onlyMinutes[1],
          10
        );

      return Number.isFinite(minutes)
        ? minutes
        : null;
    }

    return null;
  };

  // =====================================================
  // SMART AI VERDICT ENGINE
  // =====================================================

  const getAIVerdict = () => {
    const r1 = getRatingNumber(
      m1.rating
    );

    const r2 = getRatingNumber(
      m2.rating
    );

    let winner = null;
    let loser = null;

    // ===================================================
    // RATING COMPARISON
    // ===================================================

    if (
      r1 !== null &&
      r2 !== null
    ) {
      if (r1 > r2) {
        winner = m1;
        loser = m2;
      } else if (r2 > r1) {
        winner = m2;
        loser = m1;
      }
    }

    // ===================================================
    // IF ONLY MOVIE 1 HAS A RATING
    // ===================================================

    if (
      !winner &&
      r1 !== null &&
      r2 === null
    ) {
      winner = m1;
      loser = m2;
    }

    // ===================================================
    // IF ONLY MOVIE 2 HAS A RATING
    // ===================================================

    if (
      !winner &&
      r2 !== null &&
      r1 === null
    ) {
      winner = m2;
      loser = m1;
    }

    // ===================================================
    // BOTH RATINGS AVAILABLE AND EXACT TIE
    // ===================================================

    if (
      !winner &&
      r1 !== null &&
      r2 !== null &&
      r1 === r2
    ) {
      return {
        title: "It's a Dead Tie!",

        summary:
          `Both **${m1.title}** and **${m2.title}** ` +
          `share an identical IMDb score of ` +
          `**⭐ ${r1.toFixed(1)}**. ` +
          `If you prefer **${m1.genre || 'this genre'}** ` +
          `with **${m1.director || 'N/A'}**, choose ` +
          `**${m1.title}**. ` +
          `If you prefer **${m2.genre || 'this genre'}** ` +
          `with **${m2.director || 'N/A'}**, go for ` +
          `**${m2.title}**!`,
      };
    }

    // ===================================================
    // NEITHER MOVIE HAS A VALID RATING
    // ===================================================

    if (!winner) {
      return {
        title:
          '🤔 Rating Data Unavailable',

        summary:
          `IMDb ratings are not available for ` +
          `**${m1.title}** and **${m2.title}**. ` +
          `Compare their genre, runtime, and other ` +
          `details to decide which one suits you better.`,
      };
    }

    // ===================================================
    // RATING MARGIN
    // ===================================================

    const winnerRating =
      getRatingNumber(
        winner.rating
      );

    const loserRating =
      getRatingNumber(
        loser.rating
      );

    let ratingComment = '';

    if (
      winnerRating !== null &&
      loserRating !== null
    ) {
      const margin =
        Math.abs(
          winnerRating -
          loserRating
        ).toFixed(1);

      ratingComment =
        `leads with an IMDb score of ` +
        `**⭐ ${winnerRating.toFixed(1)}** ` +
        `(+${margin} higher than ` +
        `**${loser.title}**).`;
    } else if (
      winnerRating !== null &&
      loserRating === null
    ) {
      ratingComment =
        `has an IMDb score of ` +
        `**⭐ ${winnerRating.toFixed(1)}**, ` +
        `while an IMDb rating for ` +
        `**${loser.title}** is currently unavailable.`;
    }

    // ===================================================
    // RUNTIME COMPARISON
    // ===================================================

    const winnerRuntime =
      getRuntimeMinutes(
        winner.runtime
      );

    const loserRuntime =
      getRuntimeMinutes(
        loser.runtime
      );

    let runtimeComment = '';

    // ---------------------------------------------
    // BOTH RUNTIMES AVAILABLE
    // ---------------------------------------------

    if (
      winnerRuntime !== null &&
      loserRuntime !== null
    ) {
      if (
        winnerRuntime <
        loserRuntime
      ) {
        runtimeComment =
          `It is also the shorter watch at ` +
          `**${winner.runtime}**, compared with ` +
          `**${loser.runtime}** for ` +
          `**${loser.title}**.`;
      } else if (
        winnerRuntime >
        loserRuntime
      ) {
        runtimeComment =
          `It is a longer watch at ` +
          `**${winner.runtime}**, while ` +
          `**${loser.title}** runs for ` +
          `**${loser.runtime}**.`;
      } else {
        runtimeComment =
          `Both movies have the same runtime of ` +
          `**${winner.runtime}**.`;
      }
    }

    // ---------------------------------------------
    // ONLY WINNER RUNTIME AVAILABLE
    // ---------------------------------------------

    else if (
      winnerRuntime !== null &&
      loserRuntime === null
    ) {
      runtimeComment =
        `It has a runtime of ` +
        `**${winner.runtime}**.`;
    }

    // ---------------------------------------------
    // ONLY LOSER RUNTIME AVAILABLE
    // ---------------------------------------------

    else if (
      winnerRuntime === null &&
      loserRuntime !== null
    ) {
      runtimeComment =
        `**${loser.title}** has a runtime of ` +
        `**${loser.runtime}**.`;
    }

    // ===================================================
    // FINAL VERDICT
    // ===================================================

    const genre =
      winner.genre ||
      'movie';

    const director =
      winner.director ||
      'N/A';

    let summary =
      `**${winner.title}** ${ratingComment} ` +
      `Directed by **${director}**, it stands out ` +
      `as the superior pick for ` +
      `**${genre}** fans.`;

    if (runtimeComment) {
      summary += ` ${runtimeComment}`;
    }

    return {
      title:
        `✨ AI Recommends: ${winner.title}`,

      summary,
    };
  };

  const aiVerdict =
    getAIVerdict();

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-[120]
        flex
        items-center
        justify-center
        bg-black/85
        backdrop-blur-md
        p-4
      "
      onClick={onClose}
    >

      {/* =================================================
          MODAL CARD
      ================================================= */}

      <div
        className="
          relative
          w-full
          max-w-4xl
          bg-[#0c0c10]
          rounded-2xl
          overflow-hidden
          shadow-2xl
          border
          border-neutral-800
          p-8
          max-h-[90vh]
          overflow-y-auto
          no-scrollbar
        "
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            justify-between
            items-center
            mb-6
            border-b
            border-neutral-800
            pb-4
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              text-white
              m-0
              flex
              items-center
              gap-2
            "
          >
            🎬 Movie Comparison
          </h2>

          <button
            onClick={onClose}
            className="
              bg-neutral-800
              hover:bg-[#FFB800]
              hover:text-black
              text-white
              px-4
              py-1.5
              rounded-lg
              text-xs
              font-bold
              transition-colors
              cursor-pointer
            "
          >
            ✕ Close
          </button>

        </div>

        {/* =================================================
            AI VERDICT
        ================================================= */}

        <div
          className="
            mb-6
            p-4
            rounded-xl
            bg-gradient-to-r
            from-[#FFB800]/15
            via-neutral-900
            to-neutral-900
            border
            border-[#FFB800]/40
            shadow-lg
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              text-[#FFB800]
              font-bold
              text-sm
              mb-1
            "
          >
            <span className="text-base">
              🤖
            </span>

            <span>
              {aiVerdict.title}
            </span>
          </div>

          <p
            className="
              text-xs
              text-neutral-300
              leading-relaxed
              m-0
            "
          >
            {aiVerdict.summary
              .split('**')
              .map(
                (text, i) =>
                  i % 2 === 1 ? (
                    <strong
                      key={i}
                      className="text-white"
                    >
                      {text}
                    </strong>
                  ) : (
                    text
                  )
              )}
          </p>

        </div>

        {/* =================================================
            POSTERS + TITLES
        ================================================= */}

        <div
          className="
            grid
            grid-cols-3
            gap-6
            items-end
            pb-6
            border-b
            border-neutral-800
          "
        >

          <div />

          {/* MOVIE 1 */}

          <div
            className="
              text-center
              flex
              flex-col
              items-center
              gap-3
              border-r
              border-neutral-800
              pr-6
            "
          >

            <img
              src={m1.poster}
              alt={m1.title}
              className="
                w-32
                h-44
                object-cover
                rounded-lg
                shadow-lg
                border
                border-neutral-800
              "
              onError={(e) => {
                e.currentTarget.src =
                  'https://via.placeholder.com/300x450?text=No+Poster';
              }}
            />

            <h3
              className="
                text-base
                font-bold
                text-[#FFB800]
                m-0
                max-w-full
                truncate
              "
            >
              {m1.title}
            </h3>

          </div>

          {/* MOVIE 2 */}

          <div
            className="
              text-center
              flex
              flex-col
              items-center
              gap-3
              pl-6
            "
          >

            <img
              src={m2.poster}
              alt={m2.title}
              className="
                w-32
                h-44
                object-cover
                rounded-lg
                shadow-lg
                border
                border-neutral-800
              "
              onError={(e) => {
                e.currentTarget.src =
                  'https://via.placeholder.com/300x450?text=No+Poster';
              }}
            />

            <h3
              className="
                text-base
                font-bold
                text-[#FFB800]
                m-0
                max-w-full
                truncate
              "
            >
              {m2.title}
            </h3>

          </div>

        </div>

        {/* =================================================
            DATA ROWS
        ================================================= */}

        <div
          className="
            divide-y
            divide-neutral-800/60
            text-sm
          "
        >

          {/* RATING */}

          <div
            className="
              grid
              grid-cols-3
              gap-6
              py-4
              items-center
            "
          >

            <span
              className="
                text-neutral-400
                font-semibold
                uppercase
                text-xs
                tracking-wider
              "
            >
              RATING
            </span>

            <div
              className="
                text-center
                font-bold
                text-white
                border-r
                border-neutral-800
                pr-6
                flex
                items-center
                justify-center
                gap-1
              "
            >
              ⭐ {m1.rating || 'N/A'}
            </div>

            <div
              className="
                text-center
                font-bold
                text-white
                pl-6
                flex
                items-center
                justify-center
                gap-1
              "
            >
              ⭐ {m2.rating || 'N/A'}
            </div>

          </div>

          {/* RELEASE YEAR */}

          <div
            className="
              grid
              grid-cols-3
              gap-6
              py-4
              items-center
            "
          >

            <span
              className="
                text-neutral-400
                font-semibold
                uppercase
                text-xs
                tracking-wider
              "
            >
              RELEASE YEAR
            </span>

            <div
              className="
                text-center
                text-white
                border-r
                border-neutral-800
                pr-6
              "
            >
              {m1.year || 'N/A'}
            </div>

            <div
              className="
                text-center
                text-white
                pl-6
              "
            >
              {m2.year || 'N/A'}
            </div>

          </div>

          {/* RUNTIME */}

          <div
            className="
              grid
              grid-cols-3
              gap-6
              py-4
              items-center
            "
          >

            <span
              className="
                text-neutral-400
                font-semibold
                uppercase
                text-xs
                tracking-wider
              "
            >
              RUNTIME
            </span>

            <div
              className="
                text-center
                text-white
                border-r
                border-neutral-800
                pr-6
              "
            >
              {m1.runtime || 'N/A'}
            </div>

            <div
              className="
                text-center
                text-white
                pl-6
              "
            >
              {m2.runtime || 'N/A'}
            </div>

          </div>

          {/* GENRE */}

          <div
            className="
              grid
              grid-cols-3
              gap-6
              py-4
              items-center
            "
          >

            <span
              className="
                text-neutral-400
                font-semibold
                uppercase
                text-xs
                tracking-wider
              "
            >
              PRIMARY GENRE
            </span>

            <div
              className="
                text-center
                text-white
                border-r
                border-neutral-800
                pr-6
              "
            >
              {m1.genre || 'N/A'}
            </div>

            <div
              className="
                text-center
                text-white
                pl-6
              "
            >
              {m2.genre || 'N/A'}
            </div>

          </div>

          {/* DIRECTOR */}

          <div
            className="
              grid
              grid-cols-3
              gap-6
              py-4
              items-center
            "
          >

            <span
              className="
                text-neutral-400
                font-semibold
                uppercase
                text-xs
                tracking-wider
              "
            >
              DIRECTOR
            </span>

            <div
              className="
                text-center
                text-white
                border-r
                border-neutral-800
                pr-6
                truncate
              "
            >
              {m1.director || 'N/A'}
            </div>

            <div
              className="
                text-center
                text-white
                pl-6
                truncate
              "
            >
              {m2.director || 'N/A'}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CompareModal;