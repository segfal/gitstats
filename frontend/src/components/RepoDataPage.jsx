import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import LogoutButton from "./githubOAuth/LogoutButton";
import GitHubButton from "./githubOAuth/GithubButton";
import UnreviewedPR from "./UnreviewedPR";
import GeneralInfo from "./GeneralInfo";
import axios from "axios";
import "../css/landingCSS.css";

const CLIENT_ID = "Iv1.997eaea3b91426c1";

function RepoDataPage() {
  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
}

export default RepoDataPage;
