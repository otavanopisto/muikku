import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/message.scss';
import BodyScrollLoader from '~/components/general/body-scroll-loader';
import SelectableList from '~/components/general/selectable-list';
import {i18nType} from '~/reducers/base/i18n';
import Course from './courses/course';
import {StateType} from '~/reducers';
import ApplicationList, { ApplicationListItem } from '~/components/general/application-list';
import { loadMoreWorkspacesFromServer, LoadMoreWorkspacesFromServerTriggerType } from '~/actions/workspaces';
import { WorkspacesStateType, WorkspaceListType, WorkspaceType } from '~/reducers/workspaces';

interface CoursepickerWorkspacesProps {
  i18n: i18nType,
  workspacesState: WorkspacesStateType,
  workspacesHasMore: boolean,
  loadMoreWorkspacesFromServer: LoadMoreWorkspacesFromServerTriggerType,
  workspaces: WorkspaceListType
}

interface CoursepickerWorkspacesState {
}


class CoursepickerWorkspaces extends BodyScrollLoader<CoursepickerWorkspacesProps, CoursepickerWorkspacesState> {
  constructor(props: CoursepickerWorkspacesProps){
    super(props);
    
    //once this is in state READY only then a loading more event can be triggered
    this.statePropertyLocation = "workspacesState";
    //it will only call the function if this is true
    this.hasMorePropertyLocation = "workspacesHasMore";
    //this is the function that will be called
    this.loadMoreTriggerFunctionLocation = "loadMoreWorkspacesFromServer";
  }

  render(){
    if (this.props.workspacesState === "LOADING"){
      return null;
    } else if (this.props.workspacesState === "ERROR"){
      //TODO ERRORMSG: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    } else if (this.props.workspaces.length === 0){
      return <div className="empty"><span>{this.props.i18n.text.get("plugin.coursepicker.searchResult.empty")}</span></div>
    }
    
    return (<ApplicationList>
      {this.props.workspaces.map((workspace: WorkspaceType)=>{
        return <Course key={workspace.id} workspace={workspace}/>
      })}
      {this.props.workspacesState === "LOADING_MORE" ? <ApplicationListItem className="loader-empty"/> : null}
    </ApplicationList>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspacesState: state.workspaces.state,
    workspacesHasMore: state.workspaces.hasMore,
    workspaces: state.workspaces.availableWorkspaces
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({loadMoreWorkspacesFromServer}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoursepickerWorkspaces);