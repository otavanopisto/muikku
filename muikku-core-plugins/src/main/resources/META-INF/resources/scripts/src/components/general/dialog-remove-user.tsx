import * as React from "react";
import { DialogRow } from '~/components/general/dialog';
import {SearchFormElement } from '~/components/general/form-element';
import ApplicationList, { ApplicationListItemContentWrapper, ApplicationListItem, ApplicationListItemHeader } from '~/components/general/application-list';
import { UserType } from '../../reducers/user-index';
import Tabs  from "~/components/general/tabs";
import { UiSelectItem } from '../base/input-select-autofill';
import Pager from '~/components/general/pager';

interface DialogRemoveUsersProps {
  users: UserType[],
  removeUsers: UiSelectItem[],
  pages: number,
  placeholder: string,
  identifier: string,
  allTabTitle: string,
  removeTabTitle: string,
  onEmptyTitle: string,
  searchValue: string,
  maxUsersPerPage?: number,
  searchUsers: (q:string) => any,
  changePage: (n: number) => any,
  setRemoved: (u:UiSelectItem) => any,
}

interface DialogRemoveUsersState {
  activeTab: string,
  removeUsersPage: UiSelectItem[],
  currentAllPage: number,
  currentRemovePage: number,
}

export default class DialogRemoveUsers extends React.Component<DialogRemoveUsersProps, DialogRemoveUsersState> {
  private maxUsersPerPage: number;

  constructor(props: DialogRemoveUsersProps) {
    super(props);
    this.maxUsersPerPage = this.props.maxUsersPerPage ? this.props.maxUsersPerPage : 5;
    this.state = {
      removeUsersPage: [],
      activeTab: this.props.identifier + "-ALL",
      currentAllPage: 1,
      currentRemovePage: 1,
    }
    this.onTabChange = this.onTabChange.bind(this);
    this.goToAllUsersPage = this.goToAllUsersPage.bind(this);
    this.goToRemovePage = this.goToRemovePage.bind(this);
    this.turnUserToUiSelectItem = this.turnUserToUiSelectItem.bind(this);
    this.toggleUserRemoved = this.toggleUserRemoved.bind(this);
    this.refreshRemoveUserpage = this.refreshRemoveUserpage.bind(this);
  }

  onTabChange(identifier: string) {
    this.setState({
      activeTab: identifier
    });
  }

  goToAllUsersPage(n: number){
    this.setState({ currentAllPage: n});
    this.props.changePage(n);
  }

  goToRemovePage(n: number){
    this.setState({currentRemovePage: n});
   this.refreshRemoveUserpage(n, this.props.removeUsers);
  }

  turnUserToUiSelectItem (user: UserType){
    return {
      label: user.firstName + " " + user.lastName,
      id: user.id,
      icon: "user",
    } as UiSelectItem;
  }

  refreshRemoveUserpage(page: number, removeUsers: UiSelectItem[]) {
    let pageStart: number = (page - 1) * this.maxUsersPerPage;
    let pageEnd: number = pageStart + this.maxUsersPerPage;
    let newRemoveUsers: UiSelectItem[] = [];

    for(let i = pageStart; i < pageEnd; i ++ ) {
      if(removeUsers[i]) {
       newRemoveUsers = newRemoveUsers.concat(removeUsers[i]);
      }
    }
    this.setState({removeUsersPage: newRemoveUsers});
    if(newRemoveUsers.length === 0 && this.state.currentRemovePage !== 1) {
      this.goToRemovePage(this.state.currentRemovePage -1);
    }

  }

  toggleUserRemoved(user: UserType) {
    this.props.setRemoved(this.turnUserToUiSelectItem(user));
  }

  UNSAFE_componentWillReceiveProps(nextProps:DialogRemoveUsersProps, nextState:DialogRemoveUsersState ) {
    if(this.props.removeUsers.length !== nextProps.removeUsers.length ) {
      this.refreshRemoveUserpage(this.state.currentRemovePage, nextProps.removeUsers);
    }
  }

  componentDidMount() {
    this.refreshRemoveUserpage(this.state.currentRemovePage, this.props.removeUsers);
    this.goToAllUsersPage(this.state.currentAllPage);
  }

  render(){
    return(
    <Tabs onTabChange={this.onTabChange} renderAllComponents activeTab={this.state.activeTab} tabs={[
      {
        id: this.props.identifier + "-ALL",
        name: this.props.allTabTitle,
        component: ()=>{
          return <DialogRow>
            <DialogRow>
              <SearchFormElement name="search-user-group-users" placeholder={this.props.placeholder} value={this.props.searchValue} id="searchUserGroupUsers"  updateField={this.props.searchUsers} />
            </DialogRow>
            <DialogRow>
              <ApplicationList modifiers="workspace-templates">
                {this.props.users.length > 0 ?
                  this.props.users.map((user: UserType) => {
                    return <ApplicationListItem className="course" key={"all-" + user.id}>
                      <ApplicationListItemContentWrapper>
                        <ApplicationListItemHeader onClick={this.toggleUserRemoved.bind(this, user)} modifiers="course">
                          <span className="application-list__header-primary">{user.firstName + " " + user.lastName}</span>
                          <span className="application-list__header-secondary">TODO: Archive</span>
                        </ApplicationListItemHeader>
                      </ApplicationListItemContentWrapper>
                    </ApplicationListItem>
                  })
                  : <div className="empty">{this.props.onEmptyTitle}</div>}
              </ApplicationList>
            </DialogRow>
            <DialogRow>
            <Pager identifier={this.props.identifier + "All"} current={this.state.currentAllPage} onClick={this.goToAllUsersPage} pages={this.props.pages}></Pager>
            </DialogRow>
          </DialogRow>
        }
      },
      {
        id: this.props.identifier + "-REMOVE",
        name: this.props.removeTabTitle,
        component: ()=>{
          let removePages = Math.ceil(this.props.removeUsers.length / this.maxUsersPerPage);
          return <DialogRow>
            <DialogRow>
              <ApplicationList modifiers="workspace-templates">
                {this.state.removeUsersPage.length > 0 ?
                  this.state.removeUsersPage.map((user: UiSelectItem) => {
                    return <ApplicationListItem className="course" key={"remove-" + user.id}>
                      <ApplicationListItemContentWrapper>
                        <ApplicationListItemHeader onClick={this.toggleUserRemoved.bind(this, user)} modifiers="course">
                          <span className="application-list__header-primary">{user.label}</span>
                          <span className="application-list__header-secondary">TODO: Archive</span>
                        </ApplicationListItemHeader>
                      </ApplicationListItemContentWrapper>
                    </ApplicationListItem>
                  })
                  : <div className="empty">{this.props.onEmptyTitle}</div>}
              </ApplicationList>
            </DialogRow>
            <DialogRow>
              {this.props.removeUsers.length > 0 ?
              <Pager identifier={this.props.identifier + "Remove"} current={this.state.currentRemovePage} onClick={this.goToRemovePage} pages={removePages}></Pager> : null }
            </DialogRow>
          </DialogRow>
        }
      }
    ]} />
    )
  }
}
