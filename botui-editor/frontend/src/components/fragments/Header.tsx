import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import ListItemText from "@mui/material/ListItemText";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";
type Anchor = "top" | "left" | "bottom" | "right";

export default function SwipeableTemporaryDrawer() {
  let { logoutUser } = useContext(AuthContext);
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  return (
    <div>
      <React.Fragment>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" style={{ backgroundColor: "#740080" }}>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer("left", true)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <img
                  src={`${process.env.REACT_APP_LOCAL_URL}/assets/images/logo.png`}
                  alt="novacept logo"
                  width={200}
                />
              </Typography>
              <Button color="inherit" onClick={logoutUser}>
                Logout
              </Button>
            </Toolbar>
          </AppBar>
        </Box>
        <SwipeableDrawer
          open={state["left"]}
          onClose={toggleDrawer("left", false)}
          onOpen={toggleDrawer("left", true)}
        >
          <Box sx={{ width: 350 }} role="presentation">
            <List>
              <ListItem style={{ borderBottom: "1px solid black" }}>
                <Link to="/dashboard">
                  <ListItemButton
                    onClick={toggleDrawer("left", false)}
                    onKeyDown={toggleDrawer("left", false)}
                  >
                    <ListItemIcon>
                      <SettingsSuggestIcon />
                    </ListItemIcon>
                    <ListItemText>UI General Settings</ListItemText>
                  </ListItemButton>
                </Link>
              </ListItem>
              <ListItem style={{ borderBottom: "1px solid black" }}>
                <Link to="/general-botstyle">
                  <ListItemButton
                    onClick={toggleDrawer("left", false)}
                    onKeyDown={toggleDrawer("left", false)}
                  >
                    <ListItemIcon>
                      <AnnouncementIcon />
                    </ListItemIcon>
                    <ListItemText>Attention Graber Settings</ListItemText>
                  </ListItemButton>
                </Link>
              </ListItem>
              <ListItem style={{ borderBottom: "1px solid black" }}>
                <Link to="/general-theme">
                  <ListItemButton
                    onClick={toggleDrawer("left", false)}
                    onKeyDown={toggleDrawer("left", false)}
                  >
                    <ListItemIcon>
                      <ColorLensIcon />
                    </ListItemIcon>
                    <ListItemText>Theme Settings</ListItemText>
                  </ListItemButton>
                </Link>
              </ListItem>
            </List>
            <footer>
              Powerd by <b className="company-name">Novacept</b>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;App Version{" "}
              <b>{process.env.REACT_APP_APP_VER}</b>
            </footer>
          </Box>
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
