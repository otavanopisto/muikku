import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";

import '~/sass/elements/panel.scss';
import '~/sass/elements/item-list.scss';
import Button from "~/components/general/button";

interface ManagementPanelProps {
  status: StatusType,
  workspace: WorkspaceType,
  i18n: i18nType
}

interface ManagementPanelState {
  workspaceName: string
}

class ManagementPanel extends React.Component<ManagementPanelProps, ManagementPanelState> {
  constructor(props: ManagementPanelProps){
    super(props);
    
    this.state = {
      workspaceName: props.workspace && props.workspace.name
    }
    
    this.updateWorkspaceName = this.updateWorkspaceName.bind(this);
  }
  componentWillReceiveProps(nextProps: ManagementPanelProps){
    this.setState({
      workspaceName: nextProps.workspace && nextProps.workspace.name
    });
  }
  updateWorkspaceName(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({
      workspaceName: e.target.value
    });
  }
  render(){
    return (<div className="panel panel--workspace-Management">
      <div className="panel__header">
        <div className="panel__header-icon panel__header-icon--workspace-description icon-books"></div>
        <div className="panel__header-title">{this.props.i18n.text.get("plugin.workspace.management.pageTitle")}</div>
      </div>
      <div className="panel__body">
        <section>
          <input type="text" className="form-element form-element__input"
            value={this.state.workspaceName || ""} onChange={this.updateWorkspaceName}/>
          <Button buttonModifiers="management">{this.props.i18n.text.get("plugin.workspace.management.viewInPyramus")}</Button>
          <Button buttonModifiers="management">{this.props.i18n.text.get("plugin.workspace.management.copyWorkspace")}</Button>
        </section>
        <section>
          <h2>{this.props.i18n.text.get("plugin.workspace.management.imageSectionTitle")}</h2>
        </section>
        <section>
          <h2>{this.props.i18n.text.get("plugin.workspace.management.settingsSectionTitle")}</h2>
        </section>
        <section>
          <h2>{this.props.i18n.text.get("plugin.workspace.management.additionalInfoSectionTitle")}</h2>
        </section>
        <section>
          <h2>{this.props.i18n.text.get("plugin.workspace.management.workspaceLicenceSectionTitle")}</h2>
        </section>
        <section>
          <h2>{this.props.i18n.text.get("plugin.workspace.management.workspaceProducersSectionTitle")}</h2>
        </section>
        <section>
          <h2>{this.props.i18n.text.get("plugin.workspace.index.descriptionTitle")}</h2>
        </section>
      </div>
    </div>);
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
)(ManagementPanel);