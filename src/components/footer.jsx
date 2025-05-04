import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-white py-6 mt-12 shadow-inner">
      <div className="container mx-auto text-center px-4">
        {/* Links */}
        <div className="mb-4 flex flex-wrap justify-center gap-6 text-sm md:text-base font-medium">
          <Link
            to="/"
            className="hover:text-yellow-200 transition-colors duration-300"
          >
            BERANDA
          </Link>
          <Link
            to="/profile"
            className="hover:text-yellow-200 transition-colors duration-300"
          >
            PROFIL
          </Link>
          <Link
            to="/contact"
            className="hover:text-yellow-200 transition-colors duration-300"
          >
            KONTAK
          </Link>
        </div>

        {/* Garis pemisah */}
        <hr className="border-white border-opacity-30 mb-4 w-1/2 mx-auto" />

        {/* Copyright */}
        <p className="text-xs md:text-sm text-white/90">
          &copy; {new Date().getFullYear()} Sistem Otomatis Pakan Lele. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
