// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { ref, onValue } from "firebase/database";
import { database } from "./api/firebase";

const Dashboard = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const lokasiRef = ref(database, "pakanLele/lokasi");
    onValue(lokasiRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lokasiArray = Object.values(data);
        const lokasiTerverifikasi = lokasiArray.filter(
          (lokasi) => lokasi.statusLokasi === "terverifikasi"
        );
        setLocations(lokasiTerverifikasi);
        setSelectedLocation(lokasiTerverifikasi[0] || null);
      }
    });
  }, []);

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

  return (
    <div className="min-h-screen text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 animate-gradient-x">
      <Navbar />
      <section className="w-[85%] mx-auto mt-6 py-20 px-6 md:px-20 text-gray-800 relative overflow-hidden bg-white shadow-2xl rounded-xl">
        <svg
          className="absolute right-0 top-[60%] translate-x-[50%] w-[500px] h-[500px] text-blue-100 z-0"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M41.5,-64.1C52.2,-55.1,59.3,-42.5,64.7,-29.6C70.1,-16.6,73.7,-3.3,73.5,10.1C73.3,23.5,69.3,36.9,61.4,48.2C53.4,59.6,41.4,68.8,28.2,70.7C14.9,72.6,0.5,67.3,-14.5,63.9C-29.5,60.5,-45,58.9,-54.7,50.2C-64.4,41.4,-68.3,25.6,-68.2,10.4C-68.2,-4.7,-64.1,-19.2,-57.5,-32.1C-50.9,-45,-41.7,-56.3,-30.3,-63.7C-18.8,-71.2,-5.2,-74.7,7.9,-76.5C21,-78.4,33.9,-78.1,41.5,-64.1Z"
            transform="translate(100 100)"
          />
        </svg>

        {/* Konten Utama */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center z-10 relative">
          {/* Ilustrasi */}
          <div className="relative">
            <img
              src="./ilustrator.png"
              alt="Ilustrasi LeleFeeder"
              className="w-full max-w-md mx-auto animate-float"
              style={{ borderRadius: "20px" }}
            />
          </div>

          {/* Teks */}
          <div>
            <h2 className="text-4xl font-bold text-blue-600 mb-6">
              Tentang LeleFeeder
            </h2>
            <p className="text-lg leading-relaxed mb-5 text-justify">
              <strong>LeleFeeder</strong> adalah inovasi berbasis teknologi{" "}
              <em>Internet of Things (IoT)</em> yang dirancang untuk memudahkan
              petani ikan dalam proses pemberian pakan secara otomatis dan
              efisien.
            </p>
            <p className="text-lg leading-relaxed mb-5 text-justify">
              Sistem ini mengandalkan sensor real-time yang dapat mendeteksi
              kebutuhan pakan dan memberikan makan ikan lele sesuai jadwal
              maupun kondisi aktual kolam. Hasilnya? Pertumbuhan ikan lebih
              sehat, panen lebih cepat!
            </p>
            <p className="text-lg leading-relaxed mb-8 text-justify">
              Didukung dashboard monitoring jarak jauh dan desain antarmuka yang
              ramah pengguna,{" "}
              <span className="font-semibold text-blue-500">LeleFeeder</span>{" "}
              adalah solusi modern bagi budidaya ikan masa kini.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6 mt-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white drop-shadow">
            Dashboard Lokasi Pakan Lele
          </h2>
          <div>
            <Link
              to="/loginadmin"
              className="bg-white text-blue-600 font-semibold px-6 py-2 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out border border-blue-600"
            >
              Login Admin
            </Link>
            <Link
              to="/registrasiuser"
              className="ml-4 bg-white text-blue-600 font-semibold px-6 py-2 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out border border-blue-600"
            >
              Daftar Akun
            </Link>
          </div>
        </div>

        <div className="w-full h-[400px] mb-6 rounded-lg overflow-hidden shadow-xl border bg-white flex items-center justify-center">
          {selectedLocation ? (
            <iframe
              title="Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}&z=15&output=embed`}
            ></iframe>
          ) : (
            <p className="text-gray-500 text-lg">Tidak ada data</p>
          )}
        </div>

        <div className="w-full bg-white p-6 rounded-xl shadow-xl border border-gray-200 text-gray-800">
          <h3 className="text-2xl font-semibold mb-4 text-blue-600">
            Pilih Lokasi:
          </h3>
          <div className="relative mb-6">
            <select
              className="w-full appearance-none bg-white text-gray-700 border border-gray-300 p-3 pr-10 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200"
              value={selectedLocation ? selectedLocation.namaLokasi : ""}
              onChange={(e) => {
                const selected = locations.find(
                  (lokasi) => lokasi.namaLokasi === e.target.value
                );
                setSelectedLocation(selected);
              }}
            >
              <option value="" disabled hidden>
                Pilih lokasi...
              </option>
              {locations.map((lokasi, index) => (
                <option key={index} value={lokasi.namaLokasi}>
                  {lokasi.namaLokasi}
                </option>
              ))}
            </select>

            {/* Icon dropdown */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {selectedLocation ? (
            selectedLocation.statusLokasi === "terverifikasi" && (
              <div className="bg-blue-50 p-5 rounded-lg shadow-inner border border-blue-200 transition-all duration-300 flex justify-between items-start flex-wrap gap-4">
                <div className="text-gray-700">
                  <p className="mb-1 font-semibold text-blue-700">
                    📍 {selectedLocation.namaLokasi}
                  </p>
                  <p className="mb-1">📫 Alamat: {selectedLocation.lokasi}</p>
                  <p className="mb-1">
                    📞 Telepon: {selectedLocation.noTelepon}
                  </p>
                  <p className="mb-1">
                    🌐 Koordinat: {selectedLocation.lat}, {selectedLocation.lng}
                  </p>
                </div>

                <Link
                  to="/loginuser"
                  className="h-fit px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-300 mt-5"
                >
                  Kasih Makan Lele
                </Link>
              </div>
            )
          ) : (
            <Link
              to="/registrasiuser"
              className="h-fit px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition duration-300 mt-5"
            >
              Registrasi Akun
            </Link>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
