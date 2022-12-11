import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiTextField from "@mui/material/TextField";
import { theme } from "theme";

const CssTextField = styled(MuiTextField)({
  background: "#262626",
  borderRadius: "7px",
  color: "rgba(239,237,239,0.87) !important",
  "& label.Mui-focused": {
    color: theme.palette.secondary.main,
  },
  "& .MuiInputLabel-root": {
    color: "rgba(239,237,239,0.87) !important",
  },
  "& .MuiOutlinedInput-input": {
    color: "rgba(239,237,239,0.87) !important",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: theme.palette.secondary.main,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.primary.main,
    },
    // "&:hover fieldset": {
    //   borderColor: theme.palette.secondary.main,
    // },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.secondary.main,
    },
  },
});

export default React.forwardRef(function Input(props, ref) {
  return (
    <CssTextField
      InputLabelProps={{ shrink: true }}
      autoComplete="off"
      {...props}
      ref={ref}
    />
  );
});
