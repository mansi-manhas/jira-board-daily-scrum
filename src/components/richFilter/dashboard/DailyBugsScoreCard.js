import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import { PROJECT_KEYS, dailyBugsCount } from "../../services/constantData";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
// Generate Order Data
function createData(
  teamName,
  totalBugs,
  HighestBugs,
  HighBugs,
  MediumBugs,
  LowBugs
) {
  return { teamName, totalBugs, HighestBugs, HighBugs, MediumBugs, LowBugs };
}

function getAllTeamNames() {
  const teamNames = [];
  PROJECT_KEYS.forEach((e) => {
    if (e.displayName !== "ALL") {
      teamNames.push(e.displayName);
    }
  });
  return teamNames;
}

function getAllTeamNames2() {
  const teamNames = [];
  PROJECT_KEYS.forEach((e) => {
    teamNames.push(e.displayName);
  });
  return teamNames;
}

function createRows(order, orderBy) {
  const allTeamNames = getAllTeamNames();
  const rows = [];
  for (let team = 0; team < allTeamNames.length; team++) {
    const findElement = dailyBugsCount.find(
      (e) => e.key === allTeamNames[team]
    );
    rows.push(
      createData(
        allTeamNames[team],
        findElement.highestBugs +
          findElement.highBugs +
          findElement.mediumBugs +
          findElement.lowBugs,
        findElement.highestBugs,
        findElement.highBugs,
        findElement.mediumBugs,
        findElement.lowBugs
      )
    );
  }
  //sort team name
  if (order === "asc" && orderBy === "team") {
    rows.sort(function (a, b) {
      return a.teamName - b.teamName;
    });
  }
  if (order === "desc" && orderBy === "team") {
    rows
      .sort(function (a, b) {
        return a.teamName - b.teamName;
      })
      .reverse();
  }
  //sort total count
  if (order === "asc" && orderBy === "total") {
    rows.sort(function (a, b) {
      return a.totalBugs - b.totalBugs;
    });
  }
  if (order === "desc" && orderBy === "total") {
    rows
      .sort(function (a, b) {
        return a.totalBugs - b.totalBugs;
      })
      .reverse();
  }
  //sort highestbugs
  if (order === "asc" && orderBy === "highest") {
    rows.sort(function (a, b) {
      return a.HighestBugs - b.HighestBugs;
    });
  }
  if (order === "desc" && orderBy === "highest") {
    rows
      .sort(function (a, b) {
        return a.HighestBugs - b.HighestBugs;
      })
      .reverse();
  }
  //sort highbugs
  if (order === "asc" && orderBy === "high") {
    rows.sort(function (a, b) {
      return a.HighBugs - b.HighBugs;
    });
  }
  if (order === "desc" && orderBy === "high") {
    rows
      .sort(function (a, b) {
        return a.HighBugs - b.HighBugs;
      })
      .reverse();
  }
  //sort mediumbugs
  if (order === "asc" && orderBy === "medium") {
    rows.sort(function (a, b) {
      return a.MediumBugs - b.MediumBugs;
    });
  }
  if (order === "desc" && orderBy === "medium") {
    rows
      .sort(function (a, b) {
        return a.MediumBugs - b.MediumBugs;
      })
      .reverse();
  }
  //sort lowbugs
  if (order === "asc" && orderBy === "low") {
    rows.sort(function (a, b) {
      return a.LowBugs - b.LowBugs;
    });
  }
  if (order === "desc" && orderBy === "low") {
    rows
      .sort(function (a, b) {
        return a.LowBugs - b.LowBugs;
      })
      .reverse();
  }
  return rows;
}

function createSumRow() {
  const rows = [];
  const findElement = dailyBugsCount.find((e) => e.key === "ALL");
  rows.push(
    createData(
      "Total",
      findElement.highestBugs +
        findElement.highBugs +
        findElement.mediumBugs +
        findElement.lowBugs,
      findElement.highestBugs,
      findElement.highBugs,
      findElement.mediumBugs,
      findElement.lowBugs
    )
  );
  return rows;
}

// const rows = [
//   createData(
//     0,
//     "16 Mar, 2019",
//     "Elvis Presley",
//     "Tupelo, MS",
//     "VISA ⠀•••• 3719",
//     312.44
//   ),
//   createData(
//     1,
//     "16 Mar, 2019",
//     "Paul McCartney",
//     "London, UK",
//     "VISA ⠀•••• 2574",
//     866.99
//   ),
//   createData(
//     2,
//     "16 Mar, 2019",
//     "Tom Scholz",
//     "Boston, MA",
//     "MC ⠀•••• 1253",
//     100.81
//   ),
//   createData(
//     3,
//     "16 Mar, 2019",
//     "Michael Jackson",
//     "Gary, IN",
//     "AMEX ⠀•••• 2000",
//     654.39
//   ),
//   createData(
//     4,
//     "15 Mar, 2019",
//     "Bruce Springsteen",
//     "Long Branch, NJ",
//     "VISA ⠀•••• 5919",
//     212.79
//   )
// ];

// const useStyles = makeStyles(theme => ({
//   seeMore: {
//     marginTop: theme.spacing(3)
//   }
// }));

export default class DailyBugsScoreCard extends React.Component {
  //const classes = useStyles();
  constructor(props) {
    super(props);
    this.state = {
      order: "desc",
      orderBy: "total",
    };
  }
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
        <Title>Daily Bugs Scorecard</Title>
        <Table size="small" style={{ color: "#d9dada" }}>
          <TableHead style={{ color: "#d9dada" }}>
            <TableRow style={{ color: "#d9dada" }}>
              <TableCell
                style={{ fontWeight: "bold", color: "#d9dada" }}
                onClick={() => {
                  this.setState({
                    order: this.state.order === "desc" ? "asc" : "desc",
                    orderBy: "team",
                  });
                }}
              >
                Team
                {this.state.order === "desc" &&
                this.state.orderBy === "team" ? (
                  <ArrowUpwardIcon
                    style={{
                      color: "lightslategray",
                      paddingTop: "inherit",
                      fontSize: "18px",
                    }}
                  />
                ) : (
                  <ArrowDownwardIcon
                    style={{
                      color: "lightslategray",
                      paddingTop: "inherit",
                      fontSize: "18px",
                    }}
                  />
                )}
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", color: "#d9dada" }}
                onClick={() => {
                  this.setState({
                    order: this.state.order === "desc" ? "asc" : "desc",
                    orderBy: "total",
                  });
                }}
              >
                Total
                {this.state.order === "desc" &&
                this.state.orderBy === "total" ? (
                  <ArrowUpwardIcon
                    style={{
                      color: "lightslategray",
                      paddingTop: "inherit",
                      fontSize: "18px",
                    }}
                  />
                ) : (
                  <ArrowDownwardIcon
                    style={{
                      color: "lightslategray",
                      paddingTop: "inherit",
                      fontSize: "18px",
                    }}
                  />
                )}
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", color: "#d9dada" }}
                onClick={() => {
                  this.setState({
                    order: this.state.order === "desc" ? "asc" : "desc",
                    orderBy: "highest",
                  });
                }}
              >
                Highest
                {this.state.order === "desc" &&
                this.state.orderBy === "highest" ? (
                  <ArrowUpwardIcon
                    style={{
                      color: "lightslategray",
                      paddingTop: "inherit",
                      fontSize: "18px",
                    }}
                  />
                ) : (
                  <ArrowDownwardIcon
                    style={{
                      color: "lightslategray",
                      paddingTop: "inherit",
                      fontSize: "18px",
                    }}
                  />
                )}
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", color: "#d9dada" }}
                onClick={() => {
                  this.setState({
                    order: this.state.order === "desc" ? "asc" : "desc",
                    orderBy: "high",
                  });
                }}
              >
                High
                {this.state.order === "desc" &&
                this.state.orderBy === "high" ? (
                  <ArrowUpwardIcon
                    style={{
                      color: "lightslategray",
                      paddingTop: "inherit",
                      fontSize: "18px",
                    }}
                  />
                ) : (
                  <ArrowDownwardIcon
                    style={{
                      color: "lightslategray",
                      paddingTop: "inherit",
                      fontSize: "18px",
                    }}
                  />
                )}
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", color: "#d9dada" }}
                onClick={() => {
                  this.setState({
                    order: this.state.order === "desc" ? "asc" : "desc",
                    orderBy: "medium",
                  });
                }}
              >
                Medium
                {this.state.order === "desc" &&
                this.state.orderBy === "medium" ? (
                  <ArrowUpwardIcon
                    style={{
                      color: "lightslategray",
                      paddingTop: "inherit",
                      fontSize: "18px",
                    }}
                  />
                ) : (
                  <ArrowDownwardIcon
                    style={{
                      color: "lightslategray",
                      paddingTop: "inherit",
                      fontSize: "18px",
                    }}
                  />
                )}
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", color: "#d9dada" }}
                onClick={() => {
                  this.setState({
                    order: this.state.order === "desc" ? "asc" : "desc",
                    orderBy: "low",
                  });
                }}
              >
                Low
                {this.state.order === "desc" && this.state.orderBy === "low" ? (
                  <ArrowUpwardIcon
                    style={{
                      color: "lightslategray",
                      paddingTop: "inherit",
                      fontSize: "18px",
                    }}
                  />
                ) : (
                  <ArrowDownwardIcon
                    style={{
                      color: "lightslategray",
                      paddingTop: "inherit",
                      fontSize: "18px",
                    }}
                  />
                )}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {createRows(this.state.order, this.state.orderBy).map(
              (row, index) => (
                <TableRow key={index} style={{ color: "#d9dada" }}>
                  <TableCell style={{ color: "#d9dada" }}>{row.teamName}</TableCell>
                  <TableCell style={{ color: "#d9dada" }}>
                    {row.totalBugs === 0 ? "" : row.totalBugs}
                  </TableCell>
                  <TableCell style={{ color: "#d9dada" }}>
                    {row.HighestBugs === 0 ? "" : row.HighestBugs}
                  </TableCell>
                  <TableCell style={{ color: "#d9dada" }}>
                    {row.HighBugs === 0 ? "" : row.HighBugs}
                  </TableCell>
                  <TableCell style={{ color: "#d9dada" }}>
                    {row.MediumBugs === 0 ? "" : row.MediumBugs}
                  </TableCell>
                  <TableCell style={{ color: "#d9dada" }}>{row.LowBugs === 0 ? "" : row.LowBugs}</TableCell>
                </TableRow>
              )
            )}
            {createSumRow().map((row, index) => (
              <TableRow key={index}>
                <TableCell style={{ fontWeight: "bold", color: "#d9dada" }}>Total</TableCell>
                <TableCell style={{ fontWeight: "bold", color: "#d9dada" }}>
                  {row.totalBugs === 0 ? "" : row.totalBugs}
                </TableCell>
                <TableCell style={{ fontWeight: "bold", color: "#d9dada" }}>
                  {row.HighestBugs === 0 ? "" : row.HighestBugs}
                </TableCell>
                <TableCell style={{ fontWeight: "bold", color: "#d9dada" }}>
                  {row.HighBugs === 0 ? "" : row.HighBugs}
                </TableCell>
                <TableCell style={{ fontWeight: "bold", color: "#d9dada" }}>
                  {row.MediumBugs === 0 ? "" : row.MediumBugs}
                </TableCell>
                <TableCell style={{ fontWeight: "bold", color: "#d9dada" }}>
                  {row.LowBugs === 0 ? "" : row.LowBugs}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* <div className={classes.seeMore}>
          <Link color="primary" href="javascript:;">
            See more orders
          </Link>
        </div> */}
      </React.Fragment>
    );
  }
}
