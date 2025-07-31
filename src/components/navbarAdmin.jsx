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
    navigate("/homepage", { replace: true });
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
      </div>
    </nav>
  );
};

export default Navbar;
