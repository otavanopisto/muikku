/* eslint-disable camelcase */
import * as React from "react";
import ArchiveDialog from "../../../dialogs/archive";
import EvaluateDialog from "../../../dialogs/evaluate";
import DeleteRequestDialog from "../../../dialogs/delete-request";
import {
  EvaluationImportantStatus,
  UpdateImportanceObject,
} from "~/@types/evaluation";
import {
  SetEvaluationSelectedWorkspace,
  LoadEvaluationAssessmentRequest,
  loadEvaluationAssessmentRequestsFromServer,
} from "~/actions/main-function/evaluation/evaluationActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { StateType } from "~/reducers/index";
import { ButtonPill, IconButton } from "~/components/general/button";
import "~/sass/elements/evaluation-card.scss";
import "~/sass/elements/buttons.scss";
import {
  EvaluationAssessmentRequest,
  WorkspaceAssessmentStateType,
} from "~/generated/client";
import {
  useTranslation,
  WithTranslation,
  withTranslation,
} from "react-i18next";
import Dropdown from "~/components/general/dropdown";
import { localize } from "~/locales/i18n";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * EvaluationCardProps
 */
interface EvaluationCardProps extends WithTranslation {
  evaluationAssessmentRequest: EvaluationAssessmentRequest;
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
    evaluationAssessmentRequest,
  } = props;

  const { state } = evaluationAssessmentRequest;

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
          (item) => item !== evaluationAssessmentRequest.workspaceUserEntityId
        );

        updatedUnimportAssessmentList = updatedUnimportAssessmentList.filter(
          (item) => item !== evaluationAssessmentRequest.workspaceUserEntityId
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
        updatedImportAssessmentList.push(
          evaluationAssessmentRequest.workspaceUserEntityId
        );
        updatedUnimportAssessmentList = updatedUnimportAssessmentList.filter(
          (item) => item !== evaluationAssessmentRequest.workspaceUserEntityId
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
          (item) => item !== evaluationAssessmentRequest.workspaceUserEntityId
        );

        updatedUnimportAssessmentList.push(
          evaluationAssessmentRequest.workspaceUserEntityId
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
    setSelectedWorkspaceId({
      workspaceId: evaluationAssessmentRequest.workspaceEntityId,
    });
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

  // Render workspace link if workspace is not the selected one
  const workspaceLink =
    selectedWorkspaceId !== evaluationAssessmentRequest.workspaceEntityId ? (
      <div className="evaluation-card-data-row">
        <div className="eval-workspace-name">
          <a onClick={handleWorkspaceNameClick}>
            {`${evaluationAssessmentRequest.workspaceName} ${
              evaluationAssessmentRequest.workspaceNameExtension !== null
                ? `(${evaluationAssessmentRequest.workspaceNameExtension})`
                : ""
            } `}
          </a>
        </div>
      </div>
    ) : null;

  /**
   * renderArchiveOrDelete
   * @returns React.JSX.Element
   */
  const renderArchiveOrDelete = () => {
    let buttonAriaLabel = t("actions.remove", {
      context: "evaluationRequest",
    });

    if (evaluationAssessmentRequest.workspaceEntityId === selectedWorkspaceId) {
      buttonAriaLabel = t("actions.archive", {
        context: "student",
      });

      return (
        <ArchiveDialog
          place="card"
          evaluationAssessmentRequest={evaluationAssessmentRequest}
        >
          <ButtonPill
            aria-label={buttonAriaLabel}
            buttonModifiers="archive-student"
            icon="archive"
          />
        </ArchiveDialog>
      );
    }

    switch (evaluationAssessmentRequest.state) {
      case "incomplete":
        buttonAriaLabel = t("actions.remove", {
          context: "supplementationRequest",
        });
        break;

      case "interim_evaluation_request":
        buttonAriaLabel = t("actions.remove", {
          context: "interimEvaluationRequest",
        });
        break;

      case "pending":
      case "pending_fail":
      case "pending_pass":
      default:
        buttonAriaLabel = t("actions.remove", {
          context: "evaluationRequest",
        });
        break;
    }

    const button = (
      <ButtonPill
        aria-label={buttonAriaLabel}
        buttonModifiers="archive-request"
        icon="trash"
      />
    );

    return (
      <DeleteRequestDialog
        evaluationAssessmentRequest={evaluationAssessmentRequest}
      >
        {button}
      </DeleteRequestDialog>
    );
  };

  // Card modifier map
  const cardModifierMap: {
    [key in WorkspaceAssessmentStateType]: string;
  } = {
    pending: "state-REQUESTED",
    pending_fail: "state-REQUESTED",
    pending_pass: "state-REQUESTED",
    incomplete: "state-INCOMPLETE",
    pass: "state-PASSED",
    fail: "state-FAILED",
    interim_evaluation_request: "state-INTERIM-EVALUATION-REQUEST",
    unassessed: "",
    interim_evaluation: "",
    transferred: "",
  };

  return (
    <div className={`evaluation-card ${cardModifierMap[state]}`}>
      <EvaluationCardLabel
        show={!!selectedWorkspaceId}
        evaluationAssessmentRequest={evaluationAssessmentRequest}
      />

      <EvaluationCardHeader
        evaluationAssessmentRequest={evaluationAssessmentRequest}
      />
      <EvaluationCardContent
        workspaceLink={workspaceLink}
        evaluationAssessmentRequest={evaluationAssessmentRequest}
      />
      <EvaluationCardFooter>
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
          {renderArchiveOrDelete()}

          <EvaluateDialog
            assessment={evaluationAssessmentRequest}
            onClose={handleDialogClose}
          >
            <ButtonPill
              aria-label={t("actions.evaluateStudent", { ns: "evaluation" })}
              buttonModifiers="evaluate"
              icon="evaluate"
            />
          </EvaluateDialog>
        </div>
      </EvaluationCardFooter>
    </div>
  );
};

/**
 * EvaluationCardLabelProps
 */
interface EvaluationCardLabelProps {
  show: boolean;
  evaluationAssessmentRequest: EvaluationAssessmentRequest;
}

/**
 * EvaluationCardLabel
 * @param props props
 * @returns React.JSX.Element
 */
const EvaluationCardLabel = (props: EvaluationCardLabelProps) => {
  const { t } = useTranslation(["common", "evaluation"]);

  let cardTypeLabel = undefined;

  switch (props.evaluationAssessmentRequest.state) {
    case "incomplete":
      cardTypeLabel = t("labels.supplementationRequest", {
        ns: "evaluation",
      });
      break;

    case "interim_evaluation_request":
      cardTypeLabel = t("labels.interimEvaluationRequest", {
        ns: "evaluation",
      });
      break;

    case "pending":
    case "pending_fail":
    case "pending_pass":
      cardTypeLabel = t("labels.evaluationRequest", {
        ns: "evaluation",
      });
      break;
    default:
      break;
  }

  if (!props.show || !cardTypeLabel) {
    return null;
  }

  return <div className="evaluation-card__type">{cardTypeLabel}</div>;
};

/**
 * EvaluationCardHeaderProps
 */
interface EvaluationCardHeaderProps {
  evaluationAssessmentRequest: EvaluationAssessmentRequest;
}

/**
 * EvaluationCardHeader
 * @param props props
 * @returns React.JSX.Element
 */
const EvaluationCardHeader = (props: EvaluationCardHeaderProps) => {
  const { t } = useTranslation(["common"]);
  const { evaluationAssessmentRequest } = props;

  const studentName = `${evaluationAssessmentRequest.lastName} ${evaluationAssessmentRequest.firstName}`;

  return (
    <div className="evaluation-card__header">
      <div className="evaluation-card__header-primary">
        <div className="evaluation-card__header-title">{studentName}</div>
        <div className="evaluation-card__header-description">
          {evaluationAssessmentRequest.studyProgramme}
        </div>
      </div>
      <div className="evaluation-card__header-secondary">
        <div className="labels">
          {evaluationAssessmentRequest.hasPedagogyForm ? (
            <Dropdown
              alignSelfVertically="top"
              openByHover
              content={
                <span
                  id={
                    `pedagogyPlan-` + evaluationAssessmentRequest.userEntityId
                  }
                >
                  {t("labels.pedagogyPlan", {
                    ns: "common",
                  })}
                </span>
              }
            >
              <div className="label label--pedagogy-plan">
                <span
                  className="label__text label__text--pedagogy-plan"
                  aria-labelledby={
                    `pedagogyPlan-` + evaluationAssessmentRequest.userEntityId
                  }
                >
                  P
                </span>
              </div>
            </Dropdown>
          ) : null}

          {evaluationAssessmentRequest.u18Compulsory ? (
            <Dropdown
              alignSelfVertically="top"
              openByHover
              content={
                <span
                  id={
                    `u18Compulsory-` + evaluationAssessmentRequest.userEntityId
                  }
                >
                  {t("labels.u18Compulsory", {
                    ns: "common",
                  })}
                </span>
              }
            >
              <div className="label label--u18-compulsory">
                <span
                  className="label__text label__text--u18-compulsory"
                  aria-labelledby={
                    `u18Compulsory-` + evaluationAssessmentRequest.userEntityId
                  }
                >
                  O
                </span>
              </div>
            </Dropdown>
          ) : null}
        </div>
      </div>
    </div>
  );
};

/**
 * EvaluationCardContentProps
 */
interface EvaluationCardContentProps {
  workspaceLink?: React.JSX.Element;
  evaluationAssessmentRequest: EvaluationAssessmentRequest;
}

/**
 * EvaluationCardContent
 * @param props props
 * @returns React.JSX.Element
 */
const EvaluationCardContent = (props: EvaluationCardContentProps) => {
  const { workspaceLink, evaluationAssessmentRequest } = props;

  const { t } = useTranslation(["common", "evaluation"]);

  const {
    enrollmentDate,
    assignmentsDone,
    assignmentsTotal,
    evaluationDate,
    assessmentRequestDate,
  } = evaluationAssessmentRequest;

  const enrollmentDateLocalized =
    enrollmentDate !== null
      ? localize.date(evaluationAssessmentRequest.enrollmentDate)
      : "-";
  const evaluationDateLocalized =
    evaluationDate !== null
      ? localize.date(evaluationAssessmentRequest.evaluationDate)
      : "-";
  const assessmentRequestDateLocalized =
    assessmentRequestDate !== null
      ? localize.date(evaluationAssessmentRequest.assessmentRequestDate)
      : "-";

  const enrollmentDateRow = (
    <EvaluationCardContentRow
      hightlight={evaluationAssessmentRequest.state === "unassessed"}
    >
      <span className="evaluation-card__content-label">
        {t("labels.isInWorkspace", { ns: "evaluation" })}
      </span>
      <span className="evaluation-card__content-data">
        {enrollmentDateLocalized}
      </span>
    </EvaluationCardContentRow>
  );

  const evaluationRequestRow = (
    <EvaluationCardContentRow
      hightlight={
        evaluationAssessmentRequest.state === "pending" ||
        evaluationAssessmentRequest.state === "pending_fail" ||
        evaluationAssessmentRequest.state === "pending_pass" ||
        evaluationAssessmentRequest.state === "interim_evaluation_request"
      }
    >
      <span className="evaluation-card__content-label">
        {evaluationAssessmentRequest.state === "interim_evaluation_request"
          ? t("labels.hasInterimEvaluationRequest", { ns: "evaluation" })
          : t("labels.hasEvaluationRequest", { ns: "evaluation" })}
      </span>
      <span className="evaluation-card__content-data">
        {assessmentRequestDateLocalized}
      </span>
    </EvaluationCardContentRow>
  );

  const evaluatedRow = (
    <EvaluationCardContentRow
      hightlight={
        evaluationAssessmentRequest.state === "pass" ||
        evaluationAssessmentRequest.state === "fail" ||
        evaluationAssessmentRequest.state === "incomplete"
      }
    >
      <span className="evaluation-card__content-label">
        {t("labels.evaluated", { ns: "workspace" })}
      </span>
      <span className="evaluation-card__content-data">
        {evaluationDateLocalized}
      </span>
    </EvaluationCardContentRow>
  );

  const tasksDonwRow = (
    <EvaluationCardContentRow>
      <span className="evaluation-card__content-label">
        {t("labels.assignments", { ns: "materials", context: "done" })}
      </span>
      <span
        className={`evaluation-card__content-data ${
          assignmentsDone === assignmentsTotal
            ? "evaluation-card__content-data--all-done"
            : "evaluation-card__content-data--not-done"
        }`}
      >
        {`${assignmentsDone} / ${assignmentsTotal}`}
      </span>
    </EvaluationCardContentRow>
  );

  return (
    <div className="evaluation-card__content">
      {workspaceLink ? workspaceLink : null}
      {enrollmentDateRow}
      {evaluationRequestRow}
      {evaluatedRow}
      {tasksDonwRow}
    </div>
  );
};

/**
 * EvaluationCardFooterProps
 */
interface EvaluationCardFooterProps {
  children: React.ReactNode;
}

/**
 * EvaluationCardFooter
 * @param props props
 * @returns React.JSX.Element
 */
const EvaluationCardFooter = (props: EvaluationCardFooterProps) => {
  const { children } = props;

  return <div className="evaluation-card__footer">{children}</div>;
};

/**
 * EvaluationCardContentRowProps
 */
interface EvaluationCardContentRowProps {
  hightlight?: boolean;
  children: React.ReactNode;
}

const defaultProps: Partial<EvaluationCardContentRowProps> = {
  hightlight: false,
};

/**
 * EvaluationCardContentRow
 * @param props props
 */
const EvaluationCardContentRow = (props: EvaluationCardContentRowProps) => {
  props = { ...defaultProps, ...props };

  const { hightlight, children } = props;

  return (
    <div
      className={`evaluation-card__content-row ${
        hightlight ? "evaluation-card__content-row--highlight" : ""
      }`}
    >
      {children}
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
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    { loadEvaluationAssessmentRequestsFromServer },
    dispatch
  );
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(EvaluationCard)
);
