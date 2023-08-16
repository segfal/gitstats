import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

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
  const [repoName, setRepoName] = useState("");
  const [description, setDescription] = useState("");
  const [dateCreated, setDateCreated] = useState("");
  const [dateUpdated, setDateUpdated] = useState("");
  const [contributors, setContributors] = useState([{}]);
  const [commitTotal, setCommitTotal] = useState("");

  useEffect(() => {
    async function fetchRepoInfo() {
      try {
        const response = localStorage.getItem("accessToken")
          ? await axios.get(ghUrl, {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
              },
            })
          : await axios.get(ghUrl);
        setRepoName(response.data.name);
        setDescription(response.data.description);
        setDateCreated(response.data.created_at);
        setDateUpdated(response.data.updated_at);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRepoInfo();
  }, [ghUrl]);

  // useEffect(() => {
  //   async function fetchContributors() {
  //     try {
  //       const response = await axios.get(`${ghUrl}/contributors`);
  //       console.log(response.data);
  //       setContributors(response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   fetchContributors();
  // }, []);

  // Limit contributor
  useEffect(() => {
    const fetchAllContributors = async () => {
      try {
        let newArr = [];
        const response = localStorage.getItem("accessToken")
          ? await axios.get(`${ghUrl}/contributors`, {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
              },
            })
          : await axios.get(`${ghUrl}/contributors`);
        newArr = response.data;

        const response2 = localStorage.getItem("accessToken")
          ? await axios.get(`${ghUrl}/commits?per_page=1&page=1`, {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
              },
            })
          : await axios.get(`${ghUrl}/commits?per_page=1&page=1`);
        const link_header = response2.headers.get("Link", "");
        console.log("Header", link_header);
        const regex = /page=(\d+)/g;
        const matches = link_header.match(regex);

        if (matches && matches.length > 0) {
          const page = matches[3].split("=")[1];
          console.log("Parsed page:", page);
          setCommitTotal(page);
        }

        // while (newArr.length >= 100 * page && newArr.length < 200) {
        //   page++;
        //   console.log("PAGE >>> "+ page)
        //   const response2 = await axios.get(
        //     `${ghUrl}/contributors?per_page=100&page=${page}`
        //   );
        //   newArr.push(...response2.data);

        // }
        setContributors(newArr);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllContributors();
  }, [ghUrl]);

  const sortedContributors = contributors.sort(
    (a, b) => b.contributions - a.contributions
  );
  // const totalContributions = contributors.reduce((acc, curr) => {
  //   return acc + curr.contributions;
  // }, 0);
  const chartData = sortedContributors.map((contributor, index) => ({
    name: contributor.login,
    contributions: contributor.contributions,
  }));

  return (
    <div>
      <h1>General Info</h1>
      <h1>{repoName}</h1>
      <p>Description: {description}</p>
      <p>Date Created: {moment(dateCreated).format("YYYY-MM-DD, h:mm:ss a")}</p>
      <p>Date Updated: {moment(dateUpdated).format("YYYY-MM-DD, h:mm:ss a")}</p>
      <h2>Total Commits: {commitTotal}</h2>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, marginRight: "20px" }}>
          <h2>Top Contributors:</h2>
          {contributors.slice(0, 5).map((contributor, i) => {
            const isTopContributor = i === 0;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}>
                <img
                  src={contributor.avatar_url}
                  alt="avatar"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                {isTopContributor && (
                  <span
                    style={{
                      marginRight: "10px",
                      fontSize: "1.5em",
                      color: "#FFD700",
                    }}>
                    👑
                  </span>
                )}
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: "bold",
                      color: isTopContributor ? "#FFD700" : "inherit",
                    }}>
                    {contributor.login}
                  </p>
                  <p style={{ margin: 0 }}>
                    Contributions: {contributor.contributions}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ flex: 2 }}>
          <h2>Contributions Chart</h2>
          <div style={{ height: "400px" }}>
            <BarChart
              width={700}
              height={400}
              data={chartData}
              margin={{ top: 20, right: 20, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                stroke="#8884d8"
                interval={0}
                angle={-45}
                tickLine={false}
              />
              <YAxis />
              <Tooltip
                formatter={(value, name, entry) => {
                  const percentage = (value / commitTotal) * 100;
                  return [`${value} (${percentage.toFixed(2)}%)`, name];
                }}
              />
              <Legend verticalAlign="top" align="right" height={30} />
              <Bar
                name="Contributions"
                dataKey="contributions"
                fill="#8884d8"
              />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfo;
