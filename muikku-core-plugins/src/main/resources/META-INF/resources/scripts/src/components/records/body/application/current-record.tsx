import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import {StateType} from '~/reducers';
import '~/sass/elements/link.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/application-list.scss';
import { RecordsType } from '~/reducers/main-function/records/records';
import Material from './current-record/material';

interface CurrentRecordProps {
  i18n: i18nType,
  records: RecordsType
}

interface CurrentRecordState {
}

class CurrentRecord extends React.Component<CurrentRecordProps, CurrentRecordState> {
  constructor(props: CurrentRecordProps){
    super(props);
  }
  
  render(){
    if (this.props.records.location !== "RECORDS" || !this.props.records.current){
      return null;
    } else if (this.props.records.currentStatus === "LOADING"){
      return null;
    }
    return <div className="application-list">
      <div className="application-list__item course course--studies" key={this.props.records.current.workspace.id}>
      <div className="application-list__item-header" key={this.props.records.current.workspace.id}>
        <span className="text text--course-icon icon-books"></span>
        <span className="text text--list-item-title">{this.props.records.current.workspace.name} {this.props.records.current.workspace.nameExtension && <span className="text text--list-item-title-extension">({this.props.records.current.workspace.nameExtension})</span>}</span> 
        {getEvaluationRequestIfAvailable(this.props, workspace)}
        {workspace.studentAssessments.assessments.length ? getAssessments(this.props, workspace) : null}
        {getActivity(this.props, workspace)}
      </div>
  </div>
    
      <h3>{this.props.i18n.text.get("plugin.records.tasks.evaluated.topic")}</h3>
      <div className="application-list">
        {this.props.records.current.materials.map((material)=>{
          return <Material key={material.id} material={material} i18n={this.props.i18n} grades={this.props.records.grades} workspace={this.props.records.current.workspace}/>
        })}
      </div>
      {this.props.records.current.journals.length ? <h2>{this.props.i18n.text.get("plugin.records.studydiary.topic")}</h2> : null}
      {this.props.records.current.journals.map((journal)=>{
        return <div key={journal.id}>
          <h2>{journal.title}</h2>
          <p>{this.props.i18n.time.format(journal.created, "L LT")}</p>
          <div dangerouslySetInnerHTML={{__html: journal.content}}></div>
        </div>
      })}
    </div>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    records: state.records
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentRecord);