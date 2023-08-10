import React,{ useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DeploymentFreq from './components/DeploymentFreq'

function App() {
  const [count, setCount] = useState(0)
  const [repoUrl, setRepoUrl] = useState('');
  const [userName, setUserName] = useState('');
  const ghUrl = `https://api.github.com/repos/${userName}/${repoUrl}`;
  const [submit, setSubmit] = useState(false);

  // const repoSearch = async() => {
  //   const response = await fetch(`${ghUrl}${userName}/${repoUrl}`);
  //   const data = await response.json();
  //   console.log(data);
  // }
  

  //useEffect for loading the user's repo upon entering input
  // useEffect(() =>{
    const repoSearch =  async() => {
       // const response = await fetch(ghUrl + userName + '/' + repoUrl);
    // const data = await response.json();
    // console.log(data);
      

    }
   
  // }, []
  
  // )
  return (
    <div>
      <div>
        <h1>GitHub Stats</h1>
        <form onSubmit={repoSearch}>
          <label>Enter the link to your GitHub repository: </label>
          <input name="repoUrl" onChange={e => setRepoUrl(e.target.value)}/>
          <button type="submit" onClick={() => setSubmit(true)}>Enter</button>
        </form>
       
      </div>
    
    {submit && (<GeneralInfo ghUrl={ghUrl}/>)}
    <DeploymentFreq />
    </div>
  )
}

export default App
