import React from "react";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  formArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    marginTop: 50,
  },
  form: {
    marginTop: 20,
    marginBottom: 20,
  },
  submit: {
    marginTop: 20
  }
}));

const Login = props => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.formArea} elevation={2}>
        <Typography variant="h4">Sign in</Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Login;
