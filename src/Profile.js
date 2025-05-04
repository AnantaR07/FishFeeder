import React from "react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

const Profile = () => {
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-white-500">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-96 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          {/* Foto Profil */}
          <img
            src="/gilang.jpg"
            alt="Foto Diri"
            className="w-36 h-36 rounded-full mx-auto border-8 border-gradient-to-r from-green-400 via-blue-500 to-purple-600 shadow-lg transform transition-transform duration-500 hover:scale-110"
          />

          {/* Biodata */}
          <h2 className="text-2xl font-bold text-gray-800 mt-6">
            NAMA: Ibrahim Gilang Ramadhan
          </h2>
          <p className="text-gray-600 text-sm mt-2">Umur: 24 Tahun </p>
          <p className="text-gray-600 text-sm">Alamat: Malang, Jawa Timur </p>
          <p className="text-gray-600 text-sm">Profesi: Network Engineer</p>
          <p className="text-gray-600 text-sm mt-4 italic">
            "Bersemangat tentang teknologi dan inovasi."
          </p>

          {/* Kontak & Media Sosial */}
          <div className="flex justify-center space-x-6 mt-6">
            <a
              href="#"
              className="text-blue-500 hover:text-blue-700 text-2xl transition-colors duration-300"
            >
              <i className="fab fa-facebook"></i>
            </a>
            <a
              href="#"
              className="text-blue-400 hover:text-blue-600 text-2xl transition-colors duration-300"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="#"
              className="text-pink-500 hover:text-pink-700 text-2xl transition-colors duration-300"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
