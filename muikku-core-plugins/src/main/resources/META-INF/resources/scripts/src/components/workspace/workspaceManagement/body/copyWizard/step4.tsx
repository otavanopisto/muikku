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
    
    this.toggleCopyMaterials = this.toggleCopyMaterials.bind(this);
    this.toggleCopyBackgroundPicture = this.toggleCopyBackgroundPicture.bind(this);
    this.toggleCopyDiscussionAreas = this.toggleCopyDiscussionAreas.bind(this);
  }
  toggleCopyMaterials(){
    this.props.updateStore({
      copyMaterials: this.props.getStore().copyMaterials === "NO" ? "CLONE" : "NO"
    });
  }
  toggleCopyBackgroundPicture(){
    this.props.updateStore({
      copyBackgroundPicture: !this.props.getStore().copyBackgroundPicture
    });
  }
  toggleCopyDiscussionAreas(){
    this.props.updateStore({
      copyDiscussionAreas: !this.props.getStore().copyDiscussionAreas
    });
  }
  render(){
    return <div>
      <h3>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceOtherSettings.label")}</h3>
      
      <h4>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceMaterials.label")}</h4>
      <input type="checkbox" className="form-field" onChange={this.toggleCopyMaterials} checked={this.props.getStore().copyMaterials !== "NO"}/>
      <h4>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceFiles.label")}</h4>
      <input type="checkbox" className="form-field" onChange={this.toggleCopyBackgroundPicture} checked={this.props.getStore().copyBackgroundPicture}/>
      <h4>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceDiscussionsAreas.label")}</h4>
      <input type="checkbox" className="form-field" onChange={this.toggleCopyDiscussionAreas} checked={this.props.getStore().copyDiscussionAreas}/>
    </div>;
  }
}