import * as React from "react";
import { NotesItemFilters, NotesLocation } from "~/@types/notes";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";
import Tabs, { Tab } from "~/components/general/tabs";
import { useNotesItem } from "./hooks/useNotesItems";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import NotesItemList from "./notes-item-list";
import { ButtonPill } from "~/components/general/button";
import NotesItemNew from "./notes-item-new";
import NotesItemListFilters from "./notes-item-list-filters";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * NotesProps
 */
interface NotesProps {
  /**
   * id of user who is logged in to use Journal central to create notes ie. student/supervisor
   */
  userId: number;

  /**
   * id of student who is recipient of new notes and whos notes are loaded
   */
  studentId: number;

  /**
   * use place option to render diffent functionalities
   */
  usePlace: NotesLocation;
  /**
   * If history panel want to be visible
   */
  showHistoryPanel: boolean;
  /**
   * Handles display notification from redux side
   */
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * Creater NotesItem center component
 *
 * @param props props
 * @returns React.JSX.Element
 */
const Notes: React.FC<NotesProps> = (props) => {
  const { showHistoryPanel, displayNotification, userId, studentId, usePlace } =
    props;
  const { t } = useTranslation("tasks");

  const [activeTab, setActiveTab] = React.useState("active");

  const {
    notesItems,
    createNotesItem,
    updateNotesItem,
    archiveNotesItem,
    returnArchivedNotesItem,
    updateNotesItemStatus,
  } = useNotesItem(studentId, displayNotification);

  const [activeNoteFilters, setActiveNoteFilters] =
    React.useState<NotesItemFilters>({
      high: false,
      normal: false,
      low: false,
      own: false,
      guider: false,
    });

  const [nonActiveNoteFilters, setNoneActiveNoteFilters] =
    React.useState<NotesItemFilters>({
      high: false,
      normal: false,
      low: false,
      own: false,
      guider: false,
    });

  /**
   * Handles tab change
   * @param tab tab
   */
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  /**
   * Handles active filters changes
   * @param updatedFilters name
   */
  const handleActiveFiltersChange = (updatedFilters: NotesItemFilters) => {
    setActiveNoteFilters(updatedFilters);
  };

  /**
   * Handles non active filters changes
   * @param updatedFilters name
   */
  const handleNonActiveFiltersChange = (updatedFilters: NotesItemFilters) => {
    setNoneActiveNoteFilters(updatedFilters);
  };

  /**
   * List of jnotesItemournal center tabs
   */
  const notesTabs: Tab[] = [
    {
      id: "active",
      type: "notes",
      name: t("labels.tasks", { context: "active" }),
      /**
       * component
       */
      component: (
        <NotesContainer>
          <NotesToolbar>
            <div className="notes__toolbar-section">
              <NotesItemNew
                newNoteRecipientId={studentId}
                onNotesItemSaveClick={createNotesItem}
              >
                <ButtonPill
                  buttonModifiers={["add-note", "within-content"]}
                  icon="plus"
                  aria-label={t("wcag.createNewNote")}
                />
              </NotesItemNew>
            </div>

            <NotesItemListFilters
              usePlace={usePlace}
              filters={activeNoteFilters}
              onFilttersChange={handleActiveFiltersChange}
            />
          </NotesToolbar>
          <NotesItemList
            filters={activeNoteFilters}
            isLoadingList={notesItems.isLoadingList}
            notesItems={notesItems.notesItemList}
            notesRecipientId={studentId}
            userId={userId}
            usePlace={usePlace}
            onPinNotesItemClick={updateNotesItemStatus}
            onArchiveClick={archiveNotesItem}
            onUpdateNotesItemStatus={updateNotesItemStatus}
            onNotesItemSaveUpdateClick={updateNotesItem}
          />
        </NotesContainer>
      ),
    },
  ];

  if (showHistoryPanel) {
    notesTabs.push({
      id: "archived",
      type: "notes",
      name: t("labels.tasks", { context: "archived" }),
      /**
       * component
       */
      component: (
        <NotesContainer>
          <NotesToolbar>
            <div className="notes__toolbar-section">
              <NotesItemNew
                newNoteRecipientId={studentId}
                onNotesItemSaveClick={createNotesItem}
              >
                <ButtonPill
                  buttonModifiers={["add-note", "within-content"]}
                  icon="plus"
                  aria-label={t("wcag.createNewNote")}
                  disabled
                />
              </NotesItemNew>
            </div>
            <NotesItemListFilters
              usePlace={usePlace}
              filters={activeNoteFilters}
              onFilttersChange={handleNonActiveFiltersChange}
            />
          </NotesToolbar>
          <NotesItemList
            filters={nonActiveNoteFilters}
            isLoadingList={notesItems.isLoadingList}
            notesItems={notesItems.notesArchivedItemList}
            userId={userId}
            usePlace={usePlace}
            onReturnArchivedClick={returnArchivedNotesItem}
          />
        </NotesContainer>
      ),
    });
  }

  return (
    <Tabs
      modifier="notes"
      activeTab={activeTab}
      onTabChange={handleTabChange}
      tabs={notesTabs}
      nested
    />
  );
};

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default connect(null, mapDispatchToProps)(Notes);

/**
 * NotesToolbarProps
 */
interface NotesToolbarProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

/**
 * NotesToolbar
 * @param props props
 */
export const NotesToolbar: React.FC<NotesToolbarProps> = (props) => (
  <div className="notes__toolbar" {...props}>
    {props.children}
  </div>
);

/**
 * NotesContainerProps
 */
interface NotesContainerProps {}

/**
 * Creater NotesItem content container component
 * @param props props
 * @returns React.JSX.Element
 */
const NotesContainer: React.FC<NotesContainerProps> = (props) => {
  const { children } = props;

  return <div className="notes">{children}</div>;
};
