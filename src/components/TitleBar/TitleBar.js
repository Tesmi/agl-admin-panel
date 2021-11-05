import React, { Component } from 'react';

import styles from './styles';

export default class TitleBar extends Component {
  render() {
    return <div className="draggable" style={styles.titleBar}></div>;
  }
}
