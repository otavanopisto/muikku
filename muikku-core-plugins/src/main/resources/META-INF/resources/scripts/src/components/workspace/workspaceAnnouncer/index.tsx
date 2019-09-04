import WorkspaceNavbar from '~/components/base/workspace/navbar';
import ScreenContainer from '~/components/general/screen-container';

import * as React from 'react';
import Application from '~/components/announcer/body/application';
import Aside from '~/components/announcer/body/aside';

interface WorkspaceAnnouncerBodyProps {
  workspaceUrl: string
}

interface WorkspaceAnnouncerBodyState {
  editModeActive: boolean,
}

export default class WorkspaceAnnouncerBody extends React.Component<WorkspaceAnnouncerBodyProps, WorkspaceAnnouncerBodyState> {
  constructor(props: WorkspaceAnnouncerBodyProps){
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
    let aside = <Aside />;
    return (<div>
      <WorkspaceNavbar navigation={aside} activeTrail="workspace-announcer" workspaceUrl={this.props.workspaceUrl} 
        editModeAvailable editModeActive={this.state.editModeActive} toggleEditModeActive={this.toggleEditModeActive}/>
      <Application aside={aside}/>
    </div>);
  }
}