import React, { useState } from "react";
import { ipcRenderer } from "electron";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import MyPlaylists from "../MyPlaylists";

const useStyles = makeStyles(theme => ({
  formArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    marginTop: 50
  },
  form: {
    marginTop: 20,
    marginBottom: 20
  },
  submit: {
    marginTop: 20
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
    <Container component="main">
      {token ? (
        <MyPlaylists token={token} />
      ) : (
        <div className={classes.formArea} elevation={2}>
          <Typography variant="h4">Welcome to Dotify</Typography>
          <Button onClick={handleLoginClick} variant="contained" color="primary" className={classes.submit}>
            Sign In With Spotify
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Homepage;
