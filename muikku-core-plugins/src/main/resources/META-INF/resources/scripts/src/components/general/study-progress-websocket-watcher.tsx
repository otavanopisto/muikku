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

  // Websocket state is missing when using Muikku as unlogged user
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
 * @param handlers handlers that receive data from websocket
 * @param websocket websocket
 */
function useWebsocketEvent<T>(
  eventName: string,
  handlers: Array<(data: T) => void>,
  websocket?: WebsocketStateType["websocket"]
) {
  React.useEffect(() => {
    if (!websocket) return;

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
    [
      (data) => recordsSummarySuggestedNextWebsocket({ websocketData: data }),
      (data) =>
        guiderStudyProgressSuggestedNextWebsocket({ websocketData: data }),
    ],
    websocketState.websocket
  );

  // hops:workspace-signup watcher
  useWebsocketEvent<StudentStudyActivity | StudentStudyActivity[]>(
    "hops:workspace-signup",
    [
      (data) => recordsSummaryWorkspaceSignupWebsocket({ websocketData: data }),
      (data) =>
        guiderStudyProgressWorkspaceSignupWebsocket({ websocketData: data }),
    ],
    websocketState.websocket
  );

  // hops:alternative-study-options watcher
  useWebsocketEvent<string[]>(
    "hops:alternative-study-options",
    [
      (data) =>
        recordsSummaryAlternativeStudyOptionsWebsocket({
          websocketData: data,
        }),
      (data) =>
        guiderStudyProgressAlternativeStudyOptionsWebsocket({
          websocketData: data,
        }),
    ],
    websocketState.websocket
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
