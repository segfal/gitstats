import React from "react";

import "./App.css";
import LandingPage from "./components/LandingPage";
import ParticleBackground from "./components/ParticleBackground";

const CLIENT_ID = "9dfb3cba168ba38c3d35";

function App() {
  return (
    <div id="particles-js">
      <div>
        <ParticleBackground />
        <LandingPage />
      </div>
    </div>
  );
}

export default App;
