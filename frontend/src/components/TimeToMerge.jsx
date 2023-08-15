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
    Legend,
    LineChart,
    Line,
    ResponsiveContainer
  } from 'recharts';

const TimeToMerge = ({submit,userName, repoName}) => {
    ///pull request took x hours to merge
    const [timeToMerge, setTimeToMerge] = useState(0)
    const [username, setUsername] = useState('');
    const [mergeArray, setMergeArray] = useState([]);

    const PullSearch = async (repoName, userName) => {
        const response = await axios.get(`https://api.github.com/search/issues?q=repo:${userName}/${repoName}/+is:pr+is:merged`);
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
         
            // add the difference to sum
            arr.push({name: i, time: time})


            sum += difference;
        }
        setTimeToMerge(sum / pullInfo.length);
        setMergeArray(arr);
        console.log("timeToMerge: ", mergeArray);
        return timeToMerge;
    }

    useEffect(() => {
        if(submit){
            computeTime();
        }

    },[submit,timeToMerge,mergeArray.length]);
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


    if (submit) { // if submit is true, display the chart
        return (
            <div>
               
                {<h2>On average, pull requests are in review for {hourMinuteSeconds(timeToMerge)}</h2>}
                <h2>Time to Merge</h2>
                    
                    <ResponsiveContainer width="50%" height={300}>
                        <LineChart data={mergeArray}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            {/* <Legend /> */}

                            <Line type="monotone" dataKey="time" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>


                
           
            </div>
        ) 
    }
}


export default TimeToMerge;



// Path: App.jsx
