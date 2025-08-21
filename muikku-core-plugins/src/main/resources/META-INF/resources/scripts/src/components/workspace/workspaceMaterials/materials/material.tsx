/* eslint-disable jsdoc/require-jsdoc */
import * as React from "react";
import { StateType } from "~/reducers";
import { useDispatch, useSelector } from "react-redux";

//import MaterialLoader from "~/components/base/material-loader";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
} from "~/reducers/workspaces";
import { MaterialLoaderEditorButtonSet } from "~/components/base/material-loaderV2/components/editor-buttonset";
import { MaterialLoaderTitle } from "~/components/base/material-loaderV2/components/title";
import { MaterialLoaderAI } from "~/components/base/material-loaderV2/components/ai";
import { MaterialLoaderContent } from "~/components/base/material-loaderV2/components/content";
import { MaterialLoaderProducersLicense } from "~/components/base/material-loaderV2/components/producers-license";
import { MaterialLoaderButtons } from "~/components/base/material-loaderV2/components/buttons";
import { MaterialLoaderCorrectAnswerCounter } from "~/components/base/material-loaderV2/components/correct-answer-counter";
import { MaterialLoaderAssesment } from "~/components/base/material-loaderV2/components/assesment";
import { MaterialLoaderGrade } from "~/components/base/material-loaderV2/components/grade";
import { MaterialLoaderDate } from "~/components/base/material-loaderV2/components/date";
import LazyLoader from "~/components/general/lazy-loader";
import { MaterialLoaderExternalContent } from "~/components/base/material-loaderV2/components/external-content";
import { MaterialCompositeReply } from "~/generated/client";
import { MaterialLoaderPoints } from "~/components/base/material-loaderV2/components/points";
import { MaterialLoaderAssignmentLock } from "~/components/base/material-loaderV2/components/assigment-lock";
import MaterialLoaderV2 from "~/components/base/material-loaderV2";
import { STATE_CONFIGS } from "~/components/base/material-loaderV2/state/StateConfig";
import { createMaterialsProvider } from "~/components/base/material-loaderV2/providers/MaterialsProvider";
import {
  requestWorkspaceMaterialContentNodeAttachments,
  setWorkspaceMaterialEditorState,
} from "~/actions/workspaces/material";
import { EditorPermissions } from "~/components/base/material-loaderV2/types";

/**
 * WorkspaceMaterialProps
 */
interface WorkspaceMaterialProps {
  // status: StatusType;
  // workspaceEditMode: WorkspaceEditModeStateType;
  // materialsAreDisabled: boolean;
  materialContentNode: MaterialContentNodeWithIdAndLogic;
  folder: MaterialContentNodeWithIdAndLogic;
  compositeReplies: MaterialCompositeReply;
  isViewRestricted: boolean;
  showEvenIfHidden: boolean;
  workspace: WorkspaceDataType;
  // setCurrentWorkspace: SetCurrentWorkspaceTriggerType;
  anchorItem?: JSX.Element;
  readspeakerComponent?: JSX.Element;
}

/**
 * WorkspaceMaterial
 * @param props props
 */
const WorkspaceMaterial = (props: WorkspaceMaterialProps) => {
  const {
    materialContentNode,
    compositeReplies,
    workspace,
    // status,
    // materialsAreDisabled,
    // workspaceEditMode,
    // isViewRestricted,
    // readspeakerComponent,
    // anchorItem,
    folder,
  } = props;

  const workspaceEditMode = useSelector(
    (state: StateType) => state.workspaces.editMode
  );

  const status = useSelector((state: StateType) => state.status);

  const materialsAreDisabled = useSelector(
    (state: StateType) => state.workspaces.materialsAreDisabled
  );

  const dispatch = useDispatch();

  /**
   * updateWorkspaceActivity
   */
  // const updateWorkspaceActivity = () => {
  //   //This function is very efficient and reuses as much data as possible so it won't call anything from the server other than
  //   //to refresh the activity and that's because we are forcing it to do so
  //   dispatch(
  //     setCurrentWorkspace({
  //       workspaceId: workspace.id,
  //       refreshActivity: true,
  //     })
  //   );
  // };

  const isAssignment =
    materialContentNode.assignmentType === "EVALUATED" ||
    materialContentNode.assignmentType === "EXERCISE" ||
    materialContentNode.assignmentType === "INTERIM_EVALUATION";

  const isEvaluatedAsPassed =
    compositeReplies && compositeReplies.state === "PASSED";

  const hasEvaluation =
    compositeReplies &&
    compositeReplies.evaluationInfo &&
    (compositeReplies.state === "INCOMPLETE" ||
      compositeReplies.state === "PASSED" ||
      compositeReplies.state === "FAILED" ||
      compositeReplies.state === "WITHDRAWN");

  const isBinary = materialContentNode.type === "binary";
  let evalStateClassName = "";
  let evalStateIcon = "";

  if (compositeReplies) {
    switch (compositeReplies.state) {
      case "INCOMPLETE":
        evalStateClassName = "material-page__assignment-assessment--incomplete";
        break;
      case "FAILED":
        evalStateClassName = "material-page__assignment-assessment--failed";
        evalStateIcon = "icon-thumb-down";
        break;
      case "PASSED":
        evalStateClassName = "material-page__assignment-assessment--passed";
        evalStateIcon = "icon-thumb-up";
        break;
      case "WITHDRAWN":
        evalStateClassName = "material-page__assignment-assessment--withdrawn";
        break;
    }
  }

  const editorPermissions: EditorPermissions = {
    editable: workspaceEditMode.active,
    canPublish: true,
    canRevert: true,
    canCopy: !isBinary,
    canHide: true,
    canDelete: true,
    canRestrictView: true,
    canChangePageType: !isBinary,
    canChangeExerciseType: !isBinary,
    canSetLicense: !isBinary,
    canSetProducers: !isBinary,
    canAddAttachments: !isBinary,
    canEditContent: !isBinary,
  };

  const dataProvider = createMaterialsProvider({
    userId: status.userId,
    folder: {
      ...folder,
      contentVersion: "ckeditor4",
    },
    material: {
      ...materialContentNode,
      contentVersion: "ckeditor4",
      assignment: materialContentNode.assignment,
      evaluation: materialContentNode.evaluation,
    },
    workspace: {
      id: workspace.id,
      urlName: workspace.urlName,
      language: workspace.language,
    },
    context: {
      tool: "materials",
      contextPath: status.contextPath,
    },
    currentState: compositeReplies?.state,
    assignmentType: materialContentNode.assignmentType,
    canEdit: false,
    canSubmit: false,
    canViewAnswers: false,
    editorPermissions,
    fields: [],
    answers: [],
    compositeReply: compositeReplies,
    getInterimEvaluationRequest: () =>
      props.workspace.interimEvaluationRequests &&
      props.workspace.interimEvaluationRequests.find(
        (request) =>
          request.workspaceMaterialId ===
          materialContentNode.workspaceMaterialId
      ),

    startEditor: () => {
      if (
        typeof editorPermissions.canAddAttachments === "undefined" ||
        editorPermissions.canAddAttachments
      ) {
        dispatch(
          requestWorkspaceMaterialContentNodeAttachments(
            workspace,
            materialContentNode
          )
        );
      }

      dispatch(
        setWorkspaceMaterialEditorState(
          {
            currentNodeWorkspace: props.workspace,
            currentNodeValue: materialContentNode,
            parentNodeValue: props.folder,
            section: false,
            opened: true,
            canDelete:
              typeof editorPermissions.canDelete === "undefined"
                ? false
                : editorPermissions.canDelete,
            canHide:
              typeof editorPermissions.canHide === "undefined"
                ? false
                : editorPermissions.canHide,
            disablePlugins: !!editorPermissions.disablePlugins,
            canPublish:
              typeof editorPermissions.canPublish === "undefined"
                ? false
                : editorPermissions.canPublish,
            canRevert:
              typeof editorPermissions.canRevert === "undefined"
                ? false
                : editorPermissions.canRevert,
            canRestrictView:
              typeof editorPermissions.canRestrictView === "undefined"
                ? false
                : editorPermissions.canRestrictView,
            canCopy:
              typeof editorPermissions.canCopy === "undefined"
                ? false
                : editorPermissions.canCopy,
            canChangePageType:
              typeof editorPermissions.canChangePageType === "undefined"
                ? false
                : editorPermissions.canChangePageType,
            canChangeExerciseType:
              typeof editorPermissions.canChangeExerciseType === "undefined"
                ? false
                : editorPermissions.canChangeExerciseType,
            canSetLicense:
              typeof editorPermissions.canSetLicense === "undefined"
                ? false
                : editorPermissions.canSetLicense,
            canSetProducers:
              typeof editorPermissions.canSetProducers === "undefined"
                ? false
                : editorPermissions.canSetProducers,
            canAddAttachments:
              typeof editorPermissions.canAddAttachments === "undefined"
                ? false
                : editorPermissions.canAddAttachments,
            canEditContent:
              typeof editorPermissions.canEditContent === "undefined"
                ? true
                : editorPermissions.canEditContent,
            canSetTitle:
              typeof editorPermissions.canSetTitle === "undefined"
                ? true
                : editorPermissions.canSetTitle,
            showRemoveAnswersDialogForPublish: false,
            showRemoveAnswersDialogForDelete: false,
            showUpdateLinkedMaterialsDialogForPublish: false,
            showRemoveLinkedAnswersDialogForPublish: false,
            showUpdateLinkedMaterialsDialogForPublishCount: 0,
          },
          true
        )
      );
    },
    onFieldChange: () => {},
    onSubmit: () => Promise.resolve(),
    onModify: () => Promise.resolve(),
  });

  return (
    <LazyLoader
      useChildrenAsLazy={true}
      className="material-lazy-loader-container"
    >
      {(loaded: boolean) => (
        <MaterialLoaderV2
          dataProvider={dataProvider}
          stateConfigs={STATE_CONFIGS}
          websocket={null}
          invisible={!loaded}
          readOnly={!status.loggedIn || materialsAreDisabled}
        >
          {(props, state, stateConfiguration) => (
            <div>
              <MaterialLoaderEditorButtonSet {...props} {...state} />
              <MaterialLoaderTitle {...props} {...state} />
              {props.material.ai && !props.material.contentHiddenForUser ? (
                <MaterialLoaderAI {...props} {...state} />
              ) : null}
              <MaterialLoaderContent
                {...props}
                {...state}
                dataProvider={dataProvider}
                stateConfiguration={stateConfiguration}
              />
              <MaterialLoaderExternalContent
                {...props}
                {...state}
                stateConfiguration={stateConfiguration}
              />
              <div className="material-page__de-floater"></div>
              {!isEvaluatedAsPassed && !props.material.contentHiddenForUser ? (
                <MaterialLoaderButtons
                  {...props}
                  {...state}
                  stateConfiguration={stateConfiguration}
                />
              ) : null}
              <MaterialLoaderCorrectAnswerCounter {...props} {...state} />
              <MaterialLoaderAssignmentLock {...props} {...state} />
              {isAssignment && hasEvaluation ? (
                <div
                  className={`material-page__assignment-assessment ${evalStateClassName} rs_skip_always`}
                >
                  <div
                    className={`material-page__assignment-assessment-icon ${evalStateIcon}`}
                  ></div>
                  <MaterialLoaderDate {...props} {...state} />
                  <MaterialLoaderGrade {...props} {...state} />
                  <MaterialLoaderPoints {...props} {...state} />
                  <MaterialLoaderAssesment {...props} {...state} />
                </div>
              ) : null}
              <MaterialLoaderProducersLicense {...props} {...state} />
            </div>
          )}
        </MaterialLoaderV2>
      )}
    </LazyLoader>
  );
};

export default WorkspaceMaterial;
