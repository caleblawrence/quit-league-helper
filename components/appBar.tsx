import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Link from "next/link";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Button color="inherit">
            <Link href="/">Sign up</Link>
          </Button>
          <Button color="inherit">
            <Link href="/leaderboard">Leaderboard</Link>
          </Button>
        </Toolbar>
      </AppBar>

      <style jsx>{`
        a {
          color: white;
          text-decoration: none !important; /* no underline */
        }
      `}</style>
    </div>
  );
}
