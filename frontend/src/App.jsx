import React,{ useState,useEffect } from 'react'
import GeneralInfo from './components/GeneralInfo'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DeploymentFreq from './components/DeploymentFreq'
import TimeToMerge from './components/TimeToMerge'

function App() {
  const [count, setCount] = useState(0)
  const [repoUrl, setRepoUrl] = useState('');
  const [userName, setUserName] = useState('');
  const [repoName, setRepoName] = useState('');
  // const [ghUrl, setGhUrl] = useState('');
  const [submit, setSubmit] = useState(false);
  // const ghUrl = `https://api.github.com/repos/${username}/${repoName}`;
    useEffect(()=> {
      console.log(repoUrl)
    }, [repoUrl])

    const handleSubmit = (e) => {
      e.preventDefault();
      getUserRepo(repoUrl);
      repoSearch(userName, repoName);
      // const parts = repoUrl.split('/');
      // setUsername(parts[parts.length - 2]);
      // setRepoName(parts[parts.length - 1]);
      setSubmit(true);
    }
  

  // const repoSearch = async() => {
  //   const response = await fetch(`${ghUrl}${userName}/${repoUrl}`);
  //   const data = await response.json();
  //   console.log(data);
  // }
  

  //useEffect for loading the user's repo upon entering input
  // useEffect(() =>{
    // const repoSearch =  async() => {
    //     // Parse useName and 
    //    // const response = await fetch(ghUrl + userName + '/' + repoUrl);
    // // const data = await response.json();
    // // console.log(data);
      

    // }
    const getUserRepo = async() => {
      //https://api.github.com/repos/segfal/KaraokeApp
      //https://github.com/{username}/{repo-name}
        const splitLink = repoUrl.split("com/");
        const userRepo = splitLink[1].split("/");
        setUserName(userRepo[0]);
        setRepoName(userRepo[1]);
    }

    const repoSearch = async(repoName, userName) => {
      const response = await axios.get(`https://api.github.com/repos/${userName}/${repoName}`);
      const data = await response.json();
      console.log(data);
    }
    

  return (
    <div>
      <div>
        <h1>GitHub Stats</h1>
        <form onSubmit={handleSubmit}>
        {/* <form> */}
          <label>Enter the link to your GitHub repository: </label>
          <input name="repoUrl" onChange={e => setRepoUrl(e.target.value)}/>
          <button type="submit">Enter</button>
        </form>
      </div>
    
    {submit && (<GeneralInfo ghUrl={ghUrl}/>)}
    <DeploymentFreq />
    <TimeToMerge userName={userName} repoName={repoName}/>
    </div>
  )
}

export default App