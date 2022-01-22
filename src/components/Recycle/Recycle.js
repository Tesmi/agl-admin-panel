import React, { Component } from 'react';

import styles from './styles';
import axios from 'axios';
import config from '../../../config';
import Loading from '../Loading';

import { DataGrid } from '@mui/x-data-grid';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';

export default class Recycle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      filteredData: [],
      deleteDialogState: false,
      recycleToBeDeleted: null,
      deleteBtnDisabled: false,
    };
  }

  componentDidMount() {
    this.getAllData();
  }

  searchDebounce(txt) {
    let timeout;
    let delay = 300;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      this.performSearch(txt);
    }, delay);
  }

  performSearch(query) {
    let txt = query.toLowerCase();
    let filteredData = this.state.data.filter(function (item) {
      return (
        item.Description.toLowerCase().includes(txt) ||
        item.Board.toLowerCase().includes(txt) ||
        item.Class.toLowerCase().includes(txt) ||
        item.PostedBy.toLowerCase().includes(txt) ||
        item.Date.toLowerCase().includes(txt)
      );
    });
    this.setState({ filteredData });
  }

  async getAllData() {
    this.setState({ loading: true });

    const head = {
      headers: {
        authorization: `token ${config.ACCESS_TOKEN_ADMIN}`,
      },
    };

    await axios
      .get(`${config.uri}/admin/sendRecycleData`, head)
      .then((e) => {
        if (e.data.data.recycle) {
          for (var i = 0, l = e.data.data.recycle.length; i < l; i++) {
            let date = e.data.data.recycle[i].Date;
            e.data.data.recycle[i].Date = new Date(
              parseInt(date) + 5.5 * 60 * 60 * 1000
            ).toUTCString();
          }
          this.setState({
            data: e.data.data.recycle,
            filteredData: e.data.data.recycle,
          });
        }
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert('Network Error! Try again later...');
      });
  }

  async deleteContent() {
    this.setState({ deleteDialogState: false });
    this.setState({ deleteBtnDisabled: true });

    let id = this.state.recycleToBeDeleted;

    const head = {
      headers: {
        authorization: `token ${config.ACCESS_TOKEN_ADMIN}`,
      },
      params: {
        id,
      },
    };

    await axios
      .get(`${config.uri}/admin/deleteContent`, head)
      .then((e) => {
        if (e.data == 'success') {
          alert('Content Deleted Successfully!');
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
              this.setState({ deleteDialogState: true });
              this.setState({ recycleToBeDeleted: params.row._id });
            }}
            variant="contained"
            color="error"
            disabled={this.state.deleteBtnDisabled}
          >
            Delete
          </Button>

          <Button
            style={{ marginLeft: 10 }}
            onClick={(e) => {
              window.remote.shell.openExternal(
                `https://youtu.be/${params.row.VideoUrl}`
              );
            }}
            variant="contained"
            color="success"
          >
            View
          </Button>
        </strong>
      );
    };

    const deleteDialog = () => {
      return (
        <div>
          <Dialog
            open={this.state.deleteDialogState}
            onClose={() => this.setState({ deleteDialogState: false })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {'Please Confirm Your Action!'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this content? This process is
                not reversible.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.setState({ deleteDialogState: false })}
              >
                Cancel
              </Button>
              <Button onClick={() => this.deleteContent()} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    };

    const columns = [
      {
        field: 'PostedBy',
        headerName: 'Posted By',
        width: 150,
      },
      {
        field: 'Description',
        headerName: 'Description',
        width: 350,
      },
      {
        field: 'Board',
        headerName: 'Board/Edu',
        width: 150,
      },

      {
        field: 'Class',
        headerName: 'Grade/Field',
        width: 150,
      },
      {
        field: 'Date',
        headerName: 'Posted On',
        width: 250,
      },
      {
        field: 'Action',
        headerName: 'Actions',
        width: 200,
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
        {deleteDialog()}
        {this.state.loading && <Loading />}
        <p style={styles.headerTxt}>Recycle Content</p>
        <div style={styles.searchContainer}>
          <TextField
            onChange={(e) => this.searchDebounce(e.target.value)}
            size="small"
            fullWidth
            label="Search Users"
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
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
    );
  }
}
