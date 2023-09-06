import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import StudentDialog from "~/components/organization/dialogs/edit-student";
import StaffDialog from "~/components/organization/dialogs/edit-staff";
import User from "~/components/general/user";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import ApplicationList from "~/components/general/application-list";
import "~/sass/elements/application-list.scss";
import { UserSearchResultWithExtraProperties } from "~/reducers/main-function/users";
import PagerV2 from "~/components/general/pagerV2";

/**
 * UserPanelProps
 */
interface UserPanelProps {
  i18n: i18nType;
  users: UserSearchResultWithExtraProperties;
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
   * @returns JSX.Element
   */
  render() {
    const results = this.props.users.results;
    return (
      <ApplicationSubPanel modifier="organization-users">
        <ApplicationSubPanel.Header modifier="organization-users">
          {this.props.i18n.text.get(this.props.title)}
        </ApplicationSubPanel.Header>
        <ApplicationSubPanel.Body modifier="organization-users">
          {this.props.users.results.length > 0 ? (
            <ApplicationList>
              {this.props.users &&
                results.map((user) => {
                  const data = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    id: user.id,
                    role: user.role ? user.role : "STUDENT",
                    studyProgrammeIdentifier: user.studyProgrammeIdentifier,
                  };
                  const actions =
                    data.role == "STUDENT" ? (
                      <div>
                        <StudentDialog data={data}>
                          <span className="icon-pencil"></span>
                        </StudentDialog>
                      </div>
                    ) : data.role === "ADMINISTRATOR" ||
                      data.role === "STUDY_PROGRAMME_LEADER" ? (
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
