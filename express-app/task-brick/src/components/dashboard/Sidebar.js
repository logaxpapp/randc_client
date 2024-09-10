import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  ListSubheader,
  Box,
  Typography,
} from "@mui/material";
import {
  MdOutlineCancel,
  MdOutlineMenu,
  MdExpandLess,
  MdExpandMore,
} from "react-icons/md";
import useThemeSwitcher from "../themes/useThemeSwitcher";
import { links } from "./Links";
import ThemeSelector from "../themes/ThemeSelector";
import { useStateContext } from "../../context/ContextProvider";

const Sidebar = () => {
  const { activeMenu, setActiveMenu } = useStateContext();
  const { currentTheme } = useThemeSwitcher();
  const [openDropdown, setOpenDropdown] = useState({});
  const tenantName = localStorage.getItem(`user.email`) || "Task Brick";

  const toggleDrawer = () => {
    setActiveMenu(!activeMenu);
  };

  const handleClick = (title) => {
    setOpenDropdown((prevOpenDropdown) => ({
      ...prevOpenDropdown,
      [title]: !prevOpenDropdown[title],
    }));
  };


  return (
    <div style={{ backgroundColor: currentTheme.bgColor, minHeight: "120vh" }}>
      <IconButton
        onClick={toggleDrawer}
        sx={{
          color: currentTheme.iconColor,
          position: "absolute",
          top: 42,
          left: activeMenu ? 230 : 200, // Adjust based on the sidebar width when open
          margin: "1rem",
          zIndex: 1000, // Ensure it is above the Drawer's z-index

          "&:hover": {
            backgroundColor: currentTheme.secondaryColor,
            color: currentTheme.primaryColor,
            transform: "scale(1.1)",
            transition: "all 0.3s ease-in-out",
          },
        }}
      >
        {/* Toggle between icons based on activeMenu */}
        {activeMenu ? <MdOutlineCancel /> : <MdOutlineMenu />}
      </IconButton>
      <Drawer
        variant="permanent"
        anchor="left"
        onClose={toggleDrawer}
        open={activeMenu}
        sx={{
          width: activeMenu ? 240 : 0,
          "& .MuiDrawer-paper": {
            width: activeMenu ? 240 : 0,
            backgroundColor: currentTheme.bgColor,
            position: "relative",
          },
        }}
      >
        <List sx={{ mt: 16 }}>
          <ListSubheader
            component="div"
            sx={{
              color: currentTheme.textColor,
              backgroundColor: currentTheme.bgColor,
            }}
          >
            <p style={{ fontWeight: "bold", fontSize: "1rem" }}>
              Task
              <span style={{ color: currentTheme.primaryColor }}>Brick</span>
            </p>
          </ListSubheader>
          <hr
            style={{
              backgroundColor: currentTheme.primaryColor,
              height: "1px",
              border: "none",
            }}
          />
          {links.map((item) => (
            <React.Fragment key={item.title}>
              <ListItem
                button
                onClick={() => handleClick(item.title)}
                sx={{ 
                  mt: 1,
                 }}
              >
                <ListItemText
                  primary={item.title}
                  sx={{
                    fontWeight: "small",
                    color: currentTheme.textColor,
                    fontSize: "0.975rem", // This sets the text size to roughly 14px  
                    color: currentTheme.textColor,
                    letterSpacing: "0.02em", // Slightly spread out the letters for readability
                    textTransform: "capitalize", // Optional: Capitalize each word for a different aesthetic
                    "&:hover": {
                      color: currentTheme.linkColor,
                    },
                  }}
                />

                {openDropdown[item.title] ? (
                  <MdExpandLess style={{ color: currentTheme.textColor }} />
                ) : (
                  <MdExpandMore style={{ color: currentTheme.textColor }} />
                )}
              </ListItem>
              <Collapse
                in={openDropdown[item.title]}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {item.links.map((link) => (
                    <ListItem
                      button
                      key={link.name}
                      component={NavLink}
                      to={`${link.url}`}
                      onClick={toggleDrawer}
                      sx={{ 
                        pl: 2,
                         fontSize: "0.775rem",
                      }} // Indent the sub-items for better visual hierarchy
                    >
                      <ListItemIcon sx={{ color: currentTheme.iconColor }}>
                        {link.icon}
                      </ListItemIcon>
                      <ListItemText
                        sx={{
                          color: currentTheme.textColor,
                          ".MuiTypography-root": {
                            // Targeting the root typography element
                            fontSize: "0.775rem", // This sets the font size to roughly 14px
                            fontWeight: "small", // Adjust the font weight
                            letterSpacing: "0.01em", // Adjust letter spacing for better readability
                            textTransform: "capitalize", // Optional: Capitalize each word for a different aesthetic
                            "&:hover": {
                              color: currentTheme.linkColor,
                            },
                          },
                        }}
                        primary={link.name}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
        <Box
          sx={{
            display: "flex", // Use flexbox to align items in a row
            alignItems: "center", // Center-align items vertically
            justifyContent: "space-between", // Space out the title and selector
            p: 2, // Add some padding
            bgcolor: currentTheme.bgColor, // Use the current theme's background color
            color: currentTheme.textColor, // Use the current theme's text color
            borderBottom: currentTheme.borderBottom, // Add a border to the bottom
            position: "absolute", // Make the sidebar sticky to the top of the screen
            top: 0,

            zIndex: 1000,
          }}
        >
          <Box
            sx={{
              p: 2, // Adds padding
              display: "flex",
              alignItems: "center",
              bgcolor: currentTheme.secondaryColor, // Example: Use the secondary color of the current theme
              color: currentTheme.textColor,
              boxShadow: 1,
              borderRadius: 1,
              mb: 2, // Margin bottom for spacing between sections
            }}
          >
            <ThemeSelector sx={{ color: currentTheme.bgColor, mr: 1 }} />
            <Typography
              variant="subtitle1"
              sx={{
                color: currentTheme.linkColor,
                fontSize: "14px",
                fontWeight: "bold", // Making the text bold
                textTransform: "uppercase", // OPTIONAL: style choice for uppercase text
                letterSpacing: "0.05rem", // Spacing out the letters slightly for better readability
              }}
            >
              Theme Customizer
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default Sidebar;
