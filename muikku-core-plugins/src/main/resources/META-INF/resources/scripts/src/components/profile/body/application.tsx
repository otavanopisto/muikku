import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import ApplicationPanel from '~/components/general/application-panel';
import { StateType } from 'reducers';
import ProfileInfoAndSettings from './application/profile-info-and-settings';
import ProfilePicture from './application/profile-picture';
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
      <ApplicationPanel modifier="profile" title={title} asideBefore={this.props.aside} disableStickyScrolling>
        <ProfilePicture/>
        <ProfileInfoAndSettings/>
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
