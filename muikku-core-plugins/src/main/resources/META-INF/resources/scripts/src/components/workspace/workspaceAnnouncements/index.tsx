import WorkspaceNavbar from '~/components/base/workspace/navbar';
import ScreenContainer from '~/components/general/screen-container';

import * as React from 'react';
import Application from '~/components/announcements/body/application';
import Aside from '~/components/announcements/body/aside';

interface WorkspaceAnnouncementsBodyProps {
  workspaceUrl: string
}

interface WorkspaceAnnouncementsBodyState {
  editModeActive: boolean,
}

export default class WorkspaceAnnouncementsBody extends React.Component<WorkspaceAnnouncementsBodyProps, WorkspaceAnnouncementsBodyState> {
  constructor(props: WorkspaceAnnouncementsBodyProps){
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
      <WorkspaceNavbar navigation={aside} activeTrail="workspace-announcements" workspaceUrl={this.props.workspaceUrl}
        editModeAvailable editModeActive={this.state.editModeActive} toggleEditModeActive={this.toggleEditModeActive}/>
      <ScreenContainer viewModifiers="workspace">
        <Application aside={aside}/>
      </ScreenContainer>
    </div>);
  }
}