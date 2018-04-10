export default (theme) => ({
  wrapper: {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  leftPanel: {
    width: '80%',
    textAlign: 'left',
  },
  toolbar: {
    minHeight: '5vmin',
    marginBottom: '2.5vmin',
    display: 'flex',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    padding: theme.spacing.unit * 1,
  },
  grid: {
    height: '60vmin',
    overflow: 'auto',
  },
});
