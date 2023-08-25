///news feed to showcase all commited changes

import React, { useEffect, useState } from 'react'
import axios from 'axios';

import "../stylesheets/NewsFeed.css";
import "../stylesheets/All_Components.css";



const NewsFeed = ({submit,ghUrl}) => {
    //Commit message array
    const [allCommits, setAllCommits] = useState([]);
    

    //Get all commits from repo
    const getCommits = async (url) => {
        console.log(ghUrl)
        let commits = [];
        const response = await axios.get(
            `${ghUrl}/commits?per_page=10`,
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
              },
            }
        );
        console.log(localStorage.getItem("accessToken"))
        console.log(`Getting commits from ${url}/commits?per_page=10`)
        commits = response.data;
        setAllCommits(commits);
        
        return commits;
    }

    //Get all commit messages from repo
    useEffect(() => {
            getCommits(ghUrl);
            console.log("Getting commits");
        
    },[])
    return(
        <div className='NewsFeedBox componentBox'>
            <h1>Recent Commits</h1>
            
            {
                allCommits.map((commit) => (
                    <div className='card'>
                        <div className='nameandavatar'>
                            <img src={commit.author.avatar_url} alt='avatar' className='avatar'/>
                            <h3>{commit.commit.author.name}</h3>
                            <p>{commit.commit.message}</p>
                            </div>
                        
                        
                    </div>
                ))

            }
            
        </div>
    )

}


export default NewsFeed;


