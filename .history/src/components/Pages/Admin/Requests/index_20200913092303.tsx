import React, { memo } from 'react';
import { Route, Switch } from 'react-router-dom';

import Requests from './List';

const RequestsIndexPage = memo(() => {
  return (
    <Switch>
      <Route path='/' component={Requests} />
    </Switch>
  );
});

export default RequestsIndexPage;
