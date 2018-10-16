import WorkspaceNavbar from '~/components/base/workspace/navbar';
import ScreenContainer from '~/components/general/screen-container';

import * as React from 'react';

import WorkspaceHomeHeader from './header';
import WorkspaceTeachers from './teachers';
import WorkspaceAnnouncements from './announcements';

interface WorkspaceHomeBodyProps {
  workspaceUrl: string
}

interface WorkspaceHomeBodyState {

}

export default class WorkspaceHomeBody extends React.Component<WorkspaceHomeBodyProps, WorkspaceHomeBodyState> {
  render(){
    return (<div>
      <WorkspaceNavbar activeTrail="index" workspaceUrl={this.props.workspaceUrl}/>
      <ScreenContainer viewModifiers="workspace">
        <WorkspaceHomeHeader/>
        <section>
          <WorkspaceTeachers/>
        </section>
        <section>
          <WorkspaceAnnouncements/>
        </section>
      </ScreenContainer>
    </div>);
  }
}