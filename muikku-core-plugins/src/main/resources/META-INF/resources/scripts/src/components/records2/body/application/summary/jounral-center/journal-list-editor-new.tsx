import * as React from "react";
import Button from "~/components/general/button";
import {
  JournalCenterUsePlaceType,
  JournalCreationType,
  JournalPriority,
  UseJournals,
} from "~/@types/journal-center";
import { JournalNoteCreate } from "../../../../../../@types/journal-center";

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
}

/**
 * Creates journal list editor
 * @param props props
 * @returns JSX.Element
 */
const JournalListEditorNew: React.FC<JournalListEditorNewProps> = (props) => {
  const { journals, onCancelClick, onJournalSaveClick, newNoteOwnerId } = props;

  const [journal, setJournal] = React.useState<JournalNoteCreate>({
    title: "",
    description: "",
    type: JournalCreationType.MANUAL,
    priority: JournalPriority.HIGH,
    pinned: false,
    owner: newNoteOwnerId,
  });

  /**
   * handleJournalChange
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
   * handleSaveNewClick
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
