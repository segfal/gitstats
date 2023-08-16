import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "./App.css";
import LandingPage from "./components/LandingPage";
import ParticleBackground from "./components/ParticleBackground";
import RepoDataPage from "./components/RepoDataPage";

function App() {
  return (
    <div>
      <div id="particles-js">
        <ParticleBackground />
        <LandingPage />
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/repo" element={<RepoDataPage />} />
      </Routes>
    </div>
  );
}

export default App;
