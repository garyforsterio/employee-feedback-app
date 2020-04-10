import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, LinearProgress } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { navigate } from 'gatsby';

import Layout from '@/components/layout';

import { useAuth } from '../providers/auth';

const Login: FunctionComponent = () => {
  const { t } = useTranslation();
  const { login, isAuthenticated, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (isAuthenticated) {
    //   Redirect
    navigate('/');
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
    login(email, password);
  };
  return (
    <Layout title={t('login.title')}>
      {loading && <LinearProgress color="secondary" />}
      <Box
        alignItems="center"
        alignSelf="center"
        display="flex"
        flexGrow="1"
        justifySelf="center"
      >
        <form autoComplete="off" noValidate onSubmit={onSubmit}>
          <div>
            <TextField
              disabled={loading}
              label="Email"
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
              label="Password"
              margin="normal"
              onChange={handleChange(setPassword)}
              type="password"
              value={password}
              variant="outlined"
            />
          </div>
          <Button color="secondary" fullWidth type="submit" variant="contained">
            Login
          </Button>
        </form>
      </Box>
    </Layout>
  );
};

export default Login;
