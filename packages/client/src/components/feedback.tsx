import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Rating from '@material-ui/lab/Rating';

import { Request, Review, User } from '..';
import getGravatarUrl from '../utilities/get-gravatar-url';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: 700,
      maxWidth: '100%',
    },
  }),
);

/**
 * Labels for feedback
 */
const ratingLabels: { [index: string]: string } = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

type FeedbackProps = {
  user: User;
  request: Request;
  onSubmit: (review: Review) => void;
};

const Feedback: FunctionComponent<FeedbackProps> = ({
  user,
  request,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [rating, setRating] = useState<number | null>(null);
  const [ratingHover, setRatingHover] = useState(-1);
  const [feedback, setFeedback] = useState<string>('');

  const handleRatingChange = (
    ev: React.ChangeEvent<{}>,
    value: number | null,
  ): void => {
    setRating(value);
  };
  const handleRatingActiveChange = (
    ev: React.ChangeEvent<{}>,
    hoverValue: number,
  ): void => {
    setRatingHover(hoverValue);
  };

  const handleFeedbackChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setFeedback(event.target.value);
  };

  const handleSendClick = (): void => {
    if (!rating) {
      return;
    }
    onSubmit({
      requestId: request._id,
      rating,
      feedback,
    });
  };

  //   Get rating label depending on current value or hover value
  const ratingLabel =
    ratingHover >= 0
      ? ratingLabels[ratingHover]
      : rating && ratingLabels[rating];

  return (
    <ExpansionPanel className={classes.root}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Box alignItems="center" display="flex" flex="1">
          <Avatar src={getGravatarUrl(user.email)} />
          <Box p="0 10px">
            <Typography>{user.name}</Typography>
          </Box>
        </Box>
        <Box alignSelf="center">
          <Typography color="textSecondary" variant="body2">
            {t('feedback.awaitingFeedback')}
          </Typography>
        </Box>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Box display="flex" flex="1" justifyContent="space-between">
          <Box flex="1">
            <Box>
              <Typography color="textSecondary" variant="caption">
                {t('feedback.ratingLabel')}
              </Typography>
            </Box>
            <Box alignItems="center" display="flex" mb={2} mt={1}>
              <Rating
                name={'rating' + user._id}
                onChange={handleRatingChange}
                onChangeActive={handleRatingActiveChange}
                precision={0.5}
                value={rating}
              />
              {ratingLabel && (
                <Box ml={2}>
                  <Typography color="textSecondary" variant="body2">
                    {ratingLabel}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          <Box flex="2" ml={5} mt={0.5}>
            <TextField
              color="secondary"
              fullWidth
              label={t('feedback.feedbackLabel')}
              multiline
              onChange={handleFeedbackChange}
              rowsMax="4"
              value={feedback}
            />
          </Box>
        </Box>
      </ExpansionPanelDetails>
      <Divider />
      <ExpansionPanelActions>
        <Button disabled={!rating} onClick={handleSendClick} size="small">
          {t('feedback.sendButton')}
        </Button>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};

export default Feedback;
