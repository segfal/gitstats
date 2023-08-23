///news feed to showcase all commited changes

import React, { useEffect, useState } from 'react'
import axios from 'axios';

import "../stylesheets/PRImpact.css";
import "../stylesheets/All_Components.css";



const NewsFeed = ({submit,userName, repoName, access_token}) => {
    //Commit message array
    const [commitMessage, setCommitMessage] = useState([]);
    //Commit author array
    const [commitAuthor, setCommitAuthor] = useState([]);
    //Commit date array
    const [commitDate, setCommitDate] = useState([]);
    //Commit url array
    const [commitUrl, setCommitUrl] = useState([]);
    //Commit repo name array
    const [commitRepoName, setCommitRepoName] = useState([]);
    //commit author avatar array
    const [commitAuthorAvatar, setCommitAuthorAvatar] = useState([]);
    

    //Get all commits from repo
    const getCommits = async (Repo, User) => {

        let commits = [];
        const response = await axios.get(
            `https://api.github.com/repos/${User}/${Repo}/commits?per_page=10`,
            {
              headers: {
                Authorization: "Bearer " + access_token,
              },
            }
        );
        commits = response.data;
        return commits;
    }

    //Get all commit messages from repo
    useEffect(() => {

        if(submit)  {
        getCommitMessages();
        }
    })
    return(
        <div>
            LOADING NEWS FEED...
        </div>
    )

}


export default NewsFeed;


