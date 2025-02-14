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
 * Synchronizer
 */
class Synchronizer extends React.PureComponent<
  SynchronizerProps,
  SynchronizerState
> {
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
   * componentDidUpdate
   * @param prevProps previous props
   */
  componentDidUpdate(prevProps: SynchronizerProps) {
    if (this.props.synced && !prevProps.synced && !this.props.syncError) {
      this.setState({
        displaySyncedMessage: true,
      });

      setTimeout(() => {
        this.setState({
          displaySyncedMessage: false,
        });
      }, 1000);
    }
  }

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    if (
      this.props.synced &&
      !this.state.displaySyncedMessage &&
      !this.props.syncError
    ) {
      return null;
    }

    let message: string;
    let modifier: string;
    if (this.props.syncError) {
      message = t("notifications.saveError", {
        ns: "materials",
        error: this.props.syncError,
      });

      modifier = "error";
      this.props.onFieldSavedStateChange
        ? this.props.onFieldSavedStateChange("ERROR")
        : null;
    } else if (!this.props.synced) {
      message = t("notifications.saving", {
        ns: "materials",
      });

      modifier = "saving";
      this.props.onFieldSavedStateChange
        ? this.props.onFieldSavedStateChange("SAVING")
        : null;
    } else if (this.state.displaySyncedMessage) {
      message = t("notifications.saved", {
        ns: "materials",
      });
      modifier = "saved";
      this.props.onFieldSavedStateChange
        ? this.props.onFieldSavedStateChange("SAVED")
        : null;
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
