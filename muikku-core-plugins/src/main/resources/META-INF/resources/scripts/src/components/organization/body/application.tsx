import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { StateType } from "~/reducers";
import ApplicationPanel, {
  ApplicationPanelToolbar,
  ApplicationPanelToolbarActionsMain,
} from "~/components/general/application-panel/application-panel";
import { SearchFormElement } from "~/components/general/form-element";
import ApplicationPanelBody from "~/components/general/application-panel/components/application-panel-body";
import Summary from "./application/summary";
import Users from "./application/users";
import UserGroups from "./application/usergroups";
import OrganizationWorkspaces from "./application/workspaces";
import WorkspacesAside from "./application/workspaces/aside";
import { ButtonPill } from "~/components/general/button";
import WorkspaceDialog from "../dialogs/new-workspace";
import UserGroupDialog from "../dialogs/new-usergroup";
import UserDialog from "../dialogs/new-user";
import "~/sass/elements/link.scss";
import "~/sass/elements/application-panel.scss";
import "~/sass/elements/loaders.scss";
import {
  LoadUsersTriggerType,
  loadUsers,
  loadUserGroups,
} from "~/actions/main-function/users";
import { WorkspacesActiveFiltersType } from "~/reducers/workspaces";
import {
  loadWorkspacesFromServer,
  LoadWorkspacesFromServerTriggerType,
} from "~/actions/workspaces";
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";

type OrganizationTabs = "SUMMARY" | "USERS" | "USERGROUPS" | "COURSES";

/**
 * OrganizationManagementApplicationProps
 */
interface OrganizationManagementApplicationProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aside: React.ReactElement<any>;
  loadUsers: LoadUsersTriggerType;
  loadUserGroups: LoadUsersTriggerType;
  loadWorkspaces: LoadWorkspacesFromServerTriggerType;
  activeFilters: WorkspacesActiveFiltersType;
}

/**
 * OrganizationManagementApplicationState
 */
interface OrganizationManagementApplicationState {
  activeTab: OrganizationTabs;
  workspaceSearchFieldValue: string;
  userSearchFieldValue: string;
  userGroupSearchFieldValue: string;
}

/**
 * OrganizationManagementApplication
 */
class OrganizationManagementApplication extends React.Component<
  OrganizationManagementApplicationProps,
  OrganizationManagementApplicationState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: OrganizationManagementApplicationProps) {
    super(props);
    this.state = {
      activeTab: "SUMMARY",
      workspaceSearchFieldValue: "",
      userSearchFieldValue: "",
      userGroupSearchFieldValue: "",
    };
    this.onTabChange = this.onTabChange.bind(this);
    this.doUserSearch = this.doUserSearch.bind(this);
    this.doWorkspaceSearch = this.doWorkspaceSearch.bind(this);
    this.doUserGroupSearch = this.doUserGroupSearch.bind(this);
  }

  /**
   * onTabChange
   * @param id id
   */
  onTabChange(id: OrganizationTabs) {
    this.setState({
      activeTab: id,
    });
  }

  /**
   * doUserSearch
   * @param q q
   */
  doUserSearch(q: string) {
    this.props.loadUsers({ payload: { q } });
    this.setState({ userSearchFieldValue: q });
  }

  /**
   * doUserGroupSearch
   * @param q q
   */
  doUserGroupSearch(q: string) {
    this.props.loadUserGroups({ payload: { q } });
    this.setState({ userGroupSearchFieldValue: q });
  }

  /**
   * doWorkspaceSearch
   * @param value value
   */
  doWorkspaceSearch(value: string) {
    const filters: WorkspacesActiveFiltersType = {
      educationFilters: this.props.activeFilters.educationFilters
        ? this.props.activeFilters.educationFilters
        : [],
      curriculumFilters: this.props.activeFilters.curriculumFilters
        ? this.props.activeFilters.curriculumFilters
        : [],
      organizationFilters: this.props.activeFilters.organizationFilters
        ? this.props.activeFilters.organizationFilters
        : [],
      stateFilters: this.props.activeFilters.stateFilters
        ? this.props.activeFilters.stateFilters
        : [],
      templates: "ONLY_WORKSPACES",
      query: value,
      baseFilter: "ALL_COURSES",
    };

    this.props.loadWorkspaces(filters, true, false);
    this.setState({ workspaceSearchFieldValue: value });
  }

  /**
   * render
   */
  render() {
    const { t } = this.props;

    const title = t("labels.organizationManagament");
    const usersPrimaryAction = (
      <UserDialog>
        <ButtonPill buttonModifiers="organization" icon="plus" />
      </UserDialog>
    );
    const usersPrimaryActionMobile = (
      <UserDialog>
        <ButtonPill icon="plus" buttonModifiers="organization" />
      </UserDialog>
    );
    const userGroupsPrimaryAction = (
      <UserGroupDialog>
        <ButtonPill buttonModifiers="organization" icon="plus" />
      </UserGroupDialog>
    );
    const userGroupsPrimaryActionMobile = (
      <UserGroupDialog>
        <ButtonPill buttonModifiers="organization" icon="plus" />
      </UserGroupDialog>
    );
    const coursesPrimaryAction = (
      <WorkspaceDialog activeFilters={this.props.activeFilters}>
        <ButtonPill buttonModifiers="organization" icon="plus" />
      </WorkspaceDialog>
    );
    const coursesPrimaryActionMobile = (
      <WorkspaceDialog activeFilters={this.props.activeFilters}>
        <ButtonPill icon="plus" buttonModifiers="organization" />
      </WorkspaceDialog>
    );
    const coursesToolbar = (
      <ApplicationPanelToolbar>
        <ApplicationPanelToolbarActionsMain modifier="organization-tab-search">
          <SearchFormElement
            value={this.state.workspaceSearchFieldValue}
            id="organizationWorkpaceSearch"
            placeholder={t("labels.search", { ns: "workspace" })}
            name="organization-workspace-search"
            updateField={this.doWorkspaceSearch}
          ></SearchFormElement>
        </ApplicationPanelToolbarActionsMain>
      </ApplicationPanelToolbar>
    );

    const usersToolbar = (
      <ApplicationPanelToolbar>
        <ApplicationPanelToolbarActionsMain>
          <SearchFormElement
            value={this.state.userSearchFieldValue}
            id="organizationUserSearch"
            placeholder={t("labels.search", { ns: "users" })}
            name="organization-user-search"
            updateField={this.doUserSearch}
          ></SearchFormElement>
        </ApplicationPanelToolbarActionsMain>
      </ApplicationPanelToolbar>
    );

    const userGroupsToolbar = (
      <ApplicationPanelToolbar>
        <ApplicationPanelToolbarActionsMain>
          <SearchFormElement
            value={this.state.userGroupSearchFieldValue}
            id="oganizationUserGroupSearch"
            placeholder={t("labels.search", {
              ns: "users",
              context: "userGroups",
            })}
            name="organization-user-group-search"
            updateField={this.doUserGroupSearch}
          ></SearchFormElement>
        </ApplicationPanelToolbarActionsMain>
      </ApplicationPanelToolbar>
    );

    return (
      <ApplicationPanel
        title={title}
        onTabChange={this.onTabChange}
        activeTab={this.state.activeTab}
        panelTabs={[
          {
            id: "SUMMARY",
            name: t("labels.summary", { ns: "organization" }),
            /**
             * component
             */
            component: (
              <ApplicationPanelBody modifier="tabs">
                <Summary />
              </ApplicationPanelBody>
            ),
          },
          {
            id: "USERS",
            name: t("labels.users", { ns: "users" }),
            mobileAction: usersPrimaryActionMobile,
            component: (
              <ApplicationPanelBody
                primaryOption={usersPrimaryAction}
                toolbar={usersToolbar}
                modifier="tabs"
              >
                <Users />
              </ApplicationPanelBody>
            ),
          },
          {
            id: "USERSGROUPS",
            name: t("labels.userGroups", { ns: "users" }),
            mobileAction: userGroupsPrimaryActionMobile,
            component: (
              <ApplicationPanelBody
                primaryOption={userGroupsPrimaryAction}
                toolbar={userGroupsToolbar}
                modifier="tabs"
              >
                <UserGroups />
              </ApplicationPanelBody>
            ),
          },
          {
            id: "COURSES",
            name: t("labels.workspaces", { ns: "workspace" }),
            mobileAction: coursesPrimaryActionMobile,
            component: (
              <ApplicationPanelBody
                primaryOption={coursesPrimaryAction}
                toolbar={coursesToolbar}
                modifier="tabs"
                asideBefore={<WorkspacesAside />}
              >
                <OrganizationWorkspaces />
              </ApplicationPanelBody>
            ),
          },
        ]}
      />
    );

    // Removed for the time being
    // {
    //   id: "REPORTS",
    //   name: this.props.t('labels.reports', {ns: "organization"}),
    //   component: () => { return <ApplicationPanelBody modifier="tabs" children={<Reports />} /> }
    // }
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    activeFilters: state.organizationWorkspaces.activeFilters,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
const mapDispatchToProps = (dispatch: Dispatch<Action<AnyActionType>>) =>
  bindActionCreators(
    { loadUsers, loadWorkspaces: loadWorkspacesFromServer, loadUserGroups },
    dispatch
  );

export default withTranslation([
  "organization",
  "workspace",
  "users",
  "common",
])(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrganizationManagementApplication)
);
