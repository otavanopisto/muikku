import WorkspaceNavbar from '~/components/base/workspace/navbar';
import ScreenContainer from '~/components/general/screen-container';

import * as React from 'react';
import Application from '~/components/discussion/body/application';

interface WorkspaceDiscussionBodyProps {
  workspaceUrl: string
}

interface WorkspaceDiscussionBodyState {

}

export default class WorkspaceDiscussionBody extends React.Component<WorkspaceDiscussionBodyProps, WorkspaceDiscussionBodyState> {
  render(){
    return (<div>
      <WorkspaceNavbar activeTrail="workspace-discussions" workspaceUrl={this.props.workspaceUrl}/>
      <Application/>
    </div>);
  }
}