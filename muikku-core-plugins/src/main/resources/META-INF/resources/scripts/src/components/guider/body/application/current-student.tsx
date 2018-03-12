import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';

import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/link.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/application-list.scss';
import { GuiderCurrentStudentStateType, GuiderStudentUserProfileType, GuiderStudentUserProfileLabelType } from '~/reducers/main-function/guider/guider-students';
import { getUserImageUrl, getName } from '~/util/modifiers';
import Vops from '~/components/base/vops';
import Hops from '~/components/base/hops';

import Workspaces from './current-student/workspaces';
import FileUploader from '~/components/general/file-uploader';
import { AddFileToCurrentStudentTriggerType, RemoveFileFromCurrentStudentTriggerType,
  addFileToCurrentStudent, removeFileFromCurrentStudent} from '~/actions/main-function/guider/guider-students';
import { displayNotification, DisplayNotificationTriggerType } from '~/actions/base/notifications';
import { UserFileType } from '~/reducers/main-function/user-index';
import {StateType} from '~/reducers';

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
    
    let studentBasicHeader = this.props.guiderStudentsCurrent.basic && <div>
      <object className="container container--profile-image"
       data={getUserImageUrl(this.props.guiderStudentsCurrent.basic.userEntityId)}
       type="image/jpeg">
        <div className={`application-list__item-content-avatar`}>{this.props.guiderStudentsCurrent.basic.firstName[0]}</div>
      </object>
      <div className="TODO">{getName(this.props.guiderStudentsCurrent.basic)}</div>
    </div>
   
    let studentLabels = this.props.guiderStudentsCurrent.labels && this.props.guiderStudentsCurrent.labels.map((label: GuiderStudentUserProfileLabelType)=>{
      return <div key={label.id}>
        <span style={{color: label.flagColor}}>ICON</span>
        <span>{label.flagName}</span>
      </div>
    });
    
    let studentBasicInfo = this.props.guiderStudentsCurrent.basic && <div>
      <div>
        <span>{this.props.i18n.text.get("TODO study start date")}</span>
        <span>{this.props.i18n.time.format(this.props.guiderStudentsCurrent.basic.studyStartDate)}</span>
      </div>
      <div>
        <span>{this.props.i18n.text.get("TODO study end date")}</span>
        <span>{this.props.i18n.time.format(this.props.guiderStudentsCurrent.basic.studyEndDate)}</span>
      </div>
      <div>
        <span>{this.props.i18n.text.get("TODO study time end")}</span>
        <span>{this.props.i18n.time.format(this.props.guiderStudentsCurrent.basic.studyTimeEnd)}</span>
      </div>
      <div>
        <span>{this.props.i18n.text.get("TODO Nationality")}</span>
        <span>{this.props.guiderStudentsCurrent.basic.nationality || this.props.i18n.text.get("TODO Unknown Nationality")}</span>
      </div>
      <div>
        <span>{this.props.i18n.text.get("TODO Kieli")}</span>
        <span>{this.props.guiderStudentsCurrent.basic.language || this.props.i18n.text.get("TODO Unknown language")}</span>
      </div>
      <div>
        <span>{this.props.i18n.text.get("TODO kotikunta")}</span>
        <span>{this.props.guiderStudentsCurrent.basic.municipality || this.props.i18n.text.get("TODO Unknown kotikunta")}</span>
      </div>
      <div>
        <span>{this.props.i18n.text.get("TODO koulu")}</span>
        <span>{this.props.guiderStudentsCurrent.basic.school || this.props.i18n.text.get("TODO Unknown Koulu")}</span>
      </div>
      {this.props.guiderStudentsCurrent.lastLogin && <div>
        <span>{this.props.i18n.text.get("TODO last logged in")}</span>
        <span>{this.props.guiderStudentsCurrent.lastLogin.time}</span>
      </div>}
      {this.props.guiderStudentsCurrent.emails && <div>
        <span>{this.props.i18n.text.get("TODO emails")}</span>
        {this.props.guiderStudentsCurrent.emails.length ? this.props.guiderStudentsCurrent.emails.map((email)=>{
          return <span key={email.address}>{email.type} - {email.address}
            {email.defaultAddress ? `(${this.props.i18n.text.get("TODO default")})` : null}
          </span>
        }) : this.props.i18n.text.get("TODO No emails")}
      </div>}
      {this.props.guiderStudentsCurrent.phoneNumbers && <div>
        <span>{this.props.i18n.text.get("TODO phones")}</span>
        {this.props.guiderStudentsCurrent.phoneNumbers.length ? this.props.guiderStudentsCurrent.phoneNumbers.map((phone)=>{
          return <span key={phone.number}>{phone.type} - {phone.number}
            {phone.defaultNumber ? `(${this.props.i18n.text.get("TODO default")})` : null}
          </span>
        }) : this.props.i18n.text.get("TODO No phones")}
      </div>}
    </div>
      
    //TODO: this was stolen from the dust template, please replace all the classNames, these are for just reference
    //I don't want this file to become too complex, remember anyway that I will be splitting all these into simpler components
    //later once a pattern is defined
    let studentHops = this.props.guiderStudentsCurrent.hops && <Hops data={this.props.guiderStudentsCurrent.hops} editable={false}/>
    
    //I placed the VOPS in an external file already you can follow it, this is because
    //it is very clear
    let studentVops = this.props.guiderStudentsCurrent.vops && <Vops data={this.props.guiderStudentsCurrent.vops}></Vops>
  
    let studentWorkspaces = <Workspaces/>;
    
    let files = this.props.guiderStudentsCurrent.basic && <div>
      <FileUploader url="/transcriptofrecordsfileupload/" targetUserIdentifier={this.props.guiderStudentsCurrent.basic.id}
        onFileError={(file: File, err: Error)=>{
          this.props.displayNotification(err.message, "error");
        }} onFileSuccess={(file: File, data: UserFileType)=>{
          this.props.addFileToCurrentStudent(data);
        }}>
        <span>{this.props.i18n.text.get("plugin.guider.user.details.files.hint")}</span>
      </FileUploader>
      {this.props.guiderStudentsCurrent.files && (this.props.guiderStudentsCurrent.files.length ?
        <div>
          {this.props.guiderStudentsCurrent.files.map((file)=>{
            return <Link key={file.id} href={`/rest/guider/files/${file.id}/content`} openInNewTab={file.title}>
              {file.title}
              <Link disablePropagation onClick={this.props.removeFileFromCurrentStudent.bind(null, file)}>{
                this.props.i18n.text.get("plugin.guider.user.details.files.file.remove")
              }</Link>
            </Link>
          })}
        </div> :
        <div>{
          this.props.i18n.text.get("TODO no files")
        }</div>
      )}
    </div>
    
    //This is ugly and raw
    //TODO: Ukkonen make it pretty"firstName":"Jari","lastName":"Ahokas","nickName":null,"studyProgrammeName":"y","hasImage":false,"nationality":null,"language":null,"municipality":null,"school":null,"email":"ja...@gmail.com","studyStartDate":"2012-07-11T21:00:00.000+0000","studyEndDate":null,"studyTimeEnd":null,"curriculumIdentifier":null,"updatedByStudent":false,"flags":null}
    return <div className="application-list__item application-list__item--guider-current-student">
      <div className="TODO">
        {studentBasicHeader}
        {studentLabels}
      </div>
      <div className="TODO this is the container that has the basic info, should maybe make a flexbox?">
        {studentBasicInfo}
      </div>
      <div>
        {studentHops}
      </div>
      <div>
        {studentVops}  
      </div>
      <div>
        {studentWorkspaces}
      </div>
      <div>
        {files}  
      </div>
      {this.props.guiderCurrentState === "LOADING" ? <div className="application-list__item loader-empty"/> : null}
    </div>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    guiderStudentsCurrent: (state as any).guiderStudents.current,
    guiderCurrentState: (state as any).guiderStudents.currentState
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({addFileToCurrentStudent, removeFileFromCurrentStudent, displayNotification}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentStudent);