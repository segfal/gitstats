import React,{useState,useEffect} from 'react'
import moment from 'moment'
import axios from 'axios'

const TimeToMerge = ({submit,userName, repoName}) => {
    ///pull request took x hours to merge
    const [timeToMerge, setTimeToMerge] = useState(0)
    const [username, setUsername] = useState('');

    const PullSearch = async (repoName, userName) => {
        const response = await axios.get(`https://api.github.com/search/issues?q=repo:${userName}/${repoName}/+is:pr+is:merged`);
        console.log("response: ", response);
        // const response = await axios.get(url)
        const prs = response.data.items
        return prs;
    }

    ///https://api.github.com/repos/segfal/KaraokeApp
    const ComputeTime = async () => {
        let sum = 0;
        //https://api.github.com/search/issues?q=repo:segfal/karaokeapp/+is:pr+is:merged
        let pullInfo = await PullSearch(repoName, userName);
        console.log("pullInfo: ", pullInfo);
        for (let i = 0; i < pullInfo.length; i++) {
            // get the "created_at" and "closed_at" fields
            let createdAt = await moment(pullInfo[i].created_at);
            let mergedAt = await moment(pullInfo[i].pull_request.merged_at);
            // calculate the difference between the two
            let difference = await mergedAt.diff(createdAt, 'hours'); 
            // add the difference to sum
            sum += difference;
        }
        setTimeToMerge(sum / pullInfo.length);
        return await timeToMerge;
    }
    
    if (submit) {
        return (
            <div>
                
                <h2>On average, pull requests are in review for {console.log("COMPUTE TIME DATA",ComputeTime())} hours</h2>
            </div>
        ) 
    }
}


export default TimeToMerge;



// Path: App.jsx
