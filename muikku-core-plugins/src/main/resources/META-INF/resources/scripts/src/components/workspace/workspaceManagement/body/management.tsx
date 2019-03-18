import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { WorkspaceType, WorkspaceAccessType, WorkspaceTypeType, WorkspaceProducerType, WorkspaceUpdateType, WorkspaceDetailsType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import Button, { ButtonPill } from "~/components/general/button";
import moment from "~/lib/moment";
import DatePicker from "react-datepicker";
import CKEditor from "~/components/general/ckeditor";

import '~/sass/elements/panel.scss';
import '~/sass/elements/item-list.scss';
import { LicenseSelector } from "~/components/general/license-selector";
import UploadImageDialog from '../dialogs/upload-image';

interface ManagementPanelProps {
  status: StatusType,
  workspace: WorkspaceType,
  i18n: i18nType,
  workspaceTypes: Array<WorkspaceTypeType>
}

interface ManagementPanelState {
  workspaceName: string,
  workspacePublished: boolean,
  workspaceAccess: WorkspaceAccessType,
  workspaceExtension: string,
  workspaceType: string,
  workspaceStartDate: any,
  workspaceEndDate: any,
  workspaceProducers: Array<WorkspaceProducerType>,
  workspaceDescription: string,
  workspaceLicense: string,
  workspaceHasCustomImage: boolean,
  
  currentWorkspaceProducerInputValue: string,
  newWorkspaceImageSrc?: string,
  newWorkspaceImageFile?: File,
  newWorkspaceImageB64?: string,
  newWorkspaceImageCombo?: {
    file?: File,
    originalB64?: string,
    croppedB64: string
  },
  isImageDialogOpen: boolean,
}

class ManagementPanel extends React.Component<ManagementPanelProps, ManagementPanelState> {
  constructor(props: ManagementPanelProps){
    super(props);
    
    this.state = {
      workspaceName: props.workspace ? props.workspace.name : null,
      workspacePublished: props.workspace ? props.workspace.published : null,
      workspaceAccess: props.workspace ? props.workspace.access : null,
      workspaceExtension: props.workspace ? props.workspace.nameExtension : null,
      workspaceType: props.workspace && props.workspace.details ? props.workspace.details.typeId : null,
      workspaceStartDate: props.workspace && props.workspace.details ? moment(props.workspace.details.beginDate) : null,
      workspaceEndDate: props.workspace && props.workspace.details ? moment(props.workspace.details.endDate) : null,
      workspaceProducers: props.workspace && props.workspace.producers ? props.workspace.producers : null,
      workspaceDescription: props.workspace ? props.workspace.description || "" : "",
      workspaceLicense: props.workspace ? props.workspace.materialDefaultLicense : "",
      workspaceHasCustomImage: props.workspace ? props.workspace.hasCustomImage : false,
      currentWorkspaceProducerInputValue: "",
      isImageDialogOpen: false
    }
    
    this.updateWorkspaceName = this.updateWorkspaceName.bind(this);
    this.setWorkspacePublishedTo = this.setWorkspacePublishedTo.bind(this);
    this.setWorkspaceAccessTo = this.setWorkspaceAccessTo.bind(this);
    this.updateWorkspaceType = this.updateWorkspaceType.bind(this);
    this.updateStartDate = this.updateStartDate.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.updateCurrentWorkspaceProducerInputValue = this.updateCurrentWorkspaceProducerInputValue.bind(this);
    this.updateLicense = this.updateLicense.bind(this);
    this.removeCustomImage = this.removeCustomImage.bind(this);
    this.readNewImage = this.readNewImage.bind(this);
    this.acceptNewImage = this.acceptNewImage.bind(this);
    this.editCurrentImage = this.editCurrentImage.bind(this);
    this.checkIfEnterKeyIsPressedAndAddProducer = this.checkIfEnterKeyIsPressedAndAddProducer.bind(this);
    this.save = this.save.bind(this);
  }
  componentWillReceiveProps(nextProps: ManagementPanelProps){
    this.setState({
      workspaceName: nextProps.workspace ? nextProps.workspace.name : null,
      workspacePublished: nextProps.workspace ? nextProps.workspace.published : null,
      workspaceAccess: nextProps.workspace ? nextProps.workspace.access : null,
      workspaceExtension: nextProps.workspace ? nextProps.workspace.nameExtension : null,
      workspaceType: nextProps.workspace && nextProps.workspace.details ? nextProps.workspace.details.typeId : null,
      workspaceStartDate: nextProps.workspace && nextProps.workspace.details ? moment(nextProps.workspace.details.beginDate) : null,
      workspaceEndDate: nextProps.workspace && nextProps.workspace.details ? moment(nextProps.workspace.details.endDate) : null,
      workspaceProducers: nextProps.workspace && nextProps.workspace.producers ? nextProps.workspace.producers : null,
      workspaceLicense: nextProps.workspace ? nextProps.workspace.materialDefaultLicense : "",
      workspaceDescription: nextProps.workspace ? nextProps.workspace.description || "" : "",
      workspaceHasCustomImage: nextProps.workspace ? nextProps.workspace.hasCustomImage : false,
    });
  }
  updateWorkspaceName(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({
      workspaceName: e.target.value
    });
  }
  setWorkspacePublishedTo(value: boolean){
    this.setState({
      workspacePublished: value
    });
  }
  setWorkspaceAccessTo(value: WorkspaceAccessType){
    this.setState({
      workspaceAccess: value
    });
  }
  updateWorkspaceExtension(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({
      workspaceExtension: e.target.value
    });
  }
  updateWorkspaceType(e: React.ChangeEvent<HTMLSelectElement>){
    this.setState({
      workspaceType: e.target.value
    });
  }
  updateStartDate(newDate: any){
    this.setState({
      workspaceStartDate: newDate
    });
  }
  updateEndDate(newDate: any){
    this.setState({
      workspaceEndDate: newDate
    });
  }
  updateCurrentWorkspaceProducerInputValue(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({
      currentWorkspaceProducerInputValue: e.target.value
    });
  }
  checkIfEnterKeyIsPressedAndAddProducer(e: React.KeyboardEvent<HTMLInputElement>){
    if (e.keyCode == 13) {
      this.addProducer(this.state.currentWorkspaceProducerInputValue);
    }
  }
  addProducer(name: string){
    this.setState({
      currentWorkspaceProducerInputValue: "",
      workspaceProducers: [...this.state.workspaceProducers, {
        id: null,
        workspaceEntityId: this.props.workspace.id,
        name
      }]
    });
  }
  removeProducer(index: number){
    this.setState({
      workspaceProducers: this.state.workspaceProducers.filter((p, i)=>i !== index)
    });
  }
  onDescriptionChange(text: string){
    this.setState({
      workspaceDescription: text
    });
  }
  updateLicense(newLicense: string){
    this.setState({
      workspaceLicense: newLicense
    });
  }
  removeCustomImage(){
    this.setState({
      newWorkspaceImageCombo: null,
      workspaceHasCustomImage: false
    });
  }
  readNewImage(e: React.ChangeEvent<HTMLInputElement>){
    let file = e.target.files[0];
    let reader = new FileReader();
    
    e.target.value = "";
    
    reader.addEventListener("load", ()=>{
      this.setState({
        newWorkspaceImageB64: reader.result,
        newWorkspaceImageFile: file,
        isImageDialogOpen: true,
        newWorkspaceImageSrc: null
      })
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }
  editCurrentImage(){
    if (this.state.newWorkspaceImageCombo){
      this.setState({
        newWorkspaceImageSrc: null,
        isImageDialogOpen: true,
        newWorkspaceImageB64: this.state.newWorkspaceImageCombo.originalB64,
        newWorkspaceImageFile: this.state.newWorkspaceImageCombo.file
      });
    } else if (this.props.workspace.hasCustomImage){
      this.setState({
        newWorkspaceImageSrc: `/rest/workspace/workspaces/${this.props.workspace.id}/workspacefile/workspace-frontpage-image-original`,
        isImageDialogOpen: true,
        newWorkspaceImageB64: null,
        newWorkspaceImageFile: null
      });
    }
  }
  acceptNewImage(croppedB64: string, originalB64?: string, file?: File){
    this.setState({
      workspaceHasCustomImage: true,
      newWorkspaceImageCombo: {
        file,
        originalB64,
        croppedB64
      }
    });
  }
  save(){
    let workspaceUpdate:WorkspaceUpdateType = {
      name: this.state.workspaceName,
      published: this.state.workspacePublished,
      access: this.state.workspaceAccess,
      nameExtension: this.state.workspaceExtension,
      materialDefaultLicense: this.state.workspaceLicense,
      description: this.state.workspaceDescription,
      hasCustomImage: this.state.workspaceHasCustomImage
    }
  
    let workspaceDetails:WorkspaceDetailsType = {
      externalViewUrl: this.props.workspace.details.externalViewUrl,
      typeId: this.state.workspaceType,
      beginDate: this.state.workspaceStartDate,
      endDate: this.state.workspaceEndDate
    }
  
    let workspaceMaterialProducers = this.state.workspaceProducers;
  
    let workspaceImage = this.state.newWorkspaceImageCombo;
  }
  render(){
    let actualBackgroundSRC = this.state.workspaceHasCustomImage ? 
      `/rest/workspace/workspaces/${this.props.workspace.id}/workspacefile/workspace-frontpage-image-cropped` :
      "/gfx/workspace-default-header.jpg";
    if (this.state.newWorkspaceImageCombo){
      actualBackgroundSRC = this.state.newWorkspaceImageCombo.croppedB64;
    }
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
          <div>
            <img src={actualBackgroundSRC} onClick={this.editCurrentImage}/>
            <ButtonPill buttonAs="a" icon="edit">
              <input name="file" type="file" accept="image/*" onChange={this.readNewImage}/>
            </ButtonPill>
            {this.state.workspaceHasCustomImage ? <ButtonPill icon="delete" onClick={this.removeCustomImage}/> : null}
            <UploadImageDialog isOpen={this.state.isImageDialogOpen}
             b64={this.state.newWorkspaceImageB64} file={this.state.newWorkspaceImageFile}
             onClose={()=>this.setState({isImageDialogOpen: false})} src={this.state.newWorkspaceImageSrc}
             onImageChange={this.acceptNewImage}/>
          </div>
        </section>
        <section>
          <h2>{this.props.i18n.text.get("plugin.workspace.management.settingsSectionTitle")}</h2>
          <div>
            <div>{this.props.i18n.text.get("plugin.workspace.management.settings.publicity")}</div>
            <div>
              <span className="form-element">
                <input type="radio"
                 checked={this.state.workspacePublished === true}
                 onChange={this.setWorkspacePublishedTo.bind(this, true)}/>
                <label>{this.props.i18n.text.get("plugin.workspace.management.settings.publicity.publish")}</label>
              </span>
              <span className="form-element">
                <input type="radio"
                 checked={this.state.workspacePublished === false}
                 onChange={this.setWorkspacePublishedTo.bind(this, false)}/>
                <label>{this.props.i18n.text.get("plugin.workspace.management.settings.publicity.unpublish")}</label>
              </span>
            </div>
          </div>
          <div>
            <div>{this.props.i18n.text.get("plugin.workspace.management.settings.access")}</div>
            <div>
              <span className="form-element">
                <input type="radio"
                 checked={this.state.workspaceAccess === "MEMBERS_ONLY"}
                 onChange={this.setWorkspaceAccessTo.bind(this, "MEMBERS_ONLY")}/>
                <label>{this.props.i18n.text.get("plugin.workspace.management.settings.access.membersOnly")}</label>
              </span>
              <span className="form-element">
                <input type="radio"
                 checked={this.state.workspaceAccess === "LOGGED_IN"}
                 onChange={this.setWorkspaceAccessTo.bind(this, "LOGGED_IN")}/>
                <label>{this.props.i18n.text.get("plugin.workspace.management.settings.access.loggedIn")}</label>
              </span>
              <span className="form-element">
                <input type="radio"
                 checked={this.state.workspaceAccess === "ANYONE"}
                 onChange={this.setWorkspaceAccessTo.bind(this, "ANYONE")}/>
                <label>{this.props.i18n.text.get("plugin.workspace.management.settings.access.anyone")}</label>
              </span>
            </div>
          </div>
        </section>
        <section>
          <h2>{this.props.i18n.text.get("plugin.workspace.management.additionalInfoSectionTitle")}</h2>
          <div>
            <div>{this.props.i18n.text.get("plugin.workspace.management.additionalInfo.nameExtension")}</div>
            <input type="text" className="form-element form-element__input"
             value={this.state.workspaceExtension || ""} onChange={this.updateWorkspaceExtension}/>
          </div>
          <div>
            <div>{this.props.i18n.text.get("plugin.workspace.management.additionalInfo.courseType")}</div>
            <select className="form-element" value={this.state.workspaceType || ""} onChange={this.updateWorkspaceType}>
              {this.props.workspaceTypes && this.props.workspaceTypes.map(type=>
                <option key={type.identifier} value={type.identifier}>{type.name}</option>
              )}
            </select>
          </div>
          <div>
            <div>{this.props.i18n.text.get("plugin.workspace.management.additionalInfo.startDate")}</div>
            <DatePicker className="form-element__input" onChange={this.updateStartDate}
              maxDate={this.state.workspaceEndDate}
              locale={this.props.i18n.time.getLocale()} selected={this.state.workspaceStartDate}/>
          </div>
          <div>
            <div>{this.props.i18n.text.get("plugin.workspace.management.additionalInfo.endDate")}</div>
            <DatePicker className="form-element__input" onChange={this.updateEndDate}
              minDate={this.state.workspaceStartDate}
              locale={this.props.i18n.time.getLocale()} selected={this.state.workspaceEndDate}/>
          </div>
        </section>
        <section> 
          <h2>{this.props.i18n.text.get("plugin.workspace.management.workspaceLicenceSectionTitle")}</h2>
          <LicenseSelector value={this.state.workspaceLicense} onChange={this.updateLicense} i18n={this.props.i18n}/>
        </section>
        <section>
          <h2>{this.props.i18n.text.get("plugin.workspace.management.workspaceProducersSectionTitle")}</h2>
          <input type="text" className="form-element form-element__input"
            value={this.state.currentWorkspaceProducerInputValue} onChange={this.updateCurrentWorkspaceProducerInputValue}
            onKeyUp={this.checkIfEnterKeyIsPressedAndAddProducer}/>
          <Button onClick={this.addProducer.bind(this, this.state.currentWorkspaceProducerInputValue)}>
            {this.props.i18n.text.get("TODO Add workspace producer")}
          </Button>
          <div>
            {this.state.workspaceProducers && this.state.workspaceProducers.map((producer, index) => {
              return <span className="" key={index}>
                {producer.name}
                <ButtonPill icon="close" onClick={this.removeProducer.bind(this, index)}/>
              </span>
            })}
          </div>
        </section>
        <section>
          <h2>{this.props.i18n.text.get("plugin.workspace.index.descriptionTitle")}</h2>
          <CKEditor width="100%" height="210"
            onChange={this.onDescriptionChange}>{this.state.workspaceDescription}</CKEditor>
        </section>
      </div>
      <div className="panel__footer">
        <Button onClick={this.save}>{this.props.i18n.text.get("plugin.workspace.management.workspaceButtons.save")}</Button>
      </div>
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    workspaceTypes: state.workspaces.types,
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