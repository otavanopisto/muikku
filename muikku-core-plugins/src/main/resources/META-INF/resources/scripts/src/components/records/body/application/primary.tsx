import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import { TranscriptOfRecordLocationType } from '~/reducers/main-function/records/records';
import {StateType} from '~/reducers';
import '~/sass/elements/form-fields.scss';

interface StudiesPrimaryOptionProps {
  i18n: i18nType,
  location: TranscriptOfRecordLocationType
}

interface StudiesPrimaryOptionState {
}

class StudiesPrimaryOption extends React.Component<StudiesPrimaryOptionProps, StudiesPrimaryOptionState> {
  constructor(props: StudiesPrimaryOptionProps){
    super(props);
    
    this.onSelectChange = this.onSelectChange.bind(this);

  }
  onSelectChange(e: React.ChangeEvent<HTMLSelectElement>){
    window.location.hash = e.target.value;
  }

  render(){

    let sections = [
      {
        name: this.props.i18n.text.get("plugin.records.category.records"),
        isActive: this.props.location === "RECORDS" as TranscriptOfRecordLocationType,
        hash: ""
      },
      {
        name: this.props.i18n.text.get("plugin.records.category.hops"),
        isActive: this.props.location === "HOPS" as TranscriptOfRecordLocationType,
        hash: "hops"
      },
      {
        name: this.props.i18n.text.get("plugin.records.category.vops"),
        isActive: this.props.location === "VOPS" as TranscriptOfRecordLocationType,
        hash: "vops"
      }
    ]    
    return <div className="application-panel__toolbar">
      <select className="form-field form-field--toolbar-selector" onChange={this.onSelectChange}>
        {sections.map((section, index)=>{
          return <option key={index} className="" value={"#" + section.hash}>
              {section.name}
          </option>
        })}
      </select>
    </div>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    location: (state as any).records.location
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudiesPrimaryOption);