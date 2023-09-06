// This file includes actions and actiontypes
// for organization based reducers.

import {
  SetCurrentWorkspaceTriggerType,
  UpdateWorkspaceTriggerType,
} from "./index";
import { Dispatch } from "react-redux";
import {
  WorkspaceType,
  WorkspaceOrganizationFilterListType,
} from "../../reducers/workspaces/index";
import { reuseExistantValue } from "./helpers";
import mApi, { MApiError } from "~/lib/mApi";
import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import promisify from "~/util/promisify";
import actions, { displayNotification } from "~/actions/base/notifications";
import {
  WorkspaceUpdateType,
  WorkspaceEducationFilterListType,
  WorkspaceCurriculumFilterListType,
  WorkspaceStateFilterListType,
  WorkspacesActiveFiltersType,
  WorkspacesPatchType,
  WorkspacesStateType,
  WorkspaceListType,
  UserSelectLoader,
} from "../../reducers/workspaces/index";
import { loadWorkspacesHelper } from "~/actions/workspaces/helpers";
import { WorkspaceDetailsType } from "../../reducers/workspaces/index";
import { SelectItem, CreateWorkspaceStateType } from "./index";
import {
  LoadUsersOfWorkspaceTriggerType,
  LoadMoreWorkspacesFromServerTriggerType,
} from "./index";
import { UserStaffSearchResult } from "~/generated/client/models/UserStaffSearchResult";
import { WorkspaceStudentSearchResult } from "~/generated/client/models/WorkspaceStudentSearchResult";
import MApi from "~/api/api";

/**
 * UPDATE_WORKSPACES_AVAILABLE_FILTERS_ORGANIZATIONS
 */
export type UPDATE_WORKSPACES_AVAILABLE_FILTERS_ORGANIZATIONS =
  SpecificActionType<
    "UPDATE_WORKSPACES_AVAILABLE_FILTERS_ORGANIZATIONS",
    WorkspaceOrganizationFilterListType
  >;
/**
 * UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_EDUCATION_TYPES
 */
export type UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_EDUCATION_TYPES =
  SpecificActionType<
    "UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_EDUCATION_TYPES",
    WorkspaceEducationFilterListType
  >;
/**
 * UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_CURRICULUMS
 */
export type UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_CURRICULUMS =
  SpecificActionType<
    "UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_CURRICULUMS",
    WorkspaceCurriculumFilterListType
  >;

/**
 * UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_STATE_TYPES
 */
export type UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_STATE_TYPES =
  SpecificActionType<
    "UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_STATE_TYPES",
    WorkspaceStateFilterListType
  >;

/**
 * UPDATE_ORGANIZATION_WORKSPACES_ACTIVE_FILTERS
 */
export type UPDATE_ORGANIZATION_WORKSPACES_ACTIVE_FILTERS = SpecificActionType<
  "UPDATE_ORGANIZATION_WORKSPACES_ACTIVE_FILTERS",
  WorkspacesActiveFiltersType
>;

/**
 * UPDATE_ORGANIZATION_WORKSPACES_ALL_PROPS
 */
export type UPDATE_ORGANIZATION_WORKSPACES_ALL_PROPS = SpecificActionType<
  "UPDATE_ORGANIZATION_WORKSPACES_ALL_PROPS",
  WorkspacesPatchType
>;

/**
 * UPDATE_ORGANIZATION_WORKSPACES_STATE
 */
export type UPDATE_ORGANIZATION_WORKSPACES_STATE = SpecificActionType<
  "UPDATE_ORGANIZATION_WORKSPACES_STATE",
  WorkspacesStateType
>;

/**
 * UPDATE_ORGANIZATION_TEMPLATES
 */
export type UPDATE_ORGANIZATION_TEMPLATES = SpecificActionType<
  "UPDATE_ORGANIZATION_TEMPLATES",
  WorkspaceListType
>;

/**
 * UPDATE_ORGANIZATION_SELECTED_WORKSPACE
 */
export type UPDATE_ORGANIZATION_SELECTED_WORKSPACE = SpecificActionType<
  "UPDATE_ORGANIZATION_SELECTED_WORKSPACE",
  WorkspaceUpdateType
>;

/**
 * UPDATE_ORGANIZATION_SELECTED_WORKSPACE_STUDENT_SELECT_STATE
 */
export type UPDATE_ORGANIZATION_SELECTED_WORKSPACE_STUDENT_SELECT_STATE =
  SpecificActionType<
    "UPDATE_ORGANIZATION_SELECTED_WORKSPACE_STUDENT_SELECT_STATE",
    UserSelectLoader
  >;

/**
 * UPDATE_ORGANIZATION_SELECTED_WORKSPACE_STAFF_SELECT_STATE
 */
export type UPDATE_ORGANIZATION_SELECTED_WORKSPACE_STAFF_SELECT_STATE =
  SpecificActionType<
    "UPDATE_ORGANIZATION_SELECTED_WORKSPACE_STAFF_SELECT_STATE",
    UserSelectLoader
  >;

/**
 * LoadUserWorkspaceOrganizationFiltersFromServerTriggerType
 */
export interface LoadUserWorkspaceOrganizationFiltersFromServerTriggerType {
  (
    callback?: (organizations: WorkspaceOrganizationFilterListType) => void
  ): AnyActionType;
}

/**
 * CreateWorkspaceTriggerType
 */
export interface CreateWorkspaceTriggerType {
  (data: {
    id: number;
    name?: string;
    access?: string;
    beginDate?: string;
    endDate?: string;
    nameExtension?: string;
    students: SelectItem[];
    staff: SelectItem[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    progress?: (state?: CreateWorkspaceStateType) => any;
    success: () => void;
    fail: () => void;
  }): AnyActionType;
}

/**
 * setCurrentOrganizationWorkspace
 * @param data data
 */
const setCurrentOrganizationWorkspace: SetCurrentWorkspaceTriggerType =
  function setCurrentOrganizationWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const current = getState().organizationWorkspaces.currentWorkspace;

      try {
        let workspace: WorkspaceType;

        if (current && current.id === data.workspaceId) {
          workspace = { ...current };
        }

        workspace = await reuseExistantValue(true, workspace, () =>
          promisify(
            mApi().workspace.workspaces.cacheClear().read(data.workspaceId),
            "callback"
          )()
        );

        (workspace.details =
          data.loadDetails || (workspace && workspace.details)
            ? await reuseExistantValue(
                true,
                workspace && workspace.details,
                () =>
                  promisify(
                    mApi().workspace.workspaces.details.read(data.workspaceId),
                    "callback"
                  )()
              )
            : null),
          dispatch({
            type: "UPDATE_ORGANIZATION_SELECTED_WORKSPACE",
            payload: workspace,
          });

        data.success && data.success(workspace);
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            getState().i18n.text.get(
              "plugin.workspace.errormessage.workspaceLoadFailed"
            ),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * loadUserWorkspaceOrganizationFiltersFromServer
 * @param callback callback
 */
const loadUserWorkspaceOrganizationFiltersFromServer: LoadUserWorkspaceOrganizationFiltersFromServerTriggerType =
  function loadAvailableOrganizationFiltersFromServer(callback) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const organizations = <WorkspaceOrganizationFilterListType>(
          await promisify(
            mApi().coursepicker.organizations.read(),
            "callback"
          )()
        );
        dispatch({
          type: "UPDATE_WORKSPACES_AVAILABLE_FILTERS_ORGANIZATIONS",
          payload: organizations,
        });
        callback && callback(organizations);
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.coursepicker.errormessage.curriculumFilters"
            ),
            "error"
          )
        );
      }
    };
  };

/**
 * loadCurrentOrganizationWorkspaceStaff
 * @param data data
 */
const loadCurrentOrganizationWorkspaceStaff: LoadUsersOfWorkspaceTriggerType =
  function loadCurrentOrganizationWorkspaceStaff(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "UPDATE_ORGANIZATION_SELECTED_WORKSPACE",
          payload: {
            id: data.workspace.id,
            staffMemberSelect: { state: "LOADING", users: [] },
          },
        });

        const staffMembers = <UserStaffSearchResult>await promisify(
          mApi().user.staffMembers.read({
            ...data.payload,
            workspaceEntityId: data.workspace.id,
          }),
          "callback"
        )();

        const update: WorkspaceUpdateType = {
          staffMembers,
          id: data.workspace.id,
        };

        dispatch({
          type: "UPDATE_ORGANIZATION_SELECTED_WORKSPACE",
          payload: update,
        });

        data.success && data.success(staffMembers);
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.organization.workspaces.notification.selectStaff.error"
            ),
            "error"
          )
        );
        dispatch({
          type: "UPDATE_ORGANIZATION_SELECTED_WORKSPACE",
          payload: { staffMemberSelect: { state: "ERROR" } },
        });
      }
    };
  };

/**
 * loadCurrentOrganizationWorkspaceStudents
 * @param data data
 */
const loadCurrentOrganizationWorkspaceStudents: LoadUsersOfWorkspaceTriggerType =
  function loadCurrentOrganizationWorkspaceStudents(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "UPDATE_ORGANIZATION_SELECTED_WORKSPACE",
          payload: {
            id: data.workspace.id,
            studentsSelect: { state: "LOADING", users: [] },
          },
        });

        const students = <WorkspaceStudentSearchResult>(
          await promisify(
            mApi().workspace.workspaces.students.read(
              data.workspace.id,
              data.payload
            ),
            "callback"
          )()
        );

        const update: WorkspaceUpdateType = {
          students,
          id: data.workspace.id,
        };

        dispatch({
          type: "UPDATE_ORGANIZATION_SELECTED_WORKSPACE",
          payload: update,
        });

        data.success && data.success(students);
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.organization.workspaces.notification.selectStudents.error"
            ),
            "error"
          )
        );
        dispatch({
          type: "UPDATE_ORGANIZATION_SELECTED_WORKSPACE",
          payload: { studentsSelect: { state: "ERROR" } },
        });
      }
    };
  };

/**
 * updateOrganizationWorkspace
 * @param data data
 */
const updateOrganizationWorkspace: UpdateWorkspaceTriggerType =
  function updateOrganizationWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const organizationApi = MApi.getOrganizationApi();

      try {
        const originalWorkspace: WorkspaceType = data.workspace;
        const newDetails = data.update.details;

        // Take off data that'll cramp the update
        delete originalWorkspace["staffMemberSelect"];
        delete originalWorkspace["studentsSelect"];
        delete originalWorkspace["details"];
        delete originalWorkspace["studentActivity"];
        delete originalWorkspace["forumStatistics"];
        delete originalWorkspace["studentAssessments"];
        delete originalWorkspace["activityStatistics"];
        delete originalWorkspace["assessmentRequests"];
        delete originalWorkspace["additionalInfo"];
        delete originalWorkspace["staffMembers"];
        delete originalWorkspace["students"];
        delete originalWorkspace["details"];
        delete originalWorkspace["producers"];
        delete originalWorkspace["contentDescription"];
        delete originalWorkspace["isCourseMember"];
        delete originalWorkspace["journals"];
        delete originalWorkspace["activityLogs"];
        delete originalWorkspace["permissions"];
        delete originalWorkspace["chatStatus"];

        // Delete details from update so it wont fail

        delete data.update["details"];

        if (data.update && Object.keys(data.update).length !== 0) {
          await promisify(
            mApi().workspace.workspaces.update(
              data.workspace.id,
              Object.assign(data.workspace, data.update)
            ),
            "callback"
          )().then(data.progress && data.progress("workspace-update"));
        }

        if (newDetails) {
          await promisify(
            mApi().workspace.workspaces.details.update(
              data.workspace.id,
              newDetails
            ),
            "callback"
          )().then(data.progress && data.progress("add-details"));
        }

        if (data.addStudents.length > 0) {
          const groupIdentifiers: number[] = [];
          const studentIdentifiers: string[] = [];

          data.addStudents.map((student) => {
            if (student.type === "student-group") {
              groupIdentifiers.push(student.id as number);
            }
            if (student.type === "student") {
              studentIdentifiers.push(student.id as string);
            }
          });

          /* await promisify(
            mApi().organizationWorkspaceManagement.workspaces.students.create(
              data.workspace.id,
              {
                studentIdentifiers: studentIdentifiers,
                studentGroupIds: groupIdentifiers,
              }
            ),
            "callback"
          )().then(data.progress && data.progress("add-students")); */

          await organizationApi.addStudentsToWorkspace({
            workspaceId: data.workspace.id,
            addStudentsToWorkspaceRequest: {
              studentIdentifiers: studentIdentifiers,
              studentGroupIds: groupIdentifiers,
            },
          });

          data.progress && data.progress("add-students");
        }

        if (data.addTeachers.length > 0) {
          const staffMemberIdentifiers = data.addTeachers.map(
            (teacher) => teacher.id
          );

          /* await promisify(
            mApi().organizationWorkspaceManagement.workspaces.staff.create(
              data.workspace.id,
              {
                staffMemberIdentifiers: staffMemberIdentifiers,
              }
            ),
            "callback"
          )().then(data.progress && data.progress("add-teachers")); */

          await organizationApi.addStaffToWorkspace({
            workspaceId: data.workspace.id,
            addStaffToWorkspaceRequest: {
              staffIds: staffMemberIdentifiers,
            },
          });

          data.progress && data.progress("add-teachers");
        }

        // if (data.removeStudents.length > 0) {
        //   let studentIdentifiers = data.removeStudents.map(student => student.id);

        // await promisify(mApi().organizationWorkspaceManagement.workspaces.students
        //   .del(data.workspace.id, {
        //     studentIdentifiers: studentIdentifiers
        //   }
        //   ), 'callback')().then(
        //     data.progress && data.progress("remove-students")
        //   );
        // }

        // if (data.removeTeachers.length > 0) {
        //   let staffMemberIdentifiers = data.addTeachers.map(teacher => teacher.id);

        // await promisify(mApi().organizationWorkspaceManagement.workspaces.staff
        //   .del(data.workspace.id, {
        //     staffMemberIdentifiers: staffMemberIdentifiers
        //   }
        //   ), 'callback')().then(
        //     data.progress && data.progress("remove-teachers")
        //   );
        // }

        //  await promisify(setTimeout(() => loadWorkspacesFromServer(data.activeFilters, true), 2000), 'callback')();

        data.progress && data.progress("done");
        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.workspace.management.notification.save.error"
            ),
            "error"
          )
        );

        data.fail && data.fail();
      }
    };
  };

/**
 * loadMoreOrganizationWorkspacesFromServer
 */
const loadMoreOrganizationWorkspacesFromServer: LoadMoreWorkspacesFromServerTriggerType =
  function loadMoreWorkspacesFromServer() {
    return loadWorkspacesHelper.bind(this, null, false, false, true);
  };

/**
 * createWorkspace
 * @param data data
 */
const createWorkspace: CreateWorkspaceTriggerType = function createWorkspace(
  data
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const organizationApi = MApi.getOrganizationApi();

    try {
      const workspace: WorkspaceType = <WorkspaceType>await promisify(
        mApi().workspace.workspaces.create(
          {
            name: data.name,
            nameExtension: data.nameExtension,
            access: data.access,
          },
          {
            sourceWorkspaceEntityId: data.id,
          }
        ),
        "callback"
      )().then(data.progress && data.progress("workspace-create"));

      if (data.beginDate || data.endDate) {
        workspace.details = <WorkspaceDetailsType>(
          await promisify(
            mApi().workspace.workspaces.details.read(workspace.id),
            "callback"
          )()
        );

        workspace.details = <WorkspaceDetailsType>await promisify(
          mApi().workspace.workspaces.details.update(workspace.id, {
            ...workspace.details,
            beginDate: data.beginDate,
            endDate: data.endDate,
          }),
          "callback"
        )().then(data.progress && data.progress("add-details"));
      }

      if (data.students.length > 0) {
        const groupIdentifiers: number[] = [];
        const studentIdentifiers: string[] = [];

        data.students.map((student) => {
          if (student.type === "student-group") {
            groupIdentifiers.push(student.id as number);
          }
          if (student.type === "student") {
            studentIdentifiers.push(student.id as string);
          }
        });

        /* await promisify(
          mApi().organizationWorkspaceManagement.workspaces.students.create(
            workspace.id,
            {
              studentIdentifiers: studentIdentifiers,
              studentGroupIds: groupIdentifiers,
            }
          ),
          "callback"
        )().then(data.progress && data.progress("add-students")); */

        await organizationApi.addStudentsToWorkspace({
          workspaceId: workspace.id,
          addStudentsToWorkspaceRequest: {
            studentIdentifiers: studentIdentifiers,
            studentGroupIds: groupIdentifiers,
          },
        });

        data.progress && data.progress("add-students");
      }

      if (data.staff.length > 0) {
        const staffMemberIdentifiers = data.staff.map((staff) => staff.id);

        /* await promisify(
          mApi().organizationWorkspaceManagement.workspaces.staff.create(
            workspace.id,
            {
              staffMemberIdentifiers: staffMemberIdentifiers,
            }
          ),
          "callback"
        )().then(data.progress && data.progress("add-teachers")); */

        await organizationApi.addStaffToWorkspace({
          workspaceId: workspace.id,
          addStaffToWorkspaceRequest: {
            staffIds: staffMemberIdentifiers,
          },
        });

        data.progress && data.progress("add-teachers");
      }

      data.progress && data.progress("done");
      data.success && data.success();
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(
        displayNotification(
          getState().i18n.text.get(
            "plugin.organization.workspaces.notification.workspace.create.error"
          ),
          "error"
        )
      );

      data.fail && data.fail();
    }
  };
};

export {
  loadMoreOrganizationWorkspacesFromServer,
  updateOrganizationWorkspace,
  setCurrentOrganizationWorkspace,
  loadCurrentOrganizationWorkspaceStaff,
  loadUserWorkspaceOrganizationFiltersFromServer,
  loadCurrentOrganizationWorkspaceStudents,
  createWorkspace,
};
