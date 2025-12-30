import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0">
            <img src="/logo.png" alt="Infinity Comics" className="h-10 w-auto" />
            <span className="ml-3 text-lg font-bold text-zinc-100">Database Manager</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-6 text-sm text-zinc-300">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive("/")
                  ? "text-[#FF522D] bg-zinc-800/50"
                  : "hover:text-[#FF522D] hover:bg-zinc-800/30"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Inicio
            </Link>
            <Link
              to="/series"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive("/series") || location.pathname.startsWith("/series/")
                  ? "text-[#FF522D] bg-zinc-800/50"
                  : "hover:text-[#FF522D] hover:bg-zinc-800/30"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Series
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-300 hover:text-[#FF522D] hover:bg-zinc-800/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive("/")
                  ? "text-[#FF522D] bg-zinc-800/50"
                  : "text-zinc-300 hover:text-[#FF522D] hover:bg-zinc-800/50"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">Inicio</span>
            </Link>
            <Link
              to="/series"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive("/series") || location.pathname.startsWith("/series/")
                  ? "text-[#FF522D] bg-zinc-800/50"
                  : "text-zinc-300 hover:text-[#FF522D] hover:bg-zinc-800/50"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="font-medium">Series</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

