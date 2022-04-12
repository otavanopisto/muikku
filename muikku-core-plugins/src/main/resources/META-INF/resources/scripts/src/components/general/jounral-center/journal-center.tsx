import * as React from "react";
import {
  JournalCenterUsePlaceType,
  SelectedJournal,
} from "~/@types/journal-center";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";
import { IconButton } from "~/components/general/button";
import Tabs, { Tab } from "~/components/general/tabs";
import { useJournals } from "./hooks/useJournals";
import JournalListItemCurrent from "./journal-center-item-current";
import SlideDrawer from "./slide-drawer";
import JournalListEditorNew from "./journal-center-item-current-new";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { StateType } from "~/reducers";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import JournalList from "./journal-item-list";

/**
 * JournalCenterProps
 */
interface JournalCenterProps {
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
  usePlace: JournalCenterUsePlaceType;
  /**
   * If history panel want to be visible
   */
  showHistoryPanel: boolean;
  /**
   * Handles display notification from redux side
   */
  displayNotification: DisplayNotificationTriggerType;
  /**
   * For localization
   */
  i18n: i18nType;
}

/**
 * Creater Journal center component
 *
 * @param props props
 * @returns JSX.Element
 */
const JournalCenter: React.FC<JournalCenterProps> = (props) => {
  const {
    showHistoryPanel,
    displayNotification,
    userId,
    studentId,
    usePlace,
    i18n,
  } = props;

  const [activeTab, setActiveTab] = React.useState("ongoing");

  const [selectedJournal, setSelectedJournal] = React.useState<SelectedJournal>(
    { journal: undefined, inEditMode: false }
  );

  const [createNew, setCreateNew] = React.useState(false);

  const {
    journals,
    createJournal,
    updateJournal,
    archiveJournal,
    returnArchivedJournal,
    updateJournalStatus,
    pinJournal,
  } = useJournals(studentId, displayNotification);

  /**
   * Handles tab change
   * @param tab tab
   */
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  /**
   * Handles create new journal click
   */
  const handleCreateNewClick = () => {
    /**
     * This is needed to tell react to re render after when all useStates are
     * done
     */
    unstable_batchedUpdates(() => {
      setSelectedJournal({ journal: undefined, inEditMode: false });
      setCreateNew(true);
    });
  };

  /**
   * Handles cancle new click
   */
  const handleCancelNewClick = () => {
    setCreateNew(false);
  };

  /**
   * Handles close current note click
   */
  const handleCloseCurrentNote = React.useCallback(
    () => setSelectedJournal({ journal: undefined, inEditMode: false }),
    []
  );

  /**
   * Handles note in edit mode click
   * @param id id
   */
  const handleOpenInEditModeClick = React.useCallback(
    (id: number) => {
      const journalFromList = journals.journalsList.find((j) => j.id === id);

      setSelectedJournal({
        journal: journalFromList,
        inEditMode: true,
      });
    },
    [journals.journalsList]
  );

  /**
   * Handles journal item click
   * @param id id of clicked journal
   */
  const handleJournalItemClick = React.useCallback(
    (id: number) => {
      const journalFromList = journals.journalsList.find((j) => j.id === id);

      setSelectedJournal({
        journal: journalFromList,
        inEditMode: false,
      });
    },
    [journals.journalsList]
  );

  /**
   * Handles journal item click
   * @param id id of clicked journal
   */
  const handleArchivedJournalItemClick = React.useCallback(
    (id: number) => {
      const journalFromList = journals.journalsArchivedList.find(
        (j) => j.id === id
      );

      setSelectedJournal({
        journal: journalFromList,
        inEditMode: false,
      });
    },
    [journals.journalsArchivedList]
  );

  /**
   * List of journal center tabs
   */
  const journallCenterTabs: Tab[] = [
    {
      id: "ongoing",
      type: "journal-center",
      name: "Keskeneräiset",
      /**
       * component
       */
      component: (
        <JournalCentertContainer>
          <JournalList
            isLoadingList={journals.isLoadingList}
            journals={journals.journalsList}
            userId={userId}
            usePlace={usePlace}
            selectedJournal={selectedJournal}
            onPinJournalClick={pinJournal}
            onArchiveClick={archiveJournal}
            onUpdateJournalStatus={updateJournalStatus}
            onEditClick={handleOpenInEditModeClick}
            onJournalClick={handleJournalItemClick}
          />

          <JournalCurrentNoteContent>
            <JournalFunctionsBar>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton icon="plus" onClick={handleCreateNewClick} />
              </div>
            </JournalFunctionsBar>
            <div className="editor-default-content">
              <h2>Ei valittua toiminnallisuutta</h2>
            </div>
            {journals.journalsList.map((j) => (
              <SlideDrawer
                key={j.id}
                title="Tiedot"
                modifiers={["from-left"]}
                show={
                  selectedJournal.journal && selectedJournal.journal.id === j.id
                }
                onClose={handleCloseCurrentNote}
              >
                <JournalListItemCurrent
                  i18n={i18n}
                  userId={userId}
                  onJournalUpdate={updateJournal}
                  onPinJournalClick={pinJournal}
                  journals={journals}
                  currentSelectedJournal={j}
                  openInEditMode={
                    selectedJournal.journal &&
                    selectedJournal.journal.id === j.id &&
                    selectedJournal.inEditMode
                  }
                  onClickCloseCurrent={handleCloseCurrentNote}
                  loggedUserIsCreator={j.creator === userId}
                  loggedUserIsOwner={j.owner === userId}
                />
              </SlideDrawer>
            ))}

            <SlideDrawer
              show={createNew}
              onClose={handleCancelNewClick}
              title="Uusi lappu"
            >
              <JournalListEditorNew
                newNoteOwnerId={studentId}
                journals={journals}
                onCancelClick={handleCancelNewClick}
                onJournalSaveClick={createJournal}
                i18n={i18n}
              />
            </SlideDrawer>
          </JournalCurrentNoteContent>
        </JournalCentertContainer>
      ),
    },
  ];

  if (showHistoryPanel) {
    journallCenterTabs.push({
      id: "history",
      type: "journal-center",
      name: "Vanhentuneet/Tehdyt",
      /**
       * component
       */
      component: (
        <JournalCentertContainer>
          <JournalList
            isLoadingList={journals.isLoadingList}
            journals={journals.journalsArchivedList}
            userId={userId}
            usePlace={usePlace}
            selectedJournal={selectedJournal}
            onReturnArchivedClick={returnArchivedJournal}
            onJournalClick={handleArchivedJournalItemClick}
          />

          <JournalCurrentNoteContent>
            <JournalFunctionsBar />
            <div className="editor-default-content">
              <h2>Ei valittua toiminnallisuutta</h2>
            </div>
            {journals.journalsArchivedList.map((j) => (
              <SlideDrawer
                key={j.id}
                title="Valittu lappu"
                modifiers={["from-left"]}
                show={
                  selectedJournal.journal && selectedJournal.journal.id === j.id
                }
                onClose={handleCloseCurrentNote}
              >
                <JournalListItemCurrent
                  i18n={i18n}
                  userId={userId}
                  onPinJournalClick={pinJournal}
                  journals={journals}
                  currentSelectedJournal={j}
                  onClickCloseCurrent={handleCloseCurrentNote}
                  loggedUserIsCreator={j.creator === userId}
                  loggedUserIsOwner={j.owner === userId}
                />
              </SlideDrawer>
            ))}
          </JournalCurrentNoteContent>
        </JournalCentertContainer>
      ),
    });
  }

  return (
    <div>
      <Tabs
        modifier="journal-center"
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={journallCenterTabs}
      />
    </div>
  );
};

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
  return bindActionCreators({ displayNotification }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(JournalCenter);

/**
 * JournalFunctionBarProps
 */
interface JournalFunctionBarProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

/**
 * JournalFunctionsBar
 * @param props props
 */
export const JournalFunctionsBar: React.FC<JournalFunctionBarProps> = (
  props
) => (
  <div className="journal-function-bar" {...props}>
    {props.children}
  </div>
);

/**
 * JournalContentContainerProps
 */
interface JournalContentContainerProps {}

/**
 * Creater Journal content container component
 * @param props props
 * @returns JSX.Element
 */
const JournalCentertContainer: React.FC<JournalContentContainerProps> = (
  props
) => {
  const { children } = props;

  return <div className="journal-center-container">{children}</div>;
};

/**
 * JournalContentContainerProps
 */
interface JournalCurrentNoteContainerProps {}

/**
 * Creater Journal content container component
 * @param props props
 * @returns JSX.Element
 */
const JournalCurrentNoteContent: React.FC<JournalCurrentNoteContainerProps> = (
  props
) => {
  const { children } = props;

  return <div className="current-note-content">{children}</div>;
};
