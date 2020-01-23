import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import {MobileOnlyTabs} from "~/components/general/tabs";
import {UserType} from "~/reducers/main-function/user-index";
import Avatar from "~/components/general/avatar";
import {getName} from "~/util/modifiers";
import ApplicationSubPanel from "~/components/general/application-sub-panel";

interface OrganizationUserPanelProps {
  i18n: i18nType,
  users: Array<UserType>
}

interface OrganizationUserPanelState {
}

export default class OrganizationUserPanel extends React.Component<OrganizationUserPanelProps, OrganizationUserPanelState>{
  constructor(props: OrganizationUserPanelProps){
    super(props);
  }
    
  render() {
    return(
     <ApplicationSubPanel i18n={this.props.i18n} modifier="organization-users" bodyModifier="workspace-staff-members" title={this.props.i18n.text.get('plugin.organization.users.teachers.title')}>
        <div className="application-list">
        {this.props.users && this.props.users.map((user)=>{
          return <div className="application-list__item application-list__item--workspace-staff-member" key={user.id}>
            <div className="application-list__item-content-wrapper application-list__item-content-wrapper--workspace-user">
              <div className="application-list__item-content-aside application-list__item-content-aside--workspace-user">
                <div className="item-list__profile-picture">
                  <Avatar id={user.id} hasImage firstName={user.firstName}/>
                </div>
              </div>
              <div className="application-list__item-content-main application-list__item-content-main--workspace-user">
                <div>{getName(user, true)}</div>
                <div className="application-list__item-content-secondary-data">{user.email}</div>
              </div>
            </div>
          </div>
        })}
        </div>
      </ApplicationSubPanel>
    )
  }
  
}