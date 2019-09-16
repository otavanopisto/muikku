import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { CopyWizardStoreType, CopyWizardStoreUpdateType } from "./";
import CKEditor from "~/components/general/ckeditor";

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
    
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
  }
  onDescriptionChange(text: string){
    this.props.updateStore({
      description: text
    });
  }
  render(){
    return <div className="wizard__content">
      <label>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceExtension.label")}</label>
      <CKEditor width="100%"
        onChange={this.onDescriptionChange}>{this.props.getStore().description}</CKEditor>
    </div>;
  }
}