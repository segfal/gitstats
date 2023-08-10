import React,{useState,useEffect} from 'react'
import moment from 'moment'
import axios from 'axios'

const TimeToMerge = ({userName, repoName}) => {
    ///pull request took x hours to merge
    const [timeToMerge, setTimeToMerge] = useState(0)
    const [username, setUsername] = useState('');

    const PullSearch = async (repoName, userName, pullNumber) => {
        const response = await axios.get(`https://api.github.com/repos/${userName}/${repoName}/pulls/${pullNumber.toString()}}`);
        const data = await response.json();
        console.log(data);
        return response;
    }

    ///https://api.github.com/repos/segfal/KaraokeApp
    const ComputeTime = () => {
        let sum = 0;
        // "https://api.github.com/repos/segfal/KaraokeApp/pulls/{/number}"
        let pullNumber = 1;
        let pullInfo = PullSearch(repoName, userName, pullNumber);
        while (!pullInfo.message) {
            // get the "created_at" and "merged_at" fields
            let createdAt = pullInfo.created_at;
            let mergedAt = pullInfo.merged_at;
            // calculate the difference between the two
            let difference = moment(mergedAt).diff(moment(createdAt), 'hours'); 
            // add the difference to sum
            sum += difference; 
            pullNumber++;
            // get next PR
            pullInfo = PullSearch(repoName, userName, pullNumber);
        }
        setTimeToMerge(sum / pullNumber);
        return timeToMerge;
    }
    
   return(
        <div>
            <h2>On average, pull requests are in review for {ComputeTime()} hours</h2>
        </div>
   )
}


export default TimeToMerge;



// Path: App.jsx
