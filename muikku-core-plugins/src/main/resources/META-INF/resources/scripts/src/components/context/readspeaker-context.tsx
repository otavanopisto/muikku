import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";
import {
  UseReadspeakerReader,
  useReadSpeakerReader,
} from "~/hooks/useReadSpeakerReader";
import { StateType } from "~/reducers";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * ReadspeakerContextValue
 */
interface ReadspeakerContextValue extends UseReadspeakerReader {}

/**
 * ReadspeakerProviderProps
 */
interface ReadspeakerProviderProps {
  displayNotification: DisplayNotificationTriggerType;
  children: React.ReactNode;
}

export const ReadspeakerContext = React.createContext<
  ReadspeakerContextValue | undefined
>(undefined);

/**
 * Method to returns context of readspeaker.
 * @param props props
 */
function ReadspeakerProvider(props: ReadspeakerProviderProps) {
  const useReadSpeakerValues = useReadSpeakerReader(props.displayNotification);

  return (
    <ReadspeakerContext.Provider value={useReadSpeakerValues}>
      {props.children}
    </ReadspeakerContext.Provider>
  );
}

/**
 * Method to returns context of readspeaker.
 * Check if context is defined and if not, throw an error
 */
function useReadspeakerContext() {
  const context = React.useContext(ReadspeakerContext);
  if (context === undefined) {
    throw new Error(
      "useReadspeakerContext must be used within a ReadspeakerProvider"
    );
  }
  return context;
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {};
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    {
      displayNotification,
    },
    dispatch
  );
}

export { useReadspeakerContext };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReadspeakerProvider);
