import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { mainListItems, secondaryListItems } from "./listItems";
import MyListItems from "./listItems";
import Chart from "./Chart";
import Links from "./Links";
import Links2 from "./Links2";
import DailyBugsScoreCard from "./DailyBugsScoreCard";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Spinner from "react-bootstrap/Spinner";
import Button from "@material-ui/core/Button";

import { CURRENT_SPRINT_INFO } from "../../services/constantData";
import { getSprint, setSprint } from "../../services/services";
import ScrumTeamDashboardV2 from "../ScrumTeamDashboardV2/ScrumTeamDashboardV2";
import { notify } from "react-notify-toast";
import Notifications from "react-notify-toast";
import { getData, getUserDetails } from "../../services/services";
import axios from "axios";
import TaskBar from "../taskbar/Taskbar";
import PropTypes from "prop-types";
import DailyBugsDashboardV2 from "../DailyBugsDashboardV2/DailyBugsDashboardV2";
import CreateTasksDashboardV2 from "../CreateTasksDashboardV2/CreateTasksDashboardV2";
import PieChartGoogle from "../dashboard/PieChartGoogle";
const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    display: "flex",
    backgroundColor: "whitesmoke",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    backgroundColor: "#323232",
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
    backgroundColor: "#323232",
    color: "#e5b9a9",
    fontWeight: "bold"
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: "#323232",
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    // content which is class of main needs to be flex and column direction
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    backgroundColor: "#1d2123",
  },
  fixedHeight: {
    height: 240,
  },
  // added the footer class
  footer: {
    padding: theme.spacing(2),
    marginTop: "auto",
    backgroundColor: "whitesmoke",
    // just this item, push to bottom
    alignSelf: "flex-end",
  },
});

class DashboardV2 extends React.Component {
  static propTypes = {
    location: React.PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      sprint: getSprint().sprintInfo || CURRENT_SPRINT_INFO,
      loading: true,
      authString: getUserDetails("").then((data) => {
        return data;
      }),
      showAuthBar: true,
      scrumTeamBoardTasks: [],
      bugs: [],
      title: "Team Dashboard",
      userId: "",
      userKey: "",
      basicAuthStr: "",
    };
  }

  componentDidMount() {
    let query = this.state.sprint;
    // if (this.state.basicAuthStr !== "") {
      getUserDetails(this.state.basicAuthStr).then(() => {
        this.loadData(query);
      });
    //}
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.sprint !== this.state.sprint) { //&& this.state.basicAuthStr !== ""
      console.log("##Sprint Changed to " + this.state.sprint);
      let query = this.state.sprint;
      getUserDetails(this.state.basicAuthStr).then(() => {
        this.loadData(query);
      });
    }
  }

  componentWillUnmount() {
    //
  }

  loadData = (query) => {
    notify.show("Loading...", "warning", -1);
    getUserDetails(this.state.basicAuthStr).then((authString) => {
      this.setState(
        {
          basicAuthStr: authString,
          loading: true,
        },
        () => {
          axios
            .all([this.getScrumTeamItemsData(query), this.getBugsData(query)])
            .then(
              axios.spread((teamTasks, bugs) => {
                notify.hide();
                notify.show("data Loaded successfully", "success", 3000);

                this.setState({
                  scrumTeamBoardTasks: [...teamTasks.data.issues],
                  bugs: [...bugs.data.issues],
                  loading: false,
                });
              })
            )
            .catch((error) => {
              console.log(error);
              notify.show(`Error occurred while fetching data`, "error", 3000);
              this.setState({ loading: false });
              throw new Error(error);
            });
        }
      );
    });
  };

  getQuerySplit = (query) => {
    let queryResult = "";
    let querySplit = query.split(",");
    for (let singleQuery = 0; singleQuery < querySplit.length; singleQuery++) {
      let encodedString = encodeURIComponent(querySplit[singleQuery].trim());
      if (singleQuery === querySplit.length - 1) {
        queryResult += `'${encodedString}'`;
      } else {
        queryResult += `'${encodedString}',`;
      }
    }
    return queryResult;
  };

  //for scrum team board
  getScrumTeamItemsJQLQuery = (query) => {
    let queryResult = this.getQuerySplit(query);
    //AND "Responsible Team" in (${ScrumTeamName})
    //AND (fixVersion in (2105, 2102, 2108) OR affectedVersion in (2105, 2102, 2108) AND
    //status in ("In Progress", Reopened, Resolved, Closed, "In Testing", "Released for UAT")) AND "Responsible Team" in ("TofT-Lannister Vikings")
    //Sprint in (${queryResult}) AND
    return `project in (project2102, project2105, project2108) AND issuetype in (Story, Sub-task) `;
  };

  //for scrum team board
  getScrumTeamItemsData = (query) => {
    const jqlQuery = this.getScrumTeamItemsJQLQuery(query);

    let config = {
      headers: {
        Authorization: this.state.basicAuthStr,
        "Content-Type": "application/json;charset=UTF-8",
      },
    };
    /**
     * customfield_10106 - Story Points
     * customfield_10308 - Acceptance Criteria
     * customfield_10203 - Responsible Team
     * customfield_10100 - sprint details
     */
    return getData(
      `/search?jql=${jqlQuery}&maxResults=500&fields=assignee,progress,priority,summary,issuetype,status,subtasks,fixVersions,labels,customfield_10106,customfield_10308,customfield_10203,comment,customfield_10100,created,comment`,
      config
    );
  };

  setAuthStr = (userId, userKey) => {
    // let buff2 = Buffer.from(userId + ":" + userKey);
    // let base64data2 = buff2.toString('base64');
    // var currentAuthStr = "Basic " + base64data2;
    this.setState({
      basicAuthStr: `Basic ${btoa(userId + ":" + userKey)}`,
    });
  }

  //for bugs
  getBugsData = (query) => {
    const jqlQuery = this.getBugsJQLQuery(query);

    let config = {
      headers: {
        Authorization: this.state.basicAuthStr,
        "Content-Type": "application/json;charset=UTF-8",
      },
    };
    return getData(`/search?jql=(${jqlQuery})&maxResults=500&fields=assignee,progress,priority,summary,issuetype,status,subtasks,fixVersions,labels,customfield_10106,customfield_10308,customfield_10203,comment,customfield_10100,created,comment,components`, config);
  };

  getBugsJQLQuery = (query) => {
    //let queryResult = this.getQuerySplit(query);
    //issuetype="Bug" AND status in (Open, "In Progress", Reopened, "Author Action") AND ("Responsible Team" in ("TofT-Lannister Vikings") OR component in (X4-project-ORG, X4-project-TPL, X4-project-DS, X4-project-LOG))
    //AND ("Responsible Team" in ("TofT-Lannister Vikings") OR component in (X4-project-ORG, X4-project-TPL, X4-project-DS, X4-project-LOG))
    return `project in ("project Authoring 2008", "project Consumption 2008", "project Conversion 2008", BC, project2011, project2102, project2105, project2108) AND issuetype="Bug" AND status in (Open, "In Progress", Reopened, "Author Action")`;
  };

  handleDrawerOpen = () => {
    this.setState({
      open: true,
    });
  };
  handleDrawerClose = () => {
    this.setState({
      open: false,
    });
  };
  setSprintOnSelect = () => {
    this.setState({
      sprint: getSprint().sprintInfo || CURRENT_SPRINT_INFO,
    });
  };

  onSubmit = () => {
    this.setState({
      loading: true,
    });
    let query = this.state.sprint;
    //this.loadData(query);
    getUserDetails(this.state.basicAuthStr).then(() => {
      this.loadData(query);
    });
  };

  render() {
    const { open, loading, bugs } = this.state;
    //const classes = useStyles();
    const { classes } = this.props;
    const { sprint } = getSprint().sprintInfo || CURRENT_SPRINT_INFO;
    // const [open, setOpen] = React.useState(true);
    // const [sprint, setSprint] = useState(
    //   getSprint().sprintInfo || CURRENT_SPRINT_INFO
    // );

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
      <div className={classes.root}>
        <Notifications options={{ place: "br", top: "500px" }} />
        {/* <TaskBar onSubmit={this.onSubmit} loading={loading} /> */}
        <Router>
          <CssBaseline />
          <AppBar
            position="absolute"
            className={clsx(classes.appBar, open && classes.appBarShift)}
          >
            <Toolbar className={classes.toolbar}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerOpen}
                className={clsx(
                  classes.menuButton,
                  open && classes.menuButtonHidden
                )}
              >
                <MenuIcon style={{ color: "whitesmoke" }} />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                className={classes.title}
              >
                Team Dashboard
              </Typography>
              <form inline onSubmit={this.onSubmit}>
                <TextField
                  name="iNumber"
                  onChange={(e) => {
                    this.setState({
                      userId: e.target.value,
                    });
                  }}
                  value={this.state.userId}
                  type="text"
                  style={{ color: "#cceabb", fontWeight: "bold" }}
                  placeholder="I-Number"
                  className="mr-sm-2"
                />
                <TextField
                  name="password"
                  onChange={(e) => {
                    this.setState({
                      userKey: e.target.value,
                    });
                    this.setAuthStr(this.state.userId, e.target.value);
                  }}
                  style={{ color: "#cceabb", fontWeight: "bold" }}
                  value={this.state.userKey}
                  type="password"
                  placeholder="Password"
                  className=" mr-sm-2"
                />
                {!this.props.loading && <Button type="submit" style={{ color: "#e5b9a9" }}>Submit</Button>}
                {this.props.loading && (
                  <Button style={{ color: "#e5b9a9" }} disabled>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="loading"
                      aria-hidden="true"
                    />
                    Loading...
                  </Button>
                )}
              </form>

              {/* <TaskBar onSubmit={this.onSubmit} loading={loading} /> */}
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: clsx(
                classes.drawerPaper,
                !open && classes.drawerPaperClose
              ),
            }}
            open={open}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon style={{ color: "whitesmoke" }} />
              </IconButton>
            </div>
            <Divider />
            {/* <List>{mainListItems}</List> */}
            <MyListItems />
            {/* <Divider />
        <List>{secondaryListItems}</List> */}
          </Drawer>
          <main className={classes.content}>
            <Switch>
              <Route path="/" exact>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                  <Grid container spacing={3}>
                    {/* Pie Chart */}
                    <Grid item xs={12} md={4} lg={6}>
                      <Paper className={fixedHeightPaper} elevation={10} style={{ borderRadius: "25px", color: "#e5b9a9" }}>
                        <PieChartGoogle allBugs={this.state.bugs} />
                      </Paper>
                    </Grid>
                    {/* Recent Deposits */}
                    <Grid item xs={12} md={4} lg={3}>
                      <Paper className={fixedHeightPaper} elevation={10} style={{ borderRadius: "25px", color: "#e5b9a9" }}>
                        <Links2 />
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                      <Paper className={fixedHeightPaper} elevation={10} style={{ borderRadius: "25px", color: "#e5b9a9" }}>
                        <Links />
                      </Paper>
                    </Grid>
                    {/* Recent Orders */}
                    <Grid item xs={12}>
                      <Paper className={classes.paper} elevation={10} style={{ borderRadius: "25px", color: "#e5b9a9" }}>
                        <DailyBugsScoreCard allBugs={this.state.bugs}/>
                      </Paper>
                    </Grid>
                  </Grid>
                  {/* Chart */}
                  {/* <Grid item xs={12} md={8} lg={9}>
                    <Paper className={fixedHeightPaper}>
                      <Chart allBugs={this.state.bugs} />
                    </Paper>
                  </Grid> */}
                </Container>
                {/* <Copyright /> */}
              </Route>
              <Route path="/ScrumTeam" exact>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="xl" className={classes.container}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Paper className={classes.paper} elevation={10} style={{ borderRadius: "25px", color: "#e5b9a9" }}>
                        <ScrumTeamDashboardV2
                          sprint={sprint}
                          setSprint={this.setSprintOnSelect}
                          bugsV2={bugs}
                          scrumTeamBoardTasksV2={this.state.scrumTeamBoardTasks}
                        />
                      </Paper>
                    </Grid>
                  </Grid>
                </Container>
              </Route>

              <Route path="/DailyBugs" exact>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="xl" className={classes.container}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Paper className={classes.paper} elevation={10} style={{ borderRadius: "25px", color: "#e5b9a9" }}>
                        <DailyBugsDashboardV2
                          bugsV2={bugs}
                          sprint={this.state.sprint}
                          setSprint={setSprint(this.state.sprint)}
                          scrumTeamBoardTasksV2={this.state.scrumTeamBoardTasks}
                        />
                      </Paper>
                    </Grid>
                  </Grid>
                </Container>
              </Route>

              <Route path="/CreateSubTasks" exact>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Paper className={classes.paper} elevation={10} style={{ borderRadius: "25px" }}> 
                        <CreateTasksDashboardV2 />
                      </Paper>
                    </Grid>
                  </Grid>
                </Container>
              </Route>
            </Switch>
          </main>
        </Router>
      </div>
    );
  }
}

DashboardV2.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(DashboardV2);
