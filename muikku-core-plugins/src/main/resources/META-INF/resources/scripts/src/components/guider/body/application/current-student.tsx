import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';

import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/link.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/application-sub-panel.scss';
import '~/sass/elements/avatar.scss';
import { GuiderCurrentStudentStateType, GuiderStudentUserProfileType, GuiderStudentUserProfileLabelType } from '~/reducers/main-function/guider/guider-students';
import { getUserImageUrl, getName } from '~/util/modifiers';
import Vops from '~/components/base/vops';

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
      return <div className="application-sub-panel__item" key={label.id}>
        <span style={{color: label.flagColor}}>ICON</span>
        <span>{label.flagName}</span>
      </div>
    });
    
    let studentBasicInfo = this.props.guiderStudentsCurrent.basic && <div className="container container--student-info application-sub-panel__body text">
      <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.guider.user.details.label.studyStartDateTitle")}</span>
        <span><span className="text text--guider-basic-info-value">{this.props.i18n.time.format(this.props.guiderStudentsCurrent.basic.studyStartDate)}</span></span>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.guider.user.details.label.studyEndDateTitle")}</span>
        <span><span className="text text--guider-basic-info-value">{this.props.i18n.time.format(this.props.guiderStudentsCurrent.basic.studyEndDate)}</span></span>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.guider.user.details.label.studyTimeEndTitle")}</span>
        <span><span className="text text--guider-basic-info-value">{this.props.i18n.time.format(this.props.guiderStudentsCurrent.basic.studyTimeEnd)}</span></span>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.guider.user.details.label.nationality")}</span>
        <span><span className="text text--guider-basic-info-value">{this.props.guiderStudentsCurrent.basic.nationality || this.props.i18n.text.get("plugin.guider.user.details.label.unknown.nationality")}</span></span>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.guider.user.details.label.language")}</span>
        <span><span className="text text--guider-basic-info-value">{this.props.guiderStudentsCurrent.basic.language || this.props.i18n.text.get("plugin.guider.user.details.label.unknown.language")}</span></span>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.guider.user.details.label.municipality")}</span>
        <span><span className="text text--guider-basic-info-value">{this.props.guiderStudentsCurrent.basic.municipality || this.props.i18n.text.get("plugin.guider.user.details.label.unknown.municipality")}</span></span>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.guider.user.details.label.school")}</span>
        <span><span className="text text--guider-basic-info-value">{this.props.guiderStudentsCurrent.basic.school || this.props.i18n.text.get("plugin.guider.user.details.label.unknown.school")}</span></span>
      </div>
      {this.props.guiderStudentsCurrent.lastLogin && <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.guider.user.details.label.lastLogin")}</span>
        <span><span className="text text--guider-basic-info-value">{this.props.guiderStudentsCurrent.lastLogin.time}</span></span>
      </div>}
      {this.props.guiderStudentsCurrent.emails && <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.guider.user.details.label.email")}</span>
        {this.props.guiderStudentsCurrent.emails.length ? this.props.guiderStudentsCurrent.emails.map((email)=>{
          return <span key={email.address}>
            <span className="text text--guider-basic-info-value">{email.type} - {email.address}
              {email.defaultAddress ? `(${this.props.i18n.text.get("plugin.guider.user.details.label.emailDefault")})` : null}
            </span>
          </span>
        }) : this.props.i18n.text.get("plugin.guider.user.details.label.unknown.email")}
      </div>}
      {this.props.guiderStudentsCurrent.phoneNumbers && <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.guider.user.details.label.phoneNumber")}</span>
        {this.props.guiderStudentsCurrent.phoneNumbers.length ? this.props.guiderStudentsCurrent.phoneNumbers.map((phone)=>{
          return <span key={phone.number}>
            <span className="text text--guider-basic-info-value">{phone.type} - {phone.number}
              {phone.defaultNumber ? `(${this.props.i18n.text.get("plugin.guider.user.details.label.phoneNumberDefault")})` : null}
            </span>
          </span>
        }) : <span>
              <span className="text text--guider-basic-info-value">{this.props.i18n.text.get("plugin.guider.user.details.label.unknown.phoneNumber")}</span>
             </span> }
      </div>}
    </div>
      
    //TODO: this was stolen from the dust template, please replace all the classNames, these are for just reference
    //I don't want this file to become too complex, remember anyway that I will be splitting all these into simpler components
    //later once a pattern is defined
    let studentHops = this.props.guiderStudentsCurrent.hops && <div className="gt-user-hops mf-widget flex-row">
      <div className="hops-form-wrapper lg-flex-cell-full md-flex-cell-full sm-flex-cell-full mf-item">
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>{this.props.i18n.text.get( "plugin.records.hops.goals.upperSecondary" )}</label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {this.props.i18n.text.get( "plugin.records.hops.goals." + this.props.guiderStudentsCurrent.hops.goalSecondarySchoolDegree )}
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>{this.props.i18n.text.get( "plugin.records.hops.goals.matriculationExam" )}</label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {this.props.i18n.text.get( "plugin.records.hops.goals." + this.props.guiderStudentsCurrent.hops.goalMatriculationExam )}
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>
              {this.props.i18n.text.get( "plugin.records.hops.goals.vocationalYears1" )}
              <span>{this.props.guiderStudentsCurrent.hops.vocationalYears}</span>
              {this.props.i18n.text.get( "plugin.records.hops.goals.vocationalYears2" )}
            </label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {this.props.i18n.text.get( "plugin.records.hops.goals." + this.props.guiderStudentsCurrent.hops.goalJustMatriculationExam )}
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>
              {this.props.i18n.text.get( "plugin.records.hops.goals.justTransferCredits1" )}
              <span>{this.props.guiderStudentsCurrent.hops.transferCreditYears}</span>
              {this.props.i18n.text.get( "plugin.records.hops.goals.justTransferCredits2" )}
            </label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {this.props.i18n.text.get( "plugin.records.hops.goals." + this.props.guiderStudentsCurrent.hops.justTransferCredits )}
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-16 md-flex-cell-16 sm-flex-cell-16">
            <label>
              {this.props.i18n.text.get( "plugin.records.hops.goals.completionYears1" )}
              <span>{this.props.guiderStudentsCurrent.hops.completionYears}</span>
              {this.props.i18n.text.get( "plugin.records.hops.goals.completionYears2" )}
            </label>
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>{this.props.i18n.text.get( "plugin.records.hops.languages.mandatory.title" )}</label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            <span>{
              this.props.guiderStudentsCurrent.hops.finnish === "AI" ?
                this.props.i18n.text.get( "plugin.records.hops.languages.finnish.native" ) :
                this.props.i18n.text.get( "plugin.records.hops.languages.finnish.foreign" )
            }</span>
          </div>
          <p>{this.props.i18n.text.get( "plugin.records.hops.languages.mandatory.additionalInfo" )}</p>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>{this.props.i18n.text.get( "plugin.records.hops.languages.optional.title" )}</label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            <br />
            <div>
              <label>{this.props.i18n.text.get( "plugin.records.hops.languages.german" )}</label>
              <span>{
                this.props.guiderStudentsCurrent.hops.german ?
                  this.props.i18n.text.get( "plugin.records.hops.goals.yes" ) :
                  this.props.i18n.text.get( "plugin.records.hops.goals.no" )
              }</span>
            </div>
            <div>
              <label>{this.props.i18n.text.get( "plugin.records.hops.languages.french" )}</label>
              <span>{
                this.props.guiderStudentsCurrent.hops.french ?
                  this.props.i18n.text.get( "plugin.records.hops.goals.yes" ) :
                  this.props.i18n.text.get( "plugin.records.hops.goals.no" )
              }</span>
            </div>
            <div>
              <label>{this.props.i18n.text.get( "plugin.records.hops.languages.italian" )}</label>
              <span>{
                this.props.guiderStudentsCurrent.hops.italian ?
                  this.props.i18n.text.get( "plugin.records.hops.goals.yes" ) :
                  this.props.i18n.text.get( "plugin.records.hops.goals.no" )
              }</span>
            </div>
            <div>
              <label>{this.props.i18n.text.get( "plugin.records.hops.languages.spanish" )}</label>
              <span>{
                this.props.guiderStudentsCurrent.hops.spanish ?
                  this.props.i18n.text.get( "plugin.records.hops.goals.yes" ) :
                  this.props.i18n.text.get( "plugin.records.hops.goals.no" )
              }</span>
            </div>
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>{this.props.i18n.text.get( "plugin.records.hops.mathSyllabus.title" )}</label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {this.props.i18n.text.get( "plugin.records.hops.mathSyllabus." + this.props.guiderStudentsCurrent.hops.mathSyllabus )}
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>{this.props.i18n.text.get( "plugin.records.hops.science.title" )}</label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {this.props.i18n.text.get( "plugin.records.hops.science." + this.props.guiderStudentsCurrent.hops.science )}
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>{this.props.i18n.text.get( "plugin.records.hops.religion.title" )}</label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {this.props.i18n.text.get( "plugin.records.hops.religion." + this.props.guiderStudentsCurrent.hops.religion )}
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>{this.props.i18n.text.get( "plugin.records.hops.additionalInfo.title" )}</label>
            <p>{this.props.guiderStudentsCurrent.hops.additionalInfo}</p>
          </div>
        </div>
      </div>
    </div>
    
    //I placed the VOPS in an external file already you can follow it, this is because
    //it is very clear
    let studentVops = this.props.guiderStudentsCurrent.vops && <Vops data={this.props.guiderStudentsCurrent.vops}></Vops>
  

    return <div className="">
      <div className="application-sub-panel">
        {studentBasicHeader}
        <div className="application-sub-panel__body">
          {studentLabels}
        </div>
      </div>
      <div className="application-sub-panel">
        {studentBasicInfo}
      </div>
      <div className="application-sub-panel">
        {studentHops}
      </div>
      <div className="application-sub-panel">
        {studentVops}  
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