import React, { useEffect } from "react";
import "./App.css";
import LandingPage from "./components/LandingPage";
import ParticleBackground from "./components/ParticleBackground";

function App() {
  return (
    <div id="particles-js">
      <ParticleBackground />
      <LandingPage />
    </div>
  );
}

export default App;
