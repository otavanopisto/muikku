import WorkspaceNavbar from '~/components/base/workspace/navbar';
import ScreenContainer from '~/components/general/screen-container';

import * as React from 'react';

import Materials from './materials';
import MaterialEditor from '~/components/base/material-editor';
import TableOfContentsComponent from './content';

interface WorkspaceMaterialsBodyProps {
  workspaceUrl: string,
  onActiveNodeIdChange: (newId: number)=>any
}

interface WorkspaceMaterialsBodyState {
  editModeActive: boolean,
}

export default class WorkspaceMaterialsBody extends React.Component<WorkspaceMaterialsBodyProps, WorkspaceMaterialsBodyState> {
  constructor(props: WorkspaceMaterialsBodyProps){
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
    let navigationComponent = <TableOfContentsComponent editModeActive={this.state.editModeActive} ref="content"/>;
    return (<div>
      <WorkspaceNavbar activeTrail="materials" workspaceUrl={this.props.workspaceUrl}
        editModeAvailable editModeActive={this.state.editModeActive} toggleEditModeActive={this.toggleEditModeActive}/>
      <ScreenContainer viewModifiers="materials">
        <MaterialEditor/>
        <Materials onOpenNavigation={this.onOpenNavigation} editModeActive={this.state.editModeActive}
          navigation={navigationComponent} ref="materials" onActiveNodeIdChange={this.props.onActiveNodeIdChange}/>
      </ScreenContainer>
    </div>);
  }
}