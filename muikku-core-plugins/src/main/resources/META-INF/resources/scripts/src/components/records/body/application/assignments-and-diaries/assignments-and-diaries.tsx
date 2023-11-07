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
import { localize } from "~/locales/i18n";
import ApplicationList from "~/components/general/application-list";
import { StatusType } from "../../../../../reducers/base/status";
import Material from "../current-record/material";
import Journal from "../current-record/journal";
import Tabs, { Tab } from "~/components/general/tabs";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import { useExerciseAssignments } from "./hooks/useExercises";
import { useCompositeReply } from "./hooks/useCompositeReply";
import CkeditorContentLoader from "~/components/base/ckeditor-loader/content";
import Link from "~/components/general/link";
import "~/sass/elements/empty.scss";
import "~/sass/elements/application-sub-panel.scss";
import { bindActionCreators } from "redux";
import { useInterimEvaluationAssigments } from "./hooks/useInterimEvaluation";
import { useTranslation } from "react-i18next";
import { RecordWorkspaceActivity } from "~/reducers/main-function/records";
import { useRecordWorkspace } from "./hooks/useRecordWorkpace";

/**
 * AssignmentsAndDiariesProps
 */
interface AssignmentsAndDiariesProps {
  status: StatusType;
  credit: RecordWorkspaceActivity;
  userEntityId: number;
  displayNotification: DisplayNotificationTriggerType;
}

export type AssignmentsTabType =
  | "EVALUATED"
  | "EXERCISE"
  | "INTERIM_EVALUATION";

/**
 * AssignmentsAndDiaries
 * @param props props
 * @returns JSX.Element
 */
const AssignmentsAndDiaries: React.FC<AssignmentsAndDiariesProps> = (props) => {
  const { status, credit, userEntityId, displayNotification } = props;

  const { t } = useTranslation([
    "studies",
    "workspace",
    "materials",
    "journal",
    "common",
  ]);

  const [activeTab, setActiveTab] =
    React.useState<AssignmentsTabType>("EVALUATED");

  const [journalsOpen, setJournalsOpen] = React.useState<number[]>([]);
  const [exerciseOpen, setExerciseOpen] = React.useState<number[]>([]);
  const [evaluatedOpen, setEvaluatedOpen] = React.useState<number[]>([]);
  const [interimOpen, setInterimOpen] = React.useState<number[]>([]);

  const recordWorkspace = useRecordWorkspace(
    status.userSchoolDataIdentifier,
    credit.id,
    displayNotification
  );

  const { evaluatedAssignmentsData } = useEvaluatedAssignments(
    credit.id,
    activeTab,
    displayNotification
  );

  const { exerciseAssignmentsData } = useExerciseAssignments(
    credit.id,
    activeTab,
    displayNotification
  );

  const { interimEvaluationeAssignmentsData } = useInterimEvaluationAssigments(
    credit.id,
    activeTab,
    displayNotification
  );

  const { compositeReplyData } = useCompositeReply(
    userEntityId,
    credit.id,
    displayNotification
  );

  const { journalsData } = useJournals(
    userEntityId,
    credit.id,
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
    (type: AssignmentsTabType) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      switch (type) {
        case "EXERCISE": {
          const list = exerciseAssignmentsData.exerciseAssignments.map(
            (e) => e.id
          );
          setExerciseOpen(list);
          break;
        }

        case "EVALUATED": {
          const list = evaluatedAssignmentsData.evaluatedAssignments.map(
            (e) => e.id
          );
          setEvaluatedOpen(list);
          break;
        }

        case "INTERIM_EVALUATION": {
          const list =
            interimEvaluationeAssignmentsData.interimEvaluationAssignments.map(
              (e) => e.id
            );
          setInterimOpen(list);
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
    (type: AssignmentsTabType) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      switch (type) {
        case "EXERCISE":
          setExerciseOpen([]);
          break;

        case "EVALUATED":
          setEvaluatedOpen([]);
          break;

        case "INTERIM_EVALUATION":
          setInterimOpen([]);
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
    (id: number, type: AssignmentsTabType) =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      switch (type) {
        case "EXERCISE": {
          const updatedList = [...exerciseOpen];

          const index = updatedList.indexOf(id);

          if (index !== -1) {
            updatedList.splice(index, 1);
          } else {
            updatedList.push(id);
          }

          setExerciseOpen(updatedList);
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

        case "INTERIM_EVALUATION": {
          const updatedList = [...interimOpen];

          const index = updatedList.indexOf(id);

          if (index !== -1) {
            updatedList.splice(index, 1);
          } else {
            updatedList.push(id);
          }

          setInterimOpen(updatedList);
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
      {recordWorkspace.workspace &&
      evaluatedAssignmentsData.evaluatedAssignments.length ? (
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
              workspace={recordWorkspace.workspace}
              compositeReply={compositeReply}
              status={status}
              open={open}
              onMaterialClick={handleAssignmentByTypeClick}
            />
          );
        })
      ) : (
        <div className="empty">
          <span>
            {t("content.empty", { ns: "workspace", context: "evaluables" })}
          </span>
        </div>
      )}
    </ApplicationList>
  );

  /**
   * Renders materials
   * @returns JSX.Element
   */
  const renderExerciseMaterialsList = (
    <ApplicationList>
      {recordWorkspace.workspace &&
      exerciseAssignmentsData.exerciseAssignments.length ? (
        exerciseAssignmentsData.exerciseAssignments.map((m) => {
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

          const open = exerciseOpen.includes(m.id);

          return (
            <Material
              key={m.id}
              material={m}
              workspace={recordWorkspace.workspace}
              compositeReply={compositeReply}
              status={status}
              open={open}
              onMaterialClick={handleAssignmentByTypeClick}
            />
          );
        })
      ) : (
        <div className="empty">
          <span>
            {t("content.empty", { ns: "workspace", context: "exercises" })}
          </span>
        </div>
      )}
    </ApplicationList>
  );

  /**
   * Renders materials
   * @returns JSX.Element
   */
  const renderInterminEvaluationMaterialsList = (
    <ApplicationList>
      {recordWorkspace.workspace &&
      interimEvaluationeAssignmentsData.interimEvaluationAssignments.length ? (
        interimEvaluationeAssignmentsData.interimEvaluationAssignments.map(
          (m) => {
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

            const open = interimOpen.includes(m.id);

            return (
              <Material
                key={m.id}
                material={m}
                workspace={recordWorkspace.workspace}
                compositeReply={compositeReply}
                status={status}
                open={open}
                onMaterialClick={handleAssignmentByTypeClick}
              />
            );
          }
        )
      ) : (
        <div className="empty">
          <span>
            {t("content.empty", { ns: "workspace", context: "intermin" })}
          </span>
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
        <span>{t("labels.entries", { ns: "journal" })}</span>
        <span>
          <Link
            className="link link--studies-open-close"
            disabled={
              journalsData.isLoading || journalsData.journals.length === 0
            }
            onClick={handleOpenAllJournalsClick}
          >
            {t("actions.openAll")}
          </Link>
          <Link
            className="link link--studies-open-close"
            disabled={
              journalsData.isLoading || journalsData.journals.length === 0
            }
            onClick={handleCloseAllJournalsClick}
          >
            {t("actions.closeAll")}
          </Link>
        </span>
      </ApplicationSubPanel.Header>
      <ApplicationSubPanel.Body>
        {journalsData.journalFeedback && (
          <div className="journal journal--feedback">
            <div className="journal__header journal__header--studies-view">
              {t("labels.feedback", { ns: "journal" })}
            </div>
            <article className="journal__body rich-text">
              <CkeditorContentLoader
                html={journalsData.journalFeedback.feedback}
              />
            </article>
            <div className="journal__meta">
              <div className="journal__meta-item">
                <div className="journal__meta-item-label">
                  {t("labels.feedbackDate", { ns: "journal" })}:
                </div>
                <div className="journal__meta-item-data">
                  {localize.date(journalsData.journalFeedback.created, "l LT")}
                </div>
              </div>
              <div className="journal__meta-item">
                <div className="journal__meta-item-label">
                  {t("labels.feedbackAuthor", { ns: "journal" })}:
                </div>
                <div className="journal__meta-item-data">
                  {journalsData.journalFeedback.creatorName}
                </div>
              </div>
            </div>
          </div>
        )}

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
              {t("content.empty", { ns: "workspace", context: "journals" })}
            </span>
          </div>
        )}
      </ApplicationSubPanel.Body>
    </ApplicationSubPanel>
  );
  t("actions.openAll");

  const panelTabs: Tab[] = [
    {
      id: "EVALUATED",
      name: t("labels.evaluables", { ns: "materials", count: 0 }),
      type: "assignments",
      component: (
        <ApplicationSubPanel modifier="studies-assignments">
          <ApplicationSubPanel.Header modifier="studies-assignments">
            <span>{t("labels.evaluables", { ns: "materials", count: 0 })}</span>
            <span>
              <Link
                className="link link--studies-open-close"
                disabled={
                  evaluatedAssignmentsData.isLoading ||
                  evaluatedAssignmentsData.evaluatedAssignments.length === 0
                }
                onClick={handleOpenAllAssignmentsByTypeClick("EVALUATED")}
              >
                {t("actions.openAll")}
              </Link>
              <Link
                className="link link--studies-open-close"
                disabled={
                  evaluatedAssignmentsData.isLoading ||
                  evaluatedAssignmentsData.evaluatedAssignments.length === 0
                }
                onClick={handleCloseAllAssignmentsByTypeClick("EVALUATED")}
              >
                {t("actions.closeAll")}
              </Link>
            </span>
          </ApplicationSubPanel.Header>
          <ApplicationSubPanel.Body>
            {recordWorkspace.isLoading ||
            evaluatedAssignmentsData.isLoading ||
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
      name: t("labels.exercises", { ns: "materials", count: 0 }),
      type: "excercises",
      component: (
        <ApplicationSubPanel modifier="studies-exercises">
          <ApplicationSubPanel.Header modifier="studies-exercises">
            <span>{t("labels.exercises", { ns: "materials", count: 0 })}</span>
            <span>
              <Link
                className="link link--studies-open-close"
                disabled={
                  exerciseAssignmentsData.isLoading ||
                  exerciseAssignmentsData.exerciseAssignments.length === 0
                }
                onClick={handleOpenAllAssignmentsByTypeClick("EXERCISE")}
              >
                {t("actions.openAll")}
              </Link>
              <Link
                className="link link--studies-open-close"
                disabled={
                  exerciseAssignmentsData.isLoading ||
                  exerciseAssignmentsData.exerciseAssignments.length === 0
                }
                onClick={handleCloseAllAssignmentsByTypeClick("EXERCISE")}
              >
                {t("actions.closeAll")}
              </Link>
            </span>
          </ApplicationSubPanel.Header>

          <ApplicationSubPanel.Body>
            {recordWorkspace.isLoading ||
            exerciseAssignmentsData.isLoading ||
            compositeReplyData.isLoading ? (
              <div className="loader-empty" />
            ) : (
              renderExerciseMaterialsList
            )}
          </ApplicationSubPanel.Body>
        </ApplicationSubPanel>
      ),
    },
    {
      id: "INTERIM_EVALUATION",
      name: t("labels.interimEvaluations", { ns: "materials" }),
      type: "interim_evaluations",
      component: (
        <ApplicationSubPanel modifier="studies-exercises">
          <ApplicationSubPanel.Header modifier="studies-exercises">
            <span>{t("labels.interimEvaluations", { ns: "materials" })}:</span>
            <span>
              <Link
                className="link link--studies-open-close"
                disabled={
                  interimEvaluationeAssignmentsData.isLoading ||
                  interimEvaluationeAssignmentsData.interimEvaluationAssignments
                    .length === 0
                }
                onClick={handleOpenAllAssignmentsByTypeClick(
                  "INTERIM_EVALUATION"
                )}
              >
                {t("actions.openAll")}
              </Link>
              <Link
                className="link link--studies-open-close"
                disabled={
                  interimEvaluationeAssignmentsData.isLoading ||
                  interimEvaluationeAssignmentsData.interimEvaluationAssignments
                    .length === 0
                }
                onClick={handleCloseAllAssignmentsByTypeClick(
                  "INTERIM_EVALUATION"
                )}
              >
                {t("actions.closeAll")}
              </Link>
            </span>
          </ApplicationSubPanel.Header>

          <ApplicationSubPanel.Body>
            {recordWorkspace.isLoading ||
            interimEvaluationeAssignmentsData.isLoading ||
            compositeReplyData.isLoading ? (
              <div className="loader-empty" />
            ) : (
              renderInterminEvaluationMaterialsList
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
    userEntityId: state.status.userId,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssignmentsAndDiaries);
