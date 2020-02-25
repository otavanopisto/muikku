import * as React from 'react';
import {StateType} from '~/reducers';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import ApplicationList, { ApplicationListItem } from '~/components/general/application-list';
import BodyScrollLoader from '~/components/general/body-scroll-loader';
import Workspace from './workspaces/workspace';
import {i18nType} from '~/reducers/base/i18n';
import {CoursesStateType, WorkspaceCourseListType, WorkspaceCourseType} from '~/reducers/main-function/courses';
import { loadMoreCoursesFromServer, LoadMoreCoursesFromServerTriggerType } from '~/actions/main-function/courses';


interface WorkspacesProps {
  i18n: i18nType,
  organizationWorkspacesState: CoursesStateType,
  organizationWorkspacesHasMore: boolean,
  loadMoreCoursesFromServer: LoadMoreCoursesFromServerTriggerType,
  organizationWorkspaces: WorkspaceCourseListType
}

interface WorkspacesState {
}

class Workspaces extends BodyScrollLoader<WorkspacesProps, WorkspacesState> {
  
  constructor(props: WorkspacesProps){
    super(props);
    //once this is in state READY only then a loading more event can be triggered
    this.statePropertyLocation = "organizationWorkspacesState";
    //it will only call the function if this is true
    this.hasMorePropertyLocation = "organizationWorkspacesHasMore";
    //this is the function that will be called
    this.loadMoreTriggerFunctionLocation = "loadMoreCoursesFromServer";
  }
  
  render(){
    if (this.props.organizationWorkspacesState === "LOADING"){
      return null;
    } else if (this.props.organizationWorkspacesState === "ERROR"){
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    } else if (this.props.organizationWorkspaces.length === 0){
      return <div className="empty"><span>{this.props.i18n.text.get("plugin.coursepicker.searchResult.empty")}</span></div>
    }
    return (
        <ApplicationList>
        {this.props.organizationWorkspaces.map((workspace: WorkspaceCourseType)=>{
          return <Workspace key={workspace.id} course={workspace}/>
        })}
        {this.props.organizationWorkspacesState === "LOADING_MORE" ? <ApplicationListItem className="loader-empty"/> : null}
        </ApplicationList>
    );
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    organizationWorkspacesState: state.organizationCourses.state,
    organizationWorkspacesHasMore: state.organizationCourses.hasMore,
    organizationWorkspaces: state.organizationCourses.courses
  }
};


function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({loadMoreCoursesFromServer}, dispatch);
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Workspaces);
