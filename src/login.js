import React, { useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

// Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL:
    "https://lelefeeder-59fa5-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const database = getDatabase(app);

// Ambil data akun
const getAkunData = (callback) => {
  const akunRef = ref(database, "pakanLele/Akun");
  onValue(
    akunRef,
    (snapshot) => {
      const data = snapshot.val();
      callback(data || {});
    },
    (error) => {
      console.error("Gagal ambil data akun:", error);
      callback({});
    }
  );
};

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    getAkunData((akunData) => {
      if (akunData.Username === username && akunData.Password === password) {
        setSuccess(true);
        setError("");
        localStorage.setItem("loggedIn", "true");
        setTimeout(() => {
          navigate("/homepage");
        }, 5000); // pindah halaman dalam 5 detik
      } else {
        setError("Username atau Password Salah.");
        setSuccess(false);
      }
    });
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
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Login
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
            className={`w-full py-2 rounded-lg shadow-md text-white ${
              success
                ? "bg-green-600 hover:bg-green-700"
                : error
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Login
          </button>
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
};

export default LoginPage;
