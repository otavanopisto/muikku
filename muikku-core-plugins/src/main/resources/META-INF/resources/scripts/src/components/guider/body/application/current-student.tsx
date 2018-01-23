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

interface CurrentStudentProps {
  i18n: i18nType,
  guiderStudentsCurrent: GuiderStudentUserProfileType,
  guiderCurrentState: GuiderCurrentStudentStateType
}

interface CurrentStudentState {
}

class CurrentStudent extends React.Component<CurrentStudentProps, CurrentStudentState> {
  constructor(props: CurrentStudentProps){
    super(props);
  }
  render(){
    if (this.props.guiderStudentsCurrent === null){
      return null;
    }
    
    //Note that some properties are not available until later, that's because it does
    //step by step loading, make sure to show this in the way this is represented, ensure to have
    //a case where the property is not available
    //You can use the cheat && after the property
    //eg. guiderStudentsCurrent.property && guiderStudentsCurrent.property.useSubProperty
    
   
  
     /* 
     */  
    //This is ugly and raw
    //TODO: Ukkonen make it pretty"firstName":"Jari","lastName":"Ahokas","nickName":null,"studyProgrammeName":"y","hasImage":false,"nationality":null,"language":null,"municipality":null,"school":null,"email":"ja...@gmail.com","studyStartDate":"2012-07-11T21:00:00.000+0000","studyEndDate":null,"studyTimeEnd":null,"curriculumIdentifier":null,"updatedByStudent":false,"flags":null}
    return <div className="application-list__item application-list__item--guider-current-student">
      <div className="TODO">
        {this.props.guiderStudentsCurrent.basic && <div>
           <object className="container container--profile-image"
            data={getUserImageUrl(this.props.guiderStudentsCurrent.basic.userEntityId)}
            type="image/jpeg">
             <div className={`application-list__item-content-avatar`}>{this.props.guiderStudentsCurrent.basic.firstName[0]}</div>
           </object>
           <div className="TODO">{getName(this.props.guiderStudentsCurrent.basic)}</div>
        </div>}
        {this.props.guiderStudentsCurrent.labels && this.props.guiderStudentsCurrent.labels.map((label: GuiderStudentUserProfileLabelType)=>{
          return <div key={label.id}>
            <span style={{color: label.flagColor}}>ICON</span>
            <span>{label.flagName}</span>
          </div>
        })}
      </div>
      <div className="TODO this is the container that has the basic info, should maybe make a flexbox?">
        {this.props.guiderStudentsCurrent.basic && <div>
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
        </div>}
      </div>
      <div>
        
      </div>
      {this.props.guiderCurrentState === "LOADING" ? <div className="application-list__item loader-empty"/> : null}
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