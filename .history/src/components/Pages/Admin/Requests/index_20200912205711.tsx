import Toolbar from 'components/Layout/Toolbar';
import React, { Fragment, memo } from 'react';

// const useStyles = makeStyles({
//   marginBottom: {
//     marginBottom: 15
//   }
// });

const Requests = memo((props: {}) => {
  // const classes = useStyles(props);

  return (
    <Fragment>
      <Toolbar title='Pedidos' />

      <h1>oi</h1>
    </Fragment>
  );
});

export default Requests;
