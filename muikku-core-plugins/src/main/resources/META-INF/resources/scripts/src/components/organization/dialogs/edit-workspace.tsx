import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Dialog, { DialogRow, DialogRowHeader, DialogRowContent } from '~/components/general/dialog';
import { FormWizardActions, InputFormElement, SearchFormElement } from '~/components/general/form-element';
import { loadSelectorStaff, loadSelectorStudents, LoadUsersTriggerType, loadSelectorUserGroups } from '~/actions/main-function/users';
import { UpdateWorkspaceTriggerType, updateWorkspace, UpdateWorkspaceStateType, loadStudentsOfWorkspace, LoadStudentsOfWorkspaceTriggerType, loadStaffMembersOfWorkspace, LoadStaffMembersOfWorkspaceTriggerType } from '~/actions/workspaces';
import { i18nType } from '~/reducers/base/i18n';
import { StateType } from '~/reducers';
import { bindActionCreators } from 'redux';
import AutofillSelector, { SelectItem } from '~/components/base/input-select-autofill';
import { UsersSelectType, } from '~/reducers/main-function/users';

import { CreateWorkspaceType, WorkspaceType } from '~/reducers/workspaces';
import currentStudent from '~/components/guider/body/application/current-student';
import studiesEnded from '~/components/index/body/studies-ended';

interface ValidationType {
  nameValid: number
}

interface OrganizationEditWorkspaceProps {
  children?: React.ReactElement<any>,
  i18n: i18nType,
  users: UsersSelectType,
  workspace: WorkspaceType,
  currentWorkspace: WorkspaceType,
  updateWorkspace: UpdateWorkspaceTriggerType,
  loadStudentsOfWorkspace: LoadStudentsOfWorkspaceTriggerType,
  loadStaffMembersOfWorkspace: LoadStaffMembersOfWorkspaceTriggerType,
  loadStudents: LoadUsersTriggerType,
  loadStaff: LoadUsersTriggerType,
  loadUserGroups: LoadUsersTriggerType,
}

interface OrganizationEditWorkspaceState {
  workspaceName: string,
  locked: boolean,
  currentStep: number,
  addStaff: SelectItem[],
  addStudents: SelectItem[],
  removeStaff: SelectItem[],
  removeStudents: SelectItem[],
  selectedStaff: SelectItem[],
  selectedStudents: SelectItem[],
  staffLoaded: boolean,
  studentsLoaded: boolean,
  totalSteps: number,
  executing: boolean,
  validation: ValidationType,
  workspaceCreated: boolean,
  studentsAdded: boolean,
  staffAdded: boolean,
}

class OrganizationEditWorkspace extends React.Component<OrganizationEditWorkspaceProps, OrganizationEditWorkspaceState> {

  private workspaceChanged: boolean;

  constructor(props: OrganizationEditWorkspaceProps) {
    super(props);



    this.state = {
      workspaceName: this.props.workspace.name,
      selectedStaff: [],
      selectedStudents: [],
      addStaff: [],
      addStudents: [],
      removeStaff: [],
      removeStudents: [],
      staffLoaded: false,
      studentsLoaded: false,
      locked: false,
      totalSteps: 4,
      currentStep: 1,
      executing: false,
      validation: {
        nameValid: 2
      },
      workspaceCreated: false,
      studentsAdded: false,
      staffAdded: false,
    };

    // TODO: amount of these methods can be halved

    this.doStaffSearch = this.doStaffSearch.bind(this);
    this.selectStaff = this.selectStaff.bind(this);
    this.deleteStaff = this.deleteStaff.bind(this);
    this.doStudentSearch = this.doStudentSearch.bind(this);
    this.selectStudent = this.selectStudent.bind(this);
    this.deleteStudent = this.deleteStudent.bind(this);
    this.setSelectedStudents = this.setSelectedStudents.bind(this);
    this.setWorkspaceName = this.setWorkspaceName.bind(this);
    this.saveWorkspace = this.saveWorkspace.bind(this);
    this.clearComponentState = this.clearComponentState.bind(this);
    this.workspaceChanged = false;
  }
  doStudentSearch(value: string) {
    this.props.loadStudents(value);
    this.props.loadUserGroups(value);
  }

  selectStudent(student: SelectItem) {
    let newState = this.state.addStudents.concat(student);
    this.setState({ addStudents: newState });
  }

  deleteStudent(student: SelectItem) {
    let newState = this.state.addStudents.filter(selectedItem => selectedItem.id !== student.id);
    this.setState({ addStudents: newState });
  }

  doStaffSearch(value: string) {
    this.props.loadStaff(value);
  }

  selectStaff(staff: SelectItem) {
    let newState = this.state.addStaff.concat(staff);
    this.setState({ addStaff: newState });
  }

  deleteStaff(staff: SelectItem) {
    let newState = this.state.addStaff.filter(selectedItem => selectedItem.id !== staff.id);
    this.setState({ addStaff: newState });
  }

  setSelectedStudents(addStudents: Array<SelectItem>) {
    this.setState({ addStudents });
  }

  setWorkspaceName(value: string) {
    this.setState({ locked: false, workspaceName: value });
  }

  clearComponentState() {
    this.setState({
      locked: false,
      staffLoaded: false,
      studentsLoaded: false,
      executing: false,
      currentStep: 1,
      addStaff: [],
      addStudents: [],
      selectedStaff: [],
      selectedStudents: [],
      removeStaff: [],
      removeStudents: [],
      workspaceCreated: false,
      studentsAdded: false,
      staffAdded: false,
    });
  }

  cancelDialog(closeDialog: () => any) {
    closeDialog();
  }

  nextStep() {

    if (this.state.currentStep === 1) {
      this.workspaceChanged = this.props.currentWorkspace && this.props.currentWorkspace.id !== this.props.workspace.id;
      if (this.state.selectedStudents.length === 0 || this.workspaceChanged) {
        this.props.loadStudentsOfWorkspace(this.props.workspace, true);
        this.setState({ studentsLoaded: false });
      }
    }
    if (this.state.currentStep === 2) {
      if (this.state.selectedStaff.length === 0 || this.workspaceChanged) {
        this.props.loadStaffMembersOfWorkspace(this.props.workspace, true);
        this.setState({ staffLoaded: false });
      }
    }
    if (this.state.workspaceName === "") {
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

  saveWorkspace(closeDialog: () => any) {
    this.setState({
      locked: true,
      executing: true
    });

    this.props.updateWorkspace({
      update: {
        name: this.state.workspaceName,
      },
      workspace: this.props.workspace,
      removeStudents: this.state.removeStudents,
      removeTeachers: this.state.removeStaff,
      addStudents: this.state.addStudents,
      addTeachers: this.state.addStaff,
      success: (state: UpdateWorkspaceStateType) => {
        if (state === "WORKSPACE-UPDATE") {
          this.setState({
            workspaceCreated: true
          });
        } else if (state === "ADD-STUDENTS") {
          this.setState({
            studentsAdded: true
          });
        } else if (state === "ADD-TEACHERS") {
          this.setState({
            staffAdded: true
          })
        } else if (state === "DONE") {
          closeDialog();
        }
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
            <InputFormElement mandatory={true} updateField={this.setWorkspaceName} valid={this.state.validation.nameValid} name="workspaceName" label={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.name.label')} value={this.state.workspaceName}></InputFormElement>
          </DialogRow>
        </div >;
      case 2:

        let students = this.props.users.students.map(student => {
          return { id: student.id, label: student.firstName + " " + student.lastName, icon: "user", type: "student" }
        });

        let groups = this.props.users.userGroups.map(group => {
          return { id: group.id, label: group.name, icon: "users", type: "student-group" }
        });

        let allItems = students.concat(groups);

        return <DialogRow modifiers="new-workspace">
          <AutofillSelector modifier="add-students"
            loader={this.doStudentSearch}
            placeholder={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.search.students.placeholder')}
            selectedItems={this.state.selectedStudents} searchItems={allItems} onDelete={this.deleteStudent} onSelect={this.selectStudent} />
        </DialogRow>;
      case 3:
        let staffSearchItems = this.props.users.staff.map(staff => {
          return { id: staff.id, label: staff.firstName + " " + staff.lastName }
        });

        return <DialogRow modifiers="new-workspace">
          <AutofillSelector modifier="add-teachers"
            loader={this.doStaffSearch}
            placeholder={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.search.teachers.placeholder')}
            selectedItems={this.state.selectedStaff} searchItems={staffSearchItems} onDelete={this.deleteStaff} onSelect={this.selectStaff} />
        </DialogRow>;
      case 4:
        return <DialogRow modifiers="new-workspace">
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" label={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.label.workspaceName')} />
            <DialogRowContent modifiers="new-workspace">
              {this.state.workspaceName !== "" ?
                <div>{this.state.workspaceName}</div>
                : <div>{this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.empty.workspaceName')}</div>}
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
            <DialogRowHeader modifiers="new-workspace" label={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.label.teachers')} />
            <DialogRowContent modifiers="new-workspace">
              {this.state.addStaff.length > 0 ?
                this.state.addStaff.map((staff) => {
                  return <span key={staff.id} className="tag-input__selected-item">{staff.label}</span>
                }) : <div>{this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.empty.teachers')}</div>}
            </DialogRowContent>
          </DialogRow>
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" label={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.label.students')} />
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
            <DialogRowHeader modifiers="new-workspace" label={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.label.teachers')} />
            <DialogRowContent modifiers="new-workspace">
              {this.state.removeStaff.length > 0 ?
                this.state.removeStaff.map((staff) => {
                  return <span key={staff.id} className="tag-input__selected-item">{staff.label}</span>
                }) : <div>{this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.empty.teachers')}</div>}
            </DialogRowContent>
          </DialogRow>
        </DialogRow>;
      default: return <div>EMPTY</div>
    }
  }

  render() {

    if (this.props.currentWorkspace && this.props.currentWorkspace.students && this.state.studentsLoaded === false) {
      let students: SelectItem[] = this.props.currentWorkspace.students.map(student => {
        return {
          id: student.userEntityId,
          label: student.firstName + " " + student.lastName
        }
      });
      this.setState({ selectedStudents: students, studentsLoaded: true });
    }

    if (this.props.currentWorkspace && this.props.currentWorkspace.staffMembers && this.state.staffLoaded === false) {
      let staff: SelectItem[] = this.props.currentWorkspace.staffMembers.map(staff => {
        return {
          id: staff.userEntityId,
          label: staff.firstName + " " + staff.lastName
        }
      });
      this.setState({ selectedStaff: staff, staffLoaded: true });
    }

    let content = (closePortal: () => any) => this.wizardSteps(this.state.currentStep);
    let executeContent = <div><div className={`dialog__executer ${this.state.workspaceCreated === true ? "dialog__executer state-DONE" : ""}`}>Create workspace</div>
      <div className={`dialog__executer ${this.state.studentsAdded === true ? "dialog__executer state-DONE" : ""}`}>Add students</div>
      <div className={`dialog__executer ${this.state.staffAdded === true ? "dialog__executer state-DONE" : ""}`}>Add teachers</div>
      <div className={`dialog__executer`}>Done</div></div>;
    let footer = (closePortal: () => any) => <FormWizardActions locked={this.state.locked}
      currentStep={this.state.currentStep} totalSteps={this.state.totalSteps}
      executeLabel={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.execute.label')}
      nextLabel={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.next.label')}
      lastLabel={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.last.label')}
      cancelLabel={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.cancel.label')}
      executeClick={this.saveWorkspace.bind(this, closePortal)}
      nextClick={this.nextStep.bind(this)}
      lastClick={this.lastStep.bind(this)}
      cancelClick={this.cancelDialog.bind(this, closePortal)} />;

    return (<Dialog executing={this.state.executing} onClose={this.clearComponentState} executeContent={executeContent} footer={footer} modifier="new-user"
      title={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.title')}
      content={content}>
      {this.props.children}
    </Dialog  >
    )
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    users: state.userSelect,
    currentWorkspace: state.organizationWorkspaces.currentWorkspace
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({
    loadStaff: loadSelectorStaff,
    loadStudents: loadSelectorStudents,
    loadUserGroups: loadSelectorUserGroups,
    loadStudentsOfWorkspace,
    loadStaffMembersOfWorkspace,
    updateWorkspace
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationEditWorkspace);
