import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";

// Deployment Frequency: how often code is successfully deployed into production
// avg time btwn each deployments: ([sum of (deploy2 creation time - deploy1 creation time), (d3-d2), etc] / [num of deployment]),
// can also visualize all the time in a line/bar graph to show amount of deployment per day/week/year
//>> can be visualized as a line or bar graph
//can toggle to display total deployments by day, week or month w/ avgs on the side for each timeframe
//first calculating from widest time frame and then drilling down

//Deployment frequency measures how often code is successfully deployed into production.
// This metric measures a team’s speed and agility. Teams deploying more often (such as
//  several times a day or once a week) indicate elite or strong-performing teams.
// If your team is deploying less frequently (such as once every few weeks), it may
// be a sign to reduce your deployment size so it’s easier to review, test, and deploy.

function DeploymentFreq({ ghUrl }) {
  const deploymentUrl = ghUrl + `/deployments?per_page=100`;

  const [deployData, setDeployData] = useState([]);
  // let start = "2023-07-27T20:33:20Z";
  // let end = "2023-07-28T00:57:00Z";

  //pulling deployment data from url
  useEffect(() => {
    const fetchDeploymentData = async () => {
      try {
        const response = await axios.get(deploymentUrl);
        setDeployData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDeploymentData();
  }, [deploymentUrl]);

  //if fetched deployment data is empty, display this msg 
  if (!deployData[0]) {
    return <div><h2>NO DEPLOYMENT DATA</h2></div>;
  }

  //for converting time into MS
  function MillisecondsToWeeksDaysHours(totalSeconds) {
    // Convert milliseconds to seconds
    //const totalSeconds = Math.floor(milliseconds / 1000);

    // Calculate weeks, days, hours
    weeks = Math.floor(totalSeconds / (7 * 24 * 60 * 60));
    days = Math.floor((totalSeconds % (7 * 24 * 60 * 60)) / (24 * 60 * 60));
    hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    seconds = Math.floor(totalSeconds % 60);
  }

  // Calculate the time difference using moment.js  [sum of (deploy2 creation time - deploy1 creation time), (d3-d2), etc] / [num of deployment]
  let durationSum = moment.duration();
  let deployDataLength = deployData.length;
  let weeks;
  let days;
  let hours;
  let minutes;
  let seconds;
  for (let i = 0; i < deployDataLength - 1; i++) {
    let startDate = moment(deployData[i + 1].created_at);
    let endDate = moment(deployData[i].created_at);
    let duration = moment.duration(endDate.diff(startDate));
    durationSum.add(duration);
  }

  //divide total sum by number of deployments(the length of deployment data array)
  let avgDeploymentTimeInMS = durationSum.asSeconds() / deployDataLength;
  MillisecondsToWeeksDaysHours(avgDeploymentTimeInMS);
  // // Get the difference in hours, minutes, and seconds
  // let days = durationSum.days();

  //access a repo's deployment info here: https://api.github.com/repos/{username}/{repo_name}/deployments?per_page=100
  //need a count of how many deployments a repo has
  //   -also useful for calc the avg deployments
  //if result = 100, go to next page
  //limit results to 3 pages (100 results per page, 300 results in total)

  return (
    <div>
      <h1>DeploymentFreq</h1>
      <p>
        Average time between deployments: {weeks} weeks, {days} days, {hours}{" "}
        hours, {minutes} minutes, {seconds} seconds
      </p>
    </div>
  );
}

export default DeploymentFreq;
