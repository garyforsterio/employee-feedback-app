import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';

import Feedback from '@/components/feedback';

import { Request, Review, User } from '../';
import { API_BASE } from '../constants';
import { useAuth } from '../providers/auth';
import Layout from './layout';

type FeedbackListProps = {};

/**
 * Displays listing of assigned requests for feedback from user
 */
const FeedbackList: FunctionComponent<FeedbackListProps> = () => {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const [users, setUsers] = useState([] as User[]);
  const [requests, setRequests] = useState([] as Request[]);

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

  useEffect(() => {
    const fetchRequest = async (): Promise<void> => {
      const response = await fetch(
        API_BASE + '/requests?completed=false&evaluatorId=' + user?.id,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // TODO handle errors
      const data = await response.json();
      setRequests(data);
    };
    fetchRequest();
  }, [token, user]);

  const handleSubmit = async (review: Review): Promise<void> => {
    const response = await fetch(API_BASE + '/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(review),
    });
    // TODO handle errors
    if (response.status < 300) {
      setRequests(
        requests.filter((request) => request._id !== review.requestId),
      );
    }
  };

  return (
    <Layout title={t('feedbackList.title')}>
      <Box alignItems="center" display="flex" flexDirection="column " p={2}>
        {!requests.length && (
          <Box m={2}>
            <Typography align="center" color="textSecondary">
              {t('feedbackList.noRequests')}
            </Typography>
          </Box>
        )}
        {requests.map((request) => {
          const user = users.find((user) => user._id === request.evaluateeId);
          if (!user) {
            return;
          }
          return (
            <Feedback
              key={request._id}
              onSubmit={handleSubmit}
              request={request}
              user={user}
            />
          );
        })}
      </Box>
    </Layout>
  );
};
export default FeedbackList;
