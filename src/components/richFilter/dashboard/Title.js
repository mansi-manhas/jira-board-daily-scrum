import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    // In Chinese and Japanese the characters are usually larger,
    // so a smaller fontsize may be appropriate.
    color: "#e5b9a9",
  },
});

export default function Title(props) {
  return (
    <ThemeProvider theme={theme}>
    <Typography component="h2" variant="h6" gutterBottom>
      {props.children}
    </Typography>
    </ThemeProvider>
  );
}

Title.propTypes = {
  children: PropTypes.node
};
