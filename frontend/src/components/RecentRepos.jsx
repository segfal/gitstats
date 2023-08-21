import React,{useState,useEffect} from 'react';
import axios from 'axios';
import RecentRepoCard from './RecentRepoCard';
import "../stylesheets/landingCSS.css";
import "../stylesheets/RecentRepo.css";
import "../stylesheets/All_Components.css";

const RecentRepos = ({userName, access_token}) => {
    const [userRepos, setUserRepos] = useState();
    const fetchRecentRepos = async () => {
        try {
          const response = await axios.get(
            `https://api.github.com/users/${userName}/repos?sort=updated&per_page=4`,
            {
              headers: {
                Authorization: "Bearer " + access_token,
              },
            }
          );
          setUserRepos(response.data);
          console.log(response);
        } catch (error) {
          console.log(error);
        }
    };

    useEffect(() => {
        fetchRecentRepos();
    }, [userRepos]);

    return ( 
        <div>
            <h1 className='landingMessageBottom'>Your Recent Repositories</h1>
            <div className='repos_container'>
                <RecentRepoCard repo={userRepos[1]}/>
                <RecentRepoCard repo={userRepos[2]}/>
            </div>
            <div className='repos_container'>
                <RecentRepoCard repo={userRepos[3]}/>
                <RecentRepoCard repo={userRepos[4]}/>
            </div>
        </div>
    )
}

export default RecentRepos;