import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as queryString from 'query-string';
import {i18nType} from '~/reducers/base/i18n';
import '~/sass/elements/course.scss';
import '~/sass/elements/activity-badge.scss';
import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/application-sub-panel.scss';
import '~/sass/elements/workspace-activity.scss';
import '~/sass/elements/file-uploader.scss';
import { RecordsType, TransferCreditType } from '~/reducers/main-function/records/records';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import Link from '~/components/general/link';
import { WorkspaceType, WorkspaceStudentAssessmentsType, WorkspaceAssessementState } from '~/reducers/main-function/workspaces';
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
  sortDirectionWorkspaces? : string, 
  sortDirectionRecords? : string,
  sortedWorkspaces? : any
  sortedRecords? : any
}

let storedCurriculumIndex:any = {};

function getEvaluationRequestIfAvailable(props: RecordsProps, workspace: WorkspaceType){
  let assesmentState:WorkspaceAssessementState;
  let assesmentDate:string;
  if (workspace.studentAssessments && workspace.studentAssessments.assessmentState){
    assesmentState = workspace.studentAssessments.assessmentState;
    assesmentDate = workspace.studentAssessments.assessmentStateDate;
  } else if (workspace.studentActivity && workspace.studentActivity.assessmentState){
    assesmentState = workspace.studentActivity.assessmentState.state;
    assesmentDate = workspace.studentActivity.assessmentState.date;
  }
  
  if (assesmentState === "pending" || assesmentState === "pending_pass" || assesmentState === "pending_fail"){
    return <span title={props.i18n.text.get("plugin.records.workspace.pending",props.i18n.time.format(assesmentDate))} className="application-list__indicator-badge application-list__indicator-badge--evaluation-request icon-assessment-pending"></span>
  }
  return null;
}

function getTransferCreditValue(props: RecordsProps, transferCredit: TransferCreditType){
  let gradeId = [
    transferCredit.gradingScaleIdentifier,
    transferCredit.gradeIdentifier].join('-');
  let grade = props.records.grades[gradeId];
  return <span title={props.i18n.text.get("plugin.records.transferCreditsDate", props.i18n.time.format(transferCredit.date)) +
      getShortenGradeExtension(grade.grade)} className={`application-list__indicator-badge application-list__indicator-badge-course ${grade.passing ? "state-PASSED" : "state-FAILED"}`}>
      {shortenGrade(grade.grade)}
    </span>
}

function getAssessments(props: RecordsProps, workspace: WorkspaceType){
  if (workspace.studentAssessments.assessments.length){
    let assessment = workspace.studentAssessments.assessments[0];
    if (!assessment){
      return null;
    }
    let gradeId = [
      assessment.gradingScaleSchoolDataSource,
      assessment.gradingScaleIdentifier,
      assessment.gradeSchoolDataSource,
      assessment.gradeIdentifier].join('-');
    let grade = props.records.grades[gradeId];
    return <span title={props.i18n.text.get("plugin.records.workspace.evaluated", props.i18n.time.format(assessment.evaluated)) +
        getShortenGradeExtension(grade.grade)} className={`application-list__indicator-badge application-list__indicator-badge--course ${assessment.passed ? "state-PASSED" : "state-FAILED"}`}>
        {shortenGrade(grade.grade)}
      </span>    
  } else if (workspace.studentAssessments.assessmentState &&
    (workspace.studentAssessments.assessmentState === "incomplete" || workspace.studentAssessments.assessmentState === "fail")){
    let status = props.i18n.text.get(workspace.studentAssessments.assessmentState === "incomplete" ?
        "plugin.records.workspace.incomplete" : "plugin.records.workspace.failed");
    return <span title={props.i18n.text.get("plugin.records.workspace.evaluated", props.i18n.time.format(workspace.studentAssessments.assessmentStateDate)) + " - " + status} className={`application-list__indicator-badge application-list__indicator-badge--course ${workspace.studentAssessments.assessmentState === "incomplete" ? "state-INCOMPLETE" : "state-FAILED"}`}>
      {status[0].toLocaleUpperCase()}
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
    return <div className="activity-badge">
        {workspace.studentActivity.evaluablesTotal ? <div  title={props.i18n.text.get("plugin.records.workspace.activity.assignment.title", workspace.studentActivity.evaluablesDonePercent)} className="activity-badge__item activity-badge__item--assignment">
          <div className={"activity-badge__unit-bar activity-badge__unit-bar--" + workspace.studentActivity.evaluablesDonePercent}></div>
        </div>  : <div className="activity-badge__item activity-badge__item--empty"></div> }    
        {workspace.studentActivity.exercisesTotal ? <div title={props.i18n.text.get("plugin.records.workspace.activity.exercise.title", workspace.studentActivity.exercisesDonePercent)} className="activity-badge__item activity-badge__item--exercise">
          <div className={"activity-badge__unit-bar activity-badge__unit-bar--" + workspace.studentActivity.exercisesDonePercent}></div>
        </div> : <div className="activity-badge__item activity-badge__item--empty"></div>}
      </div>
}

class Records extends React.Component<RecordsProps, RecordsState> {
  
  constructor(props: RecordsProps){
    super(props);
    this.goToWorkspace = this.goToWorkspace.bind(this);
    this.state = {sortDirectionWorkspaces : "desc", sortDirectionRecords: "desc"};
  }
  
  goToWorkspace(user: UserWithSchoolDataType, workspace: WorkspaceType) {
    window.location.hash = "#?u=" + user.userEntityId + "&i=" + encodeURIComponent(user.id) + "&w=" + workspace.id;
  }
 
 
  sortBy (data: any, key: string, direction: string) {
    data.sort(
        (a: any, b: any) => {
          if (a[key] < b[key])
           return direction === "asc" ?  -1 : 1;
          if (a[key] > b[key]) 
           return direction === "asc" ?  1 : -1;
          return 0;      
        }    
    )
  }
  
  sortWorkspaces(data: any){
    let key = "name";
    let sortDirection = this.state.sortDirectionWorkspaces;
    let sortedData = this.sortBy(data, key, sortDirection);

      this.setState({
        sortDirectionWorkspaces : this.state.sortDirectionWorkspaces === "asc" ? "desc" : "asc",
        sortedWorkspaces : sortedData
      });
  }

  sortRecords(data: any){
    let key = "courseName";
    let sortDirection = this.state.sortDirectionRecords;  
    let sortedData = this.sortBy(data, key, sortDirection);

      this.setState({
        sortDirectionRecords : this.state.sortDirectionRecords === "asc" ? "desc" : "asc",
        sortedRecords : sortedData
      });
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
    let studentRecords = <div className="application-sub-panel">
        {this.props.records.userData.map((data)=>{
          let user = data.user;
          let records = data.records;
          return <div className="react-required-container" key={data.user.id}>
          <div className="application-sub-panel__header">{user.studyProgrammeName}</div>
          <div className="application-sub-panel__body">
            {records.length ? records.map((record, index)=>{
              return <ApplicationList key={record.groupCurriculumIdentifier || index}>
                {record.groupCurriculumIdentifier ? <div onClick={this.sortWorkspaces.bind(this, record.workspaces)} className="application-list__header-container application-list__header-container--sorter">
                  <h3 className="application-list__header application-list__header--sorter">{storedCurriculumIndex[record.groupCurriculumIdentifier]}</h3>
                  <div className={`icon-sort-alpha-${this.state.sortDirectionWorkspaces === 'asc' ? 'desc' : 'asc'}`}></div>                
                </div> : null}  
                {record.workspaces.map((workspace)=>{
                  //Do we want an special way to display all these different states? passed is very straightforward but failed and
                  //incomplete might be difficult to understand
                  let extraClassNameState = "";
                  if (workspace.studentAssessments.assessmentState === "pass"){
                    extraClassNameState = "state-PASSED"
                  } else if (workspace.studentAssessments.assessmentState === "fail"){
                    extraClassNameState = "state-FAILED"
                  } else if (workspace.studentAssessments.assessmentState === "incomplete"){
                    extraClassNameState = "state-INCOMPLETE"
                  }
                  return <ApplicationListItem className={`course course--studies ${extraClassNameState}`} key={workspace.id} onClick={this.goToWorkspace.bind(this, user, workspace)}>
                    <ApplicationListItemHeader modifiers="course" key={workspace.id}>
                      <span className="application-list__header-icon icon-books"></span>
                      <span className="application-list__header-primary">{workspace.name} {workspace.nameExtension ? "(" + workspace.nameExtension + ")" : null}</span>
                      <div className="application-list__header-secondary">
                        {getEvaluationRequestIfAvailable(this.props, workspace)}
                        {getAssessments(this.props, workspace)}
                        {getActivity(this.props, workspace)}
                      </div>
                    </ApplicationListItemHeader>
                  </ApplicationListItem>  
                })}
                {record.transferCredits.length ? 
                  <div className="application-list__header-container application-list__header-container--sorter" onClick={this.sortRecords.bind(this, record.transferCredits)}>
                    <h3 className="application-list__header application-list__header--sorter">{this.props.i18n.text.get("plugin.records.transferCredits")} ({storedCurriculumIndex[record.groupCurriculumIdentifier]})</h3>
                    <div className={`icon-sort-alpha-${this.state.sortDirectionRecords === 'asc' ? 'desc' : 'asc'}`}></div>                    
                  </div> : null}
                  {record.transferCredits.map((credit)=>{
                    return <ApplicationListItem className="course course--credits" key={credit.identifier}>
                      <ApplicationListItemHeader modifiers="course">
                        <span className="application-list__header-icon icon-books"></span>  
                        <span className="application-list__header-primary">{credit.courseName}</span>
                        <div className="application-list__header-secondary">
                          {getTransferCreditValue(this.props, credit)}
                        </div>
                      </ApplicationListItemHeader>
                    </ApplicationListItem>
                  })}
            </ApplicationList>
            }) : <h4>{this.props.i18n.text.get("plugin.records.records.empty")}</h4>}
          </div>
          </div>
        })}
      </div>  
    // Todo fix the first sub-panel border-bottom stuff from guider. It should be removed from title only.
    
    return <BodyScrollKeeper hidden={this.props.records.location !== "records" || !!this.props.records.current}>
    <MatriculationLink i18n={this.props.i18n} />
    <div className="application-panel__content-header">{this.props.i18n.text.get("plugin.records.records.title")}</div>
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