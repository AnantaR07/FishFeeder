// src/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { useNavigate, Link } from "react-router-dom";
import { database } from "./api/firebase";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [lokasiData, setLokasiData] = useState({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Ambil data lokasi saat komponen dimuat
  useEffect(() => {
    const lokasiRef = ref(database, "pakanLele/lokasi");

    const unsubscribe = onValue(
      lokasiRef,
      (snapshot) => {
        const data = snapshot.val() || {};
        setLokasiData(data);
      },
      (error) => {
        console.error("Gagal ambil data lokasi:", error);
      }
    );

    return () => unsubscribe(); // Cleanup listener saat unmount
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const akunArray = [];

    Object.entries(lokasiData).forEach(([lokasiKey, lokasi]) => {
      if (lokasi.user) {
        akunArray.push({
          ...lokasi.user,
          namaLokasi: lokasi.namaLokasi || "",
          lokasiKey: lokasiKey,
        });
      }
    });

    const user = akunArray.find(
      (akun) => akun.username === username && akun.password === password
    );

    if (user) {
      setSuccess(true);
      setError("");
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("namaLokasi", user.namaLokasi);

      setTimeout(() => {
        navigate("/meallelefeeder");
      }, 2000);
    } else {
      setError("Username atau password salah");
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400">
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
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6 leading-tight">
          <div>Login</div>
          <div className="text-gray-600 text-xl">User</div>
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-2 border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none`}
              placeholder="Masukkan Username"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none`}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-lg shadow-md text-white mb-3 ${
              success
                ? "bg-green-600 hover:bg-green-700"
                : error
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Login
          </button>

          <div className="mt-1">
            <Link
              to="/registrasiuser"
              className="block w-full text-center py-2 rounded-lg shadow-md bg-green-600 hover:bg-green-700 text-white font-semibold transition duration-300"
            >
              Registrasi
            </Link>
          </div>

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
          <p className="text-green-500 mt-3 text-center">
            Login berhasil! Mengalihkan ke halaman utama...
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
