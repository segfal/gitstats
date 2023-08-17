import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "./App.css";
import LandingPage from "./components/LandingPage";
import ParticleBackground from "./components/ParticleBackground";
import RepoDataPage from "./components/RepoDataPage";

const CLIENT_ID = "9dfb3cba168ba38c3d35";

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

      {/*  <button onClick={getUserRateLimit}>(Test)Get User Rate Limit</button>
      <button onClick={getRateLimit}>(Test)Get IP Rate Limit</button> */}
    </div>
  );
}

export default App;
