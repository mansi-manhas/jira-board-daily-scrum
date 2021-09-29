import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import {
  setUserKey,
  setUserId,
  getUserId,
  getUserKey,
} from "../../services/services";
import Spinner from "react-bootstrap/Spinner";

export default class TaskBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      userKey: "",
    };
  }
  render() {
    return (
      <>
        <form inline onSubmit={this.props.onSubmit}>
          <TextField
            name="iNumber"
            onChange={(e) => {
              setUserId(e.target.value);
              this.setState({
                userId: e.target.value,
              });
            }}
            value={this.state.userId}
            type="text"
            placeholder="iNumber"
            className=" mr-sm-2"
          />
          <TextField
            name="password"
            onChange={(e) => {
              setUserKey(e.target.value);
              this.setState({
                userKey: e.target.value,
              });
            }}
            value={this.state.userKey}
            type="password"
            placeholder="password"
            className=" mr-sm-2"
          />
          {!this.props.loading && <Button type="submit">Submit</Button>}
          {this.props.loading && (
            <Button variant="primary" disabled>
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
      </>
    );
  }
}
