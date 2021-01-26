import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Dialog, { DialogRow, DialogRowHeader, DialogRowContent } from '~/components/general/dialog';
import { FormWizardActions, InputFormElement, SearchFormElement } from '~/components/general/form-element';
import { loadSelectorStaff, loadSelectorStudents, LoadUsersTriggerType, loadSelectorUserGroups } from '~/actions/main-function/users';
import { loadTemplatesFromServer, LoadTemplatesFromServerTriggerType, loadWorkspacesFromServer, LoadWorkspacesFromServerTriggerType, CreateWorkspaceTriggerType, createWorkspace, CreateWorkspaceStateType } from '~/actions/workspaces';
import { i18nType } from '~/reducers/base/i18n';
import { StateType } from '~/reducers';
import { bindActionCreators } from 'redux';
import ApplicationList, { ApplicationListItemContentWrapper, ApplicationListItem, ApplicationListItemHeader } from '~/components/general/application-list';
import AutofillSelector, { UiSelectItem } from '~/components/base/input-select-autofill';
import { SelectItem } from '~/actions/workspaces/index';
import { UsersSelectType } from '~/reducers/main-function/users';
import { CreateWorkspaceType, WorkspaceType, WorkspaceAccessType, WorkspacesActiveFiltersType } from '~/reducers/workspaces';
import '~/sass/elements/course.scss';

interface ValidationType {
  templateSelected: boolean,
  nameValid: number,
  nameExtensionValid: 2
}

interface OrganizationNewWorkspaceProps {
  children?: React.ReactElement<any>,
  i18n: i18nType,
  data?: CreateWorkspaceType,
  users: UsersSelectType,
  templates: WorkspaceType[],
  activeFilters: WorkspacesActiveFiltersType,
  loadStudents: LoadUsersTriggerType,
  loadStaff: LoadUsersTriggerType,
  loadUserGroups: LoadUsersTriggerType,
  loadTemplates: LoadTemplatesFromServerTriggerType
  createWorkspace: CreateWorkspaceTriggerType,
  loadWorkspaces: LoadWorkspacesFromServerTriggerType
}

interface OrganizationNewWorkspaceState {
  template: SelectItem,
  workspaceName: string,
  workspaceAccess: WorkspaceAccessType,
  workspaceNameExtension: string,
  locked: boolean,
  currentStep: number,
  selectedStaff: UiSelectItem[],
  selectedStudents: UiSelectItem[],
  executing: boolean,
  validation: ValidationType,
  workspaceCreated: boolean,
  studentsAdded: boolean,
  staffAdded: boolean,
}

class OrganizationNewWorkspace extends React.Component<OrganizationNewWorkspaceProps, OrganizationNewWorkspaceState> {

  private totalSteps: number;

  constructor(props: OrganizationNewWorkspaceProps) {
    super(props);
    this.totalSteps = 4;
    this.state = {
      workspaceName: "",
      workspaceAccess: "MEMBERS_ONLY",
      workspaceNameExtension: "",
      template: {
        id: null,
        label: ""
      },
      selectedStaff: [],
      selectedStudents: [],
      locked: false,
      currentStep: 1,
      executing: false,
      validation: {
        templateSelected: false,
        nameValid: 2,
        nameExtensionValid: 2
      },
      workspaceCreated: false,
      studentsAdded: false,
      staffAdded: false,
    };

    // TODO: amount of these methods can be halved

    this.doTemplateSearch = this.doTemplateSearch.bind(this);
    this.selectTemplate = this.selectTemplate.bind(this);
    this.doStaffSearch = this.doStaffSearch.bind(this);
    this.selectStaff = this.selectStaff.bind(this);
    this.deleteStaff = this.deleteStaff.bind(this);
    this.doStudentSearch = this.doStudentSearch.bind(this);
    this.selectStudent = this.selectStudent.bind(this);
    this.deleteStudent = this.deleteStudent.bind(this);
    this.setSelectedStudents = this.setSelectedStudents.bind(this);
    this.setWorkspaceName = this.setWorkspaceName.bind(this);
    this.setWorkspaceAccess = this.setWorkspaceAccess.bind(this);
    this.setWorkspaceNameExtension = this.setWorkspaceNameExtension.bind(this);
    this.saveWorkspace = this.saveWorkspace.bind(this);
    this.clearComponentState = this.clearComponentState.bind(this);
  }

  doTemplateSearch(value: string) {
    this.props.loadTemplates(value);
  }

  selectTemplate(e: React.ChangeEvent<HTMLInputElement>) {
    let validation: ValidationType = Object.assign(this.state.validation, { templateSelected: true });
    this.setState({ validation, locked: false, template: { id: parseInt(e.target.value), label: e.target.name }, workspaceName: e.target.name });
  }

  doStudentSearch(value: string) {
    this.props.loadStudents(value);
    this.props.loadUserGroups(value);
  }

  selectStudent(student: SelectItem) {
    let newState = this.state.selectedStudents.concat(student);
    this.setState({ selectedStudents: newState });
  }

  deleteStudent(student: SelectItem) {
    let newState = this.state.selectedStudents.filter(selectedItem => selectedItem.id !== student.id);
    this.setState({ selectedStudents: newState });
  }

  doStaffSearch(value: string) {
    this.props.loadStaff(value);
  }

  selectStaff(staff: SelectItem) {
    let newState = this.state.selectedStaff.concat(staff);
    this.setState({ selectedStaff: newState });
  }

  deleteStaff(staff: SelectItem) {
    let newState = this.state.selectedStaff.filter(selectedItem => selectedItem.id !== staff.id);
    this.setState({ selectedStaff: newState });
  }

  setSelectedStudents(selectedStudents: Array<SelectItem>) {
    this.setState({ selectedStudents });
  }

  setWorkspaceName(value: string) {
    this.setState({ locked: false, workspaceName: value });
  }

  setWorkspaceAccess(value: WorkspaceAccessType) {
    this.setState({ workspaceAccess: value });
  }

  setWorkspaceNameExtension(value: string) {
    this.setState({ workspaceNameExtension: value });
  }

  clearComponentState() {
    this.setState({
      template: null,
      validation: {
        templateSelected: false,
        nameValid: 2,
        nameExtensionValid: 2
      },
      locked: false,
      workspaceName: "",
      workspaceNameExtension: "",
      executing: false,
      currentStep: 1,
      selectedStaff: [],
      selectedStudents: [],
      workspaceCreated: false,
      studentsAdded: false,
      staffAdded: false,
    });
  }

  cancelDialog(closeDialog: () => any) {
    closeDialog();
  }

  nextStep() {
    if (this.state.validation.templateSelected === false) {
      this.setState({ locked: true });
    } else if (this.state.workspaceName === "") {
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

    this.props.createWorkspace({
      id: this.state.template.id as number,
      name: this.state.workspaceName,
      nameExtension: this.state.workspaceNameExtension,
      access: this.state.workspaceAccess,
      students: this.state.selectedStudents,
      staff: this.state.selectedStaff,
      progress: (state: CreateWorkspaceStateType) => {
        if (state === "workspace-create") {
          this.setState({
            workspaceCreated: true
          });
        } else if (state === "add-students") {
          this.setState({
            studentsAdded: true
          });
        } else if (state === "add-teachers") {
          this.setState({
            staffAdded: true
          })
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
          <DialogRow modifiers="new-workspace" >
            <SearchFormElement placeholder={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.search.templates.placeholder')} name="templateSearch" updateField={this.doTemplateSearch}></SearchFormElement>
          </DialogRow >
          <DialogRow modifiers="new-workspace">
            <ApplicationList modifiers="workspace-templates">
              {this.props.templates.length > 0 ?
                this.props.templates.map((template: WorkspaceType) => {
                  let aside = <input key={template.id} type="radio" checked={this.state.template && this.state.template.id === template.id ? true : false} onChange={this.selectTemplate} name={template.name} value={template.id} />;
                  return <ApplicationListItem className="course" key={template.id}>
                    <ApplicationListItemContentWrapper asideModifiers="course" aside={aside}>
                      <ApplicationListItemHeader modifiers="course">
                        <span className="application-list__header-primary">{template.name}</span>
                        <span className="application-list__header-secondary">{template.educationTypeName}</span>
                      </ApplicationListItemHeader>
                    </ApplicationListItemContentWrapper>
                  </ApplicationListItem>
                })
                : <div className="empty">{this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.templates.empty')}</div>}
            </ApplicationList>
          </DialogRow>
          <DialogRow modifiers="new-workspace">
            <InputFormElement modifiers="workspace-name" mandatory={true} updateField={this.setWorkspaceName} valid={this.state.validation.nameValid} name="workspaceName" label={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.name.label')} value={this.state.workspaceName}></InputFormElement>
            <InputFormElement updateField={this.setWorkspaceNameExtension} valid={this.state.validation.nameExtensionValid} name="workspaceNameExtension" label={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.nameExtension.label')} value={this.state.workspaceNameExtension}></InputFormElement>
          </DialogRow>
          <DialogRow modifiers="new-workspace">
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
        let students: UiSelectItem[] = this.props.users.students.map(student => {
          return { id: student.id, label: student.firstName + " " + student.lastName, icon: "user", type: "student" }
        });

        let groups: UiSelectItem[] = this.props.users.userGroups.map(group => {
          return { id: group.id, label: group.name, icon: "users", type: "student-group" }
        });

        let allItems = students.concat(groups);

        return <DialogRow modifiers="new-workspace">
          <AutofillSelector modifier="add-students"
            loader={this.doStudentSearch}
            placeholder={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.search.students.placeholder')}
            selectedItems={this.state.selectedStudents} searchItems={allItems} onDelete={this.deleteStudent} onSelect={this.selectStudent} />
        </DialogRow>;
      case 3:

        let staffSearchItems: UiSelectItem[] = this.props.users.staff.map(staff => {
          return { id: staff.id, label: staff.firstName + " " + staff.lastName, icon: "user", type: "staff" }
        });

        return <DialogRow modifiers="new-workspace">
          <AutofillSelector modifier="add-teachers"
            loader={this.doStaffSearch}
            placeholder={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.search.teachers.placeholder')}
            selectedItems={this.state.selectedStaff} searchItems={staffSearchItems} onDelete={this.deleteStaff} onSelect={this.selectStaff} />
        </DialogRow>;
      case 4:
        return <DialogRow modifiers="new-workspace-summary">
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" label={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.summary.label.template')} />
            <DialogRowContent modifiers="new-workspace">
              {this.state.template.label && this.state.template.label !== "" ?
                <div>{this.state.template.label}</div>
                : <div>{this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.summary.empty.template')}</div>}
            </DialogRowContent>
          </DialogRow>
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" label={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.summary.label.workspaceName')} />
            <DialogRowContent modifiers="new-workspace">
              {this.state.workspaceName !== "" ?
                <div>{this.state.workspaceName} {this.state.workspaceNameExtension ? "(" + this.state.workspaceNameExtension + ")" : null}</div>
                : <div>{this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.summary.empty.workspaceName')}</div>}
            </DialogRowContent>
          </DialogRow>
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" label={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.summary.label.students')} />
            <DialogRowContent modifiers="new-workspace">
              {this.state.selectedStudents.length > 0 ?
                this.state.selectedStudents.map((student) => {
                  return <span key={student.id} className="tag-input__selected-item">
                    {student.icon ?
                      <span className={`glyph glyph--selected-recipient icon-${student.icon}`} />
                      : null}
                    {student.label}
                  </span>
                }) : <div>{this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.summary.empty.students')}</div>}
            </DialogRowContent>
          </DialogRow>
          <DialogRow>
            <DialogRowHeader modifiers="new-workspace" label={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.summary.label.teachers')} />
            <DialogRowContent modifiers="new-workspace">
              {this.state.selectedStaff.length > 0 ?
                this.state.selectedStaff.map((staff) => {
                  return <span key={staff.id} className="tag-input__selected-item">
                    {
                      staff.icon ?
                        <span className={`glyph glyph--selected-recipient icon-${staff.icon}`} />
                        : null
                    }
                    {staff.label}</span>
                }) : <div>{this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.summary.empty.teachers')}</div>}
            </DialogRowContent>
          </DialogRow>
        </DialogRow>;
      default: return <div>EMPTY</div>
    }
  }

  render() {
    let content = (closePortal: () => any) => this.wizardSteps(this.state.currentStep);
    let executeContent = <div><div className={`dialog__executer ${this.state.workspaceCreated === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.summary.execute.createWorkspace')}</div>
      <div className={`dialog__executer ${this.state.studentsAdded === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.summary.execute.addStudents')}</div>
      <div className={`dialog__executer ${this.state.staffAdded === true ? "dialog__executer state-DONE" : ""}`}>{this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.summary.execute.addTeachers')}</div>
    </div>;
    let footer = (closePortal: () => any) => <FormWizardActions locked={this.state.locked}
      currentStep={this.state.currentStep} totalSteps={this.totalSteps}
      executeLabel={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.execute.label')}
      nextLabel={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.next.label')}
      lastLabel={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.last.label')}
      cancelLabel={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.cancel.label')}
      executeClick={this.saveWorkspace.bind(this, closePortal)}
      nextClick={this.nextStep.bind(this)}
      lastClick={this.lastStep.bind(this)}
      cancelClick={this.cancelDialog.bind(this, closePortal)} />;

    return (<Dialog executing={this.state.executing} executeOnOpen={this.props.loadTemplates} onClose={this.clearComponentState} executeContent={executeContent} footer={footer} modifier="new-workspace"
      title={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.title')}
      content={content} >
      {this.props.children}
    </Dialog>
    )
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    users: state.userSelect,
    templates: state.organizationWorkspaces.templateWorkspaces
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({
    loadStaff: loadSelectorStaff,
    loadStudents: loadSelectorStudents,
    loadUserGroups: loadSelectorUserGroups,
    loadTemplates: loadTemplatesFromServer,
    createWorkspace,
    loadWorkspaces: loadWorkspacesFromServer
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationNewWorkspace);
