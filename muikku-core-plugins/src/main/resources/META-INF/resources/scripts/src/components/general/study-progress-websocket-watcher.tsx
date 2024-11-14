import * as React from "react";
import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import {
  GuiderStudyProgressSuggestedNextWebsocketType,
  GuiderStudyProgressWorkspaceSignupWebsocketType,
  guiderStudyProgressSuggestedNextWebsocket,
  guiderStudyProgressWorkspaceSignupWebsocket,
} from "~/actions/main-function/guider";
import {
  RecordsSummarySuggestedNextWebsocketType,
  recordsSummarySuggestedNextWebsocket,
  recordsSummaryWorkspaceSignupWebsocket,
  RecordsSummaryWorkspaceSignupWebsocketType,
} from "~/actions/main-function/records/summary";
import { StudentStudyActivity } from "~/generated/client";
import { StateType } from "~/reducers";
import { WebsocketStateType } from "~/reducers/util/websocket";

/**
 * StudyProgressWebsocketWatcherProps
 */
interface StudyProgressWebsocketWatcherProps {
  children: React.ReactNode;
  websocketState: WebsocketStateType;

  // Records related actions
  recordsSummarySuggestedNextWebsocket: RecordsSummarySuggestedNextWebsocketType;
  recordsSummaryWorkspaceSignupWebsocket: RecordsSummaryWorkspaceSignupWebsocketType;

  // Guider related actions
  guiderStudyProgressSuggestedNextWebsocket: GuiderStudyProgressSuggestedNextWebsocketType;
  guiderStudyProgressWorkspaceSignupWebsocket: GuiderStudyProgressWorkspaceSignupWebsocketType;
}

/**
 * Component to watch websocket events for study progress
 * and update the redux state accordingly:
 * - hops:workspace-suggested
 * - hops:workspace-signup
 * @param props props
 * @returns JSX.Element
 */
const StudyProgressWebsocketWatcher = (
  props: StudyProgressWebsocketWatcherProps
) => {
  const {
    children,
    websocketState,
    recordsSummarySuggestedNextWebsocket,
    recordsSummaryWorkspaceSignupWebsocket,
    guiderStudyProgressSuggestedNextWebsocket,
    guiderStudyProgressWorkspaceSignupWebsocket,
  } = props;

  // hops:workspace-suggested watcher
  React.useEffect(() => {
    /**
     * Websocket event callback to handle answer from server when
     * something is saved/changed. Data is passed to redux actions
     * @param data Websocket data
     */
    const onAnswerSavedAtServer = (data: StudentStudyActivity) => {
      recordsSummarySuggestedNextWebsocket({
        websocketData: data,
      });
      guiderStudyProgressSuggestedNextWebsocket({
        websocketData: data,
      });
    };

    // Adding event callback to handle changes when ever
    // there has happened some changes with that message
    websocketState.websocket.addEventCallback(
      "hops:workspace-suggested",
      onAnswerSavedAtServer
    );

    return () => {
      // Remove callback when unmounting
      websocketState.websocket.removeEventCallback(
        "hops:workspace-suggested",
        onAnswerSavedAtServer
      );
    };
  }, [
    recordsSummarySuggestedNextWebsocket,
    guiderStudyProgressSuggestedNextWebsocket,
    websocketState.websocket,
  ]);

  // hops:workspace-signup watcher
  React.useEffect(() => {
    /**
     * Websocket event callback to handle answer from server when
     * something is saved/changed. Data is passed to redux actions
     * @param data Websocket data
     */
    const onAnswerSavedAtServer = (
      data: StudentStudyActivity | StudentStudyActivity[]
    ) => {
      recordsSummaryWorkspaceSignupWebsocket({
        websocketData: data,
      });
      guiderStudyProgressWorkspaceSignupWebsocket({
        websocketData: data,
      });
    };

    websocketState.websocket.addEventCallback(
      "hops:workspace-signup",
      onAnswerSavedAtServer
    );

    return () => {
      websocketState.websocket.removeEventCallback(
        "hops:workspace-signup",
        onAnswerSavedAtServer
      );
    };
  }, [
    recordsSummaryWorkspaceSignupWebsocket,
    guiderStudyProgressWorkspaceSignupWebsocket,
    websocketState.websocket,
  ]);

  return <>{children}</>;
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    websocketState: state.websocket,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      recordsSummarySuggestedNextWebsocket,
      recordsSummaryWorkspaceSignupWebsocket,
      guiderStudyProgressSuggestedNextWebsocket,
      guiderStudyProgressWorkspaceSignupWebsocket,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudyProgressWebsocketWatcher);
