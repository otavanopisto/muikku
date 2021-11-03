import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import { TranscriptOfRecordLocationType } from '~/reducers/main-function/records';
import {StateType} from '~/reducers';
import '~/sass/elements/form-elements.scss';

interface StudiesPrimaryOptionProps {
  i18n: i18nType,
  location: TranscriptOfRecordLocationType,
  isHopsEnabled: boolean
}

interface StudiesPrimaryOptionState {
}

class StudiesPrimaryOption extends React.Component<StudiesPrimaryOptionProps, StudiesPrimaryOptionState> {
  constructor(props: StudiesPrimaryOptionProps){
    super(props);

    this.onSelectChange = this.onSelectChange.bind(this);

  }
  onSelectChange(e: React.ChangeEvent<HTMLSelectElement>){
    window.location.hash = "#" + e.target.value;
  }

  render(){

    let sections = [
      {
        name: this.props.i18n.text.get("plugin.records.category.records"),
        hash: "",
        enabled: true
      },
      {
        name: this.props.i18n.text.get("plugin.records.category.hops"),
        hash: "hops",
        enabled: this.props.isHopsEnabled
      },
      {
        name: this.props.i18n.text.get("plugin.records.category.vops"),
        hash: "vops",
        enabled: this.props.isHopsEnabled
      }
    ]
    return <div className="application-panel__toolbar">
      <div className="form-element form-element--studies-toolbar">
        <select className="form-element__select form-element__select--main-action" onChange={this.onSelectChange} value={this.props.location || ""}>
          {sections.map((section, index)=>{
            if (!section.enabled){
              return null;
            }
            return <option key={index} value={section.hash} >
                {section.name}
            </option>
          })}
        </select>
      </div>
    </div>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    location: state.records.location,
    isHopsEnabled: state.status.hopsEnabled
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudiesPrimaryOption);
