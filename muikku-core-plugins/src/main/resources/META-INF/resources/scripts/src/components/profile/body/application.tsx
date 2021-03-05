import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import ApplicationPanel from '~/components/general/application-panel';
import { StateType } from 'reducers';
import ChatSettings from "./application/chat-settings";
import ContactInformation from "./application/contact-information";
import GeneralInformation from "./application/general-information";
import Security from "./application/security";
import VacationSettings from "./application/vacation-settings";
import WorkList from "./application/work-list";
import { i18nType } from '~/reducers/base/i18n';

interface ProfileApplicationProps {
  i18n: i18nType,
  aside: React.ReactElement,
}

interface ProfileApplicationState {
}

class ProfileApplication extends React.Component<ProfileApplicationProps, ProfileApplicationState> {
  render(){
    let title = this.props.i18n.text.get('plugin.profile.profile')
    return (<div className="application-panel-wrapper">
      <ApplicationPanel
        modifier="profile"
        title={title}
        asideBefore={this.props.aside}
        disableStickyScrolling
      >
        <ChatSettings />
        <ContactInformation />
        <GeneralInformation />
        <Security />
        <VacationSettings />
        <WorkList />
      </ApplicationPanel>
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileApplication);
