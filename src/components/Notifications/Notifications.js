import React, { Component } from 'react';

import styles from './styles';
import axios from 'axios';
import config from '../../../config';
import { DataGrid } from '@mui/x-data-grid';

import Loading from '../Loading';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      filteredData: [],
      deleteBtnDisabled: false,
      notiToBeDeleted: null,
      showDeleteDialog: false,
    };
  }

  componentDidMount() {
    this.getAllData();
  }

  async deleteNoti() {
    this.setState({ showDeleteDialog: false });
    this.setState({ deleteBtnDisabled: true });

    let id = this.state.notiToBeDeleted;

    const head = {
      headers: {
        authorization: `token ${config.ACCESS_TOKEN_ADMIN}`,
      },
      params: {
        id,
      },
    };

    await axios
      .get(`${config.uri}/admin/deleteNotification`, head)
      .then((e) => {
        if (e.data == 'success') {
          alert('Notification Deleted Successfully!');
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

  async getAllData() {
    this.setState({ loading: true });
    const head = {
      headers: {
        authorization: `token ${config.ACCESS_TOKEN_ADMIN}`,
      },
    };

    await axios
      .get(`${config.uri}/admin/sendAllNotiData`, head)
      .then((e) => {
        if (e.data.data.noti)
          this.setState({
            data: e.data.data.noti,
            filteredData: e.data.data.noti,
          });
        else {
          this.setState({
            data: [],
            filteredData: [],
          });
        }
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
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
              this.setState({ showDeleteDialog: true });
              this.setState({ notiToBeDeleted: params.row._id });
            }}
            variant="contained"
            color="error"
            disabled={this.state.deleteBtnDisabled}
          >
            Delete
          </Button>
        </strong>
      );
    };

    const deleteNotiDialog = () => {
      return (
        <div>
          <Dialog
            open={this.state.showDeleteDialog}
            onClose={() => this.setState({ showDeleteDialog: false })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {'Please Confirm Your Action!'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this notification? This process
                is not reversible.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.setState({ showDeleteDialog: false })}
              >
                Cancel
              </Button>
              <Button onClick={() => this.deleteNoti()} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    };

    const columns = [
      {
        field: 'By',
        headerName: 'Posted By',
        width: 150,
      },
      {
        field: 'Subject',
        headerName: 'Subject',
        width: 250,
      },
      {
        field: 'Description',
        headerName: 'Description',
        width: 400,
      },

      {
        field: 'Board',
        headerName: 'Board/Edu',
        width: 150,
      },

      {
        field: 'ClassData',
        headerName: 'Grade/Field',
        width: 150,
      },
      {
        field: 'Action',
        headerName: 'Actions',
        width: 150,
        renderCell: renderActionBtns,
        disableClickEventBubbling: true,
      },
    ];

    return (
      <div
        style={{
          ...styles.container,
          width: this.props.drawerState ? `calc(100% - 275px)` : `calc(100%)`,
          overflowX: 'auto',
        }}
      >
        {deleteNotiDialog()}
        {this.state.loading && <Loading />}

        {!this.state.loading && (
          <div>
            <p style={styles.headerTxt}>Notifications</p>
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
