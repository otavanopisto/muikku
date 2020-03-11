import * as React from 'react';
import {StateType} from '~/reducers';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import ApplicationList, { ApplicationListItem } from '~/components/general/application-list';
import BodyScrollLoader from '~/components/general/body-scroll-loader';
import Workspace from './workspaces/workspace';
import {i18nType} from '~/reducers/base/i18n';
// import { WorkspaceCourseListType, WorkspaceCourseType} from '~/reducers/main-function/courses';
import { LoadMoreOrganizationWorkspacesFromServer, LoadMoreOrganizationWorkspacesFromServerTriggerType } from '~/actions/workspaces';

// These are here for testing purposes only should be removed
import { loadMoreWorkspacesFromServer, LoadMoreWorkspacesFromServerTriggerType } from '~/actions/workspaces';


import {WorkspacesStateType, WorkspaceType, WorkspaceListType} from '~/reducers/workspaces';
import {} from '~/actions/workspaces';

interface OrganizationWorkspacesProps {
  i18n: i18nType,
  organizationWorkspacesState: WorkspacesStateType,
  organizationWorkspacesHasMore: boolean,
//  loadMoreOrganizationCoursesFromServer: LoadMoreOrganizationWorkspacesFromServerTriggerType,
  organizationWorkspaces: WorkspaceListType
}

interface OrganizationWorkspacesState {
}

class OrganizationWorkspaces extends BodyScrollLoader<OrganizationWorkspacesProps, OrganizationWorkspacesState> {
  
  constructor(props: OrganizationWorkspacesProps){
    super(props);
    //once this is in state READY only then a loading more event can be triggered
    this.statePropertyLocation = "organizationWorkspacesState";
    //it will only call the function if this is true
    this.hasMorePropertyLocation = "organizationWorkspacesHasMore";
    //this is the function that will be called
    this.loadMoreTriggerFunctionLocation = "loadMoreOrganizationCoursesFromServer";
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
        {this.props.organizationWorkspaces.map((workspace: WorkspaceType)=>{
          return <Workspace key={workspace.id} workspace={workspace}/>
        })}
        {this.props.organizationWorkspacesState === "LOADING_MORE" ? <ApplicationListItem className="loader-empty"/> : null}
        </ApplicationList>
    );
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    organizationWorkspacesState: state.organizationWorkspaces.state,
    organizationWorkspacesHasMore: state.organizationWorkspaces.hasMore,
    organizationWorkspaces: state.organizationWorkspaces.availableWorkspaces
  }
};


function mapDispatchToProps(dispatch: Dispatch<any>){
  // LoadMoreOrganizationWorkspacesFromServer
  return bindActionCreators({}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationWorkspaces);
