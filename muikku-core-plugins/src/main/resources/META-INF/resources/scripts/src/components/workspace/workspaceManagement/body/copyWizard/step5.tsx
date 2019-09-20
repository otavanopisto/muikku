import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { CopyWizardStoreType, CopyWizardStoreUpdateType } from "./";

interface StepProps {
  workspace: WorkspaceType,
  i18n: i18nType,
  getStore: ()=>CopyWizardStoreType,
  updateStore: (u: CopyWizardStoreUpdateType) => any
}

interface StepState {
  
}

export default class Step extends React.Component<StepProps, StepState> {
  constructor(props: StepProps) {
    super(props);
    
    this.switchBetweenCloneAndLink = this.switchBetweenCloneAndLink.bind(this);
  }
  switchBetweenCloneAndLink() {
    this.props.updateStore({
      copyMaterials: this.props.getStore().copyMaterials === "CLONE" ? "LINK" : "CLONE"
    });
  }
  render(){
    return <div className="wizard__content">
      <label>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceMaterials.label")}</label>
      
      <label>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceMaterials.copyMaterials.label")}</label>
      <input type="radio" name="workspace-materials-clone-or-link"
        className="form-field" onChange={this.switchBetweenCloneAndLink} checked={this.props.getStore().copyMaterials === "CLONE"}/>
      <label>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceMaterials.linkMaterials.label")}</label>
      <input type="radio" name="workspace-materials-clone-or-link" 
        className="form-field" onChange={this.switchBetweenCloneAndLink} checked={this.props.getStore().copyMaterials === "LINK"}/>
    </div>;
  }
}