import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { WorkspaceType, WorkspaceEditModeStateType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";

import '~/sass/elements/panel.scss';
import '~/sass/elements/item-list.scss';
import MaterialLoader from "~/components/base/material-loader";
import { MaterialLoaderContent } from "~/components/base/material-loader/content";
import { MaterialLoaderEditorButtonSet } from "~/components/base/material-loader/editor-buttonset";
import { MaterialLoaderTitle } from "~/components/base/material-loader/title";
import { MaterialLoaderProducersLicense } from "~/components/base/material-loader/producers-license";

interface HelpPanelProps {
  workspaceEditMode: WorkspaceEditModeStateType,
  workspace: WorkspaceType,
  i18n: i18nType
}

interface HelpPanelState {

}

class HelpPanel extends React.Component<HelpPanelProps, HelpPanelState> {
  render(){
    return (<div className="application-panel-wrapper">
      <div className="application-panel application-panel--workspace-guide">
        <div className="application-panel__container">
          <div className="application-panel__header"> 
            <h2 className="application-panel__header-title">{this.props.i18n.text.get("plugin.workspace.helpPage.title")}</h2>
          </div>
          <div className="application-panel__body">
            {this.props.workspace && <MaterialLoader editable={this.props.workspaceEditMode.active}
              modifiers="workspace-help" material={this.props.workspace.help} workspace={this.props.workspace}
              canDelete={false} canHide={false} disablePlugins
              readOnly>
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
        </div>
      </div>
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    workspaceEditMode: state.workspaces.editMode,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HelpPanel);