import React from "react";
import moize from "moize";
import { Table } from "react-bootstrap";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  TableHeaderElement,
  getTableCell,
} from "../table-utils/TableHelperComponents";
import { ScrumTeamTableElementCell } from "../scrumTeam/ScrumTeam";
import "./DailyBugs.css";

const BugTableElementCell = ({ data, cellDetails }) => {
  //const cellDetails = getTableCellDetails(data);

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

  return (
    <>
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
        <span style={styleHours}>{cellDetails.FIX_VERSIONS}</span>
      </>

      <br />
      <div style={divStyle}>
        <span>{cellDetails.NAME}</span>
        <span>{cellDetails.COMPONENT}</span>
      </div>
    </>
  );
};

class DailyBugs extends React.Component {
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

  getFormattedTable = (adhocIssues, bugs) => {
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
        for(; col1 < rows;) {
            if (HighestBugs.length-1 < col1) {
                aRow.push(this.getEmptySubtask());
            } else {
                aRow.push(HighestBugs[col1]);
            }
            col1++
            break;
        }
        for(; col2 < rows;) {
            if (HighBugs.length-1 < col2) {
                aRow.push(this.getEmptySubtask());
            } else {
                aRow.push(HighBugs[col2]);
            }
            col2++
            break;
        }
        for(; col3 < rows;) {
            if (MediumBugs.length-1 < col3) {
                aRow.push(this.getEmptySubtask());
            } else {
                aRow.push(MediumBugs[col3]);
            }
            col3++
            break;
        }
        for(; col4 < rows;) {
            if (LowBugs.length-1 < col4) {
                aRow.push(this.getEmptySubtask());
            } else {
                aRow.push(LowBugs[col4]);
            }
            col4++
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
    let { adhocIssues, bugs } = this.props;
    const headerNames = ["Highest", "High", "Medium", "Low"];
    if (bugs && !bugs.length) {
      //!adhocIssues.length &&
      return (
        <>
          <div className="adTableNoDataDiv">No data</div>
        </>
      );
    }
    let tableData = this.getMemoizeFunction()(adhocIssues, bugs);
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
            {/* <thead>
              <tr>
                {headerNames.map((issueType) => (
                  <TableHeaderElement data={issueType} />
                ))}
                { <BugsTableHeader />}
              </tr>
            </thead> */}
            <thead>
              <tr>
                <th style={{ "font-size": "14px", "font-weight": "bold" }}>
                  Highest
                </th>
                <th style={{ "font-size": "14px", "font-weight": "bold" }}>
                  High
                </th>
                <th style={{ "font-size": "14px", "font-weight": "bold" }}>
                  Medium
                </th>
                <th style={{ "font-size": "14px", "font-weight": "bold" }}>
                  Low
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((subtaskRow, index) => (
                <tr key={index}>
                  {subtaskRow.map((subTask, innerIndex) => {

                      return getTableCell(
                        BugTableElementCell,
                        subTask,
                        this.props.sprint,
                        true
                      );



                    // if (subtaskRow.length - 1 === innerIndex) {
                    //   return getTableCell(
                    //     BugTableElementCell,
                    //     subTask,
                    //     this.props.sprint
                    //   );
                    // } else {
                    //   return getTableCell(
                    //     ScrumTeamTableElementCell,
                    //     subTask,
                    //     this.props.sprint
                    //   );
                    // }
                  })}
                </tr>
              ))}
            </tbody>
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

export default DailyBugs;
