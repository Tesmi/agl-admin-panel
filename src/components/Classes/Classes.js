import React, { Component } from 'react';

import ClipboardJS from 'clipboard';

import styles from './styles';
import axios from 'axios';
import config from '../../../config';

import { DataGrid } from '@mui/x-data-grid';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Loading from '../Loading';

export default class Classes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      filteredData: [],
      deleteBtnDisabled: false,
      classToBeDeleted: null,
      showDeleteClassDialog: false,
    };
  }

  componentDidMount() {
    this.getAllData();
  }

  async getAllData() {
    this.setState({ loading: true, data: [], filteredData: [] });
    const head = {
      headers: {
        authorization: `token ${config.ACCESS_TOKEN_ADMIN}`,
      },
    };

    await axios
      .get(`${config.uri}/admin/sendAllClasses`, head)
      .then((e) => {
        if (e.data.data.classes) {
          for (var i = 0, l = e.data.data.classes.length; i < l; i++) {
            const istTimeOffset = 5.5 * 60 * 60 * 1000;

            let startDate = e.data.data.classes[i].Start;
            let endDate = e.data.data.classes[i].End;
            e.data.data.classes[i].Start = new Date(
              parseInt(startDate) + istTimeOffset
            ).toUTCString();
            e.data.data.classes[i].End = new Date(
              parseInt(endDate) + istTimeOffset
            ).toUTCString();
          }
          this.setState({
            data: e.data.data.classes,
            filteredData: e.data.data.classes,
          });
        }
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert('Network Error! Try again later...');
      });
  }

  async deleteClass() {
    this.setState({ showDeleteClassDialog: false });
    this.setState({ deleteBtnDisabled: true });

    let id = this.state.classToBeDeleted;

    const head = {
      headers: {
        authorization: `token ${config.ACCESS_TOKEN_ADMIN}`,
      },
      params: {
        id,
      },
    };

    await axios
      .get(`${config.uri}/admin/deleteClass`, head)
      .then((e) => {
        if (e.data == 'success') {
          alert('Class Descheduled Successfully!');
          this.getAllData();
        } else {
          alert('Something went wrong, try again later!');
        }
        this.setState({ deleteBtnDisabled: false });
      })
      .catch((err) => {
        this.setState({ deleteBtnDisabled: false });
        alert('Network Error! Try again later...');
      });
  }

  render() {
    const renderActionBtns = (params) => {
      return (
        <strong>
          <Button
            id={`deleteBtn-${params.row._id}`}
            onClick={(e) => {
              this.setState({ showDeleteClassDialog: true });
              this.setState({ classToBeDeleted: params.row._id });
            }}
            variant="contained"
            color="error"
            disabled={this.state.deleteBtnDisabled}
          >
            Deschedule
          </Button>

          <Button
            style={{ marginLeft: 10 }}
            onClick={(e) => {
              window.remote.shell.openExternal(params.row.URL);
            }}
            variant="contained"
            color="success"
          >
            Join
          </Button>
        </strong>
      );
    };

    const columns = [
      {
        field: 'LectureName',
        headerName: 'Lecture Name',
        width: 150,
      },
      {
        field: 'Board',
        headerName: 'Board/Edu',
        width: 200,
      },
      {
        field: 'ClassData',
        headerName: 'Class/Field',
        width: 150,
      },
      {
        field: 'Start',
        headerName: 'Starting Time',
        width: 300,
      },

      {
        field: 'End',
        headerName: 'Ending Time',
        width: 300,
      },

      {
        field: 'By',
        headerName: 'Scheduled By',
        width: 200,
      },
      {
        field: 'Action',
        headerName: 'Actions',
        width: 250,
        renderCell: renderActionBtns,
        disableClickEventBubbling: true,
      },
    ];

    const deleteClassDialog = () => {
      return (
        <div>
          <Dialog
            open={this.state.showDeleteClassDialog}
            onClose={() => this.setState({ showDeleteClassDialog: false })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {'Please Confirm Your Action!'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to deschedule this class? This process is
                not reversible.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.setState({ showDeleteClassDialog: false })}
              >
                Cancel
              </Button>
              <Button onClick={() => this.deleteClass()} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    };

    return (
      <div
        style={{
          ...styles.container,
          width: this.props.drawerState ? `calc(100% - 275px)` : `calc(100%)`,
          overflowX: 'auto',
        }}
      >
        {deleteClassDialog()}
        {this.state.loading && <Loading />}
        {!this.state.loading && (
          <div>
            <p style={styles.headerTxt}>Scheduled Classes</p>
            <div style={styles.tableContainer}>
              <DataGrid
                rows={this.state.filteredData}
                columns={columns}
                getRowId={(row) => row._id}
                pageSize={100}
                rowsPerPageOptions={[15, 50, 100]}
                autoHeight={true}
                disableSelectionOnClick
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
