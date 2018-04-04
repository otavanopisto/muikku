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
  i18n: i18nType,
  editable: boolean
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

  //TODO: this was stolen from the dust template, please replace all the classNames, these are for just reference
  //I don't want this file to become too complex, remember anyway that I will be splitting all these into simpler components
  //later once a pattern is defined
  render() {
    return <div className="text application-sub-panel__body">

      <div className={`application-sub-panel__item application-sub-panel__item--hops-${this.props.editable ?"editable"  :  "readable"}`}>
        <div>
          {this.props.i18n.text.get( "plugin.records.hops.goals.upperSecondary" )}
        </div>
        <div>
          {["yes", "no", "maybe"].map( ( option: string ) => {
              let onEvent = this.set.bind( this, "goalSecondarySchoolDegree", option );
              return <div className="form-field__radio-option-container" key={option}>
                <input type="radio" value={option} checked={this.state.hops.goalSecondarySchoolDegree === option}
                  onChange={onEvent} />
                <label onClick={onEvent}>{this.props.i18n.text.get( "plugin.records.hops.goals." + option )}</label>
              </div>
            } )}
        </div>
      </div>
      <div className={`application-sub-panel__item application-sub-panel__item--hops-${this.props.editable ? "editable" : "readable"}`}>
        <div>
          {this.props.i18n.text.get( "plugin.records.hops.goals.matriculationExam" )}
        </div>
        <div>
          {["yes", "no", "maybe"].map( ( option: string ) => {
              let onEvent = this.set.bind( this, "goalMatriculationExam", option );
              return <div className="form-field__radio-option-container" key={option}>
                <input type="radio" value={option} checked={this.state.hops.goalMatriculationExam === option}
                  onChange={onEvent} />
                <label onClick={onEvent}>{this.props.i18n.text.get( "plugin.records.hops.goals." + option )}</label>
              </div>
            })}
        </div>
      </div>
      <div className={`application-sub-panel__item application-sub-panel__item--hops-${this.props.editable ? "editable" : "readable"}`}>
        <div>
          {this.props.i18n.text.get( "plugin.records.hops.goals.vocationalYears1" )}
            <select value={this.state.hops.vocationalYears || ""} onChange={this.setFromEventValue.bind( this, "vocationalYears" )}>
              <option disabled value="">{this.props.i18n.text.get( "plugin.records.hops.selectAnOption" )}</option>
              {["1", "2", "2,5", "3", "4", "5", "6", "7", "8", "9", "10"].map( ( numba ) => {
                return <option key={numba} value={numba}>{numba}</option>
              } )}
            </select>
          {this.props.i18n.text.get( "plugin.records.hops.goals.vocationalYears2" )}
        </div>
        <div>
          {["yes", "no"].map( ( option: string ) => {
            let onEvent = this.set.bind( this, "goalJustMatriculationExam", option );
            return <div className="form-field__radio-option-container" key={option}>
              <input type="radio" value={option} checked={this.state.hops.goalJustMatriculationExam === option}
                onChange={onEvent} />
              <label onClick={onEvent}>{this.props.i18n.text.get( "plugin.records.hops.goals." + option )}</label>
            </div>
          } )}
        </div>
      </div>
      <div className={`application-sub-panel__item application-sub-panel__item--hops-${this.props.editable ? "editable" : "readable"}`}>
        <div>
          {this.props.i18n.text.get( "plugin.records.hops.goals.justTransferCredits1" )}
            <select value={this.state.hops.transferCreditYears || ""} onChange={this.setFromEventValue.bind( this, "transferCreditYears" )}>
              <option disabled value="">{this.props.i18n.text.get( "plugin.records.hops.selectAnOption" )}</option>
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map( ( numba ) => {
                return <option key={numba} value={numba}>{numba}</option>
              } )}
            </select>
          {this.props.i18n.text.get( "plugin.records.hops.goals.justTransferCredits2" )}
        </div>
        <div>
            {["yes", "no"].map( ( option: string ) => {
              let onEvent = this.set.bind( this, "justTransferCredits", option );
              return <div className="form-field__radio-option-container" key={option}>
                <input type="radio" value={option} checked={this.state.hops.justTransferCredits === option}
                  onChange={onEvent} />
                <label onClick={onEvent}>{this.props.i18n.text.get( "plugin.records.hops.goals." + option )}</label>
              </div>
            } )}
        </div>
      </div>
      <div className={`application-sub-panel__item application-sub-panel__item--hops-${this.props.editable ? "editable" : "readable"}`}>
        <div>
          {this.props.i18n.text.get( "plugin.records.hops.goals.completionYears1" )}
            <select value={this.state.hops.completionYears || ""} onChange={this.setFromEventValue.bind( this, "completionYears" )}>
              <option disabled value="">{this.props.i18n.text.get( "plugin.records.hops.selectAnOption" )}</option>
              {["1", "2", "3", "4"].map( ( numba ) => {
                return <option key={numba} value={numba}>{numba}</option>
              } )}
            </select>
          {this.props.i18n.text.get( "plugin.records.hops.goals.completionYears2" )}
        </div>
      </div>
      <div className={`application-sub-panel__item application-sub-panel__item--hops-${this.props.editable ? "editable" : "readable"}`}>
        <div>
          {this.props.i18n.text.get( "plugin.records.hops.languages.mandatory.title" )}
        </div>
        <div>
            {["AI", "S2"].map( ( option: string ) => {
              let onEvent = this.set.bind( this, "finnish", option );
              const nativity: any = { "AI": "native", "S2": "foreign" };
              return <div className="form-field__radio-option-container" key={option}>
                <input type="radio" value={option} checked={this.state.hops.finnish === option}
                  onChange={onEvent} />
                <label onClick={onEvent}>{this.props.i18n.text.get( "plugin.records.hops.languages.finnish." + nativity[option] )}</label>
              </div>
            } )}
        </div>
      </div>          
      <div>
        <div className={`application-sub-panel__item application-sub-panel__item--hops-${this.props.editable ? "editable" : "readable"}`}>
          {this.props.i18n.text.get( "plugin.records.hops.languages.mandatory.additionalInfo" )}
        </div>
      </div>          
      <div className={`application-sub-panel__item application-sub-panel__item--hops-${this.props.editable ? "editable" : "readable"}`}>
        <div>
          {this.props.i18n.text.get( "plugin.records.hops.languages.optional.title" )}
        </div>
        <div>
          <div className="form-field__check-option-container">
            <label>{this.props.i18n.text.get( "plugin.records.hops.languages.german" )}</label>
            <div>
              <input type="checkbox" checked={this.state.hops.german} onChange={this.set.bind( this, "german", !this.state.hops.german )} />
            </div>
          </div>
          <div className="form-field__check-option-container">
            <label>{this.props.i18n.text.get( "plugin.records.hops.languages.french" )}</label>
            <div>
              <input type="checkbox" checked={this.state.hops.french} onChange={this.set.bind( this, "french", !this.state.hops.french )} />
            </div>
          </div>
          <div className="form-field__check-option-container">
            <label>{this.props.i18n.text.get( "plugin.records.hops.languages.italian" )}</label>
            <div>
              <input type="checkbox" checked={this.state.hops.italian} onChange={this.set.bind( this, "italian", !this.state.hops.italian )} />
            </div>
          </div>
          <div className="form-field__check-option-container">
            <label>{this.props.i18n.text.get( "plugin.records.hops.languages.spanish" )}</label>
            <div>
              <input type="checkbox" checked={this.state.hops.spanish} onChange={this.set.bind( this, "spanish", !this.state.hops.spanish )} />
            </div>
          </div>
        </div>
      </div>
      <div className={`application-sub-panel__item application-sub-panel__item--hops-${this.props.editable ? "editable" : "readable"}`}>
        <div>
          {this.props.i18n.text.get( "plugin.records.hops.mathSyllabus.title" )}
        </div>
        <div>
          {["MAA", "MAB"].map( ( option: string ) => {
            let onEvent = this.set.bind( this, "mathSyllabus", option );
            return <div className="form-field__radio-option-container" key={option}>
              <input type="radio" value={option} checked={this.state.hops.mathSyllabus === option}
                onChange={onEvent} />
              <label onClick={onEvent}>{this.props.i18n.text.get( "plugin.records.hops.mathSyllabus." + option )}</label>
            </div>
          } )}
        </div>
      </div>
      <div className={`application-sub-panel__item application-sub-panel__item--hops-${this.props.editable ? "editable" : "readable"}`}>
        <div>
          {this.props.i18n.text.get( "plugin.records.hops.science.title" )}
        </div>
        <div>
          {["BI", "FY", "KE", "GE"].map( ( option: string ) => {
            let onEvent = this.set.bind( this, "science", option );
            return <div className="form-field__radio-option-container" key={option}>
              <input type="radio" value={option} checked={this.state.hops.science === option}
                onChange={onEvent} />
              <label onClick={onEvent}>{this.props.i18n.text.get( "plugin.records.hops.science." + option )}</label>
            </div>
          } )}
        </div>
      </div>
      <div className={`application-sub-panel__item application-sub-panel__item--hops-${this.props.editable ? "editable" : "readable"}`}>
        <div>
          {this.props.i18n.text.get( "plugin.records.hops.religion.title" )}
        </div>Äidinkielen lisäksi aikuislukiolaiset oÄidinkielen lisäksi aikuislukiolaiset opiskelevat pakollisena A-englantia ja B-ruotsia.piskelevat pakollisena A-englantia ja B-ruotsia.
        <div>
          {["UE", "ET", "UX"].map( ( option: string ) => {
            let onEvent = this.set.bind( this, "religion", option );
            return <div className="form-field__radio-option-container" key={option}>
              <input type="radio" value={option} checked={this.state.hops.religion === option}
                onChange={onEvent} />
              <label onClick={onEvent}>{this.props.i18n.text.get( "plugin.records.hops.religion." + option )}</label>
            </div>
          } )}
        </div>
      </div>
      {this.state.hops.additionalInfo ?
        <div className={`application-sub-panel__item application-sub-panel__item--hops-${this.props.editable ? "editable" : "readable"}`}>
          <div>
            {this.props.i18n.text.get( "plugin.records.hops.additionalInfo.title" )}
          </div>
          {!this.props.editable ? <div className="text text--guider-profile-value">{this.state.hops.additionalInfo}</div> :
          <textarea onChange={this.setFromEventValue.bind( this, "additionalInfo" )} value={this.state.hops.additionalInfo || ""} />}

      </div>
        : null}
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