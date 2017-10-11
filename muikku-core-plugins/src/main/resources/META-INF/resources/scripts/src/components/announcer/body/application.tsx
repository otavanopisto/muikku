import * as React from 'react';
import {connect, Dispatch} from 'react-redux';

import ApplicationPanel from '~/components/general/application-panel';
import HoverButton from '~/components/general/hover-button';
import Dropdown from '~/components/general/dropdown';
import Link from '~/components/general/link';
import Toolbar from './application/toolbar';
{/*import NewAnnouncement from './application/new-announcement';*/}


import {i18nType} from '~/reducers/base/i18n';


import '~/sass/elements/text.scss';
import '~/sass/elements/link.scss';
import '~/sass/elements/container.scss';

{/* Application panel's css */}

import '~/sass/elements/application-panel.scss';
import '~/sass/elements/loaders.scss';

interface AnnouncerApplicationProps {
  navigation: React.ReactElement<any>,
  i18n: i18nType
}

interface AnnouncerApplicationState {

}

{/*      <div className="application-panel application-panel--announcer">
  <div className="application-panel__container">                
    <div className="application-panel__header">
      <div className="application-panel__helper-container"></div>
      <div className="application-panel__main-container"></div>
    </div>          
    <div className="application-panel__body">
      <div className="application-panel__actions">
        <div className="application-panel__helper-container"></div>
        <div className="application-panel__main-container"></div>
      </div>
      <div className="application-panel__content">
        <div className="application-panel__helper-container"></div>
        <div className="application-panel__main-container"></div>
      </div>
    </div>
  </div>
</div>
*/ }


export default class AnnouncerApplication extends React.Component<AnnouncerApplicationProps, AnnouncerApplicationState>{

  render(){
        let title = <h2 className="text text--application-title">{this.props.i18n.text.get('plugin.communicator.pageTitle')}</h2>
        let icon = <Dropdown modifier="communicator-settings" items={[
          closeDropdown=><Link className="link link--full" >
            <span>{this.props.i18n.text.get("plugin.communicator.settings.signatures")}</span>
          </Link>
        ]}>
          <Link className="button-pill button-pill--communicator-settings">
            <span className="icon icon-settings"></span>
          </Link>
        </Dropdown>
        let primaryOption = <a className="button button--communicator-new-message">
        {this.props.i18n.text.get('plugin.communicator.newMessage.label')}
        </a>
        let toolbar = <Toolbar/>
          
        //The message view actually appears on top and it's not a replacement, this makes it easier to go back without having to refresh from the server
        return (<div className="container container--full">
          <ApplicationPanel modifier="communicator" toolbar={toolbar} title={title} icon={icon} primaryOption={primaryOption} navigation={this.props.navigation}>
      
          </ApplicationPanel>
        </div>);
  }
}

