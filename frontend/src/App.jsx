import React, { useState, useEffect } from "react";
import "./App.css";
import GitHubButton from "./components/githubOAuth/GithubButton";
import LogoutButton from "./components/githubOAuth/LogoutButton";
import GeneralInfo from "./components/GeneralInfo";
import DeploymentFreq from "./components/DeploymentFreq";
import { GiSpyglass, GiSpy, GiMagnifyingGlass, GiCyberEye, GiDominoMask, GiEyeTarget, GiEyeball, GiNinjaMask } from "react-icons/gi";import UnreviewedPR from "./components/UnreviewedPR";

import TimeToMerge from "./components/TimeToMerge";
import axios from "axios";

import "./stylesheets/All_Components.css"


const CLIENT_ID = "9dfb3cba168ba38c3d35";

function App() {
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});
  const [count, setCount] = useState(0);
  const [repoUrl, setRepoUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [repoName, setRepoName] = useState("");
  // const [ghUrl, setGhUrl] = useState('');
  const [submit, setSubmit] = useState(false);
  const ghUrl = `https://api.github.com/repos/${userName}/${repoName}`;
  useEffect(() => {
    console.log(repoUrl);
  }, [repoUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const parts = repoUrl.split("/");
    setUserName(parts[parts.length - 2]);
    setRepoName(parts[parts.length - 1]);
    setSubmit(true);
  };

  const loginWithGithub = () => {
    window.location.assign(
      `https://github.com/login/oauth/authorize?scope=user&client_id=${CLIENT_ID}`
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.assign(`http://localhost:5173/`);
  };

  useEffect(() => {
    // access token stored in local storage for now
    // http://localhost:5173/?code=46052fed06f20abbef61
    const query = window.location.search;
    const urlParams = new URLSearchParams(query);
    const codeParam = urlParams.get("code");
    console.log(codeParam);

    if (codeParam && !localStorage.getItem("accessToken")) {
      const getAccessToken = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/login/getAccessToken?code=${codeParam}`
          );
          console.log(response.data.access_token);
          localStorage.setItem("accessToken", response.data.access_token);
          setRerender(!rerender);
        } catch (error) {
          console.log(error);
        }
      };
      getAccessToken();
    }
  }, []);

  const getUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/login/getUserData`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        }
      );
      console.log(response.data);
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserRateLimit = async () => {
    try {
      const response = await axios.get(`https://api.github.com/rate_limit`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getRateLimit = async () => {
    try {
      const response = await axios.get(`https://api.github.com/rate_limit`);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const repoSearch = async() => {
  //   const response = await fetch(`${ghUrl}${userName}/${repoUrl}`);
  //   const data = await response.json();
  //   console.log(data);
  // }

  //useEffect for loading the user's repo upon entering input
  // useEffect(() =>{
  // const repoSearch =  async() => {
  //     // Parse useName and
  //    // const response = await fetch(ghUrl + userName + '/' + repoUrl);
  // // const data = await response.json();
  // // console.log(data);

  // }

  return (
    <div>
      
      {localStorage.getItem("accessToken") ? (
        <>
          <LogoutButton handleLogout={handleLogout} />
        </>
      ) : (
        <>
          <GitHubButton loginWithGithub={loginWithGithub}></GitHubButton>
        </>
      )}
      <div> 
      <div><h1>Git<GiSpy/>Snitch</h1></div>
        <h1>GitHub Stats</h1>
        <form onSubmit={handleSubmit}>
          {/* <form> */}
          <label>Enter the link to your GitHub repository: </label>
          <input name="repoUrl" onChange={(e) => setRepoUrl(e.target.value)} />
          <button type="submit">Enter</button>
        </form>
      </div>

      <div className="All_Components_Box">
        {submit && <GeneralInfo ghUrl={ghUrl} />}

        {localStorage.getItem("accessToken") && (
          <TimeToMerge
            submit={submit}
            userName={userName}
            repoName={repoName}
            access_token={localStorage.getItem("accessToken")}
          />
        )}

        {localStorage.getItem("accessToken") && submit && (
          <UnreviewedPR
            userName={userName}
            repoName={repoName}
            access_token={localStorage.getItem("accessToken")}
          ></UnreviewedPR>
        )}

        {localStorage.getItem("accessToken") && submit && (
          <DeploymentFreq
            ghUrl={ghUrl}
            access_token={localStorage.getItem("accessToken")}
          />
        )}
      </div>

      

      <button onClick={getUserRateLimit}>(Test)Get User Rate Limit</button>
      <button onClick={getRateLimit}>(Test)Get IP Rate Limit</button>
    </div>
  );
}

export default App;
