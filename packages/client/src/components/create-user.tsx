import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, LinearProgress } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import { RouteComponentProps } from '@reach/router';
import { navigate } from 'gatsby';

import Layout from '@/components/layout';

import { API_BASE } from '../constants';
import { useAuth } from '../providers/auth';

interface CreateUserProps extends RouteComponentProps {
  userId?: string;
}

/**
 * Used for creating and editing users
 * Displays simple form for user input
 */
const CreateUser: FunctionComponent<CreateUserProps> = ({ userId }) => {
  const { t } = useTranslation();
  const { token } = useAuth();

  const isUpdate = !!userId;

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (!isUpdate) {
      return;
    }
    const fetchUser = async (): Promise<void> => {
      setLoading(true);
      const response = await fetch(API_BASE + '/users/' + userId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const user = await response.json();
        setEmail(user.email);
        setName(user.name);
        setAdmin(user.admin);
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => (event: React.ChangeEvent<HTMLInputElement>): void => {
    setter(event.target.value);
  };

  const handleSwitchChange = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
  ) => (event: React.ChangeEvent<HTMLInputElement>): void => {
    setter(event.target.checked);
  };

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>): void => {
    ev.preventDefault();
    if (loading) {
      return;
    }
    const createUser = async (): Promise<void> => {
      setLoading(true);
      const url = `${API_BASE}/users/${isUpdate ? userId : ''}`;
      const response = await fetch(url, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          admin,
        }),
      });
      if (response.status < 300) {
        navigate('/users/');
      }
      setLoading(false);
    };

    createUser();
  };

  return (
    <Layout title={t(`createUser.title.${isUpdate ? 'update' : 'create'}`)}>
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
              label={t('createUser.name')}
              margin="normal"
              onChange={handleChange(setName)}
              type="text"
              value={name}
              variant="outlined"
            />
          </div>
          <div>
            <TextField
              disabled={loading}
              label={t('createUser.email')}
              margin="normal"
              onChange={handleChange(setEmail)}
              type="email"
              value={email}
              variant="outlined"
            />
          </div>
          <Box display="flex" justifyContent="center" mb={2} mt={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={admin}
                  onChange={handleSwitchChange(setAdmin)}
                />
              }
              label={t('createUser.admin')}
            />
          </Box>
          <Button
            color="secondary"
            disabled={loading || !email || !name}
            fullWidth
            type="submit"
            variant="contained"
          >
            {t(`createUser.submit.${isUpdate ? 'update' : 'create'}`)}
          </Button>
        </form>
      </Box>
    </Layout>
  );
};

export default CreateUser;
