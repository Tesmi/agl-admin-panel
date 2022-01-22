import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  ListItemIcon,
  createTheme,
} from '@mui/material';

import { Link } from 'react-router-dom';

import {
  Home,
  Group,
  VpnKey,
  School,
  PictureAsPdf,
  LiveTv,
  DeleteSweep,
  NotificationsActive,
  PhonelinkLock,
} from '@mui/icons-material';

const drawerWidth = 275;

const drawerItems = [
  {
    text: 'Dashboard',
    icon: <Home />,
    selected: true,
    route: 'dash',
  },
  {
    text: 'Users',
    icon: <Group />,
    route: 'users',
  },
  {
    text: 'Keys',
    icon: <VpnKey />,
    route: 'keys',
  },
  {
    text: 'Classes',
    icon: <School />,
    route: 'classes',
  },
  {
    text: 'Files',
    icon: <PictureAsPdf />,
    route: 'files',
  },
  {
    text: 'Recordings',
    icon: <LiveTv />,
    route: 'recordings',
  },
  {
    text: 'Recycle Content',
    icon: <DeleteSweep />,
    route: 'recycle',
  },
  {
    text: 'Notifications',
    icon: <NotificationsActive />,
    route: 'notifications',
  },
  // {
  //   text: 'Change Passwords',
  //   icon: <PhonelinkLock />,
  //   route: 'password',
  // },
];

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

        <List disablePadding style={{ width: drawerWidth, paddingTop: 16 }}>
          {drawerItems.map((item, key) => (
            <ListItem
              key={key}
              button
              onClick={(e) => {
                props.changeRoute(item.route);
              }}
            >
              <ListItemIcon className="listIcon" children={item.icon} />
              <ListItemText className="listTxt" primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
