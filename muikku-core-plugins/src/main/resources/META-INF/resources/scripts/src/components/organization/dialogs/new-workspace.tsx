import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Dialog, { DialogRow } from '~/components/general/dialog';
import { FormWizardActions, SearchFormElement, EmailFormElement, InputFormElement, SSNFormElement, SelectFormElement } from '~/components/general/form-element';
import { AnyActionType } from '~/actions';
import { loadStaff, loadStudents, LoadUsersTriggerType } from '~/actions/main-function/users';
import notificationActions from '~/actions/base/notifications';
import { i18nType } from '~/reducers/base/i18n';
import { StateType } from '~/reducers';
import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';
import { bindActionCreators } from 'redux';
import { StatusType } from '~/reducers/base/status';
import ApplicationList, { ApplicationListItem, ApplicationListItemHeader } from '~/components/general/application-list';
import AutofillSelector, { SelectItem } from '~/components/base/input-select-autofill';
// import InputContactsAutofillLoaders from '~/components/base/input-contacts-autofill';
import { StudyprogrammeTypes } from '~/reducers/main-function/users';
import { UsersType } from '~/reducers/main-function/users';
import { CreateWorkspaceType, WorkspaceType, WorkspaceListType } from '~/reducers/workspaces';

import { UserType, UserStaffType } from '~/reducers/user-index';
import studiesEnded from '~/components/index/body/studies-ended';

interface TemplateType {
  id: number,
  name: string,
  line: string,
  type: string
}

interface OrganizationNewWorkspaceProps {
  children?: React.ReactElement<any>,
  i18n: i18nType,
  data?: CreateWorkspaceType,
  users: UsersType,
  workspace?: WorkspaceListType,
  studyprogrammes: StudyprogrammeTypes,
  loadStudents: LoadUsersTriggerType,
  loadStaff: LoadUsersTriggerType


  // createWorkspace: CreateWorkspaceTriggerType,
}

interface OrganizationNewWorkspaceState {
  workspace: {
    [field: string]: string,
  },
  locked: boolean,
  currentStep: number,
  selectedStaff: Array<SelectItem>,
  selectedStudents: Array<SelectItem>,
  totalSteps: number,
  executing: boolean
}

class OrganizationNewWorkspace extends React.Component<OrganizationNewWorkspaceProps, OrganizationNewWorkspaceState> {

  constructor(props: OrganizationNewWorkspaceProps) {
    super(props);
    this.state = {
      workspace: {},
      selectedStaff: [],
      selectedStudents: [],
      locked: false,
      totalSteps: 4,
      currentStep: 1,
      executing: false,
    };

    this.doTemplateSearch = this.doTemplateSearch.bind(this);
    this.doStaffSearch = this.doStaffSearch.bind(this);
    this.selectStaff = this.selectStaff.bind(this);
    this.deleteStaff = this.deleteStaff.bind(this);
    this.doStudentSearch = this.doStudentSearch.bind(this);
    this.selectStudent = this.selectStudent.bind(this);
    this.deleteStudent = this.deleteStudent.bind(this);
    this.updateField = this.updateField.bind(this);
    this.setSelectedStudents = this.setSelectedStudents.bind(this);
    this.saveWorkspace = this.saveWorkspace.bind(this);
  }

  doTemplateSearch(value: string) {
    console.log(value);
  }

  doStudentSearch(value: string) {
    this.props.loadStudents(value);
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

  updateField(name: string, value: string, valid: boolean) {
    let fieldName = name;
    let fieldValue = valid ? value : "";
    let newState = Object.assign(this.state.workspace, { [fieldName]: fieldValue });
    this.setState({ workspace: newState });
  }

  setSelectedStudents(selectedStudents: Array<SelectItem>) {
    this.setState({ selectedStudents });
  }

  clearComponentState() {
    this.setState({
      workspace: {},
      locked: false,
      executing: false,
      currentStep: 1
    });
  }

  cancelDialog(closeDialog: () => any) {
    this.clearComponentState();
    closeDialog();
  }

  nextStep() {
    let nextStep = this.state.currentStep + 1;
    this.setState({ currentStep: nextStep });
  }

  lastStep() {
    let lastStep = this.state.currentStep - 1;
    this.setState({ currentStep: lastStep });
  }

  saveWorkspace(closeDialog: () => any) {
    let valid = true;

    this.setState({
      locked: true,
      executing: true
    });

    // this.props.createWorkspace({
    //   workspace: null,
    //   success: () => {
    //     closeDialog();
    //     this.clearComponentState();
    //   },
    //   fail: () => {
    //     closeDialog();
    //     this.clearComponentState();
    //   }
    // });
  }


  wizardSteps(page: number) {
    const templates = [
      {
        name: "Kurssipohja 1",
        id: 1,
        line: "Lukio",
        type: "template"
      },
      {
        name: "Kurssipohja 2",
        id: 2,
        line: "Peruskoulu",
        type: "template"
      },
      {
        name: "Kurssipohja 3",
        id: 3,
        line: "Lakio",
        type: "template"
      }
    ];

    switch (page) {
      case 1:
        return <div>
          <DialogRow modifiers="new-workspace">
            <SearchFormElement placeholder={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.search.template.placeholder')} name="templateSearch" updateField={this.doTemplateSearch}></SearchFormElement>
          </DialogRow>
          <DialogRow modifiers="new-workspace">
            <ApplicationList>
              <form>
                {templates.map((template: TemplateType) => {
                  return <ApplicationListItem>
                    <ApplicationListItemHeader>
                      <input key={template.id} type="radio" name={template.type} value={template.id} />
                      <span className="application-list__header-primary">{template.name}</span>
                      <span className="application-list__header-secondary">{template.line}</span>
                    </ApplicationListItemHeader>
                  </ApplicationListItem>
                })}
              </form>
            </ApplicationList>
          </DialogRow>
        </div>
          ;
      case 2:
        let studentSearchItems = this.props.users.students.map(student => {
          return { id: student.id, label: student.firstName + " " + student.lastName }
        });

        return <div><DialogRow modifiers="new-workspace">
          <AutofillSelector modifier="add-students"
            loader={this.doStudentSearch}
            placeholder={this.props.i18n.text.get('plugin.communicator.createmessage.title.recipients')}
            selectedItems={this.state.selectedStudents} searchItems={studentSearchItems} onDelete={this.deleteStudent} onSelect={this.selectStudent}
            showFullNames={true} />
        </DialogRow>
        </div >;
      case 3:
        let teacherSearchItems = this.props.users.staff.map(staff => {
          return { id: staff.id, label: staff.firstName + " " + staff.lastName }
        });

        return <DialogRow modifiers="new-workspace">
          <AutofillSelector modifier="add-teachers"
            loader={this.doStaffSearch}
            placeholder={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.search.teachers.placeholder')}
            selectedItems={this.state.selectedStaff} searchItems={teacherSearchItems} onDelete={this.deleteStaff} onSelect={this.selectStaff}
            showFullNames={true} />
        </DialogRow>;
      case 4:
        return <DialogRow modifiers="new-workspace">
          Koonti
        </DialogRow>;
      default: return <div>EMPTY</div>
    }
  }

  render() {
    let content = (closePortal: () => any) => this.wizardSteps(this.state.currentStep);
    let footer = (closePortal: () => any) => <FormWizardActions locked={this.state.locked}
      currentStep={this.state.currentStep} totalSteps={this.state.totalSteps}
      executeLabel={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.execute.label')}
      nextLabel={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.next.label')}
      lastLabel={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.last.label')}
      cancelLabel={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.cancel.label')}
      executeClick={this.saveWorkspace.bind(this, closePortal)}
      nextClick={this.nextStep.bind(this)}
      lastClick={this.lastStep.bind(this)}
      cancelClick={this.cancelDialog.bind(this, closePortal)} />;

    return (<Dialog executing={this.state.executing} footer={footer} modifier="new-user"
      title={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.title')}
      content={content} >
      {this.props.children}
    </Dialog  >
    )
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    users: state.organizationUsers,
    studyprogrammes: state.studyprogrammes
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ loadStaff, loadStudents }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationNewWorkspace);
