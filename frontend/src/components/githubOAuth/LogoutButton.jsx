import React from "react";
import "./loginButton.css";

const LogoutButton = ({ handleLogout }) => {
  return (
    <button
      className="button button--social-login button--github"
      onClick={handleLogout}
    >
      <span style={{ marginLeft: "10px", fontFamily: "Roboto, sans-serif" }}>
        LOGOUT
      </span>
    </button>
  );
};

export default LogoutButton;
