import * as React from "react";

import '~/sass/elements/hops.scss';
import { i18nType } from "~/reducers/base/i18n";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { HOPSDataType } from "~/reducers/main-function/hops";

interface HopsProps {
  data?: HOPSDataType,
  defaultData?: HOPSDataType,
  onHopsChange?: (hops:HOPSDataType)=>any,
  i18n: i18nType,
  editable: boolean
}

interface HopsState {
  hops: HOPSDataType
}

class Hops extends React.Component<HopsProps, HopsState> {
  constructor(props: HopsProps){
    super(props);
    
    this.set = this.set.bind(this);
    this.setFromEventValue = this.setFromEventValue.bind(this);
    
    this.state = {
      hops: props.data || props.defaultData
    }
  }
  
  set(property:string, value:any){
    let nProp:any = {};
    nProp[property] = value;
    let nval = Object.assign({}, this.state.hops, nProp);
    this.props.onHopsChange && this.props.onHopsChange(nval);
    
    this.setState({
      hops: nval
    });
  }
  
  setFromEventValue(property:string, e: React.ChangeEvent<HTMLInputElement>){
    return this.set(property, e.target.value);
  }
  
  componentWillReceiveProps(nextProps: HopsProps){
    let nextData = nextProps.data || nextProps.defaultData;
    if (nextData !== this.state.hops){
      this.setState({hops: nextData});
    }
  }
  
  //TODO: this was stolen from the dust template, please replace all the classNames, these are for just reference
  //I don't want this file to become too complex, remember anyway that I will be splitting all these into simpler components
  //later once a pattern is defined
  render(){
    return <div className="gt-user-hops mf-widget flex-row">
      <div className="hops-form-wrapper lg-flex-cell-full md-flex-cell-full sm-flex-cell-full mf-item">
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>{this.props.i18n.text.get("plugin.records.hops.goals.upperSecondary")}</label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {!this.props.editable ?
              //NON EDITABLE FORM
              this.props.i18n.text.get( "plugin.records.hops.goals." + this.state.hops.goalSecondarySchoolDegree) :
                
              //EDITABLE FORM
              ["yes", "no", "maybe"].map((option:string)=>{
                let onEvent = this.set.bind(this, "goalSecondarySchoolDegree", option);
                return <div key={option}>
                  <input type="radio" value={option} checked={this.state.hops.goalSecondarySchoolDegree === option}
                   onChange={onEvent}/>
                  <label onClick={onEvent}>{this.props.i18n.text.get("plugin.records.hops.goals." + option)}</label>
                </div>
              })
            }
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>{this.props.i18n.text.get( "plugin.records.hops.goals.matriculationExam" )}</label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {!this.props.editable ?
              this.props.i18n.text.get( "plugin.records.hops.goals." + this.state.hops.goalMatriculationExam ) :
              
              //EDITABLE FORM
              ["yes", "no", "maybe"].map((option:string)=>{
                let onEvent = this.set.bind(this, "goalMatriculationExam", option);
                return <div key={option}>
                  <input type="radio" value={option} checked={this.state.hops.goalMatriculationExam === option}
                   onChange={onEvent}/>
                  <label onClick={onEvent}>{this.props.i18n.text.get("plugin.records.hops.goals." + option)}</label>
                </div>
              })
            }
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>
              {this.props.i18n.text.get( "plugin.records.hops.goals.vocationalYears1" )}
              {!this.props.editable ?
                //Non editable form
                <span>{this.state.hops.vocationalYears}</span> :
                
                //Editable f... 2,5 wot?...
                <select value={this.state.hops.vocationalYears} onChange={this.setFromEventValue.bind(this, "vocationalYears")}>
                  {["1", "2", "2,5", "3", "4", "5", "6", "7", "8", "9", "10"].map((numba)=>{
                    return <option key={numba} value={numba}>{numba}</option>
                  })}  
                </select>
              }
              {this.props.i18n.text.get( "plugin.records.hops.goals.vocationalYears2" )}
            </label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {!this.props.editable ?
                
               //Non editable form
               <span>{this.props.i18n.text.get( "plugin.records.hops.goals." + this.state.hops.goalJustMatriculationExam )}</span> :
                 
               //Editable form
               ["yes", "no"].map((option:string)=>{
                 let onEvent = this.set.bind(this, "goalJustMatriculationExam", option);
                 return <div key={option}>
                   <input type="radio" value={option} checked={this.state.hops.goalJustMatriculationExam === option}
                    onChange={onEvent}/>
                   <label onClick={onEvent}>{this.props.i18n.text.get("plugin.records.hops.goals." + option)}</label>
                 </div>
               })
            }
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>
              {this.props.i18n.text.get( "plugin.records.hops.goals.justTransferCredits1" )}
              {!this.props.editable ?
                  //Non editable form
                  <span>{this.state.hops.transferCreditYears}</span> :
                  
                  //Editable form.
                  <select value={this.state.hops.transferCreditYears} onChange={this.setFromEventValue.bind(this, "transferCreditYears")}>
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map((numba)=>{
                      return <option key={numba} value={numba}>{numba}</option>
                    })}  
                  </select>
                }
              {this.props.i18n.text.get( "plugin.records.hops.goals.justTransferCredits2" )}
            </label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {!this.props.editable ?
                  
               //Non editable form
               <span>{this.props.i18n.text.get( "plugin.records.hops.goals." + this.state.hops.justTransferCredits )}</span> :
                    
               //Editable form
               ["yes", "no"].map((option:string)=>{
                 let onEvent = this.set.bind(this, "justTransferCredits", option);
                 return <div key={option}>
                   <input type="radio" value={option} checked={this.state.hops.justTransferCredits === option}
                    onChange={onEvent}/>
                   <label onClick={onEvent}>{this.props.i18n.text.get("plugin.records.hops.goals." + option)}</label>
                 </div>
               })
            }
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-16 md-flex-cell-16 sm-flex-cell-16">
            <label>
              {this.props.i18n.text.get( "plugin.records.hops.goals.completionYears1" )}
              {!this.props.editable ?
                //Non editable form
                <span>{this.state.hops.completionYears}</span> :
                  
                //Editable form.
                <select value={this.state.hops.completionYears} onChange={this.setFromEventValue.bind(this, "completionYears")}>
                  {["1", "2", "3", "4"].map((numba)=>{
                    return <option key={numba} value={numba}>{numba}</option>
                  })}  
                </select>
              }
              {this.props.i18n.text.get( "plugin.records.hops.goals.completionYears2" )}
            </label>
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>{this.props.i18n.text.get( "plugin.records.hops.languages.mandatory.title" )}</label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {!this.props.editable ?
              <span>{
                this.state.hops.finnish === "AI" ?
                  this.props.i18n.text.get( "plugin.records.hops.languages.finnish.native" ) :
                  this.props.i18n.text.get( "plugin.records.hops.languages.finnish.foreign" )
              }</span> :
              ["AI", "S2"].map((option:string)=>{
                let onEvent = this.set.bind(this, "finnish", option);
                const nativity:any = {"AI": "native", "S2": "foreign"};
                return <div key={option}>
                  <input type="radio" value={option} checked={this.state.hops.finnish === option}
                   onChange={onEvent}/>
                  <label onClick={onEvent}>{this.props.i18n.text.get("plugin.records.hops.languages.finnish." + nativity[option])}</label>
                </div>
              })
            }
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
              {!this.props.editable ?
                <span>{
                  this.state.hops.german ?
                    this.props.i18n.text.get( "plugin.records.hops.goals.yes" ) :
                    this.props.i18n.text.get( "plugin.records.hops.goals.no" )
                }</span> :
                <div>
                  <input type="checkbox" checked={this.state.hops.german} onChange={this.set.bind(this, "german", !this.state.hops.german)}/>
                </div>
              }
            </div>
            <div>
              <label>{this.props.i18n.text.get( "plugin.records.hops.languages.french" )}</label>
              {!this.props.editable ?
                <span>{
                  this.state.hops.french ?
                    this.props.i18n.text.get( "plugin.records.hops.goals.yes" ) :
                    this.props.i18n.text.get( "plugin.records.hops.goals.no" )
                }</span> :
                <div>
                  <input type="checkbox" checked={this.state.hops.french} onChange={this.set.bind(this, "french", !this.state.hops.french)}/>
                </div>
              }
            </div>
            <div>
              <label>{this.props.i18n.text.get( "plugin.records.hops.languages.italian" )}</label>
              {!this.props.editable ?
                <span>{
                  this.state.hops.italian ?
                    this.props.i18n.text.get( "plugin.records.hops.goals.yes" ) :
                    this.props.i18n.text.get( "plugin.records.hops.goals.no" )
                }</span> :
                <div>
                  <input type="checkbox" checked={this.state.hops.italian} onChange={this.set.bind(this, "italian", !this.state.hops.italian)}/>
                </div>
              }
            </div>
            <div>
              <label>{this.props.i18n.text.get( "plugin.records.hops.languages.spanish" )}</label>
              {!this.props.editable ?
                <span>{
                  this.state.hops.spanish ?
                    this.props.i18n.text.get( "plugin.records.hops.goals.yes" ) :
                    this.props.i18n.text.get( "plugin.records.hops.goals.no" )
                }</span> :
                <div>
                  <input type="checkbox" checked={this.state.hops.spanish} onChange={this.set.bind(this, "spanish", !this.state.hops.spanish)}/>
                </div>
              }
            </div>
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>{this.props.i18n.text.get("plugin.records.hops.mathSyllabus.title")}</label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {!this.props.editable ?
              <span>{this.props.i18n.text.get( "plugin.records.hops.mathSyllabus." + this.state.hops.mathSyllabus )}</span> :
              ["MAA", "MAB"].map((option:string)=>{
                let onEvent = this.set.bind(this, "mathSyllabus", option);
                return <div key={option}>
                  <input type="radio" value={option} checked={this.state.hops.mathSyllabus === option}
                   onChange={onEvent}/>
                  <label onClick={onEvent}>{this.props.i18n.text.get("plugin.records.hops.mathSyllabus." + this.state.hops.mathSyllabus)}</label>
                </div>
              })
            }
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>{this.props.i18n.text.get( "plugin.records.hops.science.title" )}</label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {!this.props.editable ?
              <span>{this.props.i18n.text.get( "plugin.records.hops.science." + this.state.hops.science )}</span> :
              ["BI", "FY", "KE", "GE"].map((option:string)=>{
                let onEvent = this.set.bind(this, "science", option);
                return <div key={option}>
                  <input type="radio" value={option} checked={this.state.hops.science === option}
                   onChange={onEvent}/>
                  <label onClick={onEvent}>{this.props.i18n.text.get("plugin.records.hops.science." + this.state.hops.science)}</label>
                </div>
              })
            }
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>{this.props.i18n.text.get( "plugin.records.hops.religion.title" )}</label>
          </div>
          <div className="lg-flex-cell-6 md-flex-cell-6 sm-flex-cell-6">
            {!this.props.editable ?
              <span>{this.props.i18n.text.get( "plugin.records.hops.religion." + this.state.hops.religion )}</span> :
              ["UE", "ET", "UX"].map((option:string)=>{
                let onEvent = this.set.bind(this, "religion", option);
                return <div key={option}>
                  <input type="radio" value={option} checked={this.state.hops.religion === option}
                   onChange={onEvent}/>
                  <label onClick={onEvent}>{this.props.i18n.text.get("plugin.records.hops.religion." + this.state.hops.religion)}</label>
                </div>
              })
            }
          </div>
        </div>
        <div className="flex-row hops-form-section flex-align-items-center">
          <div className="lg-flex-cell-10 md-flex-cell-10 sm-flex-cell-10">
            <label>{this.props.i18n.text.get( "plugin.records.hops.additionalInfo.title" )}</label>
            {!this.props.editable ? <p>{this.state.hops.additionalInfo}</p> : 
              <textarea onChange={this.setFromEventValue.bind(this, "additionalInfo")} value={this.state.hops.additionalInfo}/>}
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