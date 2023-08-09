import React from "react";
import moment from "moment";
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

function DeploymentFreq() {
  let start = "2023-07-27T20:33:20Z";
  let end = "2023-07-28T00:57:00Z";

  // Calculate the time difference using moment.js
  let startDate = moment(start);
  let endDate = moment(end);
  let duration = moment.duration(endDate.diff(startDate));

  // Get the difference in hours, minutes, and seconds
  let hours = duration.hours();
  let minutes = duration.minutes();
  let seconds = duration.seconds();
//   console.log(duration)

  //access a repo's deployment info here: https://api.github.com/repos/{username}/{repo_name}/deployments?per_page=100
  //need a count of how many deployments a repo has
  //   -also useful for calc the avg deployments
  //if result = 100, go to next page
  //limit results to 3 pages (100 results per page, 300 results in total)

  return (
    <div>
      <h1>DeploymentFreq</h1>
      <p>
        Time difference: {hours} hours, {minutes} minutes, {seconds} seconds
      </p>
    </div>
  );
}

export default DeploymentFreq;
