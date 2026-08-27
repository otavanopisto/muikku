import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { FieldStateStatus } from "~/@types/shared";

/**
 * SynchronizerProps
 */
interface SynchronizerProps extends WithTranslation {
  synced: boolean;
  syncError: string;
  onFieldSavedStateChange?: (savedState: FieldStateStatus) => void;
}

/**
 * SynchronizerState
 */
interface SynchronizerState {
  displaySyncedMessage: boolean;
}

/**
 * Visible synchronizer status, or null when the label is hidden.
 * @param synced synced
 * @param syncError syncError
 * @param displaySyncedMessage displaySyncedMessage
 */
function getFieldSavedState(
  synced: boolean,
  syncError: string,
  displaySyncedMessage: boolean
): FieldStateStatus | null {
  if (syncError) {
    return "ERROR";
  }
  if (!synced) {
    return "SAVING";
  }
  if (displaySyncedMessage) {
    return "SAVED";
  }
  return null;
}

/**
 * Synchronizer
 */
class Synchronizer extends React.PureComponent<
  SynchronizerProps,
  SynchronizerState
> {
  private lastNotifiedState: FieldStateStatus | null = null;
  private savedMessageTimeout: ReturnType<typeof setTimeout> | null = null;

  /**
   * constructor
   * @param props props
   */
  constructor(props: SynchronizerProps) {
    super(props);

    this.state = {
      displaySyncedMessage: false,
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    this.notifyFieldSavedState();
  }

  /**
   * componentDidUpdate
   * @param prevProps previous props
   */
  componentDidUpdate(prevProps: SynchronizerProps) {
    if (this.props.synced && !prevProps.synced && !this.props.syncError) {
      this.setState({
        displaySyncedMessage: true,
      });

      if (this.savedMessageTimeout) {
        clearTimeout(this.savedMessageTimeout);
      }
      this.savedMessageTimeout = setTimeout(() => {
        this.setState({
          displaySyncedMessage: false,
        });
      }, 1000);
    }

    this.notifyFieldSavedState();
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    if (this.savedMessageTimeout) {
      clearTimeout(this.savedMessageTimeout);
    }
  }

  /**
   * Notify parent only when ERROR / SAVING / SAVED actually changes.
   */
  notifyFieldSavedState() {
    const nextState = getFieldSavedState(
      this.props.synced,
      this.props.syncError,
      this.state.displaySyncedMessage
    );
    if (nextState === this.lastNotifiedState) {
      return;
    }
    this.lastNotifiedState = nextState;
    if (nextState && this.props.onFieldSavedStateChange) {
      this.props.onFieldSavedStateChange(nextState);
    }
  }

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;
    const status = getFieldSavedState(
      this.props.synced,
      this.props.syncError,
      this.state.displaySyncedMessage
    );

    if (!status) {
      return null;
    }

    let message: string;
    let modifier: string;
    if (status === "ERROR") {
      message = t("notifications.saveError", {
        ns: "materials",
        error: this.props.syncError,
      });
      modifier = "error";
    } else if (status === "SAVING") {
      message = t("notifications.saving", {
        ns: "materials",
      });
      modifier = "saving";
    } else {
      message = t("notifications.saved", {
        ns: "materials",
      });
      modifier = "saved";
    }

    return (
      <span
        className={`material-page__field-answer-synchronizer material-page__field-answer-synchronizer--${modifier}`}
      >
        {message}
      </span>
    );
  }
}

export default withTranslation(["materials", "common"])(Synchronizer);
