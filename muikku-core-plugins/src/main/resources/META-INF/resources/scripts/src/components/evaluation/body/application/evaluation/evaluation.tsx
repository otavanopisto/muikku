import * as React from "react";
import SlideDrawer from "./slide-drawer";
import EvaluationEventContentCard from "./evaluation-event-content-card";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "../../../../../actions/index";
import { StateType } from "../../../../../reducers/index";
import { EvaluationState } from "../../../../../reducers/main-function/evaluation/index";
import "~/sass/elements/evaluation.scss";
import EvaluationAssessmentAssignment from "./evaluation-assessment-assignment";
import { AssessmentRequest } from "../../../../../@types/evaluation";
import EvaluationDiaryEvent from "./evaluation-diary-event";
import WorkspaceEditor from "./editors/workspace-editor";
import SupplementationEditor from "./editors/supplementation-editor";
import { StatusType } from "../../../../../reducers/base/status";
import { i18nType } from "../../../../../reducers/base/i18n";
import ArchiveDialog from "../../../dialogs/archive";
import { bindActionCreators } from "redux";
import Button from "../../../../general/button";
import {
  LoadEvaluationAssessmentRequest,
  LoadEvaluationAssessmentEvent,
  loadEvaluationAssessmentRequestsFromServer,
  loadEvaluationAssessmentEventsFromServer,
} from "../../../../../actions/main-function/evaluation/evaluationActions";
import "~/sass/elements/assignment.scss";

interface EvaluationDrawerProps {
  i18n: i18nType;
  status: StatusType;
  onClose?: () => void;
  evaluation: EvaluationState;
  selectedAssessment: AssessmentRequest;
  loadEvaluationAssessmentRequestsFromServer: LoadEvaluationAssessmentRequest;
  loadEvaluationAssessmentEventsFromServer: LoadEvaluationAssessmentEvent;
}

interface EvaluationDrawerState {
  archiveStudentDialog: boolean;
  showWorkspaceEvaluationDrawer: boolean;
  showWorkspaceSupplemenationDrawer: boolean;
  edit?: boolean;
  showContent: boolean;
}

export class Evaluation extends React.Component<
  EvaluationDrawerProps,
  EvaluationDrawerState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: EvaluationDrawerProps) {
    super(props);

    this.state = {
      archiveStudentDialog: false,
      showWorkspaceEvaluationDrawer: false,
      showWorkspaceSupplemenationDrawer: false,
      showContent: false,
    };
  }

  /**
   * handleOpenDrawer
   */
  handleOpenWorkspaceEvaluationDrawer = () => {
    this.setState({
      showWorkspaceEvaluationDrawer: true,
    });
  };

  /**
   * handleCloseDrawer
   */
  handleWorkspaceEvaluationCloseDrawer = () => {
    if (this.state.edit) {
      this.setState({
        edit: false,
        showWorkspaceEvaluationDrawer: false,
      });
    } else {
      this.setState({
        showWorkspaceEvaluationDrawer: false,
      });
    }
  };

  /**
   * handleOpenDrawer
   */
  handleOpenWorkspaceSupplementationEvaluationDrawer = () => {
    this.setState({
      showWorkspaceSupplemenationDrawer: true,
    });
  };

  /**
   * handleCloseDrawer
   */
  handleWorkspaceSupplementationEvaluationCloseDrawer = () => {
    if (this.state.edit) {
      this.setState({
        edit: false,
        showWorkspaceSupplemenationDrawer: false,
      });
    } else {
      this.setState({
        showWorkspaceSupplemenationDrawer: false,
      });
    }
  };

  /**
   * handleOpenContent
   */
  handleOpenContent = () => {
    this.setState({
      showContent: !this.state.showContent,
    });
  };

  /**
   * handleOpenArchiveStudentDialog
   */
  handleOpenArchiveStudentDialog = () => {
    this.setState({
      archiveStudentDialog: true,
    });
  };

  /**
   * handleCloseArchiveStudentDialog
   */
  handleCloseArchiveStudentDialog = () => {
    this.setState({
      archiveStudentDialog: false,
    });
    this.props.loadEvaluationAssessmentEventsFromServer({
      assessment: this.props.evaluation.evaluationSelectedAssessmentId,
    });
  };

  /**
   * handleClickEdit
   * @param supplementation
   */
  handleClickEdit =
    (supplementation?: boolean) =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (supplementation) {
        this.setState({
          edit: true,
          showWorkspaceSupplemenationDrawer: true,
        });
      } else {
        this.setState({
          edit: true,
          showWorkspaceEvaluationDrawer: true,
        });
      }
    };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { evaluationAssessmentEvents } = this.props.evaluation;

    const evaluationDiaryEvents =
      this.props.evaluation.evaluationDiaryEntries.data &&
      this.props.evaluation.evaluationDiaryEntries.data.length > 0 ? (
        this.props.evaluation.evaluationDiaryEntries.data.map((item) => (
          <EvaluationDiaryEvent key={item.id} {...item} />
        ))
      ) : (
        <div className="journal-entry-title-wrapper no-journals">
          <div className="journal-entry-title journal-entry-title--empty">
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.noJournals"
            )}
            !
          </div>
        </div>
      );

    let isEvaluated = false;

    /**
     * evaluationEventContentCards
     */
    const evaluationEventContentCards =
      evaluationAssessmentEvents.data &&
      evaluationAssessmentEvents.data.length > 0 ? (
        evaluationAssessmentEvents.data.map((eItem, index) => {
          let latest = false;

          if (evaluationAssessmentEvents.data.length - 1 === index) {
            latest = true;
          }
          if (eItem.grade !== null) {
            isEvaluated = true;
          }

          return (
            <EvaluationEventContentCard
              onClickEdit={this.handleClickEdit}
              key={index}
              {...eItem}
              latest={latest}
              gradeSystem={this.props.evaluation.evaluationGradeSystem[0]}
            />
          );
        })
      ) : (
        <h2 style={{ fontStyle: "italic" }}>
          {this.props.i18n.text.get(
            "plugin.evaluation.evaluationModal.noEvents"
          )}
        </h2>
      );

    /**
     * renderEvaluationAssessmentAssignments
     */
    const renderEvaluationAssessmentAssignments =
      this.props.evaluation.evaluationCurrentSelectedRecords.data &&
      this.props.evaluation.evaluationCurrentSelectedRecords.data.materials
        .length > 0 ? (
        this.props.evaluation.evaluationCurrentSelectedRecords.data.materials.map(
          (item, i) => (
            <EvaluationAssessmentAssignment
              key={i}
              workspace={
                this.props.evaluation.evaluationWorkspaces[
                  this.props.evaluation.selectedWorkspaceId
                ]
              }
              material={item}
              gradeSystem={this.props.evaluation.evaluationGradeSystem[0]}
            />
          )
        )
      ) : (
        <div className="assignment-wrapper material-container">
          <div className="assignment-content">
            <div className="page-content">
              <div className="assignment-title-content">
                <div className="assignment-title-wrapper">
                  <div className="assignment-status-title">
                    <span
                      className="application-list__header-primary assignment-title"
                      style={{ fontStyle: "italic" }}
                    >
                      {this.props.i18n.text.get(
                        "plugin.evaluation.evaluationModal.noAssignmentsTitle"
                      )}
                      !
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    return (
      <div className="eval-container" style={{ display: "flex" }}>
        <div onClick={this.props.onClose} className="eval-close">
          <div className="circle">
            <div className="before"></div>
            <div className="after"></div>
          </div>
        </div>

        <section className="eval-modal-student-container">
          <header className="eval-modal-student-header flex-row flex-align-items-center">
            <div className="eval-modal-student-name">{`${this.props.selectedAssessment.lastName}, ${this.props.selectedAssessment.firstName} (${this.props.selectedAssessment.studyProgramme})`}</div>
          </header>

          <div className="eval-modal-material-journal-container">
            <div className="eval-modal-materials-content">
              <div className="eval-modal-assignments-title">
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.assignmentsTitle"
                )}
              </div>
              {this.props.evaluation.evaluationCurrentSelectedRecords.state ===
                "READY" &&
              this.props.evaluation.evaluationCompositeReplies.state ===
                "READY" ? (
                renderEvaluationAssessmentAssignments
              ) : (
                <div className="loader-empty" />
              )}
            </div>
            <div className="eval-modal-materials-content">
              <div className="eval-modal-assignments-title">
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.journalTitle"
                )}
              </div>
              {this.props.evaluation.evaluationDiaryEntries.state ===
              "READY" ? (
                evaluationDiaryEvents
              ) : (
                <div className="loader-empty" />
              )}
            </div>
          </div>
        </section>
        <section className="eval-modal-student-events-container">
          <header className="eval-modal-events-header flex-row flex-align-items-center">
            <div className="eval-modal-workspace-name">
              {this.props.selectedAssessment.workspaceName}
            </div>
          </header>
          <div className="eval-modal-material-journal-container">
            <div className="eval-modal-events-content">
              <div className="eval-modal-events-title">
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.events.title"
                )}
              </div>
              <div className="workspace-events-container">
                {this.props.evaluation.evaluationAssessmentEvents.state ===
                "READY" ? (
                  evaluationEventContentCards
                ) : (
                  <div className="loader-empty" />
                )}

                <SlideDrawer
                  title={this.props.i18n.text.get(
                    "plugin.evaluation.evaluationModal.workspaceEvaluationForm.title"
                  )}
                  modifiers={["workspace"]}
                  show={this.state.showWorkspaceEvaluationDrawer}
                  onClose={this.handleWorkspaceEvaluationCloseDrawer}
                >
                  <WorkspaceEditor
                    editorLabel={this.props.i18n.text.get(
                      "plugin.evaluation.evaluationModal.workspaceEvaluationForm.literalAssessmentLabel"
                    )}
                    onClose={this.handleWorkspaceEvaluationCloseDrawer}
                    type={this.state.edit ? "edit" : "new"}
                    onSuccesfulSave={this.handleOpenArchiveStudentDialog}
                  />
                </SlideDrawer>

                <SlideDrawer
                  title={this.props.i18n.text.get(
                    "plugin.evaluation.evaluationModal.workspaceEvaluationForm.supplementationTitle"
                  )}
                  modifiers={["supplementation"]}
                  show={this.state.showWorkspaceSupplemenationDrawer}
                  onClose={
                    this.handleWorkspaceSupplementationEvaluationCloseDrawer
                  }
                >
                  <SupplementationEditor
                    onClose={
                      this.handleWorkspaceSupplementationEvaluationCloseDrawer
                    }
                    type={this.state.edit ? "edit" : "new"}
                  />
                </SlideDrawer>
              </div>

              <div className="eval-modal-evaluate-buttonset">
                <Button
                  onClick={this.handleOpenWorkspaceEvaluationDrawer}
                  className="eval-modal-evaluate-button eval-modal-evaluate-button--new-workspace"
                  disabled={
                    this.props.evaluation.evaluationAssessmentEvents.state ===
                      "LOADING" ||
                    this.props.evaluation.basePrice.state === "LOADING"
                  }
                >
                  {isEvaluated
                    ? this.props.i18n.text.get(
                        "plugin.evaluation.evaluationModal.events.improvedGradeButton"
                      )
                    : this.props.i18n.text.get(
                        "plugin.evaluation.evaluationModal.events.gradeButton"
                      )}
                </Button>
                <Button
                  onClick={
                    this.handleOpenWorkspaceSupplementationEvaluationDrawer
                  }
                  className="eval-modal-evaluate-button eval-modal-evaluate-button--supplementation"
                  disabled={
                    this.props.evaluation.evaluationAssessmentEvents.state ===
                      "LOADING" ||
                    this.props.evaluation.basePrice.state === "LOADING"
                  }
                >
                  {this.props.i18n.text.get(
                    "plugin.evaluation.evaluationModal.events.supplementationButton"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>
        <ArchiveDialog
          isOpen={this.state.archiveStudentDialog}
          onClose={this.handleCloseArchiveStudentDialog}
          place="modal"
          {...this.props.evaluation.evaluationSelectedAssessmentId}
        />
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status,
    evaluation: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      loadEvaluationAssessmentRequestsFromServer,
      loadEvaluationAssessmentEventsFromServer,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Evaluation);
