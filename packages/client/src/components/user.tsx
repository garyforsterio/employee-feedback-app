import React, { FunctionComponent, useState } from 'react';
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
import AddCommentIcon from '@material-ui/icons/AddComment';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'gatsby';

import { User as IUser } from '..';
import { useAuth } from '../providers/auth';
import getGravatarUrl from '../utilities/get-gravatar-url';
import RequestFeedbackDialog from './request-feedback-dialog';

type UserProps = {
  user: IUser;
  onDeleteClick: (id: string) => void;
};

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: 300,
      margin: 10,
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    details: {
      height: 120,
    },
  }),
);

/**
 * Presentational component displaying basic user info for admin screen
 */
const User: FunctionComponent<UserProps> = ({ user, onDeleteClick }) => {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const classes = useStyles();
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const avatar = getGravatarUrl(user.email);

  const handleDeleteClick = async (): Promise<void> => {
    // TODO better confirm
    const confirm = window.confirm(
      `Are you sure you want to delete ${user.name}?`,
    );
    if (!confirm) {
      return;
    }
    onDeleteClick(user._id);
  };

  const handleFeedbackClick = (): void => {
    setRequestModalOpen(true);
  };

  const handleRequestModalClose = (): void => {
    setRequestModalOpen(false);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        action={
          <IconButton component={Link} to={`/users/${user._id}`}>
            <EditIcon />
          </IconButton>
        }
        avatar={<Avatar src={avatar} />}
        subheader={user.email}
        title={user.name}
      />
      <CardContent>
        <Box
          alignItems="center"
          className={classes.details}
          display="flex"
          justifyContent="space-around"
        >
          <Box>
            <Typography color="textSecondary" variant="body2">
              {t('user.rating')}
            </Typography>
            <Typography color="textSecondary" variant="caption">
              {user.averageRating
                ? `${Math.round(user.averageRating * 100)}%`
                : t('user.noData')}
            </Typography>
          </Box>
          {!user.averageRating && (
            <Box mr={2}>
              <Typography color="textSecondary" variant="body2">
                {t('user.noData')}
              </Typography>
            </Box>
          )}
          {user.averageRating && (
            <CircularProgress
              color="secondary"
              size={100}
              thickness={15}
              value={user.averageRating * 100}
              variant="static"
            />
          )}
        </Box>
      </CardContent>
      <CardActions disableSpacing>
        <Box flex="1" />
        <IconButton onClick={handleFeedbackClick}>
          <AddCommentIcon />
        </IconButton>
        {currentUser && user._id !== currentUser.id && (
          <IconButton onClick={handleDeleteClick}>
            <DeleteIcon />
          </IconButton>
        )}
      </CardActions>
      {requestModalOpen && (
        <RequestFeedbackDialog
          onClose={handleRequestModalClose}
          open={requestModalOpen}
          userId={user._id}
        />
      )}
    </Card>
  );
};
export default User;
