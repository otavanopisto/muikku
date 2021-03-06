import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import ApplicationPanel from '~/components/general/application-panel/application-panel';
import Announcements from './application/announcements';
import AnnouncementView from './application/announcement-view';
import HoverButton from '~/components/general/hover-button';
import Button from '~/components/general/button';
import Toolbar from './application/toolbar';
import NewEditAnnouncement from '../dialogs/new-edit-announcement';
import {StateType} from '~/reducers';

import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/link.scss';

import '~/sass/elements/application-panel.scss';
import '~/sass/elements/loaders.scss';

interface AnnouncerApplicationProps {
  aside: React.ReactElement<any>,
  i18n: i18nType
}

interface AnnouncerApplicationState {
}

class AnnouncerApplication extends React.Component<AnnouncerApplicationProps, AnnouncerApplicationState>{
  render(){
        let title = this.props.i18n.text.get('plugin.announcer.pageTitle')
        let primaryOption = <NewEditAnnouncement><Button buttonModifiers="primary-function">
          {this.props.i18n.text.get('plugin.announcer.button.create')}
        </Button></NewEditAnnouncement>
        let toolbar = <Toolbar />

        //The message view actually appears on top and it's not a replacement, this makes it easier to go back without having to refresh from the server
        return (<div className="application-panel-wrapper">
          <ApplicationPanel modifier="announcer" toolbar={toolbar} title={title} primaryOption={primaryOption} asideBefore={this.props.aside}>
            <Announcements/>
            <AnnouncementView/>
          </ApplicationPanel>
          <NewEditAnnouncement><HoverButton icon="plus" modifier="new-announcement"/></NewEditAnnouncement>
        </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n
  }
};

const mapDispatchToProps = (dispatch: Dispatch<any>)=>{
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnnouncerApplication);
