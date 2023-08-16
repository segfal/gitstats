import axios from "axios";
import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";

import "../stylesheets/UnreviewedPR.css"
import "../stylesheets/All_Components.css";

const UnreviewedPR = ({ userName, repoName, access_token }) => {
  const [allMergedPR, setAllMergedPR] = useState(0);
  const [uncommentedPR, setUncommentedPR] = useState(0);
  const [pieData, setPieData] = useState([
    {
      color: "hsla(155, 61%, 44%, 1)",
      id: "reviewed",
      label: "Reviewed",
      value: 0,
    },
    {
      color: "hsla(255, 83%, 65%, 1)",
      id: "unreviewed",
      label: "Unreviewed",
      value: 0,
    },
  ]);

  const fetchAllMergedPR = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/search/issues?q=repo:${userName}/${repoName}/+is:pr+is:merged`,
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      );
      setAllMergedPR(response.data.total_count);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUncommentedPR = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/search/issues?q=repo:${userName}/${repoName}/+is:pr+is:merged+comments:0`,
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      );
      setUncommentedPR(response.data.total_count);
    } catch (error) {
      console.log(error);
    }
  };

  // (Number of PRs with no comments / Total number of merged PRs) * 100
  const getUnreviewedPRPercentage = () => {
    return (uncommentedPR / allMergedPR) * 100;
  };

  useEffect(() => {
    fetchAllMergedPR();
    fetchUncommentedPR();
  }, [userName, repoName]);

  /**
   * Reviewed % = 100 - % of unreviewedPRs
   */
  useEffect(() => {
    setPieData((prevState) => [
      {
        ...prevState[0],
        value: (100 - getUnreviewedPRPercentage()).toFixed(1),
      },
      {
        ...prevState[1],
        value: getUnreviewedPRPercentage().toFixed(1),
      },
    ]);
  }, [allMergedPR, uncommentedPR]);

  return (
    <div className="UnreviewdPR_Box componentBox">
      <h1>UnreviewedPR</h1>
      <h3>
        <div>Percentage of unreviewed pull requests</div>
        <div style={{ fontStyle: "italic", color: "#2CB67D" }}>
          {getUnreviewedPRPercentage().toFixed(1)}%
        </div>
      </h3>
      <div style={{ height: 500 }}>
        <ResponsivePie
          data={pieData}
          colors={{
            datum: "data.color",
          }}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.2]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor={{ from: "color" }}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: "color",
            modifiers: [["darker", 2]],
          }}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: "#808080",
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#FFFFFF",
                  },
                },
              ],
            },
          ]}
          tooltip={({ datum: { id, value, color } }) => (
            <div
              style={{
                position: "relative",
                display: "inline-block",
              }}
            >
              <div
                style={{
                  padding: 12,
                  color,
                  background: "#FFFFFF",
                  borderRadius: 8,
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: color,
                    marginRight: 8,
                  }}
                />
                <strong>
                  {id}: {value}
                </strong>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default UnreviewedPR;
