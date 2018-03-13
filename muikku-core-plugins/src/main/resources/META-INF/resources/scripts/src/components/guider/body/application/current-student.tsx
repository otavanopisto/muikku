import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';

import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/link.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/application-sub-panel.scss';
import '~/sass/elements/avatar.scss';
import { GuiderCurrentStudentStateType, GuiderStudentUserProfileType, GuiderStudentUserProfileLabelType, GuiderStudentUserFileType } from '~/reducers/main-function/guider/guider-students';
import { getUserImageUrl, getName } from '~/util/modifiers';
import Vops from '~/components/base/vops';

import Workspaces from './current-student/workspaces';
import FileUploader from '~/components/general/file-uploader';
import { AddFileToCurrentStudentTriggerType, RemoveFileFromCurrentStudentTriggerType,
  addFileToCurrentStudent, removeFileFromCurrentStudent} from '~/actions/main-function/guider/guider-students';
import { displayNotification, DisplayNotificationTriggerType } from '~/actions/base/notifications';

interface CurrentStudentProps {
  i18n: i18nType,
  guiderStudentsCurrent: GuiderStudentUserProfileType,
  guiderCurrentState: GuiderCurrentStudentStateType,
  addFileToCurrentStudent: AddFileToCurrentStudentTriggerType,
  removeFileFromCurrentStudent: RemoveFileFromCurrentStudentTriggerType,
  displayNotification: DisplayNotificationTriggerType
}

interface CurrentStudentState {
}

class CurrentStudent extends React.Component<CurrentStudentProps, CurrentStudentState> {
  constructor(props: CurrentStudentProps){
    super(props);
  }
  
  //TODO doesn't anyone notice that nor assesment requested, nor no passed courses etc... is available in this view
  render(){
    if (this.props.guiderStudentsCurrent === null){
      return null;
    }
    
    //Note that some properties are not available until later, that's because it does
    //step by step loading, make sure to show this in the way this is represented, ensure to have
    //a case where the property is not available
    //You can use the cheat && after the property
    //eg. guiderStudentsCurrent.property && guiderStudentsCurrent.property.useSubProperty
        
    
    let studentBasicHeader = this.props.guiderStudentsCurrent.basic && <div className="application-sub-panel__header">
        <object
         data={getUserImageUrl(this.props.guiderStudentsCurrent.basic.userEntityId)}
         type="image/jpeg">
          <div className={`avatar avatar--category-1`}>{this.props.guiderStudentsCurrent.basic.firstName[0]}</div>
        </object>
        <div className="text text--guider-profile-student-name">{getName(this.props.guiderStudentsCurrent.basic)}</div>
        {this.props.guiderStudentsCurrent.emails && <div className="text text--guider-profile-student-mail">
          {this.props.guiderStudentsCurrent.emails.length ? this.props.guiderStudentsCurrent.emails.map((email)=>{
            return(             
                <span>{email.defaultAddress ? email.address : this.props.i18n.text.get("plugin.guider.user.details.label.unknown.email")}</span>
            )
          }): null}        
        </div>}
        <div className="text text--list-item-type-title">
           Linja
        </div>
      </div>
   
    let studentLabels = this.props.guiderStudentsCurrent.labels && this.props.guiderStudentsCurrent.labels.map((label: GuiderStudentUserProfileLabelType)=>{
      return <div className="application-sub-panel__item--label" key={label.id}>
        <span className="icon-flag" style={{color: label.flagColor}}></span>
        <span className="text">{label.flagName}</span>
      </div>
    });
    
    let studentBasicInfo = this.props.guiderStudentsCurrent.basic && <div className="container container--student-info application-sub-panel__body--basic-info text">
      <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.guider.user.details.label.studyStartDateTitle")}</span>
        <span><span className="text text--guider-profile-value">{this.props.i18n.time.format(this.props.guiderStudentsCurrent.basic.studyStartDate)}</span></span>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.guider.user.details.label.studyEndDateTitle")}</span>
        <span><span className="text text--guider-profile-value">{this.props.i18n.time.format(this.props.guiderStudentsCurrent.basic.studyEndDate)}</span></span>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.guider.user.details.label.studyTimeEndTitle")}</span>
        <span><span className="text text--guider-profile-value">{this.props.i18n.time.format(this.props.guiderStudentsCurrent.basic.studyTimeEnd)}</span></span>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.guider.user.details.label.nationality")}</span>
        <span><span className="text text--guider-profile-value">{this.props.guiderStudentsCurrent.basic.nationality || this.props.i18n.text.get("plugin.guider.user.details.label.unknown.nationality")}</span></span>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.guider.user.details.label.language")}</span>
        <span><span className="text text--guider-profile-value">{this.props.guiderStudentsCurrent.basic.language || this.props.i18n.text.get("plugin.guider.user.details.label.unknown.language")}</span></span>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.guider.user.details.label.municipality")}</span>
        <span><span className="text text--guider-profile-value">{this.props.guiderStudentsCurrent.basic.municipality || this.props.i18n.text.get("plugin.guider.user.details.label.unknown.municipality")}</span></span>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.guider.user.details.label.school")}</span>
        <span><span className="text text--guider-profile-value">{this.props.guiderStudentsCurrent.basic.school || this.props.i18n.text.get("plugin.guider.user.details.label.unknown.school")}</span></span>
      </div>
      {this.props.guiderStudentsCurrent.lastLogin && <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.guider.user.details.label.lastLogin")}</span>
        <span><span className="text text--guider-profile-value">{this.props.guiderStudentsCurrent.lastLogin.time}</span></span>
      </div>}
      {this.props.guiderStudentsCurrent.emails && <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.guider.user.details.label.email")}</span>
        {this.props.guiderStudentsCurrent.emails.length ? this.props.guiderStudentsCurrent.emails.map((email)=>{
          return <span key={email.address}>
            <span className="text text--guider-profile-value">{email.type} - {email.address}
              {email.defaultAddress ? `(${this.props.i18n.text.get("plugin.guider.user.details.label.emailDefault")})` : null}
            </span>
          </span>
        }) : this.props.i18n.text.get("plugin.guider.user.details.label.unknown.email")}
      </div>}
      {this.props.guiderStudentsCurrent.phoneNumbers && <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.guider.user.details.label.phoneNumber")}</span>
        {this.props.guiderStudentsCurrent.phoneNumbers.length ? this.props.guiderStudentsCurrent.phoneNumbers.map((phone)=>{
          return <span key={phone.number}>
            <span className="text text--guider-profile-value">{phone.type} - {phone.number}
              {phone.defaultNumber ? `(${this.props.i18n.text.get("plugin.guider.user.details.label.phoneNumberDefault")})` : null}
            </span>
          </span>
        }) : <span>
              <span className="text text--guider-profile-value">{this.props.i18n.text.get("plugin.guider.user.details.label.unknown.phoneNumber")}</span>
             </span> }
      </div>}
    </div>
      
    //TODO: this was stolen from the dust template, please replace all the classNames, these are for just reference
    //I don't want this file to become too complex, remember anyway that I will be splitting all these into simpler components
    //later once a pattern is defined
    
     let studentHops = this.props.guiderStudentsCurrent.hops && <div className="text application-sub-panel__body">

        <div className="application-sub-panel__item application-sub-panel__item--guider-hops">
          <span>
            {this.props.i18n.text.get( "plugin.records.hops.goals.upperSecondary" )}
          </span>
          <span>
            <span className="text text--guider-profile-value">
              {this.props.i18n.text.get( "plugin.records.hops.goals." + this.props.guiderStudentsCurrent.hops.goalSecondarySchoolDegree )}
            </span>
          </span>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--guider-hops">
          <span>
            {this.props.i18n.text.get( "plugin.records.hops.goals.matriculationExam" )}
          </span>
          <span>
            <span className="text text--guider-profile-value">
              {this.props.i18n.text.get( "plugin.records.hops.goals." + this.props.guiderStudentsCurrent.hops.goalMatriculationExam )}
            </span>
          </span>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--guider-hops">
          <span>
              {this.props.i18n.text.get( "plugin.records.hops.goals.vocationalYears1" )}
              <span className="text text--guider-hops-value">{this.props.guiderStudentsCurrent.hops.vocationalYears}</span>
              {this.props.i18n.text.get( "plugin.records.hops.goals.vocationalYears2" )}
          </span>
          <span>
            <span  className="text text--guider-profile-value">  
              {this.props.i18n.text.get( "plugin.records.hops.goals." + this.props.guiderStudentsCurrent.hops.goalJustMatriculationExam )}
            </span>
          </span>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--guider-hops">
          <span>
              {this.props.i18n.text.get( "plugin.records.hops.goals.justTransferCredits1" )}
              <span className="text text--guider-hops-value">{this.props.guiderStudentsCurrent.hops.transferCreditYears}</span>
              {this.props.i18n.text.get( "plugin.records.hops.goals.justTransferCredits2" )}
          </span>
          <span>
            <span className="text text--guider-profile-value">
              {this.props.i18n.text.get( "plugin.records.hops.goals." + this.props.guiderStudentsCurrent.hops.justTransferCredits )}
            </span>
          </span>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--guider-hops">
          <span>
              {this.props.i18n.text.get( "plugin.records.hops.goals.completionYears1" )}
              <span className="text text--guider-hops-value">{this.props.guiderStudentsCurrent.hops.completionYears}</span>
              {this.props.i18n.text.get( "plugin.records.hops.goals.completionYears2" )}
          </span>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--guider-hops">
          <span>
              {this.props.i18n.text.get( "plugin.records.hops.languages.mandatory.title" )}
          </span>
          <span>
            <span className="text text--guider-profile-value">{
              this.props.guiderStudentsCurrent.hops.finnish === "AI" ?
                this.props.i18n.text.get( "plugin.records.hops.languages.finnish.native" ) :
                this.props.i18n.text.get( "plugin.records.hops.languages.finnish.foreign" )
            }</span>
          </span>
        </div>
        <div>
          <span className="application-sub-panel__item application-sub-panel__item--guider-hops">
            {this.props.i18n.text.get( "plugin.records.hops.languages.mandatory.additionalInfo" )}
          </span>
        </div>            
        <div className="application-sub-panel__item application-sub-panel__item--guider-hops">
          <span>
            {this.props.i18n.text.get( "plugin.records.hops.languages.optional.title" )}
          </span>
          <span>
            <span>
            {this.props.guiderStudentsCurrent.hops.german ?
              <span className="text text--guider-profile-value">
                {this.props.i18n.text.get( "plugin.records.hops.languages.german" )}
              </span>: null}
            </span>
            {this.props.guiderStudentsCurrent.hops.french ?
            <span>
              <span className="text text--guider-profile-value">
                {this.props.i18n.text.get( "plugin.records.hops.languages.french" )}
              </span>
            </span> : null}
            {this.props.guiderStudentsCurrent.hops.italian ?
            <span>
              <span  className="text text--guider-profile-value">
                {this.props.i18n.text.get( "plugin.records.hops.languages.italian" )}                
               </span>
            </span> : null}
            {this.props.guiderStudentsCurrent.hops.spanish ?            
            <span>
              <span className="text text--guider-profile-value">
                {this.props.i18n.text.get( "plugin.records.hops.languages.spanish" )}                
              </span>
            </span>: null}
          </span>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--guider-hops">
          <span>
            {this.props.i18n.text.get( "plugin.records.hops.mathSyllabus.title" )}
          </span>
          <span>            
            <span className="text text--guider-profile-value">
            {this.props.i18n.text.get( "plugin.records.hops.mathSyllabus." + this.props.guiderStudentsCurrent.hops.mathSyllabus )}
            </span>
          </span>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--guider-hops">
          <span>
            {this.props.i18n.text.get( "plugin.records.hops.science.title" )}
          </span>
          <span>
            <span className="text text--guider-profile-value">
              {this.props.i18n.text.get( "plugin.records.hops.science." + this.props.guiderStudentsCurrent.hops.science )}
            </span>
          </span>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--guider-hops">
          <span>
            {this.props.i18n.text.get( "plugin.records.hops.religion.title" )}
          </span>
          <span>
            <span className="text text--guider-profile-value">
              {this.props.i18n.text.get( "plugin.records.hops.religion." + this.props.guiderStudentsCurrent.hops.religion )}
            </span>
          </span>
        </div>
        {this.props.guiderStudentsCurrent.hops.additionalInfo ? 
          <div className="application-sub-panel__item application-sub-panel__item--guider-hops">
            <span>
              {this.props.i18n.text.get( "plugin.records.hops.additionalInfo.title" )}
              <span className="text text--guider-profile-value">
                {this.props.guiderStudentsCurrent.hops.additionalInfo}
              </span>
            </span>
          </div>
        : null}              
    </div>
    
    //I placed the VOPS in an external file already you can follow it, this is because
    //it is very clear
    let studentVops = this.props.guiderStudentsCurrent.vops && <Vops data={this.props.guiderStudentsCurrent.vops}></Vops>
  
    let studentWorkspaces = <Workspaces/>;
    
    let files = this.props.guiderStudentsCurrent.basic && <div className="application-sub-panel__item-body">
      <FileUploader url="/transcriptofrecordsfileupload/" targetUserIdentifier={this.props.guiderStudentsCurrent.basic.id}
        onFileError={(file: File, err: Error)=>{
          this.props.displayNotification(err.message, "error");
        }} onFileSuccess={(file: File, data: GuiderStudentUserFileType)=>{
          this.props.addFileToCurrentStudent(data);
        }}>
        <span>{this.props.i18n.text.get("plugin.guider.user.details.files.hint")}</span>
      </FileUploader>
      {this.props.guiderStudentsCurrent.files && (this.props.guiderStudentsCurrent.files.length ?
        <div className="text application-sub-panel__file-container application-list">
          {this.props.guiderStudentsCurrent.files.map((file)=>{
            return <Link key={file.id} href={`/rest/guider/files/${file.id}/content`} openInNewTab={file.title}>
              {file.title}
              <Link disablePropagation onClick={this.props.removeFileFromCurrentStudent.bind(null, file)}>{
                this.props.i18n.text.get("plugin.guider.user.details.files.file.remove")
              }</Link>
            </Link>
          })}
        </div> :
        <div className="text application-sub-panel__file-container">{
          this.props.i18n.text.get("plugin.guider.user.details.files.empty")
        }</div>
      )}
    </div>
    

    return <div className="">
      <div className="application-sub-panel">
        {studentBasicHeader}
        <div className="application-sub-panel__body--labels">
          {studentLabels}
        </div>
      </div>
      <div className="application-sub-panel">
        {studentBasicInfo}
      </div>
      <div className="application-sub-panel">
        <div className="application-sub-panel__header text text--guider-header">{this.props.i18n.text.get("plugin.guider.user.details.hops")}</div>        
        {studentHops}
      </div>
      <div className="application-sub-panel">
        {studentVops}  
      </div>
       <div className="application-sub-panel">
        <div className="application-sub-panel__header text text--guider-header">{this.props.i18n.text.get("plugin.guider.user.details.workspaces")}</div>
        {studentWorkspaces}
      </div>
      <div className="application-sub-panel">
        <div className="application-sub-panel__header text text--guider-header">{this.props.i18n.text.get("plugin.guider.user.details.files")}</div>
        {files}  
      </div>     
      {this.props.guiderCurrentState === "LOADING" ? <div className="application-sub-panel loader-empty"/> : null}
    </div>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    guiderStudentsCurrent: state.guiderStudents.current,
    guiderCurrentState: state.guiderStudents.currentState
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(CurrentStudent);