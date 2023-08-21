import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import GitHubButton from "./githubOAuth/GithubButton";
import LogoutButton from "./githubOAuth/LogoutButton";
import GeneralInfo from "./GeneralInfo";
import DeploymentFreq from "./DeploymentFreq";
import UnreviewedPR from "./UnreviewedPR";
import TimeToMerge from "./TimeToMerge";
import axios from "axios";
import "../stylesheets/landingCSS.css";

import {GiSpy} from "react-icons/gi";

import RecentRepos from "./RecentRepos";

const CLIENT_ID = "9dfb3cba168ba38c3d35";

function LandingPage() {
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});
  const [repoUrl, setRepoUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [repoName, setRepoName] = useState("");
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

  // change to deployed frontend url when everything is done 
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.assign(`http://localhost:5173/`);
  };

  useEffect(() => {
    const query = window.location.search;
    const urlParams = new URLSearchParams(query);
    const codeParam = urlParams.get("code");
    console.log(codeParam);

    if (codeParam && !localStorage.getItem("accessToken")) {
      const getAccessToken = async () => {
        try {
          const response = await axios.get(
            `https://gitstats-production.up.railway.app/api/login/getAccessToken?code=${codeParam}`
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

    if(localStorage.getItem("flag")){
      setUserName(localStorage.getItem("userName"));
      setRepoName(localStorage.getItem("repoName"));
      setSubmit(true);
      localStorage.removeItem("flag");
      localStorage.removeItem("userName");
      localStorage.removeItem("repoName");
    }
  }, []);

  const getUserData = async () => {
    try {
      const response = await axios.get(
        `https://gitstats-production.up.railway.app/api/login/getUserData`,
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

  // const getUserRateLimit = async () => {
  //   try {
  //     const response = await axios.get(`https://api.github.com/rate_limit`, {
  //       headers: {
  //         Authorization: "Bearer " + localStorage.getItem("accessToken"),
  //       },
  //     });
  //     console.log(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const getRateLimit = async () => {
  //   try {
  //     const response = await axios.get(`https://api.github.com/rate_limit`);
  //     console.log(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      getUserData();
    }
  }, [localStorage.getItem("accessToken")]);

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

      {!submit ? (
        <div className="navBar">
          <nav
            class="navbar bg-dark border-bottom border-body"
            data-bs-theme="dark"
          >
            <h1 className="headingNav logo-font">Git<GiSpy/>Snitch</h1>
            {localStorage.getItem("accessToken") ? (
              <LogoutButton handleLogout={handleLogout} />
            ) : (
              <GitHubButton loginWithGithub={loginWithGithub} />
            )}
          </nav>
          {localStorage.getItem("accessToken") && (
            <h1 className="userGreeting">
              Welcome to your GitStats account, {userData.login}!
            </h1>
          </>
        )}
        {!submit && (
          <div className="landingTitle">
            <h1>GitHub Stats</h1>
          </div>
        )}
        <div className="landingContainer">
          <h1 className="landingMessage">
            View information on any Github Repository below
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3 input-group-lg">
              <input
                type="text"
                name="repoUrl"
                id="repoUrl"
                className="form-control"
                placeholder="Enter a Github Repository link here)"
                onChange={(e) => setRepoUrl(e.target.value)}
                required
              />
              <button
                type="submit"
                id="repoSearchButton"
                className="btn btn-success btn-lg"
              >
                <i class="bi bi-search" id="searchIcon"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="All_Components_Box">
        {submit && <GeneralInfo ghUrl={ghUrl} />}

        {localStorage.getItem("accessToken") && submit && (
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
          />
        )}

        {localStorage.getItem("accessToken") && submit && (
          <DeploymentFreq
            ghUrl={ghUrl}
            access_token={localStorage.getItem("accessToken")}
          />
        )}
      </div>

      {localStorage.getItem("accessToken") && !submit && (
        <div>
          {console.log(userData.login)}
          <RecentRepos userName={userData.login} access_token={localStorage.getItem("accessToken")}/>
        </div>
      )}

      {submit ? (
        <>
          {!localStorage.getItem("accessToken") && (
            <>
              <div>
                <h1 className="landingMessageBottom">
                  To view more stats and personalized information, login in with
                  your Github account
                </h1>
              </div>
              <div className="githubLogin">
                <GitHubButton
                  loginWithGithub={() => {
                    localStorage.setItem("flag", true);
                    localStorage.setItem("repoName", repoName);
                    localStorage.setItem("userName", userName);
                    loginWithGithub();
                  }}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {!localStorage.getItem("accessToken") && (
            <>
              <div>
                <h1 className="landingMessageBottom">
                  To view more stats and personalized information, login in with
                  your Github account
                </h1>
              </div>
              <div className="githubLogin">
                <GitHubButton loginWithGithub={loginWithGithub} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default LandingPage;
