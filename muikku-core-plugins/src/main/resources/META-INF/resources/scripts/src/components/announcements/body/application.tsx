import * as React from 'react';
import {connect, Dispatch} from 'react-redux';

import ApplicationPanel from '~/components/general/application-panel';
import Announcements from './application/announcements';
import Link from '~/components/general/link';

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
        return (<div className="container container--full">
          <ApplicationPanel modifier="announcement" asideAfter={this.props.aside} >
            <Announcements/>
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