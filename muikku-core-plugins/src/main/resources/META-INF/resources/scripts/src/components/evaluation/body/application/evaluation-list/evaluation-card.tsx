import * as React from "react";
import ArchiveDialog from "../../../dialogs/archive";
import EvaluateDialog from "../../../dialogs/evaluate";
import DeleteRequestDialog from "../../../dialogs/delete-request";
import {
  AssessmentRequest,
  EvaluationImportantStatus,
  UpdateImportanceObject,
} from "~/@types/evaluation";
import * as moment from "moment";
import {
  SetEvaluationSelectedWorkspace,
  LoadEvaluationAssessmentRequest,
  loadEvaluationAssessmentRequestsFromServer,
} from "~/actions/main-function/evaluation/evaluationActions";
import { bindActionCreators } from "redux";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions/index";
import { StateType } from "~/reducers/index";
import { i18nType } from "~/reducers/base/i18n";
import { ButtonPill, IconButton } from "~/components/general/button";
import "~/sass/elements/evaluation-card.scss";
import "~/sass/elements/buttons.scss";

/**
 * EvaluationCardProps
 */
interface EvaluationCardProps extends AssessmentRequest {
  i18n: i18nType;
  selectedWorkspaceId?: number;
  setSelectedWorkspaceId: SetEvaluationSelectedWorkspace;
  updateEvaluationImportance: (object: UpdateImportanceObject) => void;
  important: EvaluationImportantStatus;
  importantAssessments: number[];
  unimportantAssessments: number[];
  loadEvaluationAssessmentRequestsFromServer: LoadEvaluationAssessmentRequest;
  needsReloadRequests: boolean;
}

/**
 * EvaluationCard
 * @param props props
 */
const EvaluationCard: React.FC<EvaluationCardProps> = (props) => {
  const {
    selectedWorkspaceId,
    setSelectedWorkspaceId,
    important,
    importantAssessments,
    unimportantAssessments,
    updateEvaluationImportance,
    i18n,
    needsReloadRequests,
    loadEvaluationAssessmentRequestsFromServer,
    ...rest
  } = props;

  /**
   * Handles importance click
   * @param status status
   */
  const handleImportanceClick =
    (status: "important" | "unimportant") =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
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
   * handleDialogClose
   */
  const handleDialogClose = () => {
    if (needsReloadRequests) {
      loadEvaluationAssessmentRequestsFromServer();
    }
  };

  /**
   * Handles workspacename click. It "filters" every assessments by that workspace
   * @param e e
   */
  const handleWorkspaceNameClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    setSelectedWorkspaceId({ workspaceId: rest.workspaceEntityId });
  };

  let evaluationImportantClassesMod = undefined;
  let evaluationUnimportantClassesMod = undefined;

  /**
   * Whether important or unimportant is selected, renders it background differently
   */
  if (important === "important") {
    evaluationImportantClassesMod = "important-selected";
    evaluationUnimportantClassesMod = "";
  }
  if (important === "unimportant") {
    evaluationImportantClassesMod = "";
    evaluationUnimportantClassesMod = "unimportant-selected";
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
          <a onClick={handleWorkspaceNameClick}>
            {`${rest.workspaceName} ${
              rest.workspaceNameExtension !== null
                ? `(${rest.workspaceNameExtension})`
                : ""
            } `}
          </a>
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
      className={`evaluation-card__content-data ${
        rest.assignmentsDone === rest.assignmentsTotal
          ? "evaluation-card__content-data--all-done"
          : "evaluation-card__content-data--not-done"
      }`}
    >
      {`${rest.assignmentsDone} / ${rest.assignmentsTotal}`}
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
    cardStateClass = "state-REQUESTED";
  } else if (rest.evaluationDate) {
    cardStateClass = rest.graded
      ? rest.passing
        ? "state-PASSED"
        : "state-FAILED"
      : "state-INCOMPLETE";
  }

  const renderArchiveOrDeleteDialogButton =
    rest.assessmentRequestDate &&
    rest.workspaceEntityId !== selectedWorkspaceId ? (
      <DeleteRequestDialog {...rest}>
        <ButtonPill
          aria-label={i18n.text.get(
            "plugin.evaluation.card.button.deleteRequest.title"
          )}
          buttonModifiers="archive-request"
          icon="trash"
        />
      </DeleteRequestDialog>
    ) : rest.assessmentRequestDate &&
      selectedWorkspaceId === rest.workspaceEntityId ? (
      <ArchiveDialog place="card" {...rest}>
        <ButtonPill
          aria-label={i18n.text.get(
            "plugin.evaluation.card.button.archiveButtonLabel"
          )}
          buttonModifiers="archive-student"
          icon="archive"
        />
      </ArchiveDialog>
    ) : null;

  return (
    <div className={`evaluation-card ${cardStateClass}`}>
      <div className="evaluation-card__header">
        <div className="evaluation-card__header-title">{studentName}</div>
        <div className="evaluation-card__heder-description">
          {rest.studyProgramme}
        </div>
      </div>
      <div className="evaluation-card__content">
        {renderFilterByWorkspaceLink}
        <div className="evaluation-card__content-row">
          <span className="evaluation-card__content-label">
            {i18n.text.get("plugin.evaluation.card.joinedWorkspaceLabel")}
          </span>
          <span className="evaluation-card__content-data">
            {enrollmentDate}
          </span>
        </div>
        <div
          className={`evaluation-card__content-row ${
            rest.evaluationDate === null
              ? "evaluation-card__content-row--highlight"
              : ""
          }`}
        >
          <span className="evaluation-card__content-label">
            {i18n.text.get("plugin.evaluation.card.evaluationRequestedLabel")}
          </span>
          <span className="evaluation-card__content-data">
            {assessmentRequestDate}
          </span>
        </div>
        <div
          className={`evaluation-card__content-row ${
            rest.evaluationDate !== null
              ? "evaluation-card__content-row--highlight"
              : ""
          }`}
        >
          <span className="evaluation-card__content-label">
            {i18n.text.get("plugin.evaluation.card.evaluatedLabel")}
          </span>
          <span className="evaluation-card__content-data">
            {evaluationDate}
          </span>
        </div>
        <div className="evaluation-card__content-row">
          <span className="evaluation-card__content-label">
            {i18n.text.get("plugin.evaluation.card.assignmentsDoneLabel")}
          </span>
          {renderTasksDone}
        </div>
      </div>
      <div className="evaluation-card__footer">
        <div className="evaluation-card__button-set">
          <IconButton
            aria-label={i18n.text.get(
              "plugin.evaluation.card.button.markImportantButtonLabel"
            )}
            onClick={handleImportanceClick("important")}
            buttonModifiers={
              evaluationImportantClassesMod
                ? ["important", evaluationImportantClassesMod]
                : ["important"]
            }
            icon="star-full"
          />
          <IconButton
            aria-label={i18n.text.get(
              "plugin.evaluation.card.button.markNonImportantButtonLabel"
            )}
            onClick={handleImportanceClick("unimportant")}
            buttonModifiers={
              evaluationUnimportantClassesMod
                ? ["unimportant", evaluationUnimportantClassesMod]
                : ["unimportant"]
            }
            icon="star-empty"
          />
        </div>

        <div className="evaluation-card__button-set">
          {renderArchiveOrDeleteDialogButton}

          <EvaluateDialog assessment={rest} onClose={handleDialogClose}>
            <ButtonPill
              aria-label={i18n.text.get(
                "plugin.evaluation.card.button.evaluateButtonLabel"
              )}
              buttonModifiers="evaluate"
              icon="evaluate"
            />
          </EvaluateDialog>
        </div>
      </div>
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
  return bindActionCreators(
    { loadEvaluationAssessmentRequestsFromServer },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EvaluationCard);
