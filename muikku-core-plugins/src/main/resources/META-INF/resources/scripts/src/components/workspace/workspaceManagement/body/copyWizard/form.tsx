import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { CopyWizardStoreType, CopyWizardStoreUpdateType } from "./";
import DatePicker from "react-datepicker";
import CKEditor from "~/components/general/ckeditor";
import '~/sass/elements/form-elements.scss';
import '~/sass/elements/form.scss';


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
    this.updateStartDate = this.updateStartDate.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
    this.updateNameExtension = this.updateNameExtension.bind(this);
    this.updateName = this.updateName.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.toggleCopyMaterials = this.toggleCopyMaterials.bind(this);
    this.toggleCopyBackgroundPicture = this.toggleCopyBackgroundPicture.bind(this);
    this.toggleCopyDiscussionAreas = this.toggleCopyDiscussionAreas.bind(this);
    this.switchBetweenCloneAndLink = this.switchBetweenCloneAndLink.bind(this);
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
  updateStartDate(newDate: any){
    this.props.updateStore({
      beginDate: newDate
    });
  }
  updateEndDate(newDate: any){
    this.props.updateStore({
      endDate: newDate
    });
  } 
  onDescriptionChange(text: string){
    this.props.updateStore({
      description: text
    });
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
  switchBetweenCloneAndLink() {
    this.props.updateStore({
      copyMaterials: this.props.getStore().copyMaterials === "CLONE" ? "LINK" : "CLONE"
    });
  }

  render(){

    const copyMaterials = this.props.getStore().copyMaterials !== "NO" ? 
    <div className="form__row--wizard">
      <div className="form-element form-element--wizard">
        <label>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceMaterials.copyMaterials.label")}</label>
        <input type="radio" name="workspace-materials-clone-or-link"
        onChange={this.switchBetweenCloneAndLink} checked={this.props.getStore().copyMaterials === "CLONE"}/>
      </div>
      <div className="form-element form-element--wizard">
        <label>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceMaterials.linkMaterials.label")}</label>
        <input type="radio" name="workspace-materials-clone-or-link" 
      onChange={this.switchBetweenCloneAndLink} checked={this.props.getStore().copyMaterials === "LINK"}/>
      </div>
    </div> : null;


    
    return <div className="wizard__content form">
      <div className="form__row form__row--wizard">
        <div className="form-element form-element--wizard">
          <label>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceName.label")}</label>
          <input className="form-element__input" value={this.props.getStore().name} onChange={this.updateName}/>
        </div>
        <div className="form-element form-element--wizard">
          <label>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceExtension.label")}</label>
          <input className="form-element__input" value={this.props.getStore().nameExtension || ""} onChange={this.updateNameExtension}/>
        </div>
        <div className="form-element form-element--wizard">
          <label>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceStartDate.label")}</label>
          <DatePicker className="form-element__input" onChange={this.updateStartDate}
            maxDate={this.props.getStore().endDate}
            locale={this.props.i18n.time.getLocale()} selected={this.props.getStore().beginDate}/>
         </div>
        <div className="form-element form-element--wizard">
          <label>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceEndDate.label")}</label>
          <DatePicker className="form-element__input" onChange={this.updateEndDate}
            minDate={this.props.getStore().beginDate}
            locale={this.props.i18n.time.getLocale()} selected={this.props.getStore().endDate}/>
        </div>
      </div>
      <div className="form__row">    
        <label>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceExtension.label")}</label>
        <CKEditor width="100%"
          onChange={this.onDescriptionChange}>{this.props.getStore().description}</CKEditor>
      </div>
      <header>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceOtherSettings.label")}</header>
      <div className="form__row form__row--wizard">
        <div className="form-element form-element--wizard">
          <label>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceMaterials.label")}</label>
          <input type="checkbox" className="form-element" onChange={this.toggleCopyMaterials} checked={this.props.getStore().copyMaterials !== "NO"}/>
        </div>
        <div className="form-element form-element--wizard">
          <label>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceFiles.label")}</label>
          <input type="checkbox" className="form-element" onChange={this.toggleCopyBackgroundPicture} checked={this.props.getStore().copyBackgroundPicture}/>
        </div>
        <div className="form-element form-element--wizard">
          <label>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceDiscussionsAreas.label")}</label>
          <input type="checkbox" className="form-element" onChange={this.toggleCopyDiscussionAreas} checked={this.props.getStore().copyDiscussionAreas}/>
        </div>
      </div>
      {copyMaterials}
      

    </div>;
  }
}