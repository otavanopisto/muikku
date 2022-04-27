import * as React from "react";
import { JournalCenterUsePlaceType } from "~/@types/journal-center";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";
import Tabs, { Tab } from "~/components/general/tabs";
import { useJournals } from "./hooks/useJournals";
import { StateType } from "~/reducers";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import JournalList from "./journal-item-list";
import Button from "~/components/general/button";
import JournalCenterItemNew from "./journal-center-item-new";

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
          <JournalFunctionsBar>
            <JournalCenterItemNew
              newNoteOwnerId={studentId}
              onJournalSaveClick={createJournal}
            >
              <Button>Uusi lappu</Button>
            </JournalCenterItemNew>
          </JournalFunctionsBar>
          <JournalList
            isLoadingList={journals.isLoadingList}
            journals={journals.journalsList}
            userId={userId}
            usePlace={usePlace}
            onPinJournalClick={pinJournal}
            onArchiveClick={archiveJournal}
            onUpdateJournalStatus={updateJournalStatus}
            onJournalSaveUpdateClick={updateJournal}
          />
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
            onReturnArchivedClick={returnArchivedJournal}
          />
        </JournalCentertContainer>
      ),
    });
  }

  return (
    <Tabs
      modifier="journal-center"
      activeTab={activeTab}
      onTabChange={handleTabChange}
      tabs={journallCenterTabs}
    />
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
