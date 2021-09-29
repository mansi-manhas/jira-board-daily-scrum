import React from "react";
import { render } from "react-dom";
import { ResponsiveContainer } from "recharts";
import Title from "./Title";
import { dailyBugsCount, PROJECT_KEYS } from "../../services/constantData";
import "@patternfly/react-core/dist/styles/base.css";
import { ChartDonut } from "@patternfly/react-charts";

// Generate Sales Data
function createData(team, count) {
  return { team, count };
}

const RightAlignedLegend = (props) => (
  <div style={{ height: "200px", width: "200px" }}>
    <ChartDonut
      constrainToVisibleArea={true}
      data={props.data}
      labels={({ datum }) => `${datum.x}: ${datum.y}%`}
      legendData={props.legendData}
      legendOrientation="vertical"
      legendPosition="right"
      padding={{
        bottom: 20,
        left: 20,
        right: 140, // Adjusted to accommodate legend
        top: 20,
      }}
      subTitle={getDailyDate()}
      title="Bugs"
      width={350}
    />
  </div>
);

function getDailyDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;
  return today;
}

// const data = [
//   createData("00:00", 0),
//   createData("03:00", 300),
//   createData("06:00", 600),
//   createData("09:00", 800),
//   createData("12:00", 1500),
//   createData("15:00", 2000),
//   createData("18:00", 2400),
//   createData("21:00", 2400),
//   createData("24:00", undefined)
// ];

function getAllTeamNames2() {
  const teamNames = [];
  PROJECT_KEYS.forEach((e) => {
    teamNames.push(e.displayName);
  });
  return teamNames;
}

export default class MyPieChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  createDataForChart = () => {
    const data = [];
    const allTeamNames = [];
    const allCounts = [];
    const DonutData = [];
    const legendData = [];
    dailyBugsCount.forEach((teamWise) => {
      if (teamWise.key !== "ALL") {
        data.push(
          createData(
            teamWise.key,
            teamWise.highestBugs +
              teamWise.highBugs +
              teamWise.mediumBugs +
              teamWise.lowBugs
          )
        );
        allTeamNames.push(teamWise.key);
        allCounts.push(
          teamWise.highestBugs +
            teamWise.highBugs +
            teamWise.mediumBugs +
            teamWise.lowBugs
        );
        DonutData.push({
          x: teamWise.key,
          y:
            teamWise.highestBugs +
            teamWise.highBugs +
            teamWise.mediumBugs +
            teamWise.lowBugs,
        });
        legendData.push({
          name: `${teamWise.key}: ${
            teamWise.highestBugs +
            teamWise.highBugs +
            teamWise.mediumBugs +
            teamWise.lowBugs
          }`,
        });
      }
    });
    return { data, allTeamNames, allCounts, DonutData, legendData };
  };

  getComponentsByProjectKeys = (projectName) => {
    let componentNames = [];
    if (PROJECT_KEYS) {
      for (let index = 0; index < PROJECT_KEYS.length; index++) {
        if (
          PROJECT_KEYS[index].displayName === projectName &&
          PROJECT_KEYS[index].bugsComponent.length > 0
        ) {
          componentNames = [...PROJECT_KEYS[index].bugsComponent];
          break;
        }
      }
    }
    return componentNames;
  };

  isStringInKeywords(summary, keywords) {
    if (Array.isArray(keywords)) {
      for (let keyword of keywords) {
        if (summary && summary.toLowerCase().includes(keyword.toLowerCase())) {
          return true;
        }
      }
      return false;
    } else {
      if (summary && summary.toLowerCase().includes(keywords.toLowerCase())) {
        return true;
      }
      return false;
    }
  }

  getFilteredListForProjectKey = (
    list,
    projectName,
    isComponentFiltered,
    componentsRequested
  ) => {
    if (projectName === "ALL") {
      list = list;
    }

    const updatedList = [];
    if (isComponentFiltered) {
      if (componentsRequested.length > 0) {
        const allComponentsRequested = [];
        componentsRequested.forEach(
          (e) => allComponentsRequested.push(e) //allComponentsRequested.push(e.value)
        );
        list.forEach((bug) => {
          if (
            bug.fields.components !== null &&
            bug.fields.components.length > 0
          ) {
            for (let k = 0; k < bug.fields.components.length; k++) {
              if (
                allComponentsRequested.includes(bug.fields.components[k].name)
              ) {
                updatedList.push(bug);
              }
            }
          }
        });
      }
    }

    if (projectName !== "ALL") {
      list = list.filter((issue) => {
        if (
          issue.fields.hasOwnProperty("customfield_10203") &&
          issue.fields.customfield_10203 !== null
        ) {
          return this.isStringInKeywords(
            issue.fields.customfield_10203.value,
            projectName
          );
        }
      });
    }

    if (isComponentFiltered && updatedList.length > 0) {
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < updatedList.length; j++) {
          if (updatedList[j].key === list[i].key) {
            updatedList.splice(j, 1);
          }
        }
      }
      list = [...list, ...updatedList];
    }

    return list;
  };

  getFormattedBugsCount = (bugs, projectName) => {
    let HighestBugs = [];
    let HighBugs = [];
    let MediumBugs = [];
    let LowBugs = [];
    if (bugs) {
      for (let i = 0; i < bugs.length; i++) {
        if (bugs[i].fields.priority.name === "Highest") {
          HighestBugs.push(bugs[i]);
        }
        if (bugs[i].fields.priority.name === "High") {
          HighBugs.push(bugs[i]);
        }
        if (bugs[i].fields.priority.name === "Medium") {
          MediumBugs.push(bugs[i]);
        }
        if (bugs[i].fields.priority.name === "Low") {
          LowBugs.push(bugs[i]);
        }
      }
    }

    dailyBugsCount.forEach((e) => {
      if (e.key === projectName) {
        e.highestBugs = HighestBugs.length;
        e.highBugs = HighBugs.length;
        e.mediumBugs = MediumBugs.length;
        e.lowBugs = LowBugs.length;
      }
    });
  };

  populateForEachTeam = (bugs, allProjects) => {
    allProjects.forEach((projectName) => {
      const components = this.getComponentsByProjectKeys(projectName);
      this.getFormattedBugsCount(
        this.getFilteredListForProjectKey(bugs, projectName, true, components),
        projectName
      );
    });
  };

  render() {
    const { allBugs } = this.props;
    if ((allBugs && !allBugs.length) || !allBugs) {
      return (
        <>
          <div className="adTableNoDataDiv">No data</div>
        </>
      );
    }
    const allTeams = getAllTeamNames2();
    this.populateForEachTeam(allBugs, allTeams);
    const { data, allTeamNames, allCounts, DonutData, legendData } =
      this.createDataForChart();
    return (
      <React.Fragment>
        <Title>Daily Bugs Statistics</Title>
        <ResponsiveContainer>
          <RightAlignedLegend data={DonutData} legendData={legendData} />
        </ResponsiveContainer>
      </React.Fragment>
    );
  }
}
