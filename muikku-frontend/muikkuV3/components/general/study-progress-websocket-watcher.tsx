import * as React from "react";
import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import {
  GuiderWorkspaceSuggestedWebsocketType,
  GuiderWorkspaceSignupWebsocketType,
  guiderWorkspaceSuggestedWebsocket,
  guiderWorkspaceSignupWebsocket,
} from "~/actions/main-function/guider";
import {
  StudyActivityWorkspaceSignupWebsocketTriggerType,
  StudyActivityWorkspaceSuggestedWebsocketTriggerType,
  studyActivityWorkspaceSuggestedWebsocket,
  studyActivityWorkspaceSignupWebsocket,
} from "~/actions/study-activity";
import { StudyActivityItem } from "~/generated/client";
import { StateType } from "~/reducers";
import { WebsocketStateType } from "~/reducers/util/websocket";

/**
 * StudyProgressWebsocketWatcherProps
 */
interface StudyProgressWebsocketWatcherProps {
  children: React.ReactNode;

  // Websocket state is missing when using Muikku as unlogged user
  websocketState: WebsocketStateType;

  // Study activity related actions
  studyActivityWorkspaceSuggestedWebsocket: StudyActivityWorkspaceSuggestedWebsocketTriggerType;
  studyActivityWorkspaceSignupWebsocket: StudyActivityWorkspaceSignupWebsocketTriggerType;

  // Guider related actions
  guiderWorkspaceSuggestedWebsocket: GuiderWorkspaceSuggestedWebsocketType;
  guiderWorkspaceSignupWebsocket: GuiderWorkspaceSignupWebsocketType;
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
 * @param props props
 * @returns JSX.Element
 */
const StudyProgressWebsocketWatcher = (
  props: StudyProgressWebsocketWatcherProps
) => {
  const {
    children,
    websocketState,
    studyActivityWorkspaceSuggestedWebsocket,
    studyActivityWorkspaceSignupWebsocket,
    guiderWorkspaceSuggestedWebsocket,
    guiderWorkspaceSignupWebsocket,
  } = props;

  // hops:workspace-suggested watcher
  useWebsocketEvent<{
    id: number;
    name: string;
    subject: string;
    courseNumber: number;
    status: string;
    description: string | null;
    courseId: number;
    created: string;
    studentIdentifier: string;
  }>(
    "hops:workspace-suggested",
    [
      (data) =>
        studyActivityWorkspaceSuggestedWebsocket({ websocketData: data }),
      (data) => guiderWorkspaceSuggestedWebsocket({ websocketData: data }),
    ],
    websocketState.websocket
  );

  // hops:workspace-signup watcher
  useWebsocketEvent<StudyActivityItem[]>(
    "hops:workspace-signup",
    [
      (data) => studyActivityWorkspaceSignupWebsocket({ websocketData: data }),
      (data) => guiderWorkspaceSignupWebsocket({ websocketData: data }),
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
      studyActivityWorkspaceSuggestedWebsocket,
      studyActivityWorkspaceSignupWebsocket,
      guiderWorkspaceSuggestedWebsocket,
      guiderWorkspaceSignupWebsocket,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudyProgressWebsocketWatcher);
