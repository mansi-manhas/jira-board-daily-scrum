import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import { CURRENT_SPRINT_INFO } from "../../services/constantData";
function preventDefault(event) {
  event.preventDefault();
  window.open(event.target.href, "_blank");
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Links2() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Sonar Issues</Title>
      {/* <Typography component="p" style={{fontSize: "0.8rem"}}> 
        {CURRENT_SPRINT_INFO}
      </Typography> */}
      {/* variant="h4"<Typography color="textSecondary" className={classes.depositContext}>
        on 15 March, 2019
      </Typography> */}
      <br />
      <br />
      {/* <div>
        <Link
          color="primary"
          href="URL"
          onClick={preventDefault}
        >
          BCP Messages
        </Link>
        <br />
        <Link color="primary" href="#" onClick={preventDefault}>
          SNOW
        </Link>
        <br />
        <Link color="primary" href={ticketStats} onClick={preventDefault}>
          Ticket Statistics
        </Link>
        <br />
        <Link color="primary" href={qKpiURL} onClick={preventDefault}>
          Q KPI Scorecards
        </Link>
        <br />
        <Link color="primary" href={centralCapacity} onClick={preventDefault}>
          Central Capacity Sheet
        </Link>
        <br />
      </div>*/}
    </React.Fragment> 
  );
}
