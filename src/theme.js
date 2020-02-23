import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main:'#e246ab',
    },
    secondary: {
      main: '#46e2b3'
    },
  },
  status: {
    danger: 'orange',
  },
});

export default theme;