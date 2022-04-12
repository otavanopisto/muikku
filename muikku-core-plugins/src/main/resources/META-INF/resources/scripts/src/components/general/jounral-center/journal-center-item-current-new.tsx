import * as React from "react";
import Button from "~/components/general/button";
import {
  JournalCreationType,
  JournalPriority,
  UseJournals,
} from "~/@types/journal-center";
import { JournalNoteCreate } from "../../../@types/journal-center";
import { i18nType } from "~/reducers/base/i18n";
import DatePicker from "react-datepicker";
import "~/sass/elements/datepicker/datepicker.scss";

/**
 * JournalListEditorProps
 */
interface JournalListEditorNewProps {
  /**
   * Id of note owner (recipient)
   */
  newNoteOwnerId: number;
  journals: UseJournals;
  onCancelClick?: () => void;
  onJournalSaveClick?: (
    newJournal: JournalNoteCreate,
    onSuccess?: () => void
  ) => Promise<void>;
  i18n: i18nType;
}

/**
 * Creates journal list editor "new"
 * @param props props
 * @returns JSX.Element
 */
const JournalListEditorNew: React.FC<JournalListEditorNewProps> = (props) => {
  const { onCancelClick, onJournalSaveClick, newNoteOwnerId } = props;

  const [journal, setJournal] = React.useState<JournalNoteCreate>({
    title: "",
    description: "",
    type: JournalCreationType.MANUAL,
    priority: JournalPriority.HIGH,
    pinned: false,
    owner: newNoteOwnerId,
    startDate: null,
    dueDate: null,
  });

  /**
   * Handles journal change
   * @param key name of updated property
   * @param value of updated property
   */
  const handleJournalChange = <T extends keyof JournalNoteCreate>(
    key: T,
    value: JournalNoteCreate[T]
  ) => {
    const updateJournal = { ...journal };

    updateJournal[key] = value;

    setJournal(updateJournal);
  };

  /**
   * Handles save click
   */
  const handleSaveClick = () => {
    onJournalSaveClick(journal, () => {
      setJournal({
        title: "",
        description: "",
        type: JournalCreationType.MANUAL,
        priority: JournalPriority.HIGH,
        pinned: false,
        owner: newNoteOwnerId,
        startDate: null,
        dueDate: null,
      });
    });
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
          <label style={{ marginRight: "5px" }}>Alkamispäivä</label>
          {/* <DatePicker
            selected={journal.startDate && moment(journal.startDate)}
            onChange={(date, e) =>
              handleJournalChange("startDate", date && moment(date).toDate())
            }
            locale={props.i18n.time.getLocale()}
          />
          <label style={{ marginRight: "5px" }}>Päättymispäivä</label>
          <DatePicker
            selected={journal.dueDate && moment(journal.dueDate)}
            onChange={(date, e) =>
              handleJournalChange("dueDate", date && moment(date).toDate())
            }
            locale={props.i18n.time.getLocale()}
          /> */}
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

export default JournalListEditorNew;
