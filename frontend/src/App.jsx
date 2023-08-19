import React from "react";

import "./App.css";
import LandingPage from "./components/LandingPage";
import ParticleBackground from "./components/ParticleBackground";

import GitHubButton from "./components/githubOAuth/GithubButton";
import LogoutButton from "./components/githubOAuth/LogoutButton";
import GeneralInfo from "./components/GeneralInfo";
import DeploymentFreq from "./components/DeploymentFreq";
import {
  GiSpyglass,
  GiSpy,
  GiMagnifyingGlass,
  GiCyberEye,
  GiDominoMask,
  GiEyeTarget,
  GiEyeball,
  GiNinjaMask,
} from "react-icons/gi";
import UnreviewedPR from "./components/UnreviewedPR";

import TimeToMerge from "./components/TimeToMerge";
import axios from "axios";

import "./stylesheets/All_Components.css";

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
