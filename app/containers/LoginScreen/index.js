import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import ApplicationFrame from 'components/ApplicationFrame';
import * as actions from './actions';
import saga from './saga';
import reducer from './reducer';
import styles from './styles';

class LoginScreen extends React.PureComponent {

  static propTypes = {
    login: PropTypes.func.isRequired,
    inProgress: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
  }

  handleLogin(event) {
    const { login } = this.props;
    event.preventDefault();
    login(this.state.email, this.state.password);
    this.setState({
      ...this.state,
      password: '',
    });
  }

  handleEmail(event) {
    this.setState({
      ...this.state,
      email: event.target.value,
    });
  }

  handlePassword(event) {
    this.setState({
      ...this.state,
      password: event.target.value,
    });
  }

  render() {
    const { inProgress, error, classes } = this.props;
    const { email, password } = this.state;

    const defaultErrorMessage = typeof error === 'string' ? error : null;
    const emailError = error && error.email ? error.email : defaultErrorMessage;
    const passwordError = error && error.password ? error.password : defaultErrorMessage;

    return (
      <ApplicationFrame title="Přihlášení">
        <div className={classes.wrapper}>
          <Paper className={classes.paper}>
            <form onSubmit={this.handleLogin}>
              <Typography variant="headline">Přihlášení</Typography>
              <TextField
                autoFocus
                id="email"
                label="E-mail"
                placeholder="karel.polak@sspbrno.cz"
                value={email}
                onChange={this.handleEmail}
                className={classes.textField}
                margin="normal"
                fullWidth
                error={!!error}
                helperText={emailError}
              />
              <TextField
                id="password"
                type="password"
                label="Heslo"
                placeholder="********"
                value={password}
                onChange={this.handlePassword}
                className={classes.textField}
                margin="normal"
                fullWidth
                error={!!error}
                helperText={passwordError}
              />
              <div className={classes.buttonContainer}>
                <Button type="submit" color="primary" disabled={inProgress}>
                  Přihlásit se
                </Button>
              </div>
            </form>
          </Paper>
        </div>
      </ApplicationFrame>
    );
  }

}

const withConnect = connect((state) => state.get('login').toJS(), actions);

const withReducer = injectReducer({ key: 'login', reducer });

const withSaga = injectSaga({ key: 'login', saga });

const withStyle = withStyles(styles, { withTheme: true });

export default compose(withStyle, withReducer, withSaga, withConnect)(LoginScreen);
