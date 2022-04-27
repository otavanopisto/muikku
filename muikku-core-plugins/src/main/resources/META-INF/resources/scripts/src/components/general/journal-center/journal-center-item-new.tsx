import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import EnvironmentDialog from "~/components/general/environment-dialog";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import DatePicker from "react-datepicker";
import {
  JournalCreationType,
  JournalNoteCreate,
  JournalPriority,
} from "~/@types/journal-center";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import "~/sass/elements/journal-center.scss";

/**
 * JournalCenterItemNewProps
 */
interface JournalCenterItemNewProps {
  /**
   * Id of note owner (recipient)
   */
  newNoteOwnerId: number;
  children: React.ReactElement<any>;
  i18n: i18nType;
  onJournalSaveClick?: (
    newJournal: JournalNoteCreate,
    onSuccess?: () => void
  ) => Promise<void>;
}

/**
 * JournalCenterItemNewState
 */
interface JournalCenterItemNewState {
  journal: JournalNoteCreate;
  locked: boolean;
}

/**
 * JournalCenterItemNew
 */
class JournalCenterItemNew extends SessionStateComponent<
  JournalCenterItemNewProps,
  JournalCenterItemNewState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: JournalCenterItemNewProps) {
    super(props, "discussion-modify-thread-dialog");

    this.clearUp = this.clearUp.bind(this);

    this.state = {
      locked: false,
      journal: {
        title: "",
        description: "",
        type: JournalCreationType.MANUAL,
        priority: JournalPriority.HIGH,
        pinned: false,
        owner: props.newNoteOwnerId,
        startDate: null,
        dueDate: null,
      },
    };
  }

  /**
   * clearUp
   */
  clearUp() {
    this.setState({
      journal: {
        title: "",
        description: "",
        type: JournalCreationType.MANUAL,
        priority: JournalPriority.HIGH,
        pinned: false,
        owner: this.props.newNoteOwnerId,
        startDate: null,
        dueDate: null,
      },
    });
  }

  /**
   * Handles save click
   * @param closeDialog closeDialog
   */
  handleSaveClick = (closeDialog: () => void) => () => {
    this.props.onJournalSaveClick &&
      this.props.onJournalSaveClick(this.state.journal, () => {
        this.clearUp();
        closeDialog();
      });
  };

  /**
   * Handles journal change
   * @param key name of updated property
   * @param value of updated property
   */
  handleJournalChange = <T extends keyof JournalNoteCreate>(
    key: T,
    value: JournalNoteCreate[T]
  ) => {
    const updateJournal = { ...this.state.journal };

    updateJournal[key] = value;

    this.setState({
      journal: updateJournal,
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
    const content = (closeDialog: () => any) => [
      <div
        key={0}
        style={{
          width: "100%",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          height: "calc(100% - 50px)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Otsikko</label>
          <input
            type="text"
            onChange={(e) =>
              this.handleJournalChange("title", e.currentTarget.value)
            }
            value={this.state.journal.title}
            style={{
              background: "#ffffff",
              border: "2px solid pink",
              borderRadius: "3px",
              display: "inline-block",
              height: "2.25rem",
              padding: "4px",
              width: "100%",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Prioriteetti</label>
          <select
            onChange={(e) =>
              this.handleJournalChange(
                "priority",
                e.target.value as JournalPriority
              )
            }
            value={this.state.journal.priority}
            style={{
              background: "#ffffff",
              border: "2px solid pink",
              borderRadius: "3px",
              display: "inline-block",
              height: "2.25rem",
              padding: "4px",
              width: "100%",
            }}
          >
            <option value={JournalPriority.HIGH}>Korkea</option>
            <option value={JournalPriority.NORMAL}>Normaali</option>
            <option value={JournalPriority.LOW}>Matala</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginRight: "5px" }}>Alkamispäivä</label>
          <DatePicker
            className="form-element__input"
            selected={
              this.state.journal.startDate
                ? this.state.journal.startDate
                : undefined
            }
            onChange={(date, e) => this.handleJournalChange("startDate", date)}
            locale={outputCorrectDatePickerLocale(
              this.props.i18n.time.getLocale()
            )}
            dateFormat="P"
          />
          <label style={{ marginRight: "5px" }}>Päättymispäivä</label>
          <DatePicker
            className="form-element__input"
            selected={
              this.state.journal.dueDate
                ? this.state.journal.dueDate
                : undefined
            }
            onChange={(date, e) => this.handleJournalChange("dueDate", date)}
            locale={outputCorrectDatePickerLocale(
              this.props.i18n.time.getLocale()
            )}
            dateFormat="P"
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Kuvaus</label>
          <textarea
            onChange={(e) =>
              this.handleJournalChange("description", e.currentTarget.value)
            }
            value={this.state.journal.description}
            style={{
              backgroundColor: "transparent",
              border: "2px solid pink",
              borderRadius: "2px",
              fontSize: "0.8125rem",
              minHeight: "150px",
              padding: "6px",
              width: "100%",
            }}
          />
        </div>
      </div>,
    ];
    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => any) => (
      <div className="env-dialog__actions">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "50px",
            width: "100%",
          }}
        >
          <Button onClick={this.handleSaveClick(closeDialog)}>Tallenna</Button>
          <Button onClick={closeDialog}>Peruuta</Button>
        </div>
      </div>
    );

    return (
      <EnvironmentDialog
        modifier="modify-message"
        title="Uusi nootti"
        content={content}
        footer={footer}
        onOpen={this.clearUp}
      >
        {this.props.children}
      </EnvironmentDialog>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JournalCenterItemNew);
