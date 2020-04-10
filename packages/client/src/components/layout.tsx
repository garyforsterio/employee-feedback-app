import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { navigate } from 'gatsby';

import { useAuth } from '../providers/auth';

type LayoutProps = {
  title: string;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      minHeight: '100vh',
    },
    title: {
      flexGrow: 1,
    },
  }),
);

const Layout: FunctionComponent<LayoutProps> = ({ title, children }) => {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const classes = useStyles();

  const handleLogoutClick = () => {
    logout();
    navigate('/login/');
  };

  return (
    <Box className={classes.root} display="flex" flexDirection="column">
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6">
            {title}
          </Typography>
          {isAuthenticated && (
            <Button color="inherit" onClick={handleLogoutClick}>
              {t('layout.logout')}
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {children}
    </Box>
  );
};
export default Layout;
