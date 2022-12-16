import * as React from "react";
import { i18nType } from "reducers/base/i18nOLD";
import { FieldStateStatus } from "~/@types/shared";

/**
 * SynchronizerProps
 */
interface SynchronizerProps {
  synced: boolean;
  syncError: string;
  i18nOLD: i18nType;
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
export default class Synchronizer extends React.PureComponent<
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
   * componentWillReceiveProps
   * @param nextProps nextProps
   */
  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps: SynchronizerProps) {
    if (nextProps.synced && !this.props.synced && !nextProps.syncError) {
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
      message = this.props.i18nOLD.text.get(
        "plugin.workspace.materials.answerSavingFailed",
        this.props.syncError
      );
      modifier = "error";
      this.props.onFieldSavedStateChange
        ? this.props.onFieldSavedStateChange("ERROR")
        : null;
    } else if (!this.props.synced) {
      message = this.props.i18nOLD.text.get(
        "plugin.workspace.materials.answerSavingLabel"
      );
      modifier = "saving";
      this.props.onFieldSavedStateChange
        ? this.props.onFieldSavedStateChange("SAVING")
        : null;
    } else if (this.state.displaySyncedMessage) {
      message = this.props.i18nOLD.text.get(
        "plugin.workspace.materials.answerSavedLabel"
      );
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
