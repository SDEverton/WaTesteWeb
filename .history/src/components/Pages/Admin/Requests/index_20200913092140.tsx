import Toolbar from 'components/Layout/Toolbar';
import React, { Fragment, memo } from 'react';

const Requests = memo((props: {}) => {
  return (
    <Fragment>
      <Toolbar title='Pedidos' />
    </Fragment>
  );
});

export default Requests;
