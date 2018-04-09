export default (theme) => ({
  wrapper: {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  leftPanel: {
    height: '70%',
    width: '60%',
    textAlign: 'left',
  },
  hideLeftPanel: {
    width: 'calc(80% + 2.5vmin)',
  },
  toolbar: {
    height: '12.5%',
    marginBottom: '2.5vmin',
    display: 'flex',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    padding: theme.spacing.unit * 1,
  },
  toolbarContent: {
    display: 'flex',
  },
  grid: {
    height: 'calc(87.5% - 2.5vmin)',
    boxSizing: 'border-box',
  },
  panel: {
    height: '70%',
    width: '20%',
    display: 'inline-block',
    textAlign: 'left',
    boxSizing: 'border-box',
    padding: theme.spacing.unit * 4,
    marginLeft: '2.5vmin',
  },
  hidePanel: {
    display: 'none',
  },
  toolbarIconButton: {
    height: '100%',
    marginRight: '2vmin',
  },
  toolbarIcon: {
    fontSize: '4vh',
  },
  removeClassButton: {
    color: theme.palette.error.main,
  },
  addClassButton: {
    color: theme.palette.primary.main,
  },
});
