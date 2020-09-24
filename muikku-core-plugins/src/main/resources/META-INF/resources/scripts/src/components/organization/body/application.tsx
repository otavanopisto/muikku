import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import Link from '~/components/general/link';
import { StateType } from '~/reducers';
import ApplicationPanel, { ApplicationPanelToolbar, ApplicationPanelToolbarActionsMain } from '~/components/general/application-panel/application-panel';
import { SearchFormElement } from '~/components/general/form-element';
import ApplicationPanelBody from '~/components/general/application-panel/components/application-panel-body';
import Tabs from '~/components/general/tabs';
import Summary from './application/summary';
import Users from './application/users';
import OrganizationWorkspaces from './application/workspaces';
import WorkspacesAside from './application/workspaces/aside';
import Reports from './application/reports';
import { i18nType } from '~/reducers/base/i18n';
import { ButtonPill } from '~/components/general/button';
import WorkspaceDialog from '../dialogs/new-workspace';
import UserDialog from '../dialogs/new-user';
import '~/sass/elements/link.scss';
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/loaders.scss';
import { LoadUsersTriggerType, loadUsers } from '~/actions/main-function/users';

interface OrganizationManagementApplicationProps {
  aside: React.ReactElement<any>,
  loadUsers: LoadUsersTriggerType,
  i18n: i18nType
}

interface OrganizationManagementApplicationState {
  activeTab: "SUMMARY" | "USERS" | "COURSES" | "REPORTS",
}

class OrganizationManagementApplication extends React.Component<OrganizationManagementApplicationProps, OrganizationManagementApplicationState>{
  constructor(props: OrganizationManagementApplicationProps) {
    super(props);
    this.state = {
      activeTab: "SUMMARY",
    }
    this.onTabChange = this.onTabChange.bind(this);
    this.doSearch = this.doSearch.bind(this);
  }

  onTabChange(id: "SUMMARY" | "USERS" | "COURSES" | "REPORTS") {
    this.setState({
      activeTab: id
    });
  }

  doSearch(value: string) {
    this.props.loadUsers(value);
  }

  render() {
    let title = <h2 className="application-panel__header-title">{this.props.i18n.text.get('plugin.organization.pageTitle')}</h2>;
    let usersPrimaryAction = <UserDialog><ButtonPill buttonModifiers="organization" icon="plus" /></UserDialog>;
    let coursesPrimaryAction = <WorkspaceDialog><ButtonPill buttonModifiers="organization" icon="plus" /></WorkspaceDialog>;
    let coursesToolbar = <ApplicationPanelToolbar>
      <ApplicationPanelToolbarActionsMain>
        <SearchFormElement placeholder={this.props.i18n.text.get('plugin.organization.workspaces.search.placeholder')} name="OrganizationWorkspaceSearch" updateField={this.doSearch} ></SearchFormElement>
      </ApplicationPanelToolbarActionsMain>
    </ApplicationPanelToolbar>;

    let usersToolbar = <ApplicationPanelToolbar>
      <ApplicationPanelToolbarActionsMain>
        <SearchFormElement placeholder={this.props.i18n.text.get('plugin.organization.users.search.placeholder')} name="OrganizationUserSearch" updateField={this.doSearch} ></SearchFormElement>
      </ApplicationPanelToolbarActionsMain>
    </ApplicationPanelToolbar>;

    return (
      <ApplicationPanel modifier="organization" title={title} onTabChange={this.onTabChange} activeTab={this.state.activeTab} panelTabs={[
        {
          id: "SUMMARY",
          name: this.props.i18n.text.get('plugin.organization.tab.title.summary'),
          component: () => { return <ApplicationPanelBody modifier="tabs" children={<Summary />} /> }

        },
        {
          id: "USERS",
          name: this.props.i18n.text.get('plugin.organization.tab.title.users'),
          component: () => { return <ApplicationPanelBody primaryOption={usersPrimaryAction} toolbar={usersToolbar} modifier="tabs" children={<Users />} /> }

        },
        {
          id: "COURSES",
          name: this.props.i18n.text.get('plugin.organization.tab.title.courses'),
          component: () => { return <ApplicationPanelBody primaryOption={coursesPrimaryAction} toolbar={coursesToolbar} modifier="tabs" asideBefore={<WorkspacesAside />} children={<OrganizationWorkspaces />} /> }

        },
        {
          id: "REPORTS",
          name: this.props.i18n.text.get('plugin.organization.tab.title.reports'),
          component: () => { return <ApplicationPanelBody modifier="tabs" children={<Reports />} /> }
        }
      ]} />
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n
  }
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return bindActionCreators({ loadUsers }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationManagementApplication);
