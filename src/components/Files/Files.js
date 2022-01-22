import React, { Component } from 'react';

import styles from './styles';
import axios from 'axios';
import config from '../../../config';

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

import { DataGrid } from '@mui/x-data-grid';

import Loading from '../Loading';

export default class Files extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      filteredData: [],
      disableDeleteFilesBtn: false,
      fileToBeDeleted: null,
      deleteFileDialogState: false,
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
        item.CreatedBy.toLowerCase().includes(txt) ||
        item.FileName.toLowerCase().includes(txt) ||
        item.Board.toLowerCase().includes(txt) ||
        item.ClassName.toLowerCase().includes(txt) ||
        item.Description.toLowerCase().includes(txt) ||
        item.Date.toLowerCase().includes(txt)
      );
    });
    this.setState({ filteredData });
  }

  async deleteFile() {
    this.setState({ deleteFileDialogState: false });
    this.setState({ disableDeleteFilesBtn: true });

    let name = this.state.fileToBeDeleted;

    const head = {
      headers: {
        authorization: `token ${config.ACCESS_TOKEN_ADMIN}`,
      },
      params: {
        name,
      },
    };

    await axios
      .get(`${config.uri}/admin/deleteFile`, head)
      .then((e) => {
        if (e.data.status) {
          alert('File Deleted Successfully!');
          this.getAllData();
        } else {
          alert('Something went wrong, try again later!');
        }
        this.setState({ disableDeleteFilesBtn: false });
      })
      .catch((err) => {
        this.setState({ disableDeleteFilesBtn: false });
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
      .get(`${config.uri}/admin/sendAllFiles`, head)
      .then((e) => {
        if (e.data.data.files) {
          for (var i = 0, l = e.data.data.files.length; i < l; i++) {
            let date = e.data.data.files[i].Date;
            e.data.data.files[i].Date = new Date(parseInt(date)).toUTCString();
          }
        }

        this.setState({
          data: e.data.data.files,
          filteredData: e.data.data.files,
        });
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert('Network Error! Try again later...');
      });
  }

  render() {
    const deleteFileDialog = () => {
      return (
        <div>
          <Dialog
            open={this.state.deleteFileDialogState}
            onClose={() => this.setState({ deleteFileDialogState: false })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {'Please Confirm Your Action!'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this file? This process is not
                reversible.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.setState({ deleteFileDialogState: false })}
              >
                Cancel
              </Button>
              <Button onClick={() => this.deleteFile()} autoFocus>
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
              this.setState({ deleteFileDialogState: true });
              this.setState({ fileToBeDeleted: params.row.DownloadDir });
            }}
            variant="contained"
            color="error"
            disabled={this.state.disableDeleteFilesBtn}
          >
            Delete File
          </Button>
        </strong>
      );
    };

    const columns = [
      {
        field: 'CreatedBy',
        headerName: 'Uploaded By',
        width: 250,
      },
      {
        field: 'FileName',
        headerName: 'File Name',
        width: 250,
      },
      {
        field: 'Description',
        headerName: 'File Description',
        width: 350,
      },
      {
        field: 'Date',
        headerName: 'Upload Date',
        width: 250,
      },
      {
        field: 'Board',
        headerName: 'Board/Edu',
        width: 200,
      },
      {
        field: 'ClassName',
        headerName: 'Grade/Field',
        width: 200,
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
        {deleteFileDialog()}
        {this.state.loading && <Loading />}
        {!this.state.loading && (
          <div>
            <p style={styles.headerTxt}>All Files</p>
            <div style={styles.searchContainer}>
              <TextField
                onChange={(e) => this.searchDebounce(e.target.value)}
                size="small"
                fullWidth
                label="Search Files"
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
        )}
      </div>
    );
  }
}
