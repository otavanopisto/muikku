import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as queryString from 'query-string';

import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/message.scss';
import '~/sass/elements/application-sub-panel.scss';
import { RecordsType, TransferCreditType } from '~/reducers/main-function/records/records';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import Link from '~/components/general/link';
import { WorkspaceType, WorkspaceStudentAccessmentType } from '~/reducers/main-function/workspaces';
import { UserWithSchoolDataType } from '~/reducers/main-function/user-index';
import {StateType} from '~/reducers';

let ProgressBarLine = require('react-progressbar.js').Line;

interface RecordsProps {
  i18n: i18nType,
  records: RecordsType
}

interface RecordsState {
}

let storedCurriculumIndex:any = {};

function getTransferCreditValue(props: RecordsProps, transferCredit: TransferCreditType){
  let gradeId = [
    transferCredit.gradingScaleIdentifier,
    transferCredit.gradeIdentifier].join('-');
  let grade = props.records.grades[gradeId];
  return <div className="TODO transfer credit value">
    <span className="TODO transfer-credit-text">{props.i18n.text.get("plugin.records.transferCreditsDate", props.i18n.time.format(transferCredit.date))}</span>
    &nbsp;
    <span className={`TODO workspace-assesment-score ${grade.passing ? "credit-passed" : "credit-failed"}`}>
      {grade.grade}
    </span>
  </div>
}

function getAssesment(props: RecordsProps, workspace: WorkspaceType){
  let assesment = workspace.studentAcessment;
  let gradeId = [
    assesment.gradingScaleSchoolDataSource,
    assesment.gradingScaleIdentifier,
    assesment.gradeSchoolDataSource,
    assesment.gradeIdentifier].join('-');
  let grade = props.records.grades[gradeId];
  return <div className="TODO workspace assesment">
    <span className="TODO workspace-assesment-text">{props.i18n.text.get("plugin.records.workspace.evaluated", props.i18n.time.format(workspace.studentAcessment.evaluated))}</span>
    &nbsp;
    <span className={`TODO workspace-assesment-score ${workspace.studentAcessment.passed ? "workspace-passed" : "workspace-failed"}`}>
      {grade.grade}
    </span>
  </div>
}

function getActivity(props: RecordsProps, workspace: WorkspaceType){
    let evaluablesCompleted = workspace.studentActivity.evaluablesPassed + workspace.studentActivity.evaluablesSubmitted +
      workspace.studentActivity.evaluablesFailed + workspace.studentActivity.evaluablesIncomplete;
    return <div className="TOOD workspace activity">
      <ProgressBarLine containerClassName="progressbar" initialAnimate options={{
        strokeWidth: 2,
        duration: 1000,
        color: "#ce01bd",
        trailColor: "#eee",
        trailWidth: 1,
        svgStyle: {width: "100%", height: "100%"},
        text: {
          className: "progressbar-text",
          style: {
            color: "#222"
          }
        }
      }}
      strokeWidth={4} easing="easeInOut" duration={1000} color="#ce01bd" trailColor="#eee"
      trailWidth={2} svgStyle={{width: "100%", height: "100%"}}
      text={evaluablesCompleted + "/" + workspace.studentActivity.evaluablesTotal}
      progress={workspace.studentActivity.evaluablesDonePercent/100}/>
      <ProgressBarLine containerClassName="progressbar" initialAnimate options={{
        strokeWidth: 2,
        duration: 1000,
        color: "#ff9900",
        trailColor: "#eee",
        trailWidth: 1,
        svgStyle: {width: "100%", height: "100%"},
        text: {
          className: "progressbar-text",
          style: {
            color: "#222"
          }
        }
      }}
      strokeWidth={4} easing="easeInOut" duration={1000} color="#ce01bd" trailColor="#eee"
      trailWidth={2} svgStyle={{width: "100%", height: "100%"}}
      text={workspace.studentActivity.exercisesAnswered + "/" + workspace.studentActivity.exercisesTotal}
      progress={workspace.studentActivity.exercisesDonePercent/100}/>
    </div>
}

class Records extends React.Component<RecordsProps, RecordsState> {
  constructor(props: RecordsProps){
    super(props);
    
    this.getWorkspaceLink = this.getWorkspaceLink.bind(this);
  }
  
  getWorkspaceLink(user: UserWithSchoolDataType, workspace: WorkspaceType){
    return "#?u=" + user.userEntityId + "&w=" + workspace.id;
  }

  render(){
    if (this.props.records.userDataStatus === "LOADING"){
      return null;
    } else if (this.props.records.userDataStatus === "ERROR"){
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    }
    
    if (Object.keys(storedCurriculumIndex).length && this.props.records.curriculums.length){
      this.props.records.curriculums.forEach((curriculum)=>{
        storedCurriculumIndex[curriculum.identifier] = curriculum.name;
      });
    }
    
    let studentBasicInfo = <div className="container container--student-info application-sub-panel__body--basic-info text">
      <div className="application-sub-panel__item application-sub-panel__item--guider-basic-info">
        <span>{this.props.i18n.text.get("plugin.records.studyStartDateLabel")}</span>
        <span><span className="text text--guider-profile-value">{this.props.i18n.time.format(this.props.records.studyStartDate)}</span></span>
      </div>
    </div> 
      
    let studentRecords = <div className="application-list">
        {this.props.records.userData.map((data)=>{
          let user = data.user;
          let records = data.records;      
          return <div key={data.user.id}>
          <div className="application-sub-panel__header text text--guider-header">{user.studyProgrammeName}</div>
            {records.map((record, index)=>{
              //TODO remember to add the curriculum reducer information to give the actual curriculum name somehow, this just gives the id
              return <div key={record.groupCurriculumIdentifier || index}>
                {record.groupCurriculumIdentifier ? <h3>{storedCurriculumIndex[record.groupCurriculumIdentifier]}</h3> : null}
                {record.workspaces.map((workspace)=>{
                  return (
                  <div className="application-list__item course" >
                  <div className="">     
                    <div className="application-list__item-header application-list__item-header--course">
                      <span className="text text--coursepicker-course-icon icon-books"></span>
                      <span className="text text--list-item-title">
                        <span>{workspace.name}</span>
                        {workspace.nameExtension && <span className="">( {workspace.nameExtension} )</span>}
                      </span> 
                      <span className="text text--list-item-type-title">
                        <span title={this.props.i18n.text.get("plugin.guider.headerEvaluatedTitle", workspace.studentActivity.evaluablesDonePercent)}>{
                          workspace.studentActivity.evaluablesDonePercent}%
                        </span>
                        <span> / </span>
                        <span title={this.props.i18n.text.get("plugin.guider.headerExercisesTitle",workspace.studentActivity.exercisesDonePercent)}>{
                          workspace.studentActivity.exercisesDonePercent}%
                        </span>
                      </span>
                    </div>                                                              
                  </div>
                </div>                  
                )  
                  
                  

                })}
                {record.transferCredits.length ? <h3>{this.props.i18n.text.get("TODO transfer credits")}</h3> : null}
                {record.transferCredits.map((credit)=>{
                  return <div key={credit.date}>
                    <span>{credit.courseName}</span>
                    {getTransferCreditValue(this.props, credit)}
                  </div>
                })}
              </div>
            })}
          </div>
        })}
      </div>  

    // Todo fix the first sub-panel border-bottom stuff from guider. It should be removed from title only.
    
    return <BodyScrollKeeper hidden={this.props.records.location !== "RECORDS" || !!this.props.records.current}>
    
    <div className="application-sub-panel"></div>        
    <div className="application-sub-panel">
      {studentBasicInfo}
    </div>
    <div className="application-sub-panel">
      {studentRecords}
    </div>
      
    <div className="application-sub-panel">
      {this.props.records.files.length ?
        <div className="text application-sub-panel__file-container application-list">
          {this.props.records.files.map((file)=>{
            return <Link key={file.id} href={`/rest/records/files/${file.id}/content`} openInNewTab={file.title}>
              {file.title}
            </Link>
          })}
        </div> :
        <div className="text application-sub-panel__file-container">{
          this.props.i18n.text.get("plugin.guider.user.details.files.empty")
        }</div>
      }
    </div>
    </BodyScrollKeeper>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    records: (state as any).records
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Records);