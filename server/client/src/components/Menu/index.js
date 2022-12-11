import React, { useRef, useState } from "react";
import { Icon, IconButton } from "@mui/material";
import Popover from "components/Menu/components/Popover";
import ClickAwayListener from "@mui/material/ClickAwayListener";

export default function Menu({ sx = {}, width, icon, children }) {
  const popover = useRef(null);
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={() => setOpen(!open)}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
            },
          }),
          ...sx,
        }}
      >
        <Icon>{icon}</Icon>
      </IconButton>
      <Popover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: width || 220 }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          {children({ handleClose })}
        </ClickAwayListener>
      </Popover>
    </>
  );
}
