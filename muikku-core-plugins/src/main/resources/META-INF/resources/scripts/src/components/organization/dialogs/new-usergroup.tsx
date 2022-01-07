import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Dialog, {
  DialogRow,
  DialogRowHeader,
  DialogRowContent,
} from "~/components/general/dialog";
import {
  FormWizardActions,
  InputFormElement,
} from "~/components/general/form-element";
import {
  loadSelectorStudents,
  loadSelectorStaff,
  LoadUsersTriggerType,
  loadUserGroups,
  createUsergroup,
  CreateUsergroupTriggerType,
} from "~/actions/main-function/users";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import { bindActionCreators } from "redux";
import AutofillSelector, {
  UiSelectItem,
} from "~/components/base/input-select-autofill";
import { SelectItem } from "~/actions/workspaces/index";
import {
  CreateUserGroupType,
  UpdateUserGroupStateType,
  UsersSelectType,
} from "~/reducers/main-function/users";
import { TagItem } from "~/components/general/tag-input";

interface ValidationType {
  nameValid: number;
}

interface OrganizationNewUserGroupProps {
  children?: React.ReactElement<any>;
  i18n: i18nType;
  users: UsersSelectType;
  createOrganizationUsergroup: CreateUsergroupTriggerType;
  loadStudents: LoadUsersTriggerType;
  loadStaff: LoadUsersTriggerType;
  loadUserGroups: LoadUsersTriggerType;
}

interface OrganizationNewUserGroupState {
  usergroupName: string;
  isGuidanceGroup: boolean;
  locked: boolean;
  currentStep: number;
  addStudents: UiSelectItem[];
  addStaff: UiSelectItem[];
  removeStudents: UiSelectItem[];
  removeStaff: UiSelectItem[];
  studentsLoaded: boolean;
  executing: boolean;
  validation: ValidationType;
  usergroupUpdated: boolean;
  studentsAdded: boolean;
  studentsRemoved: boolean;
  staffAdded: boolean;
  staffRemoved: boolean;
}

class OrganizationNewUserGroup extends React.Component<
  OrganizationNewUserGroupProps,
  OrganizationNewUserGroupState
> {
  private totalSteps: number;

  constructor(props: OrganizationNewUserGroupProps) {
    super(props);
    this.totalSteps = 4;
    this.state = {
      usergroupName: "",
      isGuidanceGroup: false,
      addStudents: [],
      addStaff: [],
      removeStudents: [],
      removeStaff: [],
      studentsLoaded: false,
      locked: true,
      currentStep: 1,
      executing: false,
      validation: {
        nameValid: 2,
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
    const newAddState = this.state.addStudents.concat(student);
    this.setState({
      addStudents: newAddState,
    });
  }

  deleteStudent(student: SelectItem) {
    const newAddState = this.state.addStudents.filter(
      (aStudent) => aStudent.id !== student.id
    );
    this.setState({
      addStudents: newAddState,
    });
  }

  doStaffSearch(q: string) {
    this.props.loadStaff({ payload: { q } });
  }

  selectStaff(staff: SelectItem) {
    const newAddState = this.state.addStaff.concat(staff);
    this.setState({
      addStaff: newAddState,
    });
  }

  deleteStaff(staff: SelectItem) {
    const newAddState = this.state.addStaff.filter(
      (aStaff) => aStaff.id !== staff.id
    );
    this.setState({
      addStaff: newAddState,
    });
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
      usergroupName: "",
      isGuidanceGroup: false,
      studentsLoaded: false,
      executing: false,
      currentStep: 1,
      addStudents: [],
      removeStudents: [],
      addStaff: [],
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
      const validation: ValidationType = Object.assign(this.state.validation, {
        nameValid: 0,
      });
      this.setState({ locked: true, validation });
    } else {
      const nextStep = this.state.currentStep + 1;
      this.setState({ locked: false, currentStep: nextStep });
    }
  }

  lastStep() {
    const lastStep = this.state.currentStep - 1;
    this.setState({ currentStep: lastStep });
  }

  saveUsergroup(closeDialog: () => any) {
    this.setState({
      locked: true,
      executing: true,
    });

    let userIdentifiers: string[];

    const payload: CreateUserGroupType = {
      name: this.state.usergroupName,
      isGuidanceGroup: this.state.isGuidanceGroup,
    };

    if (this.state.addStudents.length !== 0) {
      userIdentifiers = this.state.addStudents.map(
        (student) => student.id as string
      );
    }

    if (this.state.addStaff.length !== 0) {
      if (!userIdentifiers) {
        userIdentifiers = this.state.addStaff.map(
          (staff) => staff.id as string
        );
      } else {
        userIdentifiers = userIdentifiers.concat(
          this.state.addStaff.map((staff) => staff.id as string)
        );
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
          setTimeout(
            () => this.props.loadUserGroups({ payload: { q: "" } }),
            2000
          );
        }
      },

      success: () => {
        closeDialog();
      },

      fail: () => {
        closeDialog();
      },
    });
  }

  wizardSteps(page: number) {
    switch (page) {
      case 1:
        return (
          <DialogRow>
            <DialogRow>
              <DialogRowHeader
                title={this.props.i18n.text.get(
                  "plugin.organization.userGroups.dialogs.create.step1.title",
                  page + "/" + this.totalSteps
                )}
                description={this.props.i18n.text.get(
                  "plugin.organization.userGroups.dialogs.create.step1.description"
                )}
              />
            </DialogRow>
            <form>
              <DialogRow modifiers="edit-workspace">
                <InputFormElement
                  id="userGroupName"
                  modifiers="user-group-name"
                  mandatory={true}
                  updateField={this.setUsergroupName}
                  valid={this.state.validation.nameValid}
                  name="usergroupName"
                  label={this.props.i18n.text.get(
                    "plugin.organization.userGroups.dialogs.name.label"
                  )}
                  value={this.state.usergroupName}
                ></InputFormElement>
              </DialogRow>
              <DialogRow modifiers="edit-workspace">
                <InputFormElement
                  id="isGuidanceGroup"
                  label={this.props.i18n.text.get(
                    "plugin.organization.userGroups.dialogs.guidanceSelect.label"
                  )}
                  checked={this.state.isGuidanceGroup}
                  name="is-guidance-group"
                  type="checkbox"
                  updateField={this.setGuidanceGroup}
                ></InputFormElement>
              </DialogRow>
            </form>
          </DialogRow>
        );
      case 2: {
        const students = this.props.users.students.map((student) => ({
          id: student.id,
          label: student.firstName + " " + student.lastName,
          icon: "user",
          type: "student",
        }));
        return (
          <DialogRow>
            <DialogRow>
              <DialogRowHeader
                title={this.props.i18n.text.get(
                  "plugin.organization.userGroups.dialogs.create.step2.title",
                  page + "/" + this.totalSteps
                )}
                description={this.props.i18n.text.get(
                  "plugin.organization.userGroups.dialogs.create.step2.description"
                )}
              />
            </DialogRow>
            <DialogRow modifiers="edit-workspace">
              <AutofillSelector
                identifier="addStudentsSelector"
                modifier="add-students"
                loader={this.doStudentSearch}
                placeholder={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.search.students.placeholder"
                )}
                selectedItems={this.state.addStudents}
                searchItems={students}
                onDelete={this.deleteStudent}
                onSelect={this.selectStudent}
              />
            </DialogRow>
          </DialogRow>
        );
      }
      case 3: {
        const staffSearchItems = this.props.users.staff.map((staff) => ({
          id: staff.id,
          label: staff.firstName + " " + staff.lastName,
          icon: "user",
        }));
        return (
          <DialogRow>
            <DialogRow>
              <DialogRowHeader
                title={this.props.i18n.text.get(
                  "plugin.organization.userGroups.dialogs.create.step3.title",
                  page + "/" + this.totalSteps
                )}
                description={this.props.i18n.text.get(
                  "plugin.organization.userGroups.dialogs.create.step3.description"
                )}
              />
              <AutofillSelector
                identifier="addTeachersSelector"
                modifier="add-teachers"
                loader={this.doStaffSearch}
                placeholder={this.props.i18n.text.get(
                  "plugin.organization.userGroups.dialogs.search.groupStaff.placeholder"
                )}
                selectedItems={this.state.addStaff}
                searchItems={staffSearchItems}
                onDelete={this.deleteStaff}
                onSelect={this.selectStaff}
              />
            </DialogRow>
          </DialogRow>
        );
      }
      case 4:
        return (
          <DialogRow modifiers="edit-workspace-summary">
            <DialogRow>
              <DialogRowHeader
                title={this.props.i18n.text.get(
                  "plugin.organization.userGroups.dialogs.create.step4.title",
                  page + "/" + this.totalSteps
                )}
                description={this.props.i18n.text.get(
                  "plugin.organization.userGroups.dialogs.create.step4.description"
                )}
              />
            </DialogRow>
            <DialogRow>
              <DialogRowHeader
                modifiers="new-workspace"
                title={this.props.i18n.text.get(
                  "plugin.organization.userGroups.dialogs.summary.label.userGroupName"
                )}
              />
              <DialogRowContent modifiers="new-workspace">
                <span>{this.state.usergroupName}</span>
                <span>
                  {this.state.isGuidanceGroup
                    ? " (" +
                      this.props.i18n.text.get(
                        "plugin.organization.userGroups.dialogs.summary.label.isGuidanceGroup"
                      ) +
                      ")"
                    : ""}
                </span>
              </DialogRowContent>
            </DialogRow>
            <DialogRow>
              <DialogRowHeader
                modifiers="new-workspace"
                title={this.props.i18n.text.get(
                  "plugin.organization.userGroups.dialogs.summary.label.addStudents"
                )}
              />
              <DialogRowContent modifiers="new-workspace">
                {this.state.addStudents.length > 0 ? (
                  this.state.addStudents.map((student) => {
                    const tag = {
                      node: student.label,
                      value: student,
                      icon: student.icon,
                    };
                    return (
                      <TagItem
                        modifier="selected-recipient"
                        key={"addStudent" + student.id}
                        tag={tag}
                        onDelete={this.deleteStudent}
                      ></TagItem>
                    );
                  })
                ) : (
                  <div>
                    {this.props.i18n.text.get(
                      "plugin.organization.userGroups.dialogs.summary.empty.students"
                    )}
                  </div>
                )}
              </DialogRowContent>
            </DialogRow>
            <DialogRow>
              <DialogRowHeader
                modifiers="new-workspace"
                title={this.props.i18n.text.get(
                  "plugin.organization.userGroups.dialogs.summary.label.addStaff"
                )}
              />
              <DialogRowContent modifiers="new-workspace">
                {this.state.addStaff.length > 0 ? (
                  this.state.addStaff.map((staff) => {
                    const tag = {
                      node: staff.label,
                      value: staff,
                      icon: staff.icon,
                    };
                    return (
                      <TagItem
                        modifier="selected-recipient"
                        key={"addStudent" + staff.id}
                        tag={tag}
                        onDelete={this.deleteStaff}
                      ></TagItem>
                    );
                  })
                ) : (
                  <div>
                    {this.props.i18n.text.get(
                      "plugin.organization.userGroups.dialogs.summary.empty.staff"
                    )}
                  </div>
                )}
              </DialogRowContent>
            </DialogRow>
          </DialogRow>
        );
      default:
        return <div>EMPTY</div>;
    }
  }

  render() {
    const content = (closePortal: () => any) =>
      this.wizardSteps(this.state.currentStep);

    const executeContent = (
      <div>
        <div
          className={`dialog__executer ${
            this.state.usergroupUpdated === true
              ? "dialog__executer state-DONE"
              : ""
          }`}
        >
          {this.props.i18n.text.get(
            "plugin.organization.userGroups.dialogs.summary.execute.createUserGroup "
          )}
        </div>
        <div
          className={`dialog__executer ${
            this.state.studentsAdded === true
              ? "dialog__executer state-DONE"
              : ""
          }`}
        >
          {this.props.i18n.text.get(
            "plugin.organization.userGroups.dialogs.summary.execute.addStudents"
          )}
        </div>
        <div
          className={`dialog__executer ${
            this.state.studentsRemoved === true
              ? "dialog__executer state-DONE"
              : ""
          }`}
        >
          {this.props.i18n.text.get(
            "plugin.organization.userGroups.dialogs.summary.execute.removeStudents"
          )}
        </div>
        <div
          className={`dialog__executer ${
            this.state.staffAdded === true ? "dialog__executer state-DONE" : ""
          }`}
        >
          {this.props.i18n.text.get(
            "plugin.organization.userGroups.dialogs.summary.execute.addStaff"
          )}
        </div>
        <div
          className={`dialog__executer ${
            this.state.staffRemoved === true
              ? "dialog__executer state-DONE"
              : ""
          }`}
        >
          {this.props.i18n.text.get(
            "plugin.organization.userGroups.dialogs.summary.execute.removeStaff"
          )}
        </div>
      </div>
    );
    const footer = (closePortal: () => any) => (
      <FormWizardActions
        locked={this.state.locked}
        currentStep={this.state.currentStep}
        totalSteps={this.totalSteps}
        executeLabel={this.props.i18n.text.get(
          "plugin.organization.userGroups.dialogs.create.execute.label"
        )}
        nextLabel={this.props.i18n.text.get(
          "plugin.organization.userGroups.dialogs.next.label"
        )}
        lastLabel={this.props.i18n.text.get(
          "plugin.organization.userGroups.dialogs.last.label"
        )}
        cancelLabel={this.props.i18n.text.get(
          "plugin.organization.userGroups.dialogs.cancel.label"
        )}
        executeClick={this.saveUsergroup.bind(this, closePortal)}
        nextClick={this.nextStep.bind(this)}
        lastClick={this.lastStep.bind(this)}
        cancelClick={this.cancelDialog.bind(this, closePortal)}
      />
    );

    return (
      <Dialog
        executing={this.state.executing}
        onClose={this.clearComponentState}
        executeContent={executeContent}
        footer={footer}
        modifier="new-user"
        title={this.props.i18n.text.get(
          "plugin.organization.userGroups.dialogs.create.title"
        )}
        content={content}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    users: state.userSelect,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    {
      loadStudents: loadSelectorStudents,
      loadStaff: loadSelectorStaff,
      loadUserGroups,
      createOrganizationUsergroup: createUsergroup,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationNewUserGroup);
