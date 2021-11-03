import * as React from "react";
import { i18nType } from "reducers/base/i18n";
import { FieldStateStatus } from "~/@types/shared";

interface SynchronizerProps {
  synced: boolean;
  syncError: string;
  i18n: i18nType;
  onFieldSavedStateChange?: (savedState: FieldStateStatus) => void;
}

interface SynchronizerState {
  displaySyncedMessage: boolean;
}

export default class Synchronizer extends React.PureComponent<SynchronizerProps, SynchronizerState> {
  constructor(props: SynchronizerProps){
    super(props);

    this.state = {
      displaySyncedMessage: false,
    }
  }

  /**
   * componentWillReceiveProps
   * @param nextProps
   */
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
   * @returns
   */
  render() {
    if (this.props.synced && !this.state.displaySyncedMessage && !this.props.syncError) {
      return null;
    }

    let message: string;
    let modifier: string;
    if (this.props.syncError) {
      message = this.props.i18n.text.get("plugin.workspace.materials.answerSavingFailed", this.props.syncError);
      modifier = "error";
      this.props.onFieldSavedStateChange ?
        this.props.onFieldSavedStateChange("ERROR") : null;
    } else if (!this.props.synced) {
      message = this.props.i18n.text.get("plugin.workspace.materials.answerSavingLabel");
      modifier = "saving";
      this.props.onFieldSavedStateChange ?
        this.props.onFieldSavedStateChange("SAVING") : null;
    } else if (this.state.displaySyncedMessage) {
      message = this.props.i18n.text.get("plugin.workspace.materials.answerSavedLabel");
      modifier = "saved";
      this.props.onFieldSavedStateChange ?
        this.props.onFieldSavedStateChange("SAVED") : null;
    }

    return (
      <span className={`material-page__field-answer-synchronizer material-page__field-answer-synchronizer--${modifier}`}>
        {message}
      </span>
    );
  }
}
