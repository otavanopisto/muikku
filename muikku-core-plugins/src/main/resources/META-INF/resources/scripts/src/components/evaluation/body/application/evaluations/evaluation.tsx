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
import WorkspaceEditor from "./workspace-editor";
import SupplementationEditor from "./supplementation-editor";
import { StatusType } from "../../../../../reducers/base/status";

interface EvaluationDrawerProps {
  status: StatusType;
  onClose?: () => void;
  evaluation: EvaluationState;
  selectedAssessment: AssessmentRequest;
}

interface EvaluationDrawerState {
  showWorkspaceEvaluationDrawer: boolean;
  showWorkspaceSupplemenationDrawer: boolean;
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
    this.setState({
      showWorkspaceEvaluationDrawer: false,
    });
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
    this.setState({
      showWorkspaceSupplemenationDrawer: false,
    });
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
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { evaluationAssessmentEvents } = this.props.evaluation;

    const evaluationDiaryEvents =
      this.props.evaluation.evaluationCurrentSelectedRecords &&
      this.props.evaluation.evaluationCurrentSelectedRecords.journals.length >
        0 ? (
        this.props.evaluation.evaluationCurrentSelectedRecords.journals.map(
          (item) => <EvaluationDiaryEvent key={item.id} {...item} />
        )
      ) : (
        <div className="journal-entry-title-wrapper">
          <div className="journal-entry-title journal-entry-title--empty">
            Ei päiväkirjamerkintöjä!
          </div>
        </div>
      );

    let isEvaluated = false;

    /**
     * evaluationEventContentCards
     */
    const evaluationEventContentCards =
      evaluationAssessmentEvents.length > 0 ? (
        evaluationAssessmentEvents.map((eItem, index) => {
          let latest = false;

          if (evaluationAssessmentEvents.length - 1 === index) {
            latest = true;
          }
          if (eItem.grade !== null) {
            isEvaluated = true;
          }

          return (
            <EvaluationEventContentCard
              key={index}
              {...eItem}
              latest={latest}
              gradeSystem={this.props.evaluation.evaluationGradeSystem[0]}
            />
          );
        })
      ) : (
        <h2 style={{ fontStyle: "italic" }}>Arviointihistoria tyhjä</h2>
      );

    /**
     * renderEvaluationAssessmentAssignments
     */
    const renderEvaluationAssessmentAssignments =
      this.props.evaluation.evaluationCurrentSelectedRecords &&
      this.props.evaluation.evaluationCurrentSelectedRecords.materials.map(
        (item, i) => (
          <EvaluationAssessmentAssignment
            key={i}
            workspace={
              this.props.evaluation.evaluationCurrentSelectedRecords.workspace
            }
            material={item}
            gradeSystem={this.props.evaluation.evaluationGradeSystem[0]}
          />
        )
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
              <div className="eval-modal-assignments-title">Tehtävät</div>
              <div className="loader-empty">
                {renderEvaluationAssessmentAssignments}
              </div>
            </div>
            <div className="eval-modal-materials-content">
              <div className="eval-modal-assignments-title">
                Oppimispäiväkirjamerkinnät
              </div>
              <div className="loader-empty">{evaluationDiaryEvents}</div>
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
                Työtilan arviointihistoria
              </div>
              <div className="workspace-events-container">
                <div className="loader-empty">
                  {evaluationEventContentCards}
                </div>

                <SlideDrawer
                  title="Työtilan kokonaisarviointi"
                  modifiers={["workspace"]}
                  show={this.state.showWorkspaceEvaluationDrawer}
                  onClose={this.handleWorkspaceEvaluationCloseDrawer}
                >
                  <WorkspaceEditor
                    onClose={this.handleWorkspaceEvaluationCloseDrawer}
                  />
                </SlideDrawer>

                <SlideDrawer
                  title="Työtilan täydennyspyyntö"
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
                  />
                </SlideDrawer>
              </div>

              <div className="eval-modal-evaluate-buttonset">
                <div
                  onClick={this.handleOpenWorkspaceEvaluationDrawer}
                  className="eval-modal-evaluate-button button-start-evaluation"
                >
                  {isEvaluated ? "Anna korotus" : "Anna kurssiarvio"}
                </div>
                <div
                  onClick={
                    this.handleOpenWorkspaceSupplementationEvaluationDrawer
                  }
                  className="eval-modal-evaluate-button button-supplementation-request"
                >
                  Pyydä täydennystä
                </div>
              </div>
            </div>
          </div>
        </section>
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
    status: state.status,
    evaluation: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Evaluation);
