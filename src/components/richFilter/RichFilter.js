import React, { Component } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { PROJECT_KEYS } from "../../services/constantData";

export default class RichFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserFiltered: false,
      usersRequested: undefined,
      isComponentFiltered: true,
      componentsRequested: undefined,
      defaultComponentValue: this.getComponentsByProjectKeys(this.props.projectKey)
    };
  }

  getTaskPriorityNames = () => {
    const taskPriorirty = [
      { id: 0, value: "Low", label: "Low" },
      { id: 1, value: "Medium", label: "Medium" },
      { id: 2, value: "High", label: "High" },
      { id: 3, value: "Highest", label: "Highest" },
    ];
    return taskPriorirty;
  };

  getStatusLabels = () => {
    const status = [
      { id: 0, value: "Open", label: "Open" },
      { id: 1, value: "Ready for Development", label: "Ready for Development" },
      { id: 2, value: "In Progress", label: "In Progress" },
      { id: 2, value: "Resolved", label: "Resolved" },
      { id: 2, value: "Closed", label: "Closed" },
      { id: 3, value: "Reopened", label: "Reopened" },
      { id: 4, value: "Descoped", label: "Descoped" },
      { id: 5, value: "Transferred", label: "Transferred" },
      { id: 2, value: "Released for UAT", label: "Released for UAT" },
    ];
    return status;
  };

  getUserFilterOptions = () => {
    const { projectKey } = this.props;
    let currentUserList = this.getFilteredListOfUsers(projectKey);
    const userOptions = [];
    if (currentUserList && currentUserList.users.length > 0) {
      currentUserList.users.forEach((userName, index) => {
        userOptions.push({ id: index, value: userName, label: userName });
      });
    }
    return userOptions;
  };

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

  getFilteredListOfUsers = (projectKey, isUserFiltered, usersRequested) => {
    const {
      userList,
      userListLannisterVikings,
      userListGryffindors,
      userListGladiator,
      userListVienna,
      userListStarks,
      userListNovarto,
      userListNovarto2,
      userListOrderOfPheonix,
      userListSphinx,
      userListCoders19,
    } = this.props;
    if (!isUserFiltered) {
      switch (projectKey) {
        case "ALL":
          return userList;
        case "LannisterVikings":
          return userListLannisterVikings;
        case "Gryffindors":
          return userListGryffindors;
        case "Gladiator":
          return userListGladiator;
        case "Vienna":
          return userListVienna;
        case "Starks":
          return userListStarks;
        case "Novarto":
          return userListNovarto;
        case "OrderOfPhoenix":
          return userListOrderOfPheonix;
        case "Sphinx":
          return userListSphinx;
        case "Coders19":
          return userListCoders19;
        case "Novarto2":
          return userListNovarto2;
        default:
          console.log(
            "RichFilter.js::No matching project key. Please check if project keys are changed."
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
      return { users: currentUserList };
    }
  };

  renderSwitch = (param) => {
    const {
      onChange,
      usersRequested,
      taskPriority,
      statusLabel,
      componentsReq,
      defaultFilter,
      defaultComponentValue,
      projectKey,
    } = this.props;
    const customTheme = (theme) => ({
      ...theme,
      borderRadius: 0,
      colors: {
        ...theme.colors,
        primary25: "#212529",
        primary: "#212529",
        neutral0: "#696969",
        neutral80: "white",
        neutral5: "#212529",
        neutral10: "#212529",
      },
    });

    const customStyles = (width = 100, height = 40) => {
      return {
        container: (base) => ({
          ...base,
          width: "20px",
          borderRadius: "30px",
          margin: "0.5rem",
          backgroundColor: "#212529",
          color: "#fff",
        }),
        valueContainer: (base) => ({
          ...base,
          minHeight: "20px",
          borderRadius: "30px",
          margin: "0.5rem",
          backgroundColor: "#212529",
          color: "#fff",
        }),
      };
    };
    switch (param) {
      case "Priority":
        return (
          <Select
            onChange={onChange}
            value={taskPriority}
            isMulti={true}
            options={this.getTaskPriorityNames()}
            width="50%"
            searchable
            styles={customStyles}
            theme={customTheme}
          />
        );
      case "Status":
        return (
          <Select
            onChange={onChange}
            value={statusLabel}
            isMulti={true}
            options={this.getStatusLabels()}
            width="50%"
            searchable
            styles={customStyles}
            theme={customTheme}
          />
        );
      case "Name":
        return (
          <Select
            onChange={onChange}
            value={usersRequested}
            isMulti={true}
            options={this.getUserFilterOptions()}
            width="50%"
            searchable
            styles={customStyles}
            theme={customTheme}
          />
        );
      case "Components":
        return (
          // <Select
          //   onChange={onChange}
          //   value={componentsReq}
          //   isMulti={true}
          //   width="50%"
          //   searchable
          //   styles={customStyles}
          //   theme={customTheme}
          // />
          <CreatableSelect
            isMulti={true}
            onChange={onChange}
            defaultValue={defaultComponentValue}
            options={this.getComponentsByProjectKeys(projectKey)}
            width="50%"
            searchable
            styles={customStyles}
            theme={customTheme}
          />
        );
      default:
        return <></>;
    }
  };

  render() {
    const { filterType } = this.props;
    return <>{this.renderSwitch(filterType)}</>;
  }
}
