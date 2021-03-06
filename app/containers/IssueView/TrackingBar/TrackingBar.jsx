// @flow
import React from 'react';
import moment from 'moment';
import {
  connect,
} from 'react-redux';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Connector,
} from 'react-redux';
import type {
  Issue,
  Dispatch,
  RemainingEstimate,
} from 'types';

import {
  getUiState,
  getTrackingIssue,
  getTimerState,
} from 'selectors';
import {
  timerActions,
  uiActions,
} from 'actions';
import {
  Flex,
} from 'components';
import {
  Transition,
} from 'react-transition-group';
import CameraIcon from '@atlaskit/icon/glyph/camera';
import Tooltip from '@atlaskit/tooltip';

import WorklogCommentDialog from './WorklogCommentDialog';
import {
  IssueName,
  Dot,
  Time,
  StopButton,
  Container,
} from './styled';


type Props = {
  time: number,
  screenshotUploading: boolean,
  screenshotsAllowed: boolean,
  trackingIssue: Issue,
  worklogComment: string,
  remainingEstimateValue: RemainingEstimate,
  remainingEstimateNewValue: string,
  remainingEstimateReduceByValue: string,
  dispatch: Dispatch,
}

function addLeadingZero(s: number): string {
  return s < 10 ? `0${s}` : `${s}`;
}

function getTimeString(time: number): string {
  const timeMoment = moment.duration(time * 1000);
  return [
    `${timeMoment.hours() ? `${addLeadingZero(timeMoment.hours())}:` : ''}`,
    `${addLeadingZero(timeMoment.minutes())}:${addLeadingZero(timeMoment.seconds())}`,
  ].join('');
}

const TrackingBar: StatelessFunctionalComponent<Props> = ({
  time,
  screenshotUploading,
  screenshotsAllowed,
  trackingIssue,
  worklogComment,
  remainingEstimateValue,
  remainingEstimateNewValue,
  remainingEstimateReduceByValue,
  dispatch,
}: Props): Node => (
  <Transition
    appear
    timeout={250}
    enter={false}
    expit={false}
  >
    <Container>
      <Flex row alignCenter>
        <WorklogCommentDialog
          comment={worklogComment}
          remainingEstimateValue={remainingEstimateValue}
          remainingEstimateNewValue={remainingEstimateNewValue}
          remainingEstimateReduceByValue={remainingEstimateReduceByValue}
          issue={trackingIssue}
          onSetComment={(comment) => {
            dispatch(uiActions.setUiState('worklogComment', comment));
          }}
          onRemainingEstimateChange={(value) => {
            dispatch(uiActions.setUiState('remainingEstimateValue', value));
          }}
          onRemainingEstimateNewChange={(value) => {
            dispatch(uiActions.setUiState('remainingEstimateNewValue', value));
          }}
          onRemainingEstimateReduceByChange={(value) => {
            dispatch(uiActions.setUiState('remainingEstimateReduceByValue', value));
          }}
        />
        {screenshotsAllowed &&
          <div style={{ marginLeft: 10 }}>
            <Tooltip
              description="Screenshots are enabled"
              position="bottom"
            >
              <CameraIcon
                size="large"
                primaryColor="white"
                label="Screenshots on"
              />
            </Tooltip>
          </div>
        }
      </Flex>
      <Flex row alignCenter>
        <IssueName
          onClick={() => {
            dispatch(uiActions.setUiState(
              'selectedIssueId',
              trackingIssue.id,
            ));
          }}
        >
          {trackingIssue.key}
        </IssueName>
        <Dot />
        <Time>
          {getTimeString(time)}
        </Time>
      </Flex>
      <div
        onClick={() => {
          if (screenshotUploading) {
            // eslint-disable-next-line no-alert
            window.alert(
              'Currently app in process of uploading screenshot, wait few seconds please',
            );
          } else {
            dispatch(timerActions.stopTimerRequest());
          }
        }}
      >
        <StopButton
          alt="stop"
          onClick={() => {
            dispatch(timerActions.stopTimerRequest());
          }}
        />
      </div>
    </Container>
  </Transition>
);

function mapStateToProps(state) {
  return {
    time: getTimerState('time')(state),
    screenshotUploading: false,
    screenshotsAllowed: false,
    trackingIssue: getTrackingIssue(state),
    worklogComment: getUiState('worklogComment')(state),
    remainingEstimateValue: getUiState('remainingEstimateValue')(state),
    remainingEstimateNewValue: getUiState('remainingEstimateNewValue')(state),
    remainingEstimateReduceByValue: getUiState('remainingEstimateReduceByValue')(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(TrackingBar);
