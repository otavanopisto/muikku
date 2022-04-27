import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import CKEditor from "~/components/general/ckeditor";
import EnvironmentDialog from "~/components/general/environment-dialog";
import {
  createContactEvent,
  CreateContactEventTriggerType,
} from "~/actions/main-function/guider";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import SessionStateComponent from "~/components/general/session-state-component";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import DatePicker from "react-datepicker";
import { contactTypesArray } from "~/reducers/main-function/guider";

/**
 * NewContactEventProps
 */
interface NewContactEventProps {
  children?: React.ReactElement<any>;
  i18n: i18nType;
  createContactEvent: CreateContactEventTriggerType;
  initialDate?: string;
  initialMessage?: string;
  initialType?: string;
  onOpen?: () => any;
  onClose?: () => any;
  isOpen?: boolean;
}

/**
 * NewContactEventState
 */
interface NewContactEventState {
  message: string;
  date: string;
  type: string;
  locked: boolean;
}

/**
 * NewContactEvent
 */
class NewContactEvent extends SessionStateComponent<
  NewContactEventProps,
  NewContactEventState
> {
  private avoidCKEditorTriggeringChangeForNoReasonAtAll: boolean;
  /**
   * constructor
   * @param props props
   */
  constructor(props: NewContactEventProps) {
    super(props, "new-contact-event");

    this.state = this.getRecoverStoredState({
      message: props.initialMessage || "",
      date: props.initialDate || "",
      type: props.initialType || "",
      locked: false,
    });
  }

  /**
   * checkAgainstStoredState
   */
  checkAgainstStoredState = () => {
    this.checkStoredAgainstThisState({
      message: this.props.initialMessage || "",
      locked: false,
    });

    this.props.onOpen && this.props.onOpen();
  };

  /**
   * onCKEditorChange
   * @param text
   * @returns
   */
  onCKEditorChange = (message: string) => {
    if (this.avoidCKEditorTriggeringChangeForNoReasonAtAll) {
      this.avoidCKEditorTriggeringChangeForNoReasonAtAll = false;
      return;
    }
    this.setStateAndStore({ message });
  };

  onDateChange = () => {};
  onSenderChange = () => {};
  onTypeChange = () => {};

  /**
   * saveContactEvent
   * @param closeDialog closeDialog
   */
  saveContactEvent = (closeDialog: () => any) => {
    this.setState({
      locked: true,
    });
  };

  /**
   * clearUp
   */
  clearUp = () => {
    this.avoidCKEditorTriggeringChangeForNoReasonAtAll = true;
    setTimeout(() => {
      this.avoidCKEditorTriggeringChangeForNoReasonAtAll = false;
    }, 100);
    this.setStateAndClear({
      message: this.props.initialMessage || "",
      locked: false,
    });
  };

  /**
   * render
   * @returns
   */
  render() {
    const editorTitle =
      this.props.i18n.text.get("TODO: Luo uusi yhteydenotto") +
      " - " +
      this.props.i18n.text.get(
        "plugin.communicator.createmessage.title.content"
      );

    /**
     * @param closeDialog
     */
    const content = (closeDialog: () => any) => (
      <>
        <div className="env-dialog__row env-dialog__row--new-contact-event">
          <div className="env-dialog__form-element-container env-dialog__form-element-container--new-contact-event">
            <label htmlFor="contactEventdate" className="env-dialog__label">
              {this.props.i18n.text.get("TODO: Päivämäärä ")}
            </label>
            <DatePicker
              id="contactEventdate"
              onChange={() => console.log("Muu")}
            ></DatePicker>
          </div>
          <div className="env-dialog__form-element-container env-dialog__form-element-container--new-contact-event">
            <label htmlFor="contactEventAuthor" className="env-dialog__label">
              {this.props.i18n.text.get("TODO: Lähettäjä ")}
            </label>
            <input id="contactEventAuthor" type="text"></input>
          </div>
          <div className="env-dialog__form-element-container">
            <label htmlFor="contactEventTypes" className="env-dialog__label">
              {this.props.i18n.text.get("TODO: Tyyppi ")}
            </label>
            <select id="contactEventTypes">
              {contactTypesArray.map((contactType) => (
                <option key={contactType}>{contactType}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="env-dialog__row"></div>
        <div className="env-dialog__row env-dialog__row--ckeditor">
          <div className="env-dialog__form-element-container">
            <label className="env-dialog__label">
              {this.props.i18n.text.get("TODO: Viesti")}
            </label>
            <CKEditor
              editorTitle={editorTitle}
              onChange={this.onCKEditorChange}
            >
              {this.state.message}
            </CKEditor>
          </div>
        </div>
      </>
    );
    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => any) => (
      <div className="env-dialog__actions">
        <Button
          buttonModifiers="dialog-execute"
          onClick={this.saveContactEvent.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.communicator.createmessage.button.send"
          )}
        </Button>
        <Button
          buttonModifiers="dialog-cancel"
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.communicator.createmessage.button.cancel"
          )}
        </Button>
        {this.recovered ? (
          <Button
            buttonModifiers="dialog-clear"
            onClick={this.clearUp}
            disabled={this.state.locked}
          >
            {this.props.i18n.text.get(
              "plugin.communicator.createmessage.button.clearDraft"
            )}
          </Button>
        ) : null}
      </div>
    );

    return (
      <EnvironmentDialog
        modifier="new-contact-event"
        title={this.props.i18n.text.get("TODO: Uusi yhteydenotto")}
        content={content}
        footer={footer}
        onOpen={this.checkAgainstStoredState}
        onClose={this.props.onClose}
        isOpen={this.props.isOpen}
      >
        {this.props.children}
      </EnvironmentDialog>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 * @returns
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ createContactEvent }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewContactEvent);
