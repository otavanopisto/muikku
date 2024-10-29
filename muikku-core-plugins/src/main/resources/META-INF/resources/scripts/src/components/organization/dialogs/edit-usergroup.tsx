import * as React from "react";
import { connect } from "react-redux";
import Dialog, {
  DialogRow,
  DialogRowHeader,
  DialogRowContent,
  DialogRemoveUsers,
} from "~/components/general/dialog";
import {
  FormWizardActions,
  InputFormElement,
} from "~/components/general/form-element";
import {
  loadSelectorStudents,
  loadSelectorStaff,
  LoadUsersTriggerType,
  setCurrentUserGroup,
  SetCurrentUserGroupTriggerType,
  loadAllCurrentUserGroupStudents,
  loadAllCurrentUserGroupStaff,
  loadUserGroups,
  updateUsergroup,
  UpdateUsergroupTriggerType,
} from "~/actions/main-function/users";
import { StateType } from "~/reducers";
import { Action, bindActionCreators, Dispatch } from "redux";
import AutofillSelector, {
  UiSelectItem,
} from "~/components/base/input-select-autofill";
import { SelectItem } from "~/actions/workspaces/index";
import {
  UsersSelectState,
  UpdateUserGroupType,
  UpdateUserGroupStateType,
  CurrentUserGroupType,
} from "~/reducers/main-function/users";
import { TagItem } from "~/components/general/tag-input";
import {
  UpdateUsergroupAddUsersRequest,
  UpdateUsergroupRemoveUsersRequest,
  User,
  UserGroup,
  UserSearchResult,
} from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";

/**
 * ValidationType
 */
interface ValidationType {
  nameValid: number;
}

type UserCategoriesType = "students" | "staff";

/**
 * OrganizationEditUsergroupProps
 */
interface OrganizationEditUsergroupProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  usergroup: UserGroup;
  users: UsersSelectState;
  currentUserGroup: CurrentUserGroupType;
  setCurrentUserGroup: SetCurrentUserGroupTriggerType;
  updateOrganizationUsergroup: UpdateUsergroupTriggerType;
  loadAllCurrentUserGroupStaff: LoadUsersTriggerType;
  loadAllCurrentUserGroupStudents: LoadUsersTriggerType;
  loadStudents: LoadUsersTriggerType;
  loadStaff: LoadUsersTriggerType;
  loadUserGroups: LoadUsersTriggerType;
}

/**
 * OrganizationEditUsergroupState
 */
interface OrganizationEditUsergroupState {
  pages: {
    [key: string]: number;
  };
  searchValues: {
    [key: string]: string;
  };
  locked: boolean;
  currentStep: number;
  addStudents: UiSelectItem[];
  addStaff: UiSelectItem[];
  removeStudents: UiSelectItem[];
  removeStaff: UiSelectItem[];
  selectedStaff: UiSelectItem[];
  userGroupName: string;
  isGuidanceGroup: boolean;
  studentsLoaded: boolean;
  executing: boolean;
  validation: ValidationType;
  userGroupUpdated: boolean;
  studentsAdded: boolean;
  studentsRemoved: boolean;
  staffAdded: boolean;
  staffRemoved: boolean;
}

/**
 * OrganizationEditUsergroup
 */
class OrganizationEditUsergroup extends React.Component<
  OrganizationEditUsergroupProps,
  OrganizationEditUsergroupState
> {
  private totalSteps = 6;
  private usersPerPage = 5;
  private searchTimer: NodeJS.Timer;

  /**
   * constructor
   * @param props props
   */
  constructor(props: OrganizationEditUsergroupProps) {
    super(props);
    this.state = {
      pages: null,
      searchValues: null,
      userGroupName: this.props.usergroup.name,
      isGuidanceGroup: this.props.usergroup.isGuidanceGroup,
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
        nameValid: 2,
      },

      userGroupUpdated: false,
      studentsAdded: false,
      studentsRemoved: false,
      staffAdded: false,
      staffRemoved: false,
    };

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

  /**
   * doStudentSearch
   * @param q q
   */
  doStudentSearch(q: string) {
    this.props.loadStudents({ payload: { q } });
  }

  /**
   * goToPage
   * @param n n
   * @param loader loader
   * @param query query
   */
  goToPage(n: number, loader: LoadUsersTriggerType, query: string) {
    const pageStart: number = (n - 1) * this.usersPerPage;
    loader({
      payload: {
        q: query,
        firstResult: pageStart,
        maxResults: this.usersPerPage,
        userGroupIds: [this.props.usergroup.id],
      },
    });
  }

  /**
   * goToStudentPage
   * @param n n
   */
  goToStudentPage(n: number) {
    const query: string =
      this.state.searchValues && this.state.searchValues.staff
        ? this.state.searchValues.staff
        : null;
    this.goToPage(n, this.props.loadAllCurrentUserGroupStudents, query);
  }

  /**
   * goToStaffPage
   * @param n n
   */
  goToStaffPage(n: number) {
    const query: string =
      this.state.searchValues && this.state.searchValues.staff
        ? this.state.searchValues.staff
        : null;
    this.goToPage(n, this.props.loadAllCurrentUserGroupStaff, query);
  }

  /**
   * doUserGroupUsersSearch
   * @param loader loader
   * @param q q
   * @param type type
   */
  doUserGroupUsersSearch(
    loader: LoadUsersTriggerType,
    q: string,
    type: UserCategoriesType
  ) {
    loader({
      payload: {
        q,
        userGroupIds: [this.props.usergroup.id],
        firstResult: 0,
        maxResults: 5,
      },
      /**
       * success
       * @param users users
       */
      success: (users: UserSearchResult) => {
        this.setState({
          pages: {
            ...this.state.pages,
            [type]: Math.ceil(users.totalHitCount / this.usersPerPage),
          },
        });
      },
    });
  }

  /**
   * turnUsersToSelectItems
   * @param users users
   */
  turnUsersToSelectItems(users: User[]) {
    const selectItems: SelectItem[] = [];

    for (let i = 0; i < users.length; i++) {
      const item: SelectItem = {
        id: users[i].id,
        label: users[i].firstName + " " + users[i].lastName,
        variables: {
          identifier: users[i].userEntityId,
          boolean: users[i].hasImage,
        },
      };
      selectItems.push(item);
    }

    return selectItems;
  }

  /**
   * doUserGroupStudentSearch
   * @param q q
   */
  doUserGroupStudentSearch(q: string) {
    this.setState({
      searchValues: { ...this.state.searchValues, ["students"]: q },
    });
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(
      this.doUserGroupUsersSearch.bind(
        null,
        this.props.loadAllCurrentUserGroupStudents,
        q,
        "students"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as any,
      400
    );
  }

  /**
   * doUserGroupStaffSearch
   * @param q q
   */
  doUserGroupStaffSearch(q: string) {
    this.setState({
      searchValues: { ...this.state.searchValues, ["staff"]: q },
    });
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(
      this.doUserGroupUsersSearch.bind(
        null,
        this.props.loadAllCurrentUserGroupStaff,
        q,
        "staff"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as any,
      400
    );
  }

  /**
   * toggleStudentRemove
   * @param usr usr
   */
  toggleStudentRemove(usr: UiSelectItem) {
    const newRemoveState = this.state.removeStudents.some(
      (rStudent) => rStudent.id === usr.id
    )
      ? this.state.removeStudents.filter((rStudent) => rStudent.id !== usr.id)
      : this.state.removeStudents.concat(usr);
    this.setState({
      removeStudents: newRemoveState,
    });
  }

  /**
   * toggleStaffRemove
   * @param usr usr
   */
  toggleStaffRemove(usr: UiSelectItem) {
    const newRemoveState = this.state.removeStaff.some(
      (rStaff) => rStaff.id === usr.id
    )
      ? this.state.removeStaff.filter((rStaff) => rStaff.id !== usr.id)
      : this.state.removeStaff.concat(usr);
    this.setState({
      removeStaff: newRemoveState,
    });
  }

  /**
   * selectStudent
   * @param student student
   */
  selectStudent(student: SelectItem) {
    const newAddState = [...this.state.addStudents, student];
    this.setState({ addStudents: newAddState });
  }

  /**
   * deleteStudent
   * @param student student
   */
  deleteStudent(student: SelectItem) {
    const newAddState = this.state.addStudents.filter(
      (std) => std.id !== student.id
    );
    this.setState({ addStudents: newAddState });
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
    const newAddState = [...this.state.addStaff, staff];
    this.setState({ addStaff: newAddState });
  }

  /**
   *  deleteStaff
   * @param staff staff
   */
  deleteStaff(staff: SelectItem) {
    const newAddState = this.state.addStaff.filter(
      (stf) => stf.id !== staff.id
    );
    this.setState({ addStaff: newAddState });
  }

  /**
   * setGuidanceGroup
   * @param value value
   */
  setGuidanceGroup(value: boolean) {
    this.setState({ isGuidanceGroup: value });
  }

  /**
   * setUserGroupName
   * @param value value
   */
  setUserGroupName(value: string) {
    this.setState({ locked: false, userGroupName: value });
  }

  /**
   * clearComponentState
   */
  clearComponentState() {
    this.setState({
      locked: false,
      studentsLoaded: false,
      executing: false,
      currentStep: 1,
      addStudents: [],
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
    if (this.state.currentStep === 2) {
      this.doUserGroupStudentSearch("");
    }
    if (this.state.currentStep === 4) {
      this.doUserGroupStaffSearch("");
    }
    if (this.state.userGroupName === "") {
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

    let update: UpdateUserGroupType;
    let addUsers: UpdateUsergroupAddUsersRequest;
    let removeUsers: UpdateUsergroupRemoveUsersRequest;
    const groupIdentifier: string = this.props.usergroup.id.toString();

    if (
      this.props.usergroup.name !== this.state.userGroupName ||
      this.state.isGuidanceGroup !== this.props.usergroup.isGuidanceGroup
    ) {
      update = {
        name: this.state.userGroupName,
        // We get a number, but need it to be a string
        identifier: groupIdentifier,
        isGuidanceGroup: this.state.isGuidanceGroup,
      };
    }

    if (this.state.addStudents.length !== 0) {
      addUsers = {
        groupIdentifier: groupIdentifier,
        userIdentifiers: this.state.addStudents.map(
          (student) => student.id as string
        ),
      };
    }

    if (this.state.removeStudents.length !== 0) {
      removeUsers = {
        groupIdentifier: groupIdentifier,
        userIdentifiers: this.state.removeStudents.map(
          (student) => student.id as string
        ),
      };
    }

    if (this.state.addStaff.length !== 0) {
      if (!addUsers) {
        addUsers = {
          groupIdentifier: groupIdentifier,
          userIdentifiers: this.state.addStaff.map(
            (staff) => staff.id as string
          ),
        };
      } else {
        addUsers.userIdentifiers = addUsers.userIdentifiers.concat(
          this.state.addStaff.map((staff) => staff.id as string)
        );
      }
    }

    if (this.state.removeStaff.length !== 0) {
      if (!removeUsers) {
        removeUsers = {
          groupIdentifier: groupIdentifier,
          userIdentifiers: this.state.removeStaff.map(
            (staff) => staff.id as string
          ),
        };
      } else {
        removeUsers.userIdentifiers = removeUsers.userIdentifiers.concat(
          this.state.removeStaff.map((staff) => staff.id as string)
        );
      }
    }

    this.props.updateOrganizationUsergroup({
      update: update,
      addUsers: addUsers,
      removeUsers: removeUsers,
      /**
       * progress
       * @param state state
       */
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
                description={t("labels.edituserGroupInfo", { ns: "users" })}
              />
            </DialogRow>
            <form>
              <DialogRow modifiers="edit-workspace">
                <InputFormElement
                  id="userGroupName"
                  modifiers="user-group-name"
                  mandatory={true}
                  updateField={this.setUserGroupName}
                  valid={this.state.validation.nameValid}
                  name="userGroupName"
                  label={t("labels.name", {
                    ns: "users",
                    context: "userGroup",
                  })}
                  value={this.state.userGroupName}
                ></InputFormElement>
              </DialogRow>
              <DialogRow modifiers="edit-workspace">
                <InputFormElement
                  id="isGuidanceGroup"
                  label={t("labels.guidanceGroup", { ns: "users" })}
                  name="is-guidance-group"
                  value={this.props.usergroup.name}
                  checked={this.state.isGuidanceGroup}
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
                description={t("labels.search", {
                  ns: "users",
                  context: "students",
                })}
              />
            </DialogRow>
            <DialogRow>
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
        const studentGroupStudents =
          this.props.currentUserGroup && this.props.currentUserGroup.students
            ? this.turnUsersToSelectItems(
                this.props.currentUserGroup.students.results
              )
            : [];
        return (
          <DialogRow>
            <DialogRow>
              <DialogRowHeader
                title={t("labels.remove", {
                  ns: "users",
                  context: "userGroupStudents",
                  stepInfo: `${page}/${this.totalSteps}`,
                })}
                description={t("content.searchToRemove", {
                  ns: "users",
                  context: "students",
                })}
              />
            </DialogRow>
            <DialogRemoveUsers
              users={studentGroupStudents}
              placeholder={t("labels.search", {
                ns: "users",
                context: "userGroupStudents",
              })}
              removeUsers={this.state.removeStudents}
              pages={
                this.state.pages && this.state.pages.students
                  ? this.state.pages.students
                  : 0
              }
              identifier={"userGroup" + this.props.usergroup.id + "Students"}
              allTabTitle={t("labels.userGroupStudents", { ns: "users" })}
              removeTabTitle={t("labels.studentsToRemove", { ns: "users" })}
              onEmptyTitle={t("content.notFound", { ns: "users" })}
              searchValue={
                this.state.searchValues && this.state.searchValues.students
                  ? this.state.searchValues.students
                  : ""
              }
              searchUsers={this.doUserGroupStudentSearch}
              changePage={this.goToStudentPage}
              setRemoved={this.toggleStudentRemove}
            />
          </DialogRow>
        );
      }
      case 4: {
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
                description={t("labels.search", {
                  ns: "users",
                  context: "staff",
                })}
              />
            </DialogRow>
            <DialogRow>
              <AutofillSelector
                identifier="addTeachersSelector"
                modifier="add-teachers"
                loader={this.doStaffSearch}
                placeholder={t("labels.search", {
                  ns: "users",
                  context: "staff",
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
      case 5: {
        const studentGroupStaff =
          this.props.currentUserGroup && this.props.currentUserGroup.staff
            ? this.turnUsersToSelectItems(
                this.props.currentUserGroup.staff.results
              )
            : [];
        return (
          <DialogRow>
            <DialogRow>
              <DialogRowHeader
                title={t("labels.remove", {
                  ns: "users",
                  context: "userGroupTeachers",
                  stepInfo: `${page}/${this.totalSteps}`,
                })}
                description={t("content.searchToRemove", {
                  ns: "users",
                  context: "staff",
                })}
              />
            </DialogRow>
            <DialogRemoveUsers
              users={studentGroupStaff}
              placeholder={t("labels.search", {
                ns: "users",
                context: "userGroupStaff",
              })}
              removeUsers={this.state.removeStaff}
              pages={
                this.state.pages && this.state.pages.staff
                  ? this.state.pages.staff
                  : 0
              }
              identifier={"userGroup" + this.props.usergroup.id + "Staff"}
              allTabTitle={t("labels.groupCounselors", { ns: "users" })}
              removeTabTitle={t("labels.counselorsToRemove", { ns: "users" })}
              onEmptyTitle={t("content.notFound", { ns: "users" })}
              searchValue={
                this.state.searchValues && this.state.searchValues.staff
                  ? this.state.searchValues.staff
                  : ""
              }
              searchUsers={this.doUserGroupStaffSearch}
              changePage={this.goToStaffPage}
              setRemoved={this.toggleStaffRemove}
            />
          </DialogRow>
        );
      }
      case 6:
        return (
          <DialogRow modifiers="edit-workspace-summary">
            <DialogRow>
              <DialogRowHeader
                title={`${t("labels.stepLast", {
                  ns: "workspace",
                })} - ${page}/${this.totalSteps}`}
                description={t("content.reviewSummary", { ns: "workspace" })}
              />
            </DialogRow>
            <DialogRow>
              <DialogRowHeader
                modifiers="new-workspace"
                title={t("labels.name", { ns: "users", context: "userGroup" })}
              />
              <DialogRowContent modifiers="new-workspace">
                <span>{this.state.userGroupName}</span>
                <span>
                  {this.state.isGuidanceGroup
                    ? ` ${t("labels.guidanceGroup", { ns: "users" })}`
                    : ""}
                </span>
              </DialogRowContent>
            </DialogRow>
            <DialogRow>
              <DialogRowHeader
                modifiers="new-workspace"
                title={t("labels.studentsToAdd", { ns: "users" })}
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
                title={t("labels.counselorsToAdd", { ns: "users" })}
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
            <DialogRow>
              <DialogRowHeader
                modifiers="new-workspace"
                title={t("labels.studentsToRemove", { ns: "users" })}
              />
              <DialogRowContent modifiers="new-workspace">
                {this.state.removeStudents.length > 0 ? (
                  this.state.removeStudents.map((student) => {
                    const tag = {
                      node: student.label,
                      value: student,
                      icon: student.icon,
                    };
                    return (
                      <TagItem
                        modifier="selected-recipient"
                        key={"removeStudent" + student.id}
                        tag={tag}
                        onDelete={this.toggleStudentRemove}
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
                title={t("labels.counselorsToRemove", { ns: "users" })}
              />
              <DialogRowContent modifiers="new-workspace">
                {this.state.removeStaff.length > 0 ? (
                  this.state.removeStaff.map((staff) => {
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
                        onDelete={this.toggleStaffRemove}
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
     * executeContent
     * @param closePortal closePortal
     */
    const content = (closePortal: () => void) =>
      this.wizardSteps(this.state.currentStep);

    const executeContent = (
      <div>
        <div
          className={`dialog__executer ${
            this.state.userGroupUpdated === true
              ? "dialog__executer state-DONE"
              : ""
          }`}
        >
          {t("labels.updating", {
            ns: "users",
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
        executeLabel={t("labels.edit", { ns: "users", context: "userGroup" })}
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
        modifier="edit-user-group"
        title={t("labels.edit", {
          ns: "users",
          context: "userGroup",
          userGroup: this.props.usergroup.name,
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
    currentUserGroup: state.userGroups.currentUserGroup,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      loadStudents: loadSelectorStudents,
      loadStaff: loadSelectorStaff,
      loadUserGroups,
      updateOrganizationUsergroup: updateUsergroup,
      loadAllCurrentUserGroupStaff,
      loadAllCurrentUserGroupStudents,
      setCurrentUserGroup,
    },
    dispatch
  );
}

export default withTranslation(["users", "workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(OrganizationEditUsergroup)
);
