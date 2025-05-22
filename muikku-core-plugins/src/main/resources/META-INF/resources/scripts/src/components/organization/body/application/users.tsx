import * as React from "react";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import UserPanel from "~/components/general/user-panel";
import { Action, bindActionCreators, Dispatch } from "redux";
import { UsersState } from "~/reducers/main-function/users";
import {
  LoadUsersTriggerType,
  loadStudents,
  loadStaff,
} from "~/actions/main-function/users";
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * OrganizationUsersProps
 */
interface OrganizationUsersProps extends WithTranslation {
  users: UsersState;
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
    const { t } = this.props;

    return (
      <div>
        <UserPanel
          identifier={"staff"}
          onEmpty={t("content.noStaff", { ns: "users" })}
          searchString={this.props.users.staff.searchString}
          title={t("labels.staff", {
            ns: "users",
            context: "organization",
          })}
          users={this.props.users.staff}
          pageChange={this.staffPanelPageChange}
        />
        <UserPanel
          identifier={"students"}
          onEmpty={t("content.notFound", {
            ns: "users",
            context: "students",
          })}
          searchString={this.props.users.students.searchString}
          title={t("labels.students", {
            ns: "users",
            context: "organization",
          })}
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
    users: state.organizationUsers,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ loadStudents, loadStaff }, dispatch);
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(OrganizationUsers)
);
