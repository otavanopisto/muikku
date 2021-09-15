import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import Avatar from "~/components/general/avatar";
import StudentDialog from "~/components/organization/dialogs/edit-student";
import StaffDialog from "~/components/organization/dialogs/edit-staff";
import { getName } from "~/util/modifiers";
import User from "~/components/general/user";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import ApplicationList, {
  ApplicationListItem,
  ApplicationListItemContentWrapper,
  ApplicationListItemContentData,
} from "~/components/general/application-list";

import "~/sass/elements/application-list.scss";
import {
  UserPanelUsersType,
  UsersListType,
} from "~/reducers/main-function/users";
import Pager from "~/components/general/pager";

interface UserPanelProps {
  i18n: i18nType;
  users: UserPanelUsersType;
  usersPerPage?: number;
  searchString?: string | null;
  pageChange?: (q: string, first: number, last: number) => any;
  identifier?: string;
  title: string;
  onEmpty: string;
}

interface UserPanelState {
  currentPage: number;
  pages: number;
}

export default class UserPanel extends React.Component<
  UserPanelProps,
  UserPanelState
> {
  private usersPerPage: number;

  constructor(props: UserPanelProps) {
    super(props);
    this.usersPerPage = this.props.usersPerPage ? this.props.usersPerPage : 10;
    this.getToPage = this.getToPage.bind(this);
    this.state = {
      currentPage: 1,
      pages: Math.ceil(this.props.users.totalHitCount / this.usersPerPage),
    };
  }

  getToPage(n: number) {
    let pageStart: number = (n - 1) * this.usersPerPage;
    let pageEnd: number = n * this.usersPerPage;

    let query: string = this.props.searchString
      ? this.props.searchString
      : null;
    this.setState({ currentPage: n });
    this.props.pageChange(query, pageStart, pageEnd);
  }

  componentDidUpdate(prevProps: UserPanelProps) {
    if (prevProps.searchString !== this.props.searchString) {
      if (this.state.currentPage !== 1) {
        this.setState({ currentPage: 1 });
      }
      this.setState({
        pages: Math.ceil(this.props.users.totalHitCount / this.usersPerPage),
      });
    }
  }

  render() {
    let results = this.props.users.results as UsersListType;
    return (
      <ApplicationSubPanel
        i18n={this.props.i18n}
        modifier="organization-users"
        bodyModifier="organization-users"
        title={this.props.i18n.text.get(this.props.title)}
      >
        {this.props.users.results.length > 0 ? (
          <ApplicationList>
            {this.props.users &&
              results.map((user) => {
                let data = {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  id: user.id,
                  role: user.role ? user.role : "STUDENT",
                  studyProgrammeIdentifier: user.studyProgrammeIdentifier,
                };
                let actions =
                  data.role == "STUDENT" ? (
                    <div>
                      <StudentDialog data={data}>
                        <span className="icon-pencil"></span>
                      </StudentDialog>
                    </div>
                  ) : data.role === "ADMINISTRATOR" ? (
                    <div title={data.role}>
                      <span className="state-DISABLED icon-pencil"></span>
                    </div>
                  ) : (
                    <div>
                      <StaffDialog data={data}>
                        <span className="icon-pencil"></span>
                      </StaffDialog>
                    </div>
                  );
                return <User key={user.id} user={user} actions={actions} />;
              })}
          </ApplicationList>
        ) : (
          <div className="empty">
            <span>{this.props.i18n.text.get(this.props.onEmpty)}</span>
          </div>
        )}
        <Pager
          identifier={this.props.identifier.toLowerCase()}
          current={this.state.currentPage}
          onClick={this.getToPage}
          pages={this.state.pages}
        ></Pager>
      </ApplicationSubPanel>
    );
  }
}
