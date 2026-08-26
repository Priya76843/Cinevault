import React, { useEffect, useState } from 'react';

const CompareAnimation = ({
  movieA,
  movieB,
  onComplete,
}) => {
  const [showFlash, setShowFlash] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const flashTimer = setTimeout(() => {
      setShowFlash(true);
    }, 600);

    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 680);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1100);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!movieA || !movieB) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-black/90 backdrop-blur-md">

      {/* =========================================
          BACKGROUND GLOW
      ========================================= */}

      <div className="
        absolute
        w-[500px]
        h-[500px]
        rounded-full
        bg-[#FFB800]/5
        blur-[120px]
      " />

      {/* =========================================
          MOVIE A
      ========================================= */}

      <div className="
        compare-poster
        compare-poster-left
        absolute
        z-10
      ">

        <div className="relative">

          <img
            src={movieA.poster}
            alt={movieA.title || 'Movie'}
            className="
              w-44
              h-64
              md:w-52
              md:h-72
              object-cover
              rounded-xl
              border
              border-neutral-700
              shadow-[0_0_40px_rgba(0,0,0,0.8)]
            "
            onError={(e) => {
              e.currentTarget.src =
                'https://via.placeholder.com/300x450?text=No+Poster';
            }}
          />

          <div className="
            absolute
            inset-0
            rounded-xl
            bg-gradient-to-r
            from-transparent
            to-black/30
          " />

        </div>

        <p className="
          mt-3
          text-center
          text-white
          font-bold
          text-sm
          max-w-52
          truncate
        ">
          {movieA.title}
        </p>

      </div>

      {/* =========================================
          MOVIE B
      ========================================= */}

      <div className="
        compare-poster
        compare-poster-right
        absolute
        z-10
      ">

        <div className="relative">

          <img
            src={movieB.poster}
            alt={movieB.title || 'Movie'}
            className="
              w-44
              h-64
              md:w-52
              md:h-72
              object-cover
              rounded-xl
              border
              border-neutral-700
              shadow-[0_0_40px_rgba(0,0,0,0.8)]
            "
            onError={(e) => {
              e.currentTarget.src =
                'https://via.placeholder.com/300x450?text=No+Poster';
            }}
          />

          <div className="
            absolute
            inset-0
            rounded-xl
            bg-gradient-to-l
            from-transparent
            to-black/30
          " />

        </div>

        <p className="
          mt-3
          text-center
          text-white
          font-bold
          text-sm
          max-w-52
          truncate
        ">
          {movieB.title}
        </p>

      </div>

      {/* =========================================
          COLLISION EFFECT
      ========================================= */}

      {showFlash && (
        <>
          {/* Main flash */}
          <div className="
            compare-flash
            absolute
            z-30
          " />

          {/* Expanding ring */}
          <div className="
            compare-ring
            absolute
            z-20
          " />

          {/* Particles */}
          <span className="
            compare-particle
            particle-1
          " />

          <span className="
            compare-particle
            particle-2
          " />

          <span className="
            compare-particle
            particle-3
          " />

          <span className="
            compare-particle
            particle-4
          " />

          <span className="
            compare-particle
            particle-5
          " />

          <span className="
            compare-particle
            particle-6
          " />

          <span className="
            compare-particle
            particle-7
          " />

          <span className="
            compare-particle
            particle-8
          " />
        </>
      )}

      {/* =========================================
          COMPARE TEXT
      ========================================= */}

      {showText && (
        <div className="
          absolute
          z-40
          flex
          flex-col
          items-center
        ">

          <div className="
            text-[#FFB800]
            text-xs
            tracking-[0.5em]
            font-semibold
            mb-2
          ">
            MOVIES COLLIDED
          </div>

          <div className="
            compare-title
            text-4xl
            md:text-6xl
            font-black
            text-white
            tracking-widest
          ">
            COMPARE
          </div>

          <div className="
            mt-2
            h-[2px]
            w-32
            bg-[#FFB800]
            rounded-full
          " />

        </div>
      )}

      {/* =========================================
          ANIMATIONS
      ========================================= */}

      <style>{`

        /* ========================================
           LEFT POSTER
        ======================================== */

        .compare-poster-left {
          animation:
            compareLeft
            650ms
            cubic-bezier(.22,1,.36,1)
            forwards;
        }

        @keyframes compareLeft {

          0% {
            transform:
              translateX(-520px)
              scale(.72)
              rotate(-7deg);
            opacity: 0;
          }

          30% {
            opacity: 1;
          }

          72% {
            transform:
              translateX(-30px)
              scale(1.05)
              rotate(-1deg);
          }

          100% {
            transform:
              translateX(0)
              scale(1)
              rotate(0deg);
            opacity: 1;
          }

        }


        /* ========================================
           RIGHT POSTER
        ======================================== */

        .compare-poster-right {
          animation:
            compareRight
            650ms
            cubic-bezier(.22,1,.36,1)
            forwards;
        }

        @keyframes compareRight {

          0% {
            transform:
              translateX(520px)
              scale(.72)
              rotate(7deg);
            opacity: 0;
          }

          30% {
            opacity: 1;
          }

          72% {
            transform:
              translateX(30px)
              scale(1.05)
              rotate(1deg);
          }

          100% {
            transform:
              translateX(0)
              scale(1)
              rotate(0deg);
            opacity: 1;
          }

        }


        /* ========================================
           FLASH
        ======================================== */

        .compare-flash {
          width: 180px;
          height: 180px;
          border-radius: 9999px;

          background: white;

          box-shadow:
            0 0 30px white,
            0 0 70px #FFB800,
            0 0 130px #FFB800;

          animation:
            collisionFlash
            380ms
            ease-out
            forwards;
        }

        @keyframes collisionFlash {

          0% {
            transform: scale(.15);
            opacity: 1;
          }

          35% {
            transform: scale(1.15);
            opacity: 1;
          }

          100% {
            transform: scale(2.2);
            opacity: 0;
          }

        }


        /* ========================================
           RING
        ======================================== */

        .compare-ring {
          width: 80px;
          height: 80px;

          border:
            3px solid #FFB800;

          border-radius: 9999px;

          animation:
            collisionRing
            550ms
            ease-out
            forwards;
        }

        @keyframes collisionRing {

          0% {
            transform: scale(.3);
            opacity: 1;
          }

          100% {
            transform: scale(4);
            opacity: 0;
          }

        }


        /* ========================================
           PARTICLES
        ======================================== */

        .compare-particle {
          position: absolute;

          width: 7px;
          height: 7px;

          background: #FFB800;

          border-radius: 9999px;

          box-shadow:
            0 0 12px #FFB800;

          z-index: 35;

          animation-duration: 550ms;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }


        .particle-1 {
          animation-name: particle1;
        }

        .particle-2 {
          animation-name: particle2;
        }

        .particle-3 {
          animation-name: particle3;
        }

        .particle-4 {
          animation-name: particle4;
        }

        .particle-5 {
          animation-name: particle5;
        }

        .particle-6 {
          animation-name: particle6;
        }

        .particle-7 {
          animation-name: particle7;
        }

        .particle-8 {
          animation-name: particle8;
        }


        @keyframes particle1 {
          to {
            transform:
              translate(-150px, -100px)
              scale(0);
            opacity: 0;
          }
        }

        @keyframes particle2 {
          to {
            transform:
              translate(150px, -90px)
              scale(0);
            opacity: 0;
          }
        }

        @keyframes particle3 {
          to {
            transform:
              translate(-170px, 70px)
              scale(0);
            opacity: 0;
          }
        }

        @keyframes particle4 {
          to {
            transform:
              translate(170px, 80px)
              scale(0);
            opacity: 0;
          }
        }

        @keyframes particle5 {
          to {
            transform:
              translate(-75px, -145px)
              scale(0);
            opacity: 0;
          }
        }

        @keyframes particle6 {
          to {
            transform:
              translate(85px, 145px)
              scale(0);
            opacity: 0;
          }
        }

        @keyframes particle7 {
          to {
            transform:
              translate(-190px, -20px)
              scale(0);
            opacity: 0;
          }
        }

        @keyframes particle8 {
          to {
            transform:
              translate(190px, 20px)
              scale(0);
            opacity: 0;
          }
        }


        /* ========================================
           COMPARE TITLE
        ======================================== */

        .compare-title {
          animation:
            compareTitle
            420ms
            cubic-bezier(.17,.67,.35,1.4)
            forwards;
        }

        @keyframes compareTitle {

          0% {
            opacity: 0;
            transform: scale(.5);
            letter-spacing: .8em;
          }

          60% {
            opacity: 1;
            transform: scale(1.12);
          }

          100% {
            opacity: 1;
            transform: scale(1);
            letter-spacing: .25em;
          }

        }

      `}</style>

    </div>
  );
};

export default CompareAnimation;