import React from 'react';
import { CircularProgress } from '@mui/material';

export default class Loading extends React.Component {
  render() {
    return (
      <div style={styles.loadingContainer}>
        <CircularProgress />
        <p style={styles.loadingTxt}>Loading...</p>
      </div>
    );
  }
}

const styles = {
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    height: '100%',
  },

  loadingTxt: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
};
