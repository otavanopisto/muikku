import * as React from 'react';
import {useRef, useCallback} from "react"
import { StateType } from '~/reducers';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import ApplicationList, { ApplicationListItem } from '~/components/general/application-list';
import BodyScrollLoader from '~/components/general/body-scroll-loader';
import Workspace from './workspaces/workspace';
import { i18nType } from '~/reducers/base/i18n';
import { loadMoreOrganizationWorkspacesFromServer, LoadMoreWorkspacesFromServerTriggerType } from '~/actions/workspaces';

import workspaces, { WorkspacesStateType, WorkspaceType, WorkspaceListType } from '~/reducers/workspaces';

interface OrganizationWorkspacesProps {
  i18n: i18nType,
  workspacesState: WorkspacesStateType,
  workspacesHasMore: boolean,
  loadMoreOrganizationWorkspacesFromServer: LoadMoreWorkspacesFromServerTriggerType,
  workspaces: WorkspaceListType
}

interface OrganizationWorkspacesState {
}

class OrganizationWorkspaces extends React.Component<OrganizationWorkspacesProps, OrganizationWorkspacesState> {

  private observer = useRef();
  private lastWorkspaceRef = useCallback(node => {
    console.log(node);
  }, []);


  constructor(props: OrganizationWorkspacesProps) {
    super(props);
    // //once this is in state READY only then a loading more event can be triggered
    // this.statePropertyLocation = "workspacesState";
    // //it will only call the function if this is true
    // this.hasMorePropertyLocation = "workspacesHasMore";
    // //this is the function that will be called
    // this.loadMoreTriggerFunctionLocation = "loadMoreOrganizationWorkspacesFromServer";
  }

  render() {
    if (this.props.workspacesState === "LOADING") {
      return null;
    } else if (this.props.workspacesState === "ERROR") {
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    } else if (this.props.workspaces.length === 0) {
      return <div className="empty"><span>{this.props.i18n.text.get("plugin.coursepicker.searchResult.empty")}</span></div>
    }
    return (
      <ApplicationList>
        {this.props.workspaces.map((workspace: WorkspaceType, index) => {
          if(workspaces.length === index + 1) {
            return <Workspace ref={this.lastWorkspaceRef} key={workspace.id} workspace={workspace} />
          } else {
            return <Workspace ref={this.lastWorkspaceRef} key={workspace.id} workspace={workspace} />
          }
        })}
        {this.props.workspacesState === "LOADING_MORE" ? <ApplicationListItem className="loader-empty" /> : null}
      </ApplicationList>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    workspacesState: state.organizationWorkspaces.state,
    workspacesHasMore: state.organizationWorkspaces.hasMore,
    workspaces: state.organizationWorkspaces.availableWorkspaces,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ loadMoreOrganizationWorkspacesFromServer }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationWorkspaces);
