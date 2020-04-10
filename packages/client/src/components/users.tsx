import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'gatsby';

import User from '@/components/user';

import { User as IUser } from '../';
import { API_BASE } from '../constants';
import { useAuth } from '../providers/auth';
import Layout from './layout';

const useStyles = makeStyles(() =>
  createStyles({
    addButton: {
      position: 'fixed',
      bottom: 20,
      right: 20,
    },
  }),
);
type UsersProps = {};

/**
 * Displays listing of users for admin screen
 */
const Users: FunctionComponent<UsersProps> = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { token } = useAuth();
  const [users, setUsers] = useState([] as IUser[]);

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      const response = await fetch(API_BASE + '/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // TODO handle errors
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, [token]);

  return (
    <Layout title={t('users.title')}>
      <Box display="flex" flexWrap="wrap" p="100">
        {users.map((user) => (
          <User data={user} key={user.email} />
        ))}
      </Box>
      <Fab
        className={classes.addButton}
        color="primary"
        component={Link}
        to="/users/create"
      >
        <AddIcon />
      </Fab>
    </Layout>
  );
};
export default Users;
