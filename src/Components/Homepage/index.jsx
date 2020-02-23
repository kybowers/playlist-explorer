import React, { useState } from "react";
import { ipcRenderer } from "electron";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import MyPlaylists from "../MyPlaylists";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 48,
    marginTop: 40
  },
  submit: {
    marginTop: 48 
  }
}));

const Homepage = props => {
  const [token, setToken] = useState(null);
  const classes = useStyles();

  ipcRenderer.on("access-granted", (event, arg) => {
    setToken("Bearer " + arg);
  });

  const handleLoginClick = () => {
    ipcRenderer.send("spotify-authenticate", "yes");
  };

  return (
    <Container component="main" className={classes.root}>
      {token ? (
        <MyPlaylists token={token} />
      ) : (
        <Paper className={classes.paper}>
          <Typography variant="h4">Welcome to the playlist explorer tool for Spotify</Typography>
          <Typography variant="body1">Sign in to Spotify to view your playlists</Typography>
          <Button onClick={handleLoginClick} variant="contained" color="primary" className={classes.submit}>
            Sign In With Spotify
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default Homepage;
