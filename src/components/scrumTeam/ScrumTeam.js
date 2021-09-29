import React, { Component } from "react";
import moize from "moize";
import { Table } from "react-bootstrap";
//import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-free/css/fontawesome.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "./ScrumTeam.css";
import {
  getTableCell,
  TaskListElement,
} from "../table-utils/TableHelperComponents";
import { PROJECT_KEYS } from "../../services/constantData";

const ScrumTeamTableElementCell = ({ data, cellDetails }) => {
  const linkStyle = {
    a: "hover",
    color: "inherit",
  };
  const divStyle = {
    display: "flex",
    "justify-content": "space-between",
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
        <span>
          <div style={{ float: "right" }}>
            SP: {cellDetails.STORY_POINTS} ( {cellDetails.PRIORITY} ){" "}
          </div>
        </span>
        {cellDetails.IS_BLOCKED ? (
          <OverlayTrigger placement="auto" overlay={<Tooltip>Blocked</Tooltip>}>
            <i style={styleIcon} class="fas fa-ban" aria-hidden="true" />
          </OverlayTrigger>
        ) : (
          ""
        )}
      </>
      <br />
      <div style={divStyle}>
        <span>
          {cellDetails.NAME} ( {cellDetails.ISSUE_TYPE} ){" "}
        </span>
        <span>{cellDetails.STATUS}</span>
      </div>
    </>
  );
};

//const userIssues = [];

class ScrumTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
  formatAllSubtasks = (allIssues, projectKey) => {
    let { listOfUsers } = this.props;
    const maxNoOfUsers = listOfUsers.users.length;
    let result = this.createTaskListStateArray(maxNoOfUsers);
    let projectDisplayName = this.getProjectDisplayName(projectKey);
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

  render() {
    let { issues, listOfUsers, teamIssues, projectKey } = this.props;
    let subTaskRowsData = this.getMemoizeFunction(this.formatAllSubtasks)(
      issues,
      projectKey
    );
    //this.addUserIssues(issues);
    const headerElement = {
      color: "black",
      "background-color": "lightgray",
    };
    return (
      <>
        <div className="scrollmenu">
          <Table responsive bordered id="board" variant="dark">
            <thead>
              <tr>
                <th style={{ "font-size": "14px", "font-weight": "bold" }}>
                  Users
                </th>
                {/*<th width={5}>Total Estimated</th>*/}
                <th style={{ "font-size": "14px", "font-weight": "bold" }}>
                  Tasks
                </th>
              </tr>
            </thead>
            <tbody>
              {subTaskRowsData.map((subtaskRow, index) => (
                <tr key={index}>
                  <td className="tdTaskListElement">
                    <TaskListElement data={listOfUsers.users[index]} />
                  </td>
                  {subtaskRow.map((subTask) =>
                    getTableCell(
                      ScrumTeamTableElementCell,
                      subTask,
                      this.props.sprint,
                      true
                    )
                  )}
                </tr>
              ))}

              {/* <tr>
                <td style={headerElement}>Team Story Points</td>
                {this.getTeamProgress(teamIssues)}
              </tr> */}
            </tbody>
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
