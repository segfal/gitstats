import React, { useEffect, useState } from 'react'
import axios from 'axios';

import PRImpactCard from './PRImpactCard';

import "../stylesheets/PRImpact.css";
import "../stylesheets/All_Components.css";

import {
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

// average lines deleted per pr
// average lines added per pr
// average files change per pr
// average commits per pr
// average delete/add/files change per commit
function PRImpact({submit,userName, repoName, access_token}) {
    const Url = `https://api.github.com/search/issues?q=repo:${userName}/${repoName}`;
    const [data, setData] = useState();
    const [lineAdded, setLineAdded] = useState(0);
    const [lineDeleted, setLineDeleted] = useState(0);
    const [dataSize, setDataSize] = useState(0);
    const [totalCommit, setTotalCommit] = useState(0);
    const [filesChange, setFilesChange] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const PullSearch = async() => {
            const response = await axios.get(
                `${Url}/+is:pr+is:merged&per_page=100`,
                {
                  headers: {
                    Authorization: "Bearer " + access_token,
                  },
                }
              );

              let prs = response.data.items      
              let page = 1;
              while (prs.length >= 100 * page && prs.length < 200) {
                page++;
                const response2 = await axios.get(
                  `${Url}/+is:pr+is:merged&per_page=100&page=${page}`,
                  {
                    headers: {
                      Authorization: "Bearer " + access_token,
                    },
                  }
                );
      
                prs.push(...response2.data.items)
              }
                
              return prs;
        }

        const computePrImpact = async() => {
            let pullInfo = await PullSearch();
            let addLine = 0;
            let deleteLine = 0;
            let files = 0;
            let commits = 0;
            let arr = [];
            for (let i = 0; i < pullInfo.length; i++) {
                const response = await axios.get(
                    pullInfo[i].pull_request.url,
                    {
                      headers: {
                        Authorization: "Bearer " + access_token,
                      },
                    }
                  );

                console.log("pullInfo", i, response.data);
                addLine += response.data.additions;
                deleteLine += response.data.deletions;
                files += response.data.changed_files;
                commits += response.data.commits;

                arr.push({
                    name:"PR#"+pullInfo[i].number +" : "+ pullInfo[i].title, 
                    addition: response.data.additions,
                    deletion: response.data.deletions,
                    commits: response.data.commits,
                    files: response.data.changed_files
                })
            }
            setDataSize(pullInfo.length);
            setData(arr);

            console.log("Total Addition:", addLine);
            console.log("Total Delete:", deleteLine);
            console.log("Total Files Change:", files);
            console.log("Total Commits:", commits);

            setLineAdded(addLine);
            setLineDeleted(deleteLine);
            setFilesChange(files);
            setTotalCommit(commits);
            
            setLoading(false);
        }

        if(submit){
            console.log("submit");
            computePrImpact();
        }
        
    }, [Url, submit]);

    const CustomTooltip = ({name, addition, deletion, commits, files }) => (
        <div className="custom-tooltip">
            <p className="label">{name}</p>
            <ul className="list">
            <li className="list-item purple">
                # of Commits: {commits}
            </li>
            <li className="list-item green">
                # of Files Change: {files}
            </li>
            <li className="list-item">
                {addition} new lines added
            </li>
            <li className="list-item">
                {deletion} lines deleted
            </li>
            </ul>
        </div>
      );

    const renderChart = () => {
        return (
            <div>
                <ResponsiveContainer width="90%" height={300}>
                    <LineChart
                        data={data}
                        margin={{ left: 20, bottom: 20, top: 30 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis stroke="#8884d8" dataKey="name" tick={false} />
                        <YAxis stroke="#fffffe" allowDecimals={false} />
                        <Tooltip
                            labelStyle={{ color: "#000" }}
                            content={(props) => {
                                if (props.active && props.payload && props.payload.length) {
                                const data = props.payload[0].payload;
                                return (
                                    <CustomTooltip
                                    name={data.name}
                                    addition={data.addition}
                                    deletion={data.deletion}
                                    commits={data.commits}
                                    files={data.files}
                                    />
                                );
                                }
                                return null;
                            }}
                        />

                        <Legend verticalAlign='top' align='right' height={30}/>

                        <Line
                        type="monotone"
                        name="# of Commits"
                        dataKey="commits"
                        stroke="#8884d8"
                        />
                        <Line
                        type="monotone"
                        name="# of Files Change"
                        dataKey="files"
                        stroke="#2cb67d"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        )
    }

    if(loading) {
        return(
        <div className='PRImpactBox componentBox'>
            <h1>Pull Request Impact</h1>
            <h2>LOADING...</h2>
        </div>
        )
    }
  
  return (
    <div className='PRImpactBox componentBox'>
        <h1>Pull Request Impact</h1>
        <p className='note'>Note : Only calculates up to the newest 200 merged pull requests.</p>
        
        {renderChart()}

        <h2>On Average...</h2>
        <div className='PRImpactCardBox'>
            <div className='PRImpactCardGroup'>
                <PRImpactCard number={Math.floor(lineAdded/dataSize)} type={"Lines"} text={"were added per pull request"}/>
                <PRImpactCard number={Math.floor(lineDeleted/dataSize)} type={"Lines"} text={"were deleted per pull request"}/>
            </div>
            <div className='PRImpactCardGroup'>
                <PRImpactCard number={Math.floor(filesChange/dataSize)} type={"Files"} text={"were change per pull request"}/>
                <PRImpactCard number={Math.floor(totalCommit/dataSize)} type={"Commits"} text={"were made per pull request"}/> 
            </div>  
        </div>
    </div>
  )
}

export default PRImpact