import React,{useState,useEffect} from 'react'
import moment from 'moment'
import axios from 'axios'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Label,
    Legend,
    LineChart,
    Line,
    ResponsiveContainer
  } from 'recharts';

import "../stylesheets/TimeToMerge.css";
import "../stylesheets/All_Components.css";

const TimeToMerge = ({submit,userName, repoName, access_token}) => {
    ///pull request took x hours to merge
    const [timeToMerge, setTimeToMerge] = useState(0)
    const [mergeArray, setMergeArray] = useState([]);
    const [lastMerge, setLastMerge] = useState({});

    const PullSearch = async (repoName, userName) => {
        const response = await axios.get(
          `https://api.github.com/search/issues?q=repo:${userName}/${repoName}/+is:pr+is:merged&per_page=100`,
          {
            headers: {
              Authorization: "Bearer " + access_token,
            },
          }
        );
        //console.log("response: ", response);
        // const response = await axios.get(url)
        const prs = response.data.items
        return prs;
    }

    ///https://api.github.com/repos/segfal/KaraokeApp
    const computeTime = async () => {
        let sum = 0;
        let arr = [];
        //https://api.github.com/search/issues?q=repo:segfal/karaokeapp/+is:pr+is:merged
        let pullInfo = await PullSearch(repoName, userName);
        //console.log("pullInfo: ", pullInfo);
        //console.log("pullInfo.length: ", pullInfo.length);
        for (let i = 0; i < pullInfo.length; i++) {
            // get the "created_at" and "closed_at" fields
            let createdAt = moment(pullInfo[i].created_at);
            let mergedAt = moment(pullInfo[i].pull_request.merged_at);
            

            let difference = mergedAt.diff(createdAt, 'seconds');
            let hour = Math.floor(difference/60/60);
            let min = Math.floor(difference/60 - (hour*60));
            let time = parseFloat(hour +"."+min);
         
            //name - pr number and pr title
            //time - hh.mm float format
            arr.push({name:"PR#"+pullInfo[i].number +" : "+ pullInfo[i].title, time: time})

            // add the difference to sum
            sum += difference;
        }
        setTimeToMerge(sum / pullInfo.length);
        setMergeArray(arr);
        setLastMerge(pullInfo[0].pull_request);
        console.log("timeToMerge: ", mergeArray);
        return timeToMerge;
    }

    useEffect(() => {
        if(submit){
            computeTime();
        }

    },[submit,timeToMerge,mergeArray.length,userName, repoName]);
    const hourMinuteSeconds = (seconds) => {

        let hours = Math.floor(seconds / 3600);
        console.log("seconds: ", seconds)
        console.log("hours: ", hours)
        let minutes = Math.floor((seconds % 3600) / 60);
        seconds = Math.floor(seconds % 60);
        if(hours < 1 && minutes < 1){
            return `${seconds} seconds`
        }
        if(hours < 1){
            return `${minutes} minutes and ${seconds} seconds`
        }
        return `${hours} hours ${minutes} minutes ${seconds} seconds`
    }

    //custom tooltip(the popup box when hover over data), label = name, payload[0].value = time
    // const CustomTooltip = ({ active, payload, label }) => {
    //     if (active && payload && payload.length) {
    //         let time = "" + payload[0].value;

    //         // if, less than 1 min, shows as <1min
    //         // else split merge time(hh.mm) to time[0] = hours and time[1] = minutes
    //         if(payload[0].value === 0){
    //             time = "less than 1 min"
    //         } else {
    //             time = time.split(".");
    //             time = time[0] === "0" ? time[1] + " mins" : time[0] + " hr, " + time[1] + " mins" 
    //         }
            
    //         return (
    //           <div className="custom-tooltip" style={{backgroundColor:"white"}}>
    //             <p className="label">{`${label}`}</p>
    //             <p className="desc">Merge in {time}</p>
    //           </div>
    //         );
    //     }
    // }

    const formatValue = (value) => {
        let time = "" + value;

        // if, less than 1 min, shows as <1min
        // else split merge time(hh.mm) to time[0] = hours and time[1] = minutes
        if(value === 0){
            time = "less than 1 min"
        } else {
            time = time.split(".");
            time = time[0] === "0" ? time[1] + " mins" : time[0] + " hr, " + time[1] + " mins" 
        }
        return time;
    }

    if(submit && !lastMerge)
        return (
            <div className='TimeToMergeBox componentBox'>
                <h1>No merge pull request exist in this repository</h1>
            </div>)

    if (submit) { // if submit is true, display the chart
        return (
          <div className="TimeToMergeBox componentBox">
            <h1>Time to Merge</h1>
            <h3>
              On average, pull requests are in review for
              <div style={{ fontStyle: "italic", color: "#2CB67D" }}>
                {hourMinuteSeconds(timeToMerge)}
              </div>
            </h3>

            <h3>
              Latest approve pull request was merge on
              <div style={{ fontStyle: "italic", color: "#2CB67D" }}>
                {moment(lastMerge.merged_at).format("MMMM DD, YYYY")}
              </div>
            </h3>

            <h4 className='note'>Note : Only calculates up to the newest 100 pull requests.</h4>

            <ResponsiveContainer width="90%" height={300}>
              <LineChart
                data={mergeArray}
                margin={{ left: 20, bottom: 20, top: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis stroke="#8884d8" dataKey="name" tick={false} />
                <YAxis allowDecimals={false}>
                  <Label
                    value="Time In Hours"
                    position="insideLeft"
                    angle={-90}
                    dy={40}
                  />
                </YAxis>
                <Tooltip
                  labelStyle={{ color: "#000" }}
                  formatter={(value, name, props) => [
                    formatValue(value),
                    "Time to merge ",
                  ]}
                />
                {/* <Tooltip  content={<CustomTooltip />}/> */}

                <Legend iconType="line" iconSize={18} />

                <Line
                  type="monotone"
                  name="Pull Requests"
                  dataKey="time"
                  stroke="#8884d8"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ); 
    }
}


export default TimeToMerge;



// Path: App.jsx
