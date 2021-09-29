import React, { Component } from "react";
import moize from "moize";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-free/css/fontawesome.css";
import "@fortawesome/fontawesome-free/css/all.css";
import {
  getTableCell,
  TaskListElement,
} from "../table-utils/TableHelperComponents";
import { PROJECT_KEYS } from "../../services/constantData";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { Icon } from "@material-ui/core";
import criticalPrio from "../../images/jira-priority-icons/critical.svg";
import majorPrio from "../../images/jira-priority-icons/major.svg";
import highestPrio from "../../images/jira-priority-icons/highest.svg";
import highPrio from "../../images/jira-priority-icons/high.svg";
import mediumPrio from "../../images/jira-priority-icons/medium.svg";
import lowPrio from "../../images/jira-priority-icons/low.svg";
import clipboard from "../../images/issueTypeIcons/clipboard.png";
import virus from "../../images/issueTypeIcons/virus.png";
import Story16Icon from "@atlaskit/icon-object/glyph/story/16";
import Subtask16Icon from "@atlaskit/icon-object/glyph/subtask/16";
import Bug16Icon from "@atlaskit/icon-object/glyph/bug/16";
import * as colors from "@atlaskit/theme/colors";
import "./ScrumTeamV2.css";
import BugReportIcon from "@material-ui/icons/BugReport";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
//import { hexToCSSFilter } from 'hex-to-css-filter';

const getPrioIcon = (prioName) => {
  if (prioName === "Critical") {
    return (
      <OverlayTrigger placement="auto" overlay={<Tooltip>Critical</Tooltip>}>
        <Icon>
          <img
            className="svg-color"
            src={criticalPrio}
            height="20px"
            width="20px"
            alt=""
            style={{ opacity: "0.6" }}
          />
        </Icon>
      </OverlayTrigger>
    );
  }
  if (prioName === "Highest") {
    return (
      <OverlayTrigger placement="auto" overlay={<Tooltip>Highest</Tooltip>}>
        <Icon>
          <img
            className="svg-color"
            src={majorPrio}
            height="20px"
            width="20px"
            alt=""
            style={{ opacity: "0.6" }}
          />
        </Icon>
      </OverlayTrigger>
    );
  }
  if (prioName === "Highest") {
    return (
      <OverlayTrigger placement="auto" overlay={<Tooltip>Highest</Tooltip>}>
        <Icon>
          <img
            className="svg-color"
            src={highestPrio}
            height="20px"
            width="20px"
            alt=""
            style={{ opacity: "0.6" }}
          />
        </Icon>
      </OverlayTrigger>
    );
  }
  if (prioName === "High") {
    return (
      <OverlayTrigger placement="auto" overlay={<Tooltip>High</Tooltip>}>
        <Icon>
          <img
            className="svg-color"
            src={highPrio}
            height="20px"
            width="20px"
            alt=""
            style={{ opacity: "0.6" }}
          />
        </Icon>
      </OverlayTrigger>
    );
  }
  if (prioName === "Medium") {
    return (
      <OverlayTrigger placement="auto" overlay={<Tooltip>Medium</Tooltip>}>
        <Icon>
          <img
            className="svg-color"
            src={mediumPrio}
            height="20px"
            width="20px"
            alt=""
            style={{ opacity: "0.6" }}
          />
        </Icon>
      </OverlayTrigger>
    );
  }
  if (prioName === "Low") {
    return (
      <OverlayTrigger placement="auto" overlay={<Tooltip>Low</Tooltip>}>
        <Icon>
          <img
            className="svg-color rotate180"
            src={highPrio}
            height="20px"
            width="20px"
            alt=""
            style={{ opacity: "0.6" }}
          />
        </Icon>
      </OverlayTrigger>
    );
  }
};

const getIssueTypeIcon = (issueType, status) => {
  if (status === "In Progress") {
    if (issueType === "Sub-task") {
      return (
        // <Icon>
        <PlaylistAddIcon
          style={{
            color: "black",
            marginBottom: "-8px",
            height: "20px",
            width: "20px",
          }}
        />
        // </Icon>
      );
      // return <Subtask16Icon primaryColor={colors.N90} />;
    }
    if (issueType === "Bug") {
      return (
        // <Icon>
        <BugReportIcon
          style={{
            color: "white",
            marginBottom: "-8px",
            height: "20px",
            width: "20px",
          }}
        />
        // </Icon>
      );
      // return <Bug16Icon primaryColor={colors.N90} />;
    }
  } else {
    if (issueType === "Sub-task") {
      return (
        // <Icon>
        <PlaylistAddIcon
          style={{
            color: "white",
            marginBottom: "-8px",
            height: "20px",
            width: "20px",
          }}
        />
        // </Icon>
      );
      // return <Subtask16Icon primaryColor={colors.N90} />;
    }
    if (issueType === "Bug") {
      return (
        // <Icon>
        <BugReportIcon
          style={{
            color: "white",
            marginBottom: "-8px",
            height: "20px",
            width: "20px",
          }}
        />
        // </Icon>
      );
      // return <Bug16Icon primaryColor={colors.N90} />;
    }
  }
};

const ScrumTeamTableElementCell = ({ data, cellDetails }) => {
  const linkStyle = {
    a: "hover",
    color: "inherit",
  };
  const divStyle = {
    display: "flex",
    "justify-content": "space-between",
    color: "white",
    borderColor: "gray",
  };
  const styleIcon = {
    "margin-left": "0.5rem",
    color: "#8B0000",
  };
  library.add(fas);
  return (
    <>
      <head>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </head>
      <>
        <div
          style={{
            display: "flex",
            "justify-content": "space-between",
            color: cellDetails.COLOR,
            borderColor: "gray",
          }}
        >
          <OverlayTrigger
            placement="auto"
            overlay={<Tooltip id={data.id}>{data.fields.summary}</Tooltip>}
          >
            <a
              style={linkStyle}
              href={cellDetails.ISSUE_URL_JIRA}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              {data.key}
            </a>
          </OverlayTrigger>
          <span style={{ lineHeight: "0.5", color: cellDetails.COLOR }}>
            {cellDetails.STORY_POINTS ? (
              <>
                {cellDetails.STORY_POINTS}
                {getPrioIcon(cellDetails.PRIORITY)}
              </>
            ) : (
              <>{getPrioIcon(cellDetails.PRIORITY)}</>
            )}
          </span>
          {cellDetails.IS_BLOCKED ? (
            <OverlayTrigger
              placement="auto"
              overlay={<Tooltip>Blocked</Tooltip>}
            >
              <i style={styleIcon} class="fas fa-ban" aria-hidden="true" />
            </OverlayTrigger>
          ) : (
            ""
          )}
        </div>
      </>
      <br />
      {/* <div style={divStyle}> */}
      <span>
        {cellDetails.NAME} {/* <span style={{ opacity: "0.6" }}> */}
        {getIssueTypeIcon(cellDetails.ISSUE_TYPE, cellDetails.STATUS)}
        {/* </span> */}
      </span>
      <span style={{ float: "right" }}>{cellDetails.STATUS}</span>
      {/* </div> */}
    </>
  );
};

const getTotalCell = (subtaskRow) => {
  const sum = getSumOfStoryPoints(subtaskRow);
  if (sum > 8) {
    return <TableCell style={{ color: "red", fontSize: "16px" }}>{sum}</TableCell>;
  } else {
    return <TableCell style={{ color: "green", fontSize: "16px" }}>{sum}</TableCell>;
  }
};

function getSumOfStoryPoints(subtaskRow) {
  let total = 0;
  if (subtaskRow && subtaskRow.length > 0) {
    for (let i = 0; i < subtaskRow.length; i++) {
      const storyPoint = subtaskRow[i].fields.customfield_10106;
      if (!isNaN(storyPoint)) {
        total = total + storyPoint;
      }
    }
  }
  return total;
}

//const userIssues = [];

class ScrumTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "desc",
      orderBy: "users",
      totalAlloted: 0,
    };
  }

  getProjectDisplayName(projectKey) {
    let projectDisplayName = "";
    for (let index = 0; index < PROJECT_KEYS.length; index++) {
      if (PROJECT_KEYS[index].key === projectKey) {
        projectDisplayName = PROJECT_KEYS[index].displayName;
        break;
      }
    }
    return projectDisplayName;
  }

  createTaskListStateArray(maxNoOfUsers) {
    let result = [];
    for (let index = 0; index < maxNoOfUsers; index++) {
      result.push([]);
    }
    return result;
  }

  createTaskListStateArrayWithEmptyCells(rows, columns) {
    let result = [];
    for (let index = 0; index < rows; index++) {
      let aRow = [];
      for (let indexCols = 0; indexCols < columns; indexCols++) {
        aRow.push(this.getEmptySubtask());
      }
      result.push(aRow);
    }
    return result;
  }

  getEmptySubtask() {
    return {
      key: "",
      isEmpty: true,
    };
  }

  /**
   *
   *
   * @param {string} summary
   * @param {string || string[] } keywords
   * @returns {boolean}
   * @memberof ScrumTeam
   */
  isStringInKeywords(summary, keywords) {
    if (Array.isArray(keywords)) {
      for (let keyword of keywords) {
        if (summary.toLowerCase().includes(keyword.toLowerCase())) {
          return true;
        }
      }
      return false;
    } else {
      if (summary.toLowerCase().includes(keywords.toLowerCase())) {
        return true;
      }
      return false;
    }
  }

  /**
   *match the fetched subtasks with the constant taskList and create append the non-matched
   *Returns the data to create a table.
   *
   * @param {object[]} allIssues
   * @returns {object []}
   * @memberof ScrumTeam
   */
  formatAllSubtasks = (allIssues, projectKey, checkedBugs, allBugs) => {
    let { listOfUsers } = this.props;
    const maxNoOfUsers = listOfUsers.users.length;
    let result = this.createTaskListStateArray(maxNoOfUsers);
    let projectDisplayName = this.getProjectDisplayName(projectKey);
    if (checkedBugs === true) {
      allIssues = [...allIssues, ...allBugs];
    }
    for (let j in listOfUsers.users) {
      for (let index in allIssues) {
        let subtask = { ...allIssues[index] };
        if (
          (projectKey !== "ALL" &&
            subtask.fields.customfield_10203 !== null &&
            this.isStringInKeywords(
              subtask.fields.customfield_10203.value,
              projectDisplayName
            ) &&
            this.isStringInKeywords(
              subtask.fields.assignee
                ? subtask.fields.assignee.displayName
                : "Unassigned",
              listOfUsers.users[j]
            )) ||
          (projectKey === "ALL" &&
            this.isStringInKeywords(
              subtask.fields.assignee
                ? subtask.fields.assignee.displayName
                : "Unassigned",
              listOfUsers.users[j]
            ))
        ) {
          result[j].push(subtask);
        }
      }
    }

    //sort date
    // for (let i in result) {
    //   result[i].sort(function compare(a, b) {
    //     var dateA = new Date(
    //       a.fields.duedate ? a.fields.duedate : a.fields.resolutiondate
    //     );
    //     var dateB = new Date(
    //       b.fields.duedate ? b.fields.duedate : b.fields.resolutiondate
    //     );
    //     return dateA - dateB;
    //   });
    // }
    return [...result];
  };

  // using moize to cache the result when the input is same.
  getMemoizeFunction = (method) =>
    moize(method, {
      isDeepEqual: true,
    });

  // addUserIssues = allIssues => {
  //   let { listOfUsers } = this.props;
  //   if (allIssues && allIssues.length > 0) {
  //     for (const user of listOfUsers.users) {
  //       const currentUserIssues = [];
  //       for(const userIssue of allIssues) {
  //         let subtask = { ...userIssue };
  //         if (
  //           this.isStringInKeywords(
  //             subtask.fields.assignee ? subtask.fields.assignee.displayName : "",
  //             user
  //           )
  //         ) {
  //           currentUserIssues.push(subtask);
  //         }
  //       }
  //       if(currentUserIssues.length > 0) {
  //         userIssues.push({
  //           name: user,
  //           tasks: currentUserIssues
  //         });
  //       }
  //     }
  //   }
  // };

  sortUserList = (listOfUsers, order, orderBy) => {
    if (orderBy === "users") {
      if (order === "asc") {
        listOfUsers.users.sort();
      }
      if (order === "desc") {
        listOfUsers.users.sort().reverse();
      }
    }
    return listOfUsers;
  };

  compareStatusSorting = (a, b) => {
    if (a.fields.status.name < b.fields.status.name) {
      return -1;
    }
    if (a.fields.status.name > b.fields.status.name) {
      return 1;
    }
    return 0;
  };

  compareStateLength = (a, b) => {
    if (a.fields.customfield_10100.length < b.fields.customfield_10100.length) {
      return -1;
    }
    if (a.fields.customfield_10100.length > b.fields.customfield_10100.length) {
      return 1;
    }
    return 0;
  };

  prioritySorting = (allRows) => {
    const highest = [];
    const high = [];
    const medium = [];
    const low = [];
    const others = [];
    if (allRows) {
      for (let index = 0; index < allRows.length; index++) {
        if (allRows[index].fields.priority.name === "Highest") {
          highest.push(allRows[index]);
          continue;
        }
        if (allRows[index].fields.priority.name === "High") {
          high.push(allRows[index]);
          continue;
        }
        if (allRows[index].fields.priority.name === "Medium") {
          medium.push(allRows[index]);
          continue;
        }
        if (allRows[index].fields.priority.name === "Low") {
          low.push(allRows[index]);
          continue;
        }
        others.push(allRows[index]);
      }
    }
    return [...highest, ...high, ...medium, ...low, ...others];
  };

  daysOpenSorting = (allRows) => {
    const activeTasks = [];
    const otherTasks = [];
    for (let index = 0; index < allRows.length; index++) {
      if (allRows[index].fields.issuetype.name === "Bug") {
        otherTasks.push(allRows[index]);
        continue;
      }
      if (
        allRows[index].fields.hasOwnProperty("customfield_10100") &&
        allRows[index].fields.customfield_10100.length > 0
      ) {
        const lastIndex = allRows[index].fields.customfield_10100.length;
        const lastSprintDetails =
          allRows[index].fields.customfield_10100[lastIndex - 1];
        const state = lastSprintDetails.indexOf("state=ACTIVE");
        if (state && allRows[index].fields.status.name === "In Progress") {
          activeTasks.push(allRows[index]);
        } else {
          otherTasks.push(allRows[index]);
        }
      } else {
        otherTasks.push(allRows[index]);
      }
    }
    activeTasks.sort(this.compareStateLength);
    return [...activeTasks, ...otherTasks];
  };

  sortTasksRow = (taskRows, sort, sortBy) => {
    if (sort && taskRows && taskRows.length) {
      if (sortBy === "status") {
        taskRows.sort(this.compareStatusSorting);
      }
      if (sortBy === "priority") {
        taskRows = this.prioritySorting(taskRows);
      }
      if (sortBy === "daysOpen") {
        taskRows = this.daysOpenSorting(taskRows);
      }
    }
    return taskRows;
  };

  getTotalAvailable = (listOfUsers) => {
    if (listOfUsers && listOfUsers.users && listOfUsers.users.length > 0) {
      return 8 * listOfUsers.users.length;
    }
    return 0;
  };

  getTotalAlloted = (subTaskRowsData) => {
    let total = 0;
    if (subTaskRowsData && subTaskRowsData.length > 0) {
      for (let i = 0; i<subTaskRowsData.length; i++) {
        total = total + getSumOfStoryPoints(subTaskRowsData[i]);
      }
    }
    return total;
  }

  render() {
    let {
      issues,
      listOfUsers,
      teamIssues,
      projectKey,
      sort,
      sortBy,
      checkedBugs,
      allBugs,
    } = this.props;
    const { order, orderBy } = this.state;
    listOfUsers = this.sortUserList(listOfUsers, order, orderBy);
    let subTaskRowsData = this.getMemoizeFunction(this.formatAllSubtasks)(
      issues,
      projectKey,
      checkedBugs,
      allBugs
    );

    return (
      <>
        <div>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#323232" }}>
                <TableCell
                  variant="head"
                  style={{
                    backgroundColor: "#323232",
                    color: "#e5b9a9",
                    fontWeight: "bold",
                    borderColor: "gray",
                  }}
                  onClick={() => {
                    this.setState({
                      order: this.state.order === "desc" ? "asc" : "desc",
                      orderBy: "users",
                    });
                  }}
                >
                  Users{" "}
                  {this.state.order === "desc" ? (
                    <ArrowUpwardIcon
                      style={{
                        color: "lightslategray",
                        paddingTop: "inherit",
                        fontSize: "29px",
                      }}
                    />
                  ) : (
                    <ArrowDownwardIcon
                      style={{
                        color: "lightslategray",
                        paddingTop: "inherit",
                        fontSize: "29px",
                      }}
                    />
                  )}
                </TableCell>
                {/*<th width={5}>Total Estimated</th>*/}
                <TableCell
                  style={{
                    color: "#e5b9a9",
                    fontWeight: "bold",
                    borderColor: "gray",
                  }}
                  variant="head"
                >
                  Total Available
                </TableCell>
                <TableCell
                  style={{
                    color: "#e5b9a9",
                    fontWeight: "bold",
                    borderColor: "gray",
                  }}
                  variant="head"
                >
                  Total Alloted
                </TableCell>
                <TableCell
                  style={{
                    color: "#e5b9a9",
                    fontWeight: "bold",
                    borderColor: "gray",
                  }}
                  variant="head"
                >
                  Tasks
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subTaskRowsData.map((subtaskRow, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TaskListElement data={listOfUsers.users[index]} />
                  </TableCell>
                  <TableCell style={{ color: "white", fontSize: "16px" }}>8</TableCell>
                  {getTotalCell(subtaskRow)}
                  {this.sortTasksRow(subtaskRow, sort, sortBy).map((subTask) =>
                    getTableCell(
                      ScrumTeamTableElementCell,
                      subTask,
                      this.props.sprint,
                      false,
                      true
                    )
                  )}
                </TableRow>
              ))}
              <TableRow>
                <TableCell
                  style={{
                    color: "#e5b9a9",
                    fontWeight: "bold",
                    backgroundColor: "#323232",
                  }}
                >
                  Total
                </TableCell>
                <TableCell
                  style={{
                    color: "#e5b9a9",
                    fontWeight: "bold",
                    backgroundColor: "#323232",
                  }}
                >
                  {this.getTotalAvailable(listOfUsers)}
                </TableCell>
                <TableCell
                  style={{
                    color: "#e5b9a9",
                    fontWeight: "bold",
                    backgroundColor: "#323232",
                  }}
                >
                  {this.getTotalAlloted(subTaskRowsData)}
                </TableCell>
              </TableRow>

              {/* <tr>
                <td style={headerElement}>Team Story Points</td>
                {this.getTeamProgress(teamIssues)}
              </tr> */}
            </TableBody>
          </Table>
        </div>
        {/* <div>
          <BootstrapTable data = {userIssues}>
          <TableHeaderColumn dataField='name' isKey={ true }>Users</TableHeaderColumn>
          <TableHeaderColumn dataField='tasks'>Tasks</TableHeaderColumn>
          </BootstrapTable>
        </div> */}
      </>
    );
  }
  componentDidMount() {}
}

export { ScrumTeamTableElementCell };

export default ScrumTeam;
