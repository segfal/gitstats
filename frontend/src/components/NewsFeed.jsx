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

        const getCommitMessages = async () => {
            let commits = await getCommits(repoName, userName);
            let commitMessages = [];
            let commitAuthors = [];
            let commitDates = [];
            let commitUrls = [];
            let commitRepoNames = [];
            let commitAuthorAvatars = [];
            for (let i = 0; i < commits.length; i++) {
                commitMessages.push(commits[i].commit.message);
                commitAuthors.push(commits[i].commit.author.name);
                commitDates.push(commits[i].commit.author.date);
                commitUrls.push(commits[i].html_url);
                commitRepoNames.push(commits[i].repository.name);
                commitAuthorAvatars.push(commits[i].author.avatar_url);
            }
            setCommitMessage(commitMessages);
            setCommitAuthor(commitAuthors);
            setCommitDate(commitDates);
            setCommitUrl(commitUrls);
            setCommitRepoName(commitRepoNames);
            setCommitAuthorAvatar(commitAuthorAvatars);
        }
        getCommitMessages();
    })


}


export default NewsFeed;


