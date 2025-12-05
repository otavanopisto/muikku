import * as React from "react";
import Dialog from "~/components/general/dialog";
import { ChromePicker, ColorState } from "react-color";
import "~/sass/elements/form.scss";
import Button from "~/components/general/button";
import "~/sass/elements/glyph.scss";
import "~/sass/elements/color-picker.scss";
import { colorIntToHex, hexToColorInt } from "~/util/modifiers";
import { WithTranslation, withTranslation } from "react-i18next";
import { AnnouncementCategory } from "~/generated/client";

const KEYCODES = {
  ENTER: 13,
};

/**
 * AnnouncerLabelUpdateDialogProps
 */
interface AnnouncerLabelUpdateDialogProps extends WithTranslation {
  children: React.ReactElement;
  category: AnnouncementCategory;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onUpdate?: (tag: AnnouncementCategory) => void;
}

/**
 * AnnouncerLabelUpdateDialogState
 */
interface AnnouncerLabelUpdateDialogState {
  displayColorPicker: boolean;
  color: string;
  name: string;
  removed: boolean;
  locked: boolean;
}

/**
 * AnnouncerLabelUpdateDialog
 */
class AnnouncerLabelUpdateDialog extends React.Component<
  AnnouncerLabelUpdateDialogProps,
  AnnouncerLabelUpdateDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: AnnouncerLabelUpdateDialogProps) {
    super(props);

    this.onColorChange = this.onColorChange.bind(this);
    this.onHandleClick = this.onHandleClick.bind(this);
    this.onHandleClose = this.onHandleClose.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.update = this.update.bind(this);
    this.resetState = this.resetState.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);

    this.state = {
      displayColorPicker: false,
      color: colorIntToHex(props.category.color),
      name: props.category.category,
      removed: false,
      locked: false,
    };
  }

  /**
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: AnnouncerLabelUpdateDialogProps) {
    if (nextProps.category.id !== this.props.category.id) {
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
      color: colorIntToHex(props.category.color),
      removed: false,
      name: props.category.category,
    });
    this.props.onOpen?.();
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
      this.state.name !== this.props.category.category ||
      this.state.color !== colorIntToHex(this.props.category.color)
    ) {
      this.setState({
        locked: true,
      });

      const data = {
        id: this.props.category.id,
        category: this.state.name,
        color: hexToColorInt(this.state.color),
        success: success,
        fail: fail,
      };

      this.props.onUpdate(data);
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
          {this.props.t("actions.save")}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          disabled={this.state.locked}
          onClick={closeDialog}
        >
          {this.props.t("actions.cancel")}
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
              className={`glyph icon-tag`}
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
            <label htmlFor="announcementCategoryName">
              {this.props.t("labels.name")}
            </label>
            <input
              id="announcementCategoryName"
              placeholder={this.props.t("labels.name")}
              value={this.state.name}
              className="form-element__input form-element__input--announcement-category-name"
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
        title={this.props.t("labels.edit", { context: "category" })}
        content={content}
        footer={footer}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

export default withTranslation(["messaging"])(AnnouncerLabelUpdateDialog);
