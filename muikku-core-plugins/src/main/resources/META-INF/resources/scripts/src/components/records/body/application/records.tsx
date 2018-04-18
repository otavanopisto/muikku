import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as queryString from 'query-string';

import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/course.scss';
import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/message.scss';
import '~/sass/elements/application-sub-panel.scss';
import '~/sass/elements/workspace-activity.scss';
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

function getAcessment(props: RecordsProps, workspace: WorkspaceType){
  let acessment = workspace.studentAcessment;
  if (!acessment){
    return null;
  }
  let gradeId = [
    acessment.gradingScaleSchoolDataSource,
    acessment.gradingScaleIdentifier,
    acessment.gradeSchoolDataSource,
    acessment.gradeIdentifier].join('-');
  let grade = props.records.grades[gradeId];
  return <span className="text text--list-item-type-title">
    <span className="text text--workspace-assesment-text">{props.i18n.text.get("plugin.records.workspace.evaluated", props.i18n.time.format(workspace.studentAcessment.evaluated))}</span>
    <span className={`text text--workspace-assesment-grade ${workspace.studentAcessment.passed ? "state-PASSED" : "state-FAILED"}`}>{grade.grade}</span>
  </span>
}

function getActivity(props: RecordsProps, workspace: WorkspaceType){
    if (!workspace.studentActivity){
      return null;
    }
    let evaluablesCompleted = workspace.studentActivity.evaluablesPassed + workspace.studentActivity.evaluablesSubmitted +
      workspace.studentActivity.evaluablesFailed + workspace.studentActivity.evaluablesIncomplete;
    return <div className="workspace-activity">
      <ProgressBarLine containerClassName="workspace-activity__progressbar" initialAnimate options={{
        strokeWidth: 1,
        duration: 1000,
        color: "#ce01bd",
        trailColor: "#f5f5f5",
        trailWidth: 1,
        svgStyle: {width: "100%", height: "4px"},
        text: {
          className: "text workspace-activity__progressbar-label",
          style: {
            padding: "4px 8px",
            position: 'absolute',
            left: "50%",
            margin: "0"
          }
        }
      }}
      strokeWidth={1} easing="easeInOut" duration={1000} color="#ce01bd" trailColor="#f5f5f5"
      trailWidth={1} svgStyle={{width: "100%", height: "4px"}}
      text={evaluablesCompleted + "/" + workspace.studentActivity.evaluablesTotal}
      progress={workspace.studentActivity.evaluablesDonePercent/100}/>
    
      <ProgressBarLine containerClassName="workspace-activity__progressbar" initialAnimate options={{
        strokeWidth: 1,
        duration: 1000,
        color: "#ff9900",
        trailColor: "#f5f5f5",
        trailWidth: 1,
        svgStyle: {width: "100%", height: "4px"},
        text: {
          className: "text workspace-activity__progressbar-label",
          style: {
            padding: "4px 8px",
            position: 'absolute',
            left: "50%",
            margin: "0"
          }
        }
      }}
      strokeWidth={1} easing="easeInOut" duration={1000} color="#ff9900" trailColor="#f5f5f5"
      trailWidth={1} svgStyle={{width: "100%", height: "4px"}}
      text={workspace.studentActivity.exercisesAnswered + "/" + workspace.studentActivity.exercisesTotal}
      progress={workspace.studentActivity.exercisesDonePercent/100}/>
    </div>
}

class Records extends React.Component<RecordsProps, RecordsState> {
  constructor(props: RecordsProps){
    super(props);
    
    this.goToWorkspace = this.goToWorkspace.bind(this);
  }
  
  goToWorkspace(user: UserWithSchoolDataType, workspace: WorkspaceType) {
    window.location.hash = "#?u=" + user.userEntityId + "&w=" + workspace.id;
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
    
    let studentBasicInfo = <div className="application-sub-panel__body text">
      <div className="application-sub-panel__item">
        <div className="application-sub-panel__item-title">{this.props.i18n.text.get("plugin.records.studyStartDateLabel")}</div>
        <div className="application-sub-panel__item-data"><span className="text text--guider-profile-value">{this.props.i18n.time.format(this.props.records.studyStartDate)}</span></div>
      </div>
    </div>  
    
    let studentRecords = <div className="application-sub-panel">
        {this.props.records.userData.map((data)=>{
          let user = data.user;
          let records = data.records;      

          return <div className="react-required-container">
          <div className="application-sub-panel__header text text--studies-header">{user.studyProgrammeName}</div>
          <div className="application-sub-panel__body" key={data.user.id}>
            {records.map((record, index)=>{
              //TODO remember to add the curriculum reducer information to give the actual curriculum name somehow, this just gives the id
              return <div className="application-list" key={record.groupCurriculumIdentifier || index}>
                {record.groupCurriculumIdentifier ? <h3>{storedCurriculumIndex[record.groupCurriculumIdentifier]}</h3> : null}
                {record.workspaces.map((workspace)=>{
                  return <div className="application-list__item course" key={workspace.id}>
                    <div className="application-list__item-header" key={workspace.id} onClick={this.goToWorkspace.bind(this, user, workspace)}>
                      <span className="text text--coursepicker-course-icon icon-books"></span>
                      <span className="text text--list-item-title">{workspace.name} {workspace.nameExtension && <span className="text text--list-item-title-extension">({workspace.nameExtension})</span>}</span> 
                      {workspace.studentAcessment ? getAcessment(this.props, workspace) : null}
                    </div>
                    {!workspace.studentAcessment ? 
                      <div className="application-list__item-body"> 
                        {getActivity(this.props, workspace)}
                      </div> : null }
                  </div>
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
          </div>
        })}
      </div>  

    // Todo fix the first sub-panel border-bottom stuff from guider. It should be removed from title only.
    
    return <BodyScrollKeeper hidden={this.props.records.location !== "RECORDS" || !!this.props.records.current}>
    
    <div className="application-sub-panel"></div>        
    <div className="application-sub-panel">
      {studentBasicInfo}
    </div>
    {studentRecords}
      
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
    records: state.records
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Records);