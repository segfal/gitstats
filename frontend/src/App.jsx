import React, { useState, useEffect } from "react";
import "./App.css";
import GitHubButton from "./components/githubOAuth/GithubButton";
import LogoutButton from "./components/githubOAuth/LogoutButton";
import GeneralInfo from "./components/GeneralInfo";
import DeploymentFreq from "./components/DeploymentFreq";

import TimeToMerge from "./components/TimeToMerge";
import axios from "axios";

import UnreviewedPR from "./components/UnreviewedPR";

const CLIENT_ID = "Iv1.997eaea3b91426c1";

function App() {
  console.log(CLIENT_ID);
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
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`
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
            Authorization: "Bearer" + localStorage.getItem("accessToken"),
          },
        }
      );
      console.log(response.data);
      setUserData(response.data);
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
        <h1>GitHub Stats</h1>
        <form onSubmit={handleSubmit}>
          {/* <form> */}
          <label>Enter the link to your GitHub repository: </label>
          <input name="repoUrl" onChange={(e) => setRepoUrl(e.target.value)} />
          <button type="submit">Enter</button>
        </form>
      </div>

      <TimeToMerge submit={submit} userName={userName} repoName={repoName} />
      {submit && <GeneralInfo ghUrl={ghUrl} />}
      <DeploymentFreq />
      <UnreviewedPR
        userName={userName}
        repoName={repoName}
        access_token={localStorage.getItem("accessToken")}
      ></UnreviewedPR>

    </div>
  );
}

export default App;
