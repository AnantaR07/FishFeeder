import React from "react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

<style>{`
        @keyframes gradientX {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-x {
          animation: gradientX 6s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>;

const ContactInfo = () => {
  return (
    <div className="min-h-screen text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 animate-gradient-x">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-white-500">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg text-center transform transition-all duration-300 hover:scale-105">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            📞 Hubungi Kami
          </h2>

          {/* Alamat */}
          <div className="flex items-center justify-center text-gray-600 mb-6">
            <FaMapMarkerAlt className="text-green-500 text-2xl mr-4 transform transition-all duration-300 hover:scale-110" />
            <p className="text-lg">Malang</p>
          </div>

          {/* Telepon */}
          <div className="flex items-center justify-center text-gray-600 mb-6">
            <FaPhone className="text-green-500 text-2xl mr-4 transform transition-all duration-300 hover:scale-110" />
            <p className="text-lg">+62 822-2416-2259</p>
          </div>

          {/* Email */}
          <div className="flex items-center justify-center text-gray-600 mb-8">
            <FaEnvelope className="text-green-500 text-2xl mr-4 transform transition-all duration-300 hover:scale-110" />
            <p className="text-lg">info@website.com</p>
          </div>

          {/* Media Sosial */}
          <div className="flex justify-center space-x-6 mt-8">
            <a
              href="#"
              className="text-blue-500 hover:text-blue-700 text-3xl transform transition-all duration-300 hover:scale-125"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              className="text-blue-400 hover:text-blue-600 text-3xl transform transition-all duration-300 hover:scale-125"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="text-pink-500 hover:text-pink-700 text-3xl transform transition-all duration-300 hover:scale-125"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactInfo;
