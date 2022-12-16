import Dialog from "./dialog";
import Portal from "./portal";
import Button from "~/components/general/button";
import * as React from "react";
import { i18nType } from "~/reducers/base/i18nOLD";
import "~/sass/elements/environment-dialog.scss";

/**
 * EnvironmentDialog
 */
export default class EnvironmentDialog extends Dialog {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <Portal
        onKeyStroke={this.props.onKeyStroke}
        isOpen={this.props.isOpen}
        openByClickOn={this.props.children}
        onOpen={this.onOpen}
        onClose={this.props.onClose}
        beforeClose={this.beforeClose}
        closeOnEsc
      >
        {(closePortal: () => any) => (
          <div
            className={`env-dialog env-dialog--mainfunction env-dialog--${
              this.props.modifier
            } ${this.state.visible ? "visible" : ""}`}
            onClick={this.onOverlayClick.bind(this, closePortal)}
          >
            <section
              role="dialog"
              className="env-dialog__wrapper"
              aria-labelledby={`dialog-title-${this.props.modifier}`}
              aria-modal="true"
            >
              <div role="form" className="env-dialog__content">
                <header
                  className="env-dialog__header"
                  id={`dialog-title-${this.props.modifier}`}
                >
                  {this.props.title}
                </header>
                <section className="env-dialog__body">
                  {this.props.content(closePortal)}
                </section>
                <footer className="env-dialog__footer">
                  {this.props.footer && this.props.footer(closePortal)}
                </footer>
              </div>
            </section>
          </div>
        )}
      </Portal>
    );
  }
}

// TODO: this needs to be made to use the dialog versions of these using these classnames

/**
 * EnvironmentDialogRowProps
 */
interface EnvironmentDialogRowProps {
  modifiers?: string | Array<string>;
}

/**
 * EnvironmentDialogRowState
 */
interface EnvironmentDialogRowState {}

/**
 * EnvironmentDialogRow
 */
export class EnvironmentDialogRow extends React.Component<
  EnvironmentDialogRowProps,
  EnvironmentDialogRowState
> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    return (
      <div
        className={`env-dialog__row ${
          this.props.modifiers
            ? modifiers.map((m) => `env-dialog__row--${m}`).join(" ")
            : ""
        }`}
      >
        {this.props.children}
      </div>
    );
  }
}

/**
 * EnvironmentDialogFormElementProps
 */
interface EnvironmentDialogFormElementProps {
  label: string;
  i18nOLD: i18nType;
  modifiers?: string | Array<string>;
}

/**
 * EnvironmentDialogFormElementState
 */
interface EnvironmentDialogFormElementState {}

/**
 * EnvironmentDialogFormElement
 */
export class EnvironmentDialogFormElement extends React.Component<
  EnvironmentDialogFormElementProps,
  EnvironmentDialogFormElementState
> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    return (
      <div
        className={`env-dialog__form-element-container ${
          this.props.modifiers
            ? modifiers
                .map((m) => `env-dialog__form-element-container--${m}`)
                .join(" ")
            : ""
        }`}
      >
        <label className="env-dialog__label">
          {this.props.i18nOLD.text.get(this.props.label)}
        </label>
        {this.props.children}
      </div>
    );
  }
}

/**
 * EnvironmentDialogActionsProps
 */
interface EnvironmentDialogActionsProps {
  executeLabel: string;
  cancelLabel: string;
  executeClick: () => any;
  cancelClick: () => any;
  modifiers?: string | Array<string>;
  customButton?: React.ReactElement<any>;
  i18nOLD: i18nType;
}

/**
 * EnvironmentDialogActionsState
 */
interface EnvironmentDialogActionsState {
  locked: boolean;
}

/**
 * EnvironmentDialogActionsElement
 */
export class EnvironmentDialogActionsElement extends React.Component<
  EnvironmentDialogActionsProps,
  EnvironmentDialogActionsState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: EnvironmentDialogActionsProps) {
    super(props);
    this.state = {
      locked: false,
    };
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    return (
      <div
        className={`env-dialog__actions ${
          this.props.modifiers
            ? modifiers.map((m) => `env-dialog__actions--${m}`).join(" ")
            : ""
        }`}
      >
        <Button
          buttonModifiers="dialog-execute"
          onClick={this.props.executeClick}
        >
          {this.props.i18nOLD.text.get(this.props.executeLabel)}
        </Button>
        <Button
          buttonModifiers="dialog-cancel"
          onClick={this.props.cancelClick}
          disabled={this.state.locked}
        >
          {this.props.i18nOLD.text.get(this.props.cancelLabel)}
        </Button>
        {this.props.customButton}
      </div>
    );
  }
}
