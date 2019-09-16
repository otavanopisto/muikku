import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { CopyWizardStoreType, CopyWizardStoreUpdateType } from "./";
import { CopyCurrentWorkspaceStepType } from "~/actions/workspaces";
import Button from "~/components/general/button";

interface StepProps {
  workspace: WorkspaceType,
  i18n: i18nType,
  getStore: ()=>CopyWizardStoreType,
  updateStore: (u: CopyWizardStoreUpdateType) => any,
  onDone: ()=>any,
  resultingWorkspace?: WorkspaceType,
  step?: CopyCurrentWorkspaceStepType
}

interface StepState {
  
}

export default class Step extends React.Component<StepProps, StepState> {
  constructor(props: StepProps) {
    super(props);
  }
  render(){
    const copyMaterials = this.props.getStore().copyMaterials;
    const beginDate = this.props.getStore().beginDate;
    const endDate = this.props.getStore().endDate;
    const nameExtension = this.props.getStore().nameExtension;
    return <div className="wizard__content">
      <h3>{this.props.i18n.text.get("plugin.workspacecopywizard.summaryPage.title")}</h3>
      
      <div>
        <h4>{this.props.i18n.text.get("plugin.workspacecopywizard.doCopyButton.label")}</h4>
        <p>{this.props.i18n.text.get(
           nameExtension ?
           "plugin.workspacecopywizard.summarySteps.copyWorkspaceName" :
           "plugin.workspacecopywizard.summarySteps.copyWorkspaceNameWithExtension", this.props.getStore().name, nameExtension
        )}</p>
      </div>
      <div>
        <h4>{this.props.i18n.text.get("TODO Dates (this time they show even if they haven't been changed because we support null dates")}</h4>
        <p>{this.props.i18n.text.get("plugin.workspacecopywizard.summarySteps.changeDatesBeginDate",
          beginDate ? this.props.i18n.time.format(beginDate) : this.props.i18n.text.get("TODO NONE"))}</p>
        <p>{this.props.i18n.text.get("plugin.workspacecopywizard.summarySteps.changeDatesEndDate",
          endDate ? this.props.i18n.time.format(endDate) : this.props.i18n.text.get("TODO NONE"))}</p>
      </div>
      {this.props.getStore().copyDiscussionAreas ? <div>
        <h4>{this.props.i18n.text.get("plugin.workspacecopywizard.summarySteps.copyDiscussionAreas")}</h4>
      </div> : null}
      {copyMaterials !== "NO" ? <div>
        <h4>
          {
            this.props.i18n.text.get(copyMaterials === "CLONE" ?
            "plugin.workspacecopywizard.summarySteps.copyMaterials" :
            "plugin.workspacecopywizard.summarySteps.copyMaterialsLink")
          }
         </h4>
      </div> : null}
      {this.props.getStore().copyBackgroundPicture ? <div>
        <h4>{this.props.i18n.text.get("plugin.workspacecopywizard.summarySteps.copyFiles")}</h4>
       </div> : null}
      
      {this.props.step === "done" && this.props.resultingWorkspace ? <div>
        <Button onClick={this.props.onDone}>{this.props.i18n.text.get("plugin.workspacecopywizard.closeWizardButton.label")}</Button>
        <p>{this.props.i18n.text.get("plugin.workspacecopywizard.or.label ")}</p>
        <Button href={`/workspace/${this.props.resultingWorkspace.urlName}`} to={`/workspace/${this.props.resultingWorkspace.urlName}`}>
          {this.props.i18n.text.get("plugin.workspacecopywizard.gotToWorkspaceMuikkuButton.label")}
        </Button>
        <Button href={this.props.resultingWorkspace.details.externalViewUrl} openInNewTab="_blank">
          {this.props.i18n.text.get("plugin.workspacecopywizard.gotToWorkspacePyramusButton.label")}
        </Button>
      </div> : null}
    </div>;
  }
}