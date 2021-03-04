import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Dialog, { DialogRow, DialogRowHeader, DialogRowContent } from '~/components/general/dialog';
import { FormWizardActions, InputFormElement, SearchFormElement } from '~/components/general/form-element';
import { loadSelectorStudents, loadSelectorStaff, LoadUsersTriggerType, setCurrentUserGroup, SetCurrentUserGroupTriggerType,
  loadAllCurrentUserGroupUsers, loadUsergroups, updateUsergroup, UpdateUsergroupTriggerType} from '~/actions/main-function/users';
import { i18nType } from '~/reducers/base/i18n';
import { StateType } from '~/reducers';
import { bindActionCreators } from 'redux';
import AutofillSelector, { UiSelectItem } from '~/components/base/input-select-autofill';
import { SelectItem } from '~/actions/workspaces/index';
import { UsersSelectType,  UpdateUserGroupType, OrganizationUsersListType, ModifyUserGroupUsersType , UpdateUserGroupStateType, CurrentUserGroupType, } from '~/reducers/main-function/users';
import { UserGroupType} from '~/reducers/user-index';
import DialogRemoveUsers from "~/components/general/dialog-remove-user";
import { UserType } from '../../../reducers/user-index';
import usergroup from '../body/application/usergroups/usergroup';

interface ValidationType {
  nameValid: number
}

interface OrganizationEditUsergroupProps {
  children?: React.ReactElement<any>,
  usergroup: UserGroupType,
  i18n: i18nType,
  users: UsersSelectType,
  currentUserGroup : CurrentUserGroupType,
  setCurrentUserGroup: SetCurrentUserGroupTriggerType
  updateOrganizationUsergroup: UpdateUsergroupTriggerType,
  loadAllCurrentUserGroupUsers: LoadUsersTriggerType,
  loadStudents: LoadUsersTriggerType,
  loadStaff: LoadUsersTriggerType,
  loadUsergroups: LoadUsersTriggerType
}

interface OrganizationEditUsergroupState {
  usergroupName: string,
  pages: number,
  locked: boolean,
  currentStep: number,
  addStudents: UiSelectItem[],
  addStaff: UiSelectItem[],
  removeStudents: UiSelectItem[],
  removeStaff: UiSelectItem[],
  selectedStudents: UiSelectItem[],
  selectedStaff: UiSelectItem[],
  userGroupStudentSearchValue: string,
  userGroupStaffSearchValue: string,
  studentsLoaded: boolean,
  executing: boolean,
  validation: ValidationType,
  usergroupUpdated: boolean,
  studentsAdded: boolean,
  studentsRemoved: boolean,
  staffAdded: boolean,
  staffRemoved: boolean,
}

class OrganizationEditUsergroup extends React.Component<OrganizationEditUsergroupProps, OrganizationEditUsergroupState> {

  private totalSteps: number;
  private usersPerPage: number = 5;

  constructor(props: OrganizationEditUsergroupProps) {
    super(props);


    this.totalSteps = 6;
    this.state = {
      pages: null,
      usergroupName: this.props.usergroup.name,
      selectedStudents: [],
      selectedStaff: [],
      addStudents: [],
      userGroupStudentSearchValue:"",
      userGroupStaffSearchValue:"",
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

      usergroupUpdated: false,
      studentsAdded: false,
      studentsRemoved: false,
      staffAdded: false,
      staffRemoved: false,
    }

    this.getToPage = this.getToPage.bind(this);
    this.doStaffSearch = this.doStaffSearch.bind(this);
    this.selectStaff = this.selectStaff.bind(this);
    this.deleteStaff = this.deleteStaff.bind(this);
    this.doStudentSearch = this.doStudentSearch.bind(this);
    this.selectStudent = this.selectStudent.bind(this);
    this.deleteStudent = this.deleteStudent.bind(this);
    this.doUserGroupUserSearch = this.doUserGroupUserSearch.bind(this);
    this.setUsergroupName = this.setUsergroupName.bind(this);
    this.saveUsergroup = this.saveUsergroup.bind(this);
    this.clearComponentState = this.clearComponentState.bind(this);
    this.toggleStudentRemove = this.toggleStudentRemove.bind(this);
    this.toggleStaffRemove = this.toggleStaffRemove.bind(this);
    // this.setSelectedUserGroup = this.setSelectedUserGroup.bind(this);
  }



  getToPage(n: number) {
    let pageStart: number = (n - 1) * this.usersPerPage;
    let query: string = this.state.userGroupStudentSearchValue ? this.state.userGroupStudentSearchValue : null;
    this.props.loadAllCurrentUserGroupUsers({payload:{q: query, firstResult: pageStart, maxResults:  this.usersPerPage, userGroupIds: [this.props.currentUserGroup.id] }});
  }

  doStudentSearch(q: string) {
    this.props.loadStudents({payload:{q}});
  }

  doUserGroupUserSearch(q: string) {
    this.props.setCurrentUserGroup(this.props.usergroup.id);
    this.props.loadAllCurrentUserGroupUsers({
      payload: {
        q,
        userGroupIds: [this.props.usergroup.id],
        firstResult: 0,
        maxResults: 5,
      },
      success: (users: OrganizationUsersListType) => {
        this.setState({
          userGroupStudentSearchValue: q,
          pages: Math.ceil(users.totalHitCount / this.usersPerPage)
        });
      }
    });

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


  // cancelStudentRemove(usr: UiSelectItem) {
  //   let newRemoveState = this.state.removeStudents.concat(usr);
  //   this.setState({
  //     removeStudents: newRemoveState
  //   });
  // }


  selectStudent(student: SelectItem) {
    let studentIsDeleted = this.state.removeStudents.some(rStudent => rStudent.id === student.id);
    let newSelectedState = this.state.selectedStudents.concat(student);
    let newAddState = studentIsDeleted ? this.state.addStudents : this.state.addStudents.concat(student);
    let newRemoveState = studentIsDeleted ? this.state.removeStudents.filter(rStudent => rStudent.id !== student.id) : this.state.removeStudents;
    this.setState({ selectedStudents: newSelectedState, addStudents: newAddState, removeStudents: newRemoveState });
  }

  deleteStudent(student: SelectItem) {
    let studentIsAdded = this.state.addStudents.some(aStudent => aStudent.id === student.id);
    let newSelectedState = this.state.selectedStudents.filter(selectedItem => selectedItem.id !== student.id);
    let newRemoveState = studentIsAdded ? this.state.removeStudents : this.state.removeStudents.concat(student);
    let newAddState = studentIsAdded ? this.state.addStudents.filter(aStudent => aStudent.id !== student.id) : this.state.addStudents;
    this.setState({ selectedStudents: newSelectedState, removeStudents: newRemoveState, addStudents: newAddState });
  }


  doStaffSearch(q: string) {
    this.props.loadStaff({payload:{q}});
  }

  selectStaff(staff: SelectItem) {
    let staffIsDeleted = this.state.removeStaff.some(rStaff => rStaff.id === staff.id);
    let newSelectedState = this.state.selectedStaff.concat(staff);
    let newAddState = staffIsDeleted ? this.state.addStaff : this.state.addStaff.concat(staff);
    let newRemoveState = staffIsDeleted ? this.state.removeStaff.filter(rStaff => rStaff.id !== staff.id) : this.state.removeStaff;
    this.setState({ addStaff: newAddState, selectedStaff: newSelectedState, removeStaff: newRemoveState });
  }

  deleteStaff(staff: SelectItem) {
    let staffIsAdded = this.state.addStaff.some(aStaff => aStaff.id === staff.id);
    let newSelectedState = this.state.selectedStaff.filter(selectedItem => selectedItem.id !== staff.id);
    let newRemoveState = staffIsAdded ? this.state.removeStudents : this.state.removeStaff.concat(staff);
    let newAddState = staffIsAdded ? this.state.addStaff.filter(aStaff => aStaff.id !== staff.id) : this.state.addStaff;
    this.setState({ selectedStaff: newSelectedState, removeStaff: newRemoveState, addStaff: newAddState });
  }


  setUsergroupName(value: string) {
    this.setState({ locked: false, usergroupName: value });
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
      usergroupUpdated: false,
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
    if(this.state.currentStep === 2){
      // if( !this.props.currentUserGroup || this.props.currentUserGroup.id !== this.props.usergroup.id) {
        this.doUserGroupUserSearch("");
      // }
    }
    if(this.state.currentStep === 4){
      // if( !this.props.currentUserGroup || this.props.currentUserGroup.id !== this.props.usergroup.id) {
        this.doUserGroupUserSearch("");
      // }
    }
    if (this.state.usergroupName === "") {
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
    let groupIdentifier:string = this.props.usergroup.id.toString();

    if (this.props.usergroup.name !== this.state.usergroupName) {
      update = {
         name: this.state.usergroupName,
         // We get a number, but need it to be a string
         identifier: groupIdentifier,
         isGuidanceGroup: this.props.usergroup.isGuidanceGroup,
        }
    }

    if(this.state.addStudents.length !== 0) {
      addUsers = {
        groupIdentifier: groupIdentifier,
        userIdentifiers: this.state.addStudents.map(student => student.id as string),
      }
    }

    if(this.state.removeStudents.length !== 0) {
      removeUsers = {
        groupIdentifier: groupIdentifier,
        userIdentifiers: this.state.removeStudents.map(student => student.id as string),
      }
    }

    if(this.state.addStaff.length !== 0) {
      if(!addUsers){
        addUsers = {
          groupIdentifier: groupIdentifier,
          userIdentifiers: this.state.addStaff.map(staff => staff.id as string),
        }
      }else {
        addUsers.userIdentifiers = addUsers.userIdentifiers.concat(this.state.addStaff.map(staff => staff.id as string));
      }
    }

    if(this.state.removeStaff.length !== 0) {
      if(!removeUsers){
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
        if(state === "update-group") {
          this.setState({
            usergroupUpdated: true,
          });
        }
        if(state === "add-users") {
          this.setState({
            studentsAdded: true,
          });
        }
        if(state === "remove-users") {
          this.setState({
            studentsRemoved: true,
          });
        }
        if(state === "done") {
          setTimeout(() => this.props.loadUsergroups({payload:{q:""}}), 2000);
        }
      },

      success: ()=> {
        closeDialog();
      },

      fail: ()=> {
        closeDialog();
      }
    });
  }

  wizardSteps(page: number) {

    switch (page) {
      case 1:
        return <div>
          <DialogRow modifiers="edit-workspace">
            <InputFormElement modifiers="workspace-name" mandatory={true} updateField={this.setUsergroupName} valid={this.state.validation.nameValid} name="usergroupName" label={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.name.label')} value={this.state.usergroupName}></InputFormElement>
          </DialogRow>
          <DialogRow modifiers="edit-workspace">

          </DialogRow>
        </div >;
      case 2:
        let students = this.props.users.students.map(student => {
          return { id: student.id, label: student.firstName + " " + student.lastName, icon: "user", type: "student" }
        });
        return <DialogRow modifiers="edit-workspace">
          <AutofillSelector modifier="add-students"
            loader={this.doStudentSearch}
            placeholder={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.search.students.placeholder')}
            selectedItems={this.state.selectedStudents} searchItems={students} onDelete={this.deleteStudent} onSelect={this.selectStudent} />
        </DialogRow>;
      case 3:
        let studentGroupStudents = this.props.currentUserGroup.users ? this.props.currentUserGroup.users.results : [];
        return <DialogRemoveUsers
        users={studentGroupStudents} 
        placeholder={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.search.students.placeholder')}
        removeUsers={this.state.removeStudents}
        pages={this.state.pages}
        identifier={"userGroup" + this.props.usergroup.id + "Students"}
        allTabTitle={this.props.i18n.text.get('plugin.workspace.users.students.link.active')}
        removeTabTitle={this.props.i18n.text.get('plugin.workspace.users.students.link.active')}
        onEmptyTitle={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.templates.empty')}
        searchValue={this.state.userGroupStudentSearchValue}
        searchUsers={this.doUserGroupUserSearch}
        changePage={this.getToPage}
        setRemoved={this.toggleStudentRemove} />

      case 4:
        let staffSearchItems = this.props.users.staff.map(staff => {
          return { id: staff.id, label: staff.firstName + " " + staff.lastName, icon: "user" }
        });
        return <DialogRow modifiers="edit-workspace">
          <AutofillSelector modifier="add-teachers"
            loader={this.doStaffSearch}
            placeholder={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.search.teachers.placeholder')}
            selectedItems={this.state.selectedStaff} searchItems={staffSearchItems} onDelete={this.deleteStaff} onSelect={this.selectStaff} />
        </DialogRow>;
      case 5:
          let studentGroupStaff = this.props.currentUserGroup.users ? this.props.currentUserGroup.users.results : [];
          return <DialogRemoveUsers
          users={studentGroupStaff} 
          placeholder={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.search.students.placeholder')}
          removeUsers={this.state.removeStaff}
          pages={this.state.pages}
          identifier={"userGroup" + this.props.usergroup.id + "Staff"}
          allTabTitle={this.props.i18n.text.get('plugin.workspace.users.students.link.active')}
          removeTabTitle={this.props.i18n.text.get('plugin.workspace.users.students.link.active')}
          onEmptyTitle={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.templates.empty')}
          searchValue={this.state.userGroupStaffSearchValue}
          searchUsers={this.doUserGroupUserSearch}
          changePage={this.getToPage}
          setRemoved={this.toggleStaffRemove}
          />
      case 6:
        return <DialogRow modifiers="edit-workspace-summary">
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" label={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.label.workspaceName')} />
            <DialogRowContent modifiers="new-workspace">
              <div>{this.state.usergroupName}</div>
            </DialogRowContent>
          </DialogRow>
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" label={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.label.addStudents')} />
            <DialogRowContent modifiers="new-workspace">
              {this.state.addStudents.length > 0 ?
                this.state.addStudents.map((student) => {
                  return <span key={student.id} className="tag-input__selected-item">
                    {student.icon ?
                      <span className={`glyph glyph--selected-recipient icon-${student.icon}`} />
                      : null}
                    {student.label}
                  </span>
                }) : <div>{this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.empty.students')}</div>}
            </DialogRowContent>
          </DialogRow>
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" label={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.label.addTeachers')} />
            <DialogRowContent modifiers="new-workspace">
              {this.state.addStaff.length > 0 ?
                this.state.addStaff.map((staff) => {
                  return <span key={staff.id} className="tag-input__selected-item">
                    {staff.icon ?
                      <span className={`glyph glyph--selected-recipient icon-${staff.icon}`} />
                      : null}
                    {staff.label}
                  </span>
                }) : <div>{this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.empty.teachers')}</div>}
            </DialogRowContent>
          </DialogRow>
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" label={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.label.removeStudents')} />
            <DialogRowContent modifiers="new-workspace">
              {this.state.removeStudents.length > 0 ?
                this.state.removeStudents.map((student) => {
                  return <span key={student.id} className="tag-input__selected-item">
                    {student.icon ?
                      <span className={`glyph glyph--selected-recipient icon-${student.icon}`} />
                      : null}
                    {student.label}
                  </span>
                }) : <div>{this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.empty.students')}</div>}
            </DialogRowContent>
          </DialogRow>
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" label={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.label.removeTeachers')} />
            <DialogRowContent modifiers="new-workspace">
              {this.state.removeStaff.length > 0 ?
                this.state.removeStaff.map((staff) => {
                  return <span key={staff.id} className="tag-input__selected-item">
                    {staff.icon ?
                      <span className={`glyph glyph--selected-recipient icon-${staff.icon}`} />
                      : null}
                    {staff.label}</span>
                }) : <div>{this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.empty.teachers')}</div>}
            </DialogRowContent>
          </DialogRow>
        </DialogRow>;
      default: return <div>EMPTY</div>
    }
  }

  render() {
    let content = (closePortal: () => any) => this.wizardSteps(this.state.currentStep);
    let executeContent = <div><div className={`dialog__executer ${this.state.usergroupUpdated === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.execute.updateWorkspace')}</div>
      <div className={`dialog__executer ${this.state.studentsAdded === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.execute.addStudents')}</div>
      <div className={`dialog__executer ${this.state.studentsRemoved === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.execute.removeStudents')}</div></div>;

    let footer = (closePortal: () => any) => <FormWizardActions locked={this.state.locked}
      currentStep={this.state.currentStep} totalSteps={this.totalSteps}
      executeLabel={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.execute.label')}
      nextLabel={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.next.label')}
      lastLabel={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.last.label')}
      cancelLabel={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.cancel.label')}
      executeClick={this.saveUsergroup.bind(this, closePortal)}
      nextClick={this.nextStep.bind(this)}
      lastClick={this.lastStep.bind(this)}
      cancelClick={this.cancelDialog.bind(this, closePortal)} />;

    return (<Dialog executing={this.state.executing} onClose={this.clearComponentState} executeContent={executeContent} footer={footer} modifier="edit-user-group"
      title={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.title')}
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
    loadUsergroups,
    updateOrganizationUsergroup: updateUsergroup,
    loadAllCurrentUserGroupUsers,
    setCurrentUserGroup,
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationEditUsergroup);
