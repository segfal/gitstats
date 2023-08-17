import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import LogoutButton from "./githubOAuth/LogoutButton";
import GitHubButton from "./githubOAuth/GithubButton";
import { useNavigate } from "react-router-dom";
import RepoDataPage from "./RepoDataPage"; // Import RepoDataPage
import axios from "axios";
import "../stylesheets/landingCSS.css";

const CLIENT_ID = "Iv1.997eaea3b91426c1";

function LandingPage() {
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});
  const [count, setCount] = useState(0);
  const [repoUrl, setRepoUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [repoName, setRepoName] = useState("");
  const [submit, setSubmit] = useState(false);
  const navigate = useNavigate();
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
    navigate("./repo", {
      state: {
        userName: userName,
        repoName: repoName,
        ghUrl: ghUrl,
      },
    });
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
    const query = window.location.search;
    const urlParams = new URLSearchParams(query);
    const codeParam = urlParams.get("code");

    if (codeParam && !localStorage.getItem("accessToken")) {
      const getAccessToken = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/login/getAccessToken?code=${codeParam}`
          );
          localStorage.setItem("accessToken", response.data.access_token);
          setRerender(!rerender);
        } catch (error) {
          console.log(error);
        }
      };
      getAccessToken();
    }
  }, []);

  useEffect(() => {
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
        setUserData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (localStorage.getItem("accessToken")) {
      getUserData();
    }
  }, []);

  return (
    <div>
      {!submit ? (
        <div className="navBar">
          <nav
            class="navbar bg-dark border-bottom border-body"
            data-bs-theme="dark"
          >
            <h1 className="headingNav">GitStats Logo</h1>
            {localStorage.getItem("accessToken") ? (
              <LogoutButton handleLogout={handleLogout} />
            ) : (
              <GitHubButton loginWithGithub={loginWithGithub} />
            )}
          </nav>
          <h1 className="userGreeting">
            Welcome to your GitStats account, {userName}!
          </h1>
          <div className="landingTitle">
            <h1>GitHub Stats</h1>
          </div>
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
      ) : (
        <RepoDataPage />
      )}
    </div>
  );
}

export default LandingPage;
