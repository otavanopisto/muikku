import { StateType } from "~/reducers";
import { connect } from "react-redux";
import * as React from "react";
import {
  WorkspaceType,
  WorkspaceEditModeStateType,
} from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18nOLD";

import "~/sass/elements/panel.scss";
import "~/sass/elements/item-list.scss";
import "~/sass/elements/material-admin.scss";

import MaterialLoader from "~/components/base/material-loader";
import { MaterialLoaderEditorButtonSet } from "~/components/base/material-loader/editor-buttonset";
import { MaterialLoaderTitle } from "~/components/base/material-loader/title";
import { MaterialLoaderContent } from "~/components/base/material-loader/content";
import { MaterialLoaderProducersLicense } from "~/components/base/material-loader/producers-license";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * DescriptionPanelProps
 */
interface DescriptionPanelProps extends WithTranslation<["common"]> {
  workspace: WorkspaceType;
  i18nOLD: i18nType;
  isInFrontPage?: boolean;
  workspaceEditMode: WorkspaceEditModeStateType;
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
   *
   */
  render() {
    return (
      <div className="panel panel--workspace-description">
        <div className="panel__header">
          <div className="panel__header-icon panel__header-icon--workspace-description icon-books"></div>
          <h2 className="panel__header-title">
            {this.props.i18nOLD.text.get(
              "plugin.workspace.index.descriptionTitle"
            )}
          </h2>
        </div>
        <div className="panel__body">
          {this.props.workspace && (
            <MaterialLoader
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
    i18nOLD: state.i18nOLD,
    workspace: state.workspaces.currentWorkspace,
    workspaceEditMode: state.workspaces.editMode,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(DescriptionPanel)
);
