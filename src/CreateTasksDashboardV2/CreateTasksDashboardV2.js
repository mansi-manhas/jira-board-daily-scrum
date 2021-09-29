import "./CreateTasksDashboardV2.css";
import Notifications from "react-notify-toast";
import React from "react";
import SubTasksCreateV2 from "../createSubTasksV2/SubTasksCreateV2";

class CreateTasksDashboardV2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <Notifications options={{ place: "br", top: "500px" }} />
        <div>
          <SubTasksCreateV2/>
        </div>
      </>
    );
  }
}

export default CreateTasksDashboardV2;
