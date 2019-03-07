import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as queryString from 'query-string';

import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/course.scss';
import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';

import '~/sass/elements/application-sub-panel.scss';
import '~/sass/elements/workspace-activity.scss';
import '~/sass/elements/file-uploader.scss';

import { RecordsType, TransferCreditType } from '~/reducers/main-function/records/records';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import Link from '~/components/general/link';
import { WorkspaceType, WorkspaceStudentAssessmentStateType, WorkspaceAssessementState } from '~/reducers/main-function/workspaces';
import { UserWithSchoolDataType } from '~/reducers/main-function/user-index';
import {StateType} from '~/reducers';
import { shortenGrade, getShortenGradeExtension } from '~/util/modifiers';
import ApplicationList, { ApplicationListItem, ApplicationListItemHeader } from '~/components/general/application-list';
import { MatriculationLink } from './matriculation-link';

let ProgressBarLine = require('react-progressbar.js').Line;

interface RecordsProps {
  i18n: i18nType,
  records: RecordsType
}

interface RecordsState {
}

let storedCurriculumIndex:any = {};

function getEvaluationRequestIfAvailable(props: RecordsProps, workspace: WorkspaceType){
  let assesmentState:WorkspaceAssessementState;
  let assesmentDate:string;
  if (workspace.studentAssessmentState && workspace.studentAssessmentState.state){
    assesmentState = workspace.studentAssessmentState.state;
    assesmentDate = workspace.studentAssessmentState.date;
  } else if (workspace.studentActivity && workspace.studentActivity.assessmentState){
    assesmentState = workspace.studentActivity.assessmentState.state;
    assesmentDate = workspace.studentActivity.assessmentState.date;
  }
  
  if (assesmentState === "pending" || assesmentState === "pending_pass" || assesmentState === "pending_fail"){
    return <div className="application-list__header-secondary">
      <span>{props.i18n.text.get("plugin.records.workspace.pending",props.i18n.time.format(assesmentDate))}</span>
      <span title={props.i18n.text.get("plugin.records.workspace.pending",props.i18n.time.format(assesmentDate))}
        className="application-list__indicator-badge application-list__indicator-badge--evaluation-request icon-assessment-pending"></span>
    </div>
  }

  return null;
}

function getTransferCreditValue(props: RecordsProps, transferCredit: TransferCreditType){
  let gradeId = [
    transferCredit.gradingScaleIdentifier,
    transferCredit.gradeIdentifier].join('-');
  let grade = props.records.grades[gradeId];
  return <div className="application-list__header-secondary">
    <span>{props.i18n.text.get("plugin.records.transferCreditsDate", props.i18n.time.format(transferCredit.date))}</span>
    <span title={props.i18n.text.get("plugin.records.transferCreditsDate", props.i18n.time.format(transferCredit.date)) +
      getShortenGradeExtension(grade.grade)} className={`application-list__indicator-badge application-list__indicator-badge-course ${grade.passing ? "state-PASSED" : "state-FAILED"}`}>
      {shortenGrade(grade.grade)}
    </span>
  </div>
}

function getAssessments(props: RecordsProps, workspace: WorkspaceType){
  if (workspace.studentAssessmentState && workspace.studentAssessmentState.grade){
    return <span className="application-list__header-secondary">
      <span>{props.i18n.text.get("plugin.records.workspace.evaluated", props.i18n.time.format(workspace.studentAssessmentState.date))}</span>
      <span title={props.i18n.text.get("plugin.records.workspace.evaluated", props.i18n.time.format(workspace.studentAssessmentState.date)) +
        getShortenGradeExtension(workspace.studentAssessmentState.grade)}
        className={`application-list__indicator-badge application-list__indicator-badge--course ${
          workspace.studentAssessmentState.state === "pass" || workspace.studentAssessmentState.state === "pending_pass" ? "state-PASSED" : "state-FAILED"}`}>
        {shortenGrade(workspace.studentAssessmentState.grade)}
      </span>
    </span>
  } else if (workspace.studentAssessmentState &&
    (workspace.studentAssessmentState.state === "incomplete" || workspace.studentAssessmentState.state === "fail")){
    let status = props.i18n.text.get(workspace.studentAssessmentState.state === "incomplete" ?
    		"plugin.records.workspace.incomplete" : "plugin.records.workspace.failed");
    return <span className="application-list__header-secondary">
      <span>{props.i18n.text.get("plugin.records.workspace.evaluated", props.i18n.time.format(workspace.studentAssessmentState.date))}</span>
      <span title={props.i18n.text.get("plugin.records.workspace.evaluated", props.i18n.time.format(workspace.studentAssessmentState.date)) + " - " + status}
        className={`application-list__indicator-badge application-list__indicator-badge--course ${workspace.studentAssessmentState.state === "incomplete" ? "state-INCOMPLETE" : "state-FAILED"}`}>
      {status[0].toLocaleUpperCase()}
    </span>
  </span>
  } else {
    return null;
  }
}

function getActivity(props: RecordsProps, workspace: WorkspaceType){
    if (!workspace.studentActivity){
      return null;
    } else if ((workspace.studentActivity.exercisesTotal + workspace.studentActivity.evaluablesTotal) === 0){
      return null;
    }
    let evaluablesCompleted = workspace.studentActivity.evaluablesPassed + workspace.studentActivity.evaluablesSubmitted +
      workspace.studentActivity.evaluablesFailed + workspace.studentActivity.evaluablesIncomplete;
    return <div className="workspace-activity workspace-activity--studies">
    
      {workspace.studentActivity.evaluablesTotal ? <ProgressBarLine containerClassName="workspace-activity__progressbar workspace-activity__progressbar--studies" initialAnimate options={{
        strokeWidth: 1,
        duration: 1000,
        color: "#ce01bd",
        trailColor: "#f5f5f5",
        trailWidth: 1,
        svgStyle: {width: "100%", height: "4px"},
        text: {
          className: "workspace-activity__progressbar-label",
          style: {
            left: workspace.studentActivity.evaluablesDonePercent === 0 ? "0%" : null,
            right: workspace.studentActivity.evaluablesDonePercent === 0 ? null : 100 - workspace.studentActivity.evaluablesDonePercent +  "%"
          }
        }
      }}
      strokeWidth={1} easing="easeInOut" duration={1000} color="#ce01bd" trailColor="#f5f5f5"
      trailWidth={1} svgStyle={{width: "100%", height: "4px"}}
      text={evaluablesCompleted + "/" + workspace.studentActivity.evaluablesTotal}
      progress={workspace.studentActivity.evaluablesDonePercent/100}/> : null}
    
      {workspace.studentActivity.exercisesTotal ? <ProgressBarLine containerClassName="workspace-activity__progressbar workspace-activity__progressbar--studies" initialAnimate options={{
        strokeWidth: 1,
        duration: 1000,
        color: "#ff9900",
        trailColor: "#f5f5f5",
        trailWidth: 1,
        svgStyle: {width: "100%", height: "4px"},
        text: {
          className: "workspace-activity__progressbar-label",
          style: {
            left: workspace.studentActivity.exercisesDonePercent === 0 ? "0%" : null,
            right: workspace.studentActivity.exercisesDonePercent === 0 ? null : 100 - workspace.studentActivity.exercisesDonePercent + "%"
          }
        }
      }}
      strokeWidth={1} easing="easeInOut" duration={1000} color="#ff9900" trailColor="#f5f5f5"
      trailWidth={1} svgStyle={{width: "100%", height: "4px"}}
      text={workspace.studentActivity.exercisesAnswered + "/" + workspace.studentActivity.exercisesTotal}
      progress={workspace.studentActivity.exercisesDonePercent/100}/> : null}
    </div>
}

class Records extends React.Component<RecordsProps, RecordsState> {
  constructor(props: RecordsProps){
    super(props);
    
    this.goToWorkspace = this.goToWorkspace.bind(this);
  }
  
  goToWorkspace(user: UserWithSchoolDataType, workspace: WorkspaceType) {
    window.location.hash = "#?u=" + user.userEntityId + "&i=" + encodeURIComponent(user.id) + "&w=" + workspace.id;
  }
    
  render(){
    
    if (this.props.records.userDataStatus === "LOADING"){
      return null;
    } else if (this.props.records.userDataStatus === "ERROR"){
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    }    
    
    if (!Object.keys(storedCurriculumIndex).length && this.props.records.curriculums.length){
      this.props.records.curriculums.forEach((curriculum)=>{
        storedCurriculumIndex[curriculum.identifier] = curriculum.name;
      });
    }
    
    let studentBasicInfo = <div className="application-sub-panel__body text">
      <div className="application-sub-panel__item">
        <div className="application-sub-panel__item-title">{this.props.i18n.text.get("plugin.records.studyStartDateLabel")}</div>
        <div className="application-sub-panel__item-data">
          <span>{this.props.records.studyStartDate ? 
            this.props.i18n.time.format(this.props.records.studyStartDate) : "-"}</span>
        </div>
      </div>
      <div className="application-sub-panel__item">
        <div className="application-sub-panel__item-title">{this.props.i18n.text.get(this.props.records.studyEndDate ? "plugin.records.studyEndDateLabel" :
          "plugin.records.studyTimeEndLabel")}</div>
        <div className="application-sub-panel__item-data">
          <span>{this.props.records.studyEndDate || this.props.records.studyTimeEnd ? 
            this.props.i18n.time.format(this.props.records.studyEndDate || this.props.records.studyTimeEnd) : "-"}</span>
        </div>
      </div>
    </div>
    
    let studentRecords = <div className="application-sub-panel">
        {this.props.records.userData.map((data)=>{
          let user = data.user;
          let records = data.records;

          return <div className="react-required-container" key={data.user.id}>
          <div className="application-sub-panel__header">{user.studyProgrammeName}</div>
          <div className="application-sub-panel__body">
            {records.length ? records.map((record, index)=>{
              return <ApplicationList key={record.groupCurriculumIdentifier || index}>
                {record.groupCurriculumIdentifier ? <div className="application-list__header-container"><h3 className="application-list__header">{storedCurriculumIndex[record.groupCurriculumIdentifier]}</h3></div> : null}  
                  {record.workspaces.map((workspace)=>{
                    //Do we want an special way to display all these different states? passed is very straightforward but failed and
                    //incomplete might be difficult to understand
                    let extraClassNameState = "";
                    if (workspace.studentAssessmentState.state === "pass"){
                      extraClassNameState = "state-PASSED"
                    } else if (workspace.studentAssessmentState.state === "fail"){
                      extraClassNameState = "state-FAILED"
                    } else if (workspace.studentAssessmentState.state === "incomplete"){
                      extraClassNameState = "state-INCOMPLETE"
                    }
                    return <ApplicationListItem className={`course course--studies ${extraClassNameState}`} key={workspace.id} onClick={this.goToWorkspace.bind(this, user, workspace)}>
                      <ApplicationListItemHeader modifiers="course" key={workspace.id}>
                        <span className="application-list__header-icon icon-books"></span>
                        <span className="application-list__header-primary">{workspace.name} {workspace.nameExtension ? "(" + workspace.nameExtension + ")" : null}</span> 
                        {getEvaluationRequestIfAvailable(this.props, workspace)}
                        {getAssessments(this.props, workspace)}
                        {getActivity(this.props, workspace)}
                      </ApplicationListItemHeader>
                    </ApplicationListItem>
                  })}
                {record.transferCredits.length ? 
                  <div className="application-list__header-container"><h3 className="application-list__header">{this.props.i18n.text.get("plugin.records.transferCredits")} ({storedCurriculumIndex[record.groupCurriculumIdentifier]})</h3></div> : null}
                    {record.transferCredits.map((credit)=>{
                      return <ApplicationListItem className="course course--credits" key={credit.identifier}>
                        <ApplicationListItemHeader modifiers="course">
                          <span className="application-list__header-icon icon-books"></span>
                          <span className="application-list__header-primary">{credit.courseName}</span>
                          {getTransferCreditValue(this.props, credit)}
                        </ApplicationListItemHeader>
                      </ApplicationListItem>
                    })}
              </ApplicationList>
            }) : <h4>{this.props.i18n.text.get("TODO no records")}</h4>}
          </div>
          </div>
        })}
      </div>

    // Todo fix the first sub-panel border-bottom stuff from guider. It should be removed from title only.
    
    return <BodyScrollKeeper hidden={this.props.records.location !== "records" || !!this.props.records.current}>

    <MatriculationLink i18n={this.props.i18n} />
    
    <div className="application-sub-panel application-sub-panel--basic">
      {studentBasicInfo}
    </div>
    {studentRecords}
    
    <div className="application-sub-panel">
      <div className="application-sub-panel__header">{this.props.i18n.text.get("plugin.records.files.title")}</div>
      <div className="application-sub-panel__body">
      {this.props.records.files.length ?
        <ApplicationList className="uploaded-files text">
          {this.props.records.files.map((file)=>{
            return <ApplicationListItem className="uploaded-files__item" key={file.id}>
              <span className="uploaded-files__item-attachment-icon icon-attachment"></span>
              <Link className="uploaded-files__item-title" href={`/rest/records/files/${file.id}/content`} openInNewTab={file.title}>{file.title}</Link>
            </ApplicationListItem>
          })}
        </ApplicationList> :
        <div className="file-uploader__files-container text">{this.props.i18n.text.get("plugin.records.files.empty")}</div>
      }
      </div>
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
