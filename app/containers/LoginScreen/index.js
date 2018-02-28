import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import * as actions from './actions';
import saga from './saga';
import reducer from './reducer';

const LoginWrapper = styled.div`

`;

class LoginScreen extends React.PureComponent {

  static propTypes = {
    login: PropTypes.func.isRequired,
    inProgress: PropTypes.bool,
    error: PropTypes.string,
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
    const { inProgress, error } = this.props;

    return (
      <LoginWrapper>
        <Helmet
          title="Log in"
        />
        { inProgress ? <div>loading...</div> : null }
        <form onSubmit={this.handleLogin}>
          <table>
            <tbody>
              <tr>
                <td>
                  Email:
                </td>
                <td>
                  <input
                    onChange={this.handleEmail}
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  Password:
                </td>
                <td>
                  <input
                    onChange={this.handlePassword}
                    type="password"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  &nbsp;
                </td>
                <td>
                  <input type="submit" />
                </td>
              </tr>
              {
                error
                ? (
                  <tr>
                    <td colSpan="2">
                      {error}
                    </td>
                  </tr>
                ) : null
              }
            </tbody>
          </table>
        </form>
      </LoginWrapper>
    );
  }

}

const withConnect = connect((state) => state.get('login').toJS(), actions);

const withReducer = injectReducer({ key: 'login', reducer });

const withSaga = injectSaga({ key: 'login', saga });

export default compose(withReducer, withSaga, withConnect)(LoginScreen);
