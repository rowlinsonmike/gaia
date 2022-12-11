import { CssBaseline } from "@mui/material";
import {
  ThemeProvider,
  createTheme,
  StyledEngineProvider,
} from "@mui/material/styles";

const themeOptions = {
  palette: {
    action: {
      disabled: "grey",
    },
    type: "light",
    primary: {
      main: "#131a0f",
      light: "#131A0F",
      dark: "#131A0F",
      contrastText: "#f8f8ff",
    },
    secondary: {
      main: "#75D701",
      light: "#75D701",
      dark: "#75D701",
      contrastText: "#131a0f",
    },
    background: {
      default: "#131A0F",
      paper: "#131A0F",
    },
    text: {
      primary: "#f8f8ff",
      secondary: "rgba(239,237,239,0.8)",
      disabled: "rgba(239,237,239,0.6)",
      hint: "rgba(239,237,239,0.38)",
    },
  },
  components: {
    MuiIcon: {
      defaultProps: {
        color: "secondary",
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#f8f8ff",
          "&:active": {
            color: "#f8f8ff",
          },
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        MenuProps: {
          style: { zIndex: 35001 },
        },
      },
      styleOverrides: {
        root: {
          background: "#131a0f !important",
          color: "#f8f8ff !important",
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
    h1: {
      fontFamily: '"Roboto", sans-serif',
    },
    h2: {
      fontFamily: '"Roboto", sans-serif',
    },
    h3: {
      fontFamily: '"Roboto", sans-serif',
    },
    h4: {
      fontFamily: '"Roboto", sans-serif',
    },
    h5: {
      fontFamily: '"Roboto", sans-serif',
    },
    h6: {
      fontFamily: '"Roboto", sans-serif',
    },
    button: {
      fontFamily: '"Roboto", sans-serif',
    },
    caption: {
      fontFamily: '"Roboto", sans-serif',
    },
    overline: {
      fontFamily: '"Roboto", sans-serif',
    },
  },
};
export const theme = themeOptions;
const Theme = ({ children }) => {
  const theme = createTheme(themeOptions);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default Theme;
