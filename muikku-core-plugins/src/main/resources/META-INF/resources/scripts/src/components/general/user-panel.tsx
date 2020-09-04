import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { i18nType } from '~/reducers/base/i18n';
import { UserType } from "~/reducers/user-index";
import Avatar from "~/components/general/avatar";
import StudentDialog from '~/components/organization/dialogs/edit-student';
import StaffDialog from '~/components/organization/dialogs/edit-staff';
import { getName } from "~/util/modifiers";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import ApplicationList, { ApplicationListItem, ApplicationListItemContentWrapper, ApplicationListItemContentData } from "~/components/general/application-list";
import '~/sass/elements/application-list.scss';
import { UsersType } from '~/reducers/main-function/users';



interface UserPanelProps {
  i18n: i18nType,
  users: Array<UserType>,
  title: string
}

interface UserPanelState {
}

export default class UserPanel extends React.Component<UserPanelProps, UserPanelState>{
  constructor(props: UserPanelProps) {
    super(props);
  }

  render() {

    return (
      <ApplicationSubPanel i18n={this.props.i18n} modifier="organization-users" bodyModifier="organization-users" title={this.props.i18n.text.get(this.props.title)}>
        <ApplicationList>
          {this.props.users && this.props.users.map((user) => {
            let aside = <Avatar id={user.userEntityId} hasImage={user.hasImage} firstName={user.firstName} />;
            let data = {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              id: user.id,
              role: user.role ? user.role : "STUDENT",
              studyProgrammeIdentifier: user.studyProgrammeIdentifier
            }
            let actions = data.role == "STUDENT" ? <div><StudentDialog data={data}><span className="icon-pencil"></span></StudentDialog></div> : data.role === "ADMINISTRATOR" ? <div title={data.role}><span className="state-DISABLED icon-pencil"></span></div> : <div><StaffDialog data={data}><span className="icon-pencil"></span></StaffDialog></div>;
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
