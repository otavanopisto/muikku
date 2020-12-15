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
import { UserPanelUsersType } from '~/reducers/main-function/users';
import Pager from '~/components/general/pager';

interface UserPanelProps {
  i18n: i18nType,
  users: UserPanelUsersType,
  usersPerPage?: number,
  searchString?: string | null,
  pageChange?: (q: string, first: number, last: number) => any,
  title: string,
  onEmpty: string,
}

interface UserPanelState {
  currentPage: number
}

export default class UserPanel extends React.Component<UserPanelProps, UserPanelState>{
  private usersPerPage: number;
  private pages: number;

  constructor(props: UserPanelProps) {
    super(props);
    this.usersPerPage = this.props.usersPerPage ? this.props.usersPerPage : 10;
    this.getToPage = this.getToPage.bind(this);
    this.pages = Math.ceil(this.props.users.totalHitCount / this.usersPerPage);
    this.state = {
      currentPage: 1
    }
  }

  getToPage(n: number) {
    let pageStart: number = (n - 1) * this.usersPerPage;
    let pageEnd: number = n * this.usersPerPage;
    let query: string = this.props.searchString ? this.props.searchString : null;
    this.setState({ currentPage: n });
    this.props.pageChange(query, pageStart, pageEnd)
  }

  componentDidUpdate(prevProps: UserPanelProps) {
    if (prevProps.searchString !== this.props.searchString) {
      if (this.state.currentPage !== 1) {
        this.setState({ currentPage: 1 });
      }
      this.pages = Math.ceil(this.props.users.totalHitCount / this.usersPerPage);
      console.log(this.pages);
    }
  }

  render() {

    return (
      <ApplicationSubPanel i18n={this.props.i18n} modifier="organization-users" bodyModifier="organization-users" title={this.props.i18n.text.get(this.props.title)}>
        {this.props.users.results.length > 0 ?
          <ApplicationList >
            {this.props.users && this.props.users.results.map((user) => {
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
          : <div className="empty"><span>{this.props.i18n.text.get(this.props.onEmpty)}</span></div>
        }
        <Pager current={this.state.currentPage} onClick={this.getToPage} pages={this.pages}></Pager>
      </ApplicationSubPanel>
    )
  }
}
