import * as React from "react";
import { MaterialContentNodeType, WorkspaceType } from "~/reducers/workspaces";
import MaterialLoader from "~/components/base/material-loader";
import { MaterialLoaderContent } from "~/components/base/material-loader/content";
import { MaterialLoaderAssesment } from "~/components/base/material-loader/assesment";
import { MaterialLoaderGrade } from "~/components/base/material-loader/grade";
import {
  ApplicationListItem,
  ApplicationListItemHeader,
  ApplicationListItemBody,
} from "~/components/general/application-list";
import AnimateHeight from "react-animate-height";
import "~/sass/elements/evaluation.scss";
import { MaterialLoaderCorrectAnswerCounter } from "../../../../base/material-loader/correct-answer-counter";
import * as moment from "moment";
import { MaterialCompositeRepliesStateType } from "../../../../../reducers/workspaces/index";
import { StateType } from "../../../../../reducers/index";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "../../../../../actions/index";
import { EvaluationState } from "../../../../../reducers/main-function/evaluation/index";
import SlideDrawer from "./slide-drawer";
import {
  MaterialCompositeRepliesType,
  MaterialEvaluationType,
} from "../../../../../reducers/workspaces/index";

/**
 * EvaluationMaterialProps
 */
export interface EvaluationMaterialProps {
  material: MaterialContentNodeType;
  workspace: WorkspaceType;
  evaluation: EvaluationState;
}

/**
 * EvaluationMaterialState
 */
interface EvaluationMaterialState {
  height: number | string;
  openDrawer: boolean;
}

/**
 * EvaluationMaterial
 */
export class EvaluationMaterial extends React.Component<
  EvaluationMaterialProps,
  EvaluationMaterialState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: EvaluationMaterialProps) {
    super(props);

    this.toggleOpened = this.toggleOpened.bind(this);

    this.state = {
      height: 0,
      openDrawer: false,
    };
  }

  /**
   * componentWillReceiveProps
   * @param nextProps
   */
  componentWillReceiveProps(nextProps: EvaluationMaterialProps) {
    if (
      nextProps.material.assignment.id !== this.props.material.assignment.id
    ) {
      this.setState({
        height: 0,
      });
    }
  }

  /**
   * toggleOpened
   */
  toggleOpened() {
    const { height } = this.state;

    this.setState({ height: height === 0 ? "auto" : 0 });
  }

  /**
   * handleCloseSlideDrawer
   */
  handleCloseSlideDrawer = () => {
    this.setState({
      openDrawer: false,
    });
  };

  /**
   * handleOpenSlideDrawer
   */
  handleOpenSlideDrawer =
    (materialId: number) =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      this.setState({
        openDrawer: true,
      });
    };

  /**
   * assignmentTypeClass
   * @returns string
   */
  assignmentTypeClass = () => {
    if (this.props.material.assignment.assignmentType === "EVALUATED") {
      return "evaluated";
    }
    return "exercise";
  };

  /**
   * assigmentGradeClass
   * @param state
   * @returns classMod
   */
  assigmentGradeClass = (state: MaterialCompositeRepliesStateType) => {
    if (state !== "INCOMPLETE") {
      return "grade--evaluated";
    }

    return "grade--incomplete";
  };

  /**
   * renderAssignmentStatus
   * @returns JSX.Element
   */
  renderAssignmentStatus = (
    compositeReplies: MaterialCompositeRepliesType,
    evaluation?: MaterialEvaluationType
  ) => {
    /**
     * Checking if assigments is submitted at all.
     * Its date string
     */
    const hasSubmitted = compositeReplies && compositeReplies.submitted;

    /**
     * Checking if its evaluated with grade
     */
    const evaluatedWithGrade = evaluation && evaluation.grade;

    /**
     * Needs supplementation
     */
    const needsSupplementation = compositeReplies.state === "INCOMPLETE";

    /**
     * Evaluation date if evaluated
     */
    const evaluationDate =
      this.props.material.evaluation &&
      this.props.material.evaluation.evaluated;

    /**
     * Grade class mod
     */
    const evaluatedGradeClassMod = this.assigmentGradeClass(
      compositeReplies.state
    );

    return (
      <div className="assignment-status">
        {hasSubmitted === null ||
        (hasSubmitted !== null && compositeReplies.state === "WITHDRAWN") ? (
          <div className="assignment-not-done">
            <span className="assignment-not-done-label">Ei tehty</span>
          </div>
        ) : (
          hasSubmitted && (
            <div className="assignment-done">
              <span className="assignment-done-label">Tehty</span>
              <span className="assignment-done-data">
                {moment(hasSubmitted).format("l")}
              </span>
            </div>
          )
        )}

        {evaluationDate && (
          <div className="assignment-evaluated">
            <span className="assignment-evaluated-label">Arvioitu</span>
            <span className="assignment-evaluated-data">
              {moment(evaluationDate).format("l")}
            </span>
          </div>
        )}

        {evaluatedWithGrade && (
          <div className={`assignment-grade ${evaluatedGradeClassMod}`}>
            <span className="assignment-grade-label">Arvosana</span>
            <span className="assignment-grade-data">
              {this.props.material.evaluation.grade}
            </span>
          </div>
        )}

        {needsSupplementation && (
          <div className={`assignment-grade ${evaluatedGradeClassMod}`}>
            <span className="assignment-grade-data">Täydennettävä</span>
          </div>
        )}
      </div>
    );
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const wrapperClassMod = this.assignmentTypeClass();

    return (
      <>
        <ApplicationListItem
          key={this.props.material.id}
          className={`application-list__item assignment ${
            this.props.material.evaluation ? "" : "state-NO-ASSESSMENT"
          }`}
        >
          <MaterialLoader
            material={this.props.material}
            workspace={this.props.workspace}
            readOnly
            loadCompositeReplies
            answersVisible
            modifiers="studies-material-page"
            usedAs={"evaluationTool"}
            userEntityId={
              this.props.evaluation.evaluationSelectedAssessmentId.userEntityId
            }
          >
            {(props, state, stateConfiguration) => {
              let evaluatedFunctionClassMod = "";

              if (
                this.props.material.evaluation ||
                state.compositeRepliesInState.state === "INCOMPLETE"
              ) {
                if (
                  this.props.material.evaluation &&
                  this.props.material.evaluation.evaluated
                ) {
                  evaluatedFunctionClassMod = "evaluated-graded";
                } else {
                  evaluatedFunctionClassMod = "evaluated";
                }
              }

              return (
                <div>
                  <ApplicationListItemHeader modifiers="evaluation-assignment">
                    <div className="assignment-title-content">
                      <div
                        className={`assignment-title-wrapper ${wrapperClassMod}`}
                        onClick={this.toggleOpened}
                      >
                        <div className="assignment-status-title">
                          <span className="application-list__header-primary assignment-title">
                            {this.props.material.assignment.title}
                          </span>
                        </div>

                        {this.renderAssignmentStatus(
                          state.compositeRepliesInState,
                          props.material.evaluation
                        )}
                      </div>
                      <div className="assignment-functions">
                        {props.material.assignment.assignmentType ===
                        "EVALUATED" ? (
                          <div
                            onClick={this.handleOpenSlideDrawer(
                              props.material.id
                            )}
                            className={`assignment-evaluate-button icon-evaluate ${evaluatedFunctionClassMod}`}
                            title="Arvioi tehtävä"
                          />
                        ) : (
                          state.compositeRepliesInState &&
                          state.compositeRepliesInState.submitted && (
                            <div
                              className="exercise-done-indicator icon-checkmark"
                              title="Harjoitustehtävä tehty"
                            ></div>
                          )
                        )}
                      </div>
                    </div>

                    <SlideDrawer
                      title={this.props.material.assignment.title}
                      editorLabel="Tehtävän sanallinen arviointi"
                      modifiers={["literal"]}
                      drawerType="literal"
                      gradeSystem={
                        this.props.evaluation.evaluationGradeSystem[0]
                      }
                      show={this.state.openDrawer}
                      onClose={this.handleCloseSlideDrawer}
                    />
                  </ApplicationListItemHeader>

                  <AnimateHeight duration={800} height={this.state.height}>
                    {props.material.evaluation &&
                      props.material.evaluation.verbalAssessment && (
                        <div className="assignment-literal-evaluation-wrapper">
                          <div className="assignment-literal-evaluation-label">
                            Sanallinen arviointi
                          </div>
                          <div className="assignment-literal-evaluation">
                            {props.material.evaluation.verbalAssessment}
                          </div>
                        </div>
                      )}
                    <ApplicationListItemBody modifiers="evaluation-assignment">
                      <MaterialLoaderContent
                        {...props}
                        {...state}
                        stateConfiguration={stateConfiguration}
                      />

                      <MaterialLoaderCorrectAnswerCounter
                        {...props}
                        {...state}
                      />
                    </ApplicationListItemBody>
                  </AnimateHeight>
                </div>
              );
            }}
          </MaterialLoader>
        </ApplicationListItem>
      </>
    );
  }
}

/**
 * mapStateToProps
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(EvaluationMaterial);
