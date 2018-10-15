import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import ApplicationPanel from '~/components/general/application-panel';
import { StateType } from 'reducers';
import ProfileInfoAndSettings from './application/profile-info-and-settings';
import ProfilePicture from './application/profile-picture';
import { i18nType } from '~/reducers/base/i18n';


interface ProfileApplicationProps {
  i18n: i18nType
}

interface ProfileApplicationState {
}

class ProfileApplication extends React.Component<ProfileApplicationProps, ProfileApplicationState> {
  render(){
    let title = <h2 className="application-panel__header-title">{this.props.i18n.text.get('plugin.profile.profile')}</h2>
    return (<div>
      <ApplicationPanel modifier="profile" title={title} asideBefore={<ProfilePicture/>} disableStickyScrolling>
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