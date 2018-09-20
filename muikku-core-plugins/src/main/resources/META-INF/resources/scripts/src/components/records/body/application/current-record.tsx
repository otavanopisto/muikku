import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import {StateType} from '~/reducers';
import '~/sass/elements/link.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/application-list.scss';
import { RecordsType } from '~/reducers/main-function/records';
import Material from './current-record/material';

import '~/sass/elements/workspace-activity.scss';
import '~/sass/elements/assignment.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/application-list.scss';
import '~/sass/elements/journal.scss';
import '~/sass/elements/rich-text.scss';
import ApplicationList, { ApplicationListItem, ApplicationListItemBody, ApplicationListItemHeader } from '~/components/general/application-list';
import { StatusType } from '~/reducers/base/status';

interface CurrentRecordProps {
  i18n: i18nType,
  records: RecordsType,
  status: StatusType
}

interface CurrentRecordState {
}

class CurrentRecord extends React.Component<CurrentRecordProps, CurrentRecordState> {
  constructor(props: CurrentRecordProps){
    super(props);
  }
  
  render(){
    if (this.props.records.location !== "records" || !this.props.records.current){
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
    
    let workspaceEvaluation = this.props.records.current.workspace.studentAssessments.assessments.length &&
      this.props.records.current.workspace.studentAssessments.assessments[0].verbalAssessment ?
        <div dangerouslySetInnerHTML={{__html: this.props.records.current.workspace.studentAssessments.assessments[0].verbalAssessment}} 
        className={`text rich-text text--studies-workspace-literal-assessment state-${assesmentStateClassName}`}/> : null;
    
    return <div className="application-sub-panel">
      <div className="application-sub-panel__header application-sub-panel__header--studies-detailed-info text text--studies-header" key={this.props.records.current.workspace.id}>
        {this.props.records.current.workspace.name} {this.props.records.current.workspace.nameExtension && "(" + this.props.records.current.workspace.nameExtension + ")"}
      </div>
      <div className="application-sub-panel__body application-sub-panel__body--studies-detailed-info">
        <ApplicationList>
          {workspaceEvaluation}
          <div className="application-list__header application-list__header--studies-detailed-info text text--studies-list-header">{this.props.i18n.text.get("plugin.records.assignments.title")}</div>
          {this.props.records.current.materials.map((material)=>{
            return <Material key={material.id} material={material} i18n={this.props.i18n}
             workspace={this.props.records.current.workspace}
             status={this.props.status}/>
          })}
        </ApplicationList>
          
          {this.props.records.current.journals.length ? <div className="application-list">
          <div className="application-list__header application-list__header--studies-detailed-info text text--studies-list-header">{this.props.i18n.text.get("plugin.records.studydiary.title")}</div>
            <div className="application-list_item-wrapper">
              {this.props.records.current.journals.map((journal)=>{
                return <ApplicationListItem className="journal journal--studies" key={journal.id}>
                  <ApplicationListItemHeader modifiers="journal">
                    <div className="text text--studies-journal-entry-title">{journal.title}</div>
                    <div className="text text--studies-journal-entry-time">{this.props.i18n.time.format(journal.created, "L LT")}</div>
                  </ApplicationListItemHeader>
                  <ApplicationListItemBody className="application-list__item-body application-list__item-body--journal rich-text" dangerouslySetInnerHTML={{__html: journal.content}}></ApplicationListItemBody>
                </ApplicationListItem>
            })}
          </div>
        </div> : null}
        
      </div>
          
    </div>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    records: state.records,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentRecord);