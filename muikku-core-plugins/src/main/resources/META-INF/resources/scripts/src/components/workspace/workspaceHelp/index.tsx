import WorkspaceNavbar from '~/components/base/workspace/navbar';
import ScreenContainer from '~/components/general/screen-container';

import * as React from 'react';

import HelpPanel from './help';
import MaterialEditor from '~/components/base/material-editor';

interface WorkspaceHelpBodyProps {
  workspaceUrl: string
}

interface WorkspaceHelpBodyState {
  editModeActive: boolean,
}

export default class WorkspaceHelpBody extends React.Component<WorkspaceHelpBodyProps, WorkspaceHelpBodyState> {
  constructor(props: WorkspaceHelpBodyProps){
    super(props);

    this.onOpenNavigation = this.onOpenNavigation.bind(this);
    this.toggleEditModeActive = this.toggleEditModeActive.bind(this);

    this.state = {
      editModeActive: true
    }
  }
  onOpenNavigation(){
    (this.refs.content as any).getWrappedInstance().refresh();
  }
  toggleEditModeActive() {
    this.setState({
      editModeActive: !this.state.editModeActive,
    });
  }
  render(){
    return (<div>
      <WorkspaceNavbar activeTrail="help" workspaceUrl={this.props.workspaceUrl} 
        editModeAvailable editModeActive={this.state.editModeActive} toggleEditModeActive={this.toggleEditModeActive}/>
      <ScreenContainer viewModifiers="workspace">
        <MaterialEditor/>
        <HelpPanel/>
      </ScreenContainer>
    </div>);
  }
}