import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function NativeDropDown(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    age: "",
    name: "hai",
  });

  //   const handleChange = (event) => {
  //     //const value = event.target.name;
  //     setState({
  //       ...state,
  //       value: event.target.value,
  //     });
  //   };

  return (
    <div>
      <FormControl required className={classes.formControl}>
        <InputLabel htmlFor="age-native-required" style={{ color: "white" }}>{props.labelText}</InputLabel>
        <Select
          native
          style={{ color: "rgb(229, 185, 169)" }}
          value={props.currentSelectedValue}
          onChange={props.handleChange}
          name="native-dropdown"
          inputProps={{
            id: "age-native-required",
          }}
        >
          {props.labelText === "Sprint"
            ? props.allMapData.map((info) => (
                <option
                  selected={info === props.currentSelectedValue}
                  value={info}
                >
                  {info}
                </option>
              ))
            : props.allMapData.map((info) => (
                <option
                  selected={info.key === props.currentSelectedValue}
                  value={info.key}
                >
                  {info.displayName}
                </option>
              ))}
        </Select>
        {/* <FormHelperText style={{ color: "whitesmoke" }}>{props.labelText}</FormHelperText> */}
      </FormControl>
    </div>
  );
}
