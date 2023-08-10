import axios from "axios";
import React, { useEffect, useState } from "react";

const UnreviewedPR = ({userName, repoName, access_token}) => {
    const [allMergedPR, setAllMergedPR] = useState(0);
    const [uncommentedPR, setUncommentedPR] = useState(0);

    const fetchAllMergedPR = async () => {
        try {
            const response = await axios.get(
              `https://api.github.com/search/issues?q=repo:${userName}/${repoName}/+is:pr+is:merged`, 
              {
                headers: {
                    Authorization: "Bearer" + access_token,
                },
              }
            );
            setAllMergedPR(response.data.total_count);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchUncommentedPR = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/search/issues?q=repo:${userName}/${repoName}/+is:pr+is:merged+comments:0`,
          {
            headers: {
              Authorization: "Bearer" + access_token,
            },
          }
        );
        setUncommentedPR(response.data.total_count);
      } catch (error) {
        console.log(error);
      }
    };

    const getUnreviewedPRPercentage = () => {
        return uncommentedPR / allMergedPR;
    }

    useEffect(() => {
        fetchAllMergedPR();
        fetchUncommentedPR();
    }, [userName, repoName]);

    return (
      <>
        <h1>UnreviewedPR</h1>
        <p>Percentage of unreviewed pull requests: {getUnreviewedPRPercentage()}</p>
      </>
    );
}

export default UnreviewedPR;