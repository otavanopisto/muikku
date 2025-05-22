import * as React from "react";
import {
  guiderStudyProgressSuggestedNextWebsocket,
  guiderStudyProgressWorkspaceSignupWebsocket,
  guiderStudyProgressAlternativeStudyOptionsWebsocket,
} from "~/actions/main-function/guider";
import {
  recordsSummarySuggestedNextWebsocket,
  recordsSummaryWorkspaceSignupWebsocket,
  recordsSummaryAlternativeStudyOptionsWebsocket,
} from "~/actions/main-function/records/summary";
import { StudentStudyActivity } from "~/generated/client";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "~/reducers/configureStore";
import { WebsocketStateType } from "~/reducers/util/websocket";

/**
 * StudyProgressWebsocketWatcherProps
 */
interface StudyProgressWebsocketWatcherProps {
  children: React.ReactNode;
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
  const dispatch = useAppDispatch();

  const websocketState = useAppSelector((state: RootState) => state.websocket);

  const { children } = props;

  // hops:workspace-suggested watcher
  useWebsocketEvent<StudentStudyActivity>(
    "hops:workspace-suggested",
    [
      (data) =>
        dispatch(recordsSummarySuggestedNextWebsocket({ websocketData: data })),
      (data) =>
        dispatch(
          guiderStudyProgressSuggestedNextWebsocket({ websocketData: data })
        ),
    ],
    websocketState.websocket
  );

  // hops:workspace-signup watcher
  useWebsocketEvent<StudentStudyActivity | StudentStudyActivity[]>(
    "hops:workspace-signup",
    [
      (data) =>
        dispatch(
          recordsSummaryWorkspaceSignupWebsocket({ websocketData: data })
        ),
      (data) =>
        dispatch(
          guiderStudyProgressWorkspaceSignupWebsocket({ websocketData: data })
        ),
    ],
    websocketState.websocket
  );

  // hops:alternative-study-options watcher
  useWebsocketEvent<string[]>(
    "hops:alternative-study-options",
    [
      (data) =>
        dispatch(
          recordsSummaryAlternativeStudyOptionsWebsocket({
            websocketData: data,
          })
        ),
      (data) =>
        dispatch(
          guiderStudyProgressAlternativeStudyOptionsWebsocket({
            websocketData: data,
          })
        ),
    ],
    websocketState.websocket
  );

  return <>{children}</>;
};

/**
 * mapStateToProps
 * @param state state
 */
/* function mapStateToProps(state: StateType) {
  return {
    websocketState: state.websocket,
  };
} */

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
/* function mapDispatchToProps(dispatch: AppDispatch) {
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
} */

export default StudyProgressWebsocketWatcher;
