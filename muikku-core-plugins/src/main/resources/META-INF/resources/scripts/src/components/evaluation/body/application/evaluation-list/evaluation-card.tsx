import * as React from "react";
import ArchiveDialog from "../../../dialogs/archive";
import EvaluateDialog from "../../../dialogs/evaluate";
import DeleteRequestDialog from "../../../dialogs/delete-request";
import {
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
import { ButtonPill, IconButton } from "~/components/general/button";
import "~/sass/elements/evaluation-card.scss";
import "~/sass/elements/buttons.scss";
import { EvaluationAssessmentRequest } from "~/generated/client";
import {
  useTranslation,
  WithTranslation,
  withTranslation,
} from "react-i18next";
import Dropdown from "~/components/general/dropdown";

/**
 * EvaluationCardProps
 */
interface EvaluationCardProps
  extends EvaluationAssessmentRequest,
    WithTranslation {
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
    needsReloadRequests,
    loadEvaluationAssessmentRequestsFromServer,
    ...rest
  } = props;

  const { t } = useTranslation([
    "evaluation",
    "workspace",
    "materials",
    "common",
  ]);

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

  const cardModifier = rest.interimEvaluationRequest
    ? "evaluation-card--interim"
    : "";
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
          aria-label={
            rest.interimEvaluationRequest
              ? t("actions.remove", {
                  ns: "evaluation",
                  context: "interimEvaluationRequest",
                })
              : t("actions.remove", {
                  ns: "evaluation",
                  context: "evaluationRequest",
                })
          }
          buttonModifiers="archive-request"
          icon="trash"
        />
      </DeleteRequestDialog>
    ) : rest.assessmentRequestDate &&
      selectedWorkspaceId === rest.workspaceEntityId ? (
      <ArchiveDialog place="card" {...rest}>
        <ButtonPill
          aria-label={t("actions.archive", {
            ns: "evaluation",
            context: "student",
          })}
          buttonModifiers="archive-student"
          icon="archive"
        />
      </ArchiveDialog>
    ) : null;

  return (
    <div className={`evaluation-card ${cardModifier} ${cardStateClass}`}>
      <div className="evaluation-card__header">
        <div className="evaluation-card__header-primary">
          <div className="evaluation-card__header-title">{studentName}</div>
          <div className="evaluation-card__heder-description">
            {rest.studyProgramme}
          </div>
        </div>
        <div className="evaluation-card__header-secondary">
          <div className="labels">
            {rest.hasPedagogyForm ? (
              <Dropdown
                alignSelfVertically="top"
                openByHover
                content={
                  <span id={`pedagogyPlan-` + rest.userEntityId}>
                    Opiskelijalle on tehty pedagogisen tuen suunnitelma
                  </span>
                }
              >
                <div className="label label--pedagogy-plan">
                  <span
                    className="label__text label__text--pedagogy-plan"
                    aria-labelledby={`pedagogyPlan-` + rest.userEntityId}
                  >
                    P
                  </span>
                </div>
              </Dropdown>
            ) : null}
          </div>
        </div>
      </div>
      <div className="evaluation-card__content">
        {renderFilterByWorkspaceLink}
        <div className="evaluation-card__content-row">
          <span className="evaluation-card__content-label">
            {t("labels.isInWorkspace", { ns: "evaluation" })}
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
            {rest.interimEvaluationRequest
              ? t("labels.hasInterimEvaluationRequest", { ns: "evaluation" })
              : t("labels.hasEvaluationRequest", { ns: "evaluation" })}
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
            {t("labels.evaluated", { ns: "workspace" })}
          </span>
          <span className="evaluation-card__content-data">
            {evaluationDate}
          </span>
        </div>
        <div className="evaluation-card__content-row">
          <span className="evaluation-card__content-label">
            {t("labels.assignments", { ns: "materials", context: "done" })}
          </span>
          {renderTasksDone}
        </div>
      </div>
      <div className="evaluation-card__footer">
        <div className="evaluation-card__button-set">
          <IconButton
            aria-label={t("actions.markImportant", { ns: "evaluation" })}
            onClick={handleImportanceClick("important")}
            buttonModifiers={
              evaluationImportantClassesMod
                ? ["important", evaluationImportantClassesMod]
                : ["important"]
            }
            icon="star-full"
          />
          <IconButton
            aria-label={t("actions.markNonImportant", { ns: "evaluation" })}
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
              aria-label={t("actions.evaluateStudent", { ns: "evaluation" })}
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
  return {};
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

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(EvaluationCard)
);
