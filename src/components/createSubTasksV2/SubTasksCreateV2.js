import React, { Component } from "react";
import { taskListForCreate } from "../../services/constantData";
import { ListGroup, ListGroupItem, Button, FormControl } from "react-bootstrap";
import Notifications, { notify } from "react-notify-toast";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";


var cb = {
  textAlign: "left",
  width: "500px",
  height: "30px",
  color: "white",
  "background-color": "#323232",
};

var cba = {
  textAlign: "left",
  width: "500px",
  height: "50px",
  color: "white",
  "background-color": "#323232",
};

var cbs = {
  textAlign: "left",
  width: "",
  height: "auto",
  color: "white",
  "background-color": "#323232",
};

var tasks;
let count = 0;

export default class SubTasksCreateV2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storyID: "",
      text: [],
      generatedList: "",
      sentList: [],
      checked: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.sendData = this.sendData.bind(this);
    this.editList = this.editList.bind(this);
  }

  componentDidMount() {
    this.setState({ text: taskListForCreate.tasks });
    for (let i = 0; i < this.state.text.length; i++) {
      this.state.checked[i] = false;
    }
  }

  handleChange() {

  }

  sendData() {
    let data = { id: this.state.storyID, tasks: {}, key: this.state.storyKey };
    for (let i = 0; i < this.state.sentList.length; i++) {
      data.tasks[i] = this.state.sentList[i];
    }

    let projectID = document.getElementById("jiraID").value;
    let projectKey = projectID.substring(0, 8); //dynamic?
    let pretextValue = document.getElementById("pretext").value;

    var arr = [];
    for (var j = 0; j < this.state.sentList.length; j++) {
      arr[j] = this.state.sentList[j];
      this.state.sentList[j] = pretextValue + " - " + this.state.sentList[j];
    }

    let iNumber = document.getElementById("iNumber").value;
    let password = document.getElementById("password").value;

    let authString = btoa(iNumber + ":" + password);
    let responseKey;
    for (var i = 0; i < this.state.sentList.length; i++) {
      // let currentSentListValue = this.state.sentList[i];
      var postDataObj = {
        fields: {
          parent: {
            id: document.getElementById("jiraID").value,
          },
          project: {
            key: projectKey,
          },
          summary: this.state.sentList[i],
          issuetype: {
            id: "5",
          },
          labels: ["abc", "def"],
          description: "description",
          credentials: "Basic <KEY>",
        },
      };

      const config = {
        method: "post",
        url: "/api/createTask",
        data: postDataObj,
      };

      console.log("Data: ", config);
      axios
        .request(config)
        .then(function (response) {
          responseKey = response.data.key;
          let abc = "https://<organization>jira.<location>.<organization>.corp/browse/" + responseKey;
          let bb = document.getElementById("taskURL").value;
          if (document.getElementById("taskURL").value != "") {
            document.getElementById("taskURL").value =
              document.getElementById("taskURL").value + " , " + abc;
          } else {
            document.getElementById("taskURL").value = abc;
          }
          if (response.status == 201) {
            let myColor = { background: "#0E1717", text: "#FFFFFF" };
            notify.show(
              "Tasks created successfully!",
              "success",
              3000,
              myColor
            );
          } else {
            let myColor = { background: "#0E1717", text: "#FFFFFF" };
            notify.show("Tasks not created!", "error", 3000, myColor);
          }
        })
        .catch(function (error) {
          let myColor = { background: "#0E1717", text: "#FFFFFF" };
          notify.show("Tasks not created!", "error", 3000, myColor);
        });
    }

    for (var k = 0; k < this.state.sentList.length; k++) {
      this.state.sentList[k] = arr[k];
    }
  }

  editList(e, key, item) {
    let newState = this.state.checked;
    newState[key] = !newState[key];
    this.setState({ checked: newState });
    if (e.target.checked == true && item == "Select All") {
      for (var i = 1; i < this.state.text.length; i++) {
        this.state.sentList.pop();
      }
      count = 1;
      let newList = this.state.sentList;
      let newState = this.state.checked;
      for (var i = 1; i < this.state.text.length; i++) {
        newState[i] = true;
        newList.push(this.state.text[i]);
      }
      this.setState({ sentList: newList, checked: newState });
    } else if (e.target.checked == true && item != "Select All") {
      let newList = this.state.sentList;
      newList.push(item);
      this.setState({ sentList: newList });
    } else if (
      e.target.checked == false &&
      item == "Select All" &&
      count == 1
    ) {
      let newState = this.state.checked;
      let newList = this.state.sentList;
      count = 0;
      for (var i = 1; i < this.state.text.length; i++) {
        newState[i] = false;
        newList.pop();
      }
      this.setState({ sentList: newList, checked: newState });
    } else {
      let newList = this.state.sentList;
      for (let i = 0; i < newList.length; i++) {
        if (newList[i] == item) {
          newList.splice(i, 1);
        }
      }
    }
    console.log(this.state.sentList);
  }

  getTasks() {
    tasks = this.state.text.map((item, key) => (
      <ListGroupItem key={key} bsStyle="success" style={cba}>
        {/* <Checkbox onClick={(e) => this.editList(e,key, item)} checked={this.state.checked[key]}>
                    {item}
                </Checkbox><br /> */}
        <input
          type="checkbox"
          onChange={(e) => this.editList(e, key, item)}
          checked={this.state.checked[key]}
        />
        {item}
        <br />
      </ListGroupItem>
    ));
    return <ListGroup style={{ marginLeft: "10px" }}>{tasks}</ListGroup>;
  }
  render() {
    return (
      <div>
        <Typography variant="h5" style={{ color: "#e5b9a9", textAlign: "center" }}>Automated JIRA Task Creation</Typography>
        <Divider style={{ color: "gray" }}/>
        {/* <h4 style={{ color: "#e5b9a9", textAlign: "left" }}>Authorization</h4> */}
        <FormControl
          type="text"
          placeholder="Enter iNumber"
          id="iNumber"
          style={cb}
        />
        <FormControl
          type="password"
          placeholder="Enter Password"
          id="password"
          style={cb}
        />
        <br/>
        <FormControl
          type="text"
          placeholder="Enter User Story ID"
          id="jiraID"
          style={cb}
        />
        <FormControl
          type="text"
          placeholder="Pretext"
          id="pretext"
          style={cb}
        />
        <Notifications options={{ place: "br", top: "500px" }} />
        {this.getTasks()}
        <FormControl type="text" disabled={true} id="taskURL" style={cbs} />
        <Button style={{ backgroundColor: "#e5b9a9", color: "black", borderColor: "#e5b9a9", marginLeft: "10px" }} onClick={this.sendData}>
          Create Tasks
        </Button>
        <br />
      </div>
    );
  }
}
