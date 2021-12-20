import React, { useState } from 'react';
import {
  Button,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 275;

const Sidebar = (props) => {
  return (
    <div>
      <CssBaseline />
      <Drawer
        variant="persistent"
        open={props.drawerState}
        onClose={() => props.toggleSidebar()}
      >
        <div style={{ height: 40 }}></div>
        <List disablePadding style={{ width: drawerWidth }}>
          <ListItem button>
            <ListItemText primary="First Item" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Second Item" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
