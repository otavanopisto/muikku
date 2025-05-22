import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StateType } from "~/reducers";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import "~/sass/elements/readspeaker.scss";
import { useReadspeakerContext } from "../context/readspeaker-context";
import { StatusType } from "~/reducers/base/status";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * ReadSpeakerReaderProps
 */
interface ReadSpeakerReaderProps {
  entityId?: number;
  /**
   * Read parameter type (readid or readclass)
   */
  readParameterType: "readid" | "readclass";
  /**
   * Read parameters
   */
  readParameters: string[];
  /**
   * Handles display notification from redux side
   */
  displayNotification: DisplayNotificationTriggerType;
  /**
   * Edit mode
   */
  editMode: boolean;
  /**
   * Status info
   */
  status: StatusType;
}

/**
 * Creates ReadSpeaker reader button
 * initialized webReader script if not already initialized.
 * Component is used where webReader is needed.
 *
 * @param props props
 * @returns JSX.Element
 */
const ReadSpeakerReader = (props: ReadSpeakerReaderProps) => {
  const { readParameterType, editMode, entityId, status } = props;

  const { rspkr, rspkrLoaded } = useReadspeakerContext();

  React.useEffect(() => {
    const rspkrValue = rspkrLoaded ? rspkr.current : undefined;

    // Add click events to ReadSpeaker button
    // when webReader is initialized and edit mode is not active
    if (!editMode && rspkrValue && rspkrValue.ui) {
      rspkrValue.q(function () {
        rspkrValue.ui.addClickEvents();
      });
    }

    // Close player when edit mode is activated
    if (
      editMode &&
      rspkrValue &&
      rspkrValue.ui &&
      rspkrValue.ui.getActivePlayer()
    ) {
      rspkrValue.ui.destroyActivePlayer();
    }

    // Close player when component is unmounted
    return () => {
      if (rspkrValue && rspkrValue.ui && rspkrValue.ui.getActivePlayer()) {
        rspkrValue.ui.getActivePlayer().close();
      }
    };
  }, [rspkr, rspkrLoaded, editMode]);

  const readParameters =
    props.readParameters.length > 0
      ? props.readParameters.join()
      : props.readParameters[0];

  if (!status.loggedIn || !rspkr.current || editMode) return null;

  return (
    <div
      id={entityId ? `readspeaker_button${entityId}` : "readspeaker_button0"}
      className="rs_skip rsbtn muikku rs_preserve"
    >
      <a
        rel="nofollow"
        className="rsbtn_play"
        accessKey="L"
        href={`https://app-eu.readspeaker.com/cgi-bin/rsent?customerid=13624&lang=fi_fi&${readParameterType}=${readParameters}&url=${encodeURIComponent(
          document.location.href
        )}`}
      >
        <span className="rsbtn_right rsimg rsplay rspart"></span>
      </a>
    </div>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    editMode: state.workspaces.editMode.active,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReadSpeakerReader);

/**
 * ReactCommentProps
 */
interface ReadspeakerMessageProps {
  text: string;
}

/**
 * ReadspeakerMessageProps
 *
 * @param props props
 * @returns JSX.Element
 */
export const ReadspeakerMessage = (props: ReadspeakerMessageProps) => (
  <span
    className="rs_message"
    dangerouslySetInnerHTML={{ __html: `<!-- ${props.text} -->` }}
  />
);
