import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import { useEvaluatedAssignments } from "./hooks/useEvaluated";
import { useJournals } from "./hooks/useJournals";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { i18nType } from "~/reducers/base/i18n";
import ApplicationList from "~/components/general/application-list";
import { WorkspaceType } from "~/reducers/workspaces";
import { StatusType } from "../../../../../reducers/base/status";
import Material from "../current-record/material";
import Journal from "../current-record/journal";
import Tabs, { Tab } from "~/components/general/tabs";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import { useExcerciseAssignments } from "./hooks/useExcercises";
import { useCompositeReply } from "./hooks/useCompositeReply";
import Link from "~/components/general/link";

import "~/sass/elements/empty.scss";
import "~/sass/elements/application-sub-panel.scss";

/**
 * AssignmentsAndDiariesProps
 */
interface AssignmentsAndDiariesProps {
  i18n: i18nType;
  status: StatusType;
  workspace: WorkspaceType;
  workspaceId: number;
  userEntityId: number;
  displayNotification: DisplayNotificationTriggerType;
}

export type AssignmentsTabType = "EVALUATED" | "EXCERCISE";

/**
 * AssignmentsAndDiaries
 * @param props props
 * @returns JSX.Element
 */
const AssignmentsAndDiaries: React.FC<AssignmentsAndDiariesProps> = (props) => {
  const {
    i18n,
    status,
    workspace,
    workspaceId,
    userEntityId,
    displayNotification,
  } = props;

  const [activeTab, setActiveTab] =
    React.useState<AssignmentsTabType>("EVALUATED");

  const [journalsOpen, setJournalsOpen] = React.useState<number[]>([]);
  const [excerciseOpen, setExcerciseOpen] = React.useState<number[]>([]);
  const [evaluatedOpen, setEvaluatedOpen] = React.useState<number[]>([]);

  const { evaluatedAssignmentsData } = useEvaluatedAssignments(
    workspaceId,
    activeTab,
    i18n,
    displayNotification
  );

  const { excerciseAssignmentsData } = useExcerciseAssignments(
    workspaceId,
    activeTab,
    i18n,
    displayNotification
  );

  const { compositeReplyData } = useCompositeReply(
    userEntityId,
    workspaceId,
    i18n,
    displayNotification
  );

  const { journalsData } = useJournals(
    userEntityId,
    workspaceId,
    i18n,
    displayNotification
  );

  /**
   * onTabChange
   * @param id id
   */
  const onTabChange = (id: AssignmentsTabType) => {
    setActiveTab(id);
  };

  /**
   * handleAllAssignmentsByType
   * @param type type
   */
  const handleOpenAllAssignmentsByTypeClick =
    (type: "EXERCISE" | "EVALUATED") =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      switch (type) {
        case "EXERCISE": {
          const list = excerciseAssignmentsData.excerciseAssignments.map(
            (e) => e.id
          );
          setExcerciseOpen(list);
          break;
        }

        case "EVALUATED": {
          const list = evaluatedAssignmentsData.evaluatedAssignments.map(
            (e) => e.id
          );
          setEvaluatedOpen(list);
          break;
        }

        default:
          break;
      }
    };

  /**
   * handleCloseAllAssignmentsByTypeClick
   * @param type type
   */
  const handleCloseAllAssignmentsByTypeClick =
    (type: "EXERCISE" | "EVALUATED") =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      switch (type) {
        case "EXERCISE":
          setExcerciseOpen([]);
          break;

        case "EVALUATED":
          setEvaluatedOpen([]);
          break;

        default:
          break;
      }
    };

  /**
   * handleAssignmentByTypeClick
   * @param id id
   * @param type type
   */
  const handleAssignmentByTypeClick =
    (id: number, type: "EXERCISE" | "EVALUATED") =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      switch (type) {
        case "EXERCISE": {
          const updatedList = [...excerciseOpen];

          const index = updatedList.indexOf(id);

          if (index !== -1) {
            updatedList.splice(index, 1);
          } else {
            updatedList.push(id);
          }

          setExcerciseOpen(updatedList);
          break;
        }

        case "EVALUATED": {
          const updatedList = [...evaluatedOpen];

          const index = updatedList.indexOf(id);

          if (index !== -1) {
            updatedList.splice(index, 1);
          } else {
            updatedList.push(id);
          }

          setEvaluatedOpen(updatedList);
          break;
        }

        default:
          break;
      }
    };

  /**
   * handleOpenAllJournalsClick
   */
  const handleOpenAllJournalsClick = () => {
    setJournalsOpen(journalsData.journals.map((j) => j.id));
  };

  /**
   * handleCloseAllJournalsClick
   */
  const handleCloseAllJournalsClick = () => {
    setJournalsOpen([]);
  };

  /**
   * handleJournalClick
   * @param id id
   */
  const handleJournalClick =
    (id: number) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const updatedList = [...journalsOpen];

      const index = updatedList.indexOf(id);

      if (index !== -1) {
        updatedList.splice(index, 1);
      } else {
        updatedList.push(id);
      }

      setJournalsOpen(updatedList);
    };

  /**
   * Renders materials
   * @returns JSX.Element
   */
  const renderAssignmentMaterialsList = (
    <ApplicationList>
      {evaluatedAssignmentsData.evaluatedAssignments.length ? (
        evaluatedAssignmentsData.evaluatedAssignments.map((m) => {
          let showHiddenAssignment = false;

          const compositeReply = compositeReplyData.compositeReplies.find(
            (c) => c.workspaceMaterialId === m.assignment.id
          );

          if (m.assignment && m.assignment.hidden) {
            if (compositeReply && compositeReply.submitted !== null) {
              showHiddenAssignment = true;
            }
          }
          if (m.assignment && m.assignment.hidden && !showHiddenAssignment) {
            return null;
          }

          const open = evaluatedOpen.includes(m.id);

          return (
            <Material
              key={m.id}
              material={m}
              i18n={i18n}
              workspace={workspace}
              compositeReply={compositeReply}
              status={status}
              open={open}
              onMaterialClick={handleAssignmentByTypeClick}
            />
          );
        })
      ) : (
        <div className="empty">
          <span>{props.i18n.text.get("plugin.records.noassignments")}</span>
        </div>
      )}
    </ApplicationList>
  );

  /**
   * Renders materials
   * @returns JSX.Element
   */
  const renderExcerciseMaterialsList = (
    <ApplicationList>
      {excerciseAssignmentsData.excerciseAssignments.length ? (
        excerciseAssignmentsData.excerciseAssignments.map((m) => {
          let showHiddenAssignment = false;

          const compositeReply = compositeReplyData.compositeReplies.find(
            (c) => c.workspaceMaterialId === m.assignment.id
          );

          if (m.assignment && m.assignment.hidden) {
            if (compositeReply && compositeReply.submitted !== null) {
              showHiddenAssignment = true;
            }
          }
          if (m.assignment && m.assignment.hidden && !showHiddenAssignment) {
            return null;
          }

          const open = excerciseOpen.includes(m.id);

          return (
            <Material
              key={m.id}
              material={m}
              i18n={i18n}
              workspace={workspace}
              compositeReply={compositeReply}
              status={status}
              open={open}
              onMaterialClick={handleAssignmentByTypeClick}
            />
          );
        })
      ) : (
        <div className="empty">
          <span>{props.i18n.text.get("plugin.records.noexercises")}</span>
        </div>
      )}
    </ApplicationList>
  );

  /**
   * Renders jouranls
   * @returns JSX.Element
   */
  const renderJournalsList = (
    <ApplicationSubPanel modifier="studies-journal-entries">
      <ApplicationSubPanel.Header modifier="studies-journal-entries">
        <span>{props.i18n.text.get("plugin.records.journal.title")}</span>
        <span>
          <Link
            className="link link--studies-close-open"
            disabled={
              journalsData.isLoading || journalsData.journals.length === 0
            }
            onClick={handleOpenAllJournalsClick}
          >
            {props.i18n.text.get("plugin.records.openClose.openAll")}
          </Link>
          <Link
            className="link link--studies-close-open"
            disabled={
              journalsData.isLoading || journalsData.journals.length === 0
            }
            onClick={handleCloseAllJournalsClick}
          >
            {props.i18n.text.get("plugin.records.openClose.closeAll")}
          </Link>
        </span>
      </ApplicationSubPanel.Header>
      <ApplicationSubPanel.Body>
        {journalsData.journals.length ? (
          journalsData.journals.map((journal) => {
            const isOpen = journalsOpen.includes(journal.id);

            return (
              <Journal
                key={journal.id}
                journal={journal}
                open={isOpen}
                onJournalClick={handleJournalClick}
              />
            );
          })
        ) : (
          <div className="empty">
            <span>
              {props.i18n.text.get("plugin.records.nojournalentries")}
            </span>
          </div>
        )}
      </ApplicationSubPanel.Body>
    </ApplicationSubPanel>
  );

  const panelTabs: Tab[] = [
    {
      id: "EVALUATED",
      name: props.i18n.text.get("plugin.records.assignments.title"),
      type: "assignments",
      component: (
        <ApplicationSubPanel modifier="studies-assignments">
          <ApplicationSubPanel.Header modifier="studies-assignments">
            <span>
              {props.i18n.text.get("plugin.records.assignments.title")}
            </span>
            <span>
              <Link
                className="link link--studies-close-open"
                disabled={
                  evaluatedAssignmentsData.isLoading ||
                  evaluatedAssignmentsData.evaluatedAssignments.length === 0
                }
                onClick={handleOpenAllAssignmentsByTypeClick("EVALUATED")}
              >
                {props.i18n.text.get("plugin.records.openClose.openAll")}
              </Link>
              <Link
                className="link link--studies-close-open"
                disabled={
                  evaluatedAssignmentsData.isLoading ||
                  evaluatedAssignmentsData.evaluatedAssignments.length === 0
                }
                onClick={handleCloseAllAssignmentsByTypeClick("EVALUATED")}
              >
                {props.i18n.text.get("plugin.records.openClose.closeAll")}
              </Link>
            </span>
          </ApplicationSubPanel.Header>
          <ApplicationSubPanel.Body>
            {evaluatedAssignmentsData.isLoading ||
            compositeReplyData.isLoading ? (
              <div className="loader-empty" />
            ) : (
              renderAssignmentMaterialsList
            )}
          </ApplicationSubPanel.Body>
        </ApplicationSubPanel>
      ),
    },
    {
      id: "EXCERCISE",
      name: props.i18n.text.get("plugin.records.exercises.title"),
      type: "excercises",
      component: (
        <ApplicationSubPanel modifier="studies-exercises">
          <ApplicationSubPanel.Header modifier="studies-exercises">
            <span>{props.i18n.text.get("plugin.records.exercises.title")}</span>
            <span>
              <Link
                className="link link--studies-close-open"
                disabled={
                  excerciseAssignmentsData.isLoading ||
                  excerciseAssignmentsData.excerciseAssignments.length === 0
                }
                onClick={handleOpenAllAssignmentsByTypeClick("EXERCISE")}
              >
                {props.i18n.text.get("plugin.records.openClose.openAll")}
              </Link>
              <Link
                className="link link--studies-close-open"
                disabled={
                  excerciseAssignmentsData.isLoading ||
                  excerciseAssignmentsData.excerciseAssignments.length === 0
                }
                onClick={handleCloseAllAssignmentsByTypeClick("EXERCISE")}
              >
                {props.i18n.text.get("plugin.records.openClose.closeAll")}
              </Link>
            </span>
          </ApplicationSubPanel.Header>

          <ApplicationSubPanel.Body>
            {excerciseAssignmentsData.isLoading ||
            compositeReplyData.isLoading ? (
              <div className="loader-empty" />
            ) : (
              renderExcerciseMaterialsList
            )}
          </ApplicationSubPanel.Body>
        </ApplicationSubPanel>
      ),
    },
  ];

  return (
    <>
      <Tabs
        modifier="studies-assignments"
        tabs={panelTabs}
        onTabChange={onTabChange}
        activeTab={activeTab}
      />
      {renderJournalsList}
    </>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    i18n: state.i18n,
    userEntityId: state.status.userId,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return { displayNotification };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssignmentsAndDiaries);
