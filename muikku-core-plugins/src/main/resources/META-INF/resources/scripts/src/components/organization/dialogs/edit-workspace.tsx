import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Dialog, {
  DialogRow,
  DialogRowHeader,
  DialogRowContent,
  DialogRemoveUsers,
} from "~/components/general/dialog";
import {
  FormWizardActions,
  InputFormElement,
  DateFormElement,
} from "~/components/general/form-element";
import {
  loadSelectorStaff,
  loadSelectorStudents,
  LoadUsersTriggerType,
  loadSelectorUserGroups,
} from "~/actions/main-function/users";
import {
  LoadUsersOfWorkspaceTriggerType,
  loadWorkspacesFromServer,
  LoadWorkspacesFromServerTriggerType,
  SetCurrentWorkspaceTriggerType,
  UpdateWorkspaceStateType,
  UpdateWorkspaceTriggerType,
} from "~/actions/workspaces";
import {
  updateOrganizationWorkspace,
  setCurrentOrganizationWorkspace,
  loadCurrentOrganizationWorkspaceStaff,
  loadCurrentOrganizationWorkspaceStudents,
} from "~/actions/workspaces/organization";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import { bindActionCreators } from "redux";
import AutofillSelector, {
  UiSelectItem,
} from "~/components/base/input-select-autofill";
import { SelectItem } from "~/actions/workspaces/index";
import {
  ShortWorkspaceUserWithActiveStatusType,
  WorkspaceStudentListType,
  WorkspaceStaffListType,
} from "~/reducers/user-index";
import { UsersSelectType } from "~/reducers/main-function/users";
import {
  WorkspaceUpdateType,
  WorkspaceType,
  WorkspaceAccessType,
  WorkspacesActiveFiltersType,
  WorkspaceDetailsType,
} from "~/reducers/workspaces";
import { TagItem } from "~/components/general/tag-input";
import { UserStaffType } from "~/reducers/user-index";
import * as moment from "moment";
import { AnyActionType } from "~/actions/index";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";

/**
 * ValidationType
 */
interface ValidationType {
  nameValid: number;
}

type UserCategoryType = "students" | "staff";

/**
 * OrganizationEditWorkspaceProps
 */
interface OrganizationEditWorkspaceProps {
  children?: React.ReactElement<any>;
  i18n: i18nType;
  users: UsersSelectType;
  workspace: WorkspaceType;
  currentWorkspace: WorkspaceType;
  activeFilters: WorkspacesActiveFiltersType;
  updateOrganizationWorkspace: UpdateWorkspaceTriggerType;
  setCurrentOrganizationWorkspace: SetCurrentWorkspaceTriggerType;
  loadCurrentOrganizationWorkspaceStudents: LoadUsersOfWorkspaceTriggerType;
  loadCurrentOrganizationWorkspaceStaff: LoadUsersOfWorkspaceTriggerType;
  loadStudents: LoadUsersTriggerType;
  loadStaff: LoadUsersTriggerType;
  loadUserGroups: LoadUsersTriggerType;
  loadWorkspaces: LoadWorkspacesFromServerTriggerType;
}

/**
 * OrganizationEditWorkspaceState
 */
interface OrganizationEditWorkspaceState {
  beginDate: Date | null;
  endDate: Date | null;
  pages: {
    [key: string]: number;
  };
  searchValues: {
    [key: string]: string;
  };
  workspaceName: string;
  workspaceNameExtension: string;
  workspaceAccess: WorkspaceAccessType;
  locked: boolean;
  currentStep: number;
  addStaff: UiSelectItem[];
  addStudents: UiSelectItem[];
  removeStaff: UiSelectItem[];
  removeStudents: UiSelectItem[];
  staffLoaded: boolean;
  studentsLoaded: boolean;
  executing: boolean;
  validation: ValidationType;
  workspaceUpdated: boolean;
  detailsAdded: boolean;
  studentsAdded: boolean;
  staffAdded: boolean;
  studentsRemoved: boolean;
  staffRemoved: boolean;
}

/**
 * OrganizationEditWorkspace
 */
class OrganizationEditWorkspace extends React.Component<
  OrganizationEditWorkspaceProps,
  OrganizationEditWorkspaceState
> {
  private totalSteps: number;
  private usersPerPage = 5;

  /**
   * constructor
   * @param props props
   */
  constructor(props: OrganizationEditWorkspaceProps) {
    super(props);
    this.totalSteps = 6;
    this.state = {
      beginDate: null,
      endDate: null,
      pages: null,
      searchValues: null,
      workspaceName: this.props.workspace.name,
      workspaceNameExtension: this.props.workspace.nameExtension,
      workspaceAccess:
        (this.props.currentWorkspace && this.props.currentWorkspace.access) ||
        null,
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
        nameValid: 2,
      },
      detailsAdded: false,
      workspaceUpdated: false,
      studentsAdded: false,
      staffAdded: false,
      studentsRemoved: false,
      staffRemoved: false,
    };

    // TODO: amount of these methods can be halved

    this.goToPage = this.goToPage.bind(this);
    this.goToStudentPage = this.goToStudentPage.bind(this);
    this.goToStaffPage = this.goToStaffPage.bind(this);
    this.toggleStaffRemove = this.toggleStaffRemove.bind(this);
    this.doStaffSearch = this.doStaffSearch.bind(this);
    this.doWorkspaceStaffSearch = this.doWorkspaceStaffSearch.bind(this);
    this.selectStaff = this.selectStaff.bind(this);
    this.deleteStaff = this.deleteStaff.bind(this);
    this.toggleStudentRemove = this.toggleStudentRemove.bind(this);
    this.doStudentSearch = this.doStudentSearch.bind(this);
    this.doWorkspaceStudentSearch = this.doWorkspaceStudentSearch.bind(this);
    this.selectStudent = this.selectStudent.bind(this);
    this.deleteStudent = this.deleteStudent.bind(this);
    this.doWorkspaceUserSearch = this.doWorkspaceUserSearch.bind(this);
    this.setWorkspaceName = this.setWorkspaceName.bind(this);
    this.setWorkspaceNameExtension = this.setWorkspaceNameExtension.bind(this);
    this.saveWorkspace = this.saveWorkspace.bind(this);
    this.clearComponentState = this.clearComponentState.bind(this);
    this.setSelectedWorkspace = this.setSelectedWorkspace.bind(this);
    this.turnStudentsToSelectItems = this.turnStudentsToSelectItems.bind(this);
  }

  /**
   * goToPage
   * @param n n
   * @param loader loader
   * @param query query
   */
  goToPage(n: number, loader: LoadUsersOfWorkspaceTriggerType, query: string) {
    const data = {
      workspace: this.props.workspace,
      payload: {
        q: query,
        firstResult: (n - 1) * this.usersPerPage,
        maxResults: this.usersPerPage,
      },
    };
    loader(data);
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
    this.goToPage(
      n,
      this.props.loadCurrentOrganizationWorkspaceStudents,
      query
    );
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
    this.goToPage(n, this.props.loadCurrentOrganizationWorkspaceStaff, query);
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
   * doWorkspaceUserSearch
   * @param loader loader
   * @param q q
   * @param type type
   */
  doWorkspaceUserSearch(
    loader: LoadUsersOfWorkspaceTriggerType,
    q: string,
    type: UserCategoryType
  ) {
    const data = {
      workspace: this.props.workspace,
      payload: {
        q,
        firstResult: 0,
        maxResults: 5,
      },
      /**
       * success
       * @param users users
       */
      success: (users: WorkspaceStudentListType | WorkspaceStaffListType) => {
        this.setState({
          pages: {
            ...this.state.pages,
            [type]: Math.ceil(users.totalHitCount / this.usersPerPage),
          },
        });
      },
    };
    loader(data);
  }

  /**
   * doWorkspaceStudentSearch
   * @param q q
   */
  doWorkspaceStudentSearch(q: string) {
    this.doWorkspaceUserSearch(
      this.props.loadCurrentOrganizationWorkspaceStudents,
      q,
      "students"
    );
  }

  /**
   * doWorkspaceStaffSearch
   * @param q q
   */
  doWorkspaceStaffSearch(q: string) {
    this.doWorkspaceUserSearch(
      this.props.loadCurrentOrganizationWorkspaceStaff,
      q,
      "staff"
    );
  }

  /**
   * doStudentSearch
   * @param q q
   */
  doStudentSearch(q: string) {
    this.props.loadStudents({ payload: { q } });
    this.props.loadUserGroups({ payload: { q } });
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
   * deleteStaff
   * @param staff staff
   */
  deleteStaff(staff: SelectItem) {
    const newAddState = this.state.addStaff.filter(
      (stf) => stf.id !== staff.id
    );
    this.setState({ addStaff: newAddState });
  }

  /**
   * setSelectedWorkspace
   */
  setSelectedWorkspace() {
    this.props.setCurrentOrganizationWorkspace({
      workspaceId: this.props.workspace.id,
      loadDetails: true,
      /**
       * success
       * @param workspace workspace
       */
      success: (workspace: WorkspaceType) => {
        this.setState({
          workspaceAccess: workspace.access,
          beginDate: workspace.details.beginDate
            ? this.props.i18n.time
                .getLocalizedMoment(workspace.details.beginDate)
                .toDate()
            : null,
          endDate: workspace.details.endDate
            ? this.props.i18n.time
                .getLocalizedMoment(workspace.details.endDate)
                .toDate()
            : null,
        });
      },
    });
  }

  /**
   * setWorkspaceName
   * @param value value
   */
  setWorkspaceName(value: string) {
    this.setState({ locked: false, workspaceName: value });
  }

  /**
   * handleDateChange
   * @param dateKey dateKey
   * @param newDate newDate
   */
  handleDateChange(dateKey: "beginDate" | "endDate", newDate: Date) {
    this.setState({ ...this.state, [dateKey]: newDate });
  }

  /**
   * setWorkspaceNameExtension
   * @param value value
   */
  setWorkspaceNameExtension(value: string) {
    this.setState({ workspaceNameExtension: value });
  }

  /**
   * setWorkspaceAccess
   * @param value value
   */
  setWorkspaceAccess(value: WorkspaceAccessType) {
    this.setState({ workspaceAccess: value });
  }

  /**
   * clearComponentState
   */
  clearComponentState() {
    this.setState({
      locked: false,
      executing: false,
      currentStep: 1,
      addStaff: [],
      addStudents: [],
      removeStaff: [],
      removeStudents: [],
      workspaceUpdated: false,
      detailsAdded: false,
      studentsAdded: false,
      staffAdded: false,
    });
  }

  /**
   * cancelDialog
   * @param closeDialog closeDialog
   */
  cancelDialog(closeDialog: () => any) {
    closeDialog();
  }

  /**
   * nextStep
   */
  nextStep() {
    if (this.state.currentStep === 1) {
      this.doWorkspaceStudentSearch("");
    }
    if (this.state.currentStep === 3) {
      this.doWorkspaceStaffSearch("");
    }
    if (this.state.workspaceName === "") {
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
   * turnStudentsToSelectItems
   * @param users users
   */
  turnStudentsToSelectItems(users: ShortWorkspaceUserWithActiveStatusType[]) {
    const selectItems: SelectItem[] = [];

    for (let i = 0; i < users.length; i++) {
      const item: SelectItem = {
        id: users[i].userIdentifier,
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
   * turnStaffToSelectItems
   * @param users users
   */
  turnStaffToSelectItems(users: UserStaffType[]) {
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
   * saveWorkspace
   * @param closeDialog closeDialog
   */
  saveWorkspace(closeDialog: () => any) {
    this.setState({
      locked: true,
      executing: true,
    });

    // This has to be done like this, because the ISO-dates from rest are different from the moment ISO-dates

    const originalBeginDate = this.props.currentWorkspace.details.beginDate
      ? moment(this.props.currentWorkspace.details.beginDate).toISOString()
      : null;

    const originalEndDate = this.props.currentWorkspace.details.endDate
      ? moment(this.props.currentWorkspace.details.endDate).toISOString()
      : null;

    const beginDate = this.state.beginDate
      ? this.state.beginDate.toISOString()
      : null;

    const endDate = this.state.endDate
      ? this.state.endDate.toISOString()
      : null;

    let detailsChanged = false;
    const payload: WorkspaceUpdateType = {};

    if (this.props.currentWorkspace.name !== this.state.workspaceName) {
      payload.name = this.state.workspaceName;
    }

    if (
      this.props.currentWorkspace.nameExtension !==
      this.state.workspaceNameExtension
    ) {
      payload.nameExtension = this.state.workspaceNameExtension;
    }

    if (this.props.currentWorkspace.access !== this.state.workspaceAccess) {
      payload.access = this.state.workspaceAccess;
    }

    const detailsUpdate: WorkspaceDetails = {
      beginDate: this.props.currentWorkspace.details.beginDate,
      endDate: this.props.currentWorkspace.details.endDate,
      signupStart: this.props.currentWorkspace.details.signupStart,
      signupEnd: this.props.currentWorkspace.details.signupEnd,
      externalViewUrl: this.props.currentWorkspace.details.externalViewUrl,
      typeId: this.props.currentWorkspace.details.typeId,
      rootFolderId: this.props.currentWorkspace.details.rootFolderId,
      helpFolderId: this.props.currentWorkspace.details.helpFolderId,
      indexFolderId: this.props.currentWorkspace.details.indexFolderId,
    };

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
      /**
       * progress
       * @param state state
       */
      progress: (state: UpdateWorkspaceStateType) => {
        if (state === "workspace-update") {
          this.setState({
            workspaceUpdated: true,
          });
        } else if (state === "add-details") {
          this.setState({
            detailsAdded: true,
          });
        } else if (state === "add-students") {
          this.setState({
            studentsAdded: true,
          });
        } else if (state === "add-teachers") {
          this.setState({
            staffAdded: true,
          });
        } else if (state === "done") {
          setTimeout(
            () =>
              this.props.loadWorkspaces(this.props.activeFilters, true, true),
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
    switch (page) {
      case 1:
        return (
          <form>
            <DialogRow>
              <DialogRowHeader
                title={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.step1.title",
                  page + "/" + this.totalSteps
                )}
                description={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.step1.description"
                )}
              />
            </DialogRow>
            <DialogRow modifiers="edit-workspace">
              <InputFormElement
                id="workspaceName"
                modifiers="workspace-name"
                mandatory={true}
                updateField={this.setWorkspaceName}
                valid={this.state.validation.nameValid}
                name="workspace-name"
                label={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.name.label"
                )}
                value={this.state.workspaceName}
              ></InputFormElement>
              <InputFormElement
                id="workspaceNameExtension"
                modifiers="dialog-workspace-name-extension"
                updateField={this.setWorkspaceNameExtension}
                name="workspace-name-extension"
                label={this.props.i18n.text.get(
                  "plugin.organization.workspaces.addWorkspace.nameExtension.label"
                )}
                value={this.state.workspaceNameExtension}
              ></InputFormElement>
            </DialogRow>
            <DialogRow modifiers="edit-workspace">
              <DateFormElement
                id="workspaceBeginDate"
                maxDate={this.state.endDate}
                updateField={this.handleDateChange.bind(this, "beginDate")}
                locale={outputCorrectDatePickerLocale(
                  this.props.i18n.time.getLocale()
                )}
                selected={this.state.beginDate}
                modifiers="organization-workspace-date"
                labels={{
                  label: this.props.i18n.text.get(
                    "plugin.organization.workspaces.editWorkspace.beginDate.label"
                  ),
                }}
                dateFormat="P"
              />
              <DateFormElement
                id="workspaceEndDate"
                minDate={this.state.beginDate}
                updateField={this.handleDateChange.bind(this, "endDate")}
                locale={outputCorrectDatePickerLocale(
                  this.props.i18n.time.getLocale()
                )}
                selected={this.state.endDate}
                modifiers="organization-workspace-date"
                labels={{
                  label: this.props.i18n.text.get(
                    "plugin.organization.workspaces.editWorkspace.endDate.label"
                  ),
                }}
                dateFormat="P"
              />
            </DialogRow>
            <DialogRow>
              <fieldset className="form__fieldset">
                <legend className="form__legend">
                  {this.props.i18n.text.get(
                    "plugin.workspace.management.settings.access"
                  )}
                </legend>
                <div className="form__fieldset-content  form__fieldset-content--horizontal">
                  <div className="form-element form-element--checkbox-radiobutton">
                    <input
                      id="accessMembers"
                      name="access-members"
                      type="radio"
                      checked={this.state.workspaceAccess === "MEMBERS_ONLY"}
                      onChange={this.setWorkspaceAccess.bind(
                        this,
                        "MEMBERS_ONLY"
                      )}
                    />
                    <label htmlFor="accessMembers">
                      {this.props.i18n.text.get(
                        "plugin.workspace.management.settings.access.membersOnly"
                      )}
                    </label>
                  </div>
                  <div className="form-element form-element--checkbox-radiobutton">
                    <input
                      id="accessLoggedin"
                      name="access-loggedin"
                      type="radio"
                      checked={this.state.workspaceAccess === "LOGGED_IN"}
                      onChange={this.setWorkspaceAccess.bind(this, "LOGGED_IN")}
                    />
                    <label htmlFor="accessLoggedin">
                      {this.props.i18n.text.get(
                        "plugin.workspace.management.settings.access.loggedIn"
                      )}
                    </label>
                  </div>
                  <div className="form-element form-element--checkbox-radiobutton">
                    <input
                      id="accessAnyone"
                      name="access-anyone"
                      type="radio"
                      checked={this.state.workspaceAccess === "ANYONE"}
                      onChange={this.setWorkspaceAccess.bind(this, "ANYONE")}
                    />
                    <label htmlFor="accessAnyone">
                      {this.props.i18n.text.get(
                        "plugin.workspace.management.settings.access.anyone"
                      )}
                    </label>
                  </div>
                </div>
              </fieldset>
            </DialogRow>
          </form>
        );
      case 2: {
        const students = this.props.users.students.map((student) => ({
          id: student.id,
          label: student.firstName + " " + student.lastName,
          icon: "user",
          type: "student",
        }));

        const groups = this.props.users.userGroups.map((group) => ({
          id: group.id,
          label: group.name,
          icon: "users",
          type: "student-group",
        }));

        const allItems = students.concat(groups);
        return (
          <form>
            <DialogRow>
              <DialogRowHeader
                title={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.step2.title",
                  page + "/" + this.totalSteps
                )}
                description={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.step2.description"
                )}
              />
            </DialogRow>
            <DialogRow>
              <AutofillSelector
                identifier="addWorkspaceStudents"
                modifier="add-students"
                loader={this.doStudentSearch}
                placeholder={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.search.students.placeholder"
                )}
                selectedItems={this.state.addStudents}
                searchItems={allItems}
                onDelete={this.deleteStudent}
                onSelect={this.selectStudent}
              />
            </DialogRow>
          </form>
        );
      }
      case 3: {
        const workspaceStudents =
          this.props.currentWorkspace.students &&
          this.props.currentWorkspace.students.results
            ? this.turnStudentsToSelectItems(
                this.props.currentWorkspace.students.results
              )
            : [];
        return (
          <form>
            <DialogRow>
              <DialogRowHeader
                title={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.step3.title",
                  page + "/" + this.totalSteps
                )}
                description={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.step3.description"
                )}
              />
            </DialogRow>
            <DialogRow>
              <DialogRemoveUsers
                users={workspaceStudents}
                placeholder={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.search.workspaceStudents.placeholder"
                )}
                removeUsers={this.state.removeStudents}
                pages={
                  this.state.pages && this.state.pages.students
                    ? this.state.pages.students
                    : 0
                }
                identifier={"workspace" + this.props.workspace.id + "Students"}
                allTabTitle={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.users.tab.workspaceStudents.title"
                )}
                removeTabTitle={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.users.tab.removeWorkspaceStudents.title"
                )}
                onEmptyTitle={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.users.empty"
                )}
                searchValue={
                  this.state.searchValues && this.state.searchValues.students
                    ? this.state.searchValues.students
                    : ""
                }
                searchUsers={this.doWorkspaceStudentSearch}
                changePage={this.goToStudentPage}
                setRemoved={this.toggleStudentRemove}
              />
            </DialogRow>
          </form>
        );
      }
      case 4: {
        const staffSearchItems = this.props.users.staff.map((staff) => ({
          id: staff.id,
          label: staff.firstName + " " + staff.lastName,
          icon: "user",
        }));
        return (
          <form>
            <DialogRow>
              <DialogRowHeader
                title={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.step4.title",
                  page + "/" + this.totalSteps
                )}
                description={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.step4.description"
                )}
              />
            </DialogRow>
            <DialogRow>
              <AutofillSelector
                identifier="addWorkspaceTeachers"
                modifier="add-teachers"
                loader={this.doStaffSearch}
                placeholder={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.search.teachers.placeholder"
                )}
                selectedItems={this.state.addStaff}
                searchItems={staffSearchItems}
                onDelete={this.deleteStaff}
                onSelect={this.selectStaff}
              />
            </DialogRow>
          </form>
        );
      }
      case 5: {
        const workspaceStaff =
          this.props.currentWorkspace.staffMembers &&
          this.props.currentWorkspace.staffMembers.results
            ? this.turnStaffToSelectItems(
                this.props.currentWorkspace.staffMembers.results
              )
            : [];
        return (
          <form>
            <DialogRow>
              <DialogRowHeader
                title={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.step5.title",
                  page + "/" + this.totalSteps
                )}
                description={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.step5.description"
                )}
              />
            </DialogRow>
            <DialogRow>
              <DialogRemoveUsers
                users={workspaceStaff}
                placeholder={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.search.workspaceTeachers.placeholder"
                )}
                removeUsers={this.state.removeStaff}
                pages={
                  this.state.pages && this.state.pages.staff
                    ? this.state.pages.staff
                    : 0
                }
                identifier={"workspace" + this.props.workspace.id + "Staff"}
                allTabTitle={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.users.tab.workspaceTeachers.title"
                )}
                removeTabTitle={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.users.tab.removeWorkspaceTeachers.title"
                )}
                onEmptyTitle={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.users.empty"
                )}
                searchValue={
                  this.state.searchValues && this.state.searchValues.staff
                    ? this.state.searchValues.staff
                    : ""
                }
                searchUsers={this.doWorkspaceStaffSearch}
                changePage={this.goToStaffPage}
                setRemoved={this.toggleStaffRemove}
              />
            </DialogRow>
          </form>
        );
      }
      case 6:
        return (
          <DialogRow modifiers="edit-workspace-summary">
            <DialogRow>
              <DialogRowHeader
                title={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.step6.title",
                  page + "/" + this.totalSteps
                )}
                description={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.step6.description"
                )}
              />
            </DialogRow>
            <DialogRow>
              <DialogRowHeader
                modifiers="new-workspace"
                title={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.summary.label.workspaceName"
                )}
              />
              <DialogRowContent modifiers="summary">
                <div>
                  {this.state.workspaceName}{" "}
                  {this.state.workspaceNameExtension
                    ? "(" + this.state.workspaceNameExtension + ")"
                    : null}
                </div>
              </DialogRowContent>
            </DialogRow>
            <DialogRow>
              <DialogRowHeader
                modifiers="new-workspace"
                title={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.summary.label.dates"
                )}
              />
              <DialogRowContent modifiers="summary-dates">
                <span>
                  {this.state.beginDate
                    ? this.props.i18n.time.format(this.state.beginDate)
                    : this.props.i18n.text.get(
                        "plugin.organization.workspaces.editWorkspace.summary.endDate.empty"
                      )}
                </span>
                <span>
                  {this.state.endDate
                    ? this.props.i18n.time.format(this.state.endDate)
                    : this.props.i18n.text.get(
                        "plugin.organization.workspaces.editWorkspace.summary.endDate.empty"
                      )}
                </span>
              </DialogRowContent>
            </DialogRow>
            <DialogRow>
              <DialogRowHeader
                modifiers="new-workspace"
                title={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.summary.label.addStudents"
                )}
              />
              <DialogRowContent modifiers="summary">
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
                      "plugin.organization.workspaces.editWorkspace.summary.empty.students"
                    )}
                  </div>
                )}
              </DialogRowContent>
            </DialogRow>
            <DialogRow>
              <DialogRowHeader
                modifiers="new-workspace"
                title={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.summary.label.addTeachers"
                )}
              />
              <DialogRowContent modifiers="summary">
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
                      "plugin.organization.workspaces.editWorkspace.summary.empty.teachers"
                    )}
                  </div>
                )}
              </DialogRowContent>
            </DialogRow>
            <DialogRow>
              <DialogRowHeader
                modifiers="new-workspace"
                title={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.summary.label.removeStudents"
                )}
              />
              <DialogRowContent modifiers="summary">
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
                    {this.props.i18n.text.get(
                      "plugin.organization.workspaces.editWorkspace.summary.empty.students"
                    )}
                  </div>
                )}
              </DialogRowContent>
            </DialogRow>
            <DialogRow>
              <DialogRowHeader
                modifiers="new-workspace"
                title={this.props.i18n.text.get(
                  "plugin.organization.workspaces.editWorkspace.summary.label.removeTeachers"
                )}
              />
              <DialogRowContent modifiers="summary">
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
                    {this.props.i18n.text.get(
                      "plugin.organization.workspaces.editWorkspace.summary.empty.teachers"
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

  /**
   * render
   */
  render() {
    /**
     * content
     * @param closePortal closePortal
     */
    const content = (closePortal: () => any) =>
      this.wizardSteps(this.state.currentStep);

    const executeContent = (
      <div>
        <div
          className={`dialog__executer ${
            this.state.workspaceUpdated === true ? "state-DONE" : ""
          }`}
        >
          {this.props.i18n.text.get(
            "plugin.organization.workspaces.editWorkspace.summary.execute.updateWorkspace"
          )}
        </div>
        <div
          className={`dialog__executer ${
            this.state.detailsAdded === true ? "state-DONE" : ""
          }`}
        >
          {this.props.i18n.text.get(
            "plugin.organization.workspaces.editWorkspace.summary.execute.addDetails"
          )}
        </div>
        <div
          className={`dialog__executer ${
            this.state.studentsAdded === true ? "state-DONE" : ""
          }`}
        >
          {this.props.i18n.text.get(
            "plugin.organization.workspaces.editWorkspace.summary.execute.addStudents"
          )}
        </div>
        <div
          className={`dialog__executer ${
            this.state.staffAdded === true ? "state-DONE" : ""
          }`}
        >
          {this.props.i18n.text.get(
            "plugin.organization.workspaces.editWorkspace.summary.execute.addTeachers"
          )}
        </div>
        <div
          className={`dialog__executer ${
            this.state.studentsRemoved === true ? "state-DONE" : ""
          }`}
        >
          {this.props.i18n.text.get(
            "plugin.organization.workspaces.editWorkspace.summary.execute.removeStudents"
          )}
        </div>
        <div
          className={`dialog__executer ${
            this.state.staffRemoved === true ? "state-DONE" : ""
          }`}
        >
          {this.props.i18n.text.get(
            "plugin.organization.workspaces.editWorkspace.summary.execute.removeTeachers"
          )}
        </div>
      </div>
    );

    /**
     * footer
     * @param closePortal closePortal
     */
    const footer = (closePortal: () => any) => (
      <FormWizardActions
        locked={this.state.locked}
        currentStep={this.state.currentStep}
        totalSteps={this.totalSteps}
        executeLabel={this.props.i18n.text.get(
          "plugin.organization.workspaces.editWorkspace.execute.label"
        )}
        nextLabel={this.props.i18n.text.get(
          "plugin.organization.workspaces.editWorkspace.next.label"
        )}
        lastLabel={this.props.i18n.text.get(
          "plugin.organization.workspaces.editWorkspace.last.label"
        )}
        cancelLabel={this.props.i18n.text.get(
          "plugin.organization.workspaces.editWorkspace.cancel.label"
        )}
        executeClick={this.saveWorkspace.bind(this, closePortal)}
        nextClick={this.nextStep.bind(this)}
        lastClick={this.lastStep.bind(this)}
        cancelClick={this.cancelDialog.bind(this, closePortal)}
      />
    );

    return (
      <Dialog
        executing={this.state.executing}
        executeOnOpen={this.setSelectedWorkspace}
        onClose={this.clearComponentState}
        executeContent={executeContent}
        footer={footer}
        modifier="edit-workspace"
        title={this.props.i18n.text.get(
          "plugin.organization.workspaces.editWorkspace.title",
          this.props.workspace.name
        )}
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
    i18n: state.i18n,
    users: state.userSelect,
    currentWorkspace: state.organizationWorkspaces.currentWorkspace,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      loadStaff: loadSelectorStaff,
      loadStudents: loadSelectorStudents,
      loadUserGroups: loadSelectorUserGroups,
      setCurrentOrganizationWorkspace,
      loadCurrentOrganizationWorkspaceStudents,
      loadCurrentOrganizationWorkspaceStaff,
      updateOrganizationWorkspace,
      loadWorkspaces: loadWorkspacesFromServer,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationEditWorkspace);
