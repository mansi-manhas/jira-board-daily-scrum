import "./DailyBugsDashboardV2.css";
import {
  PROJECT_KEYS,
  userList,
  userListGryffindors,
  userListLannisterVikings,
  userListGladiator,
  userListVienna,
  userListStarks,
  userListNovarto,
  userListNovarto2,
  userListOrderOfPheonix,
  userListSphinx,
  userListCoders19,
} from "../../services/constantData";
import {
  getProjectKey,
  getUserDetails,
  setProjectKey,
} from "../../services/services";
import Notifications from "react-notify-toast";
import React from "react";
import TaskBar from "../taskbar/Taskbar";
import DailyBugsV2 from "../dailyBugsV2/DailyBugsV2";
import NativeDropDown from "../nativeDropdown/NativeDropDown";
import SearchBar from "material-ui-search-bar";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import InfoIcon from "@material-ui/icons/Info";
import Popover from "@material-ui/core/Popover";
import majorPrio from "../../images/jira-priority-icons/major.svg";
import highPrio from "../../images/jira-priority-icons/high.svg";
import mediumPrio from "../../images/jira-priority-icons/medium.svg";
import BugReportIcon from "@material-ui/icons/BugReport";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class DailyBugsDashboardV2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAuthBar: true,
      scrumTeamBoardTasks: [],
      authString: getUserDetails().then((data) => {
        return data;
      }),
      loading: true,
      previousKey: null,
      projectKey: getProjectKey().projectKey || "ALL",
      isUserFiltered: false,
      usersRequested: [],
      filtered: [],
      isTasksFiltered: false,
      taskPriority: [],
      isStatusFiltered: false,
      statusLabel: undefined,
      searchText: undefined,
      isComponentFiltered: false,
      componentsRequested: undefined,
      isSearch: false,
      adhocIssues: [],
      bugs: [],
      defaultComponentValue:
        this.getComponentsByProjectKeys(getProjectKey().projectKey) ||
        this.getComponentsByProjectKeys("ALL"),
      userName: [],
      priorityName: [],
      componentName: [],
      statusName: [],
      userListByKey: [],
      componentListByKey: [],
      anchorELForInfo: null,
    };
  }

  getComponentsByProjectKeys = (projectKey) => {
    let componentNames = [];
    if (PROJECT_KEYS) {
      for (let index = 0; index < PROJECT_KEYS.length; index++) {
        if (
          PROJECT_KEYS[index].key === projectKey &&
          PROJECT_KEYS[index].bugsComponent.length > 0
        ) {
          componentNames = [...PROJECT_KEYS[index].bugsComponent];
          break;
        }
      }
    }
    // const result = [];
    // if (componentNames.length > 0) {
    //   componentNames.forEach((c, index) => {
    //     //result.push({ id: index, value: c, label: c });
    //     result.push(c);
    //   });
    // }
    //return result;
    return componentNames;
  };

  componentDidMount() {
    const { projectKey } = this.state;
    this.setState({
      isComponentFiltered: true,
      componentsRequested: this.getComponentsByProjectKeys(projectKey),
      userListByKey: this.getFilteredListOfUsers(projectKey).users,
      componentListByKey: this.getComponentsByProjectKeys(projectKey),
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //
  }

  componentWillUnmount() {
    //
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

  getFilteredListOfIssues = (
    issues,
    isTasksFiltered,
    taskPriority,
    isStatusFiltered,
    statusLabel,
    isSearch,
    searchText
  ) => {
    const statusTaskKeys = [];
    const priorityTaskKeys = [];
    let currentTaskKeys = [];
    if (isSearch && searchText && searchText !== "") {
      issues = issues.filter((issue) => {
        let filterRes = false;
        filterRes = this.isStringInKeywords(issue.key, searchText);
        if (filterRes === true) {
          return filterRes;
        }
        filterRes = issue.fields.assignee
          ? this.isStringInKeywords(issue.fields.assignee.name, searchText)
          : false;
        if (filterRes === true) {
          return filterRes;
        }
        filterRes = issue.fields.assignee
          ? this.isStringInKeywords(
              issue.fields.assignee.displayName,
              searchText
            )
          : false;
        if (filterRes === true) {
          return filterRes;
        }
        filterRes = this.isStringInKeywords(issue.fields.summary, searchText);
        if (filterRes === true) {
          return filterRes;
        }
        filterRes = this.isStringInKeywords(
          issue.fields.customfield_10308,
          searchText
        );
        if (filterRes === true) {
          return filterRes;
        }
        filterRes =
          issue.fields.comment.comments.filter((c) =>
            this.isStringInKeywords(c.body, searchText)
          ).length > 0
            ? true
            : false;
        return filterRes;
      });
    }
    if (isStatusFiltered) {
      if (statusLabel.length > 0) {
        issues.forEach((e) => {
          statusLabel.forEach((f) => {
            if (f === e.fields.status.name) {
              //if (f.value === e.fields.status.name) {
              statusTaskKeys.push(e.key);
            }
          });
        });
      }
    }
    if (isTasksFiltered) {
      if (taskPriority.length > 0) {
        issues.forEach((e) => {
          taskPriority.forEach((f) => {
            if (f === e.fields.priority.name) {
              //if (f.value === e.fields.priority.name) {
              priorityTaskKeys.push(e.key);
            }
          });
        });
      }
    }
    if (isStatusFiltered && !isTasksFiltered) {
      currentTaskKeys = statusTaskKeys;
      if (currentTaskKeys.length === 0) {
        return [];
      }
      if (currentTaskKeys.length > 0) {
        return issues.filter((issue) => currentTaskKeys.includes(issue.key));
      }
    }
    if (!isStatusFiltered && isTasksFiltered) {
      currentTaskKeys = priorityTaskKeys;
      if (currentTaskKeys.length === 0) {
        return [];
      }
      if (currentTaskKeys.length > 0) {
        return issues.filter((issue) => currentTaskKeys.includes(issue.key));
      }
    }
    if (isStatusFiltered && isTasksFiltered) {
      if (statusTaskKeys.length >= priorityTaskKeys.length) {
        currentTaskKeys = statusTaskKeys.filter((n) => {
          /* common of both filters */
          return priorityTaskKeys.indexOf(n) !== -1;
        });
      }
      if (statusTaskKeys.length < priorityTaskKeys.length) {
        currentTaskKeys = priorityTaskKeys.filter((n) => {
          return statusTaskKeys.indexOf(n) !== -1;
        });
      }
      if (currentTaskKeys.length === 0) {
        return [];
      }
      if (currentTaskKeys.length > 0) {
        return issues.filter((issue) => currentTaskKeys.includes(issue.key));
      }
    }
    return issues;
  };

  getFilteredListForProject = (list, projectKey) => {
    if (projectKey === "ALL") {
      return list;
    }
    return list.filter((issue) =>
      this.isStringInKeywords(issue.key, projectKey)
    );
  };

  getFilteredListForProjectKey = (
    list,
    projectKey,
    isUserFiltered,
    usersRequested,
    isComponentFiltered,
    componentsRequested,
    isSearch,
    searchText
  ) => {
    // if (projectKey === "ALL") {
    //   list = list;
    // }
    if (isUserFiltered) {
      if (usersRequested.length > 0) {
        list = list.filter((bug) => {
          if (bug.fields.assignee !== null) {
            //&& usersRequested.includes(bug.fields.assignee.displayName)
            for (let k = 0; k < usersRequested.length; k++) {
              if (usersRequested[k] === bug.fields.assignee.displayName) {
                //if (usersRequested[k].value === bug.fields.assignee.displayName) {
                return true;
              }
            }
          }
        });
      }
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

    if (projectKey !== "ALL") {
      list = list.filter((issue) => {
        if (
          issue.fields.hasOwnProperty("customfield_10203") &&
          issue.fields.customfield_10203 !== null
        ) {
          return this.isStringInKeywords(
            issue.fields.customfield_10203.value,
            this.getProjectDisplayName(projectKey)
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
    if (isSearch && searchText && searchText !== "") {
      list = list.filter((issue) => {
        let filterRes = false;
        filterRes = this.isStringInKeywords(issue.key, searchText);
        if (filterRes === true) {
          return filterRes;
        }
        filterRes = issue.fields.assignee
          ? this.isStringInKeywords(issue.fields.assignee.name, searchText)
          : false;
        if (filterRes === true) {
          return filterRes;
        }
        filterRes = issue.fields.assignee
          ? this.isStringInKeywords(
              issue.fields.assignee.displayName,
              searchText
            )
          : false;
        if (filterRes === true) {
          return filterRes;
        }
        filterRes = this.isStringInKeywords(issue.fields.summary, searchText);
        if (filterRes === true) {
          return filterRes;
        }
        filterRes = this.isStringInKeywords(
          issue.fields.customfield_10308,
          searchText
        );
        if (filterRes === true) {
          return filterRes;
        }
        if (
          issue &&
          issue.fields &&
          issue.fields.comment &&
          issue.fields.comment.comments
        ) {
          filterRes =
            issue.fields.comment.comments.filter((c) =>
              this.isStringInKeywords(c.body, searchText)
            ).length > 0
              ? true
              : false;
          return filterRes;
        }
      });
    }
    return list;
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

  getFilteredListOfUsers = (
    projectKey,
    isUserFiltered,
    usersRequested,
    isSearch,
    searchText
  ) => {
    let userResult = [];
    if (!isUserFiltered) {
      switch (projectKey) {
        case "ALL":
          userResult = userList;
          break;
        case "LannisterVikings":
          userResult = userListLannisterVikings;
          break;
        case "Gryffindors":
          userResult = userListGryffindors;
          break;
        case "Gladiator":
          userResult = userListGladiator;
          break;
        case "Vienna":
          userResult = userListVienna;
          break;
        case "OrderOfPhoenix":
          userResult = userListOrderOfPheonix;
          break;
        case "Starks":
          userResult = userListStarks;
          break;
        case "Novarto":
          userResult = userListNovarto;
          break;
        case "Novarto2":
          userResult = userListNovarto2;
          break;
        case "Sphinx":
          userResult = userListSphinx;
          break;
        case "Coders19":
          userResult = userListCoders19;
          break;
        default:
          console.log(
            "TabContainer.js::No matching project key. Please check if project keys are changed."
          );
          break;
      }
    } else if (isUserFiltered) {
      let currentUserList = [];
      if (usersRequested.length > 0) {
        userList.users.forEach((e) => {
          usersRequested.forEach((f) => {
            if (f === e) {
              //if (f.value === e) {
              currentUserList.push(e);
            }
          });
        });
      }
      userResult = { users: currentUserList };
    }
    if (isSearch && searchText && searchText !== "") {
      const userSearched = [];
      for (const userRes of userResult.users) {
        const isYes = this.isStringInKeywords(userRes, searchText);
        if (isYes) {
          userSearched.push(userRes);
        }
      }
      userResult = { users: [...userSearched] };
    }
    return userResult;
  };

  onSelect = (value) => {
    console.log(value);
    if (this.state.projectKey === value) {
      return;
    }
    this.setState({
      projectKey: value,
      componentsRequested: this.getComponentsByProjectKeys(value),
      userListByKey: this.getFilteredListOfUsers(this.state.projectKey).users,
      componentListByKey: this.getComponentsByProjectKeys(
        this.state.projectKey
      ),
    });
    setProjectKey(value);
  };

  render() {
    //const theme = useTheme();
    const {
      projectKey,
      loading,
      isUserFiltered,
      usersRequested,
      searchText,
      isSearch,
      userListByKey,
      componentListByKey,
    } = this.state;
    const { scrumTeamBoardTasksV2, bugsV2, sprint } = this.props;

    return (
      <>
        <Notifications options={{ place: "br", top: "500px" }} />
        <div className="TabContainer">
          <div className="TabContainerRight">
            <div className="projectKeyDropdown">
              <NativeDropDown
                labelText="Scrum Team"
                handleChange={(e) => {
                  this.setState({
                    isUserFiltered: false,
                    usersRequested: [],
                    userName: [],
                    projectKey: e.target.value,
                    componentsRequested: this.getComponentsByProjectKeys(
                      e.target.value
                    ),
                    defaultComponentValue: this.getComponentsByProjectKeys(
                      e.target.value
                    ),
                    userListByKey: this.getFilteredListOfUsers(e.target.value)
                      .users,
                    componentListByKey: this.getComponentsByProjectKeys(
                      e.target.value
                    ),
                  });
                }}
                allMapData={PROJECT_KEYS}
                currentSelectedValue={projectKey}
              />
            </div>
            <SearchBar
              value={searchText}
              onChange={(value) => {
                if (value) {
                  this.setState({
                    searchText: value,
                    isSearch: true,
                  });
                } else {
                  this.setState({
                    searchText: undefined,
                    isSearch: false,
                  });
                }
              }}
              placeholder="Has Keyword ..."
              autoFocus
              style={{
                margin: "0.5rem",
                float: "right",
                marginTop: "20px",
                backgroundColor: "#323232", color: "white",
              }}
            />
            {/* <TaskBar onSubmit={this.onSubmit} loading={loading} /> */}
          </div>
        </div>
        <hr className="TabContainerSeparatorLine" />

        <div>
          <FormGroup>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <FormControl
                style={{
                  margin: "1rem",
                  minWidth: 250,
                  maxWidth: 300,
                }}
              >
                <InputLabel style={{ color: "white" }} id="demo-mutiple-chip-label">Name</InputLabel>
                <Select
                  labelId="demo-mutiple-chip-label"
                  id="demo-mutiple-chip"
                  multiple
                  value={this.state.userName}
                  onChange={(event) => {
                    if (event.target.value.length !== 0) {
                      this.setState({
                        userName: event.target.value,
                        isUserFiltered: true,
                        usersRequested: event.target.value,
                        userListByKey:
                          this.getFilteredListOfUsers(projectKey).users,
                      });
                    } else {
                      this.setState({
                        userName: [],
                        isUserFiltered: false,
                        usersRequested: [],
                        userListByKey:
                          this.getFilteredListOfUsers(projectKey).users,
                      });
                    }
                  }}
                  input={<Input id="select-multiple-chip" />}
                  renderValue={(selected) => (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          style={{
                            margin: 2,
                            backgroundColor: "#323232",
                            color: "white",
                          }}
                        />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {userListByKey.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                style={{
                  margin: "1rem",
                  minWidth: 250,
                  maxWidth: 300,
                }}
              >
                <InputLabel style={{ color: "white" }} id="demo-mutiple-chip-label">Components</InputLabel>
                <Select
                  //defaultValue={this.state.defaultComponentValue}
                  labelId="demo-mutiple-chip-label"
                  id="demo-mutiple-chip"
                  multiple
                  value={this.state.defaultComponentValue}
                  onChange={(event) => {
                    if (event.target.value.length !== 0) {
                      this.setState({
                        isComponentFiltered: true,
                        componentsRequested: event.target.value,
                        defaultComponentValue: event.target.value,
                        componentName: event.target.value,
                        componentListByKey:
                          this.getComponentsByProjectKeys(projectKey),
                      });
                    } else {
                      this.setState({
                        componentName: [],
                        isComponentFiltered: false,
                        componentsRequested: [],
                        componentListByKey:
                          this.getComponentsByProjectKeys(projectKey),
                        defaultComponentValue:
                          this.getComponentsByProjectKeys(
                            getProjectKey().projectKey
                          ) || this.getComponentsByProjectKeys("ALL"),
                      });
                    }
                  }}
                  input={
                    <Input
                      id="select-multiple-chip"
                      type="text"
                      autoComplete={true}
                    />
                  }
                  renderValue={(selected) => (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          style={{
                            margin: 2,
                            backgroundColor: "#323232",
                            color: "white",
                          }}
                        />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {componentListByKey.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "40px",
                  color: "gray",
                }}
              >
                <InfoIcon
                  style={{
                    width: "18px",
                    height: "18px",
                    marginLeft: "150px",
                    marginTop: "8px",
                  }}
                  onClick={(e) => {
                    this.setState({
                      anchorELForInfo: e.currentTarget,
                    });
                  }}
                />
                <Popover
                  id="legend"
                  open={Boolean(this.state.anchorELForInfo)}
                  anchorEl={this.state.anchorELForInfo}
                  onClose={() => {
                    this.setState({
                      anchorELForInfo: null,
                    });
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
                  <List
                    subheader={
                      <ListSubheader style={{ color: "black" }}>
                        Legend
                      </ListSubheader>
                    }
                    style={{
                      width: "100%",
                      maxWidth: 360,
                      backgroundColor: "gray",
                      color: "white",
                    }}
                  >
                    <ListItem>
                      <ListItemIcon>
                        <img
                          className="svg-color"
                          src={majorPrio}
                          height="20px"
                          width="20px"
                          alt=""
                          style={{ opacity: "0.6" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        id="switch-list-label-wifi"
                        primary="Highest"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <img
                          className="svg-color"
                          src={highPrio}
                          height="20px"
                          width="20px"
                          alt=""
                          style={{ opacity: "0.6" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        id="switch-list-label-bluetooth"
                        primary="High"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <img
                          className="svg-color"
                          src={mediumPrio}
                          height="20px"
                          width="20px"
                          alt=""
                          style={{ opacity: "0.6" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        id="switch-list-label-bluetooth"
                        primary="Medium"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <img
                          className="svg-color rotate180"
                          src={highPrio}
                          height="20px"
                          width="20px"
                          alt=""
                          style={{ opacity: "0.6" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        id="switch-list-label-bluetooth"
                        primary="Low"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <FiberManualRecordIcon style={{ color: "#cae7df" }} />
                      </ListItemIcon>
                      <ListItemText id="switch-list-label-inprogress" primary="In Progress" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <FiberManualRecordIcon style={{ color: "#8fa8c4" }} />
                      </ListItemIcon>
                      <ListItemText id="switch-list-label-inprogress" primary="Open" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <FiberManualRecordIcon style={{ color: "rgb(29, 33, 35)" }} />
                      </ListItemIcon>
                      <ListItemText id="switch-list-label-inprogress" primary="Author Action/Reopened" />
                    </ListItem>
                  </List>
                </Popover>
              </div>
            </div>
          </FormGroup>

          <DailyBugsV2
            adhocIssues={this.getFilteredListForProject(
              scrumTeamBoardTasksV2,
              projectKey
            )}
            sprint={sprint}
            bugs={this.getFilteredListForProjectKey(
              bugsV2,
              projectKey,
              isUserFiltered,
              usersRequested,
              this.state.isComponentFiltered,
              this.state.componentsRequested,
              isSearch,
              searchText
            )}
            projectName={this.getProjectDisplayName(this.state.projectKey)}
          />
        </div>
      </>
    );
  }
}

export default DailyBugsDashboardV2;
