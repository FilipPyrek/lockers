/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import LoginScreen from 'containers/LoginScreen';

const AppWrapper = styled.div`

`;

export default function App() {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - Purkyňka Lockers"
        defaultTitle="Purkyňka Lockers"
      >
        <meta name="description" content="Aplikace pro správu skříněk na Purkyňce." />
      </Helmet>
      <Switch>
        <Route exact path="/login" component={LoginScreen} />
      </Switch>
    </AppWrapper>
  );
}
