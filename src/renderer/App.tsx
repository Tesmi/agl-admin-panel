import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';

import TitleBar from 'components/TitleBar/TitleBar';

const Hello: any = () => {
  return <TitleBar />;
};

export default function App(): any {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
