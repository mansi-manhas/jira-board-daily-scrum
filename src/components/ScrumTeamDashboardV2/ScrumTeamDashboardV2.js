import "./ScrumTeamDashboardV2.css";
import {
  CURRENT_SPRINT_INFO,
  PROJECT_KEYS,
  SPRINTS,
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
  TASK_PRIORITY,
  TASK_STATUS,
} from "../../services/constantData";
import {
  getData,
  getProjectKey,
  getUserDetails,
  setProjectKey,
  setSprint,
} from "../../services/services";
import Notifications from "react-notify-toast";
import React from "react";
import TaskBar from "../taskbar/Taskbar";
import ScrumTeamV2 from "../scrumTeamV2/ScrumTeamV2";
import axios from "axios";
import { notify } from "react-notify-toast";
import NativeDropDown from "../nativeDropdown/NativeDropDown";
import SearchBar from "material-ui-search-bar";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import SortIcon from "@material-ui/icons/Sort";
import Menu from "@material-ui/core/Menu";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
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

class ScrumTeamDashboardV2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAuthBar: true,
      scrumTeamBoardTasks: [],
      authString: getUserDetails("").then((data) => {
        return data;
      }),
      loading: true,
      previousKey: null,
      projectKey: getProjectKey().projectKey || "ALL",
      sprint: props.sprint || CURRENT_SPRINT_INFO,
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
      statusName: [],
      userListByKey: [],
      openSortMenu: false,
      sort: false,
      sortBy: "",
      anchorEl: null,
      checkedBugs: false,
      anchorELForInfo: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.sprint !== state.sprint) {
      return {
        ...state,
        scrumTeamBoardTasks: [],
        sprint: state.sprint,
        adhocIssues: [],
        bugs: [],
      };
    }
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
    const result = [];
    if (componentNames.length > 0) {
      componentNames.forEach((c, index) => {
        result.push({ id: index, value: c, label: c });
      });
    }
    return result;
  };

  componentDidMount() {
    const { projectKey } = this.state;
    //document.body.style.backgroundColor = "#212529";
    this.setState({
      isComponentFiltered: true,
      componentsRequested: this.getComponentsByProjectKeys(projectKey),
      userListByKey: this.getFilteredListOfUsers(projectKey).users,
    });
    //const select = document.getElementById("projectSelect");
    const that = this;
    // select.addEventListener(
    //   "change",
    //   function () {
    //     that.onSelect(this.value);
    //   },
    //   false
    // );
    // const sprintSelect = document.getElementById("sprintSelect");
    // sprintSelect.addEventListener(
    //   "change",
    //   function () {
    //     that.onSprintSelect(this.value);
    //   },
    //   false
    // );
    // let query = this.state.sprint;
    // getUserDetails().then(() => {
    //   this.loadData(query);
    // });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // if (prevState.sprint !== this.state.sprint) {
    //   console.log("##Sprint Changed to " + this.state.sprint);
    //   let query = this.state.sprint;
    //   getUserDetails().then(() => {
    //     this.loadData(query);
    //   });
    // }
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
    searchText,
    sprint
  ) => {
    issues = issues.filter((issue) => {
      if (
        issue &&
        issue.fields &&
        issue.fields.customfield_10100 &&
        issue.fields.customfield_10100.length
      ) {
        const allSprints = issue.fields.customfield_10100;
        const sprintNames = [];
        allSprints.forEach((s) => {
          var nameIndex = s.indexOf("name=");
          var endIndex = s.indexOf(",startDate=");
          sprintNames.push(s.substring(nameIndex + 5, endIndex));
        });
        if (sprintNames.includes(sprint)) {
          return true;
        }
      }
    });
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
    componentsRequested
  ) => {
    if (projectKey === "ALL") {
      return list;
    }
    if (isUserFiltered) {
      if (usersRequested.length > 0) {
        list = list.filter((bug) => {
          if (bug.fields.assignee !== null) {
            //&& usersRequested.includes(bug.fields.assignee.displayName)
            for (let k = 0; k < usersRequested.length; k++) {
              if (usersRequested[k].value === bug.fields.assignee.displayName) {
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
        componentsRequested.forEach((e) =>
          allComponentsRequested.push(e.value)
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
    });
    setProjectKey(value);
  };

  onSprintSelect = (value) => {
    if (this.state.sprint === value) {
      return;
    }
    this.setState({
      sprint: value,
    });
    //this.props.setSprint(value);
    setSprint(value);
  };

  render() {
    //const theme = useTheme();
    const {
      projectKey,
      sprint,
      loading,
      isUserFiltered,
      usersRequested,
      isTasksFiltered,
      taskPriority,
      isStatusFiltered,
      statusLabel,
      searchText,
      isSearch,
      userListByKey,
    } = this.state;
    const { scrumTeamBoardTasksV2, bugsV2 } = this.props;

    return (
      <>
        <Notifications options={{ place: "br", top: "500px" }} />
        <div className="TabContainer">
          <div className="TabContainerRight">
            <div className="sprintDropdown">
              <NativeDropDown
                labelText="Sprint"
                handleChange={(e) => {
                  this.onSprintSelect(e.target.value);
                }}
                allMapData={SPRINTS}
                currentSelectedValue={this.state.sprint}
              />
            </div>
            <div className="projectKeyDropdown">
              <NativeDropDown
                labelText="Scrum Team"
                handleChange={(e) => {
                  this.setState({
                    isUserFiltered: false,
                    usersRequested: [],
                    userName: [],
                    projectKey: e.target.value,
                    isComponentFiltered: true,
                    componentsRequested: this.getComponentsByProjectKeys(
                      e.target.value
                    ),
                    defaultComponentValue: this.getComponentsByProjectKeys(
                      e.target.value
                    ),
                    userListByKey: this.getFilteredListOfUsers(e.target.value)
                      .users,
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
              placeholder="Has Keyword... "
              autoFocus
              style={{
                margin: "0.5rem",
                float: "right",
                marginTop: "20px",
                backgroundColor: "#323232",
                color: "#fffff",
              }}
            />
            {/* <TaskBar onSubmit={this.onSubmit} loading={loading} /> */}
          </div>
        </div>
        <hr className="TabContainerSeparatorLine" />

        <div>
          <FormGroup>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ justifyContent: "flex-start" }}>
                <FormControl
                  style={{
                    margin: "1rem",
                    minWidth: 250,
                    maxWidth: 300,
                  }}
                >
                  <InputLabel
                    style={{ color: "white" }}
                    id="demo-mutiple-chip-label"
                  >
                    Name
                  </InputLabel>
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
                  <InputLabel
                    style={{ color: "white" }}
                    id="demo-mutiple-chip-label"
                  >
                    Priority
                  </InputLabel>
                  <Select
                    labelId="demo-mutiple-chip-label"
                    id="demo-mutiple-chip"
                    multiple
                    value={this.state.priorityName}
                    onChange={(event) => {
                      if (event.target.value.length !== 0) {
                        this.setState({
                          priorityName: event.target.value,
                          isTasksFiltered: true,
                          taskPriority: event.target.value,
                        });
                      } else {
                        this.setState({
                          priorityName: [],
                          isTasksFiltered: false,
                          taskPriority: [],
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
                    {TASK_PRIORITY.map((name) => (
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
                  <InputLabel
                    id="demo-mutiple-chip-label"
                    style={{ color: "white" }}
                  >
                    Status
                  </InputLabel>
                  <Select
                    labelId="demo-mutiple-chip-label"
                    id="demo-mutiple-chip"
                    multiple
                    value={this.state.statusName}
                    onChange={(event) => {
                      if (event.target.value.length !== 0) {
                        this.setState({
                          statusName: event.target.value,
                          isStatusFiltered: true,
                          statusLabel: event.target.value,
                        });
                      } else {
                        this.setState({
                          statusName: [],
                          isStatusFiltered: false,
                          statusLabel: [],
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
                    {TASK_STATUS.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div
                style={{
                  justifyContent: "flex-end",
                  marginTop: "40px",
                  color: "gray",
                }}
              >
                <SortIcon
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
                        sortBy: "daysOpen",
                      });
                    }}
                  >
                    Sort By Number of Days Open
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
                  <MenuItem
                    onClick={() => {
                      this.setState({
                        openSortMenu: false,
                        sort: true,
                        sortBy: "priority",
                      });
                    }}
                  >
                    Sort By Priority
                  </MenuItem>
                </Menu>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "40px",
                  color: "#e5b9a9",
                  marginLeft: "250px",
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      style={{ fontSize: "14px", color: "#e5b9a9" }}
                      checked={this.state.checkedBugs}
                      onChange={(event) => {
                        this.setState({
                          checkedBugs: event.target.checked,
                        });
                      }}
                      name="checkedBugs"
                      color="primary"
                    />
                  }
                  label="Show Bugs"
                />
              </div>
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
                        <PlaylistAddIcon />
                      </ListItemIcon>
                      <ListItemText
                        id="switch-list-label-playlist"
                        primary="Sub-task"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <BugReportIcon />
                      </ListItemIcon>
                      <ListItemText id="switch-list-label-bug" primary="Bugs" />
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
                      <ListItemText id="switch-list-label-inprogress" primary="Closed/Resolved" />
                    </ListItem>
                  </List>
                </Popover>
              </div>
            </div>
          </FormGroup>

          <ScrumTeamV2
            sprint={this.state.sprint}
            listOfUsers={this.getFilteredListOfUsers(
              projectKey,
              isUserFiltered,
              usersRequested
            )}
            issues={this.getFilteredListOfIssues(
              scrumTeamBoardTasksV2,
              isTasksFiltered,
              taskPriority,
              isStatusFiltered,
              statusLabel,
              isSearch,
              searchText,
              this.state.sprint
            )}
            teamIssues={this.getFilteredListForProject(
              scrumTeamBoardTasksV2,
              projectKey
            )}
            projectKey={projectKey}
            sort={this.state.sort}
            sortBy={this.state.sortBy}
            checkedBugs={this.state.checkedBugs}
            allBugs={bugsV2}
          />
        </div>
      </>
    );
  }
}

export default ScrumTeamDashboardV2;
