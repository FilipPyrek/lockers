import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import ApplicationFrame from 'components/ApplicationFrame';
import LoginScreen from 'containers/LoginScreen';
import LogoutScreen from 'containers/LogoutScreen';
import EditMapScreen from 'containers/EditMapScreen';
import MapsListScreen from 'containers/MapsListScreen';
import SchoolYearsListScreen from 'containers/SchoolYearsListScreen';
import EditSchoolYear from 'containers/EditSchoolYear';
import UsersListScreen from 'containers/UsersListScreen';

function App(props) {
  return (
    <div>
      <Helmet
        titleTemplate="%s - Purkyňka Lockers"
        defaultTitle="Purkyňka Lockers"
      >
        <meta name="description" content="Aplikace pro správu skříněk na Purkyňce." />
      </Helmet>
      <Switch>
        <Route exact path="/" component={() => props.isLoggenIn ? <Redirect to="/school-years" /> : <Redirect to="/login" />} />
        <Route exact path="/maps" component={MapsListScreen} />
        <Route exact path="/map/create" component={EditMapScreen} />
        <Route exact path="/map/edit/:id" component={EditMapScreen} />
        <Route exact path="/school-years" component={SchoolYearsListScreen} />
        <Route exact path="/school-year/edit/:id" component={EditSchoolYear} />
        <Route exact path="/users" component={UsersListScreen} />
        <Route exact path="/login" component={(p) => props.isLoggenIn ? <Redirect to="/" /> : <LoginScreen {...p} />} />
        <Route exact path="/logout" component={LogoutScreen} />
        <Route component={() => <ApplicationFrame>not found</ApplicationFrame>} />
      </Switch>
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
