import * as React from "react";
import StudentDialog from "~/components/organization/dialogs/edit-student";
import StaffDialog from "~/components/organization/dialogs/edit-staff";
import User from "~/components/general/user";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import ApplicationList from "~/components/general/application-list";
import "~/sass/elements/application-list.scss";
import PagerV2 from "~/components/general/pagerV2";
import {
  instanceOfStudent,
  Role,
  StaffMember,
  Student,
} from "~/generated/client";
import {
  UserStaffSearchResultWithExtraProperties,
  UserStudentSearchResultWithExtraProperties,
} from "~/reducers/main-function/users";

/**
 * UserPanelProps
 */
interface UserPanelProps {
  users:
    | UserStudentSearchResultWithExtraProperties
    | UserStaffSearchResultWithExtraProperties;
  usersPerPage?: number;
  searchString?: string | null;
  pageChange?: (q: string, first: number, last: number) => any;
  identifier?: string;
  title: string;
  onEmpty: string;
}

/**
 * UserPanelState
 */
interface UserPanelState {
  currentPage: number;
  pages: number;
}

/**
 * Type guard for Student
 * @param user user
 */
const isStudent = (user: Student | StaffMember): user is Student =>
  instanceOfStudent(user);

/**
 * UserPanel
 */
export default class UserPanel extends React.Component<
  UserPanelProps,
  UserPanelState
> {
  private usersPerPage: number;

  /**
   * constructor
   * @param props props
   */
  constructor(props: UserPanelProps) {
    super(props);
    this.usersPerPage = this.props.usersPerPage ? this.props.usersPerPage : 10;
    this.getToPage = this.getToPage.bind(this);
    this.state = {
      currentPage: 1,
      pages: Math.ceil(this.props.users.totalHitCount / this.usersPerPage),
    };
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   */
  componentDidUpdate(prevProps: UserPanelProps) {
    if (prevProps.users.totalHitCount !== this.props.users.totalHitCount) {
      if (this.state.currentPage !== 1) {
        this.setState({ currentPage: 1 });
      }

      this.setState({
        pages: Math.ceil(this.props.users.totalHitCount / this.usersPerPage),
      });
    }
  }

  /**
   * getToPage
   * @param n page number
   */
  getToPage(n: number) {
    const pageStart: number = (n - 1) * this.usersPerPage;
    const maxPerPage: number = this.usersPerPage;

    const query: string = this.props.searchString
      ? this.props.searchString
      : null;
    this.setState({ currentPage: n });
    this.props.pageChange(query, pageStart, maxPerPage);
  }

  /**
   * handles page changes,
   * sets selected page as currentPage to state
   * @param selectedItem selectedItem object
   * @param selectedItem.selected page number
   * @returns getToPage
   */
  handlePagerChange = (selectedItem: { selected: number }) =>
    this.getToPage(selectedItem.selected + 1);

  /**
   * Component render method
   * @returns React.JSX.Element
   */
  render() {
    const results = this.props.users.results;
    return (
      <ApplicationSubPanel modifier="organization-users">
        <ApplicationSubPanel.Header modifier="organization-users">
          {this.props.title}
        </ApplicationSubPanel.Header>
        <ApplicationSubPanel.Body modifier="organization-users">
          {this.props.users.results.length > 0 ? (
            <ApplicationList>
              {this.props.users &&
                results.map((user) => {
                  const actions = isStudent(user) ? (
                    <div>
                      <StudentDialog data={user}>
                        <span className="icon-pencil"></span>
                      </StudentDialog>
                    </div>
                  ) : user.roles.has(Role.Administrator) ||
                    user.roles.has(Role.StudyProgrammeLeader) ? (
                    /*
                     * TODO does this need the title-attribute? .. title={data.roles}
                     */
                    <div>
                      <span className="state-DISABLED icon-pencil"></span>
                    </div>
                  ) : (
                    <div>
                      <StaffDialog data={user}>
                        <span className="icon-pencil"></span>
                      </StaffDialog>
                    </div>
                  );
                  return <User key={user.id} user={user} actions={actions} />;
                })}
            </ApplicationList>
          ) : (
            <div className="empty">
              <span>{this.props.onEmpty}</span>
            </div>
          )}

          <PagerV2
            previousLabel=""
            nextLabel=""
            breakLabel="..."
            initialPage={this.state.currentPage - 1}
            forcePage={this.state.currentPage - 1}
            marginPagesDisplayed={1}
            pageCount={this.state.pages}
            pageRangeDisplayed={2}
            onPageChange={this.handlePagerChange}
          />
        </ApplicationSubPanel.Body>
      </ApplicationSubPanel>
    );
  }
}
