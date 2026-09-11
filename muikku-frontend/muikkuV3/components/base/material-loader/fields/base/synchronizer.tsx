import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { FieldStateStatus } from "~/@types/shared";

const synchronizerTransition = {
  type: "tween" as const,
  duration: 0.2,
  ease: "easeOut" as const,
};
const synchronizerVisible = { opacity: 1, y: 0 };
const synchronizerHidden = { opacity: 0, y: 4 };

/**
 * SynchronizerProps
 */
interface SynchronizerProps extends WithTranslation {
  synced: boolean;
  syncError: string;
  onFieldSavedStateChange?: (savedState: FieldStateStatus) => void;
  /** Keep the span in the DOM and hide it when idle. Default: unmount (current behavior). */
  alwaysPresent?: boolean;
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
  private lastMessage = "";
  private lastModifier: string | undefined;

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

    let message = "";
    let modifier: string | undefined;
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
    } else if (status === "SAVED") {
      message = t("notifications.saved", {
        ns: "materials",
      });
      modifier = "saved";
    }

    // If the status is present, update the last message and modifier
    if (status) {
      this.lastMessage = message;
      this.lastModifier = modifier;
    }

    // If the status is not present, use the last message and modifier
    // This is used to keep the message and modifier visible when the status changes
    // to avoid flickering during the transition
    const visibleMessage = message || this.lastMessage;
    const visibleModifier = modifier || this.lastModifier;
    const className = [
      "material-page__field-answer-synchronizer",
      visibleModifier &&
        `material-page__field-answer-synchronizer--${visibleModifier}`,
    ]
      .filter(Boolean)
      .join(" ");

    // If the status is not present, and we are not always present, don't show the synchronizer
    const show = Boolean(status) || this.props.alwaysPresent;
    return (
      <AnimatePresence>
        {show && (
          <motion.span
            key="synchronizer"
            className={className}
            initial={synchronizerHidden}
            animate={status ? synchronizerVisible : synchronizerHidden}
            exit={synchronizerHidden}
            transition={synchronizerTransition}
            aria-hidden={!status}
          >
            {visibleMessage}
          </motion.span>
        )}
      </AnimatePresence>
    );
  }
}

export default withTranslation(["materials", "common"])(Synchronizer);
