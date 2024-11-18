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
  NoteCreationObject,
  NotePriorityType,
} from "~/generated/client";

/**
 * NotesItemNewProps
 */
interface NotesItemNewProps extends WithTranslation {
  /**
   * Id of note owner (recipient)
   */
  newNoteOwnerId: number;
  children: React.ReactElement;
  onNotesItemSaveClick?: (
    newNotesItem: CreateNoteRequest,
    onSuccess?: () => void
  ) => Promise<void>;
}

/**
 * JournalCenterItemNewState
 */
interface NotesItemNewState {
  notesItem: CreateNoteRequest;
  locked: boolean;
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
    super(props, "discussion-modify-thread-dialog");

    this.clearUp = this.clearUp.bind(this);

    this.state = {
      locked: false,
      notesItem: {
        noteReceiver: {
          pinned: false,
          status: "ONGOING",
        },
        recipients: {
          recipientIds: [props.newNoteOwnerId ? props.newNoteOwnerId : null],
          recipientGroupIds: [],
        },
        note: {
          title: "",
          description: "",
          type: "MANUAL",
          priority: "NORMAL",
          startDate: null,
          dueDate: null,
        },
      },
    };
  }

  /**
   * clearUp
   */
  clearUp() {
    this.setState({
      locked: false,
      notesItem: {
        noteReceiver: {
          pinned: false,
          status: "ONGOING",
        },
        recipients: {
          recipientIds: [
            this.props.newNoteOwnerId ? this.props.newNoteOwnerId : null,
          ],
          recipientGroupIds: [],
        },
        note: {
          title: "",
          description: "",
          type: "MANUAL",
          priority: "NORMAL",
          startDate: null,
          dueDate: null,
        },
      },
    });
  }

  /**
   * Handles save click
   * @param closeDialog closeDialog
   */
  handleSaveClick = (closeDialog: () => void) => () => {
    this.props.onNotesItemSaveClick &&
      this.props.onNotesItemSaveClick(this.state.notesItem, () => {
        this.clearUp();
        closeDialog();
      });
  };

  /**
   * Handles journal change
   * @param key name of updated property
   * @param value of updated property
   */
  handleNotesItemChange = <T extends keyof NoteCreationObject>(
    key: T,
    value: NoteCreationObject[T]
  ) => {
    const updateNotesItem = { ...this.state.notesItem.note };

    updateNotesItem[key] = value;

    this.setState({
      notesItem: { ...this.state.notesItem, note: updateNotesItem },
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
            value={this.state.notesItem.note.title}
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
            value={this.state.notesItem.note.priority}
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
            selected={
              this.state.notesItem.note.startDate
                ? this.state.notesItem.note.startDate
                : undefined
            }
            onChange={(date, e) =>
              this.handleNotesItemChange("startDate", date)
            }
            locale={outputCorrectDatePickerLocale(localize.language)}
            dateFormat="P"
            minDate={new Date()}
            maxDate={this.state.notesItem.note.dueDate}
          />
        </div>
        <div className="env-dialog__form-element-container">
          <label className="env-dialog__label">
            {this.props.i18n.t("labels.endDate", { ns: "common" })}
          </label>
          <DatePicker
            className="env-dialog__input"
            selected={
              this.state.notesItem.note.dueDate
                ? this.state.notesItem.note.dueDate
                : undefined
            }
            onChange={(date, e) => this.handleNotesItemChange("dueDate", date)}
            locale={outputCorrectDatePickerLocale(localize.language)}
            dateFormat="P"
            minDate={
              this.state.notesItem.note.startDate !== null
                ? this.state.notesItem.note.startDate
                : new Date()
            }
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
            {this.state.notesItem.note.description}
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
        // onOpen={this.clearUp}
      >
        {this.props.children}
      </EnvironmentDialog>
    );
  }
}

export default withTranslation("tasks")(NotesItemNew);
