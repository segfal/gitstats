import axios from "axios";
import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";

import "../stylesheets/UnreviewedPR.css"
import "../stylesheets/All_Components.css";

const UnreviewedPR = ({ userName, repoName, access_token }) => {
  const [allMergedPR, setAllMergedPR] = useState(0);
  const [uncommentedPR, setUncommentedPR] = useState(0);
  // colors dont work hahahhahahah
  const [pieData, setPieData] = useState([
    {
      id: "reviewed",
      label: "Reviewed",
      value: 0,
      color: "hsl(337, 70%, 50%)",
    },
    {
      id: "unreviewed",
      label: "Unreviewed",
      value: 0,
      color: "hsl(120, 70%, 50%)",
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
      <div style={{ height: 500 }}>
        <ResponsivePie
          data={pieData}
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
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: "color",
            modifiers: [["darker", 2]],
          }}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "rgba(255, 255, 255, 0.3)",
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "rgba(255, 255, 255, 0.3)",
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
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
              itemTextColor: "#999",
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#000",
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
};

export default UnreviewedPR;
