import * as React from "react";
import EnvironmentDialog from "~/components/general/environment-dialog";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import "~/sass/elements/form.scss";
import DatePicker from "react-datepicker";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import "~/sass/elements/notes.scss";
import CKEditor from "../ckeditor";
import { localize } from "~/locales/i18n";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  CreateNoteRequest,
  NotePriorityType,
  NoteRecipientList,
  NoteCreationType,
} from "~/generated/client";
import InputContactsAutofill from "~/components/base/input-contacts-autofill"; // InputContactsAutofillLoaders,
import { ContactRecipientType } from "~/reducers/user-index";
import autofillLoaders from "./helpers/autofill-loaders";
/**
 * NotesItemNewProps
 */
interface NotesItemNewProps extends WithTranslation {
  /**
   * Id of note recipient
   * if this in not given there will be a recipient field
   */
  newNoteRecipientId?: number;
  children: React.ReactElement;
  onNotesItemSaveClick?: (
    newNotesItem: CreateNoteRequest,
    onSuccess?: () => void
  ) => Promise<void> | void;
}

/**
 * JournalCenterItemNewState
 */
interface NotesItemNewState {
  autofillRecipients: ContactRecipientType[];
  description: string;
  dueDate: Date;
  locked: boolean;
  pinned: boolean;
  priority: NotePriorityType;
  recipients: NoteRecipientList;
  startDate: Date;
  title: string;
  type: NoteCreationType;
}

/**
 * NotesItemNew
 */
class NotesItemNew extends SessionStateComponent<
  NotesItemNewProps,
  NotesItemNewState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: NotesItemNewProps) {
    super(props, "records-notes-item-new");

    this.clearUp = this.clearUp.bind(this);

    this.state = this.getRecoverStoredState({
      locked: false,
      autofillRecipients: [],
      pinned: false,
      recipients: {
        recipientIds: props.newNoteRecipientId
          ? [props.newNoteRecipientId]
          : [],

        recipientGroupIds: [],
        recipientStudentsWorkspaceIds: [],
      },
      title: "",
      description: "",
      type: "MANUAL",
      priority: "NORMAL",
      startDate: new Date(),
      dueDate: null,
    });
  }

  /**
   * clearUp
   */
  clearUp() {
    this.setStateAndClear({
      locked: false,
      autofillRecipients: [],
      pinned: false,
      recipients: {
        recipientIds: this.props.newNoteRecipientId
          ? [this.props.newNoteRecipientId]
          : [],
        recipientGroupIds: [],
        recipientStudentsWorkspaceIds: [],
      },
      title: "",
      description: "",
      type: "MANUAL",
      priority: "NORMAL",
      startDate: new Date(),
      dueDate: null,
    });
  }

  /**
   * Handles save click
   * @param closeDialog closeDialog
   */
  handleSaveClick = (closeDialog: () => void) => () => {
    const payload: CreateNoteRequest = {
      note: {
        title: this.state.title,
        description: this.state.description,
        type: this.state.type,
        priority: this.state.priority,
        startDate: this.state.startDate,
        dueDate: this.state.dueDate,
      },
      pinned: this.state.pinned,
      recipients: this.state.recipients,
    };

    this.props.onNotesItemSaveClick &&
      this.props.onNotesItemSaveClick(payload, () => {
        this.clearUp();
        closeDialog();
      });
  };

  /**
   * Handles journal change
   * @param key name of updated property
   * @param value of updated property
   */
  handleNotesItemChange = <T extends keyof NotesItemNewState>(
    key: T,
    value: NotesItemNewState[T]
  ) => {
    const updateNotesItem = { ...this.state };

    updateNotesItem[key] = value;

    this.setStateAndStore({ ...this.state, ...updateNotesItem });
  };

  /**
   * handleRecipientsChange
   * @param autofillRecipients recipients
   */
  handleRecipientsChange = (autofillRecipients: ContactRecipientType[]) => {
    const recipientIds = autofillRecipients
      .filter((recipient) => recipient.type == "user")
      .map((recipient) => recipient.value.id);

    const recipientGroupIds = autofillRecipients
      .filter((recipient) => recipient.type === "usergroup")
      .map((recipient) => recipient.value.id);

    const recipientStudentsWorkspaceIds = autofillRecipients
      .filter((recipient) => recipient.type === "workspace")
      .map((recipient) => recipient.value.id);

    this.setStateAndStore({
      ...this.state,
      autofillRecipients,
      recipients: {
        recipientIds,
        recipientGroupIds,
        recipientStudentsWorkspaceIds,
      },
    });
  };

  /**
   * render
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => never) => [
      <>
        {!this.props.newNoteRecipientId && (
          <div className="env-dialog__form-element-container">
            <InputContactsAutofill
              identifier="communicatorRecipients"
              modifier="new-message"
              key="new-message-1"
              showFullNames={true}
              loaders={autofillLoaders()}
              hasWorkspacePermission={true}
              hasGroupPermission={true}
              placeholder={this.props.t("labels.search", {
                context: "recipients",
              })}
              label={this.props.t("labels.recipients", {
                ns: "messaging",
                count: 0,
              })}
              selectedItems={this.state.autofillRecipients}
              onChange={this.handleRecipientsChange}
              autofocus={false}
            />
          </div>
        )}
      </>,
      <div key="new-note-1" className="env-dialog__row env-dialog__row--titles">
        <div className="env-dialog__form-element-container">
          <label className="env-dialog__label">
            {this.props.i18n.t("labels.title")}
          </label>
          <input
            className="env-dialog__input"
            type="text"
            onChange={(e) =>
              this.handleNotesItemChange("title", e.currentTarget.value)
            }
            value={this.state.title}
          />
        </div>

        <div className="env-dialog__form-element-container">
          <label className="env-dialog__label">
            {this.props.i18n.t("labels.priority", { ns: "tasks" })}
          </label>
          <select
            className="env-dialog__select"
            onChange={(e) =>
              this.handleNotesItemChange(
                "priority",
                e.target.value as NotePriorityType
              )
            }
            value={this.state.priority}
          >
            ,
            <option value={NotePriorityType.High}>
              {this.props.i18n.t("labels.priority", {
                ns: "tasks",
                context: "high",
              })}
            </option>
            <option value={NotePriorityType.Normal}>
              {this.props.i18n.t("labels.priority", {
                ns: "tasks",
                context: "normal",
              })}
            </option>
            <option value={NotePriorityType.Low}>
              {this.props.i18n.t("labels.priority", {
                ns: "tasks",
                context: "low",
              })}
            </option>
          </select>
        </div>
      </div>,
      <div key="new-note-2" className="env-dialog__row env-dialog__row--dates">
        <div className="env-dialog__form-element-container">
          <label className="env-dialog__label">
            {this.props.i18n.t("labels.beginDate")}
          </label>
          <DatePicker
            className="env-dialog__input"
            selected={this.state.startDate ? this.state.startDate : undefined}
            onChange={(date, e) =>
              this.handleNotesItemChange("startDate", date)
            }
            locale={outputCorrectDatePickerLocale(localize.language)}
            dateFormat="P"
          />
        </div>
        <div className="env-dialog__form-element-container">
          <label className="env-dialog__label">
            {this.props.i18n.t("labels.endDate", { ns: "common" })}
          </label>
          <DatePicker
            className="env-dialog__input"
            selected={this.state.dueDate ? this.state.dueDate : undefined}
            onChange={(date, e) => this.handleNotesItemChange("dueDate", date)}
            locale={outputCorrectDatePickerLocale(localize.language)}
            dateFormat="P"
          />
        </div>
      </div>,
      <div key="new-note-3" className="env-dialog__row">
        <div className="env-dialog__form-element-container">
          <label className="env-dialog__label">
            {this.props.i18n.t("labels.description")}
          </label>
          <CKEditor
            onChange={(e) => this.handleNotesItemChange("description", e)}
          >
            {this.state.description}
          </CKEditor>
        </div>
      </div>,
    ];
    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => never) => (
      <div className="env-dialog__actions">
        {this.recovered && (
          <Button
            buttonModifiers="dialog-clear"
            onClick={this.clearUp}
            disabled={this.state.locked}
          >
            {this.props.t("actions.remove", { context: "draft" })}
          </Button>
        )}
        <Button
          buttonModifiers={["dialog-execute"]}
          onClick={this.handleSaveClick(closeDialog)}
        >
          {this.props.i18n.t("actions.save")}
        </Button>
        <Button buttonModifiers={["dialog-cancel"]} onClick={closeDialog}>
          {this.props.i18n.t("actions.cancel")}
        </Button>
      </div>
    );

    return (
      <EnvironmentDialog
        modifier="add-note"
        title={this.props.i18n.t("labels.create", { ns: "tasks" })}
        content={content}
        footer={footer}
      >
        {this.props.children}
      </EnvironmentDialog>
    );
  }
}

export default withTranslation("tasks")(NotesItemNew);
