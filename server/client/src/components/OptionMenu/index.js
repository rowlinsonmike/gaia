import * as React from "react";
import Icon from "@mui/material/Icon";
import { Menu as MUIMenu, Box } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Menu from "components/Menu";

const ITEM_HEIGHT = 60;

export default function OptionMenu({
  options,
  icon = "menu",
  color = "secondary",
  width,
  sx = {},
}) {
  return (
    <Menu width={width} sx={sx} icon={icon}>
      {({ handleClose }) => (
        <Box sx={{ pointerEvents: "auto !important" }} p={1}>
          {options.map(([icon, option, handler, Wrapper, disabled]) => {
            const Render = ({ children }) =>
              Wrapper ? <Wrapper>{children}</Wrapper> : <>{children}</>;
            return (
              <Render key={option}>
                <MenuItem
                  sx={{
                    pointerEvents: "auto !important",
                  }}
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) return;
                    handler();
                    handleClose();
                  }}
                >
                  <Icon color={color} sx={{ mr: 1 }}>
                    {icon}
                  </Icon>
                  {option}
                </MenuItem>
              </Render>
            );
          })}
        </Box>
      )}
    </Menu>
  );
}
