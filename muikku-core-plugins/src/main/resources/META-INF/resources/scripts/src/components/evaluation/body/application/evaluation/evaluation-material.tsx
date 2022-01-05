import * as React from "react";
import { MaterialContentNodeType, WorkspaceType } from "~/reducers/workspaces";
import MaterialLoader from "~/components/base/material-loader";
import { MaterialLoaderContent } from "~/components/base/material-loader/content";
import "~/sass/elements/evaluation.scss";
import { MaterialLoaderCorrectAnswerCounter } from "~/components/base/material-loader/correct-answer-counter";
import { StateType } from "~/reducers/index";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions/index";
import { MaterialCompositeRepliesType } from "~/reducers/workspaces/index";
import { bindActionCreators } from "redux";
import { i18nType } from "~/reducers/base/i18n";

/**
 * EvaluationMaterialProps
 */
export interface EvaluationMaterialProps {
  i18n: i18nType;
  material: MaterialContentNodeType;
  compositeReply?: MaterialCompositeRepliesType;
  workspace: WorkspaceType;
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
   * @param props
   */
  constructor(props: EvaluationMaterialProps) {
    super(props);

    this.state = {};
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
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
      >
        {(props, state, stateConfiguration) => (
          <div className="evaluation-modal__item-body">
            <MaterialLoaderContent
              {...props}
              {...state}
              stateConfiguration={stateConfiguration}
            />

            <MaterialLoaderCorrectAnswerCounter {...props} {...state} />
          </div>
        )}
      </MaterialLoader>
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
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EvaluationMaterial);
