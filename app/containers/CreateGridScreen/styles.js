export default (theme) => ({
  wrapper: {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  paper: {
    width: '25%',
    maxWidth: 400,
    display: 'inline-block',
    textAlign: 'left',
    padding: theme.spacing.unit * 8,
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
  },
  textField: {
    display: 'block',
  },
  buttonContainer: {
    textAlign: 'right',
    marginTop: theme.spacing.unit * 4,
  },
});
