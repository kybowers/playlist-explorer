import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import Dashboard from "./Components/Dashboard";
import apiService from "./Services/apiService";

const client_id = "dea2db6618114b038ae3fd02284a8bde";
const response_type = "token";
const redirect_uri = "http://localhost:3000/app";

function Redirect() {
  window.location.href = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}`;
  return null;
}

function App() {
  return (<ThemeProvider theme={theme}>
    <Router>
      
      <Switch>
        <Route
          path="/login"
          component={() => {
            window.location.href = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}`;
            return null;
          }}
        />
        <Route path="/app" component={AppWrapper} />
        <Route path="/" component={AppWrapper} />
      </Switch>
    </Router></ThemeProvider>
  );
}

const AppWrapper = props => {
  const hashObject = props.location.pathname
    .substr(1)
    .split("&")
    .map(v => v.split("="))
    .reduce((pre, [key, value]) => ({ ...pre, [key]: value }), {});
  if (hashObject["access_token"]) {
    apiService.updateAuth(hashObject["access_token"]);
    return <Dashboard />;
  } else {
    return <Redirect />
  }
};

export default App;
