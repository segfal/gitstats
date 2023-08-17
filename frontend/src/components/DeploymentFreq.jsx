import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

import "../stylesheets/DeploymentFreq.css"
import "../stylesheets/All_Components.css";

// Deployment Frequency: how often code is successfully deployed into production
// avg time btwn each deployments: ([sum of (deploy2 creation time - deploy1 creation time), (d3-d2), etc] / [num of deployment]),
// can also visualize all the time in a line/bar graph to show amount of deployment per day/week/year
//last 10 days, 10 weeks and 12 months
//>> can be visualized as a line or bar graph
//can toggle to display total deployments by day, week or month w/ avgs on the side for each timeframe
//first calculating from widest time frame and then drilling down

//Deployment frequency measures how often code is successfully deployed into production.
// This metric measures a team’s speed and agility. Teams deploying more often (such as
//  several times a day or once a week) indicate elite or strong-performing teams.
// If your team is deploying less frequently (such as once every few weeks), it may
// be a sign to reduce your deployment size so it’s easier to review, test, and deploy.

function DeploymentFreq({ ghUrl, access_token }) {
  const deploymentUrl = ghUrl + `/deployments?per_page=100`;
  const [deployData, setDeployData] = useState([]);
  const [typeOfTime, setTypeOfTime] = useState("months");

  //pulling deployment data from url
  //only calculates up to 300 deployments
  //to increase/decrease the # of deployment 
  //pages fetched, change the while loop below
  useEffect(() => {
    const fetchDeploymentData = async () => {
      try {
        let newArr = [];
        let page = 1;
        const response = await axios.get(deploymentUrl, {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        });
        newArr = response.data;

        while (newArr.length >= 100 * page && newArr.length < 300) {
          page++;
          console.log("PAGE >>> "+ page)
          const response2 = await axios.get(
            `${ghUrl}/deployments?per_page=100&page=${page}`,
            {
              headers: {
                Authorization: "Bearer " + access_token,
              },
            }
          );
          newArr.push(...response2.data);
          
        }

        setDeployData(newArr);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDeploymentData();
  }, [deploymentUrl]);

  //if fetched deployment data is empty, display this msg
  if (!deployData[0]) {
    return (
      <div className="Deployment_Box componentBox">
        <h1>Deployment Frequency</h1>
        <h2>NO DEPLOYMENT DATA</h2>
      </div>
    );
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
  console.log("DEPLOY DATA LENGTH >>> "+ deployDataLength)
  let weeks;
  let days;
  let hours;
  let minutes;
  let seconds;
  const currentDate = moment();
  const latestDeployment = moment(deployData[0].created_at).format(
    "MMMM DD, YYYY"
  );
  // console.log("Current Date: "+currentDate.format("MMM ")+ "Previous Month "+ currentDate.subtract(1,"month").format("MMM "))
  let lastDayOfCurrentMonth = moment(currentDate).endOf("month");
  let lastDayOfCurrentWeek = moment(currentDate).endOf("week");
  let monthArray = new Array(12).fill(0); //12 months
  let weekArray = new Array(10).fill(0); // 10 weeks
  let dateArray = new Array(20).fill(0); //20 days

  for (let i = 0; i < deployDataLength - 1; i++) {
    let startDate = moment(deployData[i + 1].created_at);
    let endDate = moment(deployData[i].created_at);
    let duration = moment.duration(endDate.diff(startDate));
    durationSum.add(duration);

    //endOf used here to include all days in current month to accurately log freq in prev months
    const durationInMonths = lastDayOfCurrentMonth.diff(endDate, "months");
    if (durationInMonths < monthArray.length) monthArray[durationInMonths]++;
    //console.log("Duration in days: " + durationInMonths);

    //if time is btwn one week and 2 weeks, will return 1 week b/c moment starts indexing at 0 instead of 1
    const durationInWeeks = lastDayOfCurrentWeek.diff(endDate, "weeks");
    if (durationInWeeks < weekArray.length) weekArray[durationInWeeks]++;

    // console.log("Duration in weeks: " + durationInWeeks);

    const durationInDays = currentDate.diff(endDate, "days");
    if (durationInDays < dateArray.length) dateArray[durationInDays]++;
    //console.log("Duration in days: " + durationInDays);
  }

  //the following counts in the last date that the for loop above leaves out
  const lastDate = moment(deployData[deployDataLength - 1].created_at);
  const lastDurationInMonths = lastDayOfCurrentMonth.diff(lastDate, "months");
  const lastDurationInWeeks = lastDayOfCurrentWeek.diff(lastDate, "weeks");
  const lastDurationInDays = currentDate.diff(lastDate, "days");

  if (lastDurationInMonths < monthArray.length) {
    monthArray[lastDurationInMonths]++;
  }
  if (lastDurationInWeeks < weekArray.length) {
    weekArray[lastDurationInWeeks]++;
  }
  if (lastDurationInDays < dateArray.length) {
    dateArray[lastDurationInDays]++;
  }
  // console.log("MONTHS ARRAY: " + monthArray);
  // console.log("WEEKS ARRAY: " + weekArray);
  // console.log("DAYS ARRAY: " + dateArray);
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

  //code for charts
  const monthChartData = monthArray.map((numOfDeployment, index) => ({
    name: moment().subtract(index, "month").format("MMM"),
    "# of Deployment": numOfDeployment,
  }));

  const weeksChartData = weekArray.map((numOfDeployment, index) => ({
    name:
      moment().subtract(index, "weeks").startOf("week").format(" MM/DD") +
      " - " +
      moment().subtract(index, "weeks").endOf("week").format("MM/DD"),
    "# of Deployment": numOfDeployment,
  }));

  const daysChartData = dateArray.map((numOfDeployment, index) => ({
    name: moment().subtract(index, "days").format("MMM DD"),
    "# of Deployment": numOfDeployment,
  }));

  const renderMonthsChart = () => {
    return (
      <div>
        <h2 className="chartTitle">Deployments Within the Last 12 Months</h2>
        <ResponsiveContainer className="DeployChart" width="90%" height={400}>
          <BarChart
            data={monthChartData}
            margin={{ bottom: 40, right: 40 }}
            stroke="white"
          >
            <XAxis
              dataKey="name"
              stroke="#8884d8"
              angle={45}
              textAnchor="start"
            />
            <YAxis stroke="#fffffe" />
            <Tooltip labelStyle={{ color: '#000' }}/>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Legend verticalAlign='top' align='right' height={30}/>
            <Bar dataKey="# of Deployment" fill="#8884d8" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
        
      </div>
    );
  };

  const renderWeeksChart = () => {
    return (
      <div>
        <h2 className="chartTitle">Deployments Within the Last 10 Week</h2>
        <ResponsiveContainer width="90%" height={400} className="DeployChart">
          <BarChart
            data={weeksChartData}
            margin={{ bottom: 70, right: 40 }}
            stroke="white"
          >
            <XAxis
              dataKey="name"
              stroke="#8884d8"
              angle={45}
              textAnchor="start"
            />
            <YAxis stroke="#fffffe" />
            <Tooltip labelStyle={{ color: '#000' }}/>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Legend verticalAlign='top' align='right' height={30}/>
            <Bar dataKey="# of Deployment" fill="#8884d8" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
        
      </div>
    );
  };

  // for edinting the chart
  const renderDaysChart = () => {
    return (
      <div >
        <h2 className="chartTitle">Deployments Within the Last 20 Days</h2>
        <ResponsiveContainer className="DeployChart" width="90%" height={400}>
            <BarChart
            data={daysChartData}
            margin={{ bottom: 50, right: 40 }}
            stroke="white"
          >
            <XAxis
              dataKey="name"
              stroke="#8884d8"
              angle={45}
              textAnchor="start"
            />
            <YAxis stroke="#fffffe" />
            <Tooltip labelStyle={{ color: '#000' }}/>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Legend verticalAlign='top' align='right' height={30}/>
            <Bar dataKey="# of Deployment" fill="#8884d8" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
        
      </div>
    );
  };

  const handleMonths = () => setTypeOfTime("months");
  const handleWeeks = () => setTypeOfTime("weeks");
  const handleDays = () => setTypeOfTime("days");

  return (
    <div className="Deployment_Box componentBox">
      <h1>Deployment Frequency</h1>
      <h3>
        Deployed <span className="green">{deployDataLength===300?"over 300 times":deployDataLength+" times"}</span>
      </h3>
      <h3>
        Last deployment was deployed on 
        <br /> 
        <i className="green">{latestDeployment}</i>
      </h3>
      <h3>
        Average time between deployments
        <br />
        <i className="green">{weeks} weeks, {days} days, {hours} hours, {minutes} minutes, <br /> {seconds} seconds</i>
      </h3>
      <h4 className="note">Note: The above calulations only calculates up to 300 deployments.</h4>
      <div>
        {typeOfTime === "months" && renderMonthsChart()}
        {typeOfTime === "weeks" && renderWeeksChart()}
        {typeOfTime === "days" && renderDaysChart()}
      </div>
      <div className="deployButton">
        <button className="purpleButton" onClick={handleMonths}>Months</button>
        <button className="purpleButton" onClick={handleWeeks}>Weeks</button>
        <button className="purpleButton" onClick={handleDays}>Days</button>
      </div>
    </div>
  );
}

export default DeploymentFreq;
