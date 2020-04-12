import React, { FunctionComponent } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AddCommetIcon from '@material-ui/icons/AddComment';
import GroupIcon from '@material-ui/icons/Group';
import { Link, navigate } from 'gatsby';

import FAVICON from '../images/favicon.png';
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

/**
 * Layout component for wrapping pages and providing consistent layout
 * Provdes navigation bar and page title
 */
const Layout: FunctionComponent<LayoutProps> = ({ title, children }) => {
  const { t } = useTranslation();
  const { isAuthenticated, logout, user } = useAuth();
  const classes = useStyles();

  const handleLogoutClick = (): void => {
    logout();
    navigate('/login/');
  };

  let pathname = '';

  // SSR safeguard
  if (typeof window !== 'undefined') {
    pathname = window.location.pathname;
  }

  return (
    <Box className={classes.root} display="flex" flexDirection="column">
      <Helmet>
        <title>
          {t('global.title')} : {title}
        </title>
        <link href={FAVICON} rel="shortcut icon" type="image/png" />
      </Helmet>
      <AppBar position="static">
        <Toolbar>
          <Box display={{ xs: 'none', sm: 'block' }} mr={1}>
            <Typography className={classes.title} variant="h6">
              {t('global.title')} |
            </Typography>
          </Box>
          <Typography className={classes.title} variant="h6">
            {title}
          </Typography>
          {user && user.admin && (
            <>
              {pathname.indexOf('/users') === -1 && (
                <Button
                  color="inherit"
                  component={Link}
                  startIcon={<GroupIcon />}
                  to="/users/"
                  variant="outlined"
                >
                  {t('layout.adminButton')}
                </Button>
              )}
              {pathname.indexOf('/feedback') === -1 && (
                <Button
                  color="inherit"
                  component={Link}
                  startIcon={<AddCommetIcon />}
                  to="/feedback/"
                  variant="outlined"
                >
                  {t('layout.feedbackButton')}
                </Button>
              )}
            </>
          )}
          {isAuthenticated && (
            <Box ml={3}>
              <Button color="inherit" onClick={handleLogoutClick}>
                {t('layout.logout')}
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {children}
    </Box>
  );
};
export default Layout;
