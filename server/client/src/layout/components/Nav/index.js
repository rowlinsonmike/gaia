import { useState, useEffect } from "react";
import {
  NavLink as RouterLink,
  matchPath,
  useLocation,
} from "react-router-dom";
import { alpha, useTheme, styled } from "@mui/material/styles";
import {
  Box,
  List,
  Collapse,
  ListItemButton,
  Icon,
  Typography,
  Avatar,
} from "@mui/material";

const ListItemStyle = styled((props) => (
  <ListItemButton disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  marginTop: "10px",
  position: "relative",
  textTransform: "capitalize",
  color: theme.palette.text.secondary,
  "&:before": {
    top: 0,
    right: 0,
    width: 3,
    bottom: 0,
    content: "''",
    display: "none",
    position: "absolute",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: theme.palette.primary.main,
  },
}));

const ListItemIconStyle = styled(Icon)({
  width: 40,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

function NavItem({ item, active, drawerOpen }) {
  const theme = useTheme();
  const isActiveRoot = active(item.path);
  const { title, path, icon, children } = item;
  const [open, setOpen] = useState(isActiveRoot);
  useEffect(() => {
    setOpen(isActiveRoot);
  }, [isActiveRoot, active]);
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const activeRootStyle = {
    color: "secondary.main",
    fontWeight: "fontWeightMedium",
    bgcolor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity
    ),
    "&:before": { display: "block" },
  };

  const closedDrawer = {
    paddingLeft: 0,
    paddingRight: 0,
    display: "flex",
    justifyContent: "center",
  };
  const openDrawer = {
    pl: 2.5,
  };
  if (children) {
    return (
      <>
        <ListItemStyle
          onClick={handleOpen}
          sx={{
            ...(!drawerOpen ? closedDrawer : openDrawer),
          }}
        >
          <Avatar
            sx={
              isActiveRoot
                ? { border: "#75D701 3px solid", width: 40, height: 40 }
                : {}
            }
          >
            <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
          </Avatar>

          {drawerOpen ? (
            <Typography sx={{ fontSize: ".9rem", ml: 1 }} variant="overline">
              {title}
            </Typography>
          ) : null}
          {drawerOpen ? (
            <Box component={Icon} sx={{ width: 22, height: 22, ml: 1 }}>
              {!open ? "expand_more" : "expand_less"}
            </Box>
          ) : null}
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((item) => {
              const { title, path, icon } = item;
              return (
                <ListItemStyle
                  key={title}
                  component={RouterLink}
                  to={path}
                  sx={{
                    ...(!drawerOpen ? closedDrawer : openDrawer),
                    ...(isActiveRoot && activeRootStyle),
                  }}
                >
                  <Avatar
                    sx={
                      isActiveRoot
                        ? { border: "#75D701 3px solid", width: 40, height: 40 }
                        : {}
                    }
                  >
                    <ListItemIconStyle
                      sx={{ ...(drawerOpen && { pl: 1, mr: 1 }) }}
                    >
                      {icon && icon}
                    </ListItemIconStyle>
                  </Avatar>

                  {drawerOpen ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography sx={{ fontSize: ".9rem" }} variant="overline">
                        {title}
                      </Typography>
                    </span>
                  ) : null}
                </ListItemStyle>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <ListItemStyle
      component={RouterLink}
      to={path}
      sx={{
        ...(!drawerOpen ? closedDrawer : openDrawer),
        ...(isActiveRoot && activeRootStyle),
      }}
    >
      <Avatar
        sx={
          isActiveRoot
            ? { border: "#75D701 3px solid", width: 40, height: 40 }
            : {}
        }
      >
        <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
      </Avatar>
      {drawerOpen ? (
        <Typography sx={{ fontSize: ".9rem", ml: 1 }} variant="overline">
          {title}
        </Typography>
      ) : null}
    </ListItemStyle>
  );
}

export default function NavSection({ navs, drawerOpen, ...other }) {
  const { pathname } = useLocation();
  const match = (path) =>
    path ? !!matchPath({ path, end: false }, pathname) : false;

  return (
    <Box {...other}>
      <List disablePadding>
        {navs.map((item) => (
          <NavItem
            drawerOpen={drawerOpen}
            key={item.title}
            item={item}
            active={match}
          />
        ))}
      </List>
    </Box>
  );
}
