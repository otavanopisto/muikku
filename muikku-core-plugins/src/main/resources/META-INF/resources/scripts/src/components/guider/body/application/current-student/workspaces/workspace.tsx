import { i18nType } from "~/reducers/base/i18n";
import * as React from "react";
import { WorkspaceType } from "~/reducers/main-function/workspaces";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import {StateType} from '~/reducers';

interface StudentWorkspaceProps {
  i18n: i18nType,
  workspace: WorkspaceType
}

interface StudentWorkspaceState {
  activitiesVisible: boolean
}

function CourseActivityRow(props: {
  i18n: i18nType,
  workspace: WorkspaceType,
  labelTranslationString: string,
  conditionalAttribute: string,
  givenDateAttribute?: string,
  mainAttribute: string
}){
  return <div className="gt-course-activity-row">
    <label>{props.i18n.text.get(props.labelTranslationString)}</label>
    <span>{((props.workspace as any)[props.mainAttribute][props.conditionalAttribute] as number) > 0 ? 
        (props.workspace as any)[props.mainAttribute][props.conditionalAttribute] + (props.givenDateAttribute ? " " + 
        props.i18n.time.format((props.workspace as any)[props.mainAttribute][props.givenDateAttribute]) : "") :
    "-"}</span>
  </div>
}

class StudentWorkspace extends React.Component<StudentWorkspaceProps, StudentWorkspaceState>{
  constructor(props: StudentWorkspaceProps){
    super(props);
    
    this.state = {
      activitiesVisible: false
    }
    
    this.toggleActivitiesVisible = this.toggleActivitiesVisible.bind(this);
  }
  toggleActivitiesVisible(){
    this.setState({
      activitiesVisible: !this.state.activitiesVisible
    })
  }
  render(){
    let workspace = this.props.workspace;
    return <div className="gt-course ft-01 flex-row">
      <div className="gt-course-details lg-flex-cell-full md-flex-cell-full sm-flex-cell-full">
        <div className="gt-course-details-container flex-row" onClick={this.toggleActivitiesVisible}>       
          <div className="gt-course-description lg-flex-cell-8 md-flex-cell-8 sm-flex-cell-full">
            <div className="gt-course-header-name">
              <span className="gt-course-long">{workspace.name}</span>
              {workspace.nameExtension && <span className="gt-course-extension">( {workspace.nameExtension} )</span>}
            </div>
          </div>               
          <div className="gt-course-activity-short lg-flex-cell-8 md-flex-cell-8 sm-flex-hide">
            <span title={this.props.i18n.text.get("plugin.guider.headerEvaluatedTitle", workspace.studentActivity.evaluablesDonePercent)}>{
              workspace.studentActivity.evaluablesDonePercent}%
            </span>
            <span> / </span>
            <span title={this.props.i18n.text.get("plugin.guider.headerExercisesTitle",workspace.studentActivity.exercisesDonePercent)}>{
              workspace.studentActivity.exercisesDonePercent}%
            </span>
          </div>
        </div>
        {this.state.activitiesVisible ? <div className="gt-course-activity flex-row">
          <h4>{this.props.i18n.text.get("plugin.guider.assessmentStateTitle")}</h4>      
          <div className="gt-course-activity-row">
            <label>{this.props.i18n.text.get("plugin.guider.assessmentStateLabel")}</label>
            <span>{(()=>{
              //HAX :D
              let text;
              switch (workspace.studentActivity.assessmentState){
                case "PENDING":
                case "PENDING_PASS":
                case "PENDING_FAIL":
                  text = "plugin.guider.assessmentState.PENDING";
                  break;
                case "PASS":
                  text = "plugin.guider.assessmentState.PASS";
                  break;
                case "FAIL":
                  text = "plugin.guider.assessmentState.FAIL";
                  break;
                default:
                  text = "plugin.guider.assessmentState.UNASSESSED";
                  break;
              }
              return this.props.i18n.text.get(text);
            })()}</span>
          </div>
            
          <h4>{this.props.i18n.text.get("plugin.guider.visitsTitle")}</h4>
          <CourseActivityRow labelTranslationString="plugin.guider.visitedLabel" conditionalAttribute="numVisits"
            givenDateAttribute="lastVisit" mainAttribute="studentActivity" {...this.props}/>

          <h4>{this.props.i18n.text.get("plugin.guider.journalEntriesLabel")}</h4>
          <CourseActivityRow labelTranslationString="plugin.guider.visitedLabel" conditionalAttribute="journalEntryCount"
            givenDateAttribute="lastJournalEntry" mainAttribute="studentActivity" {...this.props}/>
          
          <h4>{this.props.i18n.text.get("plugin.guider.discussionTitle")}</h4>
          <CourseActivityRow labelTranslationString="plugin.guider.discussionMessagesLabel" conditionalAttribute="messageCount"
            givenDateAttribute="latestMessage" mainAttribute="forumStatistics" {...this.props}/>
          
          <h4>{this.props.i18n.text.get("plugin.guider.evaluableAssignmentsTitle")}</h4>
          <CourseActivityRow labelTranslationString="plugin.guider.evaluablesUnansweredLabel" conditionalAttribute="evaluablesUnanswered"
            mainAttribute="studentActivity" {...this.props}/>
          <CourseActivityRow labelTranslationString="plugin.guider.evaluablesAnsweredLabel" conditionalAttribute="evaluablesAnswered"
            givenDateAttribute="evaluablesAnsweredLastDate" mainAttribute="studentActivity" {...this.props}/>
          <CourseActivityRow labelTranslationString="plugin.guider.evaluablesSubmittedLabel" conditionalAttribute="evaluablesSubmitted"
            givenDateAttribute="evaluablesSubmittedLastDate" mainAttribute="studentActivity" {...this.props}/>
          <CourseActivityRow labelTranslationString="plugin.guider.evaluablesFailedLabel" conditionalAttribute="evaluablesFailed"
            givenDateAttribute="evaluablesFailedLastDate" mainAttribute="studentActivity" {...this.props}/>
          <CourseActivityRow labelTranslationString="plugin.guider.evaluablesPassedLabel" conditionalAttribute="evaluablesPassed"
            givenDateAttribute="evaluablesPassedLastDate" mainAttribute="studentActivity" {...this.props}/>
          
          <h4>{this.props.i18n.text.get("plugin.guider.exerciseAssignmentsTitle")}</h4>
          <CourseActivityRow labelTranslationString="plugin.guider.exercisesUnansweredLabel" conditionalAttribute="exercisesUnanswered"
            mainAttribute="studentActivity" {...this.props}/>
          <CourseActivityRow labelTranslationString="plugin.guider.exercisesAnsweredLabel" conditionalAttribute="exercisesAnswered"
          givenDateAttribute="exercisesAnsweredLastDate" mainAttribute="studentActivity" {...this.props}/>
        </div> : null }
      </div>
    </div>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentWorkspace);