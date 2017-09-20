import MainFunctionNavbar from '../base/main-function/navbar';
import ScreenContainer from '../general/screen-container';

import AnnouncementsPanel from './body/announcements-panel';
import ContinueStudiesPanel from './body/continue-studies-panel';
import ImportantPanel from './body/important-panel';
import LastMessagesPanel from './body/last-messages-panel';
import WorkspacesPanel from './body/workspaces-panel';

import * as React from 'react';

export default class IndexBody extends React.Component {
  render(){
    return (<div className="embbed embbed-full">
      <MainFunctionNavbar activeTrail="index"/>
      <ScreenContainer>
        <div className="index ordered-container ordered-container-row ordered-container-responsive index-ordered-container-for-panels">
          <div className="ordered-container-item">
            <div className="index ordered-container index-ordered-container-for-panels-column">
              <ContinueStudiesPanel/>
              <WorkspacesPanel/>
            </div>
          </div>
          <div className="ordered-container-item">
            <div className="index ordered-container index-ordered-container-for-panels-column">
              <LastMessagesPanel/>
              <ImportantPanel/>
            </div>
          </div>
          <div className="ordered-container-item">
            <div className="index ordered-container index-ordered-container-for-panels-column">
              <AnnouncementsPanel/>
            </div>
          </div>
        </div>
      </ScreenContainer>
    </div>);
  }
}