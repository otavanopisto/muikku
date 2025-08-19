import * as React from "react";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import MaterialLoader from "~/components/base/material-loader";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
} from "~/reducers/workspaces";
import { Action, bindActionCreators, Dispatch } from "redux";
import { MaterialLoaderTitle } from "~/components/base/material-loader/title";
import { MaterialLoaderContent } from "~/components/base/material-loader/content";
import { MaterialLoaderButtons } from "~/components/base/material-loader/buttons";
import LazyLoader from "~/components/general/lazy-loader";
import { StatusType } from "~/reducers/base/status";
import { AnyActionType } from "~/actions";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * WorkspaceMaterialProps
 */
interface ExamMaterialProps extends WithTranslation {
  status: StatusType;
  materialContentNode: MaterialContentNodeWithIdAndLogic;
  workspace: WorkspaceDataType;
  anchorItem?: JSX.Element;
  readspeakerComponent?: JSX.Element;
}

/**
 * WorkspaceMaterialState
 */
interface ExamMaterialState {}

/**
 * WorkspaceMaterial
 */
class ExamMaterial extends React.Component<
  ExamMaterialProps,
  ExamMaterialState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ExamMaterialProps) {
    super(props);
  }

  /**
   * render
   */
  render() {
    const isBinary = this.props.materialContentNode.type === "binary";

    return (
      <LazyLoader
        useChildrenAsLazy={true}
        className="material-lazy-loader-container"
      >
        {(loaded: boolean) => (
          <MaterialLoader
            canPublish
            canRevert
            canCopy={!isBinary}
            canHide
            canDelete
            canRestrictView
            canChangePageType={!isBinary}
            canChangeExerciseType={!isBinary}
            canSetLicense={!isBinary}
            canSetProducers={!isBinary}
            canAddAttachments={!isBinary}
            canEditContent={!isBinary}
            editable={false}
            material={this.props.materialContentNode}
            workspace={this.props.workspace}
            answerable={this.props.status.loggedIn}
            readOnly={!this.props.status.loggedIn}
            invisible={!loaded}
            isViewRestricted={false}
            readspeakerComponent={this.props.readspeakerComponent}
            anchorElement={this.props.anchorItem}
            loadCompositeReplies
          >
            {(props, state, stateConfiguration) => (
              <div>
                <MaterialLoaderTitle {...props} {...state} />
                <MaterialLoaderContent
                  {...props}
                  {...state}
                  stateConfiguration={stateConfiguration}
                />

                <div className="material-page__de-floater"></div>

                <MaterialLoaderButtons
                  {...props}
                  {...state}
                  stateConfiguration={stateConfiguration}
                />
              </div>
            )}
          </MaterialLoader>
        )}
      </LazyLoader>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({}, dispatch);
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(ExamMaterial)
);
