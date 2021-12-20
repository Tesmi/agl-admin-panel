import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';

import TitleBar from 'components/TitleBar/TitleBar';
import SideBar from 'components/Sidebar/Sidebar';

import Dash from 'components/Dashboard/Dash';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDrawer: false,
    };
  }

  render() {
    return (
      <Router>
        <TitleBar
          toggleSidebar={() =>
            this.setState({ openDrawer: !this.state.openDrawer })
          }
        />
        <SideBar
          toggleSidebar={() =>
            this.setState({ openDrawer: !this.state.openDrawer })
          }
          drawerState={this.state.openDrawer}
        />
        <Switch>
          <Route
            path="/"
            component={() => <Dash drawerState={this.state.openDrawer} />}
          />
        </Switch>
      </Router>
    );
  }
}
