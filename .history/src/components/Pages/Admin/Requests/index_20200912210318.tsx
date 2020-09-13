import Toolbar from 'components/Layout/Toolbar';
import React, { Fragment, memo } from 'react';

import { Container } from './styles';

const Requests = memo((props: {}) => {
  return (
    <Fragment>
      <Toolbar title='Pedidos' />

      <Container>
        <h1>oi</h1>
      </Container>
    </Fragment>
  );
});

export default Requests;
