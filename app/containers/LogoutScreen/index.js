import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from './actions';

class LogoutScreen extends React.PureComponent {

  static propTypes = {
    logout: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.logout();
  }

  render() {
    return <Redirect to="/login" />;
  }

}

export default connect(null, actions)(LogoutScreen);
