import WorkspaceNavbar from '~/components/base/workspace/navbar';
import ScreenContainer from '~/components/general/screen-container';

import * as React from 'react';

import '~/sass/elements/panel.scss';
import '~/sass/elements/footer.scss';

interface WorkspaceJournalBodyProps {
  workspaceUrl: string
}

interface WorkspaceJournalBodyState {

}

export default class WorkspaceJournalBody extends React.Component<WorkspaceJournalBodyProps, WorkspaceJournalBodyState> {
  render(){
    return (<div>
      <WorkspaceNavbar activeTrail="journal" workspaceUrl={this.props.workspaceUrl}/>
      <ScreenContainer viewModifiers="journal">
        
      </ScreenContainer>
    </div>);
  }
}