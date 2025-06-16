import React, { useState } from "react";
import { database } from "./api/firebase";
import { ref, push, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const RegistrasiLokasi = () => {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [namaLokasi, setNamaLokasi] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!lat || !lng || !lokasi || !namaLokasi || !noTelepon) {
      setError("Semua field harus diisi.");
      setSuccess(false);
      return;
    }

    const lokasiRef = ref(database, "pakanLele/lokasi");
    const newLokasiRef = push(lokasiRef);

    const data = {
      lat,
      lng,
      lokasi,
      namaLokasi,
      noTelepon,
      statusLokasi: "verifikasi", // ✅ Tambahan field baru
    };

    set(newLokasiRef, data)
      .then(() => {
        setSuccess(true);
        setError("");

        // Reset form
        setLat("");
        setLng("");
        setLokasi("");
        setNamaLokasi("");
        setNoTelepon("");

        setTimeout(() => {
          navigate("/");
        }, 10000); // perpanjang waktu sedikit agar pesan terbaca
      })
      .catch((err) => {
        console.error("Gagal simpan:", err);
        setError("Gagal menyimpan data.");
        setSuccess(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 py-16">
      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
          100% { transform: translateX(0); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>

      <div
        className={`bg-white p-8 rounded-2xl shadow-lg w-full max-w-md ${
          success
            ? "border-green-500 border-4"
            : error
            ? "border-red-500 border-4"
            : ""
        }`}
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Registrasi Lokasi
        </h2>

        <form onSubmit={handleSubmit}>
          {[
            {
              label: "Latitude",
              value: lat,
              setter: setLat,
              placeholder: "Contoh: -0.7893",
            },
            {
              label: "Longitude",
              value: lng,
              setter: setLng,
              placeholder: "Contoh: 113.9213",
              note: `
Kode Latitude dan Longitude bisa didapat dari Google Maps.

• Pada komputer:
  Klik kanan pada lokasi peta, pilih 'Apa yang ada di sini?', lalu salin koordinat yang muncul di bawah.

• Pada HP:
  Tekan dan tahan pada lokasi di peta hingga muncul pin, lalu lihat koordinat di bagian bawah atau atas layar, dan salin.
  `.trim(),
            },

            {
              label: "Lokasi",
              value: lokasi,
              setter: setLokasi,
              placeholder: "Contoh: Jalan Ikan Lele No.12",
            },
            {
              label: "Nama Lokasi",
              value: namaLokasi,
              setter: setNamaLokasi,
              placeholder: "Contoh: Kolam Pak Budi",
            },
            {
              label: "Nomor Telepon",
              value: noTelepon,
              setter: setNoTelepon,
              placeholder: "Contoh: 081234567890",
            },
          ].map((field, index) => (
            <div className="mb-4" key={index}>
              <label className="block text-gray-700 font-semibold mb-2">
                {field.label}
              </label>
              <input
                type="text"
                value={field.value}
                onChange={(e) => {
                  const value = e.target.value;
                  if (field.label === "Nomor Telepon") {
                    field.setter(value.replace(/\D/g, ""));
                  } else if (
                    field.label === "Latitude" ||
                    field.label === "Longitude"
                  ) {
                    field.setter(value.replace(/[^0-9.-]/g, ""));
                  } else {
                    field.setter(value);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                placeholder={field.placeholder}
                required
              />
              {field.note && (
                <p className="text-sm text-gray-500 mt-1 whitespace-pre-line">
                  {field.note}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className={`w-full py-2 rounded-lg shadow-md text-white font-semibold ${
              success
                ? "bg-green-600 hover:bg-green-700"
                : error
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Simpan Lokasi
          </button>
          <Link
            to="/"
            className="bg-white text-blue-600 border border-blue-600 py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 hover:text-white transition mt-3 w-full text-center block"
          >
            Kembali
          </Link>
        </form>

        {error && (
          <p className="text-red-500 mt-3 text-center animate-shake">{error}</p>
        )}

        {success && (
          <div className="text-green-500 mt-3 text-center">
            <p>Data berhasil disimpan!</p>
            <p>Data akan diteruskan ke admin dan akan diproses.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrasiLokasi;
