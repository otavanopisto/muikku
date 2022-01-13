import * as React from "react";
import { StateType } from "~/reducers";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import UserPanel from "~/components/general/user-panel";
import { bindActionCreators } from "redux";
import { UsersType } from "~/reducers/main-function/users";
import {
  LoadUsersTriggerType,
  loadStudents,
  loadStaff,
} from "~/actions/main-function/users";

/**
 * OrganizationUsersProps
 */
interface OrganizationUsersProps {
  i18n: i18nType;
  users: UsersType;
  loadStaff: LoadUsersTriggerType;
  loadStudents: LoadUsersTriggerType;
}

/**
 * OrganizationUsersState
 */
interface OrganizationUsersState {}

/**
 * OrganizationUsers
 */
class OrganizationUsers extends React.Component<
  OrganizationUsersProps,
  OrganizationUsersState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: OrganizationUsersProps) {
    super(props);
    this.staffPanelPageChange = this.staffPanelPageChange.bind(this);
    this.studentPanelPageChange = this.studentPanelPageChange.bind(this);
  }

  /**
   * staffPanelPageChange
   * @param q q
   * @param first first
   * @param max max
   */
  staffPanelPageChange(q: string, first: number, max: number) {
    this.props.loadStaff({
      payload: { q, firstResult: first, maxResults: max },
    });
  }

  /**
   * studentPanelPageChange
   * @param q q
   * @param first first
   * @param max max
   */
  studentPanelPageChange(q: string, first: number, max: number) {
    this.props.loadStudents({
      payload: { q, firstResult: first, maxResults: max },
    });
  }

  /**
   * render
   */
  render() {
    return (
      <div>
        <UserPanel
          i18n={this.props.i18n}
          identifier={"staff"}
          onEmpty="plugin.organization.users.staff.empty"
          searchString={this.props.users.staff.searchString}
          title="plugin.organization.users.staff.title"
          users={this.props.users.staff}
          pageChange={this.staffPanelPageChange}
        />
        <UserPanel
          i18n={this.props.i18n}
          identifier={"students"}
          onEmpty="plugin.organization.users.students.empty"
          searchString={this.props.users.students.searchString}
          title="plugin.organization.users.students.title"
          users={this.props.users.students}
          pageChange={this.studentPanelPageChange}
        />
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    users: state.organizationUsers,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ loadStudents, loadStaff }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationUsers);
