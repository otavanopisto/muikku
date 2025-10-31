import { StateType } from "~/reducers";
import { connect } from "react-redux";
import * as React from "react";
import {
  WorkspaceDataType,
  WorkspaceEditModeStateType,
} from "~/reducers/workspaces";
import "~/sass/elements/panel.scss";
import "~/sass/elements/item-list.scss";
import "~/sass/elements/material-admin.scss";
import MaterialLoader from "~/components/base/material-loader";
import { MaterialLoaderEditorButtonSet } from "~/components/base/material-loader/editor-buttonset";
import { MaterialLoaderTitle } from "~/components/base/material-loader/title";
import { MaterialLoaderContent } from "~/components/base/material-loader/content";
import { MaterialLoaderProducersLicense } from "~/components/base/material-loader/producers-license";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { WebsocketStateType } from "~/reducers/util/websocket";
import { StatusType } from "~/reducers/base/status";
import {
  SetWorkspaceMaterialEditorStateTriggerType,
  setWorkspaceMaterialEditorState,
  RequestWorkspaceMaterialContentNodeAttachmentsTriggerType,
  requestWorkspaceMaterialContentNodeAttachments,
  UpdateWorkspaceMaterialContentNodeTriggerType,
  updateWorkspaceMaterialContentNode,
} from "~/actions/workspaces/material";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";

/**
 * DescriptionPanelProps
 */
interface DescriptionPanelProps extends WithTranslation {
  isInFrontPage?: boolean;

  // Redux state
  workspaceEditMode: WorkspaceEditModeStateType;
  workspace: WorkspaceDataType;
  status: StatusType;
  websocket: WebsocketStateType;

  // Redux actions
  displayNotification: DisplayNotificationTriggerType;
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType;
  setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType;
  requestWorkspaceMaterialContentNodeAttachments: RequestWorkspaceMaterialContentNodeAttachmentsTriggerType;
}

/**
 * DescriptionPanelState
 */
interface DescriptionPanelState {}

/**
 * DescriptionPanel
 */
class DescriptionPanel extends React.Component<
  DescriptionPanelProps,
  DescriptionPanelState
> {
  /**
   * render
   */
  render() {
    const { t } = this.props;

    return (
      <div className="panel panel--workspace-description">
        <div className="panel__header">
          <div className="panel__header-icon panel__header-icon--workspace-description icon-books"></div>
          <h2 className="panel__header-title">
            {t("labels.introduction", { ns: "workspace" })}
          </h2>
        </div>

        <div className="panel__body">
          {this.props.workspace && (
            <MaterialLoader
              status={this.props.status}
              websocket={this.props.websocket}
              editable={this.props.workspaceEditMode.active}
              modifiers="workspace-description"
              material={this.props.workspace.contentDescription}
              workspace={this.props.workspace}
              canDelete={false}
              canHide={false}
              canPublish
              disablePlugins
              readOnly
              isInFrontPage
              canAddAttachments
              canEditContent
              canSetTitle={false}
              onUpdateWorkspaceMaterialContentNode={
                this.props.updateWorkspaceMaterialContentNode
              }
              onSetWorkspaceMaterialEditorState={
                this.props.setWorkspaceMaterialEditorState
              }
              onRequestWorkspaceMaterialContentNodeAttachments={
                this.props.requestWorkspaceMaterialContentNodeAttachments
              }
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
                  <MaterialLoaderProducersLicense {...props} {...state} />
                </div>
              )}
            </MaterialLoader>
          )}
        </div>
      </div>
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
    websocket: state.websocket,
    workspace: state.workspaces.currentWorkspace,
    workspaceEditMode: state.workspaces.editMode,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      displayNotification,
      setWorkspaceMaterialEditorState,
      updateWorkspaceMaterialContentNode,
      requestWorkspaceMaterialContentNodeAttachments,
    },
    dispatch
  );
}

export default withTranslation(["workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(DescriptionPanel)
);
