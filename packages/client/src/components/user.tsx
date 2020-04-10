import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Link } from 'gatsby';
import md5 from 'md5';

import { User as IUser } from '..';
import { API_BASE, GRAVATAR_URL } from '../constants';
import { useAuth } from '../providers/auth';

type UserProps = {
  data: IUser;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: 300,
      margin: 10,
    },
  }),
);

/**
 * Displays basic user info for admin screen
 */
const User: FunctionComponent<UserProps> = ({ data }) => {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const classes = useStyles();
  const image = GRAVATAR_URL + md5(data.email) + '?d=robohash';
  const rating = 75;

  const handleDeleteClick = async (): Promise<void> => {
    const url = `${API_BASE}/users/${data._id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status < 300) {
      // TODO: reload data
      location.reload();
    }
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        avatar={<Avatar src={image} />}
        subheader={data.email}
        title={data.name}
      />
      <CardContent>
        <Box alignItems="center" display="flex" justifyContent="space-around">
          <Typography color="textSecondary" variant="body2">
            {t('user.rating')}
          </Typography>
          <CircularProgress
            color="secondary"
            size={100}
            thickness={15}
            value={rating}
            variant="static"
          />
        </Box>
      </CardContent>
      <CardActions disableSpacing>
        {user && data._id !== user.id && (
          <IconButton onClick={handleDeleteClick}>
            <DeleteIcon />
          </IconButton>
        )}
        <IconButton component={Link} to={`/users/${data._id}`}>
          <EditIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
export default User;
