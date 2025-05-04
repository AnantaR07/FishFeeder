import React, { useEffect, useState } from "react";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

// Firebase Config (replace with your Firebase config)
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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function HomePage() {
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    if (!localStorage.getItem("loggedIn")) {
      alert("Please log in to access this page.");
      navigate("/login"); // Redirect to login page
      return;
    }

    // Fetch status and logs from Firebase
    const statusRef = ref(database, "pakanLele/status");
    const unsubscribeStatus = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      setStatus(data || "mati");
    });

    const logsRef = ref(database, "pakanLele/sensorData");
    const unsubscribeLogs = onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const logArray = Object.entries(data)
          .sort((a, b) => b[0] - a[0])
          .map(([id, value]) => ({
            id,
            ...value,
          }));
        setLogs(logArray);
      } else {
        setLogs([]);
      }
    });

    return () => {
      unsubscribeStatus();
      unsubscribeLogs();
    };
  }, [navigate]);

  const handleFeed = () => {
    const statusRef = ref(database, "pakanLele/status");
    set(statusRef, "hidup")
      .then(() => console.log("Alat dinyalakan"))
      .catch((err) => console.error("Gagal menyalakan alat:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");

    const alertBox = document.getElementById("logout-alert");
    if (alertBox) {
      alertBox.classList.add("show");
    }

    // Redirect after 2.5 seconds
    setTimeout(() => {
      navigate("/");
    }, 2500);
  };

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-teal-50 min-h-screen font-sans text-gray-700">
      <style>{`
        #logout-alert.show {
  opacity: 1 !important;
  pointer-events: auto;
  animation: fadeOut 2s ease-in-out forwards;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  80% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}

      `}</style>
      <Navbar />
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-teal-700 mb-8 drop-shadow-sm">
          Sistem Otomatis Pakan Lele
        </h1>
        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={handleFeed}
            className="relative flex items-center gap-3 bg-gradient-to-r from-teal-500 to-green-500 text-white px-8 py-3 rounded-full shadow-xl transition-all duration-300 hover:scale-105 hover:from-teal-600 hover:to-green-600 focus:outline-none focus:ring-4 focus:ring-teal-300 animate-pulse"
          >
            <span className="text-2xl">🐟</span>
            <span className="font-semibold tracking-wide">
              {status === "hidup"
                ? "Memberi Makan Lele Sekarang..."
                : "Kasih Pakan Lele"}
            </span>
          </button>
          <button
            onClick={handleLogout}
            className="relative flex items-center gap-3 bg-red-500 text-white px-8 py-3 rounded-full shadow-xl transition-all duration-300 hover:scale-105 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            <span className="text-2xl">🚪</span>
            <span className="font-semibold tracking-wide">Logout</span>
          </button>
        </div>

        {/* Table for logs */}
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="w-full text-sm text-gray-600 text-left border-collapse">
            <thead className="bg-teal-600 text-white text-md">
              <tr>
                <th className="px-4 py-3 text-center">Tanggal</th>
                <th className="px-4 py-3 text-center">Waktu</th>
                <th className="px-4 py-3 text-center">Status Makanan</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.length > 0 ? (
                currentLogs.map((log, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="px-4 py-2 text-center">{log.tanggal}</td>
                    <td className="px-4 py-2 text-center">{log.waktu}</td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
                          log.statusMakanan === "tinggal sedikit"
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      >
                        {log.statusMakanan}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-3 text-center" colSpan="3">
                    Tidak ada riwayat pemberian makan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-teal-600 text-white rounded-md mr-2 transform transition-all duration-300 ease-in-out hover:scale-105 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage * logsPerPage >= logs.length}
            className="px-4 py-2 bg-teal-600 text-white rounded-md transform transition-all duration-300 ease-in-out hover:scale-105 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>

      {/* Logout Alert */}
      <div
        id="logout-alert"
        className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 opacity-0 pointer-events-none transition-all duration-500"
      >
        🚪 Logout berhasil! Sampai jumpa lagi! 👋
      </div>

      <Footer />
    </div>
  );
}
