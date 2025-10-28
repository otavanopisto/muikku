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
import { useSelector } from "react-redux";
import { MaterialLoaderAssesment } from "~/components/base/material-loader/assesment";
import { MaterialLoaderExternalContent } from "~/components/base/material-loader/external-content";
import {
  InterimEvaluationRequest,
  MaterialCompositeReply,
} from "~/generated/client";

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
