import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Dialog, { DialogRow, DialogRowHeader, DialogRowContent, DialogRemoveUsers } from '~/components/general/dialog';
import { FormWizardActions, InputFormElement } from '~/components/general/form-element';
import {
  loadSelectorStudents, loadSelectorStaff, LoadUsersTriggerType, setCurrentUserGroup, SetCurrentUserGroupTriggerType,
  loadAllCurrentUserGroupStudents, loadAllCurrentUserGroupStaff, loadUserGroups, updateUsergroup, UpdateUsergroupTriggerType
} from '~/actions/main-function/users';
import { i18nType } from '~/reducers/base/i18n';
import { StateType } from '~/reducers';
import { bindActionCreators } from 'redux';
import AutofillSelector, { UiSelectItem } from '~/components/base/input-select-autofill';
import { SelectItem } from '~/actions/workspaces/index';
import { UsersSelectType, UpdateUserGroupType, OrganizationUsersListType, ModifyUserGroupUsersType, UpdateUserGroupStateType, CurrentUserGroupType, } from '~/reducers/main-function/users';
import { UserGroupType } from '~/reducers/user-index';

interface ValidationType {
  nameValid: number
}

type UserCategoriesType = "students" | "staff";

interface OrganizationEditUsergroupProps {
  children?: React.ReactElement<any>,
  usergroup: UserGroupType,
  i18n: i18nType,
  users: UsersSelectType,
  currentUserGroup: CurrentUserGroupType,
  setCurrentUserGroup: SetCurrentUserGroupTriggerType,
  updateOrganizationUsergroup: UpdateUsergroupTriggerType,
  loadAllCurrentUserGroupStaff: LoadUsersTriggerType,
  loadAllCurrentUserGroupStudents: LoadUsersTriggerType,
  loadStudents: LoadUsersTriggerType,
  loadStaff: LoadUsersTriggerType,
  loadUserGroups: LoadUsersTriggerType
}

interface OrganizationEditUsergroupState {
  pages: {
    [key: string]: number,
  },
  searchValues: {
    [key: string]: string,
  },
  locked: boolean,
  currentStep: number,
  addStudents: UiSelectItem[],
  addStaff: UiSelectItem[],
  removeStudents: UiSelectItem[],
  removeStaff: UiSelectItem[],
  selectedStudents: UiSelectItem[],
  selectedStaff: UiSelectItem[],
  userGroupName: string,
  isGuidanceGroup: boolean,
  studentsLoaded: boolean,
  executing: boolean,
  validation: ValidationType,
  userGroupUpdated: boolean,
  studentsAdded: boolean,
  studentsRemoved: boolean,
  staffAdded: boolean,
  staffRemoved: boolean,
}

class OrganizationEditUsergroup extends React.Component<OrganizationEditUsergroupProps, OrganizationEditUsergroupState> {

  private totalSteps: number = 6;
  private usersPerPage: number = 5;
  private searchTimer: NodeJS.Timer;

  constructor(props: OrganizationEditUsergroupProps) {
    super(props);
    this.state = {
      pages: null,
      searchValues: null,
      userGroupName: this.props.usergroup.name,
      isGuidanceGroup: this.props.usergroup.isGuidanceGroup,
      selectedStudents: [],
      selectedStaff: [],
      addStudents: [],
      addStaff: [],
      removeStudents: [],
      removeStaff: [],
      studentsLoaded: false,
      locked: false,
      currentStep: 1,
      executing: false,
      validation: {
        nameValid: 2
      },

      userGroupUpdated: false,
      studentsAdded: false,
      studentsRemoved: false,
      staffAdded: false,
      staffRemoved: false,
    }

    this.goToPage = this.goToPage.bind(this);
    this.goToStudentPage = this.goToStudentPage.bind(this);
    this.goToStaffPage = this.goToStaffPage.bind(this);
    this.doStaffSearch = this.doStaffSearch.bind(this);
    this.selectStaff = this.selectStaff.bind(this);
    this.deleteStaff = this.deleteStaff.bind(this);
    this.doStudentSearch = this.doStudentSearch.bind(this);
    this.selectStudent = this.selectStudent.bind(this);
    this.deleteStudent = this.deleteStudent.bind(this);
    this.doUserGroupStudentSearch = this.doUserGroupStudentSearch.bind(this);
    this.doUserGroupStaffSearch = this.doUserGroupStaffSearch.bind(this);
    this.doUserGroupUsersSearch = this.doUserGroupUsersSearch.bind(this);
    this.setUserGroupName = this.setUserGroupName.bind(this);
    this.saveUsergroup = this.saveUsergroup.bind(this);
    this.clearComponentState = this.clearComponentState.bind(this);
    this.toggleStudentRemove = this.toggleStudentRemove.bind(this);
    this.toggleStaffRemove = this.toggleStaffRemove.bind(this);
    this.setGuidanceGroup = this.setGuidanceGroup.bind(this);
  }

  doStudentSearch(q: string) {
    this.props.loadStudents({ payload: { q } });
  }

  goToPage(n: number, loader: LoadUsersTriggerType, query: string) {
    let pageStart: number = (n - 1) * this.usersPerPage;
    loader({ payload: { q: query, firstResult: pageStart, maxResults: this.usersPerPage, userGroupIds: [this.props.usergroup.id] } });
  }

  goToStudentPage(n: number) {
    let query: string = this.state.searchValues && this.state.searchValues.staff ? this.state.searchValues.staff : null;
    this.goToPage(n, this.props.loadAllCurrentUserGroupStudents, query);
  }

  goToStaffPage(n: number) {
    let query: string = this.state.searchValues && this.state.searchValues.staff ? this.state.searchValues.staff : null;
    this.goToPage(n, this.props.loadAllCurrentUserGroupStaff, query);
  }

  doUserGroupUsersSearch(loader: LoadUsersTriggerType, q: string, type: UserCategoriesType) {
    loader({
      payload: {
        q,
        userGroupIds: [this.props.usergroup.id],
        firstResult: 0,
        maxResults: 5,
      },
      success: (users: OrganizationUsersListType) => {
        this.setState({
          pages: { ...this.state.pages, [type]: Math.ceil(users.totalHitCount / this.usersPerPage) }
        });
      }
    })
  }

  doUserGroupStudentSearch(q: string) {
    this.setState({ searchValues: { ...this.state.searchValues, ["students"]: q } })
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(this.doUserGroupUsersSearch.bind(null, this.props.loadAllCurrentUserGroupStudents, q, "students") as any, 400);
  }

  doUserGroupStaffSearch(q: string) {
    this.setState({ searchValues: { ...this.state.searchValues, ["staff"]: q } })
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(this.doUserGroupUsersSearch.bind(null, this.props.loadAllCurrentUserGroupStaff, q, "staff") as any, 400);
  }

  toggleStudentRemove(usr: UiSelectItem) {
    let newRemoveState = this.state.removeStudents.some(rStudent => rStudent.id === usr.id) ? this.state.removeStudents.filter(rStudent => rStudent.id !== usr.id) : this.state.removeStudents.concat(usr);
    this.setState({
      removeStudents: newRemoveState
    });
  }

  toggleStaffRemove(usr: UiSelectItem) {
    let newRemoveState = this.state.removeStaff.some(rStaff => rStaff.id === usr.id) ? this.state.removeStaff.filter(rStaff => rStaff.id !== usr.id) : this.state.removeStaff.concat(usr);
    this.setState({
      removeStaff: newRemoveState
    });
  }

  selectStudent(student: SelectItem) {
    let studentIsDeleted = this.state.removeStudents.some(rStudent => rStudent.id === student.id);
    let newSelectedState = this.state.selectedStudents.concat(student);
    let newAddState = studentIsDeleted ? this.state.addStudents : this.state.addStudents.concat(student);
    this.setState({ selectedStudents: newSelectedState, addStudents: newAddState });
  }

  deleteStudent(student: SelectItem) {
    let studentIsAdded = this.state.addStudents.some(aStudent => aStudent.id === student.id);
    let newSelectedState = this.state.selectedStudents.filter(selectedItem => selectedItem.id !== student.id);
    let newAddState = studentIsAdded ? this.state.addStudents.filter(aStudent => aStudent.id !== student.id) : this.state.addStudents;
    this.setState({ selectedStudents: newSelectedState, addStudents: newAddState });
  }

  doStaffSearch(q: string) {
    this.props.loadStaff({ payload: { q } });
  }

  selectStaff(staff: SelectItem) {
    let staffIsDeleted = this.state.removeStaff.some(rStaff => rStaff.id === staff.id);
    let newSelectedState = this.state.selectedStaff.concat(staff);
    let newAddState = staffIsDeleted ? this.state.addStaff : this.state.addStaff.concat(staff);
    this.setState({ addStaff: newAddState, selectedStaff: newSelectedState });
  }

  deleteStaff(staff: SelectItem) {
    let staffIsAdded = this.state.addStaff.some(aStaff => aStaff.id === staff.id);
    let newSelectedState = this.state.selectedStaff.filter(selectedItem => selectedItem.id !== staff.id);
    let newAddState = staffIsAdded ? this.state.addStaff.filter(aStaff => aStaff.id !== staff.id) : this.state.addStaff;
    this.setState({ selectedStaff: newSelectedState, addStaff: newAddState });
  }

  setGuidanceGroup(value: boolean) {
    this.setState({ isGuidanceGroup: value });
  }

  setUserGroupName(value: string) {
    this.setState({ locked: false, userGroupName: value });
  }

  clearComponentState() {
    this.setState({
      locked: false,
      studentsLoaded: false,
      executing: false,
      currentStep: 1,
      addStudents: [],
      selectedStudents: [],
      removeStudents: [],
      addStaff: [],
      selectedStaff: [],
      removeStaff: [],
      userGroupUpdated: false,
      studentsAdded: false,
      studentsRemoved: false,
      staffAdded: false,
      staffRemoved: false,
    });
  }

  cancelDialog(closeDialog: () => any) {
    closeDialog();
  }

  nextStep() {
    if (this.state.currentStep === 2) {
      this.doUserGroupStudentSearch("");
    }
    if (this.state.currentStep === 4) {
      this.doUserGroupStaffSearch("");
    }
    if (this.state.userGroupName === "") {
      let validation: ValidationType = Object.assign(this.state.validation, { nameValid: 0 });
      this.setState({ locked: true, validation });
    } else {
      let nextStep = this.state.currentStep + 1;
      this.setState({ locked: false, currentStep: nextStep });
    }
  }

  lastStep() {
    let lastStep = this.state.currentStep - 1;
    this.setState({ currentStep: lastStep });
  }

  saveUsergroup(closeDialog: () => any) {
    this.setState({
      locked: true,
      executing: true
    })

    let update: UpdateUserGroupType;
    let addUsers: ModifyUserGroupUsersType;
    let removeUsers: ModifyUserGroupUsersType;
    let groupIdentifier: string = this.props.usergroup.id.toString();

    if (this.props.usergroup.name !== this.state.userGroupName || this.state.isGuidanceGroup !== this.props.usergroup.isGuidanceGroup) {
      update = {
        name: this.state.userGroupName,
        // We get a number, but need it to be a string
        identifier: groupIdentifier,
        isGuidanceGroup: this.state.isGuidanceGroup,
      }
    }

    if (this.state.addStudents.length !== 0) {
      addUsers = {
        groupIdentifier: groupIdentifier,
        userIdentifiers: this.state.addStudents.map(student => student.id as string),
      }
    }

    if (this.state.removeStudents.length !== 0) {
      removeUsers = {
        groupIdentifier: groupIdentifier,
        userIdentifiers: this.state.removeStudents.map(student => student.id as string),
      }
    }

    if (this.state.addStaff.length !== 0) {
      if (!addUsers) {
        addUsers = {
          groupIdentifier: groupIdentifier,
          userIdentifiers: this.state.addStaff.map(staff => staff.id as string),
        }
      } else {
        addUsers.userIdentifiers = addUsers.userIdentifiers.concat(this.state.addStaff.map(staff => staff.id as string));
      }
    }

    if (this.state.removeStaff.length !== 0) {
      if (!removeUsers) {
        removeUsers = {
          groupIdentifier: groupIdentifier,
          userIdentifiers: this.state.removeStaff.map(staff => staff.id as string),
        }
      } else {
        removeUsers.userIdentifiers = removeUsers.userIdentifiers.concat(this.state.removeStaff.map(staff => staff.id as string));
      }
    }

    this.props.updateOrganizationUsergroup({
      update: update,
      addUsers: addUsers,
      removeUsers: removeUsers,
      progress: (state: UpdateUserGroupStateType) => {
        if (state === "update-group") {
          this.setState({
            userGroupUpdated: true,
          });
        }
        if (state === "add-users") {
          this.setState({
            studentsAdded: true,
          });
        }
        if (state === "remove-users") {
          this.setState({
            studentsRemoved: true,
          });
        }
        if (state === "done") {
          setTimeout(() => this.props.loadUserGroups({ payload: { q: "" } }), 2000);
        }
      },

      success: () => {
        closeDialog();
      },

      fail: () => {
        closeDialog();
      }
    });
  }

  wizardSteps(page: number) {
    switch (page) {
      case 1:
        return <div>
          <DialogRow modifiers="edit-workspace">
            <InputFormElement id="userGroupName" modifiers="user-group-name" mandatory={true} updateField={this.setUserGroupName} valid={this.state.validation.nameValid} name="userGroupName" label={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.name.label')} value={this.state.userGroupName}></InputFormElement>
          </DialogRow>
          <DialogRow modifiers="edit-workspace">
            <InputFormElement id="isGuidanceGroup" label={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.guidanceSelect.label')} name="is-guidance-group" value={this.props.usergroup.name} checked={this.state.isGuidanceGroup} type="checkbox" updateField={this.setGuidanceGroup}></InputFormElement>
          </DialogRow>
        </div >;
      case 2:
        let students = this.props.users.students.map(student => {
          return { id: student.id, label: student.firstName + " " + student.lastName, icon: "user", type: "student" }
        });
        return <DialogRow modifiers="edit-workspace">
          <AutofillSelector modifier="add-students"
            loader={this.doStudentSearch}
            placeholder={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.search.students.placeholder')}
            selectedItems={this.state.selectedStudents} searchItems={students} onDelete={this.deleteStudent} onSelect={this.selectStudent} />
        </DialogRow>;
      case 3:
        let studentGroupStudents = this.props.currentUserGroup && this.props.currentUserGroup.students ? this.props.currentUserGroup.students.results : [];
        return <DialogRemoveUsers
          users={studentGroupStudents}
          placeholder={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.search.groupStudents.placeholder')}
          removeUsers={this.state.removeStudents}
          pages={this.state.pages && this.state.pages.students ? this.state.pages.students : 0}
          identifier={"userGroup" + this.props.usergroup.id + "Students"}
          allTabTitle={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.users.tab.groupStudents.title')}
          removeTabTitle={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.users.tab.removeStudents.title')}
          onEmptyTitle={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.users.empty')}
          searchValue={this.state.searchValues && this.state.searchValues.students ? this.state.searchValues.students : ""}
          searchUsers={this.doUserGroupStudentSearch}
          changePage={this.goToStudentPage}
          setRemoved={this.toggleStudentRemove} />

      case 4:
        let staffSearchItems = this.props.users.staff.map(staff => {
          return { id: staff.id, label: staff.firstName + " " + staff.lastName, icon: "user" }
        });
        return <DialogRow modifiers="edit-workspace">
          <AutofillSelector modifier="add-teachers"
            loader={this.doStaffSearch}
            placeholder={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.search.staff.placeholder')}
            selectedItems={this.state.selectedStaff} searchItems={staffSearchItems} onDelete={this.deleteStaff} onSelect={this.selectStaff} />
        </DialogRow>;
      case 5:
        let studentGroupStaff = this.props.currentUserGroup && this.props.currentUserGroup.staff ? this.props.currentUserGroup.staff.results : [];
        return <DialogRemoveUsers
          users={studentGroupStaff}
          placeholder={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.search.groupStaff.placeholder')}
          removeUsers={this.state.removeStaff}
          pages={this.state.pages && this.state.pages.staff ? this.state.pages.staff : 0}
          identifier={"userGroup" + this.props.usergroup.id + "Staff"}
          allTabTitle={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.users.tab.groupStaff.title')}
          removeTabTitle={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.users.tab.removeStaff.title')}
          onEmptyTitle={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.users.empty')}
          searchValue={this.state.searchValues && this.state.searchValues.staff ? this.state.searchValues.staff : ""}
          searchUsers={this.doUserGroupStaffSearch}
          changePage={this.goToStaffPage}
          setRemoved={this.toggleStaffRemove}
        />
      case 6:
        return <DialogRow modifiers="edit-workspace-summary">
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" title={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.label.userGroupName')} />
            <DialogRowContent modifiers="new-workspace">
              <span>{this.state.userGroupName}</span>
              <span>{this.state.isGuidanceGroup ? " (" + this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.label.isGuidanceGroup') + ")" : ""}</span>
            </DialogRowContent>
          </DialogRow>
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" title={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.label.addStudents')} />
            <DialogRowContent modifiers="new-workspace">
              {this.state.addStudents.length > 0 ?
                this.state.addStudents.map((student) => {
                  return <span key={student.id} className="tag-input__selected-item">
                    {student.icon ?
                      <span className={`glyph glyph--selected-recipient icon-${student.icon}`} />
                      : null}
                    {student.label}
                  </span>
                }) : <div>{this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.empty.students')}</div>}
            </DialogRowContent>
          </DialogRow>
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" title={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.label.addStaff')} />
            <DialogRowContent modifiers="new-workspace">
              {this.state.addStaff.length > 0 ?
                this.state.addStaff.map((staff) => {
                  return <span key={staff.id} className="tag-input__selected-item">
                    {staff.icon ?
                      <span className={`glyph glyph--selected-recipient icon-${staff.icon}`} />
                      : null}
                    {staff.label}
                  </span>
                }) : <div>{this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.empty.staff')}</div>}
            </DialogRowContent>
          </DialogRow>
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" title={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.label.removeStudents')} />
            <DialogRowContent modifiers="new-workspace">
              {this.state.removeStudents.length > 0 ?
                this.state.removeStudents.map((student) => {
                  return <span key={student.id} className="tag-input__selected-item">
                    {student.icon ?
                      <span className={`glyph glyph--selected-recipient icon-${student.icon}`} />
                      : null}
                    {student.label}
                  </span>
                }) : <div>{this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.empty.students')}</div>}
            </DialogRowContent>
          </DialogRow>
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" title={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.label.removeStaff')} />
            <DialogRowContent modifiers="new-workspace">
              {this.state.removeStaff.length > 0 ?
                this.state.removeStaff.map((staff) => {
                  return <span key={staff.id} className="tag-input__selected-item">
                    {staff.icon ?
                      <span className={`glyph glyph--selected-recipient icon-${staff.icon}`} />
                      : null}
                    {staff.label}</span>
                }) : <div>{this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.empty.staff')}</div>}
            </DialogRowContent>
          </DialogRow>
        </DialogRow>;
      default: return <div>EMPTY</div>
    }
  }

  render() {
    let content = (closePortal: () => any) => this.wizardSteps(this.state.currentStep);
    let executeContent = <div><div className={`dialog__executer ${this.state.userGroupUpdated === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.execute.updateUserGroup')}</div>
      <div className={`dialog__executer ${this.state.studentsAdded === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.execute.addStudents')}</div>
      <div className={`dialog__executer ${this.state.studentsRemoved === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.execute.removeStudents')}</div>
      <div className={`dialog__executer ${this.state.staffAdded === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.execute.addStaff')}</div>
      <div className={`dialog__executer ${this.state.staffRemoved === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.execute.removeStaff')}</div></div>;

    let footer = (closePortal: () => any) => <FormWizardActions locked={this.state.locked}
      currentStep={this.state.currentStep} totalSteps={this.totalSteps}
      executeLabel={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.edit.execute.label')}
      nextLabel={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.next.label')}
      lastLabel={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.last.label')}
      cancelLabel={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.cancel.label')}
      executeClick={this.saveUsergroup.bind(this, closePortal)}
      nextClick={this.nextStep.bind(this)}
      lastClick={this.lastStep.bind(this)}
      cancelClick={this.cancelDialog.bind(this, closePortal)} />;

    return (<Dialog executing={this.state.executing} onClose={this.clearComponentState} executeContent={executeContent} footer={footer} modifier="edit-user-group"
      title={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.edit.title', this.props.usergroup.name)}
      content={content}>
      {this.props.children}
    </Dialog>
    )
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    users: state.userSelect,
    currentUserGroup: state.userGroups.currentUserGroup
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({
    loadStudents: loadSelectorStudents,
    loadStaff: loadSelectorStaff,
    loadUserGroups,
    updateOrganizationUsergroup: updateUsergroup,
    loadAllCurrentUserGroupStaff,
    loadAllCurrentUserGroupStudents,
    setCurrentUserGroup,
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationEditUsergroup);
