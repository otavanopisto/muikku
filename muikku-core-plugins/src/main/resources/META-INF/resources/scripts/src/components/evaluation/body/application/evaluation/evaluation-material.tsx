import * as React from "react";
import {
  WorkspaceDataType,
  MaterialContentNodeWithIdAndLogic,
} from "~/reducers/workspaces";
import MaterialLoader from "~/components/base/material-loader";
import { MaterialLoaderContent } from "~/components/base/material-loader/content";
import "~/sass/elements/evaluation.scss";
import { MaterialLoaderCorrectAnswerCounter } from "~/components/base/material-loader/correct-answer-counter";
import { StateType } from "~/reducers/index";
import { connect } from "react-redux";
import { AnyActionType } from "~/actions/index";
import { Action, bindActionCreators, Dispatch } from "redux";
import { MaterialLoaderAssesment } from "~/components/base/material-loader/assesment";
import { MaterialLoaderExternalContent } from "~/components/base/material-loader/external-content";
import {
  InterimEvaluationRequest,
  MaterialCompositeReply,
} from "~/generated/client";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * EvaluationMaterialProps
 */
export interface EvaluationMaterialProps extends WithTranslation {
  material: MaterialContentNodeWithIdAndLogic;
  compositeReply?: MaterialCompositeReply;
  interminEvaluationRequest?: InterimEvaluationRequest;
  workspace: WorkspaceDataType;
  userEntityId: number;
}

/**
 * EvaluationMaterialState
 */
interface EvaluationMaterialState {}

/**
 * EvaluationMaterial
 */
export class EvaluationMaterial extends React.Component<
  EvaluationMaterialProps,
  EvaluationMaterialState
> {
  /**
   * constructor
   *
   * @param props props
   */
  constructor(props: EvaluationMaterialProps) {
    super(props);

    this.state = {};
  }

  /**
   * Component render method
   *
   * @returns JSX.Element
   */
  render() {
    const isAssignment =
      this.props.material.assignment.assignmentType === "EVALUATED" ||
      this.props.material.assignment.assignmentType === "EXERCISE";

    const isInterimEvaluation =
      this.props.material.assignment.assignmentType === "INTERIM_EVALUATION";

    const hasEvaluation =
      this.props.compositeReply &&
      this.props.compositeReply.evaluationInfo &&
      (this.props.compositeReply.state === "INCOMPLETE" ||
        this.props.compositeReply.state === "PASSED" ||
        this.props.compositeReply.state === "FAILED" ||
        this.props.compositeReply.state === "WITHDRAWN");

    let evalStateClassName = "";
    let evalStateIcon = "";

    if (this.props.compositeReply) {
      switch (this.props.compositeReply.state) {
        case "INCOMPLETE":
          evalStateClassName =
            "material-page__assignment-assessment--incomplete";
          break;
        case "FAILED":
          evalStateClassName = "material-page__assignment-assessment--failed";
          evalStateIcon = "icon-thumb-down";
          break;
        case "PASSED":
          evalStateClassName = "material-page__assignment-assessment--passed";
          evalStateIcon = "icon-thumb-up";
          break;
        case "WITHDRAWN":
          evalStateClassName =
            "material-page__assignment-assessment--withdrawn";
          break;
      }
    }

    return (
      <MaterialLoader
        material={this.props.material}
        workspace={this.props.workspace}
        compositeReplies={this.props.compositeReply}
        readOnly
        answersVisible
        modifiers="evaluation-material-page"
        usedAs={"evaluationTool"}
        userEntityId={this.props.userEntityId}
        answerable={true}
      >
        {(props, state, stateConfiguration) => (
          <div className="evaluation-modal__item-body">
            {isAssignment && !isInterimEvaluation && hasEvaluation ? (
              <div
                className={`material-page__assignment-assessment ${evalStateClassName}`}
              >
                <div
                  className={`material-page__assignment-assessment-icon ${evalStateIcon}`}
                ></div>

                <MaterialLoaderAssesment {...props} {...state} />
              </div>
            ) : null}

            <MaterialLoaderContent
              {...props}
              {...state}
              stateConfiguration={stateConfiguration}
            />

            {isInterimEvaluation && (
              <>
                <MaterialLoaderExternalContent
                  {...props}
                  {...state}
                  stateConfiguration={stateConfiguration}
                />
                {hasEvaluation && (
                  <div
                    className={`material-page__assignment-assessment material-page__assignment-assessment--interminEvaluation ${evalStateClassName}`}
                  >
                    <div
                      className={`material-page__assignment-assessment-icon material-page__assignment-assessment--interminEvaluation ${evalStateIcon}`}
                    ></div>

                    <MaterialLoaderAssesment {...props} {...state} />
                  </div>
                )}
              </>
            )}

            <MaterialLoaderCorrectAnswerCounter {...props} {...state} />
          </div>
        )}
      </MaterialLoader>
    );
  }
}

/**
 * mapStateToProps
 *
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {};
}

/**
 * mapDispatchToProps
 *
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({}, dispatch);
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(EvaluationMaterial)
);
