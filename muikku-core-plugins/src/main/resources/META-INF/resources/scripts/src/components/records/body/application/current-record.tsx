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

import '~/sass/elements/workspace-activity.scss';
import '~/sass/elements/assignment.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/application-list.scss';

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
    
    let assesmentStateClassName = "";
    switch (this.props.records.current.workspace.studentAssessments.assessmentState){
      case "pass":
        assesmentStateClassName = "PASSED";
        break;
      case "pending":
      case "pending_pass":
      case "pending_fail":
        assesmentStateClassName = "PENDING"; 
        break;
      case "fail":
        assesmentStateClassName = "FAILED"; 
        break;
      case "incomplete":
        assesmentStateClassName = "INCOMPLETE"; 
        break;
    }
    
    let workspaceEvaluation = this.props.records.current.workspace.studentAssessments.assessments.length ?
        <div dangerouslySetInnerHTML={{__html: this.props.records.current.workspace.studentAssessments.assessments[0].verbalAssessment}} 
        className={`text text--studies-workspace-literal-assessment state-${assesmentStateClassName}`}/> : null;
    
    return <div className="application-sub-panel">
      <div className="application-sub-panel__header text text--studies-header" key={this.props.records.current.workspace.id}>
        {this.props.records.current.workspace.name} {this.props.records.current.workspace.nameExtension && <span className="text text--studies-list-header-title-extension">({this.props.records.current.workspace.nameExtension})</span>}
      </div>
      <div className="application-sub-panel__body">
        <div className="application-list">
          {workspaceEvaluation}
          <div className="application-list__header text text--studies-list-header">{this.props.i18n.text.get("plugin.records.assignments.title")}</div>
          {this.props.records.current.materials.map((material)=>{
            return <Material key={material.id} material={material} i18n={this.props.i18n} grades={this.props.records.grades} workspace={this.props.records.current.workspace}/>
          })}
          {this.props.records.current.journals.length ? <h2>{this.props.i18n.text.get("plugin.records.studydiary.title")}</h2> : null}
          {this.props.records.current.journals.map((journal)=>{
            return <div key={journal.id}>
              <h2>{journal.title}</h2>
              <p>{this.props.i18n.time.format(journal.created, "L LT")}</p>
              <div dangerouslySetInnerHTML={{__html: journal.content}}></div>
            </div>
          })}
        </div>
      </div>
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