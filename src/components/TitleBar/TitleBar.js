//TODO:
//    Improve the restore or maximize icon change detection

import React, { Component } from 'react';
import styles from './styles';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';

//importing icons
import CloseIcon from './CloseIcon';
import MaximizeIcon from './MaximizeIcon';
import RestoreIcon from './RestoreIcon';
import MinimizeIcon from './MinimizeIcon';

const currentWindow = window.remote.getCurrentWindow();

export default class TitleBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closeBtnHover: false,
      minimizeBtnHover: false,
      maximizeBtnHover: false,
      restoreBtnHover: false,
      windowMax: false,
    };
  }

  componentDidMount() {
    if (currentWindow.isMaximized() || currentWindow.isFullScreen()) {
      this.setState({ windowMax: true });
    }

    currentWindow.on('resize', () => {
      if (currentWindow.isMaximized() || currentWindow.isFullScreen()) {
        this.setState({ windowMax: true });
      } else {
        this.setState({ windowMax: false });
      }
    });
  }

  closeWindow() {
    window.ipcRenderer.send('close-window');
  }

  minimizeWindow() {
    window.ipcRenderer.send('minimize-window');
  }

  maxOrRestoreWindow() {
    // this.setState({ windowMax: !this.state.windowMax });
    window.ipcRenderer.send('maximize-or-restore-window');
  }

  render() {
    return (
      <div className="draggable" style={styles.titleBar}>
        <div className="nonDraggable" style={styles.contentContainer}>
          <div
            title="Minimize"
            id="titleBarCloseBtn"
            style={{
              backgroundColor: this.state.minimizeBtnHover
                ? '#383B41'
                : '#21252B',
              cursor: this.state.minimizeBtnHover ? 'pointer' : null,
              ...styles.iconContainer,
            }}
            onMouseEnter={() => {
              this.setState({ minimizeBtnHover: true });
            }}
            onMouseLeave={() => {
              this.setState({ minimizeBtnHover: false });
            }}
            onClick={() => this.minimizeWindow()}
          >
            <MinimizeIcon
              style={styles.iconStyle}
              width={25}
              height={26}
              color="#f0f2f5"
            />
          </div>
          {this.state.windowMax ? (
            <div
              title="Restore"
              style={{
                backgroundColor: this.state.restoreBtnHover
                  ? '#383B41'
                  : '#21252B',
                cursor: this.state.restoreBtnHover ? 'pointer' : null,
                ...styles.iconContainer,
              }}
              onMouseEnter={() => {
                this.setState({ restoreBtnHover: true });
              }}
              onMouseLeave={() => {
                this.setState({ restoreBtnHover: false });
              }}
              onClick={() => this.maxOrRestoreWindow()}
            >
              <RestoreIcon
                width={26}
                style={{ ...styles.iconStyle, marginTop: 2.5 }}
                height={23}
                color="#f0f2f5"
              />
            </div>
          ) : (
            <div
              title="Maximize"
              style={{
                backgroundColor: this.state.maximizeBtnHover
                  ? '#383B41'
                  : '#21252B',
                cursor: this.state.maximizeBtnHover ? 'pointer' : null,
                ...styles.iconContainer,
              }}
              onMouseEnter={() => {
                this.setState({ maximizeBtnHover: true });
              }}
              onMouseLeave={() => {
                this.setState({ maximizeBtnHover: false });
              }}
              onClick={() => this.maxOrRestoreWindow()}
            >
              <MaximizeIcon
                style={{ ...styles.iconStyle, marginTop: 2.5 }}
                width={26}
                height={23}
                color="#f0f2f5"
              />
            </div>
          )}

          <div
            title="Close"
            style={{
              backgroundColor: this.state.closeBtnHover ? '#D41323' : '#21252B',
              cursor: this.state.closeBtnHover ? 'pointer' : null,
              ...styles.closeBtnContainer,
            }}
            onMouseEnter={() => {
              this.setState({ closeBtnHover: true });
            }}
            onMouseLeave={() => {
              this.setState({ closeBtnHover: false });
            }}
            onClick={() => this.closeWindow()}
          >
            <CloseIcon width={28} height={28} color="#f0f2f5" />
          </div>
        </div>
      </div>
    );
  }
}
