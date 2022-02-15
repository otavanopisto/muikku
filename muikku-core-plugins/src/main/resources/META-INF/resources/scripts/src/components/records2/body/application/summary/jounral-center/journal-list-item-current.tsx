import * as React from "react";
import Button, { IconButton } from "~/components/general/button";
import JournalPriorityChip from "./journal-list-filtters-chip";
import {
  JournalNoteUpdate,
  JournalPriority,
} from "../../../../../../@types/journal-center";
import { UseJournals, JournalNoteRead } from "~/@types/journal-center";
import JournalListEditorEdit from "./journal-list-editor-edit";
import { i18nType } from "~/reducers/base/i18n";
import * as moment from "moment";

/**
 * JournalListProps
 */
interface JournalListItemCurrentProps {
  userId: number;
  journals: UseJournals;
  openInEditMode: boolean;
  currentSelectedJournal?: JournalNoteRead;
  dateEnd?: string;
  loggedUserIsOwner?: boolean;
  i18n: i18nType;
  onClickCloseCurrent?: () => void;
  onJournalUpdate: (
    journalId: number,
    updatedJournal: JournalNoteUpdate
  ) => void;
  onPinJournalClick: (journalId: number, journal: JournalNoteUpdate) => void;
}

/**
 * Creater Journal list component
 * @param props props
 * @returns JSX.Element
 */
const JournalListItemCurrent: React.FC<JournalListItemCurrentProps> = (
  props
) => {
  const {
    openInEditMode,
    journals,
    currentSelectedJournal,
    loggedUserIsOwner,
    onJournalUpdate,
    onPinJournalClick,
    onClickCloseCurrent,
    userId,
    i18n,
  } = props;

  React.useEffect(() => {
    setEditMode(openInEditMode);
  }, [openInEditMode]);

  const [editMode, setEditMode] = React.useState(false);

  if (currentSelectedJournal === undefined) {
    return (
      <div
        className="block"
        style={{
          height: "100%",
          padding: "10px 0px",
          overflow: "auto",
          width: "100%",
        }}
      />
    );
  }

  const { priority, description, title, creator, id, pinned, dueDate } =
    currentSelectedJournal;

  const content: JSX.Element[] = [];

  /**
   * handleCancelEditClick
   */
  const handleCancelEditClick = () => {
    setEditMode(false);
  };

  /**
   * handleClickEditMode
   */
  const handleClickEditMode = () => {
    setEditMode(true);
  };

  /**
   * handleSaveNewClick
   */
  const handlePinClick = () => {
    onPinJournalClick(id, currentSelectedJournal);
  };

  /**
   * priorityColours
   * @param priority priority
   * @returns object of priority info
   */
  const priorityColours = (priority: JournalPriority) => {
    switch (priority) {
      case JournalPriority.HIGH:
        return {
          label: "Tärkeä",
          colour: "red",
        };
      case JournalPriority.NORMAL:
        return {
          label: "Melko tärkeä",
          colour: "orange",
        };
      case JournalPriority.LOW:
        return {
          label: "Ei tärkeä",
          colour: "green",
        };

      default:
        break;
    }
  };

  if (priority) {
    const priorityInfo = priorityColours(priority);

    content.push(
      <JournalPriorityChip
        key="chip-priority"
        label={priorityInfo.label}
        colour={priorityInfo.colour}
      />
    );
  }

  if (creator === userId) {
    content.push(
      <JournalPriorityChip key="chip-own" label="Omat" colour="teal" />
    );
  }

  if (dueDate) {
    content.push(
      <div key="date">Suorita {moment(dueDate).format("l")} mennessä</div>
    );
  }

  if (editMode) {
    return (
      <JournalListEditorEdit
        onJournalSaveUpdateClick={onJournalUpdate}
        onCancelClick={handleCancelEditClick}
        selectedJournal={currentSelectedJournal}
        journals={journals}
        i18n={i18n}
      />
    );
  }

  return (
    <div
      className="block"
      style={{
        height: "100%",
        padding: "10px 0px",
        overflow: "auto",
        width: "100%",
      }}
    >
      <div className="block-content">
        <div
          className="block-content-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "5px 0",
          }}
        >
          <h1>{title}</h1>
          <div>
            {loggedUserIsOwner ? (
              <IconButton onClick={handleClickEditMode} icon="pencil" />
            ) : null}
            <IconButton
              style={{ backgroundColor: pinned && "blue" }}
              icon="pin"
              onClick={handlePinClick}
            />
          </div>
        </div>
        {content.length > 0 ? (
          <div
            className="block-content-meta"
            style={{ display: "flex", alignItems: "center", margin: "5px 0" }}
          >
            {content}
          </div>
        ) : null}

        <div className="block-content-text" style={{ margin: "5px 0" }}>
          {description}
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
        <Button onClick={onClickCloseCurrent}>Sulje</Button>
      </div>
    </div>
  );
};

export default JournalListItemCurrent;
