import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // Menggunakan useNavigate untuk navigasi programatik

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleBerandaClick = () => {
    // Navigasi ke halaman /homepage terlebih dahulu
    navigate("/", { replace: true });
    // Kemudian navigasi ke halaman login
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 p-4 shadow-md h-24 flex items-center overflow-hidden transition duration-500">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo & Nama Brand */}
        <div className="flex items-center space-x-3 text-white font-bold">
          <img
            src="/fishfeeder.png"
            alt="Logo"
            className="w-20 h-20 rounded-full object-contain shadow-lg"
          />
          <span className="text-xl tracking-wide">FishFeeder</span>
        </div>

        {/* Tombol Menu Hamburger */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Menu Navigasi di desktop */}
        <div className="hidden lg:flex space-x-6">
          <button
            onClick={handleBerandaClick} // Gunakan handleBerandaClick
            className="text-white text-lg hover:text-yellow-300 hover:scale-105 transition-all duration-300"
          >
            Beranda
          </button>
          <Link
            to="/contact"
            className="text-white text-lg hover:text-yellow-300 hover:scale-105 transition-all duration-300"
          >
            Kontak
          </Link>
          <Link
            to="/profile"
            className="text-white text-lg hover:text-yellow-300 hover:scale-105 transition-all duration-300"
          >
            Profil
          </Link>
        </div>
      </div>

      {/* Dropdown Menu (Mobile) */}
      <div
        className={`lg:hidden bg-gradient-to-br from-white via-white to-white flex flex-col space-y-4 p-4 mt-4 absolute w-full left-0 top-20 z-10 transition-all duration-500 ease-in-out transform ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <Link
          to="/homepage" // Mengarahkan ke /homepage
          className="text-blue-500 text-lg hover:text-yellow-300 transition duration-500 transform hover:scale-105 ml-4"
          onClick={toggleMenu}
        >
          Beranda
        </Link>
        <Link
          to="/contact"
          className="text-blue-500 text-lg hover:text-yellow-300 transition duration-500 transform hover:scale-105 ml-4"
          onClick={toggleMenu}
        >
          Kontak
        </Link>
        <Link
          to="/profile"
          className="text-blue-500 text-lg hover:text-yellow-300 transition duration-500 transform hover:scale-105 ml-4"
          onClick={toggleMenu}
        >
          Profil
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
