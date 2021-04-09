import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Dialog, { DialogRow, DialogRowHeader, DialogRowContent } from '~/components/general/dialog';
import { FormWizardActions, InputFormElement, DateFormElement } from '~/components/general/form-element';
import { loadSelectorStaff, loadSelectorStudents, LoadUsersTriggerType, loadSelectorUserGroups } from '~/actions/main-function/users';
import {
  UpdateWorkspaceTriggerType, updateOrganizationWorkspace, UpdateWorkspaceStateType, SetCurrentWorkspaceTriggerType, setCurrentOrganizationWorkspace,
  loadCurrentOrganizationWorkspaceSelectStaff, LoadWorkspacesFromServerTriggerType, loadCurrentOrganizationWorkspaceSelectStudents, LoadStudentsOfWorkspaceTriggerType, loadStaffMembersOfWorkspace, LoadStaffMembersOfWorkspaceTriggerType, loadWorkspacesFromServer
} from '~/actions/workspaces';
import { i18nType } from '~/reducers/base/i18n';
import { StateType } from '~/reducers';
import { bindActionCreators } from 'redux';
import AutofillSelector, { UiSelectItem } from '~/components/base/input-select-autofill';
import { SelectItem } from '~/actions/workspaces/index';
import { UsersSelectType } from '~/reducers/main-function/users';
import { WorkspaceUpdateType, WorkspaceType, WorkspaceAccessType, WorkspacesActiveFiltersType, WorkspaceDetailsType } from '~/reducers/workspaces';
import moment from '~/lib/moment';
import { TagItem, Tag } from '~/components/general/tag-input';

interface ValidationType {
  nameValid: number
}

interface OrganizationEditWorkspaceProps {
  children?: React.ReactElement<any>,
  i18n: i18nType,
  users: UsersSelectType,
  workspace: WorkspaceType,
  currentWorkspace: WorkspaceType,
  activeFilters: WorkspacesActiveFiltersType,
  updateOrganizationWorkspace: UpdateWorkspaceTriggerType,
  setCurrentOrganizationWorkspace: SetCurrentWorkspaceTriggerType,
  loadCurrentOrganizationWorkspaceSelectStudents: LoadStudentsOfWorkspaceTriggerType,
  loadCurrentOrganizationWorkspaceSelectStaff: LoadStaffMembersOfWorkspaceTriggerType,
  loadStudents: LoadUsersTriggerType,
  loadStaff: LoadUsersTriggerType,
  loadUserGroups: LoadUsersTriggerType,
  loadWorkspaces: LoadWorkspacesFromServerTriggerType
}

interface OrganizationEditWorkspaceState {
  beginDate: any,
  endDate: any,
  workspaceName: string,
  workspaceNameExtension: string,
  workspaceAccess: WorkspaceAccessType,
  locked: boolean,
  currentStep: number,
  addStaff: UiSelectItem[],
  addStudents: UiSelectItem[],
  removeStaff: UiSelectItem[],
  removeStudents: UiSelectItem[],
  selectedStaff: SelectItem[],
  selectedStudents: SelectItem[],
  staffLoaded: boolean,
  studentsLoaded: boolean,
  executing: boolean,
  validation: ValidationType,
  workspaceUpdated: boolean,
  detailsAdded: boolean,
  studentsAdded: boolean,
  staffAdded: boolean,
  studentsRemoved: boolean,
  staffRemoved: boolean,
}

class OrganizationEditWorkspace extends React.Component<OrganizationEditWorkspaceProps, OrganizationEditWorkspaceState> {

  private totalSteps: number;
  constructor(props: OrganizationEditWorkspaceProps) {
    super(props);
    this.totalSteps = 6;
    this.state = {
      beginDate: null,
      endDate: null,
      workspaceName: this.props.workspace.name,
      workspaceNameExtension: this.props.workspace.nameExtension,
      workspaceAccess: this.props.currentWorkspace && this.props.currentWorkspace.access || null,
      selectedStaff: [],
      selectedStudents: [],
      addStaff: [],
      addStudents: [],
      removeStaff: [],
      removeStudents: [],
      staffLoaded: false,
      studentsLoaded: false,
      locked: false,
      currentStep: 1,
      executing: false,
      validation: {
        nameValid: 2
      },
      detailsAdded: false,
      workspaceUpdated: false,
      studentsAdded: false,
      staffAdded: false,
      studentsRemoved: false,
      staffRemoved: false,
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
    this.setWorkspaceNameExtension = this.setWorkspaceNameExtension.bind(this);
    this.saveWorkspace = this.saveWorkspace.bind(this);
    this.clearComponentState = this.clearComponentState.bind(this);
    this.setSelectedWorkspace = this.setSelectedWorkspace.bind(this);
    this.getLocaledDate = this.getLocaledDate.bind(this);

  }
  doStudentSearch(value: string) {
    this.props.loadStudents(value);
    this.props.loadUserGroups(value);
  }

  doStaffSearch(value: string) {
    this.props.loadStaff(value);
  }

  selectStudent(student: SelectItem) {
    let studentIsDeleted = this.state.removeStudents.some(rStudent => rStudent.id === student.id);
    let newSelectedState = this.state.selectedStudents.concat(student);
    let newAddState = studentIsDeleted ? this.state.addStudents : this.state.addStudents.concat(student);
    let newRemoveState = studentIsDeleted ? this.state.removeStudents.filter(rStudent => rStudent.id !== student.id) : this.state.removeStudents;
    this.setState({ selectedStudents: newSelectedState, addStudents: newAddState, removeStudents: newRemoveState });
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

  deleteStudent(student: SelectItem) {
    let studentIsAdded = this.state.addStudents.some(aStudent => aStudent.id === student.id);
    let newSelectedState = this.state.selectedStudents.filter(selectedItem => selectedItem.id !== student.id);
    let newRemoveState = studentIsAdded ? this.state.removeStudents : this.state.removeStudents.concat(student);
    let newAddState = studentIsAdded ? this.state.addStudents.filter(aStudent => aStudent.id !== student.id) : this.state.addStudents;
    this.setState({ selectedStudents: newSelectedState, removeStudents: newRemoveState, addStudents: newAddState });
  }

  // summaryRemoveUser(user: Tag) {
  //   const studentIsAdded = this.state.addStudents.some(aStudent => aStudent.id === user.value);
  //   const studentIsRemoved = this.state.removeStudents.some(aStudent => aStudent.id === user.id)
  //   const staffIsAdded = this.state.addStudents.some(aStudent => aStudent.id === user.value);
  //   const staffIsRemoved = this.state.removeStudents.some(aStudent => aStudent.id === user.id)

  //   let newSelectedState = this.state.selectedStudents.filter(selectedItem => selectedItem.id !== student.id);
  //   let newRemoveState = studentIsAdded ? this.state.removeStudents : this.state.removeStudents.concat(student);
  //   let newAddState = studentIsAdded ? this.state.addStudents.filter(aStudent => aStudent.id !== student.id) : this.state.addStudents;
  //   this.setState({ selectedStudents: newSelectedState, removeStudents: newRemoveState, addStudents: newAddState });
  // }



  setSelectedWorkspace() {
    this.props.setCurrentOrganizationWorkspace({
      workspaceId: this.props.workspace.id,
      loadDetails: true,
      success: (workspace: WorkspaceType) => {
        this.setState({
          workspaceAccess: workspace.access,
          beginDate: workspace.details.beginDate ? moment(workspace.details.beginDate) : "",
          endDate: workspace.details.endDate ? moment(workspace.details.endDate) : "",
        });
      }
    });
  }

  setSelectedStudents(addStudents: Array<SelectItem>) {
    this.setState({ addStudents });
  }

  setWorkspaceName(value: string) {
    this.setState({ locked: false, workspaceName: value });
  }

  handleDateChange(dateKey: string, newDate: any) {
    this.setState({ [dateKey]: newDate } as Pick<OrganizationEditWorkspaceState, keyof OrganizationEditWorkspaceState>)
  }

  setWorkspaceNameExtension(value: string) {
    this.setState({ workspaceNameExtension: value });
  }

  setWorkspaceAccess(value: WorkspaceAccessType) {
    this.setState({ workspaceAccess: value });
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
      workspaceUpdated: false,
      detailsAdded: false,
      studentsAdded: false,
      staffAdded: false,
    });
  }

  getLocaledDate(date: any) {
    return date.locale(this.props.i18n.time.getLocale()).format('L')
  }

  cancelDialog(closeDialog: () => any) {
    closeDialog();
  }

  nextStep() {
    if (this.state.currentStep === 1) {
      if (this.state.selectedStudents.length === 0) {
        this.props.loadCurrentOrganizationWorkspaceSelectStudents(this.props.workspace);
      }
    }
    if (this.state.currentStep === 3) {
      if (this.state.selectedStaff.length === 0) {
        this.props.loadCurrentOrganizationWorkspaceSelectStaff(this.props.workspace);
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
    })

    // This has to be done like this, because the ISO-dates from rest are different from the moment ISO-dates

    let originalBeginDate = this.props.currentWorkspace.details.beginDate ? moment(this.props.currentWorkspace.details.beginDate).toISOString() : null;
    let originalEndDate = this.props.currentWorkspace.details.endDate ? moment(this.props.currentWorkspace.details.endDate).toISOString() : null;
    let beginDate = this.state.beginDate ? this.state.beginDate.toISOString() : null;
    let endDate = this.state.endDate ? this.state.endDate.toISOString() : null;
    let detailsChanged = false;
    let payload: WorkspaceUpdateType = {};

    if (this.props.currentWorkspace.name !== this.state.workspaceName) {
      payload.name = this.state.workspaceName;
    }

    if (this.props.currentWorkspace.nameExtension !== this.state.workspaceNameExtension) {
      payload.nameExtension = this.state.workspaceNameExtension;
    }

    if (this.props.currentWorkspace.access !== this.state.workspaceAccess) {
      payload.access = this.state.workspaceAccess;
    }

    let detailsUpdate: WorkspaceDetailsType = {
      beginDate: this.props.currentWorkspace.details.beginDate,
      endDate: this.props.currentWorkspace.details.endDate,
      externalViewUrl: this.props.currentWorkspace.details.externalViewUrl,
      typeId: this.props.currentWorkspace.details.typeId,
      rootFolderId: this.props.currentWorkspace.details.rootFolderId,
      helpFolderId: this.props.currentWorkspace.details.helpFolderId,
      indexFolderId: this.props.currentWorkspace.details.indexFolderId,
    }

    payload.details = detailsUpdate;

    if (originalBeginDate !== beginDate) {
      detailsUpdate.beginDate = beginDate;
      detailsChanged = true;
    }

    if (originalEndDate !== endDate) {
      detailsUpdate.endDate = endDate;
      detailsChanged = true;
    }

    if (detailsChanged) {
      Object.assign(payload.details, detailsUpdate);
    } else {
      delete payload["details"];
    }

    this.props.updateOrganizationWorkspace({
      update: payload,
      workspace: this.props.currentWorkspace,
      activeFilters: this.props.activeFilters,
      removeStudents: this.state.removeStudents,
      removeTeachers: this.state.removeStaff,
      addStudents: this.state.addStudents,
      addTeachers: this.state.addStaff,
      progress: (state: UpdateWorkspaceStateType) => {
        if (state === "workspace-update") {
          this.setState({
            workspaceUpdated: true
          });
        } else if (state === "add-details") {
          this.setState({
            detailsAdded: true
          });
        } else if (state === "add-students") {
          this.setState({
            studentsAdded: true
          });
        } else if (state === "add-teachers") {
          this.setState({
            staffAdded: true
          });
        } else if (state === "done") {
          setTimeout(() => this.props.loadWorkspaces(this.props.activeFilters, true, true), 2000);
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
        return <form>
          <DialogRow>
            <DialogRowHeader title={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.step1.title', page + "/" + this.totalSteps)} description={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.step1.description')} />
          </DialogRow>
          <DialogRow modifiers="edit-workspace">
            <InputFormElement id="workspaceName" modifiers="workspace-name" mandatory={true} updateField={this.setWorkspaceName} valid={this.state.validation.nameValid} name="workspace-name" label={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.name.label')} value={this.state.workspaceName}></InputFormElement>
            <InputFormElement id="workspaceNameExtension" modifiers="dialog-workspace-name-extension" updateField={this.setWorkspaceNameExtension} name="workspace-name-extension" label={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.nameExtension.label')} value={this.state.workspaceNameExtension}></InputFormElement>
          </DialogRow>
          <DialogRow modifiers="edit-workspace">
            <DateFormElement id="workspaceBeginDate" maxDate={this.state.endDate} updateField={this.handleDateChange.bind(this, "beginDate")} locale={this.props.i18n.time.getLocale()} selected={this.state.beginDate} labels={{ label: this.props.i18n.text.get("plugin.organization.workspaces.editWorkspace.beginDate.label") }} />
            <DateFormElement id="workspaceEndDate" minDate={this.state.beginDate} updateField={this.handleDateChange.bind(this, "endDate")} locale={this.props.i18n.time.getLocale()} selected={this.state.endDate} labels={{ label: this.props.i18n.text.get("plugin.organization.workspaces.editWorkspace.endDate.label") }} />
          </DialogRow>
          <DialogRow>
            <fieldset>
              <legend className="application-sub-panel__item-header">{this.props.i18n.text.get("plugin.workspace.management.settings.access")}</legend>
              <div className="application-sub-panel__item-data application-sub-panel__item-data--workspace-management">
                <div className="form-element form-element--checkbox-radiobutton">
                  <input id="access-members" name="access-members" type="radio"
                    checked={this.state.workspaceAccess === "MEMBERS_ONLY"}
                    onChange={this.setWorkspaceAccess.bind(this, "MEMBERS_ONLY")} />
                  <label htmlFor="access-members">{this.props.i18n.text.get("plugin.workspace.management.settings.access.membersOnly")}</label>
                </div>
                <div className="form-element form-element--checkbox-radiobutton">
                  <input id="access-loggedin" name="access-loggedin" type="radio"
                    checked={this.state.workspaceAccess === "LOGGED_IN"}
                    onChange={this.setWorkspaceAccess.bind(this, "LOGGED_IN")} />
                  <label htmlFor="access-loggedin">{this.props.i18n.text.get("plugin.workspace.management.settings.access.loggedIn")}</label>
                </div>
                <div className="form-element form-element--checkbox-radiobutton">
                  <input id="access-anyone" name="access-anyone" type="radio"
                    checked={this.state.workspaceAccess === "ANYONE"}
                    onChange={this.setWorkspaceAccess.bind(this, "ANYONE")} />
                  <label htmlFor="access-anyone">{this.props.i18n.text.get("plugin.workspace.management.settings.access.anyone")}</label>
                </div>
              </div>
            </fieldset>
          </DialogRow>
        </form >;
      case 2:
        let students = this.props.users.students.map(student => {
          return { id: student.id, label: student.firstName + " " + student.lastName, icon: "user", type: "student" }
        });

        let groups = this.props.users.userGroups.map(group => {
          return { id: group.id, label: group.name, icon: "users", type: "student-group" }
        });

        let allItems = students.concat(groups);

        if (this.props.currentWorkspace && this.props.currentWorkspace.studentsSelect && this.props.currentWorkspace.studentsSelect.state === "READY" && this.state.studentsLoaded === false) {
          this.setState({ selectedStudents: this.props.currentWorkspace.studentsSelect.users, studentsLoaded: true });
        }

        return <form>
          <DialogRow>
            <DialogRowHeader title={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.step2.title', page + "/" + this.totalSteps)} description={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.step2.description')} />
          </DialogRow>
          <DialogRow>
            <AutofillSelector identifier="addWorkspaceStudents" modifier="add-students"
              loader={this.doStudentSearch}
              placeholder={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.search.students.placeholder')}
              selectedItems={this.state.selectedStudents} searchItems={allItems} onDelete={this.deleteStudent} onSelect={this.selectStudent} />
          </DialogRow>
        </form>;
      case 3:
        return <form>
          <DialogRow>
            <DialogRowHeader title={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.step3.title', page + "/" + this.totalSteps)} description={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.step3.description')} />
          </DialogRow>
        </form>;

      case 4:
        let staffSearchItems = this.props.users.staff.map(staff => {
          return { id: staff.id, label: staff.firstName + " " + staff.lastName, icon: "user" }
        });

        if (this.props.currentWorkspace && this.props.currentWorkspace.staffMemberSelect && this.props.currentWorkspace.staffMemberSelect.state === "READY" && this.state.staffLoaded === false) {
          this.setState({ selectedStaff: this.props.currentWorkspace.staffMemberSelect.users, staffLoaded: true });
        }

        return <form>
          <DialogRow>
            <DialogRowHeader title={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.step4.title', page + "/" + this.totalSteps)} description={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.step4.description')} />
          </DialogRow>
          <DialogRow>
            <AutofillSelector identifier="addWorkspaceTeachers" modifier="add-teachers"
              loader={this.doStaffSearch}
              placeholder={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.search.teachers.placeholder')}
              selectedItems={this.state.selectedStaff} searchItems={staffSearchItems} onDelete={this.deleteStaff} onSelect={this.selectStaff} />
          </DialogRow>
        </form>
      case 5:
        return <form>
          <DialogRow>
            <DialogRowHeader title={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.step5.title', page + "/" + this.totalSteps)} description={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.step5.description')} />
          </DialogRow>
        </form>
      case 6:
        return <DialogRow modifiers="edit-workspace-summary">
          <DialogRow>
            <DialogRowHeader title={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.step6.title', page + "/" + this.totalSteps)} description={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.step6.description')} />
          </DialogRow>
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" title={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.label.workspaceName')} />
            <DialogRowContent modifiers="new-workspace">
              <div>{this.state.workspaceName} {this.state.workspaceNameExtension ? "(" + this.state.workspaceNameExtension + ")" : null}</div>
            </DialogRowContent>
          </DialogRow>
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" title={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.label.dates')} />
            <DialogRowContent modifiers="summary-dates">
              <span>{this.state.beginDate ? this.getLocaledDate(this.state.beginDate) : this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.endDate.empty')}</span>
              <span>{this.state.endDate ? this.getLocaledDate(this.state.endDate) : this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.endDate.empty')}</span>
            </DialogRowContent>
          </DialogRow>
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" title={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.label.addStudents')} />
            <DialogRowContent>
              {this.state.addStudents.length > 0 ?
                this.state.addStudents.map((student) => {
                  const tag = {
                    node: student.label,
                    value: student,
                    icon: student.icon,
                  }
                  return <TagItem modifier="selected-recipient" key={"addStudent" + student.id} tag={tag} onDelete={this.deleteStudent}></TagItem>
                }) : <div>{this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.empty.students')}</div>}
            </DialogRowContent>
          </DialogRow>
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" title={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.label.addTeachers')} />
            <DialogRowContent>
              {this.state.addStaff.length > 0 ?
                this.state.addStaff.map((staff) => {
                  const tag = {
                    node: staff.label,
                    value: staff,
                    icon: staff.icon,
                  }
                  return <TagItem modifier="selected-recipient" key={"addStudent" + staff.id} tag={tag} onDelete={this.deleteStaff}></TagItem>
                }) : <div>{this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.empty.teachers')}</div>}
            </DialogRowContent>
          </DialogRow>
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" title={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.label.removeStudents')} />
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
            <DialogRowHeader modifiers="new-workspace" title={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.label.removeTeachers')} />
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
    let executeContent = <div><div className={`dialog__executer ${this.state.workspaceUpdated === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.execute.updateWorkspace')}</div>
      <div className={`dialog__executer ${this.state.detailsAdded === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.execute.detailsAdded')}</div>
      <div className={`dialog__executer ${this.state.studentsAdded === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.execute.addStudents')}</div>
      <div className={`dialog__executer ${this.state.staffAdded === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.execute.addTeachers')}</div>
      <div className={`dialog__executer ${this.state.studentsRemoved === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.execute.removeStudents')}</div>
      <div className={`dialog__executer ${this.state.staffRemoved === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.summary.execute.removeTeachers')}</div></div>;

    let footer = (closePortal: () => any) => <FormWizardActions locked={this.state.locked}
      currentStep={this.state.currentStep} totalSteps={this.totalSteps}
      executeLabel={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.execute.label')}
      nextLabel={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.next.label')}
      lastLabel={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.last.label')}
      cancelLabel={this.props.i18n.text.get('plugin.organization.workspaces.editWorkspace.cancel.label')}
      executeClick={this.saveWorkspace.bind(this, closePortal)}
      nextClick={this.nextStep.bind(this)}
      lastClick={this.lastStep.bind(this)}
      cancelClick={this.cancelDialog.bind(this, closePortal)} />;

    return (<Dialog executing={this.state.executing} executeOnOpen={this.setSelectedWorkspace} onClose={this.clearComponentState} executeContent={executeContent} footer={footer} modifier="new-user"
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
    currentWorkspace: state.organizationWorkspaces.currentWorkspace
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({
    loadStaff: loadSelectorStaff,
    loadStudents: loadSelectorStudents,
    loadUserGroups: loadSelectorUserGroups,
    setCurrentOrganizationWorkspace,
    loadCurrentOrganizationWorkspaceSelectStudents,
    loadCurrentOrganizationWorkspaceSelectStaff,
    updateOrganizationWorkspace,
    loadWorkspaces: loadWorkspacesFromServer
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationEditWorkspace);
