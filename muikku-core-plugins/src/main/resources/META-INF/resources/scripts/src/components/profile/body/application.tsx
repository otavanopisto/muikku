import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import ApplicationPanel from '~/components/general/application-panel/application-panel';
import { StateType } from 'reducers';
import { StatusType } from "~/reducers/base/status";
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
  status: StatusType,
}

interface ProfileApplicationState {
}

class ProfileApplication extends React.Component<ProfileApplicationProps, ProfileApplicationState> {
  render(){
    if (!this.props.status.profile) {
      return null;
    }
    return (<div className="application-panel-wrapper">
      <ApplicationPanel
        modifier="profile"
        title={this.props.status.profile.displayName}
        asideBefore={this.props.aside}>
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
    i18n: state.i18n,
    status: state.status,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileApplication);
