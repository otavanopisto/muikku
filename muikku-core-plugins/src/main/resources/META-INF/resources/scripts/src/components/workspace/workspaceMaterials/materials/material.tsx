import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";

import MaterialLoader from "~/components/base/material-loader";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
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
import { MaterialLoaderExternalContent } from "~/components/base/material-loader/external-content";
import {
  MaterialCompositeReply,
  WorkspaceAssessmentStateType,
} from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * WorkspaceMaterialProps
 */
interface WorkspaceMaterialProps extends WithTranslation {
  status: StatusType;
  workspaceEditMode: WorkspaceEditModeStateType;
  materialContentNode: MaterialContentNodeWithIdAndLogic;
  folder: MaterialContentNodeWithIdAndLogic;
  compositeReplies: MaterialCompositeReply;
  isViewRestricted: boolean;
  showEvenIfHidden: boolean;
  workspace: WorkspaceDataType;
  setCurrentWorkspace: SetCurrentWorkspaceTriggerType;
  readspeakerComponent?: JSX.Element;
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
    //This function is very efficient and reuses as much data as possible so it won't call anything from the server other than
    //to refresh the activity and that's because we are forcing it to do so
    this.props.setCurrentWorkspace({
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
      this.props.materialContentNode.assignmentType === "EXERCISE" ||
      this.props.materialContentNode.assignmentType === "INTERIM_EVALUATION";

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

    let isDisabled = false;

    // Values to indicate pending state
    const pendingValues: WorkspaceAssessmentStateType[] = [
      "pending",
      "pending_fail",
      "pending_pass",
    ];

    if (this.props.workspace.activity) {
      // Get the number of modules
      const valueToCheck =
        this.props.workspace.activity.assessmentStates.length;
      let passValueCount = 0;

      this.props.workspace.activity.assessmentStates.forEach((activity) => {
        // Check if any of the modules are in pending state
        if (pendingValues.includes(activity.state)) {
          isDisabled = true;
        }
        // Check if module is passed and increment counter
        if (activity.state === "pass") {
          passValueCount++;
        }
      });

      // there must be at least one assessmentState and
      // If all modules are passed, materials are disabled.
      // This is to prevent students from changing their answers after passing grades are given
      if (valueToCheck > 0 && passValueCount === valueToCheck) {
        isDisabled = true;
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
            answerable={this.props.status.loggedIn && !isDisabled}
            readOnly={!this.props.status.loggedIn || isDisabled}
            onAssignmentStateModified={this.updateWorkspaceActivity}
            invisible={!loaded}
            isViewRestricted={this.props.isViewRestricted}
            readspeakerComponent={this.props.readspeakerComponent}
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
                <MaterialLoaderExternalContent
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
                    className={`material-page__assignment-assessment ${evalStateClassName} rs_skip_always`}
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
    workspaceEditMode: state.workspaces.editMode,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ setCurrentWorkspace }, dispatch);
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(WorkspaceMaterial)
);
