import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import {MobileOnlyTabs} from "~/components/general/tabs";
import {UserWithSchoolDataType} from "~/reducers/main-function/user-index";
import Avatar from "~/components/general/avatar";
import {getName} from "~/util/modifiers";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import ApplicationList, {ApplicationListItem, ApplicationListItemContentWrapper, ApplicationListItemContentData} from "~/components/general/application-list";


interface UserPanelProps {
  i18n: i18nType,
  users: Array<UserWithSchoolDataType>,
  title: string
}

interface UserPanelState {
}

export default class UserPanel extends React.Component<UserPanelProps, UserPanelState>{
  constructor(props: UserPanelProps){
    super(props);
  }
    
  render() {
    
    return(
     <ApplicationSubPanel i18n={this.props.i18n} modifier="organization-users" bodyModifier="organization-users" title={this.props.i18n.text.get(this.props.title)}>
        <ApplicationList>
          {this.props.users && this.props.users.map((user)=>{
            let aside = <Avatar id={user.userEntityId} hasImage firstName={user.firstName}/>;
            let actions = <div>actions here</div>;
            return <ApplicationListItem key={user.id} modifiers="user">
              <ApplicationListItemContentWrapper modifiers="user" actions={actions} mainModifiers="user" asideModifiers="user" aside={aside}>
                <ApplicationListItemContentData modifiers="primary">{getName(user, true)}</ApplicationListItemContentData>
                <ApplicationListItemContentData modifiers="secondary">{user.email}</ApplicationListItemContentData>
              </ApplicationListItemContentWrapper>
            </ApplicationListItem>
          })}
        </ApplicationList>
      </ApplicationSubPanel>
    )
  }
  
}