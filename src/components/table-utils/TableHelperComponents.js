import React from "react";
import {
  //getData,
  getTableCellDetails,
  getUserDetails,
} from "../../services/services";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { JIRA_URL } from "../../services/constantData";
import TableCell from "@material-ui/core/TableCell";

const TableHeaderElement = (props) => {
  const issue = props.data;
  const issueURL = JIRA_URL + `${issue.key}`;
  const statusStyle = {
    "min-width": "6rem",
    "font-weight": "normal",
  };
  const divStyle = {
    padding: "2px",
  };

  const linkStyle = {
    a: "hover",
    color: "black",
  };

  return (
    <TableCell style={divStyle} className="adTableHeaderElement sbTableHeaderElement">
      <>
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id={issue.id}>{issue.fields.summary}</Tooltip>}
        >
          <h6 className="sbTableHeaderSummary adTableHeaderSummary">
            <a
              style={linkStyle}
              href={issueURL}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              {issue.fields.summary}
            </a>
          </h6>
        </OverlayTrigger>

        <div style={statusStyle}>
          <span>{issue.key}</span>
        </div>
      </>
    </TableCell>
  );
};

const sortUsers = (data, sort, sortBy) => {
  if (sort === "asc" && sortBy === "users") {
    data.sort();
  }
  if (sort === "desc" && sortBy === "users") {
    data.sort().reverse();
  }
  return data;
}

const TaskListElement = (props) => {
  const data = props.data;
  const divStyle = {
    width: "11rem",
    margin: "0px",
    "max-width": "13rem",
    "white-space": "nowrap",
    overflow: "hidden",
    "text-overflow": "ellipsis",
    "font-weight": "bold",
    "font-size": "14px",
    color: "white",
    borderColor: "gray",
    fontWeight: "300",
  };
  return (
    <>
      <OverlayTrigger placement="top" overlay={<Tooltip>{data}</Tooltip>}>
        <div style={divStyle}>{data}</div>
      </OverlayTrigger>
    </>
  );
};

// different child (table cell) can be added as children
const getTableCell = (
  WrappedComponent,
  props,
  sprint,
  isBug = false,
  bSkipFetchDetail = false
) => {
  const TableCell = (props) => {
    const subTask = props.data;
    return (
      <>
        {subTask.isEmpty ? (
          <>
            <EmptyTableElement />
          </>
        ) : bSkipFetchDetail ? (
          <>
            <TableElementWithoutFetch data={subTask} sprint={sprint} isBug={isBug}>
              <WrappedComponent />
            </TableElementWithoutFetch>
          </>
        ) : (
          <>
            <TableElement data={subTask.key} sprint={sprint} isBug={isBug}>
              <WrappedComponent />
            </TableElement>
          </>
        )}
      </>
    );
  };

  return <TableCell data={props} />;
};

const EmptyTableElement = () => {
  return (
    <TableCell style={{ color: "whitesmoke" }}>
      <span> </span>
    </TableCell>
  );
};

class TableElement extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      subtask: {},
    };
  }
  componentDidMount() {
    const taskId = this.props.data;
    const authString = getUserDetails();
    let config = {
      headers: {
        Authorization: authString,
      },
    };

    //   getData(`/api/${taskId}`, config).then(response => {
    //     this.setState({
    //       subtask: { ...response.data }
    //     });
    //   });
  }

  render() {
    return (
      <TableElementWithoutFetch
        data={this.state.subtask}
        sprint={this.props.sprint}
        isBug={this.props.isBug}
      >
        {this.props.children}
      </TableElementWithoutFetch>
    );
  }
}

const TableElementWithoutFetch = (props) => {
  const elementData = props.data;
  if (!elementData.key) {
    return (
      <TableCell style={{ color: "whitesmoke" }}>
        <span>Loading...</span>
      </TableCell>
    );
  }
  
  const cellDetails = getTableCellDetails(elementData, props.sprint);
  let tdStyle = {};
  if (props.isBug === true) {
    tdStyle = {
      "background-color": cellDetails.BACKGROUND_COLOR,
      padding: "0 3px",
      color: cellDetails.COLOR,
      width: "250px",
      borderColor: "darkslategray",
    };
  } else {
    tdStyle = {
      "background-color": cellDetails.BACKGROUND_COLOR,
      padding: "0 3px",
      color: cellDetails.COLOR,
      width: "200px",
      display: "inline-block"
    };
  }
  const cellContent = React.Children.map(props.children, (child, index) => {
    return React.cloneElement(child, {
      data: { ...elementData },
      cellDetails: { ...cellDetails },
    });
  });

  return (
    <TableCell style={tdStyle} className="tableCellElement">
      {cellContent}
    </TableCell>
  );
};

export { TableElement, getTableCell, TaskListElement, TableHeaderElement };
