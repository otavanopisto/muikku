import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import CKEditor from "~/components/general/ckeditor";
import EnvironmentDialog from "~/components/general/environment-dialog";
import {
  createContactLogEvent,
  CreateContactLogEventTriggerType,
} from "~/actions/main-function/guider";
import { AnyActionType } from "~/actions";
import { localize } from "~/locales/i18n";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import SessionStateComponent from "~/components/general/session-state-component";
import DatePicker from "react-datepicker";
import { contactTypesArray } from "~/reducers/main-function/guider";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import moment from "moment";
import { StatusType } from "~/reducers/base/status";
import {
  loadStudentContactLogs,
  LoadContactLogsTriggerType,
} from "~/actions/main-function/guider";
import { ContactType, Student } from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * NewContactEventProps
 */
interface NewContactEventProps extends WithTranslation {
  children?: JSX.Element;
  createContactLogEvent: CreateContactLogEventTriggerType;
  loadStudentContactLogs: LoadContactLogsTriggerType;
  logsPerPage: number;
  currentStudent: Student;
  status: StatusType;
  initialDate?: Date;
  initialSender?: string;
  initialMessage?: string;
  initialType?: ContactType;
  onOpen?: () => void;
  onClose?: () => void;
  isOpen?: boolean;
}

/**
 * NewContactEventState
 */
interface NewContactEventState {
  text: string;
  sender: string;
  date: Date;
  type: ContactType;
  locked: boolean;
}

export const contactLogsContext = React.createContext(10);

/**
 * NewContactEvent
 */
class NewContactEvent extends SessionStateComponent<
  NewContactEventProps,
  NewContactEventState
> {
  private avoidCKEditorTriggeringChangeForNoReasonAtAll: boolean;
  private nameSpace = "new-contact-event";
  static contextType = contactLogsContext;
  /**
   * constructor
   * @param props props
   */
  constructor(props: NewContactEventProps) {
    super(props, "new-contact-event");

    this.state = this.getRecoverStoredState(
      {
        text: props.initialMessage || "",
        sender: props.initialSender || "",
        date:
          localize.getLocalizedMoment(props.initialDate).toDate() ||
          localize.getLocalizedMoment().toDate(),
        type: props.initialType || "OTHER",
        locked: false,
      },
      this.nameSpace
    );
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
          localize.getLocalizedMoment(this.props.initialDate).toDate() ||
          localize.getLocalizedMoment().toDate(),
        type: this.props.initialType || "OTHER",
        locked: false,
      },
      this.nameSpace
    );

    this.props.onOpen && this.props.onOpen();
  };

  /**
   * onCKEditorChange handler
   * @param text ckeditor text
   */
  onCKEditorChange = (text: string) => {
    if (this.avoidCKEditorTriggeringChangeForNoReasonAtAll) {
      this.avoidCKEditorTriggeringChangeForNoReasonAtAll = false;
      return;
    }
    this.setStateAndStore({ text }, this.nameSpace);
  };

  /**
   * onDateChange handler
   * @param date Date
   */
  onDateChange = (date: Date) => {
    this.setStateAndStore({ date: date }, this.nameSpace);
  };

  /**
   * onTypeChange handler
   * @param e event
   */
  onTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setStateAndStore(
      { type: e.target.value as ContactType },
      this.nameSpace
    );
  };

  /**
   * saveContactEvent
   * @param closeDialog closeDialog
   */
  saveContactEvent = (closeDialog: () => void) => {
    this.setState({
      locked: true,
    });
    this.props.createContactLogEvent(
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
    this.setStateAndClear(
      {
        text: this.props.initialMessage || "",
        sender: this.props.initialSender || "",
        date:
          localize.getLocalizedMoment(this.props.initialDate).toDate() ||
          localize.getLocalizedMoment().toDate(),
        type: this.props.initialType || "OTHER",
        locked: false,
      },
      this.nameSpace
    );
    this.props.loadStudentContactLogs(
      this.props.currentStudent.userEntityId,
      this.props.logsPerPage,
      0,
      true
    );
  };

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const editorTitle = this.props.i18n.t("labels.create", {
      ns: "messaging",
      context: "message",
    });

    /**
     * content
     * @param closeDialog closeDialog function
     */
    const content = (closeDialog: () => void) => (
      <>
        <div className="env-dialog__row env-dialog__row--new-contact-event">
          <div className="env-dialog__form-element-container env-dialog__form-element-container--new-contact-event">
            <label htmlFor="contactEventdate" className="env-dialog__label">
              {this.props.i18n.t("labels.create", {
                ns: "messaging",
                context: "contactEvent",
              })}
            </label>
            <DatePicker
              className="env-dialog__input"
              id="contactEventdate"
              onChange={this.onDateChange}
              locale={outputCorrectDatePickerLocale(localize.language)}
              selected={this.state.date}
              dateFormat="P"
            ></DatePicker>
          </div>
          <div className="env-dialog__form-element-container">
            <label htmlFor="contactEventTypes" className="env-dialog__label">
              {this.props.i18n.t("labels.type")}
            </label>
            <select
              id="contactEventTypes"
              className="env-dialog__select"
              onChange={this.onTypeChange}
              value={this.state.type}
            >
              {contactTypesArray.map((contactTyp) => (
                <option key={contactTyp} value={contactTyp}>
                  {this.props.i18n.t("labels.type", {
                    context: contactTyp,
                    ns: "messaging",
                  })}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="env-dialog__row"></div>
        <div className="env-dialog__row env-dialog__row--ckeditor">
          <div className="env-dialog__form-element-container">
            <label className="env-dialog__label">
              {this.props.i18n.t("labels.message", { ns: "messaging" })}
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
    const footer = (closeDialog: () => void) => (
      <div className="env-dialog__actions">
        <Button
          buttonModifiers="dialog-execute"
          onClick={this.saveContactEvent.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.t("actions.send")}
        </Button>
        <Button
          buttonModifiers="dialog-cancel"
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {this.props.i18n.t("actions.cancel")}
        </Button>
        {this.recovered ? (
          <Button
            buttonModifiers="dialog-clear"
            onClick={this.clearUp}
            disabled={this.state.locked}
          >
            {this.props.i18n.t("actions.remove", { context: "draft" })}
          </Button>
        ) : null}
      </div>
    );

    return (
      <EnvironmentDialog
        modifier="new-contact-event"
        title={this.props.i18n.t("labels.create", {
          ns: "messaging",
          context: "contactEvent",
        })}
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

NewContactEvent.contextType = contactLogsContext;

/**
 * mapStateToProps
 * @param state state
 * @returns state from props
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    currentStudent: state.guider.currentStudent.basic,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns dispatch functions
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    { createContactLogEvent, loadStudentContactLogs },
    dispatch
  );
}

export default withTranslation(["guider"])(
  connect(mapStateToProps, mapDispatchToProps)(NewContactEvent)
);
