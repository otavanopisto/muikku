import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Dialog, { DialogRow, DialogRowHeader, DialogRowContent } from '~/components/general/dialog';
import { FormWizardActions, InputFormElement, SearchFormElement } from '~/components/general/form-element';
import { loadSelectorStudents, loadSelectorStaff, LoadUsersTriggerType, loadUserGroupUsers, loadUsergroups, updateUsergroup, UpdateUsergroupTriggerType} from '~/actions/main-function/users';
import {loadCurrentOrganizationWorkspaceSelectStudents, LoadStudentsOfWorkspaceTriggerType} from '~/actions/workspaces';
import { i18nType } from '~/reducers/base/i18n';
import { StateType } from '~/reducers';
import { bindActionCreators } from 'redux';
import AutofillSelector, { UiSelectItem } from '~/components/base/input-select-autofill';
import { SelectItem } from '~/actions/workspaces/index';
import { UsersSelectType } from '~/reducers/main-function/users';
import { UserGroupType, UpdateUserGroupType, ModifyUserGroupUsersType , UpdateUserGroupStateType, UserType} from '~/reducers/user-index';

interface ValidationType {
  nameValid: number
}

interface OrganizationEditUsergroupProps {
  children?: React.ReactElement<any>,
  usergroup: UserGroupType,
  i18n: i18nType,
  users: UsersSelectType,
  updateOrganizationUsergroup: UpdateUsergroupTriggerType,
  loadUserGroupUsers: LoadUsersTriggerType,
  loadStudents: LoadUsersTriggerType,
  loadStaff: LoadUsersTriggerType,
  loadUsergroups: LoadUsersTriggerType
}

interface OrganizationEditUsergroupState {
  usergroupName: string,
  locked: boolean,
  currentStep: number,
  addStudents: UiSelectItem[],
  addStaff: UiSelectItem[],
  removeStudents: UiSelectItem[],
  removeStaff: UiSelectItem[],
  selectedStudents: SelectItem[],
  selectedStaff: SelectItem[],
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

  constructor(props: OrganizationEditUsergroupProps) {
    super(props);
    this.totalSteps = 4;
    this.state = {
      usergroupName: this.props.usergroup.name,
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

      usergroupUpdated: false,
      studentsAdded: false,
      studentsRemoved: false,
      staffAdded: false,
      staffRemoved: false,
    };

    this.doStaffSearch = this.doStaffSearch.bind(this);
    this.selectStaff = this.selectStaff.bind(this);
    this.deleteStaff = this.deleteStaff.bind(this);
    this.doStudentSearch = this.doStudentSearch.bind(this);
    this.selectStudent = this.selectStudent.bind(this);
    this.deleteStudent = this.deleteStudent.bind(this);
    this.setUsergroupName = this.setUsergroupName.bind(this);
    this.saveUsergroup = this.saveUsergroup.bind(this);
    this.clearComponentState = this.clearComponentState.bind(this);
  }
  doStudentSearch(q: string) {
    this.props.loadStudents({q});
  }

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
    this.props.loadStaff({q});
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
    if (this.state.currentStep === 1) {
      if (this.state.selectedStudents.length === 0) {
        this.props.loadUserGroupUsers({
          q: "",
          loaderType: "students",
          userGroupIds: [this.props.usergroup.id],
          selectItems: (result: Array<SelectItem>) => {
            this.setState({selectedStudents: result});
          }
        });
      }
    }
    if (this.state.currentStep === 2) {
      if (this.state.selectedStaff.length === 0) {
        this.props.loadUserGroupUsers({
          q: "",
          loaderType: "staff",
          userGroupIds: [this.props.usergroup.id],
          selectItems: (result: Array<SelectItem>) => {
            this.setState({selectedStaff: result});
          }
        });
      }
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
    let addUsers: ModifyUserGroupUsersType ;
    let removeUsers: ModifyUserGroupUsersType;


    if (this.props.usergroup.name !== this.state.usergroupName) {
      update = {
         name: this.state.usergroupName,
         // We get a number, but need it to be a string
         identifier: this.props.usergroup.id.toString(),
         isGuidanceGroup: this.props.usergroup.isGuidanceGroup,
        }
    }

    if(this.state.addStudents.length !== 0) {
      addUsers = {
        groupIdentifier: this.props.usergroup.id.toString(),
        userIdentifiers: this.state.addStudents.map(student => student.id as string)
      };
    }

    if(this.state.removeStudents.length !== 0) {
      removeUsers = {
        groupIdentifier: this.props.usergroup.id.toString(),
        userIdentifiers: this.state.removeStudents.map(student => student.id as string)
      };
    }

    if(this.state.addStaff.length !== 0) {
      if(!addUsers){
        addUsers.groupIdentifier = this.props.usergroup.id.toString();
      }
       addUsers.userIdentifiers = addUsers.userIdentifiers.concat(this.state.addStaff.map(staff => staff.id as string));
    }

    if(this.state.removeStaff.length !== 0) {
      if(!removeUsers){
        removeUsers.groupIdentifier = this.props.usergroup.id.toString();
      }
      removeUsers.userIdentifiers = removeUsers.userIdentifiers.concat(this.state.removeStaff.map(staff => staff.id as string));
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
          setTimeout(() => this.props.loadUsergroups({q:""}), 2000);
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
        // if (this.props.currentWorkspace && this.props.currentWorkspace.studentsSelect && this.props.currentWorkspace.studentsSelect.state === "READY" && this.state.studentsLoaded === false) {
        //   this.setState({ selectedStudents: this.props.currentWorkspace.studentsSelect.users, studentsLoaded: true });
        // }
        return <DialogRow modifiers="edit-workspace">
          <AutofillSelector modifier="add-students"
            loader={this.doStudentSearch}
            placeholder={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.search.students.placeholder')}
            selectedItems={this.state.selectedStudents} searchItems={students} onDelete={this.deleteStudent} onSelect={this.selectStudent} />
        </DialogRow>;
      case 3:
        let staffSearchItems = this.props.users.staff.map(staff => {
          return { id: staff.id, label: staff.firstName + " " + staff.lastName, icon: "user" }
        });

        // if (this.props.currentWorkspace && this.props.currentWorkspace.staffMemberSelect && this.props.currentWorkspace.staffMemberSelect.state === "READY" && this.state.staffLoaded === false) {
        //   this.setState({ selectedStaff: this.props.currentWorkspace.staffMemberSelect.users, staffLoaded: true });
        // }

        return <DialogRow modifiers="edit-workspace">
          <AutofillSelector modifier="add-teachers"
            loader={this.doStaffSearch}
            placeholder={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.search.teachers.placeholder')}
            selectedItems={this.state.selectedStaff} searchItems={staffSearchItems} onDelete={this.deleteStaff} onSelect={this.selectStaff} />
        </DialogRow>;
      case 4:
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

    return (<Dialog executing={this.state.executing} onClose={this.clearComponentState} executeContent={executeContent} footer={footer} modifier="new-user"
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
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({
    loadStudents: loadSelectorStudents,
    loadStaff: loadSelectorStaff,
    loadUsergroups,
    updateOrganizationUsergroup: updateUsergroup,
    loadUserGroupUsers,
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationEditUsergroup);
