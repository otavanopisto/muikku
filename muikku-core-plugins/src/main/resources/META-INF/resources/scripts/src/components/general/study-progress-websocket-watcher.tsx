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
  GuiderStudyProgressAlternativeStudyOptionsWebsocketType,
  guiderStudyProgressAlternativeStudyOptionsWebsocket,
} from "~/actions/main-function/guider";
import {
  RecordsSummarySuggestedNextWebsocketType,
  recordsSummarySuggestedNextWebsocket,
  recordsSummaryWorkspaceSignupWebsocket,
  RecordsSummaryWorkspaceSignupWebsocketType,
  recordsSummaryAlternativeStudyOptionsWebsocket,
  RecordsSummaryAlternativeStudyOptionsWebsocketType,
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
  recordsSummaryAlternativeStudyOptionsWebsocket: RecordsSummaryAlternativeStudyOptionsWebsocketType;

  // Guider related actions
  guiderStudyProgressSuggestedNextWebsocket: GuiderStudyProgressSuggestedNextWebsocketType;
  guiderStudyProgressWorkspaceSignupWebsocket: GuiderStudyProgressWorkspaceSignupWebsocketType;
  guiderStudyProgressAlternativeStudyOptionsWebsocket: GuiderStudyProgressAlternativeStudyOptionsWebsocketType;
}

/**
 * Custom hook to watch websocket events
 * @param eventName event name
 * @param websocket websocket
 * @param handlers handlers that receive data from websocket
 */
function useWebsocketEvent<T>(
  eventName: string,
  websocket: WebsocketStateType["websocket"],
  handlers: Array<(data: T) => void>
) {
  React.useEffect(() => {
    /**
     * onAnswerSavedAtServer
     * @param data data
     */
    const onAnswerSavedAtServer = (data: T) => {
      handlers.forEach((handler) => handler(data));
    };

    websocket.addEventCallback(eventName, onAnswerSavedAtServer);

    return () => {
      websocket.removeEventCallback(eventName, onAnswerSavedAtServer);
    };
  }, [eventName, handlers, websocket]);
}

/**
 * Component to watch websocket events for study progress
 * and update the redux state accordingly:
 * - hops:workspace-suggested
 * - hops:workspace-signup
 * - hops:alternative-study-options
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
    recordsSummaryAlternativeStudyOptionsWebsocket,
    guiderStudyProgressSuggestedNextWebsocket,
    guiderStudyProgressWorkspaceSignupWebsocket,
    guiderStudyProgressAlternativeStudyOptionsWebsocket,
  } = props;

  // hops:workspace-suggested watcher
  useWebsocketEvent<StudentStudyActivity>(
    "hops:workspace-suggested",
    websocketState.websocket,
    [
      (data) => recordsSummarySuggestedNextWebsocket({ websocketData: data }),
      (data) =>
        guiderStudyProgressSuggestedNextWebsocket({ websocketData: data }),
    ]
  );

  // hops:workspace-signup watcher
  useWebsocketEvent<StudentStudyActivity | StudentStudyActivity[]>(
    "hops:workspace-signup",
    websocketState.websocket,
    [
      (data) => recordsSummaryWorkspaceSignupWebsocket({ websocketData: data }),
      (data) =>
        guiderStudyProgressWorkspaceSignupWebsocket({ websocketData: data }),
    ]
  );

  // hops:alternative-study-options watcher
  useWebsocketEvent<string[]>(
    "hops:alternative-study-options",
    websocketState.websocket,
    [
      (data) =>
        recordsSummaryAlternativeStudyOptionsWebsocket({
          websocketData: data,
        }),
      (data) =>
        guiderStudyProgressAlternativeStudyOptionsWebsocket({
          websocketData: data,
        }),
    ]
  );

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
      recordsSummaryAlternativeStudyOptionsWebsocket,
      guiderStudyProgressSuggestedNextWebsocket,
      guiderStudyProgressWorkspaceSignupWebsocket,
      guiderStudyProgressAlternativeStudyOptionsWebsocket,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudyProgressWebsocketWatcher);
