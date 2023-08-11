import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const GeneralInfo = ({ ghUrl }) => {
  /*
    Use ghUrl for general info
    Do an axios call on ghUrl to retrieve data like repo_name, description, created at, updated at 

    Contributors: ghUrl/contributors 
    Total contributions: Go through each object that contains a contributor, go to 'contributions' and add them up.

    Individual Contributors: In each object get, "login", "avatar_url", "html_url", and "contributions"


    ghUrl: https://api.github.com/repos/{username}/{repo_name}
    https://api.github.com/repos/segfal/KaraokeApp
    
    
    */
  const [repoName, setRepoName] = useState('');
  const [description, setDescription] = useState('');
  const [dateCreated, setDateCreated] = useState('');
  const [dateUpdated, setDateUpdated] = useState('');
  const [contributors, setContributors] = useState([{}]);

  useEffect(() => {
    async function fetchRepoInfo() {
      try {
        const response = await axios.get(ghUrl);
        setRepoName(response.data.name);
        setDescription(response.data.description);
        setDateCreated(response.data.created_at);
        setDateUpdated(response.data.updated_at);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRepoInfo();
  }, []);

  useEffect(() => {
    async function fetchContributors() {
      try {
        const response = await axios.get(`${ghUrl}/contributors`);
        console.log(response.data);
        setContributors(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchContributors();
  }, []);

  const totalContributions = contributors.reduce((acc, curr) => {
    return acc + curr.contributions;
  }, 0);
  const chartData = contributors.map((contributor) => ({
    name: contributor.login,
    contributions: contributor.contributions,
  }));

  return (
    <div>
      <h1>General Info</h1>
      <h1>{repoName}</h1>
      <p>Description: {description}</p>
      <p>Date Created: {moment(dateCreated).format('YYYY-MM-DD, h:mm:ss a')}</p>
      <p>Date Updated: {moment(dateUpdated).format('YYYY-MM-DD, h:mm:ss a')}</p>
      <h2>Total Commits: {totalContributions}</h2>
      <h2>Contributors:</h2>
      {contributors.map((contributor, i) => {
        return (
          <div key={i}>
            <li>{contributor.login}</li>
            <li>{contributor.contributions}</li>
            <li>
              <img src={contributor.avatar_url} alt="avatar" />
            </li>
          </div>
        );
      })}
      <h2>Contributions Chart</h2>
      <div style={{ height: '400px' }}>
        <BarChart
          width={600}
          height={300}
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="contributions" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};

export default GeneralInfo;
