import React, { Component } from 'react';

import styles from './styles';
import axios from 'axios';
import config from '../../../config';

import Loading from '../Loading';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { DataGrid } from '@mui/x-data-grid';

export default class Recordings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      filteredData: [],
      disableDeleteRecVidBtn: false,
      vidToBeDeleted: null,
      deleteVidDialogState: false,
    };
  }

  componentDidMount() {
    this.getAllData();
  }

  async deleteVid() {
    this.setState({ deleteVidDialogState: false });
    this.setState({ disableDeleteRecVidBtn: true });

    let name = this.state.vidToBeDeleted;

    const head = {
      headers: {
        authorization: `token ${config.ACCESS_TOKEN_ADMIN}`,
      },
      params: {
        name,
      },
    };

    await axios
      .get(`${config.uri}/admin/deleteVideo`, head)
      .then((e) => {
        if (e.data == 'success') {
          alert('Video Deleted Successfully!');
          this.getAllData();
        } else {
          alert('Something went wrong, try again later!');
        }
        this.setState({ disableDeleteRecVidBtn: false });
      })
      .catch((err) => {
        this.setState({ disableDeleteRecVidBtn: false });
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
      .get(`${config.uri}/admin/sendAllRecordings`, head)
      .then((e) => {
        this.setState({
          data: e.data.data.videos,
          filteredData: e.data.data.videos,
        });
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert('Network Error! Try again later...');
      });
  }

  render() {
    const deleteVidDialog = () => {
      return (
        <div>
          <Dialog
            open={this.state.deleteVidDialogState}
            onClose={() => this.setState({ deleteVidDialogState: false })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {'Please Confirm Your Action!'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this video? This process is not
                reversible.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.setState({ deleteVidDialogState: false })}
              >
                Cancel
              </Button>
              <Button onClick={() => this.deleteVid()} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    };

    const renderActionBtns = (params) => {
      return (
        <strong>
          <Button
            id={`deleteBtn-${params.row._id}`}
            onClick={(e) => {
              this.setState({ deleteVidDialogState: true });
              this.setState({ vidToBeDeleted: params.row.VideoName });
            }}
            variant="contained"
            color="error"
            disabled={this.state.disableDeleteRecVidBtn}
          >
            Delete Video
          </Button>

          <Button
            style={{ marginLeft: 10 }}
            onClick={(e) => {
              window.remote.shell.openExternal(
                `https://aglofficial.com/public/streamVideo?vidName=${params.row.VideoName}`
              );
            }}
            variant="contained"
            color="success"
          >
            Watch
          </Button>
        </strong>
      );
    };

    const columns = [
      {
        field: 'LectureName',
        headerName: 'Recorded From',
        width: 250,
      },
      {
        field: 'Board',
        headerName: 'Board/Edu',
        width: 200,
      },
      {
        field: 'Class',
        headerName: 'Grade/Field',
        width: 200,
      },
      {
        field: 'NameOfTeacher',
        headerName: 'Recorded By',
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

    return (
      <div
        style={{
          ...styles.container,
          width: this.props.drawerState ? `calc(100% - 275px)` : `calc(100%)`,
          overflowX: 'auto',
        }}
      >
        {deleteVidDialog()}

        {this.state.loading && <Loading />}
        {!this.state.loading && (
          <div>
            <p style={styles.headerTxt}>Recorded Videos</p>
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
