import React from 'react';
import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import StepsHandler from './steps';

const useStyles = makeStyles(
  (theme) => ({
    main: {
      marginTop: theme.spacing(4),
    },
  }),
  { index: 1 },
);

const Home = () => {
  const cls = useStyles();

  return (
    <Container maxWidth="sm" className={cls.main}>
      <Typography variant="h3" align="center">
        Cloud subscription
      </Typography>
      <StepsHandler />
    </Container>
  );
};

export default Home;
