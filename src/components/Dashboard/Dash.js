import React, { Component } from 'react';

import styles from './styles';
import axios from 'axios';
import config from '../../../config';
import Loading from '../Loading';
import { PieChart } from 'react-minimal-pie-chart';

export default class dash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dbSize: 0,
      fullSize: 0,
      totalTeachers: 0,
      totalStudents: 0,
      videosSize: 0,
    };
  }

  componentDidMount() {
    this.getAllData();
  }

  async getAllData() {
    this.setState({ loading: true });
    const head = {
      headers: {
        authorization: `token ${config.ACCESS_TOKEN_ADMIN}`,
      },
    };

    console.log('before then');

    await axios
      .get(`${config.uri}/admin/sendDashData`, head)
      .then((e) => {
        console.log('after then');
        this.setState({
          dbSize: e.data.stats.dbSize,
          fullSize: e.data.stats.fullSize,
          totalStudents: e.data.stats.totalStudents,
          totalTeachers: e.data.stats.totalTeachers,
          videosSize: e.data.stats.videosSize,
        });
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert('Network Error! Try again later...');
      });
  }

  render() {
    return (
      <div
        style={{
          ...styles.container,
          width: this.props.drawerState ? `calc(100% - 275px)` : `calc(100%)`,
        }}
      >
        {this.state.loading && <Loading />}
        {!this.state.loading && (
          <div>
            <p style={styles.headerTxt}>Dashboard</p>
            <div style={styles.statsContainer}>
              <div>
                <p style={styles.heading}>Database Used</p>
                <div style={{ width: 200, height: 200, marginBottom: 20 }}>
                  <PieChart
                    data={[
                      {
                        title: 'One',
                        value: this.state.dbSize,
                        color: '#C13C37',
                      },
                      {
                        title: 'Two',
                        value: this.state.fullSize,
                        color: 'green',
                      },
                    ]}
                  />
                </div>
              </div>
              <div>
                <p style={styles.heading}>Recorded Videos Size</p>
                <h3 style={{ color: 'red' }}>
                  {this.state.videosSize.toPrecision(2)} MB / 170 GB
                </h3>
              </div>
            </div>
            <div style={styles.userStatsContainer}>
              <div>
                <h2 style={{ color: 'teal' }}>Total Students</h2>
                <p style={styles.noOfUsers}>{this.state.totalStudents}</p>
              </div>
              <div>
                <h2 style={{ color: 'teal' }}>Total Teachers</h2>
                <p style={styles.noOfUsers}>{this.state.totalTeachers}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
