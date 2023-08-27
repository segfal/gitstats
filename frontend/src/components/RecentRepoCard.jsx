import React,{useState} from "react";
import axios from "axios";
import moment from "moment";
import "../stylesheets/RecentRepo.css";
import "../stylesheets/All_Components.css";

const RecentRepoCard = ({repo, userName}) => {
    const repoName = repo.name;
    const description = repo.description;
    const dateCreated = repo.created_at;
    const dateUpdated = repo.updated_at;
    const [isCopied, setIsCopied] = useState(false);

    // const handleCopyLink = () => {
    //     console.log("copying link");
    //     navigator.clipboard.writeText(`https://api.github.com/repos/${repo.full_name}`).then(
    //       function () {
    //         console.log('Copying to clipboard was successful!');
    //         setIsCopied(true);
    
    //         setTimeout(() => {
    //           setIsCopied(false);
    //         }, 3000);
    //       },
    //       function (err) {
    //         console.error('Could not copy text: ', err);
    //       }
    //     );
    //   };

    const handleViewStats = () => {
      localStorage.setItem("viewStats", true);
      localStorage.setItem("repoName", repoName);
      localStorage.setItem("userName", userName);
      window.location.assign("https://gitsight.vercel.app/");
    }

    // onClick for "View Stats" button should lead to page of stats with the api link passed using "full_name" passed from the "repo" prop as: https://api.github.com/repos/${repo.full_name}
    // otherwise, could replace the "View Stats" button with a "Copy Repo Link" button so that the repo link can be pasted into the input box and processed normally
    
    return (
        <div className="card_container">
          
            <h1 className="repo-name">{repoName}</h1>
            <hr/>
            <h2 className="dates">Created on {moment(dateCreated).format("MMMM Do YYYY")}</h2>
            <h2 className="dates">Updated on {moment(dateUpdated).format("MMMM Do YYYY")}</h2>
            <p className="desc">Description: {description}</p>
            {/* <button className="btn btn-success view-stats" onClick={handleCopyLink} style={{marginRight: '10px'}}>COPY REPO LINK</button> */}
            <button className="btn btn-success view-stats" onClick={handleViewStats}>VIEW STATS</button>
        </div>
    )
}

export default RecentRepoCard;