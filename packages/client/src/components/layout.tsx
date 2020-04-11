import React, { FunctionComponent } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AddCommetIcon from '@material-ui/icons/AddComment';
import GroupIcon from '@material-ui/icons/Group';
import { Link, navigate } from 'gatsby';

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
  const { isAuthenticated, logout, user } = useAuth();
  const classes = useStyles();

  const handleLogoutClick = (): void => {
    logout();
    navigate('/login/');
  };

  return (
    <Box className={classes.root} display="flex" flexDirection="column">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6">
            {title}
          </Typography>
          {user && user.admin && (
            <>
              <IconButton color="inherit" component={Link} to="/users">
                <GroupIcon />
              </IconButton>
              <IconButton color="inherit" component={Link} to="/feedback">
                <AddCommetIcon />
              </IconButton>
            </>
          )}
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
