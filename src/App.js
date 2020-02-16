import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import Homepage from "./Components/Homepage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Homepage />
    </ThemeProvider>
  );
}

export default App;
