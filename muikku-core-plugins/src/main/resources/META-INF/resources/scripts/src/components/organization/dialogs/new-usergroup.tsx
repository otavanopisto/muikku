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
import { StateType } from "~/reducers";
import { bindActionCreators } from "redux";
import AutofillSelector, {
  UiSelectItem,
} from "~/components/base/input-select-autofill";
import { SelectItem } from "~/actions/workspaces/index";
import {
  CreateUserGroupType,
  UpdateUserGroupStateType,
  UsersSelectState,
} from "~/reducers/main-function/users";
import { TagItem } from "~/components/general/tag-input";
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";

/**
 * ValidationType
 */
interface ValidationType {
  nameValid: number;
}

/**
 * OrganizationNewUserGroupProps
 */
interface OrganizationNewUserGroupProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  users: UsersSelectState;
  createOrganizationUsergroup: CreateUsergroupTriggerType;
  loadStudents: LoadUsersTriggerType;
  loadStaff: LoadUsersTriggerType;
  loadUserGroups: LoadUsersTriggerType;
}

/**
 * OrganizationNewUserGroupState
 */
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

/**
 * OrganizationNewUserGroup
 */
class OrganizationNewUserGroup extends React.Component<
  OrganizationNewUserGroupProps,
  OrganizationNewUserGroupState
> {
  private totalSteps: number;

  /**
   * constructor
   * @param props props
   */
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
  /**
   * doStudentSearch
   * @param q q
   */
  doStudentSearch(q: string) {
    this.props.loadStudents({ payload: { q } });
  }

  /**
   * selectStudent
   * @param student student
   */
  selectStudent(student: SelectItem) {
    const newAddState = this.state.addStudents.concat(student);
    this.setState({
      addStudents: newAddState,
    });
  }

  /**
   * deleteStudent
   * @param student student
   */
  deleteStudent(student: SelectItem) {
    const newAddState = this.state.addStudents.filter(
      (aStudent) => aStudent.id !== student.id
    );
    this.setState({
      addStudents: newAddState,
    });
  }

  /**
   * doStaffSearch
   * @param q q
   */
  doStaffSearch(q: string) {
    this.props.loadStaff({ payload: { q } });
  }

  /**
   * selectStaff
   * @param staff staff
   */
  selectStaff(staff: SelectItem) {
    const newAddState = this.state.addStaff.concat(staff);
    this.setState({
      addStaff: newAddState,
    });
  }

  /**
   * deleteStaff
   * @param staff staff
   */
  deleteStaff(staff: SelectItem) {
    const newAddState = this.state.addStaff.filter(
      (aStaff) => aStaff.id !== staff.id
    );
    this.setState({
      addStaff: newAddState,
    });
  }

  /**
   * setGuidanceGroup
   * @param value value
   */
  setGuidanceGroup(value: boolean) {
    this.setState({ isGuidanceGroup: value });
  }

  /**
   * setUsergroupName
   * @param value value
   */
  setUsergroupName(value: string) {
    this.setState({ locked: false, usergroupName: value });
  }

  /**
   * clearComponentState
   */
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

  /**
   * cancelDialog
   * @param closeDialog closeDialog
   */
  cancelDialog(closeDialog: () => void) {
    closeDialog();
  }

  /**
   * nextStep
   */
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

  /**
   * lastStep
   */
  lastStep() {
    const lastStep = this.state.currentStep - 1;
    this.setState({ currentStep: lastStep });
  }

  /**
   * saveUsergroup
   * @param closeDialog closeDialog
   */
  saveUsergroup(closeDialog: () => void) {
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
      /**
       * progress
       * @param state state
       */
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

      /**
       * success
       */
      success: () => {
        closeDialog();
      },

      /**
       * fail
       */
      fail: () => {
        closeDialog();
      },
    });
  }

  /**
   * wizardSteps
   * @param page page
   */
  wizardSteps(page: number) {
    const { t } = this.props;

    switch (page) {
      case 1:
        return (
          <DialogRow>
            <DialogRow>
              <DialogRowHeader
                title={t("labels.edituserGroupInfo", {
                  ns: "users",
                  stepInfo: `${page}/${this.totalSteps}`,
                })}
                description={t("content.editDetails", {
                  ns: "users",
                })}
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
                  label={t("labels.name", {
                    ns: "users",
                    context: "userGroup",
                  })}
                  value={this.state.usergroupName}
                ></InputFormElement>
              </DialogRow>
              <DialogRow modifiers="edit-workspace">
                <InputFormElement
                  id="isGuidanceGroup"
                  label={t("labels.guidanceGroup", {
                    ns: "users",
                  })}
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
                title={t("labels.add", {
                  ns: "users",
                  context: "userGroupStudents",
                  stepInfo: `${page}/${this.totalSteps}`,
                })}
                description={t("content.search", {
                  ns: "users",
                  context: "students",
                })}
              />
            </DialogRow>
            <DialogRow modifiers="edit-workspace">
              <AutofillSelector
                identifier="addStudentsSelector"
                modifier="add-students"
                loader={this.doStudentSearch}
                placeholder={t("labels.search", {
                  ns: "users",
                  context: "students",
                })}
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
                title={t("labels.add", {
                  ns: "users",
                  context: "userGroupTeachers",
                  stepInfo: `${page}/${this.totalSteps}`,
                })}
                description={t("content.search", {
                  ns: "users",
                  context: "staff",
                })}
              />
              <AutofillSelector
                identifier="addTeachersSelector"
                modifier="add-teachers"
                loader={this.doStaffSearch}
                placeholder={t("labels.search", {
                  ns: "users",
                  context: "userGroupStaff",
                })}
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
                title={`${t("labels.stepLast", {
                  ns: "workspace",
                })} - ${page}/${this.totalSteps}`}
                description={t("content.reviewSummary", {
                  ns: "workspace",
                })}
              />
            </DialogRow>
            <DialogRow>
              <DialogRowHeader
                modifiers="new-workspace"
                title={t("labels.name", {
                  ns: "users",
                  context: "userGroup",
                })}
              />
              <DialogRowContent modifiers="new-workspace">
                <span>{this.state.usergroupName}</span>
                <span>
                  {this.state.isGuidanceGroup
                    ? `(${t("labels.guidanceGroup", {
                        ns: "users",
                      })})`
                    : ""}
                </span>
              </DialogRowContent>
            </DialogRow>
            <DialogRow>
              <DialogRowHeader
                modifiers="new-workspace"
                title={t("labels.studentsToAdd", {
                  ns: "users",
                })}
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
                    {t("content.noneSelected", {
                      ns: "users",
                      context: "students",
                    })}
                  </div>
                )}
              </DialogRowContent>
            </DialogRow>
            <DialogRow>
              <DialogRowHeader
                modifiers="new-workspace"
                title={t("labels.counselorsToAdd", {
                  ns: "users",
                })}
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
                    {t("content.noneSelected", {
                      ns: "users",
                      context: "counselors",
                    })}
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

  /**
   * render
   */
  render() {
    const { t } = this.props;

    /**
     * content
     * @param closePortal closePortal
     */
    const content = (closePortal: () => void) =>
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
          {t("labels.creating", {
            ns: "users",
            context: "userGroup",
          })}
        </div>
        <div
          className={`dialog__executer ${
            this.state.studentsAdded === true
              ? "dialog__executer state-DONE"
              : ""
          }`}
        >
          {t("labels.adding", {
            ns: "users",
            context: "students",
          })}
        </div>
        <div
          className={`dialog__executer ${
            this.state.studentsRemoved === true
              ? "dialog__executer state-DONE"
              : ""
          }`}
        >
          {t("labels.removing", {
            ns: "users",
            context: "students",
          })}
        </div>
        <div
          className={`dialog__executer ${
            this.state.staffAdded === true ? "dialog__executer state-DONE" : ""
          }`}
        >
          {t("labels.adding", {
            ns: "users",
            context: "counselors",
          })}
        </div>
        <div
          className={`dialog__executer ${
            this.state.staffRemoved === true
              ? "dialog__executer state-DONE"
              : ""
          }`}
        >
          {t("labels.removing", {
            ns: "users",
            context: "counselors",
          })}
        </div>
      </div>
    );
    /**
     * footer
     * @param closePortal closePortal
     */
    const footer = (closePortal: () => void) => (
      <FormWizardActions
        locked={this.state.locked}
        currentStep={this.state.currentStep}
        totalSteps={this.totalSteps}
        executeLabel={t("actions.create", {
          ns: "users",
          context: "userGroup",
        })}
        nextLabel={t("actions.next")}
        lastLabel={t("actions.previous")}
        cancelLabel={t("actions.cancel")}
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
        title={t("labels.create", {
          ns: "users",
          context: "userGroup",
        })}
        content={content}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    users: state.userSelect,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
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

export default withTranslation(["workspace", "users", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(OrganizationNewUserGroup)
);
