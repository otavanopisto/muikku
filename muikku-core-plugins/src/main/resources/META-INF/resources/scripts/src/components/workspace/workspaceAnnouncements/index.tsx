import WorkspaceNavbar from '~/components/base/workspace/navbar';
import ScreenContainer from '~/components/general/screen-container';

import * as React from 'react';
import Application from '~/components/announcements/body/application';
import Aside from '~/components/announcements/body/aside';

interface WorkspaceAnnouncementsBodyProps {
  workspaceUrl: string
}

interface WorkspaceAnnouncementsBodyState {

}

export default class WorkspaceAnnouncementsBody extends React.Component<WorkspaceAnnouncementsBodyProps, WorkspaceAnnouncementsBodyState> {
  render(){
    let aside = <Aside />;
    return (<div>
      <WorkspaceNavbar navigation={aside} activeTrail="workspace-announcements" workspaceUrl={this.props.workspaceUrl}/>
      <ScreenContainer viewModifiers="workspace">
        <Application aside={aside}/>
      </ScreenContainer>
    </div>);
  }
}