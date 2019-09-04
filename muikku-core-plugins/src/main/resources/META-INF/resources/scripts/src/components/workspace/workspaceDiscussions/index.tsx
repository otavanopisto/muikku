import WorkspaceNavbar from '~/components/base/workspace/navbar';
import ScreenContainer from '~/components/general/screen-container';

import * as React from 'react';
import Application from '~/components/discussion/body/application';

interface WorkspaceDiscussionBodyProps {
  workspaceUrl: string
}

interface WorkspaceDiscussionBodyState {
  editModeActive: boolean,
}

export default class WorkspaceDiscussionBody extends React.Component<WorkspaceDiscussionBodyProps, WorkspaceDiscussionBodyState> {
  constructor(props: WorkspaceDiscussionBodyProps){
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
      <WorkspaceNavbar activeTrail="workspace-discussions" workspaceUrl={this.props.workspaceUrl}
        editModeAvailable editModeActive={this.state.editModeActive} toggleEditModeActive={this.toggleEditModeActive}/>
      <Application/>
    </div>);
  }
}