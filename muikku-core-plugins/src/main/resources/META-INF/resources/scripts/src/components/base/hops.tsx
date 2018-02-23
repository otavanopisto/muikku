import * as React from "react";

import '~/sass/elements/hops.scss';
import { i18nType } from "~/reducers/base/i18n";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { HOPSDataType } from "~/reducers/main-function/hops";

interface HopsProps {
  data?: HOPSDataType,
  defaultData?: HOPSDataType,
  i18n: i18nType,
  editable: boolean
}

interface HopsState {
  
}

class Hops extends React.Component<HopsProps, HopsState> {
  constructor(props: HopsProps){
    super(props);
    
    this.state = {
    }
  }
  
  //TODO: this was stolen from the dust template, please replace all the classNames, these are for just reference
  //I don't want this file to become too complex, remember anyway that I will be splitting all these into simpler components
  //later once a pattern is defined
  render(){
    let hops = this.props.data || this.props.defaultData;
    return <div className="gt-user-hops mf-widget flex-row">
      <div className="hops-form-wrapper lg-flex-cell-full md-flex-cell-full sm-flex-cell-full mf-item">
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>{this.props.i18n.text.get( "plugin.records.hops.goals.upperSecondary" )}</label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {this.props.i18n.text.get( "plugin.records.hops.goals." + hops.goalSecondarySchoolDegree )}
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>{this.props.i18n.text.get( "plugin.records.hops.goals.matriculationExam" )}</label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {this.props.i18n.text.get( "plugin.records.hops.goals." + hops.goalMatriculationExam )}
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>
              {this.props.i18n.text.get( "plugin.records.hops.goals.vocationalYears1" )}
              <span>{hops.vocationalYears}</span>
              {this.props.i18n.text.get( "plugin.records.hops.goals.vocationalYears2" )}
            </label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {this.props.i18n.text.get( "plugin.records.hops.goals." + hops.goalJustMatriculationExam )}
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>
              {this.props.i18n.text.get( "plugin.records.hops.goals.justTransferCredits1" )}
              <span>{hops.transferCreditYears}</span>
              {this.props.i18n.text.get( "plugin.records.hops.goals.justTransferCredits2" )}
            </label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {this.props.i18n.text.get( "plugin.records.hops.goals." + hops.justTransferCredits )}
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-16 md-flex-cell-16 sm-flex-cell-16">
            <label>
              {this.props.i18n.text.get( "plugin.records.hops.goals.completionYears1" )}
              <span>{hops.completionYears}</span>
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
              hops.finnish === "AI" ?
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
                hops.german ?
                  this.props.i18n.text.get( "plugin.records.hops.goals.yes" ) :
                  this.props.i18n.text.get( "plugin.records.hops.goals.no" )
              }</span>
            </div>
            <div>
              <label>{this.props.i18n.text.get( "plugin.records.hops.languages.french" )}</label>
              <span>{
                hops.french ?
                  this.props.i18n.text.get( "plugin.records.hops.goals.yes" ) :
                  this.props.i18n.text.get( "plugin.records.hops.goals.no" )
              }</span>
            </div>
            <div>
              <label>{this.props.i18n.text.get( "plugin.records.hops.languages.italian" )}</label>
              <span>{
                hops.italian ?
                  this.props.i18n.text.get( "plugin.records.hops.goals.yes" ) :
                  this.props.i18n.text.get( "plugin.records.hops.goals.no" )
              }</span>
            </div>
            <div>
              <label>{this.props.i18n.text.get( "plugin.records.hops.languages.spanish" )}</label>
              <span>{
                hops.spanish ?
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
            {this.props.i18n.text.get( "plugin.records.hops.mathSyllabus." + hops.mathSyllabus )}
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>{this.props.i18n.text.get( "plugin.records.hops.science.title" )}</label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {this.props.i18n.text.get( "plugin.records.hops.science." + hops.science )}
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>{this.props.i18n.text.get( "plugin.records.hops.religion.title" )}</label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {this.props.i18n.text.get( "plugin.records.hops.religion." + hops.religion )}
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>{this.props.i18n.text.get( "plugin.records.hops.additionalInfo.title" )}</label>
            <p>{hops.additionalInfo}</p>
          </div>
        </div>
      </div>
    </div>
  }
}
            
function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    defaultData: state.hops.value
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(Hops);