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
export interface AssignmentMaterialProps {
  i18n: i18nType;
  material: MaterialContentNodeType;
  compositeReply?: MaterialCompositeRepliesType;
  workspace: WorkspaceType;
  userEntityId: number;
}

/**
 * EvaluationMaterialState
 */
interface AssignmentMaterialState {}

/**
 * EvaluationMaterial
 */
export class AssignmentMaterial extends React.Component<
  AssignmentMaterialProps,
  AssignmentMaterialState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: AssignmentMaterialProps) {
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
        loadCompositeReplies={!this.props.compositeReply}
        readOnly
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

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentMaterial);
