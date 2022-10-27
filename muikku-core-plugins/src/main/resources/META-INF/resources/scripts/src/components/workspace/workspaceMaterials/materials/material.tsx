import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";

import MaterialLoader from "~/components/base/material-loader";
import {
  MaterialContentNodeType,
  WorkspaceType,
  MaterialCompositeRepliesType,
  WorkspaceEditModeStateType,
} from "~/reducers/workspaces";
import {
  setCurrentWorkspace,
  SetCurrentWorkspaceTriggerType,
} from "~/actions/workspaces";
import { bindActionCreators } from "redux";
import { MaterialLoaderEditorButtonSet } from "~/components/base/material-loader/editor-buttonset";
import { MaterialLoaderTitle } from "~/components/base/material-loader/title";
import { MaterialLoaderContent } from "~/components/base/material-loader/content";
import { MaterialLoaderProducersLicense } from "~/components/base/material-loader/producers-license";
import { MaterialLoaderButtons } from "~/components/base/material-loader/buttons";
import { MaterialLoaderCorrectAnswerCounter } from "~/components/base/material-loader/correct-answer-counter";
import { MaterialLoaderAssesment } from "~/components/base/material-loader/assesment";
import { MaterialLoaderGrade } from "~/components/base/material-loader/grade";
import { MaterialLoaderDate } from "~/components/base/material-loader/date";
import LazyLoader from "~/components/general/lazy-loader";
import { StatusType } from "~/reducers/base/status";
import { AnyActionType } from "~/actions";
import {
  SetActiveWorkspaceTrigger,
  setActiveWorkspace,
} from "~/actions/workspaces/activeWorkspace";

/**
 * WorkspaceMaterialProps
 */
interface WorkspaceMaterialProps {
  i18n: i18nType;
  status: StatusType;
  workspaceEditMode: WorkspaceEditModeStateType;
  materialContentNode: MaterialContentNodeType;
  folder: MaterialContentNodeType;
  compositeReplies: MaterialCompositeRepliesType;
  isViewRestricted: boolean;
  showEvenIfHidden: boolean;
  workspace: WorkspaceType;
  setCurrentWorkspace: SetCurrentWorkspaceTriggerType;
  setActiveWorkspace: SetActiveWorkspaceTrigger;
}

/**
 * WorkspaceMaterialState
 */
interface WorkspaceMaterialState {}

/**
 * WorkspaceMaterial
 */
class WorkspaceMaterial extends React.Component<
  WorkspaceMaterialProps,
  WorkspaceMaterialState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WorkspaceMaterialProps) {
    super(props);
    this.updateWorkspaceActivity = this.updateWorkspaceActivity.bind(this);
  }

  /**
   * updateWorkspaceActivity
   */
  updateWorkspaceActivity() {
    //This function is very efficient and reuses as much data as possible so
    // it won't call anything from the server other than
    //to refresh the activity and that's because we are forcing it to do so

    // TODO: REMOVE
    this.props.setCurrentWorkspace({
      workspaceId: this.props.workspace.id,
      refreshActivity: true,
    });

    this.props.setActiveWorkspace({
      workspaceId: this.props.workspace.id,
      refreshActivity: true,
    });
  }

  /**
   * render
   */
  render() {
    const isAssignment =
      this.props.materialContentNode.assignmentType === "EVALUATED" ||
      this.props.materialContentNode.assignmentType === "EXERCISE";
    const isEvaluatedAsPassed =
      this.props.compositeReplies &&
      this.props.compositeReplies.state === "PASSED";
    const hasEvaluation =
      this.props.compositeReplies &&
      this.props.compositeReplies.evaluationInfo &&
      (this.props.compositeReplies.state === "INCOMPLETE" ||
        this.props.compositeReplies.state === "PASSED" ||
        this.props.compositeReplies.state === "FAILED" ||
        this.props.compositeReplies.state === "WITHDRAWN");
    const isBinary = this.props.materialContentNode.type === "binary";
    let evalStateClassName = "";
    let evalStateIcon = "";
    if (this.props.compositeReplies) {
      switch (this.props.compositeReplies.state) {
        case "INCOMPLETE":
          evalStateClassName =
            "material-page__assignment-assessment--incomplete";
          evalStateIcon = "icon-thumb-down";
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
          evalStateIcon = "";
          break;
      }
    }

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
            folder={this.props.folder}
            editable={this.props.workspaceEditMode.active}
            material={this.props.materialContentNode}
            workspace={this.props.workspace}
            compositeReplies={this.props.compositeReplies}
            answerable={this.props.status.loggedIn}
            readOnly={!this.props.status.loggedIn}
            onAssignmentStateModified={this.updateWorkspaceActivity}
            invisible={!loaded}
            isViewRestricted={this.props.isViewRestricted}
          >
            {(props, state, stateConfiguration) => (
              <div>
                <MaterialLoaderEditorButtonSet {...props} {...state} />
                <MaterialLoaderTitle {...props} {...state} />
                <MaterialLoaderContent
                  {...props}
                  {...state}
                  stateConfiguration={stateConfiguration}
                />
                <div className="material-page__de-floater"></div>
                {!isEvaluatedAsPassed &&
                !props.material.contentHiddenForUser ? (
                  <MaterialLoaderButtons
                    {...props}
                    {...state}
                    stateConfiguration={stateConfiguration}
                  />
                ) : null}
                <MaterialLoaderCorrectAnswerCounter {...props} {...state} />
                {isAssignment && hasEvaluation ? (
                  <div
                    className={`material-page__assignment-assessment ${evalStateClassName}`}
                  >
                    <div
                      className={`material-page__assignment-assessment-icon ${evalStateIcon}`}
                    ></div>
                    <MaterialLoaderDate {...props} {...state} />
                    <MaterialLoaderGrade {...props} {...state} />
                    <MaterialLoaderAssesment {...props} {...state} />
                  </div>
                ) : null}
                <MaterialLoaderProducersLicense {...props} {...state} />
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
    i18n: state.i18n,
    workspaceEditMode: state.workspaces.editMode,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { setCurrentWorkspace, setActiveWorkspace },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceMaterial);
