import React, { Component } from 'react';
import { CircularProgress } from '@mui/material';

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
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import { DataGrid } from '@mui/x-data-grid';

import Loading from '../Loading';

async function getAllData() {
  const head = {
    headers: {
      authorization: `token ${config.ACCESS_TOKEN_ADMIN}`,
    },
  };

  await axios
    .get(`${config.uri}/admin/sendAllUsers`, head)
    .then((e) => {
      if (e.data.data.users) {
        for (var i = 0, l = e.data.data.users.length; i < l; i++) {
          let date = e.data.data.users[i].CreatedOn;
          e.data.data.users[i].CreatedOn = new Date(date).toUTCString();
        }
        this.setState({
          data: e.data.data.users,
          filteredData: e.data.data.users,
        });
      }
      this.state.loading = false;
    })
    .catch((err) => {
      this.state.loading = false;
      alert('Network Error! Try again later...');
    });
}

async function deleteUser() {
  this.setState({ deleteUserDialogState: false });
  this.setState({ deleteBtnDisabled: true });

  let id = this.state.userToBeDeleted;

  const head = {
    headers: {
      authorization: `token ${config.ACCESS_TOKEN_ADMIN}`,
    },
    params: {
      id,
    },
  };

  await axios
    .get(`${config.uri}/admin/deleteUser`, head)
    .then((e) => {
      if (e.data == 'success') {
        alert('User Deleted Successfully!');
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

function performSearch(query) {
  let txt = query.toLowerCase();
  let filteredData = this.state.data.filter(function (item) {
    return (
      item.FullName.toLowerCase().includes(txt) ||
      item.UserName.toLowerCase().includes(txt) ||
      item.Email.toLowerCase().includes(txt) ||
      item.Contact.toLowerCase().includes(txt) ||
      item.Gender.toLowerCase().includes(txt) ||
      item.AccountType.toLowerCase().includes(txt) ||
      (item.Board && item.Board.toLowerCase().includes(txt)) ||
      (item.Grade && item.Grade.toString().toLowerCase().includes(txt)) ||
      item.CreatedOn.toLowerCase().includes(txt)
    );
  });
  this.setState({ filteredData });
}

function filterData() {
  if (this.state.onlyTeacher && this.state.onlyStudent) {
    let filteredData = this.state.data.filter(function (item) {
      return item.AccountType == 'teacher' || item.AccountType == 'student';
    });
    this.setState({ filteredData });
  } else if (this.state.onlyTeacher && !this.state.onlyStudent) {
    let filteredData = this.state.data.filter(function (item) {
      return item.AccountType == 'teacher';
    });
    this.setState({ filteredData });
  } else if (!this.state.onlyTeacher && this.state.onlyStudent) {
    let filteredData = this.state.data.filter(function (item) {
      return item.AccountType == 'student';
    });
    this.setState({ filteredData });
  } else {
    let filteredData = this.state.data.filter(function (item) {
      return item.AccountType != 'teacher' && item.AccountType != 'student';
    });
    this.setState({ filteredData });
  }
}

export default class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteUserDialogState: false,
      loading: false,
      data: [],
      filteredData: [],
      onlyTeacher: true,
      onlyStudent: true,
      deleteBtnDisabled: false,
      userToBeDeleted: null,
    };

    getAllData = getAllData.bind(this);
    deleteUser = deleteUser.bind(this);
    performSearch = performSearch.bind(this);
    filterData = filterData.bind(this);
  }

  componentDidMount() {
    getAllData();
  }

  render() {
    const renderDetailsButton = (params) => {
      return (
        <strong>
          <Button
            id={`deleteBtn-${params.row._id}`}
            onClick={(e) => {
              this.setState({ deleteUserDialogState: true });
              this.setState({ userToBeDeleted: params.row._id });
            }}
            variant="contained"
            color="error"
            disabled={this.state.deleteBtnDisabled}
          >
            Delete User
          </Button>
        </strong>
      );
    };

    const deleteUserDialog = () => {
      return (
        <div>
          <Dialog
            open={this.state.deleteUserDialogState}
            onClose={() => this.setState({ deleteUserDialogState: false })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {'Please Confirm Your Action!'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this user? This process is not
                reversible.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.setState({ deleteUserDialogState: false })}
              >
                Cancel
              </Button>
              <Button onClick={() => deleteUser()} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    };

    const columns = [
      {
        field: 'FullName',
        headerName: 'Name',
        width: 150,
      },
      {
        field: 'UserName',
        headerName: 'Username',
        width: 150,
      },
      {
        field: 'Email',
        headerName: 'Email',
        width: 300,
      },
      {
        field: 'Contact',
        headerName: 'Phone No.',
        width: 150,
      },

      {
        field: 'Gender',
        headerName: 'Gender',
        width: 150,
      },

      {
        field: 'AccountType',
        headerName: 'Account Type',
        width: 150,
      },

      {
        field: 'Board',
        headerName: 'Board/Edu',
        width: 150,
      },

      {
        field: 'Grade',
        headerName: 'Grade/Field',
        width: 150,
      },
      {
        field: 'CreatedOn',
        headerName: 'Registration Date',
        width: 250,
      },
      {
        field: 'Action',
        headerName: 'Actions',
        width: 150,
        renderCell: renderDetailsButton,
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
        {deleteUserDialog()}
        {this.state.loading && <Loading />}
        {!this.state.loading && (
          <div>
            <p style={styles.headerTxt}>Total Users</p>
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
              <FormControlLabel
                style={{ marginLeft: 10 }}
                control={
                  <Checkbox
                    defaultChecked
                    onChange={(e) => {
                      this.setState({ onlyTeacher: !this.state.onlyTeacher });
                      setTimeout(filterData, 500);
                    }}
                  />
                }
                label="Teachers"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onChange={(e) => {
                      this.setState({ onlyStudent: !this.state.onlyStudent });
                      setTimeout(filterData, 500);
                    }}
                  />
                }
                label="Students"
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
            </div>
          </div>
        )}
      </div>
    );
  }
}
