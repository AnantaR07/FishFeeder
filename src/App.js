import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import LoginUser from "./LoginUser";
import RegistrasiUser from "./Registrasi";
import MealLeleFeeder from "./MealLeleFeeder";
import Profile from "./Profile";
import Contact from "./Contact";
import LoginAdmin from "./admin/LoginAdmin";
import AddCatfishPond from "./admin/AddCatfishPond";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/loginuser" element={<LoginUser />} />
        <Route path="/registrasiuser" element={<RegistrasiUser />} />
        <Route path="/meallelefeeder" element={<MealLeleFeeder />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/loginadmin" element={<LoginAdmin />} />
        <Route path="/addcatfishpond" element={<AddCatfishPond />} />
      </Routes>
    </Router>
  );
}

export default App;
