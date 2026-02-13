import { AnyActionType, SpecificActionType } from "~/actions";
import {
  ContactGroupNames,
  DependantActivityGraphData,
  ReducerStateType,
} from "~/reducers/main-function/guardian";
import {
  ActivityLogEntry,
  ActivityLogType,
  CourseMatrix,
  GuidanceCounselorContact,
  PedagogyFormAccess,
  StudyActivity,
  UserGuardiansDependant,
  UserGuardiansDependantWorkspace,
  UserWithSchoolData,
} from "~/generated/client/models";
import notificationActions from "~/actions/base/notifications";
import { Action, Dispatch } from "redux";
import MApi, { isMApiError } from "~/api/api";
import { StateType } from "~/reducers";
import i18n from "~/locales/i18n";
import {
  CurriculumConfig,
  getCurriculumConfig,
} from "~/util/curriculum-config";
import { WorkspaceDataType } from "~/reducers/workspaces";

const meApi = MApi.getMeApi();
const hopsApi = MApi.getHopsApi();
const userApi = MApi.getUserApi();
const activitylogsApi = MApi.getActivitylogsApi();
const workspaceApi = MApi.getWorkspaceApi();
const evaluationApi = MApi.getEvaluationApi();
const workspaceDiscussionApi = MApi.getWorkspaceDiscussionApi();
const pedagogyApi = MApi.getPedagogyApi();

// GUARDIAN DEPENDANTS ACTIONS
export type GUARDIAN_UPDATE_DEPENDANTS = SpecificActionType<
  "GUARDIAN_UPDATE_DEPENDANTS",
  UserGuardiansDependant[]
>;

export type GUARDIAN_UPDATE_DEPENDANTS_STATUS = SpecificActionType<
  "GUARDIAN_UPDATE_DEPENDANTS_STATUS",
  ReducerStateType
>;

// GUARDIAN DEPENDANT WORKSPACES ACTIONS
export type GUARDIAN_UPDATE_WORKSPACES_BY_DEPENDANT_IDENTIFIER_STATUS =
  SpecificActionType<
    "GUARDIAN_UPDATE_WORKSPACES_BY_DEPENDANT_IDENTIFIER_STATUS",
    {
      identifier: string;
      status: ReducerStateType;
    }
  >;

export type GUARDIAN_UPDATE_WORKSPACES_BY_DEPENDANT_IDENTIFIER_WORKSPACES =
  SpecificActionType<
    "GUARDIAN_UPDATE_WORKSPACES_BY_DEPENDANT_IDENTIFIER_WORKSPACES",
    {
      identifier: string;
      workspaces: UserGuardiansDependantWorkspace[];
    }
  >;

// GUARDIAN CURRENT DEPENDANT ACTIONS
export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_IDENTIFIER = SpecificActionType<
  "GUARDIAN_UPDATE_CURRENT_DEPENDANT_IDENTIFIER",
  string
>;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_INFO_STATUS = SpecificActionType<
  "GUARDIAN_UPDATE_CURRENT_DEPENDANT_INFO_STATUS",
  ReducerStateType
>;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_INFO = SpecificActionType<
  "GUARDIAN_UPDATE_CURRENT_DEPENDANT_INFO",
  UserWithSchoolData
>;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_CURRICULUM_CONFIG_STATUS =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CURRICULUM_CONFIG_STATUS",
    ReducerStateType
  >;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_CURRICULUM_CONFIG =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CURRICULUM_CONFIG",
    CurriculumConfig
  >;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_STUDY_ACTIVITY_STATUS =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_STUDY_ACTIVITY_STATUS",
    ReducerStateType
  >;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_STUDY_ACTIVITY =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_STUDY_ACTIVITY",
    StudyActivity
  >;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_COURSE_MATRIX_STATUS =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_COURSE_MATRIX_STATUS",
    ReducerStateType
  >;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_COURSE_MATRIX =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_COURSE_MATRIX",
    CourseMatrix
  >;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_CONTACT_GROUPS_STATUS =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CONTACT_GROUPS_STATUS",
    {
      groupName: ContactGroupNames;
      status: ReducerStateType;
    }
  >;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_CONTACT_GROUPS =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CONTACT_GROUPS",
    {
      groupName: ContactGroupNames;
      list: GuidanceCounselorContact[];
    }
  >;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_ACTIVITY_GRAPH_DATA_STATUS =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_ACTIVITY_GRAPH_DATA_STATUS",
    ReducerStateType
  >;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_ACTIVITY_GRAPH_DATA =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_ACTIVITY_GRAPH_DATA",
    DependantActivityGraphData
  >;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_PEDAGOGY_FORM_ACCESS_STATUS =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_PEDAGOGY_FORM_ACCESS_STATUS",
    ReducerStateType
  >;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_PEDAGOGY_FORM_ACCESS =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_PEDAGOGY_FORM_ACCESS",
    PedagogyFormAccess
  >;

export type GUARDIAN_RESET_CURRENT_DEPENDANT_STATE = SpecificActionType<
  "GUARDIAN_RESET_CURRENT_DEPENDANT_STATE",
  undefined
>;

/**
 * LoadDependantsTriggerType
 */
export interface LoadDependantsTriggerType {
  (): AnyActionType;
}

/**
 * LoadDependantWorkspacesTriggerType
 */
export interface LoadDependantWorkspacesTriggerType {
  (dependantIdentifier: string): AnyActionType;
}

/**
 * LoadCurrentDependantEssentialsTriggerType
 */
export interface LoadCurrentDependantStudyActivityTriggerType {
  (dependantIdentifier: string): AnyActionType;
}

/**
 * LoadCurrentDependantCourseMatrixTriggerType
 */
export interface LoadCurrentDependantCourseMatrixTriggerType {
  (dependantIdentifier: string): AnyActionType;
}

/**
 * LoadCurrentDependantStudentDetailsTriggerType
 */
export interface LoadCurrentDependantStudentInfoTriggerType {
  (dependantIdentifier: string): AnyActionType;
}

/**
 * LoadCurrentDependantContactGroupsTriggerType
 */
export interface LoadCurrentDependantContactGroupsTriggerType {
  (groupName: ContactGroupNames, dependantIdentifier: string): AnyActionType;
}

/**
 * LoadCurrentDependantActivityGraphDataTriggerType
 */
export interface LoadCurrentDependantActivityGraphDataTriggerType {
  (dependantIdentifier: string): AnyActionType;
}

/**
 * LoadCurrentDependantPedagogyFormAccessTriggerType
 */
export interface LoadCurrentDependantPedagogyFormAccessTriggerType {
  (dependantIdentifier: string): AnyActionType;
}

/**
 * ResetCurrentDependantStateTriggerType
 */
export interface ResetCurrentDependantStateTriggerType {
  (): AnyActionType;
}

/**
 * Thunk function to load dependants
 * @returns Thunk function to load dependants
 */
const loadDependants: LoadDependantsTriggerType = function loadDependants() {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    try {
      dispatch({
        type: "GUARDIAN_UPDATE_DEPENDANTS_STATUS",
        payload: "LOADING",
      });

      const dependants = await meApi.getGuardiansDependents();

      dispatch({
        type: "GUARDIAN_UPDATE_DEPENDANTS",
        payload: dependants,
      });

      dispatch({
        type: "GUARDIAN_UPDATE_DEPENDANTS_STATUS",
        payload: "READY",
      });
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.loadError", {
            ns: "users",
            context: "dependants",
          }),
          "error"
        )
      );
      dispatch({
        type: "DEPENDANTS_STATUS_UPDATE",
        payload: "ERROR",
      });
    }
  };
};

/**
 * Thunk function to load dependant workspaces
 * @param dependantIdentifier dependantIdentifier
 * @returns Thunk function to load dependant workspaces
 */
const loadDependantWorkspaces: LoadDependantWorkspacesTriggerType =
  function loadDependantWorkspaces(dependantIdentifier: string) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      let dependantWorkspaces =
        state.guardian.workspacesByDependantIdentifier[dependantIdentifier];

      // If the dependant workspaces are not found, we initialize them
      // with empty workspaces and IDLE status
      if (!dependantWorkspaces) {
        dependantWorkspaces = {
          workspaces: [],
          status: "IDLE",
        };
      }

      if (
        dependantWorkspaces.status === "READY" ||
        dependantWorkspaces.status === "LOADING"
      ) {
        return;
      }

      try {
        dispatch({
          type: "GUARDIAN_UPDATE_WORKSPACES_BY_DEPENDANT_IDENTIFIER_STATUS",
          payload: {
            identifier: dependantIdentifier,
            status: "LOADING",
          },
        });

        const workspaces = await meApi.getGuardiansDependentsActiveWorkspaces({
          studentIdentifier: dependantIdentifier,
        });

        dispatch({
          type: "GUARDIAN_UPDATE_WORKSPACES_BY_DEPENDANT_IDENTIFIER_WORKSPACES",
          payload: {
            identifier: dependantIdentifier,
            workspaces: workspaces,
          },
        });

        dispatch({
          type: "GUARDIAN_UPDATE_WORKSPACES_BY_DEPENDANT_IDENTIFIER_STATUS",
          payload: {
            identifier: dependantIdentifier,
            status: "READY",
          },
        });
      } catch (error) {
        if (!isMApiError(error)) {
          throw error;
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "users",
              context: "dependants",
            }),
            "error"
          )
        );
        dispatch({
          type: "GUARDIAN_UPDATE_WORKSPACES_BY_DEPENDANT_IDENTIFIER_STATUS",
          payload: {
            identifier: dependantIdentifier,
            status: "ERROR",
          },
        });
      }
    };
  };

/**
 * Thunk function to load current dependant study activity
 * @param dependantIdentifier dependantIdentifier
 * @returns Thunk function to load current dependant study activity
 */
const loadCurrentDependantStudyActivity: LoadCurrentDependantStudyActivityTriggerType =
  function loadCurrentDependantStudyActivity(dependantIdentifier: string) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const currentDependantIdentifier =
        state.guardian.currentDependantIdentifier;

      if (!currentDependantIdentifier) {
        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_IDENTIFIER",
          payload: dependantIdentifier,
        });
      }

      if (
        state.guardian.currentDependant.dependantStudyActivityStatus === "READY"
      ) {
        return;
      }

      try {
        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_STUDY_ACTIVITY_STATUS",
          payload: "LOADING",
        });

        const studyActivity = await hopsApi.getStudyActivity({
          studentIdentifier: dependantIdentifier,
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_STUDY_ACTIVITY",
          payload: studyActivity,
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_STUDY_ACTIVITY_STATUS",
          payload: "READY",
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_STUDY_ACTIVITY_STATUS",
          payload: "ERROR",
        });
      }
    };
  };

/**
 * Thunk function to load current dependant course matrix
 * @param dependantIdentifier dependantIdentifier
 * @returns Thunk function to load current dependant course matrix
 */
const loadCurrentDependantCourseMatrix: LoadCurrentDependantCourseMatrixTriggerType =
  function loadCurrentDependantCourseMatrix(dependantIdentifier: string) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const currentDependantIdentifier =
        state.guardian.currentDependantIdentifier;

      if (!currentDependantIdentifier) {
        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_IDENTIFIER",
          payload: dependantIdentifier,
        });
      }

      if (
        state.guardian.currentDependant.dependantCourseMatrixStatus === "READY"
      ) {
        return;
      }

      try {
        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_COURSE_MATRIX_STATUS",
          payload: "LOADING",
        });

        const courseMatrix = await hopsApi.getStudentCourseMatrix({
          studentIdentifier: dependantIdentifier,
        });

        const curriculumConfig = getCurriculumConfig(
          courseMatrix.type,
          courseMatrix
        );

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_COURSE_MATRIX",
          payload: courseMatrix,
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CURRICULUM_CONFIG",
          payload: curriculumConfig,
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_COURSE_MATRIX_STATUS",
          payload: "READY",
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CURRICULUM_CONFIG_STATUS",
          payload: "READY",
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_COURSE_MATRIX_STATUS",
          payload: "ERROR",
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CURRICULUM_CONFIG_STATUS",
          payload: "ERROR",
        });
      }
    };
  };

/**
 * Thunk function to load current dependant student details
 * @param dependantIdentifier dependantIdentifier
 * @returns Thunk function to load current dependant student details
 */
const loadCurrentDependantStudentInfo: LoadCurrentDependantStudentInfoTriggerType =
  function loadCurrentDependantStudentDetails(dependantIdentifier: string) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.guardian.currentDependant.dependantInfoStatus === "READY") {
        return;
      }

      try {
        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_INFO_STATUS",
          payload: "LOADING",
        });

        // Student's study time
        const dependantStudentInfo = await userApi.getStudent({
          studentId: dependantIdentifier,
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_INFO",
          payload: dependantStudentInfo,
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_INFO_STATUS",
          payload: "READY",
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_INFO_STATUS",
          payload: "ERROR",
        });
      }
    };
  };

/**
 * Thunk function to load current dependant contact groups
 * @param groupName groupName
 * @param dependantIdentifier dependantIdentifier
 * @returns Thunk function to load current dependant contact groups
 */
const loadCurrentDependantContactGroups: LoadCurrentDependantContactGroupsTriggerType =
  function loadCurrentDependantContactGroups(
    groupName: ContactGroupNames,
    dependantIdentifier: string
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const isActiveUser = state.status.isActiveUser;

      if (
        !isActiveUser ||
        state.guardian.currentDependant.dependantContactGroups[groupName]
          .status === "READY"
      ) {
        return;
      }

      try {
        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CONTACT_GROUPS_STATUS",
          payload: {
            groupName: groupName,
            status: "LOADING",
          },
        });

        const data = await userApi.getGuidanceCounselors({
          studentIdentifier: dependantIdentifier,
          properties:
            "profile-phone,profile-appointmentCalendar,profile-whatsapp,profile-vacation-start,profile-vacation-end",
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CONTACT_GROUPS",
          payload: {
            groupName: groupName,
            list: data,
          },
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CONTACT_GROUPS_STATUS",
          payload: {
            groupName: groupName,
            status: "READY",
          },
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CONTACT_GROUPS_STATUS",
          payload: {
            groupName: groupName,
            status: "ERROR",
          },
        });

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "studies",
              context: groupName,
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * Thunk function to load current dependant activity graph data
 * @param dependantIdentifier dependantIdentifier
 * @returns Thunk function to load current dependant activity graph data
 */
const loadCurrentDependantActivityGraphData: LoadCurrentDependantActivityGraphDataTriggerType =
  function loadCurrentDependantActivityGraphData(dependantIdentifier: string) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (
        state.guardian.currentDependant.dependantActivityGraphDataStatus ===
        "READY"
      ) {
        return;
      }

      try {
        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_ACTIVITY_GRAPH_DATA_STATUS",
          payload: "LOADING",
        });

        const activityLogsHash = await activitylogsApi.getUserActivityLogs({
          userIdentifier: dependantIdentifier,
          from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          to: new Date(),
        });

        // We need returned exercises and evaluated courses
        const assignmentsDone: ActivityLogType[] = [];
        const coursesDone: ActivityLogType[] = [];

        // Convert key value pairs to array of array of objects
        const activityArrays: ActivityLogEntry[][] = Object.keys(
          activityLogsHash
        ).map((key) => activityLogsHash[key]);

        // Picking the done exercises and evaluated courses from the objects
        activityArrays.forEach((element) => {
          element.find(function (param) {
            param.type == "MATERIAL_ASSIGNMENTDONE"
              ? assignmentsDone.push(param.type)
              : param.type == "EVALUATION_GOTPASSED"
                ? coursesDone.push(param.type)
                : null;
          });
        });

        const workspaces = (await workspaceApi.getWorkspaces({
          userIdentifier: dependantIdentifier,
          includeInactiveWorkspaces: true,
        })) as WorkspaceDataType[];

        if (workspaces && workspaces.length) {
          await Promise.all([
            Promise.all(
              workspaces.map(async (workspace, index) => {
                const activity =
                  await evaluationApi.getWorkspaceStudentActivity({
                    workspaceId: workspace.id,
                    studentEntityId: dependantIdentifier,
                  });
                workspaces[index].activity = activity;
              })
            ),
            Promise.all(
              workspaces.map(async (workspace, index) => {
                const statistics =
                  await workspaceDiscussionApi.getWorkspaceDiscussionStatistics(
                    {
                      workspaceEntityId: workspace.id,
                      userIdentifier: dependantIdentifier,
                    }
                  );

                workspaces[index].forumStatistics = statistics;
              })
            ),
            Promise.all(
              workspaces.map(async (workspace, index) => {
                const courseActivity =
                  await activitylogsApi.getWorkspaceActivityLogs({
                    userIdentifier: dependantIdentifier,
                    workspaceEntityId: workspace.id,
                    from: new Date(new Date().getFullYear() - 2, 0),
                    to: new Date(),
                  });

                workspaces[index].activityLogs = courseActivity;
              })
            ),
          ]);
        }

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_ACTIVITY_GRAPH_DATA",
          payload: {
            activity: activityLogsHash.general,
            workspaces: workspaces,
          },
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_ACTIVITY_GRAPH_DATA_STATUS",
          payload: "READY",
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_ACTIVITY_GRAPH_DATA_STATUS",
          payload: "ERROR",
        });
      }
    };
  };

/**
 * Thunk function to load current dependant pedagogy form access
 * @param dependantIdentifier dependantIdentifier
 * @returns Thunk function to load current dependant pedagogy form access
 */
const loadCurrentDependantPedagogyFormAccess: LoadCurrentDependantPedagogyFormAccessTriggerType =
  function loadCurrentDependantPedagogyFormAccess(dependantIdentifier: string) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (
        state.guardian.currentDependant.dependantPedagogyFormAccessStatus ===
        "READY"
      ) {
        return;
      }

      try {
        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_PEDAGOGY_FORM_ACCESS_STATUS",
          payload: "LOADING",
        });

        const pedagogyFormAccess = await pedagogyApi.getPedagogyFormAccess({
          studentIdentifier: dependantIdentifier,
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_PEDAGOGY_FORM_ACCESS",
          payload: pedagogyFormAccess,
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_PEDAGOGY_FORM_ACCESS_STATUS",
          payload: "READY",
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_PEDAGOGY_FORM_ACCESS_STATUS",
          payload: "ERROR",
        });
      }
    };
  };

/**
 * Reset current dependant state thunk function
 * @returns Thunk function to reset current dependant state
 */
const resetCurrentDependantState: ResetCurrentDependantStateTriggerType =
  function resetCurrentDependantState() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "GUARDIAN_RESET_CURRENT_DEPENDANT_STATE",
        payload: undefined,
      });
    };
  };

export {
  loadDependants,
  loadDependantWorkspaces,
  loadCurrentDependantStudyActivity,
  loadCurrentDependantCourseMatrix,
  loadCurrentDependantStudentInfo,
  loadCurrentDependantContactGroups,
  loadCurrentDependantActivityGraphData,
  loadCurrentDependantPedagogyFormAccess,
  resetCurrentDependantState,
};
