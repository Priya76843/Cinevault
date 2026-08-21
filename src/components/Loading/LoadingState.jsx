import React from 'react';
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const LoadingState = () => {
  return (
    <div className="bg-[#080808] min-h-screen text-white">
      <Navbar />

      <section className="relative w-full max-w-[1440px] h-[680px] mx-auto bg-[#0d0d12] flex flex-col justify-between px-20 py-20">
        <div className="flex flex-col gap-4 mt-8 max-w-[640px]">
          <div className="h-4 w-28 bg-[#1a1a24] rounded-md animate-pulse" />

          <div className="h-10 w-80 bg-[#1a1a24] rounded-lg animate-pulse" />

          <div className="h-5 w-56 bg-[#1a1a24] rounded-md animate-pulse" />

          <div className="h-14 w-[520px] bg-[#1a1a24] rounded-lg animate-pulse" />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-36 h-11 bg-[#1a1a24] rounded-lg animate-pulse" />
          <div className="w-36 h-11 bg-[#1a1a24] rounded-lg animate-pulse" />
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-20 py-10">
        <div className="h-5 w-36 bg-[#1a1a24] rounded-md animate-pulse mb-6" />

        <div className="grid grid-cols-5 gap-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col gap-2.5">
              <div className="aspect-[2/3] bg-[#14141c] rounded-lg animate-pulse" />
              <div className="h-3.5 w-3/4 bg-[#1a1a24] rounded animate-pulse" />
              <div className="h-2.5 w-1/2 bg-[#14141c] rounded animate-pulse" />
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-3 my-16">
          <div className="w-4 h-4 border-2 border-[#FFB800] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-neutral-500">
            Loading your cinematic feed...
          </span>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LoadingState;