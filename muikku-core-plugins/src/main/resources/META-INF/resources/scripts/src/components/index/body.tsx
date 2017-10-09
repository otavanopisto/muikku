import MainFunctionNavbar from '../base/main-function/navbar';
import ScreenContainer from '../general/screen-container';

import AnnouncementsPanel from './body/announcements-panel';
import ContinueStudiesPanel from './body/continue-studies-panel';
import ImportantPanel from './body/important-panel';
import LastMessagesPanel from './body/last-messages-panel';
import WorkspacesPanel from './body/workspaces-panel';

import * as React from 'react';

import '~/sass/elements/container.scss';
import '~/sass/elements/ordered-container.scss';

export default class IndexBody extends React.Component<{},{}> {
  render(){
    return (<div className="container container--full">
      <MainFunctionNavbar activeTrail="index"/>
      <ScreenContainer>
        <div className="ordered-container ordered-container--row ordered-container--responsive ordered-container--index-panels">
          <div className="ordered-container__item">
            <div className="ordered-container ordered-container--index-column">
              <ContinueStudiesPanel/>
              <WorkspacesPanel/>
            </div>
          </div>
          <div className="ordered-container__item">
            <div className="ordered-container ordered-container--index-column">
              <LastMessagesPanel/>
              <ImportantPanel/>
            </div>
          </div>
          <div className="ordered-container__item">
            <div className="ordered-container ordered-container--index-column">
              <AnnouncementsPanel/>
            </div>
          </div>
        </div>
      </ScreenContainer>
    </div>);
  }
}