import React from 'react';

const Footer = () => {
  const exploreLinks = ['Trending', 'Top Lists', 'Awards', 'Upcoming'];
  const communityLinks = ['Editorial', 'User Reviews', 'Forums', 'CineList'];

  return (
    <footer className="w-full max-w-[1440px] mx-auto bg-cinedark px-20 pt-15 pb-8 border-t border-neutral-900" style={{ paddingTop: '60px' }}>
      <div className="flex flex-col gap-10">
        {/* Footer Columns */}
        <div className="flex justify-between items-start gap-15">
          {/* About */}
          <div className="max-w-[380px] flex flex-col gap-3.5">
            <h2 className="text-2xl font-bold text-white m-0 tracking-wide">CineVault</h2>
            <p className="text-[13px] leading-relaxed text-neutral-500 m-0">
              Your premium curation engine for everything cinema. Track your
              watchlist, discover hidden gems, and stream the latest masterworks.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-24">
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-white tracking-widest m-0">EXPLORE</h3>
              <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                {exploreLinks.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[13px] text-neutral-500 hover:text-cineyellow transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-white tracking-widest m-0">COMMUNITY</h3>
              <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                {communityLinks.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[13px] text-neutral-500 hover:text-cineyellow transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-neutral-900"></div>

        {/* Footer Bottom */}
        <div className="flex justify-between items-center">
          <p className="text-xs text-neutral-600 m-0">
            © 2026 CineVault Premium. Designed for film purists.
          </p>
          <div className="flex items-center gap-2">
            <a href="#" className="text-xs text-neutral-500 hover:text-cineyellow transition-colors">
              Privacy Policy
            </a>
            <span className="text-neutral-700 text-xs">•</span>
            <a href="#" className="text-xs text-neutral-500 hover:text-cineyellow transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;