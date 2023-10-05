// This file includes actions and reducers
// for the materials (help/material) of workspace.
// Also includes material editor related stuff

/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadingValue } from "~/@types/shared";
import {
  MaterialCompositeRepliesListType,
  MaterialContentNodeListType,
  MaterialContentNodeProducerType,
  MaterialContentNodeType,
  WorkspaceMaterialEditorType,
  WorkspaceType,
} from "~/reducers/workspaces";
import promisify from "~/util/promisify";
import { AnyActionType, SpecificActionType } from "../index";
import mApi, { MApiError } from "~/lib/mApi";
import { StateType } from "~/reducers";
import $ from "~/lib/jquery";
import actions, { displayNotification } from "~/actions/base/notifications";
import equals = require("deep-equal");

/**
 * UPDATE_WORKSPACES_SET_CURRENT_MATERIALS
 */
export type UPDATE_WORKSPACES_SET_CURRENT_MATERIALS = SpecificActionType<
  "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS",
  MaterialContentNodeListType
>;

/**
 * UPDATE_WORKSPACES_SET_CURRENT_HELP
 */
export type UPDATE_WORKSPACES_SET_CURRENT_HELP = SpecificActionType<
  "UPDATE_WORKSPACES_SET_CURRENT_HELP",
  MaterialContentNodeListType
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
    MaterialCompositeRepliesListType
  >;

/**
 * INSERT_MATERIAL_CONTENT_NODE
 */
export type INSERT_MATERIAL_CONTENT_NODE = SpecificActionType<
  "INSERT_MATERIAL_CONTENT_NODE",
  { nodeContent: MaterialContentNodeType; apiPath: ApiPath }
>;

/**
 * UPDATE_PATH_FROM_MATERIAL_CONTENT_NODES
 */
export type UPDATE_PATH_FROM_MATERIAL_CONTENT_NODES = SpecificActionType<
  "UPDATE_PATH_FROM_MATERIAL_CONTENT_NODES",
  {
    material: MaterialContentNodeType;
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
    material: MaterialContentNodeType;
    update: Partial<MaterialContentNodeType>;
    isDraft?: boolean;
  }
>;

/**
 * DELETE_MATERIAL_CONTENT_NODE
 */
export type DELETE_MATERIAL_CONTENT_NODE = SpecificActionType<
  "DELETE_MATERIAL_CONTENT_NODE",
  MaterialContentNodeType
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
      parentMaterial?: MaterialContentNodeType;
      makeFolder: boolean;
      rootParentId: number;
      nextSibling?: MaterialContentNodeType;
      copyWorkspaceId?: number;
      copyMaterialId?: number;
      title?: string;
      file?: File;
      workspace: WorkspaceType;
      success?: (newNode: MaterialContentNodeType) => void;
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
      workspace: WorkspaceType;
      material: MaterialContentNodeType;
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
  (workspace: WorkspaceType, material: MaterialContentNodeType): AnyActionType;
}

/**
 * UpdateWorkspaceMaterialContentNodeTriggerType
 */
export interface UpdateWorkspaceMaterialContentNodeTriggerType {
  (data: {
    workspace: WorkspaceType;
    material: MaterialContentNodeType;
    update: Partial<MaterialContentNodeType>;
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
    callback?: (nodes: Array<MaterialContentNodeType>) => any
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
    material: MaterialContentNodeType;
    workspace: WorkspaceType;
    removeAnswers?: boolean;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * SetWholeWorkspaceMaterialsTriggerType
 */
export interface SetWholeWorkspaceMaterialsTriggerType {
  (materials: MaterialContentNodeListType): AnyActionType;
}

/**
 * LoadWholeWorkspaceHelpTriggerType
 */
export interface LoadWholeWorkspaceHelpTriggerType {
  (
    workspaceId: number,
    includeHidden: boolean,
    callback?: (nodes: Array<MaterialContentNodeType>) => any
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
      try {
        const apiRef =
          apiPath === "help"
            ? mApi().workspace.workspaces.help
            : mApi().workspace.workspaces.materials;

        const parentId = data.parentMaterial
          ? data.parentMaterial.workspaceMaterialId
          : data.rootParentId;

        const nextSiblingId = data.nextSibling
          ? data.nextSibling.workspaceMaterialId
          : null;
        let workspaceMaterialId: number = null;

        if (data.copyMaterialId) {
          /**
           * Reason why copying uses materials end point naming, is
           * because it is shared end point for other workspaces functionality
           * too
           * Confusing yes, but this is how it works now
           */
          workspaceMaterialId = (
            (await promisify(
              mApi().workspace.workspaces.materials.create(
                data.workspace.id,
                {
                  parentId,
                  nextSiblingId,
                },
                {
                  sourceNodeId: data.copyMaterialId,
                  targetNodeId: parentId,
                  sourceWorkspaceEntityId: data.workspace.id,
                  targetWorkspaceEntityId: data.copyWorkspaceId,
                  copyOnlyChildren: false,
                  cloneMaterials: true,
                  updateLinkedMaterials: true,
                }
              ),
              "callback"
            )()) as any
          ).id;
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

          const materialResult: any = await promisify(
            mApi().materials.binary.create({
              title: data.title,
              contentType: tempFileData.fileContentType || data.file.type,
              fileId: tempFileData.fileId,
            }),
            "callback"
          )();

          workspaceMaterialId = (
            (await promisify(
              apiRef.create(
                data.workspace.id,
                {
                  materialId: materialResult.id,
                  parentId,
                  nextSiblingId,
                },
                {
                  updateLinkedMaterials: true,
                }
              ),
              "callback"
            )()) as any
          ).id;
        } else if (!data.makeFolder) {
          // Creating page for section !
          const materialId = (
            (await promisify(
              mApi().materials.html.create({
                title: data.title,
                contentType: "text/html;editor=CKEditor",
              }),
              "callback"
            )()) as any
          ).id;

          workspaceMaterialId = (
            (await promisify(
              mApi().workspace.workspaces.materials.create(data.workspace.id, {
                materialId,
                parentId,
                nextSiblingId,
              }),
              "callback"
            )()) as any
          ).id;
        } else {
          //Creating section
          workspaceMaterialId = (
            (await promisify(
              mApi().workspace.workspaces.folders.create(data.workspace.id, {
                parentId,
                nextSiblingId,
              }),
              "callback"
            )()) as any
          ).id;
        }

        const newContentNode: MaterialContentNodeType = <
          MaterialContentNodeType
        >await promisify(
          mApi().workspace.workspaces.asContentNode.read(
            data.workspace.id,
            workspaceMaterialId
          ),
          "callback"
        )();

        dispatch({
          type: "INSERT_MATERIAL_CONTENT_NODE",
          payload: {
            nodeContent: newContentNode,
            apiPath: apiPath,
          },
        });

        data.success && data.success(newContentNode);
      } catch (err) {
        if (!(err instanceof MApiError)) {
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
                    getState().i18n.text.get(
                      "plugin.workspace.fileFieldUpload.fileSizeTooLarge"
                    )
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
            const materialResult: any = await promisify(
              mApi().materials.binary.create({
                title: data.files[index].name,
                contentType:
                  tempFileData.fileContentType || data.files[index].type,
                fileId: tempFileData.fileId,
              }),
              "callback"
            )();

            await promisify(
              mApi().workspace.workspaces.materials.create(
                data.workspace.id,
                {
                  materialId: materialResult.id,
                  parentId: data.material.workspaceMaterialId,
                },
                {
                  updateLinkedMaterials: true,
                }
              ),
              "callback"
            )();
          })
        );

        dispatch(
          actions.displayNotification(
            getState().i18n.text.get(
              "plugin.workspace.materialsManagement.attachment.notification.success"
            ),
            "success"
          )
        );
        data.success && data.success();
      } catch (err) {
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
      try {
        const childrenAttachments: MaterialContentNodeType[] =
          ((await promisify(
            mApi()
              .workspace.workspaces.materials.cacheClear()
              .read(workspace.id, {
                parentId: material.workspaceMaterialId,
              }),
            "callback"
          )()) as MaterialContentNodeType[]) || [];

        dispatch({
          type: "UPDATE_MATERIAL_CONTENT_NODE",
          payload: {
            showUpdateLinkedMaterialsDialogForPublish: false,
            showUpdateLinkedMaterialsDialogForPublishCount: 0,
            showRemoveAnswersDialogForPublish: false,
            showRemoveLinkedAnswersDialogForPublish: false,
            material: material,
            update: {
              childrenAttachments,
            },
            isDraft: false,
          },
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
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
            const materialsAnswer: any[] = (await promisify(
              mApi().materials.material.workspaceMaterials.read(
                data.material.materialId
              ),
              "callback"
            )()) as any;

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
            await promisify(
              mApi().materials.html.content.update(data.material.materialId, {
                content: data.update.html,
                removeAnswers: data.removeAnswers || false,
              }),
              "callback"
            )();
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
            let urlPath = "materials";
            if (data.material.type === "folder") {
              urlPath = "folders";
            }

            newPath = (
              (await promisify(
                mApi().workspace.workspaces[urlPath].update(
                  data.workspace.id,
                  data.material.workspaceMaterialId,
                  result
                ),
                "callback"
              )()) as any
            ).path;
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
            await promisify(
              mApi().materials.material.update(
                data.material.materialId,
                materialResult
              ),
              "callback"
            )();
          }

          if (
            typeof data.update.producers !== "undefined" &&
            !equals(data.material.producers, data.update.producers)
          ) {
            const newProducers: MaterialContentNodeProducerType[] =
              await Promise.all<MaterialContentNodeProducerType>(
                data.update.producers.map((p) => {
                  if (p.id === null) {
                    return <Promise<MaterialContentNodeProducerType>>(
                      promisify(
                        mApi().materials.material.producers.create(
                          data.material.materialId,
                          { name: p.name }
                        ),
                        "callback"
                      )()
                    );
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
                promisify(
                  mApi().materials.material.producers.del(
                    data.material.materialId,
                    p.id
                  ),
                  "callback"
                )()
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
        if (!(err instanceof MApiError)) {
          throw err;
        }

        let isConflictError = false;

        // The "message.reason === "CONTAINS_ANSWERS"" is only available for admins, who receive a conflict error (409),
        if (err.message) {
          const message = JSON.parse(err.message);
          if (message.reason === "CONTAINS_ANSWERS") {
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
                getState().i18n.text.get(
                  "plugin.workspace.management.notification.failedToUpdateMaterialPage",
                  err.message
                ),
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
              getState().i18n.text.get(
                "plugin.workspace.management.notification.failedToUpdateMaterialPage",
                err.message
              ),
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
      try {
        const contentNodes: Array<MaterialContentNodeType> =
          <Array<MaterialContentNodeType>>await promisify(
            mApi().workspace.workspaces.materialContentNodes.read(workspaceId, {
              includeHidden,
            }),
            "callback"
          )() || [];
        dispatch({
          type: "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS",
          payload: contentNodes,
        });
        callback && callback(contentNodes);
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.workspace.management.notification.failedToLoadWorkspaceMaterials"
            ),
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
        const compositeReplies: MaterialCompositeRepliesListType = <
          MaterialCompositeRepliesListType
        >await promisify(
          mApi().workspace.workspaces.compositeReplies.cacheClear().read(id),
          "callback"
        )();
        dispatch({
          type: "UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_REPLIES",
          payload: compositeReplies || [],
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.workspace.management.notification.failedToLoadMaterialAnswers"
            ),
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
      try {
        let urlPath = "materials";
        if (data.material.type === "folder") {
          urlPath = "folders";
        }
        await promisify(
          mApi().workspace.workspaces[urlPath].del(
            data.workspace.id,
            data.material.workspaceMaterialId || data.material.id,
            {},
            {
              removeAnswers: data.removeAnswers || false,
              updateLinkedMaterials: true,
            }
          ),
          "callback"
        )();

        data.success && data.success();

        dispatch({
          type: "DELETE_MATERIAL_CONTENT_NODE",
          payload: data.material,
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        let showRemoveAnswersDialogForDelete = false;
        if (!data.removeAnswers && err.message) {
          try {
            const message = JSON.parse(err.message);
            if (message.reason === "CONTAINS_ANSWERS") {
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
        if (!showRemoveAnswersDialogForDelete) {
          if (data.material.children && data.material.children.length) {
            // ERROR section has child nodes
            dispatch(
              displayNotification(
                getState().i18n.text.get(
                  "plugin.workspace.materialsManagement.sectionDeleteNotEmptyMessage"
                ),
                "error"
              )
            );
          } else {
            // ERROR generic delete failure
            dispatch(
              displayNotification(
                getState().i18n.text.get(
                  "plugin.workspace.materialsManagement.deleteFailed.notification",
                  err.message
                ),
                "error"
              )
            );
          }
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
      try {
        const contentNodes: Array<MaterialContentNodeType> =
          <Array<MaterialContentNodeType>>(
            await promisify(
              mApi()
                .workspace.workspaces.help.cacheClear()
                .read(workspaceId, { includeHidden }),
              "callback"
            )()
          ) || [];
        dispatch({
          type: "UPDATE_WORKSPACES_SET_CURRENT_HELP",
          payload: contentNodes,
        });
        callback && callback(contentNodes);
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.workspace.management.notification.failedToLoadWorkspaceHelp"
            ),
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
