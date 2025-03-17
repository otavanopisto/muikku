import { StateType } from "~/reducers";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import * as React from "react";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { StatusType } from "~/reducers/base/status";
import { IconButton } from "~/components/general/button";
import CommunicatorNewMessage from "~/components/communicator/dialogs/new-message";
import "~/sass/elements/application-panel.scss";
import "~/sass/elements/application-sub-panel.scss";
import "~/sass/elements/tabs.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/avatar.scss";
import { getName } from "~/util/modifiers";
import { ContactRecipientType } from "~/reducers/user-index";
import { getWorkspaceMessage } from "~/components/workspace/workspaceHome/teachers";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import ApplicationList, {
  ApplicationListItem,
  ApplicationListItemContentWrapper,
} from "~/components/general/application-list";
import Avatar from "~/components/general/avatar";
import DeactivateReactivateUserDialog from "./dialogs/deactivate-reactivate-user";
import { SearchFormElement } from "~/components/general/form-element";
import WorkspaceUser from "~/components/general/workspace-user";
import PagerV2 from "~/components/general/pagerV2";
import {
  loadStaffMembersOfWorkspace,
  loadStudentsOfWorkspace,
  LoadUsersOfWorkspaceTriggerType,
} from "~/actions/workspaces";
import { MobileOnlyTabs } from "~/components/general/tabs";
import { WorkspaceStudent } from "~/generated/client/models/WorkspaceStudent";
import { AnyActionType } from "~/actions";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * WorkspaceUsersProps
 */
interface WorkspaceUsersProps extends WithTranslation {
  status: StatusType;
  workspace: WorkspaceDataType;
  loadStaffMembers: LoadUsersOfWorkspaceTriggerType;
  loadStudents: LoadUsersOfWorkspaceTriggerType;
}

/**
 * WorkspaceUsersState
 */
interface WorkspaceUsersState {
  studentCurrentlyBeingSentMessage: WorkspaceStudent;
  activeTab: "ACTIVE" | "INACTIVE";
  currentSearch: string;
  currentStaffPage: number;
  currentActiveStudentPage: number;
  currentInactiveStudentPage: number;
  studentCurrentBeingToggledStatus: WorkspaceStudent;
}

/**
 * WorkspaceUsers
 */
class WorkspaceUsers extends React.Component<
  WorkspaceUsersProps,
  WorkspaceUsersState
> {
  private usersPerPage = 10;
  private allStaffPages = 0;
  private allActiveStudentsPages = 0;
  private allInActiveStudentsPages = 0;

  /**
   * Constructor method
   * @param props props
   */
  constructor(props: WorkspaceUsersProps) {
    super(props);

    this.state = {
      studentCurrentlyBeingSentMessage: null,
      activeTab: "ACTIVE",
      currentSearch: "",
      currentStaffPage: 1,
      currentActiveStudentPage: 1,
      currentInactiveStudentPage: 1,
      studentCurrentBeingToggledStatus: null,
    };

    this.onSendMessageTo = this.onSendMessageTo.bind(this);
    this.removeStudentBeingSentMessage =
      this.removeStudentBeingSentMessage.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.removeStudentBeingToggledStatus =
      this.removeStudentBeingToggledStatus.bind(this);
    this.setStudentBeingToggledStatus =
      this.setStudentBeingToggledStatus.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.loadStaffMembers = this.loadStaffMembers.bind(this);
    this.loadActiveStudents = this.loadActiveStudents.bind(this);
    this.loadInActiveStudents = this.loadInActiveStudents.bind(this);
  }

  /**
   * UNSAFE_componentWillReceiveProps. Should be refactored at somepoint
   * @param nextProps nextProps
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: WorkspaceUsersProps) {
    if (nextProps.workspace && nextProps.workspace.staffMembers) {
      this.allStaffPages = Math.ceil(
        nextProps.workspace.staffMembers.totalHitCount / this.usersPerPage
      );
    }
    if (nextProps.workspace && nextProps.workspace.students) {
      this.allActiveStudentsPages = Math.ceil(
        nextProps.workspace.students.totalHitCount / this.usersPerPage
      );
    }
    if (nextProps.workspace && nextProps.workspace.inactiveStudents) {
      this.allInActiveStudentsPages = Math.ceil(
        nextProps.workspace.inactiveStudents.totalHitCount / this.usersPerPage
      );
    }
  }

  /**
   * onSendMessageTo
   * @param student student
   */
  onSendMessageTo(student: WorkspaceStudent) {
    this.setState({
      studentCurrentlyBeingSentMessage: student,
    });
  }

  /**
   * removeStudentBeingSentMessage
   */
  removeStudentBeingSentMessage() {
    this.setState({
      studentCurrentlyBeingSentMessage: null,
    });
  }

  /**
   * onTabChange
   * @param id id
   */
  onTabChange(id: "ACTIVE" | "INACTIVE") {
    this.setState({
      activeTab: id,
    });
  }

  /**
   * updateSearch
   * @param query query
   */
  updateSearch(query: string) {
    this.props.loadStudents({
      workspace: this.props.workspace,
      payload: {
        q: query,
        active: true,
        firstResult: 0,
        maxResults: this.usersPerPage,
      },
    });
    this.props.loadStudents({
      workspace: this.props.workspace,
      payload: {
        q: query,
        active: false,
        firstResult: 0,
        maxResults: this.usersPerPage,
      },
    });

    this.setState({
      currentSearch: query,
      currentActiveStudentPage: 1,
      currentInactiveStudentPage: 1,
    });
  }

  /**
   * removeStudentBeingToggledStatus
   */
  removeStudentBeingToggledStatus() {
    this.setState({
      studentCurrentBeingToggledStatus: null,
    });
    this.loadInActiveStudents(1);
    this.loadActiveStudents(1);
  }

  /**
   * setStudentBeingToggledStatus
   * @param student student object
   */
  setStudentBeingToggledStatus(student: WorkspaceStudent) {
    this.setState({
      studentCurrentBeingToggledStatus: student,
    });
  }

  /**
   * loadStaffMembers
   * @param page page
   */
  loadStaffMembers(page: number) {
    const data = {
      workspace: this.props.workspace,
      payload: {
        q: "",
        firstResult: (page - 1) * this.usersPerPage,
        maxResults: this.usersPerPage,
      },
    };
    this.props.loadStaffMembers(data);
    this.setState({ currentStaffPage: page });
  }

  /**
   * handleStudentLoad
   * @param page page
   * @param active active
   */
  handleStudentLoad = (page: number, active: boolean) => {
    const data = {
      workspace: this.props.workspace,
      payload: {
        q: this.state.currentSearch,
        active: active,
        firstResult: (page - 1) * this.usersPerPage,
        maxResults: this.usersPerPage,
      },
    };
    this.props.loadStudents(data);
  };

  /**
   * loadActiveStudents
   * @param page page
   */
  loadActiveStudents(page: number) {
    this.handleStudentLoad(page, true);
    this.setState({ currentActiveStudentPage: page });
  }

  /**
   * loadInActiveStudents
   * @param page page
   */
  loadInActiveStudents(page: number) {
    this.handleStudentLoad(page, false);
    this.setState({ currentInactiveStudentPage: page });
  }

  /**
   * handles pager changes,
   * sets selected page as currentPage to state
   * @param selectedItem selectedItem
   * @param selectedItem.selected selected
   */
  handleStaffPagerChange = (selectedItem: { selected: number }) =>
    this.loadStaffMembers(selectedItem.selected + 1);

  /**
   * handles pager changes,
   * sets selected page as currentPage to state
   * @param selectedItem selectedItem
   * @param selectedItem.selected selected
   */
  handleActiveStudentsPagerChange = (selectedItem: { selected: number }) =>
    this.loadActiveStudents(selectedItem.selected + 1);

  /**
   * handles pager changes,
   * sets selected page as currentPage to state
   * @param selectedItem selectedItem
   * @param selectedItem.selected selected
   */
  handleInActiveStudentsPagerChange = (selectedItem: { selected: number }) =>
    this.loadInActiveStudents(selectedItem.selected + 1);

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    const currentStudentBeingSentMessage: ContactRecipientType = this.state
      .studentCurrentlyBeingSentMessage && {
      type: "user",
      value: {
        id: this.state.studentCurrentlyBeingSentMessage.userEntityId,
        name: getName(this.state.studentCurrentlyBeingSentMessage, true),
      },
    };
    const staffPager =
      this.allStaffPages > 1 ? (
        <PagerV2
          previousLabel=""
          nextLabel=""
          breakLabel="..."
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          initialPage={this.state.currentStaffPage - 1}
          forcePage={this.state.currentStaffPage - 1}
          pageCount={this.allStaffPages}
          onPageChange={this.handleStaffPagerChange}
        />
      ) : null;

    const activeStudents =
      this.props.workspace &&
      this.props.workspace.students &&
      this.props.workspace.students.results.map((s) => (
        <WorkspaceUser
          highlight={this.state.currentSearch}
          onSetToggleStatus={this.setStudentBeingToggledStatus.bind(this, s)}
          key={s.workspaceUserEntityId}
          student={s}
          onSendMessage={this.onSendMessageTo.bind(this, s)}
          {...this.props}
        />
      ));

    const pager =
      this.allActiveStudentsPages > 1 ? (
        <PagerV2
          previousLabel=""
          nextLabel=""
          breakLabel="..."
          initialPage={this.state.currentActiveStudentPage - 1}
          forcePage={this.state.currentActiveStudentPage - 1}
          marginPagesDisplayed={1}
          pageCount={this.allActiveStudentsPages}
          pageRangeDisplayed={2}
          onPageChange={this.handleActiveStudentsPagerChange}
        />
      ) : null;

    const inactiveStudents =
      this.props.workspace &&
      this.props.workspace.inactiveStudents &&
      this.props.workspace.inactiveStudents.results.map((s) => (
        <WorkspaceUser
          onSetToggleStatus={this.setStudentBeingToggledStatus.bind(this, s)}
          highlight={this.state.currentSearch}
          key={s.workspaceUserEntityId}
          student={s}
          {...this.props}
        />
      ));

    const inActivePager =
      this.allInActiveStudentsPages > 1 ? (
        <PagerV2
          previousLabel=""
          nextLabel=""
          breakLabel="..."
          initialPage={this.state.currentInactiveStudentPage - 1}
          forcePage={this.state.currentInactiveStudentPage - 1}
          marginPagesDisplayed={1}
          pageCount={this.allInActiveStudentsPages}
          pageRangeDisplayed={2}
          onPageChange={this.handleInActiveStudentsPagerChange}
        />
      ) : null;

    const teacherCount =
      (this.props.workspace &&
        this.props.workspace.staffMembers &&
        this.props.workspace.staffMembers.results.length) ||
      0;

    return (
      <ApplicationPanel
        modifier="workspace-users"
        title={t("labels.users", { ns: "users" })}
      >
        <ApplicationSubPanel modifier="workspace-users">
          <ApplicationSubPanel.Header modifier="workspace-users">
            {t("labels.teacher", { ns: "users", count: teacherCount })}
          </ApplicationSubPanel.Header>
          <ApplicationSubPanel.Body modifier="workspace-users">
            <ApplicationList
              footer={staffPager}
              modifiers="workspace-staff-members"
              contentState={staffPager ? "state-FULL" : ""}
            >
              {this.props.workspace &&
                this.props.workspace.staffMembers &&
                this.props.workspace.staffMembers.results.map((staff) => {
                  const staffActions = (
                    <CommunicatorNewMessage
                      extraNamespace="workspace-teachers"
                      initialSelectedItems={[
                        {
                          type: "staff",
                          value: {
                            id: staff.userEntityId,
                            name: getName(staff, true),
                          },
                        },
                      ]}
                      initialSubject={getWorkspaceMessage(
                        this.props.status,
                        this.props.workspace
                      )}
                      initialMessage={getWorkspaceMessage(
                        this.props.status,
                        this.props.workspace,
                        true
                      )}
                    >
                      <IconButton
                        buttonModifiers="workspace-users-contact"
                        icon="envelope"
                      />
                    </CommunicatorNewMessage>
                  );
                  return (
                    <ApplicationListItem
                      key={staff.userEntityId}
                      modifiers="workspace-staff-member"
                    >
                      <ApplicationListItemContentWrapper
                        modifiers="workspace-user"
                        asideModifiers="workspace-user"
                        mainModifiers="workspace-user"
                        actions={staffActions}
                        aside={
                          <div className="item-list__profile-picture">
                            <Avatar
                              id={staff.userEntityId}
                              hasImage={staff.hasImage}
                              name={staff.firstName}
                            />
                          </div>
                        }
                      >
                        <div>{getName(staff, true)}</div>
                        <div className="application-list__item-content-secondary-data">
                          {staff.email}
                        </div>
                      </ApplicationListItemContentWrapper>
                    </ApplicationListItem>
                  );
                })}
            </ApplicationList>
          </ApplicationSubPanel.Body>
        </ApplicationSubPanel>
        <ApplicationSubPanel modifier="workspace-users">
          <ApplicationSubPanel.Header modifier="workspace-users">
            {t("labels.students")}
          </ApplicationSubPanel.Header>
          <ApplicationSubPanel.Body modifier="workspace-users">
            <SearchFormElement
              delay={0}
              value={this.state.currentSearch}
              updateField={this.updateSearch}
              id="WorkspaceUserFilter"
              name="workspace-user-filter"
              placeholder={t("labels.search", {
                ns: "users",
                context: "students",
              })}
            />
            <MobileOnlyTabs
              onTabChange={this.onTabChange}
              activeTab={this.state.activeTab}
              tabs={[
                {
                  id: "ACTIVE",
                  name: t("labels.activeStudents", { ns: "users" }),
                  type: "workspace-students",
                  component: (
                    <ApplicationList footer={pager} modifiers="workspace-users">
                      {this.props.workspace && this.props.workspace.students ? (
                        activeStudents.length ? (
                          activeStudents
                        ) : (
                          <div className="loaded-empty">
                            {t("content.empty", {
                              ns: "workspace",
                              context: "activeStudents",
                            })}
                          </div>
                        )
                      ) : null}
                    </ApplicationList>
                  ),
                },
                {
                  id: "INACTIVE",
                  name: t("labels.archivedStudents", { ns: "users" }),
                  type: "workspace-students",
                  component: (
                    <ApplicationList
                      footer={inActivePager}
                      modifiers="workspace-users"
                    >
                      {this.props.workspace &&
                      this.props.workspace.inactiveStudents ? (
                        inactiveStudents.length ? (
                          inactiveStudents
                        ) : (
                          <div className="loaded-empty">
                            {t("content.empty", {
                              ns: "workspace",
                              context: "archivedStudent",
                            })}
                          </div>
                        )
                      ) : null}
                    </ApplicationList>
                  ),
                },
              ]}
            />
          </ApplicationSubPanel.Body>
        </ApplicationSubPanel>
        {currentStudentBeingSentMessage ? (
          <CommunicatorNewMessage
            isOpen
            onClose={this.removeStudentBeingSentMessage}
            extraNamespace="workspace-students"
            initialSelectedItems={[currentStudentBeingSentMessage]}
            initialSubject={getWorkspaceMessage(
              this.props.status,
              this.props.workspace
            )}
            initialMessage={getWorkspaceMessage(
              this.props.status,
              this.props.workspace,
              true
            )}
          />
        ) : null}
        {this.state.studentCurrentBeingToggledStatus ? (
          <DeactivateReactivateUserDialog
            isOpen
            onClose={this.removeStudentBeingToggledStatus}
            user={this.state.studentCurrentBeingToggledStatus}
          />
        ) : null}
      </ApplicationPanel>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    workspace: state.workspaces.currentWorkspace,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      loadStaffMembers: loadStaffMembersOfWorkspace,
      loadStudents: loadStudentsOfWorkspace,
    },
    dispatch
  );
}

export default withTranslation(["users", "workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(WorkspaceUsers)
);
