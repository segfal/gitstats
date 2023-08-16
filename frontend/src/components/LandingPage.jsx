import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import LogoutButton from "./githubOAuth/LogoutButton";
import GitHubButton from "./githubOAuth/GithubButton";
import { useNavigate } from "react-router-dom";
import UnreviewedPR from "../components/UnreviewedPR";
import GeneralInfo from "../components/GeneralInfo";
import axios from "axios";
import "../css/landingCSS.css";

const CLIENT_ID = "Iv1.997eaea3b91426c1";

function LandingPage() {
  console.log(CLIENT_ID);
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});
  const [count, setCount] = useState(0);
  const [repoUrl, setRepoUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [repoName, setRepoName] = useState("");
  // const [ghUrl, setGhUrl] = useState('');
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
    navigate("/repo");
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

  return (
    <div>
      <div className="navBar">
        <nav
          class="navbar bg-dark border-bottom border-body"
          data-bs-theme="dark"
        >
          <h1 className="headingNav">GitStats Logo</h1>
          {localStorage.getItem("accessToken") ? (
            <>
              <LogoutButton handleLogout={handleLogout} />
            </>
          ) : (
            <>
              <GitHubButton loginWithGithub={loginWithGithub}></GitHubButton>
            </>
          )}
        </nav>
      </div>
      {localStorage.getItem("accessToken") ? (
        <h1 className="userGreeting">
          Welcome to your GitStats account, {userName}!
          {console.log({ userData })}
        </h1>
      ) : (
        <></>
      )}

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

      {localStorage.getItem("accessToken") ? (
        <div>
          <h1 className="landingMessageBottom">Your Recent Repositories</h1>
        </div>
      ) : (
        <>
          <div>
            <h1 className="landingMessageBottom">
              To view more stats and personalized information, sign up with your
              Github account
            </h1>
          </div>

          <div className="githubLogin">
            <GitHubButton /*</>loginWithGithub={loginWithGithub}*/
            ></GitHubButton>
          </div>
        </>
      )}
    </div>
  );
}

export default LandingPage;
