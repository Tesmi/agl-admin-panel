import React, { Component } from 'react';
import styles from './styles';

//importing icons
import CloseIcon from './CloseIcon';
import MaximizeIcon from './MaximizeIcon';
import RestoreIcon from './RestoreIcon';
import MinimizeIcon from './MinimizeIcon';

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

  closeWindow() {
    window.ipcRenderer.send('closeWindow');
  }

  render() {
    return (
      <div className="draggable" style={styles.titleBar}>
        <div className="nonDraggable" style={styles.contentContainer}>
          <div
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
