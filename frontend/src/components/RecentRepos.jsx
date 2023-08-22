import React,{useState,useEffect} from 'react';
import axios from 'axios';
import RecentRepoCard from './RecentRepoCard';
import "../stylesheets/landingCSS.css";
import "../stylesheets/RecentRepo.css";
import "../stylesheets/All_Components.css";

const RecentRepos = ({userName, access_token}) => {
    const [userRepos, setUserRepos] = useState([]);
    const fetchRecentRepos = async () => {
        try {
            //console.log("User Name" , userName);
          const response = await axios.get(
            `https://api.github.com/users/${userName}/repos?sort=updated&per_page=4`,
            {
              headers: {
                Authorization: "Bearer " + access_token,
              },
            }
          );
          setUserRepos(response.data);
          //console.log("Response data ", response.data);
          //console.log("Access Token" ,access_token);
        } catch (error) {
          console.log(error);
        }
    };

    useEffect(() => {
        fetchRecentRepos();
    }, [userName,userRepos.length]);

    return ( 
        <div>
            <h1 className='landingMessageBottom'>Your Recent Repositories</h1>
            <div className='repos_container'>
            {
                userRepos.map((repo) => {
                    return( <RecentRepoCard repo = {repo}/> )
                    // console.log(repo.id)
                    //console.log(repo)
                })
            }
            </div>
            {/* <div className='repos_container'>
                <RecentRepoCard repo={userRepos.get(1)}/>
                <RecentRepoCard repo={userRepos.get(2)}/>
            </div>
            <div className='repos_container'>
                <RecentRepoCard repo={userRepos.get(3)}/>
                <RecentRepoCard repo={userRepos.get(4)}/>
            </div> */}
        </div>
    )
}

export default RecentRepos;