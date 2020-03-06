import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import Homepage from "./Components/Homepage";

class App extends React.Component {
  componentWillMount() {
    this.startErrorLog();
  }
  startErrorLog() {
    window.onerror = (message, file, line, column, errorObject) => {
      const data = {
        message: message,
        file: file,
        line: line,
        column: column || (window.event && window.event.errorCharacter),
        errorStack: errorObject ? errorObject.stack : null
      };
      try {
        fetch('https://vssyekzubf.execute-api.us-east-1.amazonaws.com/idk', {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            'X-API-Key': 'FBJXcA81f281mWOqot85U2gVwzzwxfiT9jstc6G0',
            'Origin': null
          }
        })
      } catch (error) {
        console.log('Filed to log error to server');
      }
      // allow the error to continue as usual
      return false;
    };
  }
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Homepage />
      </ThemeProvider>
    );
  }
}

export default App;
