import actions, { displayNotification } from "../base/notifications";
import mApi, { MApiError } from "~/lib/mApi";
import { StateType } from "~/reducers";
import {
  MaterialContentNodeType,
  WorkspaceActivityType,
  WorkspaceAdditionalInfoType,
  WorkspaceAssessmentRequestType,
  WorkspaceChatStatusType,
  WorkspaceDetailsType,
  WorkspaceJournalsType,
  WorkspacePermissionsType,
  WorkspaceProducerType,
  WorkspacesActiveFiltersType,
  WorkspaceType,
  WorkspaceUpdateType,
} from "~/reducers/workspaces";
import promisify from "~/util/promisify";
import { AnyActionType, SpecificActionType } from "../index";
import { reuseExistantValue } from "./helpers";
import { Dispatch } from "react-redux";
import {
  SelectItem,
  UpdateWorkspaceStateType,
  workspaceStudentsQueryDataType,
} from "./index";
import {
  WorkspaceStaffListType,
  WorkspaceStudentListType,
} from "~/reducers/user-index";

/**
 * ACTIVE_WORKSPACE_SET_WORKSPACE_DATA
 */
export type ACTIVE_WORKSPACE_SET = SpecificActionType<
  "ACTIVE_WORKSPACE_SET",
  WorkspaceType
>;

/**
 * ACTIVE_WORKSPACE_UPDATE
 */
export type ACTIVE_WORKSPACE_UPDATE = SpecificActionType<
  "ACTIVE_WORKSPACE_UPDATE",
  {
    original: WorkspaceType;
    update: WorkspaceUpdateType;
  }
>;

/**
 * ACTIVE_WORKSPACE_UPDATE_WORKSPACE_ACTIVITY
 */
export type ACTIVE_WORKSPACE_UPDATE_ACTIVITY = SpecificActionType<
  "ACTIVE_WORKSPACE_UPDATE_ACTIVITY",
  WorkspaceActivityType
>;

/**
 * ACTIVE_WORKSPACE_UPDATE_ASESSMENT_REQUESTS
 */
export type ACTIVE_WORKSPACE_UPDATE_ASESSMENT_REQUESTS = SpecificActionType<
  "ACTIVE_WORKSPACE_UPDATE_ASESSMENT_REQUESTS",
  WorkspaceAssessmentRequestType[]
>;

/**
 * SetActiveWorkspaceTrigger
 */
export interface SetActiveWorkspaceTrigger {
  (data?: {
    workspaceId: number;
    refreshActivity?: boolean;
    success?: (workspace: WorkspaceType) => void;
    fail?: () => void;
    loadDetails?: boolean;
  }): AnyActionType;
}

/**
 * UpdateWorkspaceTrigger
 */
export interface UpdateActiveWorkspaceTrigger {
  (data: {
    workspace: WorkspaceType;
    update: WorkspaceUpdateType;
    activeFilters?: WorkspacesActiveFiltersType;
    addStudents?: SelectItem[];
    addTeachers?: SelectItem[];
    removeStudents?: SelectItem[];
    removeTeachers?: SelectItem[];
    success?: () => void;
    fail?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    progress?: (state?: UpdateWorkspaceStateType) => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    executeOnSuccess?: () => any;
  }): AnyActionType;
}

/**
 * UpdateWorkspaceActivityTrigger
 */
export interface UpdateActiveWorkspaceActivityTrigger {
  (data: { success?: () => void; fail?: () => void }): AnyActionType;
}

/**
 * UpdateWorkspaceAssessmentRequestTrigger
 */
export interface UpdateActiveWorkspaceAssessmentRequestTrigger {
  (data: { success?: () => void; fail?: () => void }): AnyActionType;
}

/**
 * LoadActiveWorkspaceChatStatusTrigger
 */
export interface LoadActiveWorkspaceChatStatusTrigger {
  (): AnyActionType;
}

/**
 * LoadUsersOfWorkspaceTrigger
 */
export interface LoadUsersOfActiveWorkspaceTrigger {
  (data: {
    workspace: WorkspaceType;
    payload?: {
      q: string;
      active?: boolean;
      firstResult?: number;
      maxResults?: number;
    };
    success?: (
      students: WorkspaceStudentListType | WorkspaceStaffListType
    ) => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * UpdateActiveWorkspaceProducersTrigger
 */
export interface UpdateActiveWorkspaceProducersTrigger {
  (data: {
    appliedProducers: Array<WorkspaceProducerType>;
    success: () => void;
    fail: () => void;
  }): AnyActionType;
}

/**
 * UpdateActiveWorkspaceImagesB64Trigger
 */
export interface UpdateActiveWorkspaceImagesB64Trigger {
  (data?: {
    delete?: boolean;
    originalB64?: string;
    croppedB64?: string;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * UpdateActiveWorkspaceDetailsTrigger
 */
export interface UpdateActiveWorkspaceDetailsTrigger {
  (data: {
    newDetails: WorkspaceDetailsType;
    success: () => void;
    fail: () => void;
  }): AnyActionType;
}

/**
 * LoadActiveWorkspaceUserGroupPermissionsTrigger
 */
export interface LoadActiveWorkspaceUserGroupPermissionsTrigger {
  (): AnyActionType;
}

/**
 * LoadActiveWorkspaceDetailsTrigger
 */
export interface LoadActiveWorkspaceDetailsTrigger {
  (): AnyActionType;
}

/**
 * LoadUsersOfActiveWorkspaceTrigger
 */
export interface LoadUsersOfActiveWorkspaceTrigger {
  (data: {
    workspace: WorkspaceType;
    payload?: {
      q: string;
      active?: boolean;
      firstResult?: number;
      maxResults?: number;
    };
    success?: (
      students: WorkspaceStudentListType | WorkspaceStaffListType
    ) => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * RequestActiveWorkspaceAssessmentTrigger
 * @param data data
 */
export interface RequestActiveWorkspaceAssessmentTrigger {
  (data: {
    workspace: WorkspaceType;
    text: string;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * CancelAssessmentAtWorkspaceTriggerType
 */
export interface CancelActiveWorkspaceAssessmentRequestTrigger {
  (data: {
    workspace: WorkspaceType;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * setActiveWorkspace
 * @param data data
 */
const setActiveWorkspace: SetActiveWorkspaceTrigger =
  function setActiveWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      const current: WorkspaceType = state.activeWorkspace.workspaceData;

      if (
        current &&
        current.id === data.workspaceId &&
        !data.refreshActivity &&
        !data.loadDetails
      ) {
        data.success && data.success(current);
        return;
      }

      try {
        let workspace: WorkspaceType;

        if (current && current.id === data.workspaceId) {
          //if I just make it be current it will be buggy
          workspace = { ...current };
        }

        /* let assesments: WorkspaceStudentAssessmentsType; */
        let assessmentRequests: Array<WorkspaceAssessmentRequestType>;
        let activity: WorkspaceActivityType;
        let additionalInfo: WorkspaceAdditionalInfoType;
        let contentDescription: MaterialContentNodeType;
        let producers: Array<WorkspaceProducerType>;
        let isCourseMember: boolean;
        let journals: WorkspaceJournalsType;
        let details: WorkspaceDetailsType;
        let chatStatus: WorkspaceChatStatusType;
        const status = state.status;

        [
          workspace,
          // eslint-disable-next-line prefer-const
          assessmentRequests,
          // eslint-disable-next-line prefer-const
          activity,
          // eslint-disable-next-line prefer-const
          additionalInfo,
          // eslint-disable-next-line prefer-const
          contentDescription,
          // eslint-disable-next-line prefer-const
          producers,
          // eslint-disable-next-line prefer-const
          isCourseMember,
          // eslint-disable-next-line prefer-const
          journals,
          // eslint-disable-next-line prefer-const
          details,
          // eslint-disable-next-line prefer-const
          chatStatus,
        ] = (await Promise.all([
          reuseExistantValue(true, workspace, () =>
            promisify(
              mApi().workspace.workspaces.cacheClear().read(data.workspaceId),
              "callback"
            )()
          ),

          reuseExistantValue(
            status.permissions.WORKSPACE_REQUEST_WORKSPACE_ASSESSMENT,
            workspace && workspace.assessmentRequests,
            () =>
              promisify(
                mApi()
                  .assessmentrequest.workspace.assessmentRequests.cacheClear()
                  .read(data.workspaceId, {
                    studentIdentifier: state.status.userSchoolDataIdentifier,
                  }),
                "callback"
              )()
          ),

          status.loggedIn
            ? // The way refresh works is by never giving an existant value to the reuse existant value function that way it will think that there's no value
              // And rerequest
              reuseExistantValue(
                true,
                typeof data.refreshActivity !== "undefined" &&
                  data.refreshActivity
                  ? null
                  : workspace && workspace.activity,
                () =>
                  promisify(
                    mApi()
                      .evaluation.workspaces.students.activity.cacheClear()
                      .read(
                        data.workspaceId,
                        state.status.userSchoolDataIdentifier
                      ),
                    "callback"
                  )()
              )
            : null,

          reuseExistantValue(true, workspace && workspace.additionalInfo, () =>
            promisify(
              mApi()
                .workspace.workspaces.additionalInfo.cacheClear()
                .read(data.workspaceId),
              "callback"
            )()
          ),

          reuseExistantValue(
            true,
            workspace && workspace.contentDescription,
            () =>
              promisify(
                mApi()
                  .workspace.workspaces.description.cacheClear()
                  .read(data.workspaceId),
                "callback"
              )()
          ),

          reuseExistantValue(true, workspace && workspace.producers, () =>
            promisify(
              mApi()
                .workspace.workspaces.materialProducers.cacheClear()
                .read(data.workspaceId),
              "callback"
            )()
          ),

          state.status.loggedIn
            ? reuseExistantValue(
                true,
                workspace &&
                  typeof workspace.isCourseMember !== "undefined" &&
                  workspace.isCourseMember,
                () =>
                  promisify(
                    mApi().workspace.workspaces.amIMember.read(
                      data.workspaceId
                    ),
                    "callback"
                  )()
              )
            : false,

          reuseExistantValue(true, workspace && workspace.journals, () => null),

          data.loadDetails || (workspace && workspace.details)
            ? reuseExistantValue(true, workspace && workspace.details, () =>
                promisify(
                  mApi().workspace.workspaces.details.read(data.workspaceId),
                  "callback"
                )()
              )
            : null,

          state.status.loggedIn
            ? reuseExistantValue(true, workspace && workspace.chatStatus, () =>
                promisify(
                  mApi().chat.workspaceChatSettings.read(data.workspaceId),
                  "callback"
                )()
              )
            : null,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ])) as any;

        workspace.assessmentRequests = assessmentRequests;
        workspace.activity = activity;
        workspace.additionalInfo = additionalInfo;
        workspace.contentDescription = contentDescription;
        workspace.producers = producers;
        workspace.isCourseMember = isCourseMember;
        workspace.journals = journals;
        workspace.details = details;
        workspace.chatStatus = chatStatus;

        dispatch({
          type: "ACTIVE_WORKSPACE_SET",
          payload: workspace,
        });

        data.success && data.success(workspace);
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            state.i18n.text.get(
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
 * updateWorkspace
 * @param data data
 */
const updateActiveWorkspace: UpdateActiveWorkspaceTrigger =
  function updateActiveWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const actualOriginal: WorkspaceType = { ...data.workspace };
      delete actualOriginal["activity"];
      delete actualOriginal["studentActivity"];
      delete actualOriginal["forumStatistics"];
      delete actualOriginal["studentAssessments"];
      delete actualOriginal["activityStatistics"];
      delete actualOriginal["assessmentRequests"];
      delete actualOriginal["additionalInfo"];
      delete actualOriginal["staffMembers"];
      delete actualOriginal["students"];
      delete actualOriginal["details"];
      delete actualOriginal["producers"];
      delete actualOriginal["contentDescription"];
      delete actualOriginal["isCourseMember"];
      delete actualOriginal["journals"];
      delete actualOriginal["activityLogs"];
      delete actualOriginal["permissions"];
      delete actualOriginal["chatStatus"];
      delete actualOriginal["inactiveStudents"];

      try {
        const newDetails = data.update.details;
        const newPermissions = data.update.permissions;
        const appliedProducers = data.update.producers;
        const unchangedPermissions: WorkspacePermissionsType[] = [];
        const currentWorkspace: WorkspaceType =
          getState().activeWorkspace.workspaceData;
        const newChatStatus = data.update.chatStatus;

        // I left the workspace image out of this, because it never is in the application state anyway
        // These need to be removed from the object for the basic stuff to not fail
        delete data.update["details"];
        delete data.update["permissions"];
        delete data.update["producers"];
        delete data.update["chatStatus"];

        if (data.update) {
          await promisify(
            mApi().workspace.workspaces.update(
              data.workspace.id,
              Object.assign(actualOriginal, data.update)
            ),
            "callback"
          )();
        }

        // Then the details - if any

        if (newDetails) {
          await promisify(
            mApi().workspace.workspaces.details.update(
              data.workspace.id,
              newDetails
            ),
            "callback"
          )();

          // Add details back to the update object
          data.update.details = newDetails;

          // Details affect additionalInfo, so I guess we load that too. It's not a "single source of truth" when there's duplicates in the model, is it?

          const additionalInfo = <WorkspaceAdditionalInfoType>(
            await promisify(
              mApi()
                .workspace.workspaces.additionalInfo.cacheClear()
                .read(currentWorkspace.id),
              "callback"
            )()
          );

          data.update.additionalInfo = additionalInfo;
        }

        // Update workspace chat status (enabled/disabled)
        if (newChatStatus) {
          await promisify(
            mApi().chat.workspaceChatSettings.update(data.workspace.id, {
              chatStatus: newChatStatus,
              workspaceEntityId: data.workspace.id,
            }),
            "callback"
          )();

          // Add chat status back to the update object
          data.update.chatStatus = newChatStatus;
        }

        // Then permissions - if any
        if (newPermissions) {
          // Lets weed out the unchanged permissions for later
          data.workspace.permissions.map((permission) => {
            if (
              !newPermissions.find(
                (p) => p.userGroupEntityId === permission.userGroupEntityId
              )
            ) {
              unchangedPermissions.push(permission);
            }
          });
          await Promise.all(
            newPermissions.map((permission) => {
              const originalPermission = currentWorkspace.permissions.find(
                (p) => p.userGroupEntityId === permission.userGroupEntityId
              );
              promisify(
                mApi().workspace.workspaces.signupGroups.update(
                  currentWorkspace.id,
                  originalPermission.userGroupEntityId,
                  permission
                ),
                "callback"
              )();
            })
          );

          // Here we have to combine the new permissions with old ones for dispatch, because otherwise there will be missing options in the app state

          // TODO: this mixes up the order of the checkboxes, maybe reload them or sort them here.

          data.update.permissions = unchangedPermissions.concat(newPermissions);
        }

        // Then producers
        if (appliedProducers) {
          const existingProducers = currentWorkspace.producers;
          const workspaceProducersToAdd =
            existingProducers.length == 0
              ? appliedProducers
              : appliedProducers.filter((producer) => {
                  if (!producer.id) {
                    return producer;
                  }
                });

          const workspaceProducersToDelete = existingProducers.filter(
            (producer) => {
              if (producer.id) {
                return !appliedProducers.find(
                  (keepProducer) => keepProducer.id === producer.id
                );
              }
            }
          );

          await Promise.all(
            workspaceProducersToAdd
              .map((p) =>
                promisify(
                  mApi().workspace.workspaces.materialProducers.create(
                    currentWorkspace.id,
                    p
                  ),
                  "callback"
                )()
              )
              .concat(
                workspaceProducersToDelete.map((p) =>
                  promisify(
                    mApi().workspace.workspaces.materialProducers.del(
                      currentWorkspace.id,
                      p.id
                    ),
                    "callback"
                  )()
                )
              )
          );

          // For some reason the results of the request don't give the new workspace producers
          // it's a mess but whatever

          data.update.producers = <Array<WorkspaceProducerType>>(
            await promisify(
              mApi()
                .workspace.workspaces.materialProducers.cacheClear()
                .read(currentWorkspace.id),
              "callback"
            )()
          );
        }

        // All saved and stitched together again, dispatch to state

        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: {
            original: data.workspace,
            update: data.update,
          },
        });

        data.success && data.success();
      } catch (err) {
        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: {
            original: data.workspace,
            update: actualOriginal,
          },
        });

        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.workspace.management.notification.failedToUpdateWorkspace"
            ),
            "error"
          )
        );

        data.fail && data.fail();
      }
    };
  };

/**
 * This is a thunk action creator that returns a thunk function
 *
 * @param data data
 * @returns a thunk function
 */
const updateWorkspaceActivity: UpdateActiveWorkspaceActivityTrigger =
  function updateCurrentWorkspaceActivity(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.status.loggedIn) {
        try {
          const activity = <WorkspaceActivityType>(
            await promisify(
              mApi()
                .evaluation.workspaces.students.activity.cacheClear()
                .read(
                  state.activeWorkspace.workspaceData.id,
                  state.status.userSchoolDataIdentifier
                ),
              "callback"
            )()
          );

          dispatch({
            type: "UPDATE_CURRENT_WORKSPACE_ACTIVITY",
            payload: activity,
          });
        } catch (err) {
          dispatch(
            actions.displayNotification(
              state.i18n.text.get(
                "plugin.workspace.errormessage.workspaceActivityLoadFailed"
              ),
              "error"
            )
          );
        }
      }
    };
  };

/**
 * This is a thunk action creator for updateCurrentWorkspaceAssessmentRequest
 *
 * @param data data
 * @returns a thunk function
 */
const updateWorkspaceAssessmentRequest: UpdateActiveWorkspaceAssessmentRequestTrigger =
  function updateCurrentWorkspaceAssessmentRequest(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.status.loggedIn) {
        try {
          const assessmentRequests = <WorkspaceAssessmentRequestType[]>(
            await promisify(
              mApi()
                .assessmentrequest.workspace.assessmentRequests.cacheClear()
                .read(state.activeWorkspace.workspaceData.id, {
                  studentIdentifier: state.status.userSchoolDataIdentifier,
                }),
              "callback"
            )()
          );

          dispatch({
            type: "UPDATE_CURRENT_WORKSPACE_ASESSMENT_REQUESTS",
            payload: assessmentRequests,
          });
        } catch (err) {
          dispatch(
            actions.displayNotification(
              state.i18n.text.get(
                "plugin.workspace.errormessage.workspaceAssessmentRequestFailed"
              ),
              "error"
            )
          );
        }
      }
    };
  };

/**
 * loadWorkspaceChatStatus
 */
const loadActiveWorkspaceChatStatus: LoadActiveWorkspaceChatStatusTrigger =
  function loadWorkspaceChatStatus() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const activeWorkspaceData: WorkspaceType =
          getState().activeWorkspace.workspaceData;

        const chatStatus: WorkspaceChatStatusType = <WorkspaceChatStatusType>(
          await promisify(
            mApi().chat.workspaceChatSettings.read(activeWorkspaceData.id),
            "callback"
          )()
        );

        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: {
            original: activeWorkspaceData,
            update: { chatStatus },
          },
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.workspace.management.notification.failedToLoadChatSettigns"
            ),
            "error"
          )
        );
      }
    };
  };

/**
 * loadStaffMembersOfActiveWorkspace
 * @param data data
 */
const loadStaffMembersOfActiveWorkspace: LoadUsersOfActiveWorkspaceTrigger =
  function loadStaffMembersOfActiveWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const staffMembers = <WorkspaceStaffListType>await promisify(
          mApi().user.staffMembers.read({
            workspaceEntityId: data.workspace.id,
            properties:
              "profile-phone,profile-appointmentCalendar,profile-extraInfo,profile-whatsapp,profile-vacation-start,profile-vacation-end",
            firstResult: data.payload ? data.payload.firstResult : 0,
            maxResults: data.payload ? data.payload.maxResults : 10,
          }),
          "callback"
        )();

        const update: WorkspaceUpdateType = {
          staffMembers,
        };

        dispatch({
          type: "ACTIVE_WORKSPACE_UPDATE",
          payload: {
            original: data.workspace,
            update,
          },
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.workspace.management.notification.failedToLoadTeachers"
            ),
            "error"
          )
        );
      }
    };
  };

/**
 * updateWorkspaceProducersForCurrentWorkspace
 * @param data data
 */
const updateActiveWorkspaceProducers: UpdateActiveWorkspaceProducersTrigger =
  function updateWorkspaceProducersForActiveWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const state: StateType = getState();
        const existingProducers = state.activeWorkspace.workspaceData.producers;

        const workspaceProducersToAdd =
          existingProducers.length == 0
            ? data.appliedProducers
            : data.appliedProducers.filter((producer) => {
                if (!producer.id) {
                  return producer;
                }
              });

        const workspaceProducersToDelete = existingProducers.filter(
          (producer) => {
            if (producer.id) {
              return !data.appliedProducers.find(
                (keepProducer) => keepProducer.id === producer.id
              );
            }
          }
        );

        await Promise.all(
          workspaceProducersToAdd
            .map((p) =>
              promisify(
                mApi().workspace.workspaces.materialProducers.create(
                  state.activeWorkspace.workspaceData.id,
                  p
                ),
                "callback"
              )()
            )
            .concat(
              workspaceProducersToDelete.map((p) =>
                promisify(
                  mApi().workspace.workspaces.materialProducers.del(
                    state.activeWorkspace.workspaceData.id,
                    p.id
                  ),
                  "callback"
                )()
              )
            )
        );

        // For some reason the results of the request don't give the new workspace producers
        // it's a mess but whatever
        const newActualWorkspaceProducers: Array<WorkspaceProducerType> = <
          Array<WorkspaceProducerType>
        >await promisify(
          mApi()
            .workspace.workspaces.materialProducers.cacheClear()
            .read(state.activeWorkspace.workspaceData.id),
          "callback"
        )();

        const currentWorkspace: WorkspaceType =
          getState().activeWorkspace.workspaceData;

        dispatch({
          type: "ACTIVE_WORKSPACE_UPDATE",
          payload: {
            original: currentWorkspace,
            update: {
              producers: newActualWorkspaceProducers,
            },
          },
        });

        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.workspace.management.notification.failedToUpdateProducers"
            ),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * updateCurrentWorkspaceImagesB64
 * @param data data
 */
const updateActiveWorkspaceImagesB64: UpdateActiveWorkspaceImagesB64Trigger =
  function updateCurrentWorkspaceImagesB64(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const currentWorkspace: WorkspaceType =
          getState().activeWorkspace.workspaceData;
        const mimeTypeRegex = /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/;
        const mimeTypeOriginal =
          data.originalB64 && data.originalB64.match(mimeTypeRegex)[1];
        const mimeTypeCropped =
          data.croppedB64 && data.croppedB64.match(mimeTypeRegex)[1];

        if (data.delete) {
          await promisify(
            mApi().workspace.workspaces.workspacefile.del(
              currentWorkspace.id,
              "workspace-frontpage-image-cropped"
            ),
            "callback"
          )();
        } else if (data.croppedB64) {
          await promisify(
            mApi().workspace.workspaces.workspacefile.create(
              currentWorkspace.id,
              {
                fileIdentifier: "workspace-frontpage-image-cropped",
                contentType: mimeTypeCropped,
                base64Data: data.croppedB64,
              }
            ),
            "callback"
          )();
        }

        if (data.delete) {
          await promisify(
            mApi().workspace.workspaces.workspacefile.del(
              currentWorkspace.id,
              "workspace-frontpage-image-original"
            ),
            "callback"
          )();
        } else if (data.originalB64) {
          await promisify(
            mApi().workspace.workspaces.workspacefile.create(
              currentWorkspace.id,
              {
                fileIdentifier: "workspace-frontpage-image-original",
                contentType: mimeTypeOriginal,
                base64Data: data.originalB64,
              }
            ),
            "callback"
          )();
        }

        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.workspace.management.notification.failedToUpdateImage"
            ),
            "error"
          )
        );

        data.fail && data.fail();
      }
    };
  };

/**
 * updateActiveWorkspaceDetails
 * @param data data
 */
const updateActiveWorkspaceDetails: UpdateActiveWorkspaceDetailsTrigger =
  function updateWorkspaceDetailsForCurrentWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const state: StateType = getState();

        await promisify(
          mApi().workspace.workspaces.details.update(
            state.activeWorkspace.workspaceData.id,
            data.newDetails
          ),
          "callback"
        )();

        const currentWorkspace: WorkspaceType =
          getState().activeWorkspace.workspaceData;

        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: {
            original: currentWorkspace,
            update: {
              details: data.newDetails,
            },
          },
        });

        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.workspace.management.notification.failedToUpdateDetails"
            ),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * loadCurrentWorkspaceUserGroupPermissions
 */
const loadActiveWorkspaceUserGroupPermissions: LoadActiveWorkspaceUserGroupPermissionsTrigger =
  function loadCurrentWorkspaceUserGroupPermissions() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const currentWorkspace: WorkspaceType =
          getState().activeWorkspace.workspaceData;
        const permissions: WorkspacePermissionsType[] = <
          WorkspacePermissionsType[]
        >await promisify(
          mApi().workspace.workspaces.signupGroups.read(
            getState().activeWorkspace.workspaceData.id
          ),
          "callback"
        )();

        dispatch({
          type: "ACTIVE_WORKSPACE_UPDATE",
          payload: {
            original: currentWorkspace,
            update: {
              permissions,
            },
          },
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.workspace.management.notification.failedToLoadWorkspacePermissions"
            ),
            "error"
          )
        );
      }
    };
  };

/**
 * loadWorkspaceDetailsInCurrentWorkspace
 */
const loadActiveWorkspaceDetails: LoadActiveWorkspaceDetailsTrigger =
  function loadWorkspaceDetailsInCurrentWorkspace() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const details: WorkspaceDetailsType = <WorkspaceDetailsType>(
          await promisify(
            mApi().workspace.workspaces.details.read(
              getState().activeWorkspace.workspaceData.id
            ),
            "callback"
          )()
        );
        const currentWorkspace: WorkspaceType =
          getState().activeWorkspace.workspaceData;

        dispatch({
          type: "ACTIVE_WORKSPACE_UPDATE",
          payload: {
            original: currentWorkspace,
            update: {
              details,
            },
          },
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.workspace.management.notification.failedToLoadDetails"
            ),
            "error"
          )
        );
      }
    };
  };

/**
 * loadStudentsOfWorkspace
 * @param data data
 */
const loadStudentsOfActiveWorkspace: LoadUsersOfActiveWorkspaceTrigger =
  function loadStudentsOfWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const payload: workspaceStudentsQueryDataType = {
          q: data.payload && data.payload.q ? data.payload.q : "",
        };

        if (data.payload && data.payload.firstResult >= 0) {
          payload.firstResult = data.payload.firstResult;
        }

        if (data.payload && data.payload.maxResults) {
          payload.maxResults = data.payload.maxResults;
        }

        if (data.payload && data.payload.active !== undefined) {
          payload.active = data.payload.active;
        }

        const students = <WorkspaceStudentListType>(
          await promisify(
            mApi().workspace.workspaces.students.read(
              data.workspace.id,
              payload
            ),
            "callback"
          )()
        );

        let update: WorkspaceUpdateType = {
          students,
        };

        if (
          data.payload &&
          data.payload.active !== undefined &&
          !data.payload.active
        ) {
          update = {
            inactiveStudents: students,
          };
        }

        dispatch({
          type: "ACTIVE_WORKSPACE_UPDATE",
          payload: {
            original: data.workspace,
            update,
          },
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.workspace.management.notification.failedToLoadStudents"
            ),
            "error"
          )
        );
      }
    };
  };

/**
 * requestAssessmentAtWorkspace
 * @param data data
 */
const requestActiveWorkspaceAssesmentTrigger: RequestActiveWorkspaceAssessmentTrigger =
  function requestAssessmentAtWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const assessmentRequest: WorkspaceAssessmentRequestType = <
          WorkspaceAssessmentRequestType
        >await promisify(
          mApi().assessmentrequest.workspace.assessmentRequests.create(
            data.workspace.id,
            {
              requestText: data.text,
            }
          ),
          "callback"
        )();

        /**
         * First finding current "assessmentState state" and depending what state it is assign new state
         * Will be changed when module specific evaluation assessment request functionality is implemented
         */
        let newAssessmentState =
          data.workspace.activity.assessmentState[0].state;

        if (newAssessmentState === "unassessed") {
          newAssessmentState = "pending";
        } else if (newAssessmentState == "pass") {
          newAssessmentState = "pending_pass";
        } else if (newAssessmentState == "fail") {
          newAssessmentState = "pending_fail";
        } else {
          newAssessmentState = "pending";
        }

        /**
         * Must be done for now. To update activity when assessmentRequest is being made.
         * In future changing state locally is better options one combination workspace module specific
         * request are implemented
         */
        dispatch(updateWorkspaceActivity({}));

        /**
         * Same here
         */
        dispatch(updateWorkspaceAssessmentRequest({}));

        dispatch(
          actions.displayNotification(
            state.i18n.text.get(
              "plugin.workspace.evaluation.requestEvaluation.notificationText"
            ),
            "success"
          )
        );
        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            state.i18n.text.get(
              "plugin.workspace.errormessage.requestAssessmentFail"
            ),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * cancelAssessmentAtWorkspace
 * @param data data
 */
const cancelActiveWorkspaceAssessmentRequest: CancelActiveWorkspaceAssessmentRequestTrigger =
  function cancelAssessmentAtWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      try {
        const assessmentRequest: WorkspaceAssessmentRequestType =
          data.workspace.assessmentRequests[
            data.workspace.assessmentRequests.length - 1
          ];
        if (!assessmentRequest) {
          dispatch(
            actions.displayNotification(
              state.i18n.text.get(
                "plugin.workspace.errormessage.cancelAssessmentFail"
              ),
              "error"
            )
          );
          data.fail && data.fail();
          return;
        }
        await promisify(
          mApi().assessmentrequest.workspace.assessmentRequests.del(
            data.workspace.id,
            assessmentRequest.id
          ),
          "callback"
        )();

        /**
         * First finding current "assessmentState state" and depending what state it is assign new state
         * Will be changed when module specific evaluation assessment request functionality is implemented
         */
        let newAssessmentState =
          data.workspace.activity.assessmentState[0].state;

        if (newAssessmentState == "pending") {
          newAssessmentState = "unassessed";
        } else if (newAssessmentState == "pending_pass") {
          newAssessmentState = "pass";
        } else if (newAssessmentState == "pending_fail") {
          newAssessmentState = "fail";
        }

        /**
         * Must be done for now. To update activity when assessmentRequest is being made.
         * In future changing state locally is better options one combination workspace module specific
         * request are implemented
         */
        dispatch(updateWorkspaceActivity({}));

        /**
         * Same here
         */
        dispatch(updateWorkspaceAssessmentRequest({}));

        dispatch(
          actions.displayNotification(
            state.i18n.text.get(
              "plugin.workspace.evaluation.cancelEvaluation.notificationText"
            ),
            "success"
          )
        );
        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            state.i18n.text.get(
              "plugin.workspace.errormessage.cancelAssessmentFail"
            ),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

export {
  setActiveWorkspace,
  updateActiveWorkspace,
  updateWorkspaceActivity,
  updateWorkspaceAssessmentRequest,
  updateActiveWorkspaceProducers,
  updateActiveWorkspaceImagesB64,
  updateActiveWorkspaceDetails,
  loadActiveWorkspaceChatStatus,
  loadStaffMembersOfActiveWorkspace,
  loadActiveWorkspaceUserGroupPermissions,
  loadActiveWorkspaceDetails,
  loadStudentsOfActiveWorkspace,
  requestActiveWorkspaceAssesmentTrigger,
  cancelActiveWorkspaceAssessmentRequest,
};
