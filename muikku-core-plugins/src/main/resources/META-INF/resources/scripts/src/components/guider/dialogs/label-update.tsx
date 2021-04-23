import * as React from "react";
import Dialog from "~/components/general/dialog";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
//Another weird typescript bug, won't import properly
import { ChromePicker, ColorState } from "react-color";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";

import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";

import { GuiderUserLabelType } from "~/reducers/main-function/guider";
import {
  UpdateGuiderFilterLabelTriggerType,
  RemoveGuiderFilterLabelTriggerType,
  updateGuiderFilterLabel,
  removeGuiderFilterLabel,
} from "~/actions/main-function/guider";
import GuiderLabelShareDialog from "./label-share";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import "~/sass/elements/glyph.scss";
import "~/sass/elements/color-picker.scss";
import * as queryString from "query-string";

const KEYCODES = {
  ENTER: 13,
};

interface GuiderLabelUpdateDialogProps {
  children: React.ReactElement<any>;
  label: GuiderUserLabelType;
  isOpen?: boolean;
  onClose?: () => any;
  i18n: i18nType;
  updateGuiderFilterLabel: UpdateGuiderFilterLabelTriggerType;
  removeGuiderFilterLabel: RemoveGuiderFilterLabelTriggerType;
}

interface GuiderLabelUpdateDialogState {
  displayColorPicker: boolean;
  color: string;
  name: string;
  description: string;
  removed: boolean;
  locked: boolean;
}

class GuiderLabelUpdateDialog extends React.Component<
  GuiderLabelUpdateDialogProps,
  GuiderLabelUpdateDialogState
> {
  constructor(props: GuiderLabelUpdateDialogProps) {
    super(props);

    this.onColorChange = this.onColorChange.bind(this);
    this.onHandleClick = this.onHandleClick.bind(this);
    this.onHandleClose = this.onHandleClose.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.removeLabel = this.removeLabel.bind(this);
    this.update = this.update.bind(this);
    this.resetState = this.resetState.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);

    this.state = {
      displayColorPicker: false,
      color: props.label.color,
      name: props.label.name,
      description: props.label.description,
      removed: false,
      locked: false,
    };
  }
  onHandleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };
  onHandleClose = () => {
    this.setState({ displayColorPicker: false });
  };
  handleKeydown(code: number, closeDialog: () => any) {
    if (code === KEYCODES.ENTER) {
      this.update(closeDialog);
    }
  }
  componentWillReceiveProps(nextProps: GuiderLabelUpdateDialogProps) {
    if (nextProps.label.id !== this.props.label.id) {
      this.resetState(null, nextProps);
    }
  }
  resetState(e: HTMLElement, props = this.props): void {
    this.setState({
      color: props.label.color,
      removed: false,
      name: props.label.name,
      description: props.label.description,
    });
  }
  onColorChange(color: ColorState) {
    if (this.state.removed) {
      return;
    }
    this.setState({ color: color.hex });
  }
  onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ name: e.target.value });
  }
  onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({ description: e.target.value });
  }
  removeLabel() {
    this.setState({ removed: true });
  }
  update(closeDialog: () => any) {
    // If this is a delete operation, it matters if we have selected the label we are deleting

    const locationData = queryString.parse(
      document.location.hash.split("?")[1] || "",
      { arrayFormat: "bracket" }
    );

    if (this.state.locked) {
      return;
    }
    const success = () => {
      // If there are no labels selected, no need for this

      if (locationData.l) {
        //  Locationdata returns an array of strings --> turn them into numbers
        //  so we can see if we are in the location we wish to remove

        const labelIds: number[] = locationData.l.map((element: string) =>
          parseInt(element)
        );

        // Find out if we are removeing current location

        const removeCurrentLocation =
          this.state.removed && labelIds.includes(this.props.label.id);

        if (removeCurrentLocation) {
          //  Remove the removed label from the locationdata if we are removing current location
          // and turn the object into a querystring again

          const newLocationData = Object.assign({}, locationData, {
            l: labelIds.filter((id) => id !== this.props.label.id),
          });
          window.location.hash =
            "#?" +
            queryString.stringify(newLocationData, { arrayFormat: "bracket" });
        }
      }

      this.setState({
        locked: false,
      });
      closeDialog();
    };
    const fail = () => {
      this.setState({
        locked: false,
      });
    };
    if (
      (this.state.name !== this.props.label.name ||
        this.state.color !== this.props.label.color ||
        this.state.description !== this.props.label.description) &&
      !this.state.removed
    ) {
      this.setState({
        locked: true,
      });
      this.props.updateGuiderFilterLabel({
        label: this.props.label,
        name: this.state.name,
        description: this.state.description,
        color: this.state.color,
        success,
        fail,
      });
    } else if (this.state.removed) {
      this.setState({
        locked: true,
      });
      this.props.removeGuiderFilterLabel({
        label: this.props.label,
        success,
        fail,
      });
    } else {
      closeDialog();
    }
  }
  render() {
    let footer = (closeDialog: () => any) => {
      return (
        <div className="dialog__button-set">
          <Button
            buttonModifiers={["success", "standard-ok"]}
            disabled={this.state.locked}
            onClick={this.update.bind(this, closeDialog)}
          >
            {this.props.i18n.text.get(
              "plugin.guider.flags.editFlagDialog.save"
            )}
          </Button>
          <Button
            buttonModifiers={["cancel", "standard-cancel"]}
            disabled={this.state.locked}
            onClick={closeDialog}
          >
            {this.props.i18n.text.get(
              "plugin.guider.flags.editFlagDialog.cancel"
            )}
          </Button>
          <GuiderLabelShareDialog label={this.props.label}>
            <Button
              buttonModifiers={["info", "guider-share-label"]}
              disabled={this.state.removed || this.state.locked}
            >
              {this.props.i18n.text.get("plugin.guider.flags.shareFlag.label")}
            </Button>
          </GuiderLabelShareDialog>
          <Button
            buttonModifiers={["fatal", "guider-remove-label"]}
            disabled={this.state.removed || this.state.locked}
            onClick={this.removeLabel}
          >
            {this.state.removed
              ? this.props.i18n.text.get(
                  "plugin.guider.flags.confirmFlagDelete.deleted"
                )
              : this.props.i18n.text.get(
                  "plugin.guider.flags.removeFlag.label"
                )}
          </Button>
        </div>
      );
    };
    let sliderPicker = (
      <ChromePicker
        disableAlpha
        color={this.state.removed ? "#aaa" : this.state.color}
        onChange={this.onColorChange}
      />
    );
    let content = (closeDialog: () => any) => {
      return (
        <div
          className="dialog__content-row dialog__content-row--label"
          style={{ opacity: this.state.removed ? 0.5 : null }}
        >
          <div className="dialog__container dialog__container--color-picker">
            <div
              className="dialog__icon-container"
              style={{
                borderColor: this.state.removed ? "#aaa" : this.state.color,
              }}
              onClick={this.onHandleClick}
            >
              <span
                className={`glyph icon-flag`}
                style={{
                  color: this.state.removed ? "#aaa" : this.state.color,
                }}
              />
            </div>
            {this.state.displayColorPicker ? (
              <div className="color-picker">
                <div
                  className="color-picker-overlay"
                  onClick={this.onHandleClose}
                />
                {sliderPicker}
              </div>
            ) : null}
          </div>
          <div className="dialog__container dialog__container--label-form">
            <div className="form-element form-element--edit-label">
              <label htmlFor="guiderLabelName">
                {this.props.i18n.text.get(
                  "plugin.guider.flags.editFlagDialog.name"
                )}
              </label>
              <input
                id="guiderLabelName"
                placeholder={this.props.i18n.text.get(
                  "plugin.guider.flags.editFlagDialog.name"
                )}
                value={this.state.name}
                className="form-element__input form-element__input--guider-label-name"
                disabled={this.state.removed}
                onChange={this.onNameChange}
              />
            </div>
            <div className="form-element form-element--edit-label">
              <label htmlFor="guiderLabelDescription">
                {this.props.i18n.text.get(
                  "plugin.guider.flags.editFlagDialog.description"
                )}
              </label>
              <textarea
                id="guiderLabelDescription"
                placeholder={this.props.i18n.text.get(
                  "plugin.guider.flags.editFlagDialog.description"
                )}
                className="form-element__textarea form-element__textarea--edit-label"
                value={this.state.description}
                disabled={this.state.removed}
                onChange={this.onDescriptionChange}
              />
            </div>
          </div>
        </div>
      );
    };
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        onKeyStroke={this.handleKeydown}
        onOpen={this.resetState}
        modifier="guider-edit-label"
        title={this.props.i18n.text.get(
          "plugin.guider.flags.editFlagDialog.title"
        )}
        content={content}
        footer={footer}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { updateGuiderFilterLabel, removeGuiderFilterLabel },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuiderLabelUpdateDialog);
