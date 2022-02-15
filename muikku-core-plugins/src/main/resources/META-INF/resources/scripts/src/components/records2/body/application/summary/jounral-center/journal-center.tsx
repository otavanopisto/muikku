import * as React from "react";
import {
  JournalCenterUsePlaceType,
  JournalFiltters,
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
  const { showHistoryPanel, displayNotification, userId, studentId, usePlace } =
    props;

  const [activeTab, setActiveTab] = React.useState("ongoing");

  const [selectedJournal, setSelectedJournal] = React.useState<SelectedJournal>(
    { journal: undefined, inEditMode: false }
  );

  const [filters, setFilters] = React.useState<JournalFiltters>({
    high: false,
    normal: false,
    low: false,
    own: false,
    guider: false,
  });

  const [createNew, setCreateNew] = React.useState(false);

  const { journals, createJournal, updateJournal, deleteJournal, pinJournal } =
    useJournals(studentId, displayNotification);

  /**
   * handleFilttersChange
   * @param updatedFilters name
   */
  const handleFilttersChange = (updatedFilters: JournalFiltters) => {
    setFilters(updatedFilters);
  };

  /**
   * onTabChange
   * @param tab tab
   */
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  /**
   * handleCreateNewClick
   */
  const handleCreateNewClick = () => {
    unstable_batchedUpdates(() => {
      setSelectedJournal({ journal: undefined, inEditMode: false });
      setCreateNew(true);
    });
  };

  /**
   * handleCancelNewClick
   */
  const handleCancelNewClick = () => {
    setCreateNew(false);
  };

  /**
   * handleCloseCurrentNote
   */
  const handleCloseCurrentNote = () => {
    setSelectedJournal({ journal: undefined, inEditMode: false });
  };

  /**
   * handleOnOpenInEditModeClick
   * @param id id
   */
  const handleOnOpenInEditModeClick = (id: number) => {
    const journalFromList = journals.journalsList.find((j) => j.id === id);

    setSelectedJournal({
      journal: journalFromList,
      inEditMode: true,
    });
  };

  /**
   * handleClickJournalItemClick
   * @param id id of clicked journal
   */
  const handleJournalItemClick = (id: number) => {
    const journalFromList = journals.journalsList.find((j) => j.id === id);

    setSelectedJournal({
      journal: journalFromList,
      inEditMode: false,
    });
  };

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
          <div
            className="list-container"
            style={{ width: "40%", overflow: "hidden", paddingRight: "10px" }}
          >
            <JournalFunctionsBar
              style={{
                width: "100%",
                height: "60px",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <JournalListFiltters
                usePlace={usePlace}
                filtters={filters}
                onFilttersChange={handleFilttersChange}
              />
            </JournalFunctionsBar>

            <JournalListAnimated journals={journals}>
              {sortJournalsBy(journals.journalsList, filters, userId).map(
                (j) => (
                  <JournalListItem
                    journal={j}
                    ref={React.createRef()}
                    key={j.id}
                    onPinJournalClick={pinJournal}
                    loggedUserIsOwner={j.creator === userId}
                    onDeleteClick={deleteJournal}
                    onEditClick={handleOnOpenInEditModeClick}
                    onJournalClick={handleJournalItemClick}
                  />
                )
              )}
            </JournalListAnimated>
          </div>

          <div
            className="current-editor-container"
            style={{
              height: "100%",
              width: "60%",
              paddingLeft: "10px",
              borderLeft: "solid black 1px",
              borderLeftStyle: "dashed",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <JournalFunctionsBar
              style={{
                width: "100%",
                height: "60px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton icon="plus" onClick={handleCreateNewClick} />
              </div>
            </JournalFunctionsBar>
            <div
              className="block"
              style={{
                height: "100%",
                padding: "10px 0px",
                overflow: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <h2>Ei valittua toiminnallisuutta</h2>
            </div>
            {journals.journalsList.map((j) => (
              <SlideDrawer
                key={j.id}
                title={j.title}
                modifiers={["from-left"]}
                show={
                  selectedJournal.journal && selectedJournal.journal.id === j.id
                }
                onClose={handleCloseCurrentNote}
              >
                <JournalListItemCurrent
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
          <div
            className="list-container"
            style={{ width: "40%", overflow: "hidden", paddingRight: "10px" }}
          >
            <JournalFunctionsBar
              style={{
                width: "100%",
                height: "60px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <JournalListFiltters
                usePlace={usePlace}
                filtters={filters}
                onFilttersChange={handleFilttersChange}
              />
            </JournalFunctionsBar>

            <JournalListAnimated journals={journals}>
              {sortJournalsBy(journals.journalsList, filters, userId).map(
                (j) => (
                  <JournalListItem
                    journal={j}
                    ref={React.createRef()}
                    key={j.id}
                    loggedUserIsOwner={j.creator === userId}
                    onDeleteClick={deleteJournal}
                    onEditClick={handleOnOpenInEditModeClick}
                    onJournalClick={handleJournalItemClick}
                    onPinJournalClick={pinJournal}
                  />
                )
              )}
            </JournalListAnimated>
          </div>
          <div
            className="current-editor-container"
            style={{
              height: "100%",
              width: "60%",
              paddingLeft: "10px",
              borderLeft: "solid black 1px",
              borderLeftStyle: "dashed",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              className="block"
              style={{
                height: "100%",
                padding: "10px 0px",
                overflow: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <h2>Ei valittua toiminnallisuutta</h2>
            </div>
            {journals.journalsList.map((j) => (
              <SlideDrawer
                key={j.id}
                title={j.title}
                modifiers={["from-left"]}
                show={
                  selectedJournal.journal && selectedJournal.journal.id === j.id
                }
                onClose={handleCloseCurrentNote}
              >
                <JournalListItemCurrent
                  userId={userId}
                  onPinJournalClick={pinJournal}
                  onJournalUpdate={updateJournal}
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
  return {};
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
  <div className="content-function-bar" {...props}>
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

  return (
    <div style={{ height: "800px", padding: "10px 0px", display: "flex" }}>
      {children}
    </div>
  );
};
