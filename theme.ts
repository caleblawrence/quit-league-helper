import { createMuiTheme } from "@material-ui/core/styles";
import { purple } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    background: {
      default: "rgba(0, 0, 0, 1)",
    },
    type: "dark",
    primary: {
      // Purple and green play nicely together.
      main: "#ec407a",
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#11cb5f",
    },
  },
});
export default theme;
