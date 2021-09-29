import "./TabContainer.css";
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
} from "../../services/constantData";
import { Nav, Tab } from "react-bootstrap";
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
import ScrumTeam from "../scrumTeam/ScrumTeam";
import RichFilter from "../richFilter/RichFilter";
import axios from "axios";
import { notify } from "react-notify-toast";
import Search from "../search/Search";
import DailyBugs from "../dailyBugs/DailyBugs";
import SubTasksCreate from "../createSubTasks/SubTasksCreate";

class TabContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAuthBar: true,
      scrumTeamBoardTasks: [],
      authString: getUserDetails().then((data) => {
        return data;
      }),
      loading: true,
      currentTab: localStorage.getItem("currentTab") || "board",
      previousKey: null,
      projectKey: getProjectKey().projectKey || "ALL",
      sprint: CURRENT_SPRINT_INFO,
      isUserFiltered: false,
      usersRequested: undefined,
      filtered: [],
      isTasksFiltered: false,
      taskPriority: undefined,
      isStatusFiltered: false,
      statusLabel: undefined,
      searchText: undefined,
      isComponentFiltered: false,
      componentsRequested: undefined,
      isSearch: false,
      adhocIssues: [],
      bugs: [],
      defaultComponentValue: this.getComponentsByProjectKeys(getProjectKey().projectKey) || this.getComponentsByProjectKeys("ALL")
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.sprint !== state.sprint) {
      return {
        ...state,
        scrumTeamBoardTasks: [],
        sprint: props.sprint,
        adhocIssues: [],
        bugs: [],
      };
    }
  }

  getComponentsByProjectKeys = (projectKey) => {
    let componentNames = [];
    if (PROJECT_KEYS) {
      for (let index = 0; index < PROJECT_KEYS.length; index++) {
        if (PROJECT_KEYS[index].key === projectKey && PROJECT_KEYS[index].bugsComponent.length > 0) {
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
    const { currentTab, projectKey } = this.state;
    document.body.style.backgroundColor = "#212529";
    this.setState({
      isComponentFiltered: true,
      componentsRequested: this.getComponentsByProjectKeys(projectKey)
    })
    const select = document.getElementById("projectSelect");
    const that = this;
    select.addEventListener(
      "change",
      function () {
        that.onSelect(this.value, currentTab);
      },
      false
    );
    if (currentTab === "team") {
      const sprintSelect = document.getElementById("sprintSelect");
      sprintSelect.addEventListener(
        "change",
        function () {
          that.onSprintSelect(this.value);
        },
        false
      );
    }
    let query = this.state.sprint;
    getUserDetails().then(() => {
      this.loadData(query);
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.sprint !== this.state.sprint) {
      console.log("##Sprint Changed to " + this.state.sprint);
      let query = this.state.sprint;
      getUserDetails().then(() => {
        this.loadData(query);
      });
    }
  }

  componentWillUnmount() {
    const { currentTab } = this.state;
    const select = document.getElementById("projectSelect");
    const that = this;
    select.removeEventListener(
      "change",
      function () {
        that.onSelect(this.value);
      },
      false
    );

    if (currentTab === "team") {
      const sprintSelect = document.getElementById("sprintSelect");
      sprintSelect.removeEventListener(
        "change",
        function () {
          that.onSprintSelect(this.value);
        },
        false
      );
    }
  }

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
            if (f.value === e.fields.status.name) {
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
            if (f.value === e.fields.priority.name) {
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

  getFilteredListForProjectKey = (list, projectKey, isUserFiltered, usersRequested, isComponentFiltered, componentsRequested) => {
    if (projectKey === "ALL") {
      return list;
    }
    if (isUserFiltered) {
      if (usersRequested.length > 0) {
        list = list.filter((bug) => {
          if (bug.fields.assignee !== null) {
            //&& usersRequested.includes(bug.fields.assignee.displayName)
            for(let k=0; k<usersRequested.length; k++) {
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
        componentsRequested.forEach(e => allComponentsRequested.push(e.value));
        list.forEach((bug) => {
          if (bug.fields.components !== null && bug.fields.components.length > 0) {
            for(let k=0; k<bug.fields.components.length; k++) {
              if (allComponentsRequested.includes(bug.fields.components[k].name)) {
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
      for (let i=0; i<list.length; i++) {
        for (let j=0; j<updatedList.length; j++) {
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
            if (f.value === e) {
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

  loadData = (query) => {
    notify.show("Loading...", "warning", -1);
    getUserDetails().then((authString) => {
      this.setState(
        {
          authString: authString,
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
              notify.show(`Error occurred while fetching data`, "error", 3000);
              this.setState({ loading: false });
              throw new Error(error);
            });
        }
      );
    });
  };

  //for scrum team board
  getScrumTeamItemsJQLQuery = (query) => {
    let queryResult = this.getQuerySplit(query);
    //AND "Responsible Team" in (${ScrumTeamName})
    //AND (fixVersion in (2105, 2102, 2108) OR affectedVersion in (2105, 2102, 2108) AND
    //status in ("In Progress", Reopened, Resolved, Closed, "In Testing", "Released for UAT")) AND "Responsible Team" in ("TofT-Lannister Vikings")
    return `Sprint in (${queryResult}) AND project in (project2102, project2105, project2108) AND issuetype in (Story, Sub-task) `;
  };

  //for scrum team board
  getScrumTeamItemsData = (query) => {
    const jqlQuery = this.getScrumTeamItemsJQLQuery(query);

    let config = {
      headers: {
        Authorization: this.state.authString,
        "Content-Type": "application/json;charset=UTF-8",
      },
    };
    /**
     * customfield_10106 - Story Points
     * customfield_10308 - Acceptance Criteria
     * customfield_10203 - Responsible Team
     */
    return getData(
      `/search?jql=${jqlQuery}&maxResults=500&fields=assignee,progress,priority,summary,issuetype,status,subtasks,fixVersions,labels,customfield_10106,customfield_10308,customfield_10203,comment`,
      config
    );
  };

  //for bugs
  getBugsData = (query) => {
    const jqlQuery = this.getBugsJQLQuery(query);

    let config = {
      headers: {
        Authorization: this.state.authString,
        "Content-Type": "application/json;charset=UTF-8",
      },
    };
    return getData(`/search?jql=(${jqlQuery})&maxResults=500`, config);
  };

  getBugsJQLQuery = (query) => {
    //let queryResult = this.getQuerySplit(query);
    //issuetype="Bug" AND status in (Open, "In Progress", Reopened, "Author Action") AND ("Responsible Team" in ("TofT-Lannister Vikings") OR component in (X4-project-ORG, X4-project-TPL, X4-project-DS, X4-project-LOG))
    //AND ("Responsible Team" in ("TofT-Lannister Vikings") OR component in (X4-project-ORG, X4-project-TPL, X4-project-DS, X4-project-LOG))
    return `project in ("project Authoring 2008", "project Consumption 2008", "project Conversion 2008", BC, project2011, project2102, project2105, project2108) AND issuetype="Bug" AND status in (Open, "In Progress", Reopened, "Author Action")`;
  };

  onSelect = (value, currentTab) => {
    console.log(value);
    if (this.state.projectKey === value) {
      return;
    }
    this.setState({
      projectKey: value,
      currentTab: currentTab,
      componentsRequested: this.getComponentsByProjectKeys(value)
    });
    setProjectKey(value);
  };

  onSprintSelect = (value, mycurrentTab = "team") => {
    if (this.state.sprint === value) {
      return;
    }
    this.setState({
      currentTab: mycurrentTab
    });
    this.props.setSprint(value);
    setSprint(value);
  };

  setCurrentTab = (option) => {
    localStorage.setItem("currentTab", option);
    this.setState({ currentTab: option });
  };

  // getUserFilterOptions = () => {
  //   const { projectKey } = this.state;
  //   let currentUserList = this.getFilteredListOfUsers(projectKey);
  //   const userOptions = [];
  //   if (currentUserList && currentUserList.users.length > 0) {
  //     currentUserList.users.forEach((userName, index) => {
  //       userOptions.push({ id: index, value: userName, label: userName });
  //     });
  //   }
  //   return userOptions;
  // };

  // onFilteredChangeCustom = (value, accessor) => {
  //   let filtered = this.state.filtered;
  //   let insertNewFilter = 1;

  //   if (filtered.length) {
  //     filtered.forEach((filter, i) => {
  //       if (filter["id"] === accessor) {
  //         if (value === "" || !value.length) filtered.splice(i, 1);
  //         else filter["value"] = value;

  //         insertNewFilter = 0;
  //       }
  //     });
  //   }

  //   if (insertNewFilter) {
  //     filtered.push({ id: accessor, value: value });
  //   }

  //   this.setState({ filtered: filtered });
  // };

  render() {
    const {
      currentTab,
      scrumTeamBoardTasks,
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
      bugs,
    } = this.state;
    // const customStyles = {
    //   option: (provided, state) => ({
    //     ...provided,
    //     "background-color": "#212529",
    //     color: "white",
    //   }),
    //   menu: (provided, state) => ({
    //     ...provided,
    //     "background-color": "#212529",
    //     color: "white",
    //   }),
    // };
    return (
      <>
        <Notifications options={{ place: "br", top: "500px" }} />

        <Tab.Container defaultActiveKey={currentTab}>
          <div className="TabContainer">
            <div className="TabContainerLeft">
              <Nav
                activeKey={currentTab}
                variant="tabs"
                onSelect={(e) => {
                  this.setCurrentTab(e);
                }}
              >
                <Nav.Item>
                  <Nav.Link
                    style={{ "background-color": "#212529", color: "#ffffff" }}
                    eventKey="team"
                  >
                    Scrum Team
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    style={{ "background-color": "#212529", color: "#ffffff" }}
                    eventKey="bugs"
                  >
                    Daily Bugs
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    style={{ "background-color": "#212529", color: "#ffffff" }}
                    eventKey="createTasks"
                  >
                    Create Sub Tasks
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            

            <div className="TabContainerRight">
              {currentTab === "team" ? (
                <div className="sprintDropdown">
                  <select
                    id="sprintSelect"
                    style={{ "background-color": "#212529", color: "#ffffff" }}
                    onSelect={(e) => {this.onSprintSelect(e.target.value, currentTab);}}
                  >
                    {SPRINTS.map((sprintInfo) => (
                      <option
                        selected={sprintInfo === this.props.sprint}
                        value={sprintInfo}
                      >
                        {sprintInfo}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <></>
              )}
              <div className="projectKeyDropdown">
                <select
                  style={{ "background-color": "#212529", color: "#ffffff" }}
                  id="projectSelect"
                  onChange={(e) => {
                    this.setState({
                      isUserFiltered: false,
                      usersRequested: [],
                      projectKey: e.target.value,
                      currentTab,
                      isComponentFiltered: true,
                      componentsRequested: this.getComponentsByProjectKeys(e.target.value),
                      defaultComponentValue: this.getComponentsByProjectKeys(e.target.value)
                    });
                  }}
                >
                  {PROJECT_KEYS.map((projectObj) => (
                    <option
                      selected={projectObj.key === projectKey}
                      value={projectObj.key}
                    >
                      {projectObj.displayName}
                    </option>
                  ))}
                </select>
              </div>
              <div
                style={{
                  float: "right",
                  margin: "0.5rem",
                  backgroundColor: "#212529",
                  color: "#ffffff",
                }}
              >
                <Search
                  searchText={searchText}
                  onChangeHandler={(entry) => {
                    if (entry && entry.target.value) {
                      this.setState({
                        searchText: entry.target.value,
                        isSearch: true,
                      });
                    } else {
                      this.setState({
                        searchText: undefined,
                        isSearch: false,
                      });
                    }
                  }}
                />
              </div>
              <TaskBar onSubmit={this.onSubmit} loading={loading} />
            </div>
          </div>
          <hr className="TabContainerSeparatorLine" />

          <Tab.Content style={{ backgroundColor: "#212529" }}>
            <Tab.Pane eventKey="team">
              <div>
                <div style={{ width: "20%", padding: "20px", float: "left" }}>
                  Name:{" "}
                  <RichFilter
                    filterType="Name"
                    projectKey={this.state.projectKey}
                    userList={userList}
                    userListLannisterVikings={userListLannisterVikings}
                    userListGryffindors={userListGryffindors}
                    userListGladiator={userListGladiator}
                    userListVienna={userListVienna}
                    userListStarks={userListStarks}
                    userListNovarto={userListNovarto}
                    userListNovarto2={userListNovarto2}
                    userListOrderOfPheonix={userListOrderOfPheonix}
                    userListSphinx={userListSphinx}
                    userListCoders19={userListCoders19}
                    onChange={(entry) => {
                      if (entry.length > 0) {
                        this.setState({
                          isUserFiltered: true,
                          usersRequested: entry,
                        });
                      } else {
                        this.setState({
                          isUserFiltered: false,
                          usersRequested: undefined,
                        });
                      }
                    }}
                    usersRequested={this.state.usersRequested}
                  />
                </div>
                <div style={{ width: "20%", padding: "20px", float: "left" }}>
                  Priority:{" "}
                  <RichFilter
                    filterType="Priority"
                    projectKey={this.state.projectKey}
                    onChange={(entry) => {
                      if (entry.length > 0) {
                        this.setState({
                          isTasksFiltered: true,
                          taskPriority: entry,
                        });
                      } else {
                        this.setState({
                          isTasksFiltered: false,
                          taskPriority: undefined,
                        });
                      }
                    }}
                  />
                </div>
                <div style={{ width: "20%", padding: "20px", float: "left" }}>
                  Status:{" "}
                  <RichFilter
                    filterType="Status"
                    projectKey={this.state.projectKey}
                    onChange={(entry) => {
                      if (entry.length > 0) {
                        this.setState({
                          isStatusFiltered: true,
                          statusLabel: entry,
                        });
                      } else {
                        this.setState({
                          isStatusFiltered: false,
                          statusLabel: undefined,
                        });
                      }
                    }}
                  />
                </div>
                <ScrumTeam
                  sprint={sprint}
                  listOfUsers={this.getFilteredListOfUsers(
                    projectKey,
                    isUserFiltered,
                    usersRequested
                  )}
                  issues={this.getFilteredListOfIssues(
                    scrumTeamBoardTasks,
                    isTasksFiltered,
                    taskPriority,
                    isStatusFiltered,
                    statusLabel,
                    isSearch,
                    searchText
                  )}
                  teamIssues={this.getFilteredListForProject(
                    scrumTeamBoardTasks,
                    projectKey
                  )}
                  projectKey={projectKey}
                />
              </div>
            </Tab.Pane>

            <Tab.Pane eventKey="bugs">
              <div>
              <div style={{ width: "20%", padding: "20px", float: "left" }}>
                  Name:{" "}
                  <RichFilter
                    filterType="Name"
                    projectKey={this.state.projectKey}
                    userList={userList}
                    userListLannisterVikings={userListLannisterVikings}
                    userListGryffindors={userListGryffindors}
                    userListGladiator={userListGladiator}
                    userListVienna={userListVienna}
                    userListStarks={userListStarks}
                    userListNovarto={userListNovarto}
                    userListNovarto2={userListNovarto2}
                    userListOrderOfPheonix={userListOrderOfPheonix}
                    userListSphinx={userListSphinx}
                    userListCoders19={userListCoders19}
                    onChange={(entry) => {
                      if (entry.length > 0) {
                        this.setState({
                          isUserFiltered: true,
                          usersRequested: entry,
                        });
                      } else {
                        this.setState({
                          isUserFiltered: false,
                          usersRequested: undefined,
                        });
                      }
                    }}
                    usersRequested={this.state.usersRequested}
                  />
                  Components:{" "}
                  <RichFilter
                    filterType="Components"
                    projectKey={projectKey}
                    componentsReq={this.state.defaultComponentValue}
                    onChange={(entry) => {
                      if (entry.length > 0) {
                        this.setState({
                          isComponentFiltered: true,
                          componentsRequested: entry,                   
                        });
                      } else {
                        this.setState({
                          isComponentFiltered: false,
                          componentsRequested: undefined,
                        });
                      }
                    }}
                  />
                </div>
                <DailyBugs
                  sprint={sprint}
                  adhocIssues={this.getFilteredListForProject(
                    scrumTeamBoardTasks,
                    projectKey
                  )}
                  bugs={this.getFilteredListForProjectKey(bugs, projectKey, isUserFiltered, usersRequested, this.state.isComponentFiltered, this.state.componentsRequested)}
                />
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="createTasks">
              <SubTasksCreate/>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </>
    );
  }
}

export default TabContainer;
