import React, { Component } from 'react';

import styles from './styles';

export default class dash extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        style={{
          ...styles.container,
          width: this.props.drawerState
            ? `calc(100% - 280px)`
            : `calc(100% - 5px)`,
        }}
      >
        <h1>test</h1>
      </div>
    );
  }
}
