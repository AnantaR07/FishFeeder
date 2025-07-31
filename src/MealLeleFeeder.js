import React, { useEffect, useState } from "react";
import { ref, set, get, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { database } from "./api/firebase";

export default function MealLeleFeeder() {
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(6);
  const [namaLokasi, setNamaLokasi] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("loggedIn")) {
      alert("Please log in to access this page.");
      navigate("/login");
      return;
    }

    const username = localStorage.getItem("username");
    const lokasiName = localStorage.getItem("namaLokasi");
    if (lokasiName) setNamaLokasi(lokasiName);

    const lokasiRef = ref(database, "pakanLele/lokasi");

    get(lokasiRef).then((snapshot) => {
      const lokasiData = snapshot.val();
      if (lokasiData && username) {
        const lokasiId = Object.keys(lokasiData).find(
          (id) =>
            lokasiData[id].user && lokasiData[id].user.username === username
        );

        if (lokasiId) {
          // Pantau status
          const perStatusRef = ref(
            database,
            `pakanLele/lokasi/${lokasiId}/user/status`
          );
          onValue(perStatusRef, (statusSnap) => {
            const stat = statusSnap.val();
            setStatus(stat || "mati");
          });

          // Ambil log sensor khusus user
          const logsRef = ref(
            database,
            `pakanLele/lokasi/${lokasiId}/sensorData`
          );
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

          // Cleanup listener
          return () => {
            unsubscribeLogs();
          };
        }
      }
    });
  }, [navigate]);

  const handleFeed = async () => {
    try {
      const username = localStorage.getItem("username");
      if (!username) {
        alert("Username tidak ditemukan.");
        return;
      }

      const lokasiRef = ref(database, "pakanLele/lokasi");
      const snapshot = await get(lokasiRef);
      const lokasiData = snapshot.val();

      const lokasiId = Object.keys(lokasiData).find(
        (id) => lokasiData[id].user && lokasiData[id].user.username === username
      );

      if (!lokasiId) {
        console.error("Lokasi tidak ditemukan untuk user ini.");
        return;
      }

      const userRef = ref(database, `pakanLele/lokasi/${lokasiId}/user`);
      const currentUserData = lokasiData[lokasiId].user;

      // Set status ke "hidup"
      await set(userRef, {
        ...currentUserData,
        status: "hidup",
      });

      console.log("Status diubah ke hidup.");

      // Kembali ke "mati" setelah 12 detik
      setTimeout(async () => {
        await set(userRef, {
          ...currentUserData,
          status: "mati",
        });
        console.log("Status dikembalikan ke mati.");
      }, 14000);
    } catch (error) {
      console.error("Gagal mengubah status:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("namaLokasi");

    const alertBox = document.getElementById("logout-alert");
    if (alertBox) alertBox.classList.add("show");

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
        <h2 className="text-xl text-center text-gray-600 mb-4">
          Lokasi:{" "}
          <span className="font-semibold text-teal-700">{namaLokasi}</span>
        </h2>

        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={handleFeed}
            disabled={status === "hidup"}
            className={`relative flex items-center gap-3 text-white px-8 py-3 rounded-full shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300 ${
              status === "hidup"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 animate-pulse"
            }`}
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

        {/* TABEL */}
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
