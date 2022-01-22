const styles = {
  titleBar: {
    width: '100%',
    height: 40,
    backgroundColor: '#1976D2',
    zIndex: 1201,
    position: 'fixed',
    top: 0,
    left: 0,
    boxShadow:
      '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
  },
  hamIcon: {
    color: '#fff',
    position: 'absolute',
    top: 4.5,
    left: 10,
    fontSize: 30,
    cursor: 'pointer',
  },
  title: {
    position: 'absolute',
    top: -15,
    left: `calc(50% - 160px)`,
    fontSize: 20,
    color: '#f0f2f5',
  },
  contentContainer: {
    float: 'right',
    height: 40,
    display: 'inline-flex',
  },
  iconStyle: {
    marginRight: 7,
    marginLeft: 7,
    paddingTop: 6,
  },
  iconContainer: {
    marginRight: 4,
    width: 40,
  },
  closeBtnContainer: {
    paddingTop: 6,
    marginRight: 2,
    paddingLeft: 6,
    paddingRight: 6,
  },
};

export default styles;
