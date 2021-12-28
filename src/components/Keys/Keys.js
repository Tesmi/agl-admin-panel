import React, { Component } from 'react';

import ClipboardJS from 'clipboard';

import styles from './styles';
import axios from 'axios';
import config from '../../../config';

import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

import Loading from '../Loading';

async function getAllData() {
  this.setState({ loading: true });

  const head = {
    headers: {
      authorization: `token ${config.ACCESS_TOKEN_ADMIN}`,
    },
  };

  await axios
    .get(`${config.uri}/admin/sendAllKeys`, head)
    .then((e) => {
      for (var i = 0, l = e.data.data.keys.length; i < l; i++) {
        let date = e.data.data.keys[i].UsedDate;
        if (date != 'N/A')
          e.data.data.keys[i].UsedDate = new Date(parseInt(date)).toUTCString();
      }

      this.setState({
        data: e.data.data.keys,
        filteredData: e.data.data.keys,
      });

      this.setState({ loading: false });
    })
    .catch((err) => {
      this.setState({ loading: false });
      alert('Network Error! Try again later...');
    });
}

async function deleteKey() {
  this.setState({ deleteKeyDialogOpen: false });
  this.setState({ deleteBtnDisabled: true });

  let token = this.state.keyToBeDeleted;

  const head = {
    headers: {
      authorization: `token ${config.ACCESS_TOKEN_ADMIN}`,
    },
    params: {
      token,
    },
  };

  await axios
    .get(`${config.uri}/admin/deleteKey`, head)
    .then((e) => {
      if (e.data == 'success') {
        alert('Key Deleted Successfully!');
        getAllData();
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

function searchDebounce(txt) {
  let timeout;
  let delay = 300;
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(function () {
    performSearch(txt);
  }, delay);
}

async function generateToken() {
  let numOfKeys = parseInt(this.state.newKeysAmount);
  if (!numOfKeys) return alert('Number of keys is invalid');
  if (numOfKeys < 1 || numOfKeys > 99) {
    return alert('Number of keys is invalid');
  }

  this.setState({ showLoadingButton: true });

  const head = {
    headers: {
      authorization: `token ${config.ACCESS_TOKEN_ADMIN}`,
    },
  };

  let data = { amount: numOfKeys };

  await axios
    .post(`${config.uri}/admin/generateTokens`, data, head)
    .then((e) => {
      if (e.data.status == 'done') {
        this.setState({ showLoadingButton: false });
        getAllData();
        return alert('Keys created successfully!');
        //success
      } else {
        this.setState({ showLoadingButton: false });
        return alert('Something went wrong, try again later.');
      }
    })
    .catch((err) => {
      this.setState({ showLoadingButton: false });
      return alert('Something went wrong, try again later.');
    });
}

function performSearch(query) {
  let txt = query.toLowerCase();
  let filteredData = this.state.data.filter(function (item) {
    return (
      item.token.toLowerCase().includes(txt) ||
      item.Status.toLowerCase().includes(txt) ||
      item.UsedBy.toLowerCase().includes(txt) ||
      item.UsedDate.toLowerCase().includes(txt)
    );
  });
  this.setState({ filteredData });
}

export default class Keys extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      deleteKeyDialogOpen: false,
      data: [],
      filteredData: [],
      deleteBtnDisabled: false,
      keyToBeDeleted: null,
      openSnackbar: false,
      newKeysAmount: 0,
      showLoadingButton: false,
    };

    getAllData = getAllData.bind(this);
    deleteKey = deleteKey.bind(this);
    performSearch = performSearch.bind(this);
    generateToken = generateToken.bind(this);
  }

  componentDidMount() {
    getAllData();
  }

  render() {
    new ClipboardJS('.copyKeyBtn');

    const renderActionBtns = (params) => {
      return (
        <strong>
          <Button
            id={`deleteBtn-${params.row._id}`}
            onClick={(e) => {
              this.setState({ deleteKeyDialogOpen: true });
              this.setState({ keyToBeDeleted: params.row.token });
            }}
            variant="contained"
            color="error"
            disabled={
              this.state.deleteBtnDisabled || params.row.Status == 'Used'
            }
          >
            Delete Key
          </Button>

          <Button
            style={{ marginLeft: 10 }}
            id={`copyBtn-${params.row._id}`}
            onClick={(e) => {
              this.setState({ openSnackbar: true });
            }}
            className="copyKeyBtn"
            data-clipboard-text={params.row.token}
            variant="contained"
            color="success"
          >
            Copy Key
          </Button>
        </strong>
      );
    };

    const deleteKeyDialog = () => {
      return (
        <div>
          <Dialog
            open={this.state.deleteKeyDialogOpen}
            onClose={() => this.setState({ deleteKeyDialogOpen: false })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {'Please Confirm Your Action!'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this key? This process is not
                reversible.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.setState({ deleteKeyDialogOpen: false })}
              >
                Cancel
              </Button>
              <Button onClick={() => deleteKey()} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    };

    const columns = [
      {
        field: 'token',
        headerName: 'Key',
        width: 250,
      },
      {
        field: 'Status',
        headerName: 'Status',
        width: 150,
      },

      {
        field: 'UsedBy',
        headerName: 'Used By',
        width: 150,
      },

      {
        field: 'UsedDate',
        headerName: 'Used Date',
        width: 300,
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
        {deleteKeyDialog()}
        {this.state.loading && <Loading />}
        {!this.state.loading && (
          <>
            <div>
              <p style={styles.headerTxt}>Generate new keys</p>
              <div style={styles.generateKeysContainer}>
                <TextField
                  size="small"
                  label="Enter amount of keys between 1-99"
                  onChange={(e) =>
                    this.setState({
                      newKeysAmount: e.target.value.replace(/[^0-9]/g, ''),
                    })
                  }
                  value={this.state.newKeysAmount}
                />
                {this.state.showLoadingButton ? (
                  <LoadingButton
                    style={{ marginLeft: 20 }}
                    loading
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    variant="contained"
                  >
                    Generate
                  </LoadingButton>
                ) : (
                  <Button
                    style={{ marginLeft: 20 }}
                    onClick={() => generateToken()}
                    variant="contained"
                  >
                    Generate
                  </Button>
                )}
              </div>
            </div>
            <div>
              <p style={styles.headerTxt}>All keys</p>
              <div style={styles.searchContainer}>
                <TextField
                  onChange={(e) => searchDebounce(e.target.value)}
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
                  rowsPerPageOptions={[5]}
                  autoHeight={true}
                  disableSelectionOnClick
                />
                <Snackbar
                  open={this.state.openSnackbar}
                  autoHideDuration={4000}
                  onClose={() => this.setState({ openSnackbar: false })}
                  message="Key copied to clipboard!"
                />
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}
