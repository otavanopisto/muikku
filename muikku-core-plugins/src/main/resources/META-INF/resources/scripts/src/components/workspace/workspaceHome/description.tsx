import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";

import '~/sass/elements/panel.scss';
import '~/sass/elements/item-list.scss';
import '~/sass/elements/material-page.scss';
import '~/sass/elements/material-admin.scss';

import MaterialLoader from "~/components/base/material-loader";
import { MaterialLoaderEditorButtonSet } from "~/components/base/material-loader/editor-buttonset";
import { MaterialLoaderTitle } from "~/components/base/material-loader/title";
import { MaterialLoaderContent } from "~/components/base/material-loader/content";
import { MaterialLoaderProducersLicense } from "~/components/base/material-loader/producers-license";

interface DescriptionPanelProps {
  status: StatusType,
  workspace: WorkspaceType,
  i18n: i18nType,
  isInFrontPage? : boolean
}

interface DescriptionPanelState {

}

class DescriptionPanel extends React.Component<DescriptionPanelProps, DescriptionPanelState> {
  render(){

    return <div className="panel panel--workspace-description">
      <div className="panel__header">
        <div className="panel__header-icon panel__header-icon--workspace-description icon-books"></div>
        <div className="panel__header-title">{this.props.i18n.text.get('plugin.workspace.index.descriptionTitle')}</div>
      </div>
      <div className="panel__body">
        {this.props.workspace && <MaterialLoader editable={this.props.status.permissions.WORKSPACE_MANAGE_WORKSPACE}
          modifiers="workspace-description" material={this.props.workspace.contentDescription} workspace={this.props.workspace}
          canDelete={false} canHide={false} canPublish disablePlugins readOnly isInFrontPage>
          {(props, state, stateConfiguration) => {
            return <div>
              <MaterialLoaderEditorButtonSet {...props} {...state}/>
              <MaterialLoaderTitle {...props} {...state}/>
              <MaterialLoaderContent {...props} {...state} stateConfiguration={stateConfiguration}/>
              <MaterialLoaderProducersLicense {...props} {...state}/>
            </div>
          }}  
        </MaterialLoader>}
      </div>
    </div>;
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DescriptionPanel);