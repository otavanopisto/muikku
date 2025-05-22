import * as React from "react";
import { connect } from "react-redux";
import Dialog, {
  DialogRow,
  DialogRowHeader,
  DialogRowContent,
} from "~/components/general/dialog";
import {
  FormWizardActions,
  InputFormElement,
  SearchFormElement,
  DateFormElement,
} from "~/components/general/form-element";
import {
  loadSelectorStaff,
  loadSelectorStudents,
  LoadUsersTriggerType,
  loadSelectorUserGroups,
} from "~/actions/main-function/users";
import {
  CreateWorkspaceStateType,
  loadTemplatesFromServer,
  LoadTemplatesFromServerTriggerType,
  loadWorkspacesFromServer,
  LoadWorkspacesFromServerTriggerType,
} from "~/actions/workspaces";
import {
  createWorkspace,
  CreateWorkspaceTriggerType,
} from "~/actions/workspaces/organization";
import { StateType } from "~/reducers";
import { bindActionCreators } from "redux";
import ApplicationList, {
  ApplicationListItemContentWrapper,
  ApplicationListItem,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import AutofillSelector, {
  UiSelectItem,
} from "~/components/base/input-select-autofill";
import { SelectItem } from "~/actions/workspaces/index";
import { UsersSelectState } from "~/reducers/main-function/users";
import {
  CreateWorkspaceType,
  WorkspaceDataType,
  WorkspacesActiveFiltersType,
} from "~/reducers/workspaces";
import "~/sass/elements/course.scss";
import { TagItem } from "~/components/general/tag-input";
import { withTranslation, WithTranslation } from "react-i18next";
import { localize } from "~/locales/i18n";
import { WorkspaceAccess } from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * ValidationType
 */
interface ValidationType {
  templateSelected: boolean;
  nameValid: number;
  nameExtensionValid: 2;
}

/**
 * OrganizationNewWorkspaceProps
 */
interface OrganizationNewWorkspaceProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  data?: CreateWorkspaceType;
  users: UsersSelectState;
  templates: WorkspaceDataType[];
  activeFilters: WorkspacesActiveFiltersType;
  loadStudents: LoadUsersTriggerType;
  loadStaff: LoadUsersTriggerType;
  loadUserGroups: LoadUsersTriggerType;
  loadTemplates: LoadTemplatesFromServerTriggerType;
  createWorkspace: CreateWorkspaceTriggerType;
  loadWorkspaces: LoadWorkspacesFromServerTriggerType;
}

/**
 * OrganizationNewWorkspaceState
 */
interface OrganizationNewWorkspaceState {
  template: SelectItem;
  templateSearch: string;
  workspaceName: string;
  workspaceAccess: WorkspaceAccess;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  beginDate: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endDate: any;
  workspaceNameExtension: string;
  locked: boolean;
  currentStep: number;
  selectedStaff: UiSelectItem[];
  selectedStudents: UiSelectItem[];
  executing: boolean;
  validation: ValidationType;
  workspaceCreated: boolean;
  studentsAdded: boolean;
  detailsAdded: boolean;
  staffAdded: boolean;
}

/**
 * OrganizationNewWorkspace
 */
class OrganizationNewWorkspace extends React.Component<
  OrganizationNewWorkspaceProps,
  OrganizationNewWorkspaceState
> {
  private totalSteps: number;

  /**
   * constructor
   * @param props props
   */
  constructor(props: OrganizationNewWorkspaceProps) {
    super(props);
    this.totalSteps = 5;
    this.state = {
      workspaceName: "",
      templateSearch: "",
      workspaceAccess: "MEMBERS_ONLY",
      workspaceNameExtension: "",
      beginDate: null,
      endDate: null,
      template: {
        id: null,
        label: "",
      },
      selectedStaff: [],
      selectedStudents: [],
      locked: true,
      currentStep: 1,
      executing: false,
      validation: {
        templateSelected: false,
        nameValid: 2,
        nameExtensionValid: 2,
      },
      workspaceCreated: false,
      studentsAdded: false,
      detailsAdded: false,
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
    this.getLocaledDate = this.getLocaledDate.bind(this);
  }

  /**
   * doTemplateSearch
   * @param value value
   */
  doTemplateSearch(value: string) {
    this.props.loadTemplates(value);
    this.setState({ templateSearch: value });
  }

  /**
   * selectTemplate
   * @param e e
   */
  selectTemplate(e: React.ChangeEvent<HTMLInputElement>) {
    const validation: ValidationType = Object.assign(this.state.validation, {
      templateSelected: true,
    });
    this.setState({
      validation,
      locked: false,
      template: { id: parseInt(e.target.value), label: e.target.name },
      workspaceName: e.target.name,
    });
  }

  /**
   * selectTemplateMobile
   * @param template template
   */
  selectTemplateMobile = (template: WorkspaceDataType) => {
    const validation: ValidationType = Object.assign(this.state.validation, {
      templateSelected: true,
    });
    this.setState({
      validation,
      locked: false,
      template: { id: template.id, label: template.name },
      workspaceName: template.name,
    });
  };

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
    const newState = this.state.selectedStudents.concat(student);
    this.setState({ selectedStudents: newState });
  }

  /**
   * deleteStudent
   * @param student student
   */
  deleteStudent(student: SelectItem) {
    const newState = this.state.selectedStudents.filter(
      (selectedItem) => selectedItem.id !== student.id
    );
    this.setState({ selectedStudents: newState });
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
    const newState = this.state.selectedStaff.concat(staff);
    this.setState({ selectedStaff: newState });
  }

  /**
   * deleteStaff
   * @param staff staff
   */
  deleteStaff(staff: SelectItem) {
    const newState = this.state.selectedStaff.filter(
      (selectedItem) => selectedItem.id !== staff.id
    );
    this.setState({ selectedStaff: newState });
  }

  /**
   * setSelectedStudents
   * @param selectedStudents selectedStudents
   */
  setSelectedStudents(selectedStudents: Array<SelectItem>) {
    this.setState({ selectedStudents });
  }

  /**
   * setWorkspaceName
   * @param value value
   */
  setWorkspaceName(value: string) {
    this.setState({ locked: false, workspaceName: value });
  }

  /**
   * setWorkspaceAccess
   * @param value value
   */
  setWorkspaceAccess(value: WorkspaceAccess) {
    this.setState({ workspaceAccess: value });
  }

  /**
   * setWorkspaceNameExtension
   * @param value value
   */
  setWorkspaceNameExtension(value: string) {
    this.setState({ workspaceNameExtension: value });
  }

  /**
   * handleDateChange
   * @param dateKey dateKey
   * @param newDate newDate
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleDateChange(dateKey: string, newDate: any) {
    this.setState({ [dateKey]: newDate } as Pick<
      OrganizationNewWorkspaceState,
      keyof OrganizationNewWorkspaceState
    >);
  }

  /**
   * clearComponentState
   */
  clearComponentState() {
    this.setState({
      template: null,
      validation: {
        templateSelected: false,
        nameValid: 2,
        nameExtensionValid: 2,
      },
      locked: true,
      beginDate: null,
      endDate: null,
      workspaceName: "",
      workspaceNameExtension: "",
      executing: false,
      currentStep: 1,
      selectedStaff: [],
      selectedStudents: [],
      workspaceCreated: false,
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
    if (this.state.validation.templateSelected === false) {
      this.setState({ locked: true });
    } else if (this.state.workspaceName === "") {
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
   * getLocaledDate
   * @param date date
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getLocaledDate(date: any) {
    return localize.getLocalizedMoment(date).format("L");
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

    this.props.createWorkspace({
      id: this.state.template.id as number,
      name: this.state.workspaceName,
      nameExtension: this.state.workspaceNameExtension,
      beginDate: this.state.beginDate,
      endDate: this.state.endDate,
      access: this.state.workspaceAccess,
      students: this.state.selectedStudents,
      staff: this.state.selectedStaff,
      /**
       * progress
       * @param state state
       */
      progress: (state: CreateWorkspaceStateType) => {
        if (state === "workspace-create") {
          this.setState({
            workspaceCreated: true,
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
                title={t("labels.pickTemplate", {
                  ns: "workspace",
                  stepInfo: `${page}/${this.totalSteps}`,
                })}
                description={t("content.selectTemplate", {
                  ns: "workspace",
                })}
              />
            </DialogRow>
            <DialogRow modifiers="new-workspace">
              <SearchFormElement
                value={this.state.templateSearch}
                id="OrganizationTemplateSearch"
                placeholder={t("labels.searchTemplates", {
                  ns: "workspace",
                })}
                name="template-search"
                updateField={this.doTemplateSearch}
              ></SearchFormElement>
            </DialogRow>
            <DialogRow modifiers="new-workspace">
              <ApplicationList modifiers="workspace-templates">
                {this.props.templates.length > 0 ? (
                  this.props.templates.map((template: WorkspaceDataType) => {
                    const templateSelected =
                      this.state.template &&
                      this.state.template.id === template.id;
                    const aside = (
                      <div className="form-element form-element--item-selection-container">
                        <label
                          htmlFor={`messageSelect-` + template.id}
                          className="visually-hidden"
                        >
                          {t("wcag.workspaceTemplateSelect", {
                            ns: "organization",
                          })}
                        </label>
                        <input
                          key={template.id}
                          type="radio"
                          id={`messageSelect-` + template.id}
                          checked={templateSelected}
                          onChange={this.selectTemplate}
                          name={template.name}
                          value={template.id}
                        />
                      </div>
                    );
                    return (
                      <ApplicationListItem
                        onClick={this.selectTemplateMobile.bind(this, template)}
                        className={`course ${
                          templateSelected ? "selected" : ""
                        }`}
                        key={template.id}
                      >
                        <ApplicationListItemContentWrapper
                          asideModifiers="course"
                          aside={aside}
                        >
                          <ApplicationListItemHeader modifiers="course">
                            <span className="application-list__header-primary">
                              {template.name}
                            </span>
                            <span className="application-list__header-secondary">
                              {template.educationTypeName}
                            </span>
                          </ApplicationListItemHeader>
                        </ApplicationListItemContentWrapper>
                      </ApplicationListItem>
                    );
                  })
                ) : (
                  <div className="empty">
                    <span>
                      {t("content.notFound", {
                        ns: "workspace",
                        context: "templates",
                      })}
                    </span>
                  </div>
                )}
              </ApplicationList>
            </DialogRow>
          </form>
        );
      case 2:
        return (
          <form>
            <DialogRow>
              <DialogRowHeader
                title={t("labels.setDetails", {
                  ns: "workspace",
                  stepInfo: `${page}/${this.totalSteps}`,
                })}
                description={t("content.addDetails", {
                  ns: "workspace",
                })}
              />
            </DialogRow>
            <DialogRow modifiers="new-workspace">
              <InputFormElement
                id="workspaceName"
                modifiers="workspace-name"
                mandatory={true}
                updateField={this.setWorkspaceName}
                valid={this.state.validation.nameValid}
                name="workspaceName"
                label={t("labels.name", {
                  ns: "workspace",
                })}
                value={this.state.workspaceName}
              ></InputFormElement>
              <InputFormElement
                id="workspaceExtension"
                modifiers="dialog-workspace-name-extension"
                updateField={this.setWorkspaceNameExtension}
                valid={this.state.validation.nameExtensionValid}
                name="workspaceNameExtension"
                label={t("labels.nameExtension", {
                  ns: "workspace",
                })}
                value={this.state.workspaceNameExtension}
              ></InputFormElement>
            </DialogRow>
            <DialogRow modifiers="new-workspace">
              <DateFormElement
                id="workspaceBeginDate"
                modifiers="organization-workspace-date"
                maxDate={this.state.endDate}
                updateField={this.handleDateChange.bind(this, "beginDate")}
                locale={localize.language}
                selected={this.state.beginDate}
                labels={{
                  label: t("labels.beginDate"),
                }}
              />
              <DateFormElement
                id="workspaceEndDate"
                modifiers="organization-workspace-date"
                minDate={this.state.beginDate}
                updateField={this.handleDateChange.bind(this, "endDate")}
                locale={localize.language}
                selected={this.state.endDate}
                labels={{
                  label: t("labels.endDate"),
                }}
              />
            </DialogRow>
            <DialogRow modifiers="new-workspace">
              <fieldset className="form__fieldset">
                <legend className="form__legend">
                  {t("labels.access", {
                    ns: "workspace",
                  })}
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
      case 3: {
        const students: UiSelectItem[] = this.props.users.students.map(
          (student) => ({
            id: student.id,
            label: student.firstName + " " + student.lastName,
            icon: "user",
            type: "student",
          })
        );

        const groups: UiSelectItem[] = this.props.users.userGroups.map(
          (group) => ({
            id: group.id,
            label: group.name,
            icon: "users",
            type: "student-group",
          })
        );

        const allItems = students.concat(groups);

        return (
          <DialogRow>
            <DialogRow>
              <DialogRowHeader
                title={t("labels.pick", {
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
                identifier="addNewWorkspaceStudents"
                modifier="add-students"
                loader={this.doStudentSearch}
                placeholder={t("labels.search", {
                  ns: "users",
                  context: "students",
                })}
                selectedItems={this.state.selectedStudents}
                searchItems={allItems}
                onDelete={this.deleteStudent}
                onSelect={this.selectStudent}
              />
            </DialogRow>
          </DialogRow>
        );
      }
      case 4: {
        const staffSearchItems: UiSelectItem[] = this.props.users.staff.map(
          (staff) => ({
            id: staff.id,
            label: staff.firstName + " " + staff.lastName,
            icon: "user",
            type: "staff",
          })
        );

        return (
          <DialogRow>
            <DialogRow>
              <DialogRowHeader
                title={t("labels.pick", {
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
                identifier="addNewWorkspaceTeachers"
                modifier="add-teachers"
                loader={this.doStaffSearch}
                placeholder={t("labels.search", {
                  ns: "users",
                  context: "teachers",
                })}
                selectedItems={this.state.selectedStaff}
                searchItems={staffSearchItems}
                onDelete={this.deleteStaff}
                onSelect={this.selectStaff}
              />
            </DialogRow>
          </DialogRow>
        );
      }
      case 5:
        return (
          <DialogRow modifiers="new-workspace-summary">
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
                title={t("labels.selectedTemplate", {
                  ns: "workspace",
                })}
              />
              <DialogRowContent modifiers="summary">
                {this.state.template.label &&
                this.state.template.label !== "" ? (
                  <div>{this.state.template.label}</div>
                ) : (
                  <div>
                    {t("content.noneSelected", {
                      ns: "workspace",
                    })}
                  </div>
                )}
              </DialogRowContent>
            </DialogRow>
            <DialogRow>
              <DialogRowHeader
                modifiers="new-workspace"
                title={t("labels.nameOfNewWorkspace", {
                  ns: "workspace",
                })}
              />
              <DialogRowContent modifiers="summary">
                {this.state.workspaceName !== "" ? (
                  <div>
                    {this.state.workspaceName}{" "}
                    {this.state.workspaceNameExtension
                      ? "(" + this.state.workspaceNameExtension + ")"
                      : null}
                  </div>
                ) : (
                  <div>
                    {t("content.notNamed", {
                      ns: "workspace",
                    })}
                  </div>
                )}
              </DialogRowContent>
            </DialogRow>
            <DialogRow>
              <DialogRowHeader
                modifiers="new-workspace"
                title={t("labels.beginAndEndDate", {
                  ns: "workspace",
                })}
              />
              <DialogRowContent modifiers="summary-dates">
                <span>
                  {this.state.beginDate
                    ? this.getLocaledDate(this.state.beginDate)
                    : t("content.empty", {
                        ns: "workspace",
                        context: "beginDate",
                      })}
                </span>
                <span>
                  {this.state.endDate
                    ? this.getLocaledDate(this.state.endDate)
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
                title={t("labels.chosenStudents", {
                  ns: "users",
                })}
              />
              <DialogRowContent modifiers="summary">
                {this.state.selectedStudents.length > 0 ? (
                  this.state.selectedStudents.map((student) => {
                    const tag = {
                      node: student.label,
                      value: student,
                      icon: student.icon,
                    };
                    return (
                      <TagItem
                        modifier="selected-recipient"
                        key={"selectedStudent" + student.id}
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
                title={t("labels.chosenTeachers", {
                  ns: "users",
                })}
              />
              <DialogRowContent modifiers="summary">
                {this.state.selectedStaff.length > 0 ? (
                  this.state.selectedStaff.map((staff) => {
                    const tag = {
                      node: staff.label,
                      value: staff,
                      icon: staff.icon,
                    };
                    return (
                      <TagItem
                        modifier="selected-recipient"
                        key={"selectStaff" + staff.id}
                        tag={tag}
                        onDelete={this.deleteStaff}
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
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) =>
      this.wizardSteps(this.state.currentStep);

    const executeContent = (
      <div>
        <div
          className={`dialog__executer ${
            this.state.workspaceCreated === true ? "state-DONE" : ""
          }`}
        >
          {t("labels.creating", {
            ns: "workspace",
          })}
        </div>
        <div
          className={`dialog__executer ${
            this.state.detailsAdded === true ? "state-DONE" : ""
          }`}
        >
          {t("labels.addingDetails", {
            ns: "workspace",
          })}
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
          ns: "workspace",
          context: "workspace",
        })}
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
        executeOnOpen={this.props.loadTemplates}
        onClose={this.clearComponentState}
        executeContent={executeContent}
        footer={footer}
        modifier="new-workspace"
        title={t("actions.create", {
          ns: "workspace",
          context: "workspace",
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
    templates: state.organizationWorkspaces.templateWorkspaces,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    {
      loadStaff: loadSelectorStaff,
      loadStudents: loadSelectorStudents,
      loadUserGroups: loadSelectorUserGroups,
      loadTemplates: loadTemplatesFromServer,
      createWorkspace,
      loadWorkspaces: loadWorkspacesFromServer,
    },
    dispatch
  );
}

export default withTranslation([
  "organization",
  "workspace",
  "users",
  "common",
])(connect(mapStateToProps, mapDispatchToProps)(OrganizationNewWorkspace));
