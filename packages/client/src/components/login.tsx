import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, LinearProgress, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { RouteComponentProps } from '@reach/router';
import { Link, navigate } from 'gatsby';

import Layout from '@/components/layout';

import { useAuth } from '../providers/auth';

interface LoginProps extends RouteComponentProps {
  isRegistration: boolean;
}

/**
 * Used for both login and registration
 * Displays simple form for credential input
 */
const Login: FunctionComponent<LoginProps> = ({ isRegistration }) => {
  const { t } = useTranslation();
  const { login, isAuthenticated, user, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  if (isAuthenticated && user) {
    //   Redirect depending on whether user is an admin or not
    navigate(user.admin ? '/users/' : '/feedback/');
  }

  const handleChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => (event: React.ChangeEvent<HTMLInputElement>): void => {
    setter(event.target.value);
  };

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>): void => {
    ev.preventDefault();
    if (loading) {
      return;
    }
    if (isRegistration && password !== passwordConfirm) {
      // TODO: add better feedback
      window.alert('Passwords do not match');
      return;
    }
    login(email, password, isRegistration);
  };

  return (
    <Layout title={t(`login.title.${isRegistration ? 'register' : 'login'}`)}>
      {loading && <LinearProgress color="secondary" />}
      <Box
        alignItems="center"
        alignSelf="center"
        display="flex"
        flexGrow="1"
        justifySelf="center"
      >
        <form autoComplete="off" noValidate onSubmit={onSubmit}>
          <Box mb={3}>
            <div>
              <TextField
                disabled={loading}
                label={t('login.email')}
                margin="normal"
                onChange={handleChange(setEmail)}
                type="email"
                value={email}
                variant="outlined"
              />
            </div>
            <div>
              <TextField
                disabled={loading}
                label={t('login.password')}
                margin="normal"
                onChange={handleChange(setPassword)}
                type="password"
                value={password}
                variant="outlined"
              />
            </div>
            {isRegistration && (
              <div>
                <TextField
                  disabled={loading}
                  label={t('login.passwordConfirm')}
                  margin="normal"
                  onChange={handleChange(setPasswordConfirm)}
                  type="password"
                  value={passwordConfirm}
                  variant="outlined"
                />
              </div>
            )}
          </Box>
          <Button
            color="secondary"
            disabled={loading || !email || !password}
            fullWidth
            type="submit"
            variant="contained"
          >
            {t(`login.submit.${isRegistration ? 'register' : 'login'}`)}
          </Button>
          <Box mt={1}>
            <Link to={isRegistration ? '/login/' : '/register/'}>
              <Typography align="center" color="textSecondary">
                {t(`login.switch.${isRegistration ? 'register' : 'login'}`)}
              </Typography>
            </Link>
          </Box>
        </form>
      </Box>
    </Layout>
  );
};

export default Login;
