import React, { useEffect, useState } from 'react'
import axios from 'axios';

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
              while (prs.length >= 100 * page && prs.length < 300) {
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
            }
            setDataSize(pullInfo.length);

            console.log("Total Addition:", addLine);
            console.log("Total Delete:", deleteLine);
            console.log("Total Files Change:", files);
            console.log("Total Commits:", commits);

            setLineAdded(addLine);
            setLineDeleted(deleteLine);
            setFilesChange(files);
            setTotalCommit(commits);
        }

        if(submit){
            console.log("submit");
            computePrImpact();
        }
        
    }, [Url, submit]);

    
  return (
    <div style={{color:"white"}}>
        <h1>PRImpact</h1>
        <p>Average new lines added per PR : {Math.floor(lineAdded/dataSize)}</p>
        <p>Average lines deleted per PR : {Math.floor(lineDeleted/dataSize)}</p>
        <p>Average files change per PR : {Math.floor(filesChange/dataSize)}</p>
        <p>Average commit per PR : {Math.floor(totalCommit/dataSize)}</p>
    </div>
  )
}

export default PRImpact