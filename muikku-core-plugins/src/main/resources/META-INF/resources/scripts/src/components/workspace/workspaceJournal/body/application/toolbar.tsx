import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import {StateType} from '~/reducers';
import { ApplicationPanelToolbar } from '~/components/general/application-panel';
import { WorkspaceType } from '~/reducers/workspaces';

interface WorkspaceJournalsToolbarProps {
  i18n: i18nType,
  workspace: WorkspaceType
}

interface WorkspaceJournalsToolbarState {
  searchquery: string
}

class WorkspaceJournalsToolbar extends React.Component<WorkspaceJournalsToolbarProps, WorkspaceJournalsToolbarState> {
  render(){
      return (
        <ApplicationPanelToolbar/>
      )
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceJournalsToolbar);
