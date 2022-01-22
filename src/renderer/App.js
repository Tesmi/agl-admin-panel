import React from 'react';

import './App.global.css';

import TitleBar from 'components/TitleBar/TitleBar';
import SideBar from 'components/Sidebar/Sidebar';

import Dash from 'components/Dashboard/Dash';
import Users from 'components/Users/Users';
import Keys from 'components/Keys/Keys';
import Classes from 'components/Classes/Classes';
import Recordings from 'components/Recordings/Recordings';
import Files from 'components/Files/Files';
import Recycle from 'components/Recycle/Recycle';
import Notifications from 'components/Notifications/Notifications';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDrawer: true,
      component: 'dash',
    };
  }
  render() {
    return (
      <div>
        <TitleBar
          toggleSidebar={() =>
            this.setState({ openDrawer: !this.state.openDrawer })
          }
        />
        <SideBar
          toggleSidebar={() =>
            this.setState({ openDrawer: !this.state.openDrawer })
          }
          changeRoute={(e) => this.setState({ component: e })}
          drawerState={this.state.openDrawer}
        />

        {this.state.component == 'dash' && (
          <Dash drawerState={this.state.openDrawer} />
        )}

        {this.state.component == 'users' && (
          <Users drawerState={this.state.openDrawer} />
        )}

        {this.state.component == 'keys' && (
          <Keys drawerState={this.state.openDrawer} />
        )}

        {this.state.component == 'classes' && (
          <Classes drawerState={this.state.openDrawer} />
        )}

        {this.state.component == 'recordings' && (
          <Recordings drawerState={this.state.openDrawer} />
        )}

        {this.state.component == 'files' && (
          <Files drawerState={this.state.openDrawer} />
        )}

        {this.state.component == 'recycle' && (
          <Recycle drawerState={this.state.openDrawer} />
        )}

        {this.state.component == 'notifications' && (
          <Notifications drawerState={this.state.openDrawer} />
        )}
      </div>
    );
  }
}
