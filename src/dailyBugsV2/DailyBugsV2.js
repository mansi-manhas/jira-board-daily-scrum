import React, { useState } from "react";
import moize from "moize";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  TableHeaderElement,
  getTableCell,
} from "../table-utils/TableHelperComponents";
import { ScrumTeamTableElementCell } from "../scrumTeam/ScrumTeam";
import { dailyBugsCount } from "../../services/constantData";
//import "./DailyBugs.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import SortIcon from "@material-ui/icons/Sort";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import criticalPrio from "../../images/jira-priority-icons/critical.svg";
import majorPrio from "../../images/jira-priority-icons/major.svg";
import highestPrio from "../../images/jira-priority-icons/highest.svg";
import highPrio from "../../images/jira-priority-icons/high.svg";
import mediumPrio from "../../images/jira-priority-icons/medium.svg";
import lowPrio from "../../images/jira-priority-icons/low.svg";
import { Icon } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CommentIcon from "@material-ui/icons/Comment";
import "./DailyBugsV2.css";
import Popover from "@material-ui/core/Popover";
import CommentItemList from "../comments/CommentItemList";

const getPrioIcon = (prioName) => {
  if (prioName === "Critical") {
    return (
      <OverlayTrigger placement="auto" overlay={<Tooltip>Critical</Tooltip>}>
        <Icon>
          <img
            className="svg-color"
            src={criticalPrio}
            height="14px"
            width="14px"
            style={{ marginRight: "8px" }}
            alt=""
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
            height="14px"
            width="14px"
            style={{ marginRight: "8px" }}
            alt=""
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
            height="14px"
            width="14px"
            style={{ marginRight: "8px" }}
            alt=""
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
            height="14px"
            width="14px"
            style={{ marginRight: "8px" }}
            alt=""
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
            height="14px"
            width="14px"
            style={{ marginRight: "8px" }}
            alt=""
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
            className="rotate180 svg-color"
            src={highPrio}
            height="14px"
            width="14px"
            style={{ marginRight: "8px" }}
            alt=""
          />
        </Icon>
      </OverlayTrigger>
    );
  }
};

const BugTableElementCell = ({ data, cellDetails }) => {
  //const cellDetails = getTableCellDetails(data);
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState();
  const [commentText, setCommentText] = useState();

  const linkStyle = {
    a: "hover",
    color: "inherit",
  };
  const divStyle = {
    display: "flex",
    "justify-content": "space-between",
  };
  const styleHours = {
    float: "right",
  };

  const getComments = (data) => {
    if (
      data &&
      data.fields &&
      data.fields.comment &&
      data.fields.comment.comments &&
      data.fields.comment.comments.length > 0
    ) {
      const commentName =
        data.fields.comment.comments[
          data.fields.comment.comments.length - 1
        ].author.displayName.split(" ")[0];
      setName(commentName);
      let MycommentText = data.fields.comment.comments[
        data.fields.comment.comments.length - 1
      ].body.replace(/(\r\n|\n|\r)/gm, "");
      setCommentText(MycommentText);
    } else {
      setCommentText("No Comments");
    }
  };

  return (
    <>
      <>
        <div style={divStyle}>
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
          <span style={styleHours}>{cellDetails.FIX_VERSIONS}</span>
        </div>
      </>
      <br />
      <div style={divStyle}>
        <span>{cellDetails.NAME}</span>
        <span>
          {cellDetails.COMPONENT}
          <CommentIcon
            style={{
              height: "14px",
              width: "14px",
              opacity: "0.6",
              marginBottom: "-3px",
              marginLeft: "3px",
            }}
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
              getComments(data);
            }}
          />
          <Popover
            id="comments-id"
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => {
              setAnchorEl(null);
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <CommentItemList name={name} commentText={commentText} />
          </Popover>
        </span>
      </div>
    </>
  );
};

class DailyBugsV2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openSortMenu: false,
      sort: false,
      sortBy: "",
      anchorEl: null,
    };
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

  sortDate = (a, b) => {
    var date1 = a.fields.created;
    var date2 = b.fields.created;
    var index1 = date1.indexOf("T");
    var index2 = date2.indexOf("T");
    var onlyDate1 = date1.substring(0, index1);
    var onlyDate2 = date2.substring(0, index2);
    onlyDate1 = onlyDate1.split("-");
    onlyDate2 = onlyDate2.split("-");
    return (
      onlyDate1[0] - onlyDate2[0] ||
      onlyDate1[1] - onlyDate2[1] ||
      onlyDate1[2] - onlyDate2[2]
    );
  };

  sortByFieldStatus = (a, b) => {
    if (a.fields.status.name < b.fields.status.name) {
      return -1;
    }
    if (a.fields.status.name > b.fields.status.name) {
      return 1;
    }
    return 0;
  };

  getFormattedTable = (adhocIssues, bugs, sort, sortBy, projectName) => {
    let rows = 0;
    let cols = 0;
    // for (let i in adhocIssues) {
    //     let aSubtasks = adhocIssues[i].fields.subtasks;
    //     if (aSubtasks.length && aSubtasks.length > rows) {
    //         rows = aSubtasks.length
    //     }
    // }
    // if (bugs.length) { //> rows
    //     rows = bugs.length;
    // }
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
    rows = Math.max(
      HighestBugs.length,
      HighBugs.length,
      MediumBugs.length,
      LowBugs.length
    );

    dailyBugsCount.forEach((e) => {
      if (e.key === projectName) {
        e.highestBugs = HighestBugs.length;
        e.highBugs = HighBugs.length;
        e.mediumBugs = MediumBugs.length;
        e.lowBugs = LowBugs.length;
      }
    });

    //sort
    if (sort) {
      if (sortBy === "creation") {
        HighestBugs.sort(this.sortDate);
        HighBugs.sort(this.sortDate);
        MediumBugs.sort(this.sortDate);
        LowBugs.sort(this.sortDate);
      }
      if (sortBy === "status") {
        HighestBugs.sort(this.sortByFieldStatus);
        HighBugs.sort(this.sortByFieldStatus);
        MediumBugs.sort(this.sortByFieldStatus);
        LowBugs.sort(this.sortByFieldStatus);
      }
    }

    //cols = adhocIssues.length + 1; // all adhoc items and a bug column
    cols = 4; //Highest, High, Medium, Low
    //let tableCells = this.createTaskListStateArrayWithEmptyCells(rows, cols);

    // for (let backlogItems in adhocIssues) {
    //     let aSubtasks = adhocIssues[backlogItems].fields.subtasks;
    //     for (let subtask in aSubtasks) {
    //         tableCells[subtask][backlogItems] = { ...aSubtasks[subtask] }
    //     }
    // }
    // for (let bug in bugs) {
    //     tableCells[bug][cols - 1] = { ...bugs[bug] };
    // }

    //ROW 1 - Highest, High, Medium Low
    let tableCells = [];
    let col1 = 0;
    let col2 = 0;
    let col3 = 0;
    let col4 = 0;
    for (let row = 0; row < rows; row++) {
      let aRow = [];
      for (; col1 < rows; ) {
        if (HighestBugs.length - 1 < col1) {
          aRow.push(this.getEmptySubtask());
        } else {
          aRow.push(HighestBugs[col1]);
        }
        col1++;
        break;
      }
      for (; col2 < rows; ) {
        if (HighBugs.length - 1 < col2) {
          aRow.push(this.getEmptySubtask());
        } else {
          aRow.push(HighBugs[col2]);
        }
        col2++;
        break;
      }
      for (; col3 < rows; ) {
        if (MediumBugs.length - 1 < col3) {
          aRow.push(this.getEmptySubtask());
        } else {
          aRow.push(MediumBugs[col3]);
        }
        col3++;
        break;
      }
      for (; col4 < rows; ) {
        if (LowBugs.length - 1 < col4) {
          aRow.push(this.getEmptySubtask());
        } else {
          aRow.push(LowBugs[col4]);
        }
        col4++;
        break;
      }
      tableCells.push(aRow);
    }

    // let tableCells2 = [];
    // for (let col = 0; col < cols; col++) {
    //   if (col === 0) {
    //     //tableCells.push("Highest");
    //     tableCells.push(HighestBugs);
    //   }
    //   if (col === 1) {
    //     //tableCells.push("High");
    //     tableCells.push(HighBugs);
    //   }
    //   if (col === 2) {
    //     //tableCells.push("Medium");
    //     tableCells.push(MediumBugs);
    //   }
    //   if (col === 3) {
    //     //tableCells.push("Low");
    //     tableCells.push(LowBugs);
    //   }
    // }

    // const tempTableCells = [...tableCells];
    // if (tempTableCells.length > 0) {
    //   for (let tabIndex=0; tabIndex<tempTableCells.length; tabIndex++) {
    //     for (let colIndex=0; colIndex<tempTableCells[tabIndex].length; colIndex++) {
    //       if (tempTableCells[tabIndex][colIndex].hasOwnProperty("isEmpty") && tempTableCells[tabIndex][colIndex].key === "") {
    //         tableCells[tabIndex].splice(colIndex, 1);
    //       }
    //     }
    //   }
    // }
    return [...tableCells];
  };

  // using moize to cache the result when the input is same.
  getMemoizeFunction = () =>
    moize(this.getFormattedTable, {
      isDeepEqual: true,
    });

  render() {
    let { adhocIssues, bugs, projectName } = this.props;
    const headerNames = ["Highest", "High", "Medium", "Low"];
    if (bugs && !bugs.length) {
      //!adhocIssues.length &&
      return (
        <>
          <div className="adTableNoDataDiv">No data</div>
        </>
      );
    }
    let tableData = this.getMemoizeFunction()(
      adhocIssues,
      bugs,
      this.state.sort,
      this.state.sortBy,
      projectName
    );
    // const tableWidth = tableData ? tableData[0].length > 4 ? "100%" : (tableData[0].length * 16) + "%" : "auto";
    let tableWidthStyle = {
      width: "auto",
    };
    return (
      <>
        <div>
          <Table
            style={tableWidthStyle}
            responsive
            size="sm"
            bordered
            id="adhocTable"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    backgroundColor: "gray",
                    fontWeight: "bold",
                    color: "#e5b9a9",
                  }}
                >
                  {getPrioIcon("Highest")}Highest
                  <SortIcon
                    style={{
                      color: "#1d2123",
                      marginLeft: "4px",
                      paddingTop: "10px",
                      fontSize: "25px",
                    }}
                    aria-haspopup="true"
                    aria-controls="sort-menu"
                    onClick={(e) => {
                      this.setState({
                        anchorEl: e.currentTarget,
                        openSortMenu:
                          this.state.openSortMenu === true ? false : true,
                      });
                    }}
                  />
                  <Menu
                    id="sort-menu"
                    open={Boolean(this.state.openSortMenu)}
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    onClose={() => {
                      this.setState({
                        openSortMenu: false,
                      });
                    }}
                    disableAutoFocusItem
                  >
                    <MenuItem
                      onClick={() => {
                        this.setState({
                          openSortMenu: false,
                          sort: true,
                          sortBy: "creation",
                        });
                      }}
                    >
                      Sort By Creation
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        this.setState({
                          openSortMenu: false,
                          sort: true,
                          sortBy: "status",
                        });
                      }}
                    >
                      Sort By Status
                    </MenuItem>
                  </Menu>
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "gray",
                    fontWeight: "bold",
                    color: "#e5b9a9",
                  }}
                >
                  {getPrioIcon("High")}High
                  <SortIcon
                    style={{
                      color: "#1d2123",
                      marginLeft: "4px",
                      paddingTop: "10px",
                      fontSize: "25px",
                    }}
                    aria-haspopup="true"
                    aria-controls="sort-menu"
                    onClick={(e) => {
                      this.setState({
                        anchorEl: e.currentTarget,
                        openSortMenu:
                          this.state.openSortMenu === true ? false : true,
                      });
                    }}
                  />
                  <Menu
                    id="sort-menu"
                    open={Boolean(this.state.openSortMenu)}
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    onClose={() => {
                      this.setState({
                        openSortMenu: false,
                      });
                    }}
                    disableAutoFocusItem
                  >
                    <MenuItem
                      onClick={() => {
                        this.setState({
                          openSortMenu: false,
                          sort: true,
                          sortBy: "creation",
                        });
                      }}
                    >
                      Sort By Creation
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        this.setState({
                          openSortMenu: false,
                          sort: true,
                          sortBy: "status",
                        });
                      }}
                    >
                      Sort By Status
                    </MenuItem>
                  </Menu>
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "gray",
                    fontWeight: "bold",
                    color: "#e5b9a9",
                  }}
                >
                  {getPrioIcon("Medium")}Medium
                  <SortIcon
                    style={{
                      color: "#1d2123",
                      marginLeft: "4px",
                      paddingTop: "10px",
                      fontSize: "25px",
                    }}
                    aria-haspopup="true"
                    aria-controls="sort-menu"
                    onClick={(e) => {
                      this.setState({
                        anchorEl: e.currentTarget,
                        openSortMenu:
                          this.state.openSortMenu === true ? false : true,
                      });
                    }}
                  />
                  <Menu
                    id="sort-menu"
                    open={Boolean(this.state.openSortMenu)}
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    onClose={() => {
                      this.setState({
                        openSortMenu: false,
                      });
                    }}
                    disableAutoFocusItem
                  >
                    <MenuItem
                      onClick={() => {
                        this.setState({
                          openSortMenu: false,
                          sort: true,
                          sortBy: "creation",
                        });
                      }}
                    >
                      Sort By Creation
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        this.setState({
                          openSortMenu: false,
                          sort: true,
                          sortBy: "status",
                        });
                      }}
                    >
                      Sort By Status
                    </MenuItem>
                  </Menu>
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "gray",
                    fontWeight: "bold",
                    color: "#e5b9a9",
                  }}
                >
                  {getPrioIcon("Low")}Low
                  <SortIcon
                    style={{
                      color: "#1d2123",
                      marginLeft: "4px",
                      paddingTop: "10px",
                      fontSize: "25px",
                    }}
                    aria-haspopup="true"
                    aria-controls="sort-menu"
                    onClick={(e) => {
                      this.setState({
                        anchorEl: e.currentTarget,
                        openSortMenu:
                          this.state.openSortMenu === true ? false : true,
                      });
                    }}
                  />
                  <Menu
                    id="sort-menu"
                    open={Boolean(this.state.openSortMenu)}
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    onClose={() => {
                      this.setState({
                        openSortMenu: false,
                      });
                    }}
                    disableAutoFocusItem
                  >
                    <MenuItem
                      onClick={() => {
                        this.setState({
                          openSortMenu: false,
                          sort: true,
                          sortBy: "creation",
                        });
                      }}
                    >
                      Sort By Creation
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        this.setState({
                          openSortMenu: false,
                          sort: true,
                          sortBy: "status",
                        });
                      }}
                    >
                      Sort By Status
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((subtaskRow, index) => (
                <TableRow key={index}>
                  {subtaskRow.map((subTask, innerIndex) => {
                    return getTableCell(
                      BugTableElementCell,
                      subTask,
                      this.props.sprint,
                      true,
                      true
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  }
}

const BugsTableHeader = () => {
  return (
    <>
      <th className="adhocBugs">
        <h6>Bugs</h6>
      </th>
    </>
  );
};

export default DailyBugsV2;
