import WorkspaceNavbar from '~/components/base/workspace/navbar';
import ScreenContainer from '~/components/general/screen-container';

import * as React from 'react';

import HelpPanel from './help';

interface WorkspaceHelpBodyProps {
  workspaceUrl: string
}

interface WorkspaceHelpBodyState {

}

export default class WorkspaceHelpBody extends React.Component<WorkspaceHelpBodyProps, WorkspaceHelpBodyState> {
  render(){
    return (<div>
      <WorkspaceNavbar activeTrail="help" workspaceUrl={this.props.workspaceUrl}/>
      <ScreenContainer viewModifiers="workspace">
        <HelpPanel/>
      </ScreenContainer>
    </div>);
  }
}