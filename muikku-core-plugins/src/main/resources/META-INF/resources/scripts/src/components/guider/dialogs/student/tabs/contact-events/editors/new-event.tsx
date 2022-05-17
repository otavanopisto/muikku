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
import {
  ContactTypes,
  contactTypesArray,
  GuiderStudentType,
} from "~/reducers/main-function/guider";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import moment from "~/lib/moment";
import { StatusType } from "~/reducers/base/status";

/**
 * NewContactEventProps
 */
interface NewContactEventProps {
  children?: React.ReactElement<any>;
  i18n: i18nType;
  createContactEvent: CreateContactEventTriggerType;
  currentStudent: GuiderStudentType;
  status: StatusType;
  initialDate?: Date;
  initialSender?: string;
  initialMessage?: string;
  initialType?: ContactTypes;
  onOpen?: () => any;
  onClose?: () => any;
  isOpen?: boolean;
}

/**
 * NewContactEventState
 */
interface NewContactEventState {
  text: string;
  sender: string;
  date: Date;
  type: ContactTypes;
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
  private nameSpace: string = "new-contact-event";
  /**
   * constructor
   * @param props props
   */
  constructor(props: NewContactEventProps) {
    super(props, "new-contact-event");

    this.state = this.getRecoverStoredState({
      text: props.initialMessage || "",
      sender: props.initialSender || "",
      date:
        props.i18n.time.getLocalizedMoment(props.initialDate).toDate() ||
        props.i18n.time.getLocalizedMoment().toDate(),
      type: props.initialType || "OTHER",
      locked: false,
    });
  }

  /**
   * checkAgainstStoredState
   */
  checkAgainstStoredState = () => {
    this.checkStoredAgainstThisState(
      {
        text: this.props.initialMessage || "",
        sender: this.props.initialSender || "",
        date:
          this.props.i18n.time
            .getLocalizedMoment(this.props.initialDate)
            .toDate() || this.props.i18n.time.getLocalizedMoment().toDate(),
        type: this.props.initialType || "OTHER",
        locked: false,
      },
      this.nameSpace
    );

    this.props.onOpen && this.props.onOpen();
  };

  /**
   * onCKEditorChange
   * @param text
   * @returns
   */
  onCKEditorChange = (text: string) => {
    if (this.avoidCKEditorTriggeringChangeForNoReasonAtAll) {
      this.avoidCKEditorTriggeringChangeForNoReasonAtAll = false;
      return;
    }
    this.setStateAndStore({ text }, this.nameSpace);
  };

  onDateChange = (date: Date) => {
    this.setStateAndStore({ date: date }, this.nameSpace);
  };

  onTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setStateAndStore(
      { type: e.target.value as ContactTypes },
      this.nameSpace
    );
  };

  /**
   * saveContactEvent
   * @param closeDialog closeDialog
   */
  saveContactEvent = (closeDialog: () => any) => {
    this.setState({
      locked: true,
    });
    this.props.createContactEvent(
      this.props.currentStudent.userEntityId,
      /**
       * payload
       */
      {
        text: this.state.text,
        entryDate: moment(this.state.date).format(),
        type: this.state.type,
      },
      /**
       * onSuccess
       */
      () => {
        this.setState({
          locked: false,
        });
        closeDialog();
        this.clearUp();
      }
    );
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
      text: this.props.initialMessage || "",
      sender: this.props.initialSender || "",
      date:
        this.props.i18n.time
          .getLocalizedMoment(this.props.initialDate)
          .toDate() || this.props.i18n.time.getLocalizedMoment().toDate(),
      type: this.props.initialType || "OTHER",
      locked: false,
    });
  };

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const editorTitle = this.props.i18n.text.get(
      "plugin.guider.user.dialog.createContactEvent.title"
    );

    /**
     * @param closeDialog
     */
    const content = (closeDialog: () => any) => (
      <>
        <div className="env-dialog__row env-dialog__row--new-contact-event">
          <div className="env-dialog__form-element-container env-dialog__form-element-container--new-contact-event">
            <label htmlFor="contactEventdate" className="env-dialog__label">
              {this.props.i18n.text.get(
                "plugin.guider.user.dialog.createContactEvent.date"
              )}
            </label>
            <DatePicker
              className="env-dialog__input"
              id="contactEventdate"
              onChange={(date: Date) => this.onDateChange(date)}
              locale={outputCorrectDatePickerLocale(
                this.props.i18n.time.getLocale()
              )}
              selected={this.state.date}
              dateFormat="P"
            ></DatePicker>
          </div>
          <div className="env-dialog__form-element-container">
            <label htmlFor="contactEventTypes" className="env-dialog__label">
              {this.props.i18n.text.get(
                "plugin.guider.user.dialog.createContactEvent.type"
              )}
            </label>
            <select
              id="contactEventTypes"
              className="env-dialog__select"
              onChange={this.onTypeChange}
              value={this.state.type}
            >
              {contactTypesArray.map((contactType) => (
                <option key={contactType} value={contactType}>
                  {this.props.i18n.text.get(
                    "plugin.guider.contact.type." + contactType
                  )}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="env-dialog__row"></div>
        <div className="env-dialog__row env-dialog__row--ckeditor">
          <div className="env-dialog__form-element-container">
            <label className="env-dialog__label">
              {this.props.i18n.text.get(
                "plugin.guider.user.dialog.createContactEvent.text"
              )}
            </label>
            <CKEditor
              editorTitle={editorTitle}
              onChange={this.onCKEditorChange}
            >
              {this.state.text}
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
        title={this.props.i18n.text.get(
          "plugin.guider.user.dialog.createContactEvent.title"
        )}
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
 * @returns state from props
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status,
    currentStudent: state.guider.currentStudent.basic,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns dispatch functions
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ createContactEvent }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewContactEvent);
