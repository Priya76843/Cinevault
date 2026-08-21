import React from "react";

const ErrorState = ({ onRetry }) => {
  return (
    <div className="min-h-screen bg-[#08080A] text-white flex flex-col">

      {/* ================= NAVBAR ================= */}
      <nav className="h-[54px] bg-[#111115] border-b border-[#1C1C21] flex items-center px-6 md:px-12 lg:px-20">

        {/* Logo */}
        <div className="flex items-center gap-2">

          <div className="w-5 h-5 bg-[#F5B82E] rounded-[3px] flex items-center justify-center">
            <span className="text-[10px] font-bold text-black">
              C
            </span>
          </div>

          <span className="text-sm font-semibold">
            CineVault
          </span>

        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-7 ml-auto mr-8 text-[10px] text-gray-400">
          <span className="text-white">Home</span>
          <span>Trending</span>
          <span>Top Rated</span>
          <span>Genres</span>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center w-[180px] h-7 bg-[#1B1B21] rounded px-3">

          <div className="w-2.5 h-2.5 border border-gray-500 rounded-full mr-2"></div>

          <span className="text-[8px] text-gray-500">
            Search movies, genres...
          </span>

        </div>

      </nav>


      {/* ================= ERROR CONTENT ================= */}
      <main className="flex-1 flex items-center justify-center px-6">

        {/* Error Card */}
        <div className="w-full max-w-[280px] bg-[#111115] border border-[#1D1D23] rounded-md px-6 py-7 text-center shadow-2xl">

          {/* Error Icon */}
          <div className="flex justify-center mb-5">

            <div className="w-8 h-8 rounded-full border border-red-500/60 flex items-center justify-center">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.29 3.86l-7.82 13a2 2 0 001.71 3h15.64a2 2 0 001.71-3l-7.82-13a2 2 0 00-3.42 0z"
                />
              </svg>

            </div>

          </div>


          {/* Heading */}
          <h2 className="text-xs font-semibold text-white mb-2">
            Oops! Something went wrong
          </h2>


          {/* Description */}
          <p className="text-[8px] leading-4 text-gray-500 mb-5">
            We couldn't load the movies right now.
            Please check your connection and try again.
          </p>


          {/* Retry Button */}
          <button
            onClick={onRetry}
            className="w-full h-7 bg-[#F5B82E] hover:bg-[#E5A91F] text-black text-[8px] font-semibold rounded transition-colors duration-200"
          >
            Retry Connection
          </button>

        </div>

      </main>


      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#1B1B20] bg-[#101014] px-6 md:px-12 lg:px-20 py-8">

        <div className="flex flex-col md:flex-row justify-between gap-8">

          {/* Brand */}
          <div>

            <h3 className="text-xs font-semibold mb-2">
              CineVault
            </h3>

            <p className="text-[9px] text-gray-500 max-w-[220px] leading-4">
              Your premium movie discovery experience.
              Explore films, ratings and cinematic information.
            </p>

          </div>


          {/* Footer links */}
          <div className="flex gap-16">

            <div>

              <h4 className="text-[9px] font-semibold mb-3">
                EXPLORE
              </h4>

              <div className="space-y-2 text-[8px] text-gray-500">
                <p>Trending</p>
                <p>Top Lists</p>
                <p>Awards</p>
                <p>Upcoming</p>
              </div>

            </div>


            <div>

              <h4 className="text-[9px] font-semibold mb-3">
                COMMUNITY
              </h4>

              <div className="space-y-2 text-[8px] text-gray-500">
                <p>Editorial</p>
                <p>User Reviews</p>
                <p>Forums</p>
                <p>CineList</p>
              </div>

            </div>

          </div>

        </div>


        {/* Bottom footer */}
        <div className="border-t border-[#1C1C21] mt-7 pt-4 flex justify-between text-[7px] text-gray-600">

          <span>
            © 2026 CineVault. Designed for film lovers.
          </span>

          <span>
            Privacy Policy · Terms of Service
          </span>

        </div>

      </footer>

    </div>
  );
};

export default ErrorState;