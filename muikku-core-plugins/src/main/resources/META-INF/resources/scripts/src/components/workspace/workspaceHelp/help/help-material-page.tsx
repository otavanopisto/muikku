import * as React from "react";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import MaterialLoader from "~/components/base/material-loader";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
  WorkspaceEditModeStateType,
} from "~/reducers/workspaces";
import {
  setCurrentWorkspace,
  SetCurrentWorkspaceTriggerType,
  UpdateAssignmentStateTriggerType,
  updateAssignmentState,
} from "~/actions/workspaces";
import { Action, bindActionCreators, Dispatch } from "redux";
import { MaterialLoaderEditorButtonSet } from "~/components/base/material-loader/editor-buttonset";
import { MaterialLoaderTitle } from "~/components/base/material-loader/title";
import { MaterialLoaderContent } from "~/components/base/material-loader/content";
import { MaterialLoaderProducersLicense } from "~/components/base/material-loader/producers-license";
import { MaterialLoaderCorrectAnswerCounter } from "~/components/base/material-loader/correct-answer-counter";
import { MaterialLoaderAssesment } from "~/components/base/material-loader/assesment";
import { MaterialLoaderGrade } from "~/components/base/material-loader/grade";
import { MaterialLoaderDate } from "~/components/base/material-loader/date";
import LazyLoader from "~/components/general/lazy-loader";
import { StatusType } from "~/reducers/base/status";
import { AnyActionType } from "~/actions";
import { withTranslation, WithTranslation } from "react-i18next";
import { WebsocketStateType } from "~/reducers/util/websocket";
import {
  SetWorkspaceMaterialEditorStateTriggerType,
  RequestWorkspaceMaterialContentNodeAttachmentsTriggerType,
  UpdateWorkspaceMaterialContentNodeTriggerType,
  setWorkspaceMaterialEditorState,
  updateWorkspaceMaterialContentNode,
  requestWorkspaceMaterialContentNodeAttachments,
} from "~/actions/workspaces/material";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";

/**
 * HelpMaterialProps
 */
interface HelpMaterialProps extends WithTranslation {
  materialContentNode: MaterialContentNodeWithIdAndLogic;
  folder: MaterialContentNodeWithIdAndLogic;
  isViewRestricted: boolean;
  workspace: WorkspaceDataType;
  anchorItem?: JSX.Element;
  readspeakerComponent?: JSX.Element;

  // Redux state properties
  status: StatusType;
  websocket: WebsocketStateType;
  workspaceEditMode: WorkspaceEditModeStateType;

  // Actions
  setCurrentWorkspace: SetCurrentWorkspaceTriggerType;
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType;
  requestWorkspaceMaterialContentNodeAttachments: RequestWorkspaceMaterialContentNodeAttachmentsTriggerType;
  setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType;
  updateAssignmentState: UpdateAssignmentStateTriggerType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * HelpMaterialState
 */
interface HelpMaterialState {}

/**
 * WorkspaceMaterial
 */
class WorkspaceMaterial extends React.Component<
  HelpMaterialProps,
  HelpMaterialState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: HelpMaterialProps) {
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
      this.props.materialContentNode.assignmentType === "EVALUATED";
    const isBinary = this.props.materialContentNode.type === "binary";
    const evalStateClassName = "";
    const evalStateIcon = "";

    return (
      <LazyLoader
        useChildrenAsLazy={true}
        className="material-lazy-loader-container"
      >
        {(loaded: boolean) => (
          <MaterialLoader
            status={this.props.status}
            websocket={this.props.websocket}
            canPublish
            canRevert
            canCopy={!isBinary}
            canHide
            canDelete
            canRestrictView
            disablePlugins
            canChangeExerciseType={!isBinary}
            canSetLicense={!isBinary}
            canSetProducers={!isBinary}
            canAddAttachments={!isBinary}
            canEditContent={!isBinary}
            folder={this.props.folder}
            editable={this.props.workspaceEditMode.active}
            material={this.props.materialContentNode}
            workspace={this.props.workspace}
            answerable={this.props.status.loggedIn}
            readOnly={!this.props.status.loggedIn}
            onAssignmentStateModified={this.updateWorkspaceActivity}
            onSetWorkspaceMaterialEditorState={
              this.props.setWorkspaceMaterialEditorState
            }
            onUpdateWorkspaceMaterialContentNode={
              this.props.updateWorkspaceMaterialContentNode
            }
            onRequestWorkspaceMaterialContentNodeAttachments={
              this.props.requestWorkspaceMaterialContentNodeAttachments
            }
            onUpdateAssignmentState={this.props.updateAssignmentState}
            onDisplayNotification={this.props.displayNotification}
            invisible={!loaded}
            isViewRestricted={this.props.isViewRestricted}
            readspeakerComponent={this.props.readspeakerComponent}
            anchorElement={this.props.anchorItem}
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
                <MaterialLoaderCorrectAnswerCounter {...props} {...state} />
                {isAssignment ? (
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
    workspaceEditMode: state.workspaces.editMode,
    status: state.status,
    websocket: state.websocket,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      setCurrentWorkspace,
      setWorkspaceMaterialEditorState,
      updateWorkspaceMaterialContentNode,
      requestWorkspaceMaterialContentNodeAttachments,
      displayNotification,
      updateAssignmentState,
    },
    dispatch
  );
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(WorkspaceMaterial)
);
