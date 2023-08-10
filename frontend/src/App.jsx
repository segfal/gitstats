import React,{ useState,useEffect } from 'react'
import './App.css'
import axios from "axios";
import GitHubButton from './components/githubOAuth/GithubButton';
import LogoutButton from './components/githubOAuth/LogoutButton';

const CLIENT_ID = "Iv1.997eaea3b91426c1";

function App() {
  console.log(CLIENT_ID);
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});
  const [count, setCount] = useState(0)
  const [repoUrl, setRepoUrl] = useState('');
  const [userName, setUserName] = useState('');
  const ghUrl = `https://api.github.com/repos/${userName}/${repoUrl}`;
  const [submit, setSubmit] = useState(false);

  const loginWithGithub = () => {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`);
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.assign(`http://localhost:5173/`);
  }

  useEffect(() => {
    // access token stored in local storage for now
    // http://localhost:5173/?code=46052fed06f20abbef61
    const query = window.location.search;
    const urlParams = new URLSearchParams(query);
    const codeParam = urlParams.get("code");
    console.log(codeParam);

    if(codeParam && !localStorage.getItem("accessToken")){
      const getAccessToken = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/login/getAccessToken?code=${codeParam}`);
          console.log(response.data.access_token);
          localStorage.setItem("accessToken", response.data.access_token);
          setRerender(!rerender);
        } catch (error) {
          console.log(error);
        }
      }
      getAccessToken();
    }
  }, []);

  const getUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/login/getUserData`,
        {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("accessToken"),
          },
        }
      );
      console.log(response.data);
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {localStorage.getItem("accessToken") ? (
        <>
          <LogoutButton handleLogout={handleLogout}/>
        </>
      ) : (
        <>
          <GitHubButton loginWithGithub={loginWithGithub}></GitHubButton>
        </>
      )}
      <div>
        <h1>GitHub Stats</h1>
        <form>
          <label>Enter the link to your GitHub repository: </label>
          <input name="repoUrl" onChange={(e) => setRepoUrl(e.target.value)} />
          <button type="submit" onClick={() => setSubmit(true)}>
            Enter
          </button>
        </form>
      </div>

      {submit && <GeneralInfo ghUrl={ghUrl} />}
    </div>
  );
}

export default App
