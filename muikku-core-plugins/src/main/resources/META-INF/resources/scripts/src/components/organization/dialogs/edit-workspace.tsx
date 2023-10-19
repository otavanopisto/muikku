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
import { localize } from "~/locales/i18n";
import { StateType } from "~/reducers";
import { bindActionCreators } from "redux";
import AutofillSelector, {
  UiSelectItem,
} from "~/components/base/input-select-autofill";
import { SelectItem } from "~/actions/workspaces/index";
import { UsersSelectState } from "~/reducers/main-function/users";
import {
  WorkspaceUpdateType,
  WorkspaceDataType,
  WorkspacesActiveFiltersType,
} from "~/reducers/workspaces";
import { TagItem } from "~/components/general/tag-input";
import * as moment from "moment";
import { AnyActionType } from "~/actions/index";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import {
  UserStaff,
  UserStaffSearchResult,
  WorkspaceAccess,
  WorkspaceStudentSearchResult,
} from "~/generated/client";
import { WorkspaceStudent } from "~/generated/client/models/WorkspaceStudent";
import { withTranslation, WithTranslation } from "react-i18next";
import { WorkspaceDetails } from "~/generated/client";

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
interface OrganizationEditWorkspaceProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  users: UsersSelectState;
  workspace: WorkspaceDataType;
  currentWorkspace: WorkspaceDataType;
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
  workspaceAccess: WorkspaceAccess;
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
      success: (
        users: WorkspaceStudentSearchResult | UserStaffSearchResult
      ) => {
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
      success: (workspace: WorkspaceDataType) => {
        this.setState({
          workspaceAccess: workspace.access,
          beginDate: workspace.details.beginDate
            ? localize.getLocalizedMoment(workspace.details.beginDate).toDate()
            : null,
          endDate: workspace.details.endDate
            ? localize.getLocalizedMoment(workspace.details.endDate).toDate()
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
  setWorkspaceAccess(value: WorkspaceAccess) {
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
  cancelDialog(closeDialog: () => void) {
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
  turnStudentsToSelectItems(users: WorkspaceStudent[]) {
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
  turnStaffToSelectItems(users: UserStaff[]) {
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
  saveWorkspace(closeDialog: () => void) {
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
    const { t } = this.props;

    switch (page) {
      case 1:
        return (
          <form>
            <DialogRow>
              <DialogRowHeader
                title={t("labels.editInfo", {
                  ns: "workspace",
                  stepInfo: `${page}/${this.totalSteps}`,
                })}
                description={t("content.mustBePublished", {
                  ns: "workspace",
                })}
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
                label={t("labels.name", { ns: "workspace" })}
                value={this.state.workspaceName}
              ></InputFormElement>
              <InputFormElement
                id="workspaceNameExtension"
                modifiers="dialog-workspace-name-extension"
                updateField={this.setWorkspaceNameExtension}
                name="workspace-name-extension"
                label={t("labels.nameExtension", { ns: "workspace" })}
                value={this.state.workspaceNameExtension}
              ></InputFormElement>
            </DialogRow>
            <DialogRow modifiers="edit-workspace">
              <DateFormElement
                id="workspaceBeginDate"
                maxDate={this.state.endDate}
                updateField={this.handleDateChange.bind(this, "beginDate")}
                locale={outputCorrectDatePickerLocale(localize.language)}
                selected={this.state.beginDate}
                modifiers="organization-workspace-date"
                labels={{
                  label: t("labels.beginDate"),
                }}
                dateFormat="P"
              />
              <DateFormElement
                id="workspaceEndDate"
                minDate={this.state.beginDate}
                updateField={this.handleDateChange.bind(this, "endDate")}
                locale={outputCorrectDatePickerLocale(localize.language)}
                selected={this.state.endDate}
                modifiers="organization-workspace-date"
                labels={{
                  label: t("labels.endDate"),
                }}
                dateFormat="P"
              />
            </DialogRow>
            <DialogRow>
              <fieldset className="form__fieldset">
                <legend className="form__legend">
                  {t("labels.access", { ns: "workspace" })}
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
                      {t("labels.access", {
                        ns: "workspace",
                        context: "membersOnly",
                      })}
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
                      {t("labels.access", {
                        ns: "workspace",
                        context: "loggedInUsers",
                      })}
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
                      {t("labels.access", {
                        ns: "workspace",
                        context: "anyone",
                      })}
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
                title={t("labels.add", {
                  ns: "users",
                  context: "workspaceStudents",
                  stepInfo: `${page}/${this.totalSteps}`,
                })}
                description={t("content.search", {
                  ns: "users",
                  context: "studentsAndGroups",
                })}
              />
            </DialogRow>
            <DialogRow>
              <AutofillSelector
                identifier="addWorkspaceStudents"
                modifier="add-students"
                loader={this.doStudentSearch}
                placeholder={t("labels.search", {
                  ns: "users",
                  context: "students",
                })}
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
                title={t("labels.remove", {
                  ns: "users",
                  context: "workspaceStudents",
                  stepInfo: `${page}/${this.totalSteps}`,
                })}
                description={t("content.searchToRemove", {
                  ns: "users",
                  context: "students",
                })}
              />
            </DialogRow>
            <DialogRow>
              <DialogRemoveUsers
                users={workspaceStudents}
                placeholder={t("labels.search", {
                  ns: "users",
                  context: "workspaceStudents",
                })}
                removeUsers={this.state.removeStudents}
                pages={
                  this.state.pages && this.state.pages.students
                    ? this.state.pages.students
                    : 0
                }
                identifier={"workspace" + this.props.workspace.id + "Students"}
                allTabTitle={t("labels.workspaceStudents", {
                  ns: "users",
                })}
                removeTabTitle={t("labels.studentsToRemove", {
                  ns: "users",
                })}
                onEmptyTitle={t("content.empty", {
                  ns: "users",
                  context: "students",
                })}
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
                title={t("labels.add", {
                  ns: "users",
                  context: "workspaceTeachers",
                  stepInfo: `${page}/${this.totalSteps}`,
                })}
                description={t("content.search", {
                  ns: "users",
                  context: "staff",
                })}
              />
            </DialogRow>
            <DialogRow>
              <AutofillSelector
                identifier="addWorkspaceTeachers"
                modifier="add-teachers"
                loader={this.doStaffSearch}
                placeholder={t("labels.search", {
                  ns: "users",
                  context: "workspaceTeachers",
                })}
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
                title={t("labels.remove", {
                  ns: "users",
                  context: "workspaceTeachers",
                  stepInfo: `${page}/${this.totalSteps}`,
                })}
                description={t("content.searchToRemove", {
                  ns: "users",
                  context: "teachers",
                })}
              />
            </DialogRow>
            <DialogRow>
              <DialogRemoveUsers
                users={workspaceStaff}
                placeholder={t("labels.search", {
                  ns: "users",
                  context: "teachers",
                })}
                removeUsers={this.state.removeStaff}
                pages={
                  this.state.pages && this.state.pages.staff
                    ? this.state.pages.staff
                    : 0
                }
                identifier={"workspace" + this.props.workspace.id + "Staff"}
                allTabTitle={t("labels.teacher", {
                  ns: "users",
                  context: "workspace",
                  count: 0,
                })}
                removeTabTitle={t("labels.teachersToRemove", {
                  ns: "users",
                })}
                onEmptyTitle={t("content.empty", {
                  ns: "users",
                  context: "teachers",
                })}
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
                title={t("labels.name", { ns: "workspace" })}
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
                title={t("labels.beginAndEndDate", { ns: "workspace" })}
              />
              <DialogRowContent modifiers="summary-dates">
                <span>
                  {this.state.beginDate
                    ? localize.date(this.state.beginDate)
                    : t("content.empty", {
                        ns: "workspace",
                        context: "beginDate",
                      })}
                </span>
                <span>
                  {this.state.endDate
                    ? localize.date(this.state.endDate)
                    : t("content.empty", {
                        ns: "workspace",
                        context: "endDate",
                      })}
                </span>
              </DialogRowContent>
            </DialogRow>
            <DialogRow>
              <DialogRowHeader
                modifiers="new-workspace"
                title={t("labels.studentsToAdd", { ns: "users" })}
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
                    {t("content.noneSelected", {
                      ns: "users",
                    })}
                  </div>
                )}
              </DialogRowContent>
            </DialogRow>
            <DialogRow>
              <DialogRowHeader
                modifiers="new-workspace"
                title={t("labels.teachersToAdd", { ns: "users" })}
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
                    {t("content.noneSelected", {
                      ns: "users",
                      context: "teacher",
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
                    {t("content.noneSelected", {
                      ns: "users",
                    })}
                  </div>
                )}
              </DialogRowContent>
            </DialogRow>
            <DialogRow>
              <DialogRowHeader
                modifiers="new-workspace"
                title={t("labels.teachersToRemove", { ns: "users" })}
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
                    {t("content.noneSelected", {
                      ns: "users",
                      context: "teachers",
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
            this.state.workspaceUpdated === true ? "state-DONE" : ""
          }`}
        >
          {t("labels.updating", { ns: "workspace" })}
        </div>
        <div
          className={`dialog__executer ${
            this.state.detailsAdded === true ? "state-DONE" : ""
          }`}
        >
          {t("labels.addingDetails", { ns: "workspace" })}
        </div>
        <div
          className={`dialog__executer ${
            this.state.studentsAdded === true ? "state-DONE" : ""
          }`}
        >
          {t("labels.adding", {
            ns: "users",
            context: "students",
          })}
        </div>
        <div
          className={`dialog__executer ${
            this.state.staffAdded === true ? "state-DONE" : ""
          }`}
        >
          {t("labels.adding", {
            ns: "users",
            context: "teachers",
          })}
        </div>
        <div
          className={`dialog__executer ${
            this.state.studentsRemoved === true ? "state-DONE" : ""
          }`}
        >
          {t("labels.removing", {
            ns: "users",
            context: "students",
          })}
        </div>
        <div
          className={`dialog__executer ${
            this.state.staffRemoved === true ? "state-DONE" : ""
          }`}
        >
          {t("labels.removing", {
            ns: "users",
            context: "teachers",
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
        executeLabel={t("actions.edit", { ns: "workspace" })}
        nextLabel={t("actions.next")}
        lastLabel={t("actions.previous")}
        cancelLabel={t("actions.cancel")}
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
        title={t("labels.edit", {
          ns: "workspace",
          workspaceName: this.props.workspace.name,
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

export default withTranslation(["users", "workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(OrganizationEditWorkspace)
);
