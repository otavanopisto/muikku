import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import {MobileOnlyTabs} from "~/components/general/tabs";
import ApplicationSubPanel from "~/components/general/application-sub-panel";

interface OrganizationUserTabsProps {
  i18n: i18nType,
  users: any
}

interface OrganizationUserTabsState {
  activeTab: "ACTIVE" | "INACTIVE"
  
}

export default class OrganizationUserTabs extends React.Component<OrganizationUserTabsProps, OrganizationUserTabsState>{
  constructor(props: OrganizationUserTabsProps){
    super(props);
    this.state = {
      activeTab: "ACTIVE",
    }
  }

  render() {
    return(
      <ApplicationSubPanel i18n={this.props.i18n} modifier="workspace-users" bodyModifier="workspace-staff-members" title={this.props.i18n.text.get('plugin.organization.users.teachers.title')}>
      </ApplicationSubPanel>
    )
  }
  
}