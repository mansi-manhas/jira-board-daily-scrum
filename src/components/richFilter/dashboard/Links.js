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

const ticketStats = "ENTER_URL";
const qKpiURL = "ENTER_URL";
const centralCapacity = "ENTER_URL";

export default function Links() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Active Sprint</Title>
      <Typography component="p" style={{ fontSize: "0.8rem" }}>
        {CURRENT_SPRINT_INFO}
      </Typography>
      {/* variant="h4"<Typography color="textSecondary" className={classes.depositContext}>
        on 15 March, 2019
      </Typography> */}
      <br />
      <br />
      <div>
        <Link
          style={{ color: "grey" }}
          href="ENTER_URL"
          onClick={preventDefault}
        >
          BCP Messages
        </Link>
        <br />
        <Link style={{ color: "grey" }} href="#" onClick={preventDefault}>
          SNOW
        </Link>
        <br />
        <Link
          style={{ color: "grey" }}
          href={ticketStats}
          onClick={preventDefault}
        >
          Ticket Statistics
        </Link>
        <br />
        <Link style={{ color: "grey" }} href={qKpiURL} onClick={preventDefault}>
          Q KPI Scorecards
        </Link>
        <br />
        <Link
          style={{ color: "grey" }}
          href={centralCapacity}
          onClick={preventDefault}
        >
          Central Capacity Sheet
        </Link>
        <br />
      </div>
    </React.Fragment>
  );
}
