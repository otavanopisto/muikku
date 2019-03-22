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
    
    this.updateNameExtension = this.updateNameExtension.bind(this);
    this.updateName = this.updateName.bind(this);
  }
  updateNameExtension(e: React.ChangeEvent<HTMLInputElement>){
    this.props.updateStore({
      nameExtension: e.target.value || null
    });
  }
  updateName(e: React.ChangeEvent<HTMLInputElement>) {
    this.props.updateStore({
      name: e.target.value
    });
  }
  render(){
    return <div>
      <h3>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceName.label")}</h3>
      <input className="form-element" value={this.props.getStore().name} onChange={this.updateName}/>
      <h3>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceExtension.label")}</h3>
      <input className="form-element" value={this.props.getStore().nameExtension || ""} onChange={this.updateNameExtension}/>
    </div>;
  }
}