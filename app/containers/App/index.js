/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import LoginScreen from 'containers/LoginScreen';

const AppWrapper = styled.div`

`;

function App(props) {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - Purkyňka Lockers"
        defaultTitle="Purkyňka Lockers"
      >
        <meta name="description" content="Aplikace pro správu skříněk na Purkyňce." />
      </Helmet>
      <Switch>
        <Route exact path="/" component={() => <div>token - {props.token}</div>} />
        <Route exact path="/login" component={LoginScreen} />
        <Route component={() => <div>not found</div>} />
      </Switch>
    </AppWrapper>
  );
}

App.propTypes = {
  token: PropTypes.string,
};

export default connect((state) => ({ token: state.getIn(['global', 'token']) }), null)(App);
