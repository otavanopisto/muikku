import * as React from "react";
import Button from "~/components/general/button";
import {
  JournalNoteCreate,
  JournalNoteRead,
  JournalNoteUpdate,
  JournalPriority,
  UseJournals,
} from "~/@types/journal-center";
import DatePicker from "react-datepicker";
import "~/sass/elements/datepicker/datepicker.scss";
import * as moment from "moment";
import { i18nType } from "~/reducers/base/i18n";

/**
 * JournalListEditorProps
 */
interface JournalListEditorEditProps {
  journals: UseJournals;
  selectedJournal?: JournalNoteRead;
  onCancelClick?: () => void;
  onJournalSaveUpdateClick?: (
    journalId: number,
    updatedJournal: JournalNoteUpdate
  ) => void;
  i18n: i18nType;
}

/**
 * Creates journal list editor "edit"
 * @param props props
 * @returns JSX.Element
 */
const JournalListEditorEdit: React.FC<JournalListEditorEditProps> = (props) => {
  const { selectedJournal, onCancelClick, onJournalSaveUpdateClick, i18n } =
    props;

  const [journal, setJournal] =
    React.useState<JournalNoteUpdate>(selectedJournal);

  /**
   * Handles journal change
   * @param key name of updated property
   * @param value of updated property
   */
  const handleJournalChange = <T extends keyof JournalNoteUpdate>(
    key: T,
    value: JournalNoteUpdate[T]
  ) => {
    const updateJournal = { ...journal };

    updateJournal[key] = value;

    setJournal(updateJournal);
  };

  /**
   * handleSaveNewClick
   */
  const handleSaveClick = () => {
    if (onJournalSaveUpdateClick) {
      onJournalSaveUpdateClick(selectedJournal.id, journal);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div
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
              handleJournalChange("title", e.currentTarget.value)
            }
            value={journal.title}
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
              handleJournalChange("priority", e.target.value as JournalPriority)
            }
            value={journal.priority}
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
          <label style={{ marginRight: "5px" }}>Päättymispäivä</label>
          <DatePicker
            selected={journal.dueDate && moment(journal.dueDate)}
            onChange={(date, e) =>
              handleJournalChange("dueDate", date && moment(date).toDate())
            }
            locale={i18n.time.getLocale()}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Kuvaus</label>
          <textarea
            onChange={(e) =>
              handleJournalChange("description", e.currentTarget.value)
            }
            value={journal.description}
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
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "50px",
          width: "100%",
        }}
      >
        <Button onClick={handleSaveClick}>Tallenna</Button>
        <Button onClick={onCancelClick}>Peruuta</Button>
      </div>
    </div>
  );
};

export default JournalListEditorEdit;
