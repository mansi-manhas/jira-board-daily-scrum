import React from "react";
import { render } from "react-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer
} from "recharts";
import Title from "./Title";
import { dailyBugsCount, PROJECT_KEYS } from "../../services/constantData";

// Generate Sales Data
function createData(team, count) {
  return { team, count };
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
  PROJECT_KEYS.forEach(e => {
      teamNames.push(e.displayName);
  });
  return teamNames;
}

export default class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  createDataForChart = () => {
    const data = [];
    dailyBugsCount.forEach(teamWise => {
       if (teamWise.key !== "ALL") {
        data.push(createData(teamWise.key, teamWise.highestBugs + teamWise.highBugs + teamWise.mediumBugs + teamWise.lowBugs));
       }
    });
    return data;
  }

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
    componentsRequested,
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
    
    dailyBugsCount.forEach(e => {
      if (e.key === projectName) {
        e.highestBugs = HighestBugs.length;
        e.highBugs = HighBugs.length;
        e.mediumBugs = MediumBugs.length;
        e.lowBugs = LowBugs.length;
      }
    });

  };

  populateForEachTeam = (bugs, allProjects) => {
    allProjects.forEach(projectName => {
      const components = this.getComponentsByProjectKeys(projectName);
      this.getFormattedBugsCount(this.getFilteredListForProjectKey(bugs, projectName, true, components), projectName);
    })
  }

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
    return (
      <React.Fragment>
        <Title>Daily Bugs Statistics</Title>
        <ResponsiveContainer>
          <LineChart
            data={this.createDataForChart()}
            margin={{
              top: 16,
              right: 16,
              bottom: 0,
              left: 24
            }}
          >
            <XAxis dataKey="team">
              {/* <Label angle={180} position="bottom" style={{ textAnchor:"middle" }}>
                Teams
              </Label> */}
            </XAxis>
            <YAxis>
              <Label angle={270} position="left" style={{ textAnchor:"middle" }}> 
                Count
              </Label>
            </YAxis>
            <Line type="monotone" dataKey="count" stroke="#556CD6" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  }
}
