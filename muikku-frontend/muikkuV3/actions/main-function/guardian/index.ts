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
  Student,
  StudyActivity,
  UserGuardiansDependant,
  UserGuardiansDependantWorkspace,
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
  Student
>;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_EDUCATION_TYPES_STATUS =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_EDUCATION_TYPES_STATUS",
    ReducerStateType
  >;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_EDUCATION_TYPES =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_EDUCATION_TYPES",
    string[]
  >;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_DEFAULT_EDUCATION_TYPE_CODE =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_DEFAULT_EDUCATION_TYPE_CODE",
    string
  >;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_SELECTED_EDUCATION_TYPE_CODE =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_SELECTED_EDUCATION_TYPE_CODE",
    string
  >;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_CURRICULUM_CONFIG_STATUS =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CURRICULUM_CONFIG_STATUS",
    { key: string; status: ReducerStateType }
  >;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_CURRICULUM_CONFIG =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CURRICULUM_CONFIG",
    { key: string; curriculumConfig: CurriculumConfig }
  >;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_STUDY_ACTIVITY_STATUS =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_STUDY_ACTIVITY_STATUS",
    { key: string; status: ReducerStateType }
  >;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_STUDY_ACTIVITY =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_STUDY_ACTIVITY",
    { key: string; studyActivity: StudyActivity }
  >;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_COURSE_MATRIX_STATUS =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_COURSE_MATRIX_STATUS",
    { key: string; status: ReducerStateType }
  >;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_COURSE_MATRIX =
  SpecificActionType<
    "GUARDIAN_UPDATE_CURRENT_DEPENDANT_COURSE_MATRIX",
    { key: string; courseMatrix: CourseMatrix }
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
 * InitializeCurrentDependantEssentialsTriggerType
 */
export interface InitializeCurrentDependantEssentialsTriggerType {
  (dependantIdentifier: string): AnyActionType;
}

/**
 * LoadCurrentDependantEssentialsTriggerType
 */
export interface LoadCurrentDependantStudyActivityTriggerType {
  (data: {
    dependantIdentifier: string;
    educationTypeCode?: string;
  }): AnyActionType;
}

/**
 * LoadCurrentDependantCourseMatrixTriggerType
 */
export interface LoadCurrentDependantCourseMatrixTriggerType {
  (data: {
    dependantIdentifier: string;
    educationTypeCode?: string;
  }): AnyActionType;
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
 * LoadCurrentDependantEducationTypesTriggerType
 */
export interface LoadCurrentDependantEducationTypesTriggerType {
  (dependantIdentifier: string): AnyActionType;
}

/**
 * UpdateCurrentDependantIdentifierTriggerType
 */
export interface UpdateCurrentDependantIdentifierTriggerType {
  (dependantIdentifier: string): AnyActionType;
}

/**
 * UpdateCurrentDependantSelectedEducationTypeCodeTriggerType
 */
export interface UpdateCurrentDependantSelectedEducationTypeCodeTriggerType {
  (educationTypeCode: string): AnyActionType;
}

/**
 * Thunk function to load dependants
 * @returns Thunk function to load dependants
 */
const loadDependants: LoadDependantsTriggerType = function loadDependants() {
  return async (dispatch, getState) => {
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
        type: "GUARDIAN_UPDATE_DEPENDANTS_STATUS",
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
    return async (dispatch, getState) => {
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
 * @param data data
 * @returns Thunk function to load current dependant study activity
 */
const loadCurrentDependantStudyActivity: LoadCurrentDependantStudyActivityTriggerType =
  function loadCurrentDependantStudyActivity(data) {
    const { dependantIdentifier, educationTypeCode } = data;
    return async (dispatch, getState) => {
      const state = getState();
      const entry =
        state.guardian.currentDependant.dependantStudyDataByEducationTypeCode[
          educationTypeCode
        ];

      if (!entry || entry.studyActivityStatus !== "IDLE") {
        return;
      }

      try {
        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_STUDY_ACTIVITY_STATUS",
          payload: { key: educationTypeCode, status: "LOADING" },
        });

        const studyActivity = await hopsApi.getStudyActivity({
          studentIdentifier: dependantIdentifier,
          educationTypeCode: educationTypeCode,
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_STUDY_ACTIVITY",
          payload: { key: educationTypeCode, studyActivity: studyActivity },
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_STUDY_ACTIVITY_STATUS",
          payload: { key: educationTypeCode, status: "READY" },
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_STUDY_ACTIVITY_STATUS",
          payload: { key: educationTypeCode, status: "ERROR" },
        });
      }
    };
  };

/**
 * Thunk function to load current dependant course matrix
 * @param data data
 * @returns Thunk function to load current dependant course matrix
 */
const loadCurrentDependantCourseMatrix: LoadCurrentDependantCourseMatrixTriggerType =
  function loadCurrentDependantCourseMatrix(data) {
    const { dependantIdentifier, educationTypeCode } = data;
    return async (dispatch, getState) => {
      const state = getState();
      const entry =
        state.guardian.currentDependant.dependantStudyDataByEducationTypeCode[
          educationTypeCode
        ];

      if (!entry || entry.courseMatrixStatus !== "IDLE") {
        return;
      }

      try {
        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_COURSE_MATRIX_STATUS",
          payload: { key: educationTypeCode, status: "LOADING" },
        });

        const courseMatrix = await hopsApi.getStudentCourseMatrix({
          studentIdentifier: dependantIdentifier,
          educationTypeCode: educationTypeCode,
        });

        const curriculumConfig = getCurriculumConfig(
          courseMatrix.type,
          courseMatrix
        );

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_COURSE_MATRIX",
          payload: { key: educationTypeCode, courseMatrix: courseMatrix },
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CURRICULUM_CONFIG",
          payload: {
            key: educationTypeCode,
            curriculumConfig: curriculumConfig,
          },
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_COURSE_MATRIX_STATUS",
          payload: { key: educationTypeCode, status: "READY" },
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CURRICULUM_CONFIG_STATUS",
          payload: { key: educationTypeCode, status: "READY" },
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_COURSE_MATRIX_STATUS",
          payload: { key: educationTypeCode, status: "ERROR" },
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_CURRICULUM_CONFIG_STATUS",
          payload: { key: educationTypeCode, status: "ERROR" },
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
  function loadCurrentDependantStudentInfo(dependantIdentifier: string) {
    return async (dispatch, getState) => {
      const state = getState();

      if (state.guardian.currentDependant.dependantInfoStatus === "READY") {
        return;
      }

      try {
        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_INFO_STATUS",
          payload: "LOADING",
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_EDUCATION_TYPES_STATUS",
          payload: "LOADING",
        });

        // Student's study time
        const dependantStudentInfo = await userApi.getStudent({
          studentId: dependantIdentifier,
        });

        const educationTypes = await userApi.getStudentEducationTypes({
          studentIdentifier: dependantIdentifier,
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_DEFAULT_EDUCATION_TYPE_CODE",
          payload: dependantStudentInfo.educationTypeCode,
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_SELECTED_EDUCATION_TYPE_CODE",
          payload: dependantStudentInfo.educationTypeCode,
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_EDUCATION_TYPES",
          payload: educationTypes,
        });

        dispatch({
          type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_EDUCATION_TYPES_STATUS",
          payload: "READY",
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
    return async (dispatch, getState) => {
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
    return async (dispatch, getState) => {
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
          await Promise.all(
            workspaces.map(async (workspace, index) => {
              const [activity, statistics, courseActivity] = await Promise.all([
                evaluationApi.getWorkspaceStudentActivity({
                  workspaceId: workspace.id,
                  studentEntityId: dependantIdentifier,
                }),
                workspaceDiscussionApi.getWorkspaceDiscussionStatistics({
                  workspaceEntityId: workspace.id,
                  userIdentifier: dependantIdentifier,
                }),
                activitylogsApi.getWorkspaceActivityLogs({
                  userIdentifier: dependantIdentifier,
                  workspaceEntityId: workspace.id,
                  from: new Date(new Date().getFullYear() - 2, 0),
                  to: new Date(),
                }),
              ]);

              workspaces[index].activity = activity;
              workspaces[index].forumStatistics = statistics;
              workspaces[index].activityLogs = courseActivity;
            })
          );
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
    return async (dispatch, getState) => {
      const state = getState();

      if (
        state.guardian.currentDependant.dependantPedagogyFormAccessStatus !==
        "IDLE"
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
 * Update current dependant identifier thunk function
 * @param dependantIdentifier dependantIdentifier
 * @returns Thunk function to update current dependant identifier
 */
const updateCurrentDependantIdentifier: UpdateCurrentDependantIdentifierTriggerType =
  function updateCurrentDependantIdentifier(dependantIdentifier: string) {
    return async (dispatch, getState) => {
      dispatch({
        type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_IDENTIFIER",
        payload: dependantIdentifier,
      });
    };
  };

/**
 * Update current dependant selected education type code thunk function
 * @param educationTypeCode educationTypeCode
 * @returns Thunk function to update current dependant selected education type code
 */
const updateCurrentDependantSelectedEducationTypeCode: UpdateCurrentDependantSelectedEducationTypeCodeTriggerType =
  function updateCurrentDependantSelectedEducationTypeCode(
    educationTypeCode: string
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      dispatch({
        type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_SELECTED_EDUCATION_TYPE_CODE",
        payload: educationTypeCode,
      });

      dispatch(
        loadCurrentDependantStudyActivity({
          dependantIdentifier: state.guardian.currentDependant.dependantInfo.id,
          educationTypeCode: educationTypeCode,
        })
      );
      dispatch(
        loadCurrentDependantCourseMatrix({
          dependantIdentifier: state.guardian.currentDependant.dependantInfo.id,
          educationTypeCode: educationTypeCode,
        })
      );
    };
  };

/**
 * Load current dependant education types thunk function
 * @param dependantIdentifier dependantIdentifier
 * @returns Thunk function to load current dependant education types
 */
const loadCurrentDependantEducationTypes: LoadCurrentDependantEducationTypesTriggerType =
  function loadCurrentDependantEducationTypes(dependantIdentifier: string) {
    return async (dispatch, getState) => {
      const educationTypes = await userApi.getStudentEducationTypes({
        studentIdentifier: dependantIdentifier,
      });

      dispatch({
        type: "GUARDIAN_UPDATE_CURRENT_DEPENDANT_EDUCATION_TYPES",
        payload: educationTypes,
      });
    };
  };

/**
 * Initialize current dependant essentials thunk function
 * @param dependantIdentifier dependantIdentifier
 * @returns Thunk function to initialize current dependant essentials
 */
const initializeCurrentDependantEssentials: InitializeCurrentDependantEssentialsTriggerType =
  function initializeCurrentDependantEssentials(dependantIdentifier: string) {
    return async (dispatch, getState) => {
      // Update the current dependant identifier.
      // This will reset the current dependant state so we will wait for it to complete.
      await dispatch(updateCurrentDependantIdentifier(dependantIdentifier));

      // Then load the current dependant student info.
      await dispatch(loadCurrentDependantStudentInfo(dependantIdentifier));

      // Get the default education type code.
      const defaultEducationTypeCode =
        getState().guardian.currentDependant.dependantInfo.educationTypeCode;

      // Load the current dependant course matrix.
      dispatch(
        loadCurrentDependantCourseMatrix({
          dependantIdentifier: dependantIdentifier,
          educationTypeCode: defaultEducationTypeCode,
        })
      );

      // Load the current dependant study activity.
      dispatch(
        loadCurrentDependantStudyActivity({
          dependantIdentifier: dependantIdentifier,
          educationTypeCode: defaultEducationTypeCode,
        })
      );
    };
  };

export {
  initializeCurrentDependantEssentials,
  loadDependants,
  loadDependantWorkspaces,
  loadCurrentDependantStudyActivity,
  loadCurrentDependantCourseMatrix,
  loadCurrentDependantStudentInfo,
  loadCurrentDependantContactGroups,
  loadCurrentDependantActivityGraphData,
  loadCurrentDependantPedagogyFormAccess,
  loadCurrentDependantEducationTypes,
  updateCurrentDependantIdentifier,
  updateCurrentDependantSelectedEducationTypeCode,
};
