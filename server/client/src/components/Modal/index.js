import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Modal as MuiModal, IconButton, Icon } from "@mui/material";
import Color from "color";
import OptionMenu from "components/OptionMenu";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#131a0f",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: 3,
  p: 5,
  maxHeight: "90vh",
  overflow: "auto",
};

export default function Modal({
  button,
  children,
  width = 500,
  forceOpen = false,
  onOpen = () => {},
  onClose = () => {},
  menu = false,
  ...rest
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    onOpen();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    onClose();
  };
  React.useEffect(() => setOpen(forceOpen), [forceOpen]);

  return (
    <div>
      {button ? React.createElement(button, { onClick: handleOpen }) : null}
      <MuiModal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal"
        aria-describedby="modal"
        {...rest}
      >
        <Box sx={{ ...style, width }}>
          {!!menu ? (
            <OptionMenu
              sx={{
                position: "absolute",
                right: "50px",
                top: "10px",
              }}
              icon="more_vert"
              options={menu}
            />
          ) : null}

          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: "10px",
              top: "10px",
            }}
            color="error"
          >
            <Icon color="error">close</Icon>
          </IconButton>
          {children({ handleClose })}
        </Box>
      </MuiModal>
    </div>
  );
}
