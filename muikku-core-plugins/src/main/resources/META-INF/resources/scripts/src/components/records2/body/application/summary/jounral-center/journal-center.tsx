import * as React from "react";
import {
  JournalCenterUsePlaceType,
  JournalFilters,
  JournalNoteRead,
} from "~/@types/journal-center";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";
import { IconButton } from "~/components/general/button";
import Tabs, { Tab } from "~/components/general/tabs";
import { createAllTabs } from "~/helper-functions/tabs";
import { useJournals } from "./hooks/useJournals";
import JournalListFiltters from "./journal-list-filtters";
import JournalListItemCurrent from "./journal-list-item-current";
import SlideDrawer from "./slide-drawer";
import JournalListEditorNew from "./journal-list-editor-new";
import JournalListItem from "./journal-list-item";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import JournalListAnimated from "./journal-list-animated";
import { StateType } from "~/reducers";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { sortJournalsBy } from "./helpers/filters";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";

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
 * SelectedJournal
 */
interface SelectedJournal {
  journal: JournalNoteRead;
  inEditMode: boolean;
}

/**
 * Creater Journal center component
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

  const [filters, setFilters] = React.useState<JournalFilters>({
    high: false,
    normal: false,
    low: false,
    own: false,
    guider: false,
  });

  const [createNew, setCreateNew] = React.useState(false);

  const {
    journals,
    createJournal,
    updateJournal,
    archiveJournal,
    returnArchivedJournal,
    pinJournal,
  } = useJournals(studentId, displayNotification);

  /**
   * handleFilttersChange
   * @param updatedFilters name
   */
  const handleFiltersChange = (updatedFilters: JournalFilters) => {
    setFilters(updatedFilters);
  };

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
  const handleCloseCurrentNote = () => {
    setSelectedJournal({ journal: undefined, inEditMode: false });
  };

  /**
   * Handles note in edit mode click
   * @param id id
   */
  const handleOpenInEditModeClick = (id: number) => {
    const journalFromList = journals.journalsList.find((j) => j.id === id);

    setSelectedJournal({
      journal: journalFromList,
      inEditMode: true,
    });
  };

  /**
   * Handles journal item click
   * @param id id of clicked journal
   */
  const handleJournalItemClick = (id: number) => {
    const journalFromList = journals.journalsList.find((j) => j.id === id);

    setSelectedJournal({
      journal: journalFromList,
      inEditMode: false,
    });
  };

  /**
   * Handles journal item click
   * @param id id of clicked journal
   */
  const handleArchivedJournalItemClick = (id: number) => {
    const journalFromList = journals.journalsArchivedList.find(
      (j) => j.id === id
    );

    setSelectedJournal({
      journal: journalFromList,
      inEditMode: false,
    });
  };

  console.log(journals);

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
      component: () => (
        <JournalContentContainer>
          <div className="journal-list-content">
            <JournalFunctionsBar>
              <JournalListFiltters
                usePlace={usePlace}
                filters={filters}
                onFilttersChange={handleFiltersChange}
              />
            </JournalFunctionsBar>

            <JournalListAnimated journals={journals}>
              {sortJournalsBy(journals.journalsList, filters, userId).map(
                (j) => (
                  <JournalListItem
                    key={j.id}
                    ref={React.createRef()}
                    journal={j}
                    active={
                      selectedJournal.journal &&
                      selectedJournal.journal.id === j.id
                    }
                    archived={false}
                    loggedUserIsOwner={j.creator === userId}
                    onPinJournalClick={pinJournal}
                    onArchiveClick={archiveJournal}
                    onEditClick={handleOpenInEditModeClick}
                    onJournalClick={handleJournalItemClick}
                  />
                )
              )}
            </JournalListAnimated>
          </div>

          <div className="current-editor-container">
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
                  loggedUserIsOwner={j.creator === userId}
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
          </div>
        </JournalContentContainer>
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
      component: () => (
        <JournalContentContainer>
          <div className="journal-list-content">
            <JournalFunctionsBar>
              <JournalListFiltters
                usePlace={usePlace}
                filters={filters}
                onFilttersChange={handleFiltersChange}
              />
            </JournalFunctionsBar>

            <JournalListAnimated journals={journals}>
              {sortJournalsBy(
                journals.journalsArchivedList,
                filters,
                userId
              ).map((j) => (
                <JournalListItem
                  key={j.id}
                  ref={React.createRef()}
                  journal={j}
                  active={
                    selectedJournal.journal &&
                    selectedJournal.journal.id === j.id
                  }
                  loggedUserIsOwner={j.creator === userId}
                  archived={true}
                  onReturnArchivedClick={returnArchivedJournal}
                  onJournalClick={handleArchivedJournalItemClick}
                  onPinJournalClick={pinJournal}
                />
              ))}
            </JournalListAnimated>
          </div>
          <div className="current-editor-container">
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
                  loggedUserIsOwner={j.creator === userId}
                />
              </SlideDrawer>
            ))}
          </div>
        </JournalContentContainer>
      ),
    });
  }

  return (
    <div>
      <Tabs
        allTabs={createAllTabs(journallCenterTabs)}
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
const JournalFunctionsBar: React.FC<JournalFunctionBarProps> = (props) => (
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
const JournalContentContainer: React.FC<JournalContentContainerProps> = (
  props
) => {
  const { children } = props;

  return <div className="journal-content-container">{children}</div>;
};
