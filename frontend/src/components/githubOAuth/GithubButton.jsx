import React from "react";
import './loginButton.css';
import {FaGithub} from "react-icons/fa";

const GitHubButton = ({ loginWithGithub }) => {
  return (
    <button
      className="button button--social-login button--github"
      onClick={loginWithGithub}
    >
      <FaGithub size={27} style={{marginLeft: "5px"}}></FaGithub>
      <span style={{marginLeft: "10px", fontFamily: "Roboto, sans-serif"}}>LOGIN WITH GITHUB</span>
    </button>
  );
};

export default GitHubButton;
