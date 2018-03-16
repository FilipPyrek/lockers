import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import ApplicationFrame from 'components/ApplicationFrame';
import LoginScreen from 'containers/LoginScreen';
import LogoutScreen from 'containers/LogoutScreen';
import CreateGridScreen from 'containers/CreateGridScreen';

function App(props) {
  return (
    <div>
      <Helmet
        titleTemplate="%s - Purkyňka Lockers"
        defaultTitle="Purkyňka Lockers"
      >
        <meta name="description" content="Aplikace pro správu skříněk na Purkyňce." />
      </Helmet>
      <ApplicationFrame>
        <Switch>
          <Route exact path="/" component={() => <div>{props.isLoggenIn ? 'ANO' : 'NE'}</div>} />
          <Route exact path="/create" component={CreateGridScreen} />
          <Route exact path="/login" component={(p) => props.isLoggenIn ? <Redirect to="/" /> : <LoginScreen {...p} />} />
          <Route exact path="/logout" component={LogoutScreen} />
          <Route component={() => <div>not found</div>} />
        </Switch>
      </ApplicationFrame>
    </div>
  );
}

App.propTypes = {
  isLoggenIn: PropTypes.bool.isRequired,
};

const ConnectedApp = connect(
  (state) => ({
    isLoggenIn: Boolean(state.getIn(['global', 'token'])),
  })
  , null)(App);

export default withRouter(ConnectedApp);
