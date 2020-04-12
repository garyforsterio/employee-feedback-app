import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { Request, User } from '../';
import { API_BASE } from '../constants';
import { useAuth } from '../providers/auth';
import getGravatarUrl from '../utilities/get-gravatar-url';

type RequestFeedbackDialogProps = {
  open: boolean;
  onClose: () => void;
  userId: string;
};

/**
 * Displays a list of users from whom you can select which to ask for feedback
 */
const RequestFeedbackDialog: FunctionComponent<RequestFeedbackDialogProps> = ({
  open,
  onClose,
  userId,
}) => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [users, setUsers] = useState([] as User[]);
  const [requests, setRequest] = useState([] as Request[]);
  const [checked, setChecked] = React.useState([] as string[]);
  const theme = useTheme();
  const isModalFullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  useEffect(() => {
    // TODO: add loading feedback
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

  useEffect(() => {
    const fetchRequests = async (): Promise<void> => {
      const response = await fetch(
        API_BASE + '/requests?completed=false&evaluateeId=' + userId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // TODO handle errors
      const data = await response.json();
      setRequest(data);
    };
    fetchRequests();
  }, [token]);

  const handleToggle = (userId: string) => (): void => {
    const currentIndex = checked.indexOf(userId);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(userId);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleCloseClick = (): void => {
    onClose();
  };

  const handleSendClick = async (): Promise<void> => {
    const requests = checked.map(async (evaluatorId) => {
      await fetch(API_BASE + '/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          evaluatorId,
          evaluateeId: userId,
        }),
      });
      // TODO handle errors
    });
    await Promise.all(requests);
    onClose();
  };

  return (
    <Dialog
      fullScreen={isModalFullScreen}
      fullWidth={true}
      maxWidth="xs"
      onClose={handleCloseClick}
      open={open}
    >
      <DialogTitle>{t('requestFeedbackDialog.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('requestFeedbackDialog.instruction')}
        </DialogContentText>
        <List dense>
          {users.map((user) => {
            const existingRequest = requests.find(
              (request) => request.evaluatorId === user._id,
            );
            return (
              <ListItem button key={user._id} onClick={handleToggle(user._id)}>
                <ListItemAvatar>
                  <Avatar src={getGravatarUrl(user.email)} />
                </ListItemAvatar>
                <ListItemText primary={user.name} secondary={user.email} />
                <ListItemSecondaryAction>
                  {existingRequest && (
                    <Typography
                      color="textSecondary"
                      component="span"
                      variant="body2"
                    >
                      {t('requestFeedbackDialog.sent')}{' '}
                      {new Date(existingRequest.createdAt).toLocaleDateString()}
                    </Typography>
                  )}
                  <Checkbox
                    checked={checked.indexOf(user._id) !== -1}
                    disabled={!!existingRequest}
                    edge="end"
                    indeterminate={!!existingRequest}
                    onChange={handleToggle(user._id)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleCloseClick}>
          {t('requestFeedbackDialog.cancel')}
        </Button>
        <Button
          color="primary"
          disabled={!checked.length}
          onClick={handleSendClick}
        >
          {t('requestFeedbackDialog.send')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default RequestFeedbackDialog;
