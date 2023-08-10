import React,{ useState,useEffect } from 'react'
import GeneralInfo from './components/GeneralInfo'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DeploymentFreq from './components/DeploymentFreq'

function App() {
  const [count, setCount] = useState(0)
  const [repoUrl, setRepoUrl] = useState('');
  const [username, setUsername] = useState('');
  const [repoName, setRepoName] = useState('');
  // const [ghUrl, setGhUrl] = useState('');
  const [submit, setSubmit] = useState(false);
  const ghUrl = `https://api.github.com/repos/${username}/${repoName}`;
    useEffect(()=> {
      console.log(repoUrl)
    }, [repoUrl])

    const handleSubmit = (e) => {
      e.preventDefault();
      const parts = repoUrl.split('/');
      setUsername(parts[parts.length - 2]);
      setRepoName(parts[parts.length - 1]);
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
    </div>
  )
}

export default App
