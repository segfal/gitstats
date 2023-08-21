import React from "react";
import axios from "axios";
import moment from "moment";
import "../stylesheets/RecentRepo.css";
import "../stylesheets/All_Components.css";

const RecentRepoCard = ({repo}) => {
    const repoName = repo.name;
    const description = repo.description;
    const dateCreated = repo.created_at;
    const dateUpdated = repo.updated_at;

    // onClick for "View Stats" button should lead to page of stats with the api link passed using "full_name" passed from the "repo" prop as: https://api.github.com/repos/${repo.full_name}
    // otherwise, could replace the "View Stats" button with a "Copy Repo Link" button so that the repo link can be pasted into the input box and processed normally
    
    return (
        <div className="card_container">
            <h1 className="repo-name">{repoName}</h1>
            <h2>Created on {moment(dateCreated).format("MMMM Do YYYY")}</h2>
            <h2>Updated on {moment(dateUpdated).format("YMMMM Do YYYY")}</h2>
            <p className="desc">Description: {description}</p>
            <button className="view-stats">VIEW STATS</button>
        </div>
    )
}

export default RecentRepoCard;