import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import LogoutButton from "./githubOAuth/LogoutButton";
import GitHubButton from "./githubOAuth/GithubButton";
import UnreviewedPR from "./UnreviewedPR";
import GeneralInfo from "./GeneralInfo";
import TimeToMerge from "./TimeToMerge";
import DeploymentFreq from "./DeploymentFreq";
import axios from "axios";
import "../stylesheets/landingCSS.css";
import "../stylesheets/All_Components.css";

const CLIENT_ID = "Iv1.997eaea3b91426c1";

function RepoDataPage(props) {
  const { userName, repoName, ghUrl } = props;
  return (
    <div className="All_Components_Box">
      <GeneralInfo ghUrl={ghUrl} />

      <TimeToMerge
        submit="true"
        userName={userName}
        repoName={repoName}
        access_token={localStorage.getItem("accessToken")}
      />

      <DeploymentFreq
        ghUrl={ghUrl}
        access_token={localStorage.getItem("accessToken")}
      />

      <UnreviewedPR
        userName={userName}
        repoName={repoName}
        access_token={localStorage.getItem("accessToken")}
      ></UnreviewedPR>
    </div>
  );
}

export default RepoDataPage;
