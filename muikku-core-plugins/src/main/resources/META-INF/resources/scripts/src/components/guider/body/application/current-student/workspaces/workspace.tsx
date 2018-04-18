import { i18nType } from "~/reducers/base/i18n";
import * as React from "react";
import { WorkspaceType } from "~/reducers/main-function/workspaces";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import {StateType} from '~/reducers';
import '~/sass/elements/application-list.scss';

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
  return <div className="application-sub-panel__item">
    <div className="application-sub-panel__item-title">{props.i18n.text.get(props.labelTranslationString)}</div>
    <div className="application-sub-panel__item-data">
      <span className="text text--guider-profile-value">{((props.workspace as any)[props.mainAttribute][props.conditionalAttribute] as number) > 0 ? 
        (props.workspace as any)[props.mainAttribute][props.conditionalAttribute] + (props.givenDateAttribute ? ", " + 
        props.i18n.time.format((props.workspace as any)[props.mainAttribute][props.givenDateAttribute]) : "") :
    "-"}</span></div>
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
    
    let stateText;
    let extraClasses = "";
    switch (workspace.studentActivity.assessmentState.state){
      case "pending":
      case "pending_pass":
      case "pending_fail":
        stateText = "plugin.guider.assessmentState.PENDING";
        extraClasses = "course--assessment-pending";
        break;
      case "pass":
        stateText = "plugin.guider.assessmentState.PASS";
        extraClasses = "course--assessment-pass";
        break;
      case "fail":
        stateText = "plugin.guider.assessmentState.FAIL";
        extraClasses = "course--assessment-fail";
        break;
      default:
        stateText = "plugin.guider.assessmentState.UNASSESSED";
        break;
    }
    let resultingStateText = this.props.i18n.text.get(stateText);
    if (workspace.studentActivity.assessmentState.date){
      resultingStateText += " - " + this.props.i18n.time.format(workspace.studentActivity.assessmentState.date);
    }
    
    return <div className={`application-list__item course ${this.state.activitiesVisible ? "course--open" : ""} ${extraClasses}`} onClick={this.toggleActivitiesVisible}>
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
              
        {this.state.activitiesVisible ? <div className="application-sub-panel text">      
          <div className="application-sub-panel__body">  
            <div className="application-sub-panel__item">
              <div className="application-sub-panel__item-title"> {this.props.i18n.text.get("plugin.guider.assessmentStateLabel")}</div>        
              <div className="application-sub-panel__item-data">
                <span className="text text--guider-profile-value">{resultingStateText}</span></div>
              </div>              

                
            <CourseActivityRow labelTranslationString="plugin.guider.visitedLabel" conditionalAttribute="numVisits"
              givenDateAttribute="lastVisit" mainAttribute="studentActivity" {...this.props}/>  
            
            <h4 className="application-sub-panel__item-header">{this.props.i18n.text.get("plugin.guider.journalEntriesLabel")}</h4>
            
            <CourseActivityRow labelTranslationString="plugin.guider.visitedLabel" conditionalAttribute="journalEntryCount"
              givenDateAttribute="lastJournalEntry" mainAttribute="studentActivity" {...this.props}/>
            
            <h4 className="application-sub-panel__item-header">{this.props.i18n.text.get("plugin.guider.discussionTitle")}</h4>
                      
            <CourseActivityRow labelTranslationString="plugin.guider.discussionMessagesLabel" conditionalAttribute="messageCount"
              givenDateAttribute="latestMessage" mainAttribute="forumStatistics" {...this.props}/>
            
            <h4 className="application-sub-panel__item-header">{this.props.i18n.text.get("plugin.guider.evaluableAssignmentsTitle")}</h4>  
            
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
            
            <h4 className="application-sub-panel__item-header">{this.props.i18n.text.get("plugin.guider.exerciseAssignmentsTitle")}</h4>
            
            <CourseActivityRow labelTranslationString="plugin.guider.exercisesUnansweredLabel" conditionalAttribute="exercisesUnanswered"
              mainAttribute="studentActivity" {...this.props}/>
            <CourseActivityRow labelTranslationString="plugin.guider.exercisesAnsweredLabel" conditionalAttribute="exercisesAnswered"
            givenDateAttribute="exercisesAnsweredLastDate" mainAttribute="studentActivity" {...this.props}/>

          </div>
        </div> : null }
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