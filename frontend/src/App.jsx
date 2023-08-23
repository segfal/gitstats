import React from "react";

import "./App.css";
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";
import ParticleBackground from "./components/ParticleBackground";
import GitHubButton from "./components/githubOAuth/GithubButton";
import LogoutButton from "./components/githubOAuth/LogoutButton";
import GeneralInfo from "./components/GeneralInfo";
import DeploymentFreq from "./components/DeploymentFreq";

import UnreviewedPR from "./components/UnreviewedPR";

import TimeToMerge from "./components/TimeToMerge";
import axios from "axios";

import "./stylesheets/All_Components.css";

const CLIENT_ID = "9dfb3cba168ba38c3d35";

function App() {
  return (
    <div>
      <div id="particles-js">
        <div>
          <ParticleBackground />
          <LandingPage />
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default App;
