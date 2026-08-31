import * as React from "react";
import {
  WorkspaceDataType,
  MaterialContentNodeWithIdAndLogic,
} from "~/reducers/workspaces";
import MaterialLoader from "~/components/base/material-loader";
import { MaterialLoaderContent } from "~/components/base/material-loader/content";
import "~/sass/elements/evaluation.scss";
import { MaterialLoaderCorrectAnswerCounter } from "~/components/base/material-loader/correct-answer-counter";
import { StateType } from "~/reducers/index";
import { useDispatch, useSelector } from "react-redux";
import { MaterialLoaderAssesment } from "~/components/base/material-loader/assesment";
import { MaterialLoaderAssessor } from "~/components/base/material-loader/assessor";
import { MaterialLoaderExternalContent } from "~/components/base/material-loader/external-content";
import {
  InterimEvaluationRequest,
  MaterialCompositeReply,
} from "~/generated/client";
import {
  createFieldSnapshot,
  deleteFieldSnapshot,
} from "~/actions/main-function/evaluation/evaluationActions";
import { resolveEvaluationFieldFeatures } from "~/components/base/material-loader/helpers";
import { FieldActionCapabilities } from "~/components/base/material-loader/types";
import MApi from "~/api/api";

/**
 * EvaluationMaterialProps
 */
export interface EvaluationMaterialProps {
  material: MaterialContentNodeWithIdAndLogic;
  compositeReply?: MaterialCompositeReply;
  interminEvaluationRequest?: InterimEvaluationRequest;
  workspace: WorkspaceDataType;
  userEntityId: number;
}

/**
 * EvaluationMaterial
 * @param props props
 */
const EvaluationMaterial = (props: EvaluationMaterialProps) => {
  const { material, compositeReply, workspace, userEntityId } = props;

  const { status, websocket } = useSelector((state: StateType) => state);
  const dispatch = useDispatch();

  const isAssignment =
    material.assignment &&
    (material.assignment.assignmentType === "EVALUATED" ||
      material.assignment.assignmentType === "EXERCISE");

  const isInterimEvaluation =
    material.assignment &&
    material.assignment.assignmentType === "INTERIM_EVALUATION";

  const hasEvaluation =
    compositeReply &&
    compositeReply.evaluationInfo &&
    (compositeReply.state === "INCOMPLETE" ||
      compositeReply.state === "PASSED" ||
      compositeReply.state === "FAILED" ||
      compositeReply.state === "WITHDRAWN");

  let evalStateClassName = "";
  let evalStateIcon = "";

  if (compositeReply) {
    switch (compositeReply.state) {
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

  /**
   * Handles taking a field snapshot
   * @param fieldName fieldName
   * @param cap cap
   */
  const handleTakeFieldSnapshot = (
    fieldName: string,
    cap: FieldActionCapabilities
  ) => {
    if (!cap.canCreate) {
      return;
    }

    dispatch(
      createFieldSnapshot({
        userEntityId: userEntityId,
        workspaceMaterialId: compositeReply.workspaceMaterialId,
        fieldName: fieldName,
      })
    );
  };

  /**
   * Handles deleting a field snapshot
   * @param fieldName fieldName
   * @param snapshotId snapshotId
   * @param cap cap
   */
  const handleDeleteFieldSnapshot = (
    fieldName: string,
    snapshotId: number,
    cap: FieldActionCapabilities
  ) => {
    if (!cap.canDelete) {
      return;
    }

    dispatch(
      deleteFieldSnapshot({
        snapshotId: snapshotId,
        workspaceMaterialId: compositeReply.workspaceMaterialId,
        fieldName: fieldName,
      })
    );
  };

  /**
   * handleUpdateFieldWithComments
   * @param fieldName fieldName
   * @param content content
   * @param onSuccess onSuccess
   * @param onError onError
   */
  const handleUpdateFieldWithComments = async (
    fieldName: string,
    content: string,
    onSuccess: () => void,
    onError: (error: Error) => void
  ) => {
    const evaluationApi = MApi.getEvaluationApi();

    try {
      await evaluationApi.updateWorkspaceMaterialTextFieldAnswer({
        userEntityId: userEntityId,
        workspaceMaterialId: compositeReply.workspaceMaterialId,
        fieldName,
        updateWorkspaceMaterialTextFieldAnswerRequest: {
          text: content,
        },
      });
      onSuccess();
    } catch (error) {
      onError(error as Error);
    }
  };

  return (
    <MaterialLoader
      material={material}
      workspace={workspace}
      compositeReplies={compositeReply}
      readOnly
      answersVisible
      modifiers="evaluation-material-page"
      usedAs="evaluationTool"
      userEntityId={userEntityId}
      answerable={true}
      status={status}
      fieldFeaturesPolicy={resolveEvaluationFieldFeatures}
      onTakeFieldSnapshot={handleTakeFieldSnapshot}
      onDeleteFieldSnapshot={handleDeleteFieldSnapshot}
      onUpdateFieldWithComments={handleUpdateFieldWithComments}
      websocket={websocket}
    >
      {(props, state, stateConfiguration) => (
        <div className="evaluation-modal__item-body">
          {isAssignment && !isInterimEvaluation && hasEvaluation ? (
            <div
              className={`material-page__assignment-assessment ${evalStateClassName}`}
            >
              <div
                className={`material-page__assignment-assessment-icon ${evalStateIcon}`}
              ></div>

              <MaterialLoaderAssessor {...props} {...state} />
              <MaterialLoaderAssesment {...props} {...state} />
            </div>
          ) : null}

          <MaterialLoaderContent
            {...props}
            {...state}
            stateConfiguration={stateConfiguration}
          />

          {isInterimEvaluation && (
            <>
              <MaterialLoaderExternalContent
                {...props}
                {...state}
                stateConfiguration={stateConfiguration}
              />
              {hasEvaluation && (
                <div
                  className={`material-page__assignment-assessment material-page__assignment-assessment--interminEvaluation ${evalStateClassName}`}
                >
                  <div
                    className={`material-page__assignment-assessment-icon material-page__assignment-assessment--interminEvaluation ${evalStateIcon}`}
                  ></div>

                  <MaterialLoaderAssessor {...props} {...state} />
                  <MaterialLoaderAssesment {...props} {...state} />
                </div>
              )}
            </>
          )}

          <MaterialLoaderCorrectAnswerCounter {...props} {...state} />
        </div>
      )}
    </MaterialLoader>
  );
};

export default EvaluationMaterial;
