import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PeopleIcon from "@material-ui/icons/People";
import BarChartIcon from "@material-ui/icons/BarChart";
import LayersIcon from "@material-ui/icons/Layers";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { Link } from "react-router-dom";
import BugReportIcon from "@material-ui/icons/BugReport";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import List from "@material-ui/core/List";

export default function MyListItems() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [dashboardColor, setDashboardColor] = React.useState("#e5b9a9");
  const [scrumColor, setScrumColor] = React.useState("gray");
  const [bugsColor, setBugsColor] = React.useState("gray");
  const [tasksColor, setTasksColor] = React.useState("gray");

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    if (index === 0) {
      setDashboardColor("#e5b9a9");
      setScrumColor("gray");
      setBugsColor("gray");
      setTasksColor("gray");
    }
    if (index === 1) {
      setDashboardColor("gray");
      setScrumColor("#e5b9a9");
      setBugsColor("gray");
      setTasksColor("gray");
    }
    if (index === 2) {
      setDashboardColor("gray");
      setScrumColor("gray");
      setBugsColor("#e5b9a9");
      setTasksColor("gray");
    }
    if (index === 3) {
      setDashboardColor("gray");
      setScrumColor("gray");
      setBugsColor("gray");
      setTasksColor("#e5b9a9");
    }
  };
  return (
    <List>
      <Link to="/">
        <ListItem
          button
          selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(event, 0)}
        >
          <ListItemIcon>
            <DashboardIcon style={{ color: "whitesmoke" }} />
          </ListItemIcon>
          <ListItemText style={{ color: dashboardColor }} primary="Dashboard" />
        </ListItem>
      </Link>
      {/* <ListItem button>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem> */}
      <Link to="/ScrumTeam">
        <ListItem
          button
          selected={selectedIndex === 1}
          onClick={(event) => handleListItemClick(event, 1)}
        >
          <ListItemIcon>
            <PeopleIcon style={{ color: "whitesmoke" }} />
          </ListItemIcon>
          <ListItemText
            style={{ color: scrumColor }}
            primary="Scrum Team"
          />
        </ListItem>
      </Link>
      <Link to="/DailyBugs">
        <ListItem
          button
          selected={selectedIndex === 2}
          onClick={(event) => handleListItemClick(event, 2)}
        >
          <ListItemIcon>
            <BugReportIcon style={{ color: "whitesmoke" }} />
          </ListItemIcon>
          <ListItemText
            style={{ color: bugsColor }}
            primary="Daily Bugs"
          />
        </ListItem>
      </Link>
      <Link to="/CreateSubTasks">
        <ListItem
          button
          selected={selectedIndex === 3}
          onClick={(event) => handleListItemClick(event, 3)}
        >
          <ListItemIcon>
            <PlaylistAddIcon style={{ color: "whitesmoke" }} />
          </ListItemIcon>
          <ListItemText
            style={{ color: tasksColor }}
            primary="Create Tasks"
          />
        </ListItem>
      </Link>
      {/* <Link to='/CopyDashboard'>
          <ListItem button>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Copy Dashboard" />
          </ListItem>
          </Link> */}
      {/* <ListItem button>
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <LayersIcon />
            </ListItemIcon>
            <ListItemText primary="Integrations" />
          </ListItem> */}
    </List>
  );
}
export const mainListItems = (
  <div>
    <Link to="/">
      <ListItem button>
        <ListItemIcon>
          <DashboardIcon style={{ color: "whitesmoke" }} />
        </ListItemIcon>
        <ListItemText style={{ color: "#e5b9a9" }} primary="Dashboard" />
      </ListItem>
    </Link>
    {/* <ListItem button>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Orders" />
        </ListItem> */}
    <Link to="/ScrumTeam">
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon style={{ color: "whitesmoke" }} />
        </ListItemIcon>
        <ListItemText
          style={{ color: "gray" }}
          primary="Scrum Team"
        />
      </ListItem>
    </Link>
    <Link to="/DailyBugs">
      <ListItem button>
        <ListItemIcon>
          <BugReportIcon style={{ color: "whitesmoke" }} />
        </ListItemIcon>
        <ListItemText
          style={{ color: "gray" }}
          primary="Daily Bugs"
        />
      </ListItem>
    </Link>
    <Link to="/CreateSubTasks">
      <ListItem button>
        <ListItemIcon>
          <PlaylistAddIcon style={{ color: "whitesmoke" }} />
        </ListItemIcon>
        <ListItemText
          style={{ color: "gray" }}
          primary="Create Tasks"
        />
      </ListItem>
    </Link>
    {/* <Link to='/CopyDashboard'>
        <ListItem button>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Copy Dashboard" />
        </ListItem>
        </Link> */}
    {/* <ListItem button>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="Integrations" />
        </ListItem> */}
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);
