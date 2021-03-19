import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Dialog, { DialogRow, DialogRowHeader, DialogRowContent } from '~/components/general/dialog';
import { FormWizardActions, InputFormElement } from '~/components/general/form-element';
import { loadSelectorStudents, loadSelectorStaff, LoadUsersTriggerType, loadUserGroups, createUsergroup, CreateUsergroupTriggerType } from '~/actions/main-function/users';
import { i18nType } from '~/reducers/base/i18n';
import { StateType } from '~/reducers';
import { bindActionCreators } from 'redux';
import AutofillSelector, { UiSelectItem } from '~/components/base/input-select-autofill';
import { SelectItem } from '~/actions/workspaces/index';
import { CreateUserGroupType, UpdateUserGroupStateType, UsersSelectType } from '~/reducers/main-function/users';

interface ValidationType {
  nameValid: number
}

interface OrganizationNewUserGroupProps {
  children?: React.ReactElement<any>,
  i18n: i18nType,
  users: UsersSelectType,
  createOrganizationUsergroup: CreateUsergroupTriggerType,
  loadStudents: LoadUsersTriggerType,
  loadStaff: LoadUsersTriggerType,
  loadUserGroups: LoadUsersTriggerType
}

interface OrganizationNewUserGroupState {
  usergroupName: string,
  isGuidanceGroup: boolean;
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

class OrganizationNewUserGroup extends React.Component<OrganizationNewUserGroupProps, OrganizationNewUserGroupState> {

  private totalSteps: number;

  constructor(props: OrganizationNewUserGroupProps) {
    super(props);
    this.totalSteps = 4;
    this.state = {
      usergroupName: null,
      isGuidanceGroup: false,
      selectedStudents: [],
      selectedStaff: [],
      addStudents: [],
      addStaff: [],
      removeStudents: [],
      removeStaff: [],
      studentsLoaded: false,
      locked: true,
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
    this.setGuidanceGroup = this.setGuidanceGroup.bind(this);
    this.saveUsergroup = this.saveUsergroup.bind(this);
    this.clearComponentState = this.clearComponentState.bind(this);
  }
  doStudentSearch(q: string) {
    this.props.loadStudents({ payload: { q } });
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
    this.props.loadStaff({ payload: { q } });
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

  setGuidanceGroup(value: boolean) {
    this.setState({ isGuidanceGroup: value });
  }

  setUsergroupName(value: string) {
    this.setState({ locked: false, usergroupName: value });
  }

  clearComponentState() {
    this.setState({
      locked: true,
      usergroupName: null,
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

    let payload: CreateUserGroupType;
    let userIdentifiers: string[];

    payload = {
      name: this.state.usergroupName,
      isGuidanceGroup: this.state.isGuidanceGroup
    }

    if (this.state.addStudents.length !== 0) {
      userIdentifiers = this.state.addStudents.map(student => student.id as string)
    }

    if (this.state.addStaff.length !== 0) {
      if (!userIdentifiers) {
        userIdentifiers = this.state.addStaff.map(staff => staff.id as string)
      } else {
        userIdentifiers = userIdentifiers.concat(this.state.addStaff.map(staff => staff.id as string));
      }
    }

    this.props.createOrganizationUsergroup({
      payload: payload,
      addUsers: userIdentifiers,
      progress: (state: UpdateUserGroupStateType) => {
        if (state === "update-group") {
          this.setState({
            usergroupUpdated: true,
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
        return <DialogRow>
          <DialogRow modifiers="edit-workspace">
            <InputFormElement id="userGroupName" modifiers="user-group-name" mandatory={true} updateField={this.setUsergroupName} valid={this.state.validation.nameValid} name="usergroupName" label={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.name.label')} value={this.state.usergroupName}></InputFormElement>
          </DialogRow>
          <DialogRow modifiers="edit-workspace">
            <InputFormElement id="isGuidanceGroup" label={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.guidanceSelect.label')} name="is-guidance-group" type="checkbox" updateField={this.setGuidanceGroup}></InputFormElement>
          </DialogRow>
        </DialogRow>;
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
        let staffSearchItems = this.props.users.staff.map(staff => {
          return { id: staff.id, label: staff.firstName + " " + staff.lastName, icon: "user" }
        });
        return <DialogRow modifiers="edit-workspace">
          <AutofillSelector modifier="add-teachers"
            loader={this.doStaffSearch}
            placeholder={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.search.groupStaff.placeholder')}
            selectedItems={this.state.selectedStaff} searchItems={staffSearchItems} onDelete={this.deleteStaff} onSelect={this.selectStaff} />
        </DialogRow>;
      case 4:
        return <DialogRow modifiers="edit-workspace-summary">
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" title={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.label.userGroupName')} />
            <DialogRowContent modifiers="new-workspace">
              <span>{this.state.usergroupName}</span>
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
        </DialogRow>;
      default: return <div>EMPTY</div>
    }
  }

  render() {
    let content = (closePortal: () => any) => this.wizardSteps(this.state.currentStep);
    let executeContent = <div><div className={`dialog__executer ${this.state.usergroupUpdated === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.execute.createUserGroup ')}</div>
      <div className={`dialog__executer ${this.state.studentsAdded === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.execute.addStudents')}</div>
      <div className={`dialog__executer ${this.state.studentsRemoved === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.execute.removeStudents')}</div>
      <div className={`dialog__executer ${this.state.staffAdded === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.execute.addStaff')}</div>
      <div className={`dialog__executer ${this.state.staffRemoved === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.userGroups.dialogs.summary.execute.removeStaff')}</div></div>;
    let footer = (closePortal: () => any) => <FormWizardActions locked={this.state.locked}
      currentStep={this.state.currentStep} totalSteps={this.totalSteps}
      executeLabel={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.create.execute.label')}
      nextLabel={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.next.label')}
      lastLabel={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.last.label')}
      cancelLabel={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.cancel.label')}
      executeClick={this.saveUsergroup.bind(this, closePortal)}
      nextClick={this.nextStep.bind(this)}
      lastClick={this.lastStep.bind(this)}
      cancelClick={this.cancelDialog.bind(this, closePortal)} />;

    return (<Dialog executing={this.state.executing} onClose={this.clearComponentState} executeContent={executeContent} footer={footer} modifier="new-user"
      title={this.props.i18n.text.get('plugin.organization.userGroups.dialogs.create.title')}
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
    loadUserGroups,
    createOrganizationUsergroup: createUsergroup,

  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationNewUserGroup);
