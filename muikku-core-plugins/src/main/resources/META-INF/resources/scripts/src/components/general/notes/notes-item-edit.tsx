import * as React from "react";
import EnvironmentDialog from "~/components/general/environment-dialog";
import { localize } from "~/locales/i18n";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import "~/sass/elements/form.scss";
import DatePicker from "react-datepicker";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import "~/sass/elements/notes.scss";
import CKEditor from "../ckeditor";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Note,
  NotePriorityType,
  UpdateNoteRequest,
  NoteCreationObject,
} from "~/generated/client";
import { ContactRecipientType } from "~/reducers/user-index";
import {} from "~/generated/client";
import InputContactsAutofill, {
  InputContactsAutofillLoaders,
} from "~/components/base/input-contacts-autofill";
import autofillLoaders from "./helpers/autofill-loaders";
import { turnNoteRecipientsToContacts } from "~/util/users";

/**
 * NotesItemEditProps
 */
interface NotesItemEditProps extends WithTranslation {
  recipientId?: number;
  selectedNotesItem: Note;
  children: React.ReactElement;
  loaders?: () => InputContactsAutofillLoaders;
  onNotesItemSaveUpdateClick?: (
    noteId: number,
    updateNoteRequest: UpdateNoteRequest,
    onSuccess?: () => void
  ) => void;
}

/**
 * NotesItemEditState
 */
interface NotesItemEditState {
  recipientIds: number[];
  recipientGroupIds: number[];
  recipientStudentsWorkspaceIds: number[];
  note: NoteCreationObject;
  removeLocked: boolean;
}

/**
 * NotesItemEdit
 */
class NotesItemEdit extends SessionStateComponent<
  NotesItemEditProps,
  NotesItemEditState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: NotesItemEditProps) {
    super(props, "records-notes-item-edit");
    this.clearUp = this.clearUp.bind(this);
    const { title, description, type, priority, startDate, dueDate } =
      props.selectedNotesItem;

    this.state = {
      removeLocked: false,
      recipientIds: [],
      recipientGroupIds: [],
      recipientStudentsWorkspaceIds: [],
      note: {
        title,
        description,
        type,
        priority,
        startDate: new Date(startDate),
        dueDate: dueDate && new Date(dueDate),
      },
    };
  }

  /**
   * clearUp
   */
  clearUp() {
    const { title, description, type, priority, startDate, dueDate } =
      this.props.selectedNotesItem;

    this.setState({
      note: {
        title,
        description,
        type,
        priority,
        startDate: new Date(startDate),
        dueDate: dueDate && new Date(dueDate),
      },
      removeLocked: false,
      recipientIds: [],
      recipientGroupIds: [],
      recipientStudentsWorkspaceIds: [],
    });
  }

  /**
   * Handles save click
   * @param closeDialog closeDialog
   */
  handleUpdateClick = (closeDialog: () => void) => () => {
    const {
      note,
      recipientIds,
      recipientGroupIds,
      recipientStudentsWorkspaceIds,
    } = this.state;
    // If the recipient is explicitly given, use it,
    // otherwise use the autofill recipients
    const request = {
      note,
      recipients: {
        recipientIds,
        recipientGroupIds,
        recipientStudentsWorkspaceIds,
      },
    };

    this.props.onNotesItemSaveUpdateClick &&
      this.props.onNotesItemSaveUpdateClick(
        this.props.selectedNotesItem.id,
        request,
        () => {
          this.clearUp();
          closeDialog();
        }
      );
  };

  /**
   * Handles notes item's change
   * @param key name of updated property
   * @param value of updated property
   */
  handleNotesItemChange = <T extends keyof NoteCreationObject>(
    key: T,
    value: NoteCreationObject[T]
  ) => {
    const updateNotesItem = { ...this.state.note };
    updateNotesItem[key] = value;

    this.setState({
      note: updateNotesItem,
    });
  };

  /**
   * handleRecipientsChange
   * @param recipients recipients
   * @param changedValue changedValue
   */
  handleRecipientsChange = (
    recipients: ContactRecipientType[],
    changedValue: ContactRecipientType
  ) => {
    if (recipients.length === 1) {
      this.setState({
        removeLocked: true,
      });
    } else if (this.state.removeLocked === true) {
      this.setState({
        removeLocked: false,
      });
    }
    if (changedValue.type === "user") {
      if (this.state.recipientIds.includes(changedValue.value.id)) {
        // Remove the recipient if it's already in the list
        this.setState({
          recipientIds: this.state.recipientIds.filter(
            (id) => id !== changedValue.value.id
          ),
        });
      } else {
        // Add the recipient if it's not in the list
        this.setState({
          recipientIds: [...this.state.recipientIds, changedValue.value.id],
        });
      }
    } else if (changedValue.type === "usergroup") {
      // Remove the userGroup if it's already in the list
      if (changedValue.value.id in this.state.recipientGroupIds) {
        this.setState({
          recipientGroupIds: this.state.recipientGroupIds.filter(
            (id) => id !== changedValue.value.id
          ),
        });
      } else {
        // Add the userGroup if it's not in the list
        this.setState({
          recipientGroupIds: [
            ...this.state.recipientGroupIds,
            changedValue.value.id,
          ],
        });
      }
    } else if (changedValue.type === "workspace") {
      // Remove the workspace if it's already in the list
      if (changedValue.value.id in this.state.recipientStudentsWorkspaceIds) {
        this.setState({
          recipientStudentsWorkspaceIds:
            this.state.recipientStudentsWorkspaceIds.filter(
              (id) => id !== changedValue.value.id
            ),
        });
      } else {
        // Add the workspace if it's not in the list
        this.setState({
          recipientStudentsWorkspaceIds: [
            ...this.state.recipientStudentsWorkspaceIds,
            changedValue.value.id,
          ],
        });
      }
    } else {
      return;
    }
  };

  /**
   * render
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => [
      <>
        {!this.props.recipientId &&
          this.props.selectedNotesItem.multiUserNote && (
            <div className="env-dialog__form-element-container">
              <InputContactsAutofill
                identifier="communicatorRecipients"
                modifier="new-message"
                key="new-message-1"
                disableRemove={this.state.removeLocked}
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
                selectedItems={turnNoteRecipientsToContacts(
                  this.props.selectedNotesItem.recipients
                )}
                onChange={this.handleRecipientsChange}
                autofocus={false}
              />
            </div>
          )}
      </>,
      <div
        key="edit-note-1"
        className="env-dialog__row env-dialog__row--titles"
      >
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
            value={this.state.note.title}
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
            value={this.state.note.priority}
          >
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
      <div key="edit-note-2" className="env-dialog__row env-dialog__row--dates">
        <div className="env-dialog__form-element-container">
          <label className="env-dialog__label">
            {this.props.i18n.t("labels.beginDate")}
          </label>
          <DatePicker
            className="env-dialog__input"
            selected={
              this.state.note.startDate !== null
                ? new Date(this.state.note.startDate)
                : undefined
            }
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
            selected={
              this.state.note.dueDate !== null
                ? new Date(this.state.note.dueDate)
                : undefined
            }
            onChange={(date, e) => this.handleNotesItemChange("dueDate", date)}
            locale={outputCorrectDatePickerLocale(localize.language)}
            dateFormat="P"
            minDate={
              this.state.note.startDate !== null
                ? this.state.note.startDate
                : new Date()
            }
          />
        </div>
      </div>,
      <div key="edit-note-3" className="env-dialog__row">
        <div className="env-dialog__form-element-container">
          <label className="env-dialog__label">
            {this.props.i18n.t("labels.description")}
          </label>
          <CKEditor
            onChange={(e) => this.handleNotesItemChange("description", e)}
          >
            {this.state.note.description}
          </CKEditor>
        </div>
      </div>,
    ];
    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="env-dialog__actions">
        <Button
          buttonModifiers={["dialog-execute"]}
          onClick={this.handleUpdateClick(closeDialog)}
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
        modifier="modify-message"
        title={this.props.i18n.t("labels.edit", { ns: "tasks" })}
        content={content}
        footer={footer}
        onClose={this.clearUp}
      >
        {this.props.children}
      </EnvironmentDialog>
    );
  }
}

export default withTranslation("tasks")(NotesItemEdit);
