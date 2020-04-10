import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'gatsby';

type LayoutProps = {
  title: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '100vh',
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

const Layout: FunctionComponent<LayoutProps> = ({ title, children }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <Box className={classes.root} display="flex" flexDirection="column">
      <AppBar position="static">
        <Toolbar>
          <IconButton
            aria-label="menu"
            className={classes.menuButton}
            color="inherit"
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6">
            {title}
          </Typography>
          <Button color="inherit" component={Link} to="/login">
            {t('layout.login')}
          </Button>
        </Toolbar>
      </AppBar>
      {children}
    </Box>
  );
};
export default Layout;
