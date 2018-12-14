import * as React from "react";

import '~/sass/elements/hops.scss';
import { i18nType } from "~/reducers/base/i18n";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { HOPSDataType } from "~/reducers/main-function/hops";
import { StateType } from '~/reducers';

interface HopsProps {
  data?: HOPSDataType,
  defaultData: HOPSDataType,
  onHopsChange?: ( hops: HOPSDataType ) => any,
  i18n: i18nType
}

interface HopsState {
  hops: HOPSDataType
}

class Hops extends React.Component<HopsProps, HopsState> {
  constructor( props: HopsProps ) {
    super( props );

    this.set = this.set.bind( this );
    this.setFromEventValue = this.setFromEventValue.bind( this );

    this.state = {
      hops: props.data || props.defaultData
    }
  }
  
  set( property: string, value: any ) {
    let nProp: any = {};
    nProp[property] = value || null;
    let nval = Object.assign( {}, this.state.hops, nProp );
    this.props.onHopsChange && this.props.onHopsChange( nval );

    this.setState( {
      hops: nval
    } );
  }

  setFromEventValue( property: string, e: React.ChangeEvent<HTMLInputElement> ) {
    return this.set( property, e.target.value );
  }

  componentWillReceiveProps( nextProps: HopsProps ) {
    let nextData = nextProps.data || nextProps.defaultData;
    if ( nextData !== this.state.hops ) {
      this.setState( { hops: nextData } );
    }
  }

  render() {
    let data = this.props.data || this.props.defaultData;
    if (!data || !data.optedIn){
      return null;
    }
    return <div className="application-sub-panel text">
    
    <div className="application-sub-panel__header application-sub-panel__header--studies-hops">{this.props.i18n.text.get("plugin.records.hops.title")}</div>  
    <div className="application-sub-panel__body">

      <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
        <div className="application-sub-panel__item-title">
          {this.props.i18n.text.get( "plugin.records.hops.goals.upperSecondary" )}
        </div>    
        <div className="application-sub-panel__item-data form-element">
          {["yes", "no", "maybe"].map( ( option: string ) => {
              let onEvent = this.set.bind( this, "goalSecondarySchoolDegree", option );
              return <div className="form-element__radio-option-container" key={option}>
                <input type="radio" value={option} checked={this.state.hops.goalSecondarySchoolDegree === option}
                  onChange={onEvent} />
                <label onClick={onEvent}>{this.props.i18n.text.get( "plugin.records.hops.goals." + option )}</label>
              </div>
            } )}
        </div>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
        <div className="application-sub-panel__item-title">
          {this.props.i18n.text.get( "plugin.records.hops.goals.matriculationExam" )}
        </div>
        <div className="application-sub-panel__item-data form-element">
          {["yes", "no", "maybe"].map( ( option: string ) => {
              let onEvent = this.set.bind( this, "goalMatriculationExam", option );
              return <div className="form-element__radio-option-container" key={option}>
                <input type="radio" value={option} checked={this.state.hops.goalMatriculationExam === option}
                  onChange={onEvent} />
                <label onClick={onEvent}>{this.props.i18n.text.get( "plugin.records.hops.goals." + option )}</label>
              </div>
            })}
        </div>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
        <div className="application-sub-panel__item-title form-element">
          {this.props.i18n.text.get( "plugin.records.hops.goals.vocationalYears1" )}
            <select className="form-element__select form-element__select--hops-selector" value={this.state.hops.vocationalYears || ""} onChange={this.setFromEventValue.bind( this, "vocationalYears" )}>
              <option disabled value="">{this.props.i18n.text.get( "plugin.records.hops.selectAnOption" )}</option>
              {["1", "2", "2,5", "3", "4", "5", "6", "7", "8", "9", "10"].map( ( numba ) => {
                return <option key={numba} value={numba}>{numba}</option>
              } )}
            </select>
          {this.props.i18n.text.get( "plugin.records.hops.goals.vocationalYears2" )}
        </div>
        <div className="application-sub-panel__item-data form-element">
          {["yes", "no"].map( ( option: string ) => {
            let onEvent = this.set.bind( this, "goalJustMatriculationExam", option );
            return <div className="form-element__radio-option-container" key={option}>
              <input type="radio" value={option} checked={this.state.hops.goalJustMatriculationExam === option}
                onChange={onEvent} />
              <label onClick={onEvent}>{this.props.i18n.text.get( "plugin.records.hops.goals." + option )}</label>
            </div>
          } )}
        </div>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
        <div className="application-sub-panel__item-title form-element">
          {this.props.i18n.text.get( "plugin.records.hops.goals.justTransferCredits1" )}
            <select className="form-element__select form-element__select--hops-selector" value={this.state.hops.transferCreditYears || ""} onChange={this.setFromEventValue.bind( this, "transferCreditYears" )}>
              <option disabled value="">{this.props.i18n.text.get( "plugin.records.hops.selectAnOption" )}</option>
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map( ( numba ) => {
                return <option key={numba} value={numba}>{numba}</option>
              } )}
            </select>
          {this.props.i18n.text.get( "plugin.records.hops.goals.justTransferCredits2" )}
        </div>
        <div className="application-sub-panel__item-data form-element">
            {["yes", "no"].map( ( option: string ) => {
              let onEvent = this.set.bind( this, "justTransferCredits", option );
              return <div className="form-element__radio-option-container" key={option}>
                <input type="radio" value={option} checked={this.state.hops.justTransferCredits === option}
                  onChange={onEvent} />
                <label onClick={onEvent}>{this.props.i18n.text.get( "plugin.records.hops.goals." + option )}</label>
              </div>
            } )}
        </div>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
        <div className="application-sub-panel__item-title form-element">
          {this.props.i18n.text.get( "plugin.records.hops.goals.completionYears1" )}
            <select className="form-element__select form-element__select--hops-selector" value={this.state.hops.completionYears || ""} onChange={this.setFromEventValue.bind( this, "completionYears" )}>
              <option disabled value="">{this.props.i18n.text.get( "plugin.records.hops.selectAnOption" )}</option>
              {["1", "2", "3", "4"].map( ( numba ) => {
                return <option key={numba} value={numba}>{numba}</option>
              } )}
            </select>
          {this.props.i18n.text.get( "plugin.records.hops.goals.completionYears2" )}
        </div>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
        <div className="application-sub-panel__item-title">
          {this.props.i18n.text.get( "plugin.records.hops.languages.mandatory.title" )}
        </div>
        <div className="application-sub-panel__item-data form-element">
            {["AI", "S2"].map( ( option: string ) => {
              let onEvent = this.set.bind( this, "finnish", option );
              const nativity: any = { "AI": "native", "S2": "foreign" };
              return <div className="form-element__radio-option-container" key={option}>
                <input type="radio" value={option} checked={this.state.hops.finnish === option}
                  onChange={onEvent} />
                <label onClick={onEvent}>{this.props.i18n.text.get( "plugin.records.hops.languages.finnish." + nativity[option] )}</label>
              </div>
            } )}
        </div>
      </div>          
      <div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
          {this.props.i18n.text.get( "plugin.records.hops.languages.mandatory.additionalInfo" )}
        </div>
      </div>          
      <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
        <div className="application-sub-panel__item-title">
          {this.props.i18n.text.get( "plugin.records.hops.languages.optional.title" )}
        </div>
        <div className="application-sub-panel__item-data form-element">
          <div className="form-element__check-option-container">
            <label>{this.props.i18n.text.get( "plugin.records.hops.languages.german" )}</label>
            <span>
              <input type="checkbox" checked={this.state.hops.german} onChange={this.set.bind( this, "german", !this.state.hops.german )} />
            </span>
          </div>
          <div className="form-element__check-option-container">
            <label>{this.props.i18n.text.get( "plugin.records.hops.languages.french" )}</label>
            <span>
              <input type="checkbox" checked={this.state.hops.french} onChange={this.set.bind( this, "french", !this.state.hops.french )} />
            </span>
          </div>
          <div className="form-element__check-option-container">
            <label>{this.props.i18n.text.get( "plugin.records.hops.languages.italian" )}</label>
            <span>
              <input type="checkbox" checked={this.state.hops.italian} onChange={this.set.bind( this, "italian", !this.state.hops.italian )} />
            </span>
          </div>
          <div className="form-element__check-option-container">
            <label>{this.props.i18n.text.get( "plugin.records.hops.languages.spanish" )}</label>            
            <span>
              <input type="checkbox" checked={this.state.hops.spanish} onChange={this.set.bind( this, "spanish", !this.state.hops.spanish )} />
            </span>
          </div>
        </div>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
        <div className="application-sub-panel__item-title">
          {this.props.i18n.text.get( "plugin.records.hops.mathSyllabus.title" )}
        </div>
        <div className="application-sub-panel__item-data form-element">
          {["MAA", "MAB"].map( ( option: string ) => {
            let onEvent = this.set.bind( this, "mathSyllabus", option );
            return <div className="form-element__radio-option-container" key={option}>
              <input type="radio" value={option} checked={this.state.hops.mathSyllabus === option}
                onChange={onEvent} />
              <label onClick={onEvent}>{this.props.i18n.text.get( "plugin.records.hops.mathSyllabus." + option )}</label>
            </div>
          } )}
        </div>
          
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
        <div className="application-sub-panel__item-title">
          {this.props.i18n.text.get( "plugin.records.hops.science.title" )}
        </div>          
        <div className="application-sub-panel__item-data form-element">
          {["BI", "FY", "KE", "GE"].map( ( option: string ) => {
            let onEvent = this.set.bind( this, "science", option );
            return <div className="form-element__radio-option-container" key={option}>
              <input type="radio" value={option} checked={this.state.hops.science === option}
                onChange={onEvent} />
              <label onClick={onEvent}>{this.props.i18n.text.get( "plugin.records.hops.science." + option )}</label>
            </div>
          } )}
        </div>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
        <div className="application-sub-panel__item-title">
          {this.props.i18n.text.get( "plugin.records.hops.religion.title" )}
        </div>
        <div className="application-sub-panel__item-data form-element">
          {["UE", "ET", "UX"].map( ( option: string ) => {
            let onEvent = this.set.bind( this, "religion", option );
            return <div className="form-element__radio-option-container" key={option}>
              <input type="radio" value={option} checked={this.state.hops.religion === option}
                onChange={onEvent} />
              <label onClick={onEvent}>{this.props.i18n.text.get( "plugin.records.hops.religion." + option )}</label>
            </div>
          } )}
        </div>
      </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
          <div className="application-sub-panel__item-title">
            {this.props.i18n.text.get( "plugin.records.hops.additionalInfo.title" )}
          </div>
          <div className="application-sub-panel__item-data form-element">
            <textarea className="form-element__textarea" onChange={this.setFromEventValue.bind( this, "additionalInfo" )} value={this.state.hops.additionalInfo || ""} />
          </div>
      </div>
    </div>
    </div>
  }
}

function mapStateToProps( state: StateType ) {
  return {
    i18n: state.i18n,
    defaultData: state.hops && state.hops.value
  }
};

function mapDispatchToProps( dispatch: Dispatch<any> ) {
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Hops );