import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import GitHubButton from "./githubOAuth/GithubButton";
import GeneralInfo from "./GeneralInfo";
import NewsFeed from "./NewsFeed";
import DeploymentFreq from "./DeploymentFreq";
import UnreviewedPR from "./UnreviewedPR";
import TimeToMerge from "./TimeToMerge";
import axios from "axios";
import "../stylesheets/landingCSS.css";
import { GiSpy } from "react-icons/gi";
import RecentRepos from "./RecentRepos";
const CLIENT_ID = "9dfb3cba168ba38c3d35";
import PRImpact from "./PRImpact";
import Footer from "./Footer";

function LandingPage() {
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});
  const [repoUrl, setRepoUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [repoName, setRepoName] = useState("");
  const [submit, setSubmit] = useState(false);
  const [subMenu, setSubMenu] = useState(false);
  const ghUrl = `https://api.github.com/repos/${userName}/${repoName}`;

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
    window.location.assign("https://gitsight.vercel.app/");
  };

  useEffect(() => {
    const query = window.location.search;
    const urlParams = new URLSearchParams(query);
    const codeParam = urlParams.get("code");

    if (codeParam && !localStorage.getItem("accessToken")) {
      const getAccessToken = async () => {
        try {
          const response = await axios.get(
            `https://gitstats-production.up.railway.app/api/login/getAccessToken?code=${codeParam}`
          );
          localStorage.setItem("accessToken", response.data.access_token);
          setRerender(!rerender);
        } catch (error) {
          console.log(error);
        }
      };
      getAccessToken();
    }

    if (localStorage.getItem("flag")) {
      setUserName(localStorage.getItem("userName"));
      setRepoName(localStorage.getItem("repoName"));
      setSubmit(true);
      localStorage.removeItem("flag");
      localStorage.removeItem("userName");
      localStorage.removeItem("repoName");
    }

    if (localStorage.getItem("viewStats")) {
      setUserName(localStorage.getItem("userName"));
      setRepoName(localStorage.getItem("repoName"));
      setSubmit(true);
      localStorage.removeItem("viewStats");
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
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      getUserData();
    }
  }, [localStorage.getItem("accessToken")]);

  return (
    <div>
      <div className="navBar">
        <nav
          className="navbar bg-dark border-bottom border-body"
          data-bs-theme="dark"
        >
          <h1
            className="headingNav logo-font"
            onClick={() =>
              window.location.assign("https://gitsight.vercel.app/")
            }
            style={{ cursor: "pointer" }}
          >
            Git
            <GiSpy />
            Sight
          </h1>
          {localStorage.getItem("accessToken") ? (
            <>
              <div className="avatar-container">
                <img
                  src={userData.avatar_url}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    margin: "0px 20px 0px 0px",
                    cursor: "pointer",
                    float: "left",
                  }}
                  onClick={() => setSubMenu(true)}
                ></img>
              </div>
              {subMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "87%",
                    right: "1%",
                    width: "300px",
                  }}
                >
                  <div
                    style={{
                      background: "black",
                      padding: "20px",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#ffffff",
                      }}
                    >
                      <img
                        src={userData.avatar_url}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          marginRight: "15px",
                          marginLeft: "3px",
                        }}
                      ></img>
                      <div>
                        <h5>{userData.login}</h5>
                        <h5 style={{ marginTop: "-10px", color: "gray" }}>
                          {userData.name}
                        </h5>
                      </div>
                      <p
                        style={{
                          margin: "0px 0px 10px 90px",
                          cursor: "pointer",
                          fontSize: "30px",
                        }}
                        onClick={() => setSubMenu(false)}
                      >
                        ×
                      </p>
                    </div>
                    <hr></hr>
                    <p
                      style={{
                        margin: "0px 0px 0px 10px",
                        color: "#ffffff",
                        cursor: "pointer",
                      }}
                      onClick={handleLogout}
                    >
                      Sign out
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <GitHubButton loginWithGithub={loginWithGithub} />
          )}
        </nav>

        {submit && (
          <button
            type="button"
            className="btn btn-success btn-lg"
            id="backButton"
            onClick={() => setSubmit(false)}
          >
            Back
          </button>
        )}

        {localStorage.getItem("accessToken") && !submit && (
          <>
            <h1 className="userGreeting">
              Welcome to your GitSight account, {userData.login}!
            </h1>
          </>
        )}
        {!submit && (
          <h1 className="landingTitle headingNav logo-font">
            Git
            <GiSpy />
            Sight
          </h1>
        )}

        {!submit && (
          <div className="landingContainer">
            <h1 className="landingMessage">
              View information on any GitHub repository below
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3 input-group-lg">
                <input
                  type="text"
                  name="repoUrl"
                  id="repoUrl"
                  className="form-control"
                  placeholder="Enter a Github Repository link here"
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
        )}
      </div>

      <div className="All_Components_Box">
        {submit && <GeneralInfo ghUrl={ghUrl} />}

        {localStorage.getItem("accessToken") && submit && (
          <PRImpact
            submit={submit}
            userName={userName}
            repoName={repoName}
            access_token={localStorage.getItem("accessToken")}
          />
        )}

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
        {/* <Footer/> */}
      </div>

      {localStorage.getItem("accessToken") && !submit && (
        <div>
          <RecentRepos
            userName={userData.login}
            access_token={localStorage.getItem("accessToken")}
          />
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
          {/* <Footer/> */}
        </>
      )}
    </div>
  );
}

export default LandingPage;
