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
    return <div className="application-sub-panel__item application-sub-panel__item--hops-readable">

      <div className="application-sub-panel__item">
        <div className="application-sub-panel__item-title application-sub-panel__item-title--readable">{this.props.i18n.text.get("plugin.records.hops.goals.upperSecondary")}</div>
        <div className="application-sub-panel__item-data">
          {!this.props.editable ?
            //NON EDITABLE FORM
            <span className="text text--guider-profile-value">
              {this.props.i18n.text.get("plugin.records.hops.goals." + this.state.hops.goalSecondarySchoolDegree)}
            </span> :

            //EDITABLE FORM
            ["yes", "no", "maybe"].map( ( option: string ) => {
              let onEvent = this.set.bind(this, "goalSecondarySchoolDegree", option);
              return <div key={option}>
                <input type="radio" value={option} checked={this.state.hops.goalSecondarySchoolDegree === option}
                  onChange={onEvent} />
                <label onClick={onEvent}>{this.props.i18n.text.get("plugin.records.hops.goals." + option)}</label>
              </div>
            } )
          }
        </div>
      </div>
      <div className="application-sub-panel__item">
        <div className="application-sub-panel__item-title application-sub-panel__item-title--readable">{this.props.i18n.text.get("plugin.records.hops.goals.matriculationExam")}</div>
        <div className="application-sub-panel__item-data">
          {!this.props.editable ?
            <span className="text text--guider-profile-value">
              {this.props.i18n.text.get("plugin.records.hops.goals." + this.state.hops.goalMatriculationExam)}
            </span> :

            //EDITABLE FORM
            ["yes", "no", "maybe"].map( ( option: string ) => {
              let onEvent = this.set.bind(this, "goalMatriculationExam", option);
              return <div key={option}>
                <input type="radio" value={option} checked={this.state.hops.goalMatriculationExam === option}
                  onChange={onEvent} />
                <label onClick={onEvent}>{this.props.i18n.text.get("plugin.records.hops.goals." + option)}</label>
              </div>
            } )
          }
        </div>
      </div>
      <div className="application-sub-panel__item">
        <div className="application-sub-panel__item-title application-sub-panel__item-title--readable">
          {this.props.i18n.text.get("plugin.records.hops.goals.vocationalYears1")}
          {!this.props.editable ?
            //Non editable form
            <span className="text text--guider-hops-value">{this.state.hops.vocationalYears}</span> :

            //Editable f... 2,5 wot?...
            <select value={this.state.hops.vocationalYears || ""} onChange={this.setFromEventValue.bind(this, "vocationalYears")}>
              <option disabled value="">{this.props.i18n.text.get("plugin.records.hops.selectAnOption")}</option>
              {["1", "2", "2,5", "3", "4", "5", "6", "7", "8", "9", "10"].map( ( numba ) => {
                return <option key={numba} value={numba}>{numba}</option>
              } )}
            </select>
          }
          {this.props.i18n.text.get("plugin.records.hops.goals.vocationalYears2")}
        </div>
        <div className="application-sub-panel__item-data">
          <span className="text text--guider-profile-value">
            {!this.props.editable ?

              //Non editable form
              <span>{this.props.i18n.text.get("plugin.records.hops.goals." + this.state.hops.goalJustMatriculationExam)}</span> :

              //Editable form
              ["yes", "no"].map( ( option: string ) => {
                let onEvent = this.set.bind(this, "goalJustMatriculationExam", option);
                return <div key={option}>
                  <input type="radio" value={option} checked={this.state.hops.goalJustMatriculationExam === option}
                    onChange={onEvent} />
                  <label onClick={onEvent}>{this.props.i18n.text.get("plugin.records.hops.goals." + option)}</label>
                </div>
              } )
            }
          </span>
        </div>
      </div>
      <div className="application-sub-panel__item">
        <div className="application-sub-panel__item-title">
          {this.props.i18n.text.get("plugin.records.hops.goals.justTransferCredits1")}
          {!this.props.editable ?
            //Non editable form
            <span className="text text--guider-hops-value">{this.state.hops.transferCreditYears}</span> :

            //Editable form.
            <select value={this.state.hops.transferCreditYears || ""} onChange={this.setFromEventValue.bind( this, "transferCreditYears")}>
              <option disabled value="">{this.props.i18n.text.get("plugin.records.hops.selectAnOption")}</option>
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map( ( numba ) => {
                return <option key={numba} value={numba}>{numba}</option>
              } )}
            </select>
          }
          {this.props.i18n.text.get("plugin.records.hops.goals.justTransferCredits2")}
        </div>
        <div className="application-sub-panel__item-data">
          {!this.props.editable ?

            //Non editable form
            <span className="text text--guider-profile-value">{this.props.i18n.text.get("plugin.records.hops.goals." + this.state.hops.justTransferCredits)}</span> :

            //Editable form
            ["yes", "no"].map( ( option: string ) => {
              let onEvent = this.set.bind(this, "justTransferCredits", option);
              return <div key={option}>
                <input type="radio" value={option} checked={this.state.hops.justTransferCredits === option}
                  onChange={onEvent} />
                <label onClick={onEvent}>{this.props.i18n.text.get("plugin.records.hops.goals." + option)}</label>
              </div>
            } )
          }
        </div>
      </div>
      <div className="application-sub-panel__item">
        <div className="application-sub-panel__item-title application-sub-panel__item-title--readable">
          {this.props.i18n.text.get("plugin.records.hops.goals.completionYears1")}
          {!this.props.editable ?
            //Non editable form
            <span className="text text--guider-hops-value">{this.state.hops.completionYears}</span> :

            //Editable form.
            <select value={this.state.hops.completionYears || ""} onChange={this.setFromEventValue.bind( this, "completionYears" )}>
              <option disabled value="">{this.props.i18n.text.get("plugin.records.hops.selectAnOption")}</option>
              {["1", "2", "3", "4"].map( ( numba ) => {
                return <option key={numba} value={numba}>{numba}</option>
              } )}
            </select>
          }
          {this.props.i18n.text.get("plugin.records.hops.goals.completionYears2")}
        </div>
      </div>
      <div className="application-sub-panel__item">
        <div className="application-sub-panel__item-title application-sub-panel__item-title--readable">{this.props.i18n.text.get("plugin.records.hops.languages.mandatory.title")}</div>
        <div className="application-sub-panel__item-data">
          {!this.props.editable ?
            <span className="text text--guider-profile-value">{
              this.state.hops.finnish === "AI" ?
                this.props.i18n.text.get("plugin.records.hops.languages.finnish.native") :
                this.props.i18n.text.get("plugin.records.hops.languages.finnish.foreign")
            }</span> :
            ["AI", "S2"].map( ( option: string ) => {
              let onEvent = this.set.bind( this, "finnish", option );
              const nativity: any = { "AI": "native", "S2": "foreign" };
              return <div key={option}>
                <input type="radio" value={option} checked={this.state.hops.finnish === option}
                  onChange={onEvent} />
                <label onClick={onEvent}>{this.props.i18n.text.get("plugin.records.hops.languages.finnish." + nativity[option])}</label>
              </div>
            } )
          }
        </div>
      </div>
      <div className="application-sub-panel__item">
        <div className="application-sub-panel__item-title application-sub-panel__item-title--readable">{this.props.i18n.text.get("plugin.records.hops.languages.mandatory.additionalInfo")}</div>
      </div>
      <div className="application-sub-panel__item">
        <div className="application-sub-panel__item-title application-sub-panel__item-title--readable">
          {this.props.i18n.text.get("plugin.records.hops.languages.optional.title")}
        </div>
        <div className="application-sub-panel__item-data">
          <label className="text text--guider-profile-label">{this.props.i18n.text.get("plugin.records.hops.languages.german")}</label>
          {!this.props.editable ?
            <span className="text text--guider-profile-value">{
              this.state.hops.german ?
                this.props.i18n.text.get("plugin.records.hops.goals.yes") :
                this.props.i18n.text.get("plugin.records.hops.goals.no")
            }</span> :
            <span>
              <input type="checkbox" checked={this.state.hops.german} onChange={this.set.bind(this, "german", !this.state.hops.german)} />
            </span>
          }
        </div>
        <div className="application-sub-panel__item-data">
          <label className="text text--guider-profile-label">{this.props.i18n.text.get("plugin.records.hops.languages.french")}</label>
          {!this.props.editable ?
            <span className="text text--guider-profile-value">{
              this.state.hops.french ?
                this.props.i18n.text.get("plugin.records.hops.goals.yes") :
                this.props.i18n.text.get("plugin.records.hops.goals.no")
            }</span> :
            <span>
              <input type="checkbox" checked={this.state.hops.french} onChange={this.set.bind(this, "french", !this.state.hops.french)} />
            </span>
          }
        </div>
        <div className="application-sub-panel__item-data">
          <label className="text text--guider-profile-label">{this.props.i18n.text.get("plugin.records.hops.languages.italian")}</label>
          {!this.props.editable ?
            <span className="text text--guider-profile-value">{
              this.state.hops.italian ?
                this.props.i18n.text.get("plugin.records.hops.goals.yes") :
                this.props.i18n.text.get("plugin.records.hops.goals.no")
            }</span> :
            <span>
              <input type="checkbox" checked={this.state.hops.italian} onChange={this.set.bind(this, "italian", !this.state.hops.italian)} />
            </span>
          }
        </div>
        <div className="application-sub-panel__item-data">
          <label className="text text--guider-profile-label">{this.props.i18n.text.get("plugin.records.hops.languages.spanish")}</label>
          {!this.props.editable ?
            <span className="text text--guider-profile-value">{
              this.state.hops.spanish ?
                this.props.i18n.text.get("plugin.records.hops.goals.yes") :
                this.props.i18n.text.get("plugin.records.hops.goals.no")
            }</span> :
            <span>
              <input type="checkbox" checked={this.state.hops.spanish} onChange={this.set.bind(this, "spanish", !this.state.hops.spanish)} />
            </span>
          }
        </div>
      </div>
      <div className="application-sub-panel__item">
        <div className="application-sub-panel__item-title application-sub-panel__item-title--readable">{this.props.i18n.text.get("plugin.records.hops.mathSyllabus.title")}</div>
        <div className="application-sub-panel__item-data">
          {!this.props.editable ?
            <span className="text text--guider-profile-value">{this.props.i18n.text.get("plugin.records.hops.mathSyllabus." + this.state.hops.mathSyllabus)}</span> :
            ["MAA", "MAB"].map( ( option: string ) => {
              let onEvent = this.set.bind(this, "mathSyllabus", option);
              return <div key={option}>
                <input type="radio" value={option} checked={this.state.hops.mathSyllabus === option}
                  onChange={onEvent} />
                <label onClick={onEvent}>{this.props.i18n.text.get("plugin.records.hops.mathSyllabus." + option)}</label>
              </div>
            } )
          }
        </div>
      </div>
      <div className="application-sub-panel__item">
        <div className="application-sub-panel__item-title application-sub-panel__item-title--readable">{this.props.i18n.text.get("plugin.records.hops.science.title")}</div>
        <div className="application-sub-panel__item-data">
          {!this.props.editable ?
            <span className="text text--guider-profile-value">{this.props.i18n.text.get("plugin.records.hops.science." + this.state.hops.science)}</span> :
            ["BI", "FY", "KE", "GE"].map( ( option: string ) => {
              let onEvent = this.set.bind(this, "science", option);
              return <div key={option}>
                <input type="radio" value={option} checked={this.state.hops.science === option}
                  onChange={onEvent} />
                <label onClick={onEvent}>{this.props.i18n.text.get("plugin.records.hops.science." + option)}</label>
              </div>
            } )
          }
        </div>
      </div>
      <div className="application-sub-panel__item">
        <div className="application-sub-panel__item-title application-sub-panel__item-title--readable">{this.props.i18n.text.get("plugin.records.hops.religion.title")}</div>
        <div className="application-sub-panel__item-data">
          {!this.props.editable ?
            <span className="text text--guider-profile-value">{this.props.i18n.text.get("plugin.records.hops.religion." + this.state.hops.religion)}</span> :
            ["UE", "ET", "UX"].map( ( option: string ) => {
              let onEvent = this.set.bind(this, "religion", option);
              return <div key={option}>
                <input type="radio" value={option} checked={this.state.hops.religion === option}
                  onChange={onEvent} />
                <label onClick={onEvent}>{this.props.i18n.text.get("plugin.records.hops.religion." + option)}</label>
              </div>
            } )
          }
        </div>
      </div>
      {this.props.editable ||  this.state.hops.additionalInfo ?
        <div className="application-sub-panel__item">
          <div className="application-sub-panel__item-title application-sub-panel__item-title--readable">
            {this.props.i18n.text.get("plugin.records.hops.additionalInfo.title")}
          </div>
          <div className="application-sub-panel__item-data">
            {!this.props.editable ? 
              <span className="text text--guider-profile-value">{this.state.hops.additionalInfo}</span> :
              <textarea onChange={this.setFromEventValue.bind(this, "additionalInfo")} value={this.state.hops.additionalInfo || ""} />
            }
          </div>
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