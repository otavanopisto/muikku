import * as React from "react";
import ArchiveDialog from "../../../dialogs/archive";
import EvaluateDialog from "../../../dialogs/evaluate";
import {
  AssessmentRequest,
  EvaluationImportantStatus,
  UpdateImportanceObject,
} from "../../../../../@types/evaluation";
import * as moment from "moment";
import { SetEvaluationSelectedWorkspace } from "../../../../../actions/main-function/evaluation/evaluationActions";

/**
 * EvaluationCardProps
 */
interface EvaluationCardProps extends AssessmentRequest {
  selectedWorkspaceId?: number;
  setSelectedWorkspaceId: SetEvaluationSelectedWorkspace;
  updateEvaluationImportance: (object: UpdateImportanceObject) => void;
  important: EvaluationImportantStatus;
  importantAssessments: number[];
  unimportantAssessments: number[];
}

/**
 * EvaluationCard
 * @param props
 */
const EvaluationCard: React.FC<EvaluationCardProps> = ({
  selectedWorkspaceId,
  setSelectedWorkspaceId,
  important,
  importantAssessments,
  unimportantAssessments,
  updateEvaluationImportance,
  ...rest
}) => {
  /**
   * Handles importance click
   * @param status
   */
  const handleImportanceClick =
    (status: "important" | "unimportant") =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      let updatedImportAssessmentList: number[] = [...importantAssessments];
      let updatedUnimportAssessmentList: number[] = [...unimportantAssessments];

      let updateImportances: UpdateImportanceObject;

      /**
       * If clicked status is already active, remove active status marking
       */
      if (status === important) {
        updatedImportAssessmentList = updatedImportAssessmentList.filter(
          (item) => item !== rest.workspaceUserEntityId
        );

        updatedUnimportAssessmentList = updatedUnimportAssessmentList.filter(
          (item) => item !== rest.workspaceUserEntityId
        );

        updateImportances = {
          importantAssessments: {
            key: "important-evaluation-requests",
            value: updatedImportAssessmentList.join(","),
          },
          unimportantAssessments: {
            key: "unimportant-evaluation-requests",
            value: updatedUnimportAssessmentList.join(","),
          },
        };
      } else if (status === "important") {
        /**
         * Other wise select clicked status and clean it away from other list if its there
         */
        updatedImportAssessmentList.push(rest.workspaceUserEntityId);
        updatedUnimportAssessmentList = updatedUnimportAssessmentList.filter(
          (item) => item !== rest.workspaceUserEntityId
        );

        updateImportances = {
          importantAssessments: {
            key: "important-evaluation-requests",
            value: updatedImportAssessmentList.join(","),
          },
          unimportantAssessments: {
            key: "unimportant-evaluation-requests",
            value: updatedUnimportAssessmentList.join(","),
          },
        };
      } else if (status === "unimportant") {
        /**
         * As above
         */
        updatedImportAssessmentList = updatedImportAssessmentList.filter(
          (item) => item !== rest.workspaceUserEntityId
        );

        updatedUnimportAssessmentList.push(rest.workspaceUserEntityId);

        updateImportances = {
          importantAssessments: {
            key: "important-evaluation-requests",
            value: updatedImportAssessmentList.join(","),
          },
          unimportantAssessments: {
            key: "unimportant-evaluation-requests",
            value: updatedUnimportAssessmentList.join(","),
          },
        };
      }

      updateEvaluationImportance(updateImportances);
    };

  /**
   * Handles workspacename click. It "filters" every assessments by that workspace
   */
  const handleWorkspaceNameClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    setSelectedWorkspaceId({ workspaceId: rest.workspaceEntityId });
  };

  let evaluationImportantClassesMod = "";
  let evaluationUnimportantClassesMod = "";

  /**
   * Whether important or unimportant is selected, renders it background differently
   */
  if (important === "important") {
    evaluationImportantClassesMod = "evaluation-important-button--selected";
    evaluationUnimportantClassesMod = "";
  }
  if (important === "unimportant") {
    evaluationImportantClassesMod = "";
    evaluationUnimportantClassesMod = "evaluation-unimportant-button--selected";
  }

  const studentName = `${rest.lastName} ${rest.firstName}`;
  const enrollmentDate =
    rest.enrollmentDate !== null
      ? moment(rest.enrollmentDate).format("l")
      : "-";
  const evaluationDate =
    rest.evaluationDate !== null
      ? moment(rest.evaluationDate).format("l")
      : "-";
  const assessmentRequestDate =
    rest.assessmentRequestDate !== null
      ? moment(rest.assessmentRequestDate).format("l")
      : "-";

  /**
   * renderFilterByWorkspaceLink
   * @returns JSX.Element
   */
  const renderFilterByWorkspaceLink =
    selectedWorkspaceId !== rest.workspaceEntityId ? (
      <div className="evaluation-card-data-row">
        <div className="eval-workspace-name">
          <a onClick={handleWorkspaceNameClick}>{rest.workspaceName}</a>
        </div>
      </div>
    ) : null;

  /**
   * Renders tasks done part of the card with corresponding
   * status color
   * @returns
   */
  const renderTasksDone = (
    <span
      className={`evaluation-card-data-text assignments-status ${
        rest.assignmentsDone === rest.assignmentsTotal ? "all-done" : "not-done"
      }`}
    >
      {`${rest.assignmentsDone}/${rest.assignmentsTotal}`}
    </span>
  );

  let cardStateClass = "";

  /**
   * builds card container class aka "border color"
   */
  if (
    (rest.assessmentRequestDate &&
      rest.evaluationDate &&
      rest.assessmentRequestDate > rest.evaluationDate) ||
    (rest.assessmentRequestDate && !rest.evaluationDate)
  ) {
    cardStateClass = "evaluated-requested";
  } else if (rest.evaluationDate) {
    cardStateClass = rest.graded
      ? rest.passing
        ? "evaluated-passed"
        : "evaluated-failed"
      : "evaluated-incomplete";
  }

  return (
    <div className={`evaluation-card ${cardStateClass}`}>
      <div className="evaluation-card-title">
        <div className="evaluation-card-student">{studentName}</div>
        <div className="evaluation-card-study-programme">Nettiperuskoulu</div>
      </div>
      <div className="evaluation-card-data">
        {renderFilterByWorkspaceLink}
        <div className="evaluation-card-data-row enrollment-row">
          <span className="evaluation-card-data-label">
            Ilmoittautunut työtilaan
          </span>
          <span className="evaluation-card-data-text">{enrollmentDate}</span>
        </div>
        <div
          className={`evaluation-card-data-row request-row ${
            rest.evaluationDate === null ? "highlight" : ""
          }`}
        >
          <span className="evaluation-card-data-label">
            Arviointipyyntö jätetty
          </span>
          <span className="evaluation-card-data-text">
            {assessmentRequestDate}
          </span>
        </div>
        <div
          className={`evaluation-card-data-row evaluation-row ${
            rest.evaluationDate !== null ? "highlight" : ""
          }`}
        >
          <span className="evaluation-card-data-label">Arvioitu</span>
          <span className="evaluation-card-data-text">{evaluationDate}</span>
        </div>
        <div className="evaluation-card-data-row">
          <span className="evaluation-card-data-label">Tehtäviä tehty</span>
          {renderTasksDone}
        </div>
        <div className="evaluation-card-button-row">
          <div className="evaluation-card-button-block">
            <div
              onClick={handleImportanceClick("important")}
              className={`evaluation-important-button ${evaluationImportantClassesMod} icon-star`}
            />
            <div
              onClick={handleImportanceClick("unimportant")}
              className={`evaluation-unimportant-button ${evaluationUnimportantClassesMod} icon-star-empty`}
            />
          </div>

          <div className="evaluation-card-button-block">
            {rest.evaluationDate !== null && rest.graded ? (
              <ArchiveDialog>
                <div
                  className="evaluation-card-button archive-button icon-archive"
                  title="Arkistoi opiskelija"
                />
              </ArchiveDialog>
            ) : null}

            <EvaluateDialog assessment={rest}>
              <div
                className="evaluation-card-button evaluate-button icon-evaluate"
                title="Arvioi opiskelija"
              />
            </EvaluateDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationCard;
