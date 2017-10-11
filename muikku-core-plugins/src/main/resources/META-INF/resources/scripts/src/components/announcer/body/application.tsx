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
  aside: React.ReactElement<any>,
  i18n: i18nType
}

interface AnnouncerApplicationState {

}


class AnnouncerApplication extends React.Component<AnnouncerApplicationProps, AnnouncerApplicationState>{

  render(){
        let title = <h2 className="text text--application-title">{this.props.i18n.text.get('plugin.announcer.pageTitle')}</h2>
        let icon = <Dropdown modifier="communicator-settings" items={[
          closeDropdown=><Link className="link link--full" >
            <span>{this.props.i18n.text.get("plugin.communicator.settings.signatures")}</span>
          </Link>
        ]}>
          <Link className="button-pill button-pill--announcer-settings">
            <span className="icon icon-settings"></span>
          </Link>
        </Dropdown>
        let primaryOption = <a className="button button--announcer-new-message">
        {this.props.i18n.text.get('plugin.announcer.button.create')}
        </a>
        let toolbar = <Toolbar/>
          
        //The message view actually appears on top and it's not a replacement, this makes it easier to go back without having to refresh from the server
        return (<div className="container container--full">
          <ApplicationPanel modifier="announcer" toolbar={toolbar} title={title} icon={icon} primaryOption={primaryOption} aside={this.props.aside}>
      
          </ApplicationPanel>
        </div>);
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n
  }
};

const mapDispatchToProps = (dispatch: Dispatch<any>)=>{
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(AnnouncerApplication);