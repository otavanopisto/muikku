import * as React from "react";
import Dialog from "~/components/general/dialog";
import {
  updateMessagesNavigationLabel,
  removeMessagesNavigationLabel,
  UpdateMessagesNavigationLabelTriggerType,
  RemoveMessagesNavigationLabelTriggerType,
} from "~/actions/main-function/messages";
import {
  MessagesType,
  MessagesNavigationItemType,
} from "~/reducers/main-function/messages";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { ChromePicker, ColorState } from "react-color";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18nOLD";
import { StateType } from "~/reducers";

import "~/sass/elements/form.scss";
import Button from "~/components/general/button";
import "~/sass/elements/glyph.scss";
import "~/sass/elements/color-picker.scss";
import { WithTranslation, withTranslation } from "react-i18next";

const KEYCODES = {
  ENTER: 13,
};

/**
 * CommunicatorLabelUpdateDialogProps
 */
interface CommunicatorLabelUpdateDialogProps
  extends WithTranslation<["common"]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  label: MessagesNavigationItemType;
  isOpen?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose?: () => any;
  i18nOLD: i18nType;
  messages: MessagesType;
  updateMessagesNavigationLabel: UpdateMessagesNavigationLabelTriggerType;
  removeMessagesNavigationLabel: RemoveMessagesNavigationLabelTriggerType;
}

/**
 * CommunicatorLabelUpdateDialogState
 */
interface CommunicatorLabelUpdateDialogState {
  displayColorPicker: boolean;
  color: string;
  name: string;
  removed: boolean;
  locked: boolean;
}

/**
 * CommunicatorLabelUpdateDialog
 */
class CommunicatorLabelUpdateDialog extends React.Component<
  CommunicatorLabelUpdateDialogProps,
  CommunicatorLabelUpdateDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: CommunicatorLabelUpdateDialogProps) {
    super(props);

    this.onColorChange = this.onColorChange.bind(this);
    this.onHandleClick = this.onHandleClick.bind(this);
    this.onHandleClose = this.onHandleClose.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.removeLabel = this.removeLabel.bind(this);
    this.update = this.update.bind(this);
    this.resetState = this.resetState.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);

    this.state = {
      displayColorPicker: false,
      color: props.label.color,
      name: props.label.text(props.i18nOLD),
      removed: false,
      locked: false,
    };
  }

  /**
   * componentWillReceiveProps
   * @param nextProps nextProps
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(
    nextProps: CommunicatorLabelUpdateDialogProps
  ) {
    if (nextProps.label.id !== this.props.label.id) {
      this.resetState(null, nextProps);
    }
  }

  /**
   * onHandleClick
   */
  onHandleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  /**
   * onHandleClose
   */
  onHandleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  /**
   * handleKeydown
   * @param code code
   * @param closeDialog closeDialog
   */
  handleKeydown(code: number, closeDialog: () => void) {
    if (code === KEYCODES.ENTER) {
      this.update(closeDialog);
    }
  }

  /**
   * resetState
   * @param e e
   * @param props props
   */
  resetState(e: HTMLElement, props = this.props): void {
    this.setState({
      color: props.label.color,
      removed: false,
      name: props.label.text(props.i18nOLD),
    });
  }

  /**
   * onColorChange
   * @param color color
   */
  onColorChange(color: ColorState) {
    if (this.state.removed) {
      return;
    }
    this.setState({ color: color.hex });
  }

  /**
   * onNameChange
   * @param e e
   */
  onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ name: e.target.value });
  }

  /**
   * removeLabel
   */
  removeLabel() {
    this.setState({ removed: true });
  }

  /**
   * update
   * @param closeDialog closeDialog
   */
  update(closeDialog: () => void) {
    if (this.state.locked) {
      return;
    }

    /**
     * success
     */
    const success = () => {
      this.setState({
        locked: false,
      });
      closeDialog();
    };

    /**
     * fail
     */
    const fail = () => {
      this.setState({
        locked: false,
      });
    };

    if (
      (this.state.name !== this.props.label.text(this.props.i18nOLD) ||
        this.state.color !== this.props.label.color) &&
      !this.state.removed
    ) {
      this.setState({
        locked: true,
      });
      this.props.updateMessagesNavigationLabel({
        label: this.props.label,
        newName: this.state.name,
        newColor: this.state.color,
        success,
        fail,
      });
    } else if (this.state.removed) {
      this.setState({
        locked: true,
      });
      this.props.removeMessagesNavigationLabel({
        label: this.props.label,
        success,
        fail,
      });
    } else {
      closeDialog();
    }
  }

  /**
   * render
   */
  render() {
    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["success", "standard-ok"]}
          disabled={this.state.locked}
          onClick={this.update.bind(this, closeDialog)}
        >
          {this.props.t("common:actions.save")}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          disabled={this.state.locked}
          onClick={closeDialog}
        >
          {this.props.t("common:actions.cancel")}
        </Button>
        <Button
          buttonModifiers={["fatal", "communicator-remove-label"]}
          disabled={this.state.removed || this.state.locked}
          onClick={this.removeLabel}
        >
          {
            // TODO: use i18next
            this.state.removed
              ? this.props.i18nOLD.text.get(
                  "plugin.communicator.label.edit.button.removed"
                )
              : this.props.i18nOLD.text.get(
                  "plugin.communicator.label.edit.button.remove"
                )
          }
        </Button>
      </div>
    );
    const sliderPicker = (
      <ChromePicker
        disableAlpha
        color={this.state.removed ? "#aaa" : this.state.color}
        onChange={this.onColorChange}
      />
    );

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
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
              className={`glyph icon-${this.props.label.icon}`}
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
            <label htmlFor="communicatorLabelName">
              {
                // TODO: use i18next
                this.props.i18nOLD.text.get(
                  "plugin.communicator.label.editLabelDialog.name"
                )
              }
            </label>
            <input
              id="communicatorLabelName"
              // TODO: use i18next
              placeholder={this.props.i18nOLD.text.get(
                "plugin.communicator.label.editLabelDialog.name"
              )}
              value={this.state.name}
              className="form-element__input form-element__input--communicator-label-name"
              disabled={this.state.removed}
              onChange={this.onNameChange}
            />
          </div>
        </div>
      </div>
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        onKeyStroke={this.handleKeydown}
        onOpen={this.resetState}
        modifier="communicator-edit-label"
        // TODO: use i18next
        title={this.props.i18nOLD.text.get(
          "plugin.communicator.label.edit.caption"
        )}
        content={content}
        footer={footer}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    messages: state.messages,
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { updateMessagesNavigationLabel, removeMessagesNavigationLabel },
    dispatch
  );
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(CommunicatorLabelUpdateDialog)
);
