// This file includes actions and reducers
// for the materials (help/material) of workspace.
// Also includes material editor related stuff

/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadingValue } from "~/@types/shared";
import {
  WorkspaceMaterialEditorType,
  WorkspaceDataType,
  MaterialContentNodeWithIdAndLogic,
} from "~/reducers/workspaces";
import { AnyActionType, SpecificActionType } from "../index";
import { StateType } from "~/reducers";
import $ from "~/lib/jquery";
import actions, { displayNotification } from "~/actions/base/notifications";
import equals = require("deep-equal");
import { MaterialCompositeReply } from "~/generated/client";
import i18n from "~/locales/i18n";
import MApi, { isMApiError, isResponseError } from "~/api/api";

/**
 * UPDATE_WORKSPACES_SET_CURRENT_MATERIALS
 */
export type UPDATE_WORKSPACES_SET_CURRENT_MATERIALS = SpecificActionType<
  "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS",
  MaterialContentNodeWithIdAndLogic[]
>;

/**
 * UPDATE_WORKSPACES_SET_CURRENT_HELP
 */
export type UPDATE_WORKSPACES_SET_CURRENT_HELP = SpecificActionType<
  "UPDATE_WORKSPACES_SET_CURRENT_HELP",
  MaterialContentNodeWithIdAndLogic[]
>;

/**
 * UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_ACTIVE_NODE_ID
 */
export type UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_ACTIVE_NODE_ID =
  SpecificActionType<
    "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_ACTIVE_NODE_ID",
    number
  >;

/**
 * UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_REPLIES
 */
export type UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_REPLIES =
  SpecificActionType<
    "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_REPLIES",
    MaterialCompositeReply[]
  >;

/**
 * INSERT_MATERIAL_CONTENT_NODE
 */
export type INSERT_MATERIAL_CONTENT_NODE = SpecificActionType<
  "INSERT_MATERIAL_CONTENT_NODE",
  { nodeContent: MaterialContentNodeWithIdAndLogic; apiPath: ApiPath }
>;

/**
 * UPDATE_PATH_FROM_MATERIAL_CONTENT_NODES
 */
export type UPDATE_PATH_FROM_MATERIAL_CONTENT_NODES = SpecificActionType<
  "UPDATE_PATH_FROM_MATERIAL_CONTENT_NODES",
  {
    material: MaterialContentNodeWithIdAndLogic;
    newPath: string;
  }
>;

/**
 * UPDATE_MATERIAL_CONTENT_NODE
 */
export type UPDATE_MATERIAL_CONTENT_NODE = SpecificActionType<
  "UPDATE_MATERIAL_CONTENT_NODE",
  {
    showRemoveAnswersDialogForPublish: boolean;
    showUpdateLinkedMaterialsDialogForPublish: boolean;
    showRemoveLinkedAnswersDialogForPublish: boolean;
    showUpdateLinkedMaterialsDialogForPublishCount: number;
    material: MaterialContentNodeWithIdAndLogic;
    update: Partial<MaterialContentNodeWithIdAndLogic>;
    isDraft?: boolean;
  }
>;

/**
 * DELETE_MATERIAL_CONTENT_NODE
 */
export type DELETE_MATERIAL_CONTENT_NODE = SpecificActionType<
  "DELETE_MATERIAL_CONTENT_NODE",
  MaterialContentNodeWithIdAndLogic
>;

/**
 * MATERIAL_UPDATE_SHOW_EXTRA_TOOLS
 */
export type MATERIAL_UPDATE_SHOW_EXTRA_TOOLS = SpecificActionType<
  "MATERIAL_UPDATE_SHOW_EXTRA_TOOLS",
  undefined
>;

type ApiPath = "materials" | "help";

/**
 * CreateWorkspaceMaterialContentNodeTriggerType
 */
export interface CreateWorkspaceMaterialContentNodeTriggerType {
  (
    data: {
      parentMaterial?: MaterialContentNodeWithIdAndLogic;
      makeFolder: boolean;
      rootParentId: number;
      nextSibling?: MaterialContentNodeWithIdAndLogic;
      copyWorkspaceId?: number;
      copyMaterialId?: number;
      title?: string;
      file?: File;
      workspace: WorkspaceDataType;
      success?: (newNode: MaterialContentNodeWithIdAndLogic) => void;
      fail?: () => void;
    },
    apiPath: ApiPath
  ): AnyActionType;
}

/**
 * CreateWorkspaceMaterialAttachmentTriggerType
 */
export interface CreateWorkspaceMaterialAttachmentTriggerType {
  (
    data: {
      workspace: WorkspaceDataType;
      material: MaterialContentNodeWithIdAndLogic;
      files: File[];
      uploadingValues?: UploadingValue[];
      success?: () => void;
      fail?: () => void;
    },
    updateUploadingValues?: (updatedValues: UploadingValue[]) => void
  ): AnyActionType;
}

/**
 * RequestWorkspaceMaterialContentNodeAttachmentsTriggerType
 */
export interface RequestWorkspaceMaterialContentNodeAttachmentsTriggerType {
  (
    workspace: WorkspaceDataType,
    material: MaterialContentNodeWithIdAndLogic
  ): AnyActionType;
}

/**
 * UpdateWorkspaceMaterialContentNodeTriggerType
 */
export interface UpdateWorkspaceMaterialContentNodeTriggerType {
  (data: {
    workspace: WorkspaceDataType;
    material: MaterialContentNodeWithIdAndLogic;
    update: Partial<MaterialContentNodeWithIdAndLogic>;
    isDraft?: boolean;
    updateLinked?: boolean;
    removeAnswers?: boolean;
    success?: () => any;
    fail?: () => any;
    dontTriggerReducerActions?: boolean;
  }): AnyActionType;
}

/**
 * LoadWholeWorkspaceMaterialsTriggerType
 */
export interface LoadWholeWorkspaceMaterialsTriggerType {
  (
    workspaceId: number,
    includeHidden: boolean,
    callback?: (nodes: Array<MaterialContentNodeWithIdAndLogic>) => any
  ): AnyActionType;
}

/**
 * LoadWorkspaceCompositeMaterialReplies
 */
export interface LoadWorkspaceCompositeMaterialReplies {
  (id: number): AnyActionType;
}

/**
 * SetCurrentWorkspaceMaterialsActiveNodeIdTriggerType
 */
export interface SetCurrentWorkspaceMaterialsActiveNodeIdTriggerType {
  (id: number): AnyActionType;
}

/**
 * SetWorkspaceMaterialEditorStateTriggerType
 */
export interface SetWorkspaceMaterialEditorStateTriggerType {
  (
    newState: WorkspaceMaterialEditorType,
    loadCurrentDraftNodeValue?: boolean
  ): AnyActionType;
}

/**
 * DeleteWorkspaceMaterialContentNodeTriggerType
 */
export interface DeleteWorkspaceMaterialContentNodeTriggerType {
  (data: {
    material: MaterialContentNodeWithIdAndLogic;
    workspace: WorkspaceDataType;
    removeAnswers?: boolean;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * SetWholeWorkspaceMaterialsTriggerType
 */
export interface SetWholeWorkspaceMaterialsTriggerType {
  (materials: MaterialContentNodeWithIdAndLogic[]): AnyActionType;
}

/**
 * LoadWholeWorkspaceHelpTriggerType
 */
export interface LoadWholeWorkspaceHelpTriggerType {
  (
    workspaceId: number,
    includeHidden: boolean,
    callback?: (nodes: Array<MaterialContentNodeWithIdAndLogic>) => any
  ): AnyActionType;
}

/**
 * UpdateMaterialShowExtraToolsTriggerType
 */
export interface MaterialShowOrHideExtraToolsTriggerType {
  (): AnyActionType;
}

/**
 * createWorkspaceMaterialContentNode
 * @param data data
 * @param apiPath apiPath
 */
const createWorkspaceMaterialContentNode: CreateWorkspaceMaterialContentNodeTriggerType =
  function createWorkspaceMaterialContentNode(data, apiPath) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const workspaceApi = MApi.getWorkspaceApi();
      const materialsApi = MApi.getMaterialsApi();

      try {
        const parentId = data.parentMaterial
          ? data.parentMaterial.workspaceMaterialId
          : data.rootParentId;

        const nextSiblingId = data.nextSibling
          ? data.nextSibling.workspaceMaterialId
          : null;
        let workspaceMaterialId: number = null;

        if (data.copyMaterialId) {
          // Reason why copying uses materials end point naming, is
          // because it is shared end point for other workspaces functionality
          // too
          // Confusing yes, but this is how it works now
          const materialContentNode =
            await workspaceApi.createWorkspaceMaterial({
              workspaceEntityId: data.workspace.id,
              sourceNodeId: data.copyMaterialId,
              targetNodeId: parentId,
              sourceWorkspaceEntityId: data.workspace.id,
              targetWorkspaceEntityId: data.copyWorkspaceId,
              copyOnlyChildren: false,
              cloneMaterials: true,
              updateLinkedMaterials: true,
              createWorkspaceMaterialRequest: {
                parentId,
                nextSiblingId,
              },
            });

          workspaceMaterialId = materialContentNode.id;
        } else if (data.file) {
          const formData = new FormData();
          //we add it to the file
          formData.append("file", data.file);
          //and do the thing
          const tempFileData: any = await new Promise((resolve, reject) => {
            $.ajax({
              url: getState().status.contextPath + "/tempFileUploadServlet",
              type: "POST",
              data: formData,
              /**
               * success
               * @param data data
               */
              success: (data: any) => {
                resolve(data);
              },
              /**
               * error
               * @param xhr xhr
               * @param err err
               */
              error: (xhr: any, err: Error) => {
                reject(err);
              },
              cache: false,
              contentType: false,
              processData: false,
            });
          });

          const materialResult = await materialsApi.createBinaryMaterial({
            createBinaryMaterialRequest: {
              title: data.title,
              contentType: tempFileData.fileContentType || data.file.type,
              fileId: tempFileData.fileId,
            },
          });

          // Creating html material
          const materialContentNode =
            await workspaceApi.createWorkspaceMaterial({
              workspaceEntityId: data.workspace.id,
              updateLinkedMaterials: true,
              createWorkspaceMaterialRequest: {
                materialId: materialResult.id,
                parentId,
                nextSiblingId,
              },
            });

          workspaceMaterialId = materialContentNode.id;
        } else if (!data.makeFolder) {
          // Creating html material
          const htmlMaterial = await materialsApi.createHtmlMaterial({
            createHtmlMaterialRequest: {
              title: data.title,
              contentType: "text/html;editor=CKEditor",
            },
          });

          const materialId = htmlMaterial.id;

          const materialContentNode =
            await workspaceApi.createWorkspaceMaterial({
              workspaceEntityId: data.workspace.id,
              createWorkspaceMaterialRequest: {
                materialId,
                parentId,
                nextSiblingId,
              },
            });

          workspaceMaterialId = materialContentNode.id;
        } else {
          // Creating section
          const folderContentNode = await workspaceApi.createWorkspaceFolder({
            workspaceId: data.workspace.id,
            createWorkspaceFolderRequest: {
              parentId,
              nextSiblingId,
            },
          });

          workspaceMaterialId = folderContentNode.id;
        }

        const newContentNode = await workspaceApi.getWorkspaceAsContentNode({
          workspaceEntityId: data.workspace.id,
          workspaceMaterialNodeId: workspaceMaterialId,
        });

        dispatch({
          type: "INSERT_MATERIAL_CONTENT_NODE",
          payload: {
            nodeContent: newContentNode,
            apiPath: apiPath,
          },
        });

        data.success && data.success(newContentNode);
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        data.fail && data.fail();
      }
    };
  };

const MAX_ATTACHMENT_SIZE = 10000000;
/**
 * createWorkspaceMaterialAttachment
 * @param data data
 * @param updateUploadingValues updateUploadingValues
 */
const createWorkspaceMaterialAttachment: CreateWorkspaceMaterialAttachmentTriggerType =
  function createWorkspaceMaterialAttachment(
    data,
    updateUploadingValues?: (updatedValues: UploadingValue[]) => void
  ) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const materialsApi = MApi.getMaterialsApi();
      const workspaceApi = MApi.getWorkspaceApi();

      try {
        /**
         * Up keep updated values when mapping them
         */
        let updatedValues: UploadingValue[] = [];

        const tempFilesData = await Promise.all(
          data.files.map((file, index) => {
            //create the form data
            const formData = new FormData();
            //we add it to the file
            formData.append("file", file);
            //and do the thing
            return new Promise((resolve, reject) => {
              if (file.size >= MAX_ATTACHMENT_SIZE) {
                reject(
                  new Error(
                    i18n.t("notifications.sizeTooLarge", { ns: "files" })
                  )
                );
                return;
              }

              $.ajax({
                url: getState().status.contextPath + "/tempFileUploadServlet",
                type: "POST",
                data: formData,
                /**
                 * success
                 * @param data data
                 */
                success: (data: any) => {
                  resolve(data);
                },
                /**
                 * error
                 * @param xhr xhr
                 * @param err err
                 */
                error: (xhr: any, err: Error) => {
                  reject(err);
                },
                /**
                 * xhr
                 */
                xhr: () => {
                  /**
                   * If these values are not given, just return;
                   */
                  if (!data.uploadingValues && !updateUploadingValues) {
                    return;
                  }

                  //we need to get the upload progress
                  const xhr = new (window as any).XMLHttpRequest();
                  //Upload progress
                  xhr.upload.addEventListener(
                    "progress",
                    (evt: any) => {
                      if (index === 0) {
                        updatedValues = [...data.uploadingValues];
                      }
                      if (evt.lengthComputable) {
                        //we calculate the percent
                        const percentComplete = evt.loaded / evt.total;
                        //and set the new progress
                        updatedValues[index].progress = percentComplete;
                        //set the state for that new progress
                        updateUploadingValues(updatedValues);
                      }
                    },
                    false
                  );
                  return xhr;
                },
                cache: false,
                contentType: false,
                processData: false,
              });
            });
          })
        );

        await Promise.all(
          tempFilesData.map(async (tempFileData: any, index) => {
            const materialResult = await materialsApi.createBinaryMaterial({
              createBinaryMaterialRequest: {
                title: data.files[index].name,
                contentType:
                  tempFileData.fileContentType || data.files[index].type,
                fileId: tempFileData.fileId,
              },
            });

            await workspaceApi.createWorkspaceMaterial({
              workspaceEntityId: data.workspace.id,
              updateLinkedMaterials: true,
              createWorkspaceMaterialRequest: {
                materialId: materialResult.id,
                parentId: data.material.workspaceMaterialId,
              },
            });
          })
        );

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "materials",
              context: "attachment",
            }),
            "success"
          )
        );
        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(actions.displayNotification(err.message, "error"));
        data.fail && data.fail();
      }

      dispatch(
        requestWorkspaceMaterialContentNodeAttachments(
          data.workspace,
          data.material
        )
      );
    };
  };

/**
 * requestWorkspaceMaterialContentNodeAttachments
 * @param workspace workspace
 * @param material material
 */
const requestWorkspaceMaterialContentNodeAttachments: RequestWorkspaceMaterialContentNodeAttachmentsTriggerType =
  function requestWorkspaceMaterialContentNodeAttachments(workspace, material) {
    return async (dispatch: (arg: AnyActionType) => any) => {
      const workspaceApi = MApi.getWorkspaceApi();

      try {
        const childrenAttachments = await workspaceApi.getWorkspaceMaterials({
          workspaceEntityId: workspace.id,
          parentId: material.workspaceMaterialId,
        });

        const attachments = childrenAttachments.map(
          (attachment) =>
            <MaterialContentNodeWithIdAndLogic>{
              ...attachment,
            }
        );

        dispatch({
          type: "UPDATE_MATERIAL_CONTENT_NODE",
          payload: {
            showUpdateLinkedMaterialsDialogForPublish: false,
            showUpdateLinkedMaterialsDialogForPublishCount: 0,
            showRemoveAnswersDialogForPublish: false,
            showRemoveLinkedAnswersDialogForPublish: false,
            material: material,
            update: {
              childrenAttachments: attachments,
            },
            isDraft: false,
          },
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
      }
    };
  };

/**
 * updateWorkspaceMaterialContentNode
 * @param data data
 */
const updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType =
  function updateWorkspaceMaterialContentNode(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const materialsApi = MApi.getMaterialsApi();
      const workspaceApi = MApi.getWorkspaceApi();

      try {
        if (!data.dontTriggerReducerActions) {
          dispatch({
            type: "UPDATE_MATERIAL_CONTENT_NODE",
            payload: {
              showRemoveAnswersDialogForPublish: false,
              showUpdateLinkedMaterialsDialogForPublish: false,
              showRemoveLinkedAnswersDialogForPublish: false,
              showUpdateLinkedMaterialsDialogForPublishCount: 0,
              material: data.material,
              update: data.update,
              isDraft: data.isDraft,
            },
          });
        }

        if (!data.isDraft) {
          // if we are not asked to update possibly linked materials
          // and we actually have a material id because sections do not
          // have a materialId
          if (
            !data.updateLinked &&
            data.material.materialId &&
            !data.dontTriggerReducerActions
          ) {
            const materialsAnswer = await materialsApi.getMaterialsByWorkspace({
              materialId: data.material.materialId,
            });

            if (materialsAnswer && materialsAnswer.length > 1) {
              dispatch({
                type: "UPDATE_MATERIAL_CONTENT_NODE",
                payload: {
                  showRemoveAnswersDialogForPublish: false,
                  showUpdateLinkedMaterialsDialogForPublishCount:
                    materialsAnswer.length,
                  showUpdateLinkedMaterialsDialogForPublish: true,
                  showRemoveLinkedAnswersDialogForPublish: false,
                  update: data.material,
                  material: data.material,
                  isDraft: false,
                },
              });
              return;
            }
          }

          if (
            typeof data.update.html !== "undefined" &&
            data.material.html !== data.update.html
          ) {
            await materialsApi.updateHtmlMaterialContent({
              materialid: data.material.materialId,
              updateHtmlMaterialContentRequest: {
                content: data.update.html,
                removeAnswers: data.removeAnswers || false,
              },
            });
          }

          let newPath = data.material.path;
          let fields = [
            "materialId",
            "parentId",
            "nextSiblingId",
            "hidden",
            "assignmentType",
            "correctAnswers",
            "path",
            "title",
            "titleLanguage",
          ];

          if (data.material.type === "folder") {
            fields = [
              "hidden",
              "nextSiblingId",
              "parentId",
              "title",
              "titleLanguage",
              "path",
              "viewRestrict",
            ];
          }

          const result: any = {
            id: data.material.workspaceMaterialId,
          };

          let changed = false;

          fields.forEach((field) => {
            if (
              typeof (data.update as any)[field] !== "undefined" &&
              (data.material as any)[field] !== (data.update as any)[field]
            ) {
              changed = true;
            }
            result[field] =
              typeof (data.update as any)[field] !== "undefined"
                ? (data.update as any)[field]
                : (data.material as any)[field];
          });

          if (changed) {
            if (data.material.type === "folder") {
              const updatedFolder = await workspaceApi.updateWorkspaceFolder({
                workspaceId: data.workspace.id,
                workspaceFolderId: data.material.workspaceMaterialId,
                body: result,
              });

              newPath = updatedFolder.path;
            } else {
              const updatedMaterial =
                await workspaceApi.updateWorkspaceMaterial({
                  workspaceEntityId: data.workspace.id,
                  workspaceMaterialId: data.material.workspaceMaterialId,
                  body: result,
                });

              newPath = updatedMaterial.path;
            }
          }

          const materialFields = ["id", "license", "viewRestrict"];

          if (data.material.type === "folder") {
            fields = [];
          }

          const materialResult: any = {};
          changed = false;

          materialFields.forEach((field) => {
            if (
              typeof (data.update as any)[field] !== "undefined" &&
              (data.material as any)[field] !== (data.update as any)[field]
            ) {
              changed = true;
            }
            materialResult[field] =
              typeof (data.update as any)[field] !== "undefined"
                ? (data.update as any)[field]
                : (data.material as any)[field];
          });

          if (changed) {
            await materialsApi.updateMaterial({
              materialId: data.material.materialId,
              body: materialResult,
            });
          }

          if (
            typeof data.update.producers !== "undefined" &&
            !equals(data.material.producers, data.update.producers)
          ) {
            const newProducers = await Promise.all(
              data.update.producers.map((p) => {
                if (p.id === null) {
                  return materialsApi.createMaterialProducer({
                    materialId: data.material.materialId,
                    createMaterialProducerRequest: {
                      name: p.name,
                    },
                  });
                }
                return p;
              })
            );

            if (!data.dontTriggerReducerActions) {
              dispatch({
                type: "UPDATE_MATERIAL_CONTENT_NODE",
                payload: {
                  showUpdateLinkedMaterialsDialogForPublish: false,
                  showRemoveLinkedAnswersDialogForPublish: false,
                  showUpdateLinkedMaterialsDialogForPublishCount: 0,
                  showRemoveAnswersDialogForPublish: false,
                  material: data.material,
                  update: {
                    producers: newProducers,
                  },
                  isDraft: false,
                },
              });
              // we need to update the draft as well because the old
              // producers don't have a id
              dispatch({
                type: "UPDATE_MATERIAL_CONTENT_NODE",
                payload: {
                  showUpdateLinkedMaterialsDialogForPublish: false,
                  showRemoveLinkedAnswersDialogForPublish: false,
                  showUpdateLinkedMaterialsDialogForPublishCount: 0,
                  showRemoveAnswersDialogForPublish: false,
                  material: data.material,
                  update: {
                    producers: newProducers,
                  },
                  isDraft: true,
                },
              });
            }

            const deletedProducers = data.material.producers.filter(
              (p) => !newProducers.find((p2) => p2.id === p.id)
            );

            await Promise.all(
              deletedProducers.map((p) =>
                materialsApi.deleteMaterialProducer({
                  materialId: data.material.materialId,
                  producerId: p.id,
                })
              )
            );
          }

          // if the title changed we need to update the path, sadly only the server knows
          if (
            data.material.path !== newPath &&
            !data.dontTriggerReducerActions
          ) {
            dispatch({
              type: "UPDATE_PATH_FROM_MATERIAL_CONTENT_NODES",
              payload: {
                material: data.material,
                newPath,
              },
            });
          }
          localStorage.removeItem(
            "TEMPORARY_LOCAL_DRAFT_" +
              data.material.workspaceMaterialId +
              "_" +
              data.workspace.id
          );
        } else {
          // Trying to update the draft
          // TODO
          const newDraftValue = {
            ...data.material,
            ...data.update,
          };

          // if the new draft is the same as the state, we basically have reverted
          // we can safely remove the draft
          if (
            equals(
              newDraftValue,
              getState().workspaces.materialEditor.currentNodeValue
            )
          ) {
            localStorage.removeItem(
              "TEMPORARY_LOCAL_DRAFT_" +
                data.material.workspaceMaterialId +
                "_" +
                data.workspace.id
            );
          } else {
            localStorage.setItem(
              "TEMPORARY_LOCAL_DRAFT_" +
                data.material.workspaceMaterialId +
                "_" +
                data.workspace.id,
              JSON.stringify(newDraftValue)
            );
          }
        }

        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        let isConflictError = false;

        // The "message.reason === "CONTAINS_ANSWERS"" is only available for admins, who receive a conflict error (409),
        if (isResponseError(err)) {
          const errorObject = await err.response.json();
          if (errorObject.reason === "CONTAINS_ANSWERS") {
            isConflictError = true;
          }
        }

        if (data.updateLinked) {
          let showRemoveLinkedAnswersDialogForPublish = false;

          if (isConflictError) {
            showRemoveLinkedAnswersDialogForPublish = true;
          } else {
            dispatch(
              displayNotification(
                i18n.t("notifications.updateError", {
                  ns: "materials",
                  context: "page",
                }),
                "error"
              )
            );
          }

          dispatch({
            type: "UPDATE_MATERIAL_CONTENT_NODE",

            payload: {
              showUpdateLinkedMaterialsDialogForPublish: false,
              showUpdateLinkedMaterialsDialogForPublishCount: 0,
              showRemoveLinkedAnswersDialogForPublish,
              showRemoveAnswersDialogForPublish: false,
              material: data.material,
              update: data.material,
              isDraft: data.isDraft,
            },
          });
          data.fail && data.fail();

          return;
        }

        let showRemoveAnswersDialogForPublish = false;

        if (!data.removeAnswers) {
          if (isConflictError) {
            showRemoveAnswersDialogForPublish = true;
          }
        }

        if (!data.dontTriggerReducerActions) {
          dispatch({
            type: "UPDATE_MATERIAL_CONTENT_NODE",
            payload: {
              showUpdateLinkedMaterialsDialogForPublish: false,
              showRemoveLinkedAnswersDialogForPublish: false,
              showUpdateLinkedMaterialsDialogForPublishCount: 0,
              showRemoveAnswersDialogForPublish,
              material: data.material,
              update: data.material,
              isDraft: data.isDraft,
            },
          });
        }

        data.fail && data.fail();

        if (!showRemoveAnswersDialogForPublish) {
          dispatch(
            displayNotification(
              i18n.t("notifications.updateError", {
                ns: "materials",
                context: "page",
              }),
              "error"
            )
          );
        }
      }
    };
  };

/**
 * loadWholeWorkspaceMaterials
 * @param workspaceId workspaceId
 * @param includeHidden includeHidden
 * @param callback callback
 */
const loadWholeWorkspaceMaterials: LoadWholeWorkspaceMaterialsTriggerType =
  function loadWholeWorkspaceMaterials(workspaceId, includeHidden, callback) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const workspaceApi = MApi.getWorkspaceApi();

      try {
        const materialContentNodes =
          await workspaceApi.getWorkspaceMaterialContentNodes({
            workspaceEntityId: workspaceId,
            includeHidden,
          });

        dispatch({
          type: "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS",
          payload: materialContentNodes,
        });
        callback && callback(materialContentNodes);
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              ns: "materials",
              context: "materials",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * loadWorkspaceCompositeMaterialReplies
 * @param id id
 */
const loadWorkspaceCompositeMaterialReplies: LoadWorkspaceCompositeMaterialReplies =
  function loadWorkspaceCompositeMaterialReplies(id) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const workspaceApi = MApi.getWorkspaceApi();

      try {
        if (!getState().status.loggedIn) {
          dispatch({
            type: "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_REPLIES",
            payload: [],
          });
          return;
        } else {
          dispatch({
            type: "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_REPLIES",
            payload: null,
          });
        }

        const compositeReplies =
          await workspaceApi.getWorkspaceCompositeReplies({
            workspaceEntityId: id,
          });

        dispatch({
          type: "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_REPLIES",
          payload: compositeReplies || [],
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              ns: "materials",
              context: "answers",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * setCurrentWorkspaceMaterialsActiveNodeId
 * @param id id
 */
const setCurrentWorkspaceMaterialsActiveNodeId: SetCurrentWorkspaceMaterialsActiveNodeIdTriggerType =
  function setCurrentWorkspaceMaterialsActiveNodeId(id) {
    return {
      type: "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_ACTIVE_NODE_ID",
      payload: id,
    };
  };

/**
 * setWorkspaceMaterialEditorState
 * @param newState newState
 */
const setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType =
  function setWorkspaceMaterialEditorState(
    newState: WorkspaceMaterialEditorType
  ) {
    return async (dispatch: (arg: AnyActionType) => any) => {
      const currentNodeValue = newState.currentNodeValue;
      // TODO do mApi stuff
      const currentDraftNodeValueByStorage = localStorage.getItem(
        "TEMPORARY_LOCAL_DRAFT_" +
          currentNodeValue.workspaceMaterialId +
          "_" +
          newState.currentNodeWorkspace.id
      );
      if (!currentDraftNodeValueByStorage) {
        newState.currentDraftNodeValue = { ...currentNodeValue };
      } else {
        newState.currentDraftNodeValue = JSON.parse(
          currentDraftNodeValueByStorage
        );
      }
      dispatch({
        type: "UPDATE_WORKSPACES_ALL_PROPS",
        payload: {
          materialEditor: newState,
        },
      });
    };
  };

/**
 * deleteWorkspaceMaterialContentNode
 * @param data data
 */
const deleteWorkspaceMaterialContentNode: DeleteWorkspaceMaterialContentNodeTriggerType =
  function deleteWorkspaceMaterialContentNode(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const workspaceApi = MApi.getWorkspaceApi();

      try {
        if (data.material.type === "folder") {
          await workspaceApi.deleteWorkspaceFolder({
            workspaceId: data.workspace.id,
            workspaceFolderId: data.material.workspaceMaterialId,
          });
        } else {
          await workspaceApi.deleteWorkspaceMaterial({
            workspaceEntityId: data.workspace.id,
            // Please note that first option is for normal materials and second is for files
            workspaceMaterialId:
              data.material.workspaceMaterialId || data.material.id,
            removeAnswers: data.removeAnswers || false,
            updateLinkedMaterials: true,
          });
        }

        data.success && data.success();

        dispatch({
          type: "DELETE_MATERIAL_CONTENT_NODE",
          payload: data.material,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        let showRemoveAnswersDialogForDelete = false;

        // If conditional here relyis boolean value of removeAnswers
        // we need to check that removeAnswers value really exists
        if (data.removeAnswers && !data.removeAnswers && isResponseError(err)) {
          const errorObject = await err.response.json();
          try {
            if (errorObject.reason === "CONTAINS_ANSWERS") {
              showRemoveAnswersDialogForDelete = true;
              const currentEditorState = getState().workspaces.materialEditor;
              dispatch(
                setWorkspaceMaterialEditorState({
                  ...currentEditorState,
                  showRemoveAnswersDialogForDelete,
                })
              );
            }
            // eslint-disable-next-line no-empty
          } catch (e) {}
        }

        data.fail && data.fail();
        if (!showRemoveAnswersDialogForDelete && isResponseError(err)) {
          if (data.material.children && data.material.children.length) {
            // ERROR section has child nodes

            dispatch(
              displayNotification(
                i18n.t("content.sectionRemoveDenied", { ns: "materials" }),
                "error"
              )
            );
          }
        } else {
          dispatch(
            displayNotification(
              i18n.t("notifications.removeError", { ns: "materials" }),
              "error"
            )
          );
        }
      }
    };
  };

/**
 * loadWholeWorkspaceHelp
 * @param workspaceId workspaceId
 * @param includeHidden includeHidden
 * @param callback callback
 */
const loadWholeWorkspaceHelp: LoadWholeWorkspaceHelpTriggerType =
  function loadWholeWorkspaceMaterials(workspaceId, includeHidden, callback) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const workspaceApi = MApi.getWorkspaceApi();

      try {
        const materialContentNodes = await workspaceApi.getWorkspaceHelp({
          workspaceId: workspaceId,
          includeHidden,
        });

        dispatch({
          type: "UPDATE_WORKSPACES_SET_CURRENT_HELP",
          payload: materialContentNodes,
        });
        callback && callback(materialContentNodes);
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              ns: "workspace",
              context: "instructions",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * setWholeWorkspaceMaterials
 * @param materials materials
 */
const setWholeWorkspaceMaterials: SetWholeWorkspaceMaterialsTriggerType =
  function setWholeWorkspaceMaterials(materials) {
    return {
      type: "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS",
      payload: materials,
    };
  };

/**
 * setWholeWorkspaceHelp
 * @param materials materials
 */
const setWholeWorkspaceHelp: SetWholeWorkspaceMaterialsTriggerType =
  function setWholeWorkspaceHelp(materials) {
    return {
      type: "UPDATE_WORKSPACES_SET_CURRENT_HELP",
      payload: materials,
    };
  };

/**
 * updateMaterialShowExtraTool
 */
const materialShowOrHideExtraTools: MaterialShowOrHideExtraToolsTriggerType =
  function updateMaterialShowExtraTool() {
    return {
      type: "MATERIAL_UPDATE_SHOW_EXTRA_TOOLS",
      payload: undefined,
    };
  };

export {
  requestWorkspaceMaterialContentNodeAttachments,
  createWorkspaceMaterialContentNode,
  createWorkspaceMaterialAttachment,
  updateWorkspaceMaterialContentNode,
  loadWholeWorkspaceMaterials,
  loadWorkspaceCompositeMaterialReplies,
  setCurrentWorkspaceMaterialsActiveNodeId,
  setWorkspaceMaterialEditorState,
  deleteWorkspaceMaterialContentNode,
  setWholeWorkspaceMaterials,
  setWholeWorkspaceHelp,
  loadWholeWorkspaceHelp,
  materialShowOrHideExtraTools,
};
