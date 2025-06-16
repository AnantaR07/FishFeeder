import React, { useState, useEffect } from "react";
import { ref, push, set, onValue, remove, update } from "firebase/database";
import { database } from "../api/firebase";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AddCatfishPond = () => {
  const [formData, setFormData] = useState({
    lat: "",
    lng: "",
    lokasi: "",
    namaLokasi: "",
    noTelepon: "",
    username: "",
    password: "",
    apiKey: "",
  });

  const [editId, setEditId] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    const lokasiRef = ref(database, "pakanLele/lokasi");
    const unsubscribe = onValue(lokasiRef, (snapshot) => {
      const data = snapshot.val();
      const list = data
        ? Object.entries(data).map(([id, val]) => ({ id, ...val }))
        : [];
      setDataList(list);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      lat: "",
      lng: "",
      lokasi: "",
      namaLokasi: "",
      noTelepon: "",
      username: "",
      password: "",
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      lat,
      lng,
      lokasi,
      namaLokasi,
      noTelepon,
      username,
      password,
      apiKey,
    } = formData;

    if (
      !lat ||
      !lng ||
      !lokasi ||
      !namaLokasi ||
      !noTelepon ||
      !username ||
      !password
    ) {
      setErrorMessage("Semua kolom wajib diisi.");
      setSuccessMessage("");
      return;
    }

    if (username.length < 5) {
      setErrorMessage("Username minimal 5 karakter.");
      setSuccessMessage("");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password minimal 8 karakter.");
      setSuccessMessage("");
      return;
    }

    try {
      const lokasiRef = ref(database, "pakanLele/lokasi");

      if (editId) {
        const updateRef = ref(database, `pakanLele/lokasi/${editId}`);
        await update(updateRef, {
          lat,
          lng,
          lokasi,
          namaLokasi,
          noTelepon,
          statusLokasi: "terverifikasi",
          user: { username, password, apiKey },
        });

        // Kirim WhatsApp saat data diperbarui
        const pesan = `Halo! Akun Anda telah diterima.\n\nUsername: ${username}\nPassword: ${password}`;
        let nomorWhatsApp = noTelepon.trim();
        if (nomorWhatsApp.startsWith("+62")) {
          nomorWhatsApp = nomorWhatsApp.replace("+", "");
        } else if (nomorWhatsApp.startsWith("0")) {
          nomorWhatsApp = "62" + nomorWhatsApp.slice(1);
        }
        const linkWhatsApp = `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(
          pesan
        )}`;
        window.open(linkWhatsApp, "_blank", "noopener,noreferrer");

        setSuccessMessage("Data berhasil diperbarui!");
      } else {
        const newRef = push(lokasiRef);
        await set(newRef, {
          lat,
          lng,
          lokasi,
          namaLokasi,
          noTelepon,
          statusLokasi: "terverifikasi",
          user: { username, password, apiKey },
        });

        // Kirim WhatsApp
        const pesan = `Halo! Akun Anda telah berhasil dibuat.\n\nUsername: ${username}\nPassword: ${password}`;
        let nomorWhatsApp = noTelepon.trim();
        if (nomorWhatsApp.startsWith("+62")) {
          nomorWhatsApp = nomorWhatsApp.replace("+", "");
        } else if (nomorWhatsApp.startsWith("0")) {
          nomorWhatsApp = "62" + nomorWhatsApp.slice(1);
        }
        const linkWhatsApp = `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(
          pesan
        )}`;
        window.open(linkWhatsApp, "_blank", "noopener,noreferrer");

        setSuccessMessage("Data berhasil ditambahkan!");
      }

      setErrorMessage("");
      resetForm();
    } catch (error) {
      setErrorMessage("Gagal menyimpan data: " + error.message);
      setSuccessMessage("");
    }
  };

  const generateApiKey = () => {
    const randomKey = [...Array(32)]
      .map(() => Math.random().toString(36)[2])
      .join("")
      .toUpperCase();
    setFormData({ ...formData, apiKey: randomKey });
  };

  const handleEdit = (item) => {
    setFormData({
      lat: item.lat,
      lng: item.lng,
      lokasi: item.lokasi,
      namaLokasi: item.namaLokasi,
      noTelepon: item.noTelepon,
      username: item.user?.username || "",
      password: item.user?.password || "",
    });
    setEditId(item.id);
  };

  const confirmDelete = (id) => {
    setIdToDelete(id);
    setShowConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await remove(ref(database, `pakanLele/lokasi/${idToDelete}`));
      setSuccessMessage("Data berhasil dihapus!");
      setShowConfirm(false);
      setIdToDelete(null);
      resetForm(); // kalau kamu mau reset form setelah hapus
    } catch (error) {
      setErrorMessage("Gagal menghapus data: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // atau sesuai token/session-mu
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 ">
      <Navbar />

      {/* Form Tambah/Edit */}
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          {editId ? "Edit Data Kolam Lele" : "Tambah Data Kolam Lele"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="lat"
            value={formData.lat}
            onChange={handleChange}
            placeholder="Latitude"
            className="w-full border px-4 py-2 rounded-lg"
            required
          />
          <input
            type="text"
            name="lng"
            value={formData.lng}
            onChange={handleChange}
            placeholder="Longitude"
            className="w-full border px-4 py-2 rounded-lg"
            required
          />
          <input
            type="text"
            name="lokasi"
            value={formData.lokasi}
            onChange={handleChange}
            placeholder="Lokasi"
            className="w-full border px-4 py-2 rounded-lg"
            required
          />
          <input
            type="text"
            name="namaLokasi"
            value={formData.namaLokasi}
            onChange={handleChange}
            placeholder="Nama Lokasi"
            className="w-full border px-4 py-2 rounded-lg"
            required
          />
          <input
            type="tel"
            name="noTelepon"
            value={formData.noTelepon}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/[^0-9]/g, "");
              setFormData({ ...formData, noTelepon: onlyNums });
            }}
            placeholder="Nomor Telepon"
            className="w-full border px-4 py-2 rounded-lg"
            required
          />

          <div>
            <p className="font-semibold text-blue-700">Akun User</p>
            {/* Username - Minimal 5 karakter */}
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username (min 5 karakter)"
              minLength={5}
              className="w-full border px-4 py-2 mt-2 rounded-lg"
              required
            />

            {/* Password - Minimal 8 karakter + toggle visibility */}
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password (min 8 karakter)"
                minLength={8}
                className="w-full border px-4 py-2 pr-10 rounded-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-blue-600"
              >
                {showPassword ? "Sembunyikan" : "Lihat"}
              </button>
            </div>
            <div className="relative mt-2">
              <input
                type={showApiKey ? "text" : "password"}
                name="apiKey"
                value={formData.apiKey}
                onChange={handleChange}
                placeholder="API Key"
                className="w-full border px-4 py-2 pr-28 rounded-lg"
                readOnly
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-20 top-1/2 transform -translate-y-1/2 text-blue-600"
                title={showApiKey ? "Sembunyikan" : "Lihat"}
              >
                {showApiKey ? <FaEyeSlash /> : <FaEye />}
              </button>
              <button
                type="button"
                onClick={generateApiKey}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
              >
                Generate
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {editId ? "Perbarui Data" : "Tambah Data"}
          </button>
          <Link
            to="/"
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition mt-3 w-full text-center block"
          >
            Logout
          </Link>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition mt-2"
            >
              Batal Edit
            </button>
          )}
        </form>

        {successMessage && (
          <p className="text-green-600 mt-4 text-center">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-600 mt-4 text-center">{errorMessage}</p>
        )}
      </div>

      {/* Tabel Data */}
      <div className="max-w-5xl mx-auto mt-10 bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <h3 className="text-xl font-bold text-center mb-4 text-green-700">
          Data Kolam Lele
        </h3>
        <table className="w-full text-sm border border-collapse">
          <thead>
            <tr className="bg-blue-200 text-left">
              <th className="border px-3 py-2">#</th>
              <th className="border px-3 py-2">Nama Lokasi</th>
              <th className="border px-3 py-2">Lokasi</th>
              <th className="border px-3 py-2">Latitude</th>
              <th className="border px-3 py-2">Longitude</th>
              <th className="border px-3 py-2">Telepon</th>
              <th className="border px-3 py-2">Username</th>
              <th className="border px-3 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-100">
                <td className="border px-3 py-2">{index + 1}</td>
                <td className="border px-3 py-2">{item.namaLokasi}</td>
                <td className="border px-3 py-2">{item.lokasi}</td>
                <td className="border px-3 py-2">{item.lat}</td>
                <td className="border px-3 py-2">{item.lng}</td>
                <td className="border px-3 py-2">{item.noTelepon}</td>
                <td className="border px-3 py-2">{item.user?.username}</td>
                <td className="border px-3 py-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-2 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(item.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {dataList.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 py-4">
                  Belum ada data.
                </td>
              </tr>
            )}
            {showConfirm && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <p className="mb-4 text-lg font-semibold">
                    Yakin ingin menghapus data ini?
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleDeleteConfirmed}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Ya
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            )}
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
};

export default AddCatfishPond;
