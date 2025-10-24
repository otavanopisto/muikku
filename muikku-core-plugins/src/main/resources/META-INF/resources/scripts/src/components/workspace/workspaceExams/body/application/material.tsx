/* eslint-disable jsdoc/require-jsdoc */
import * as React from "react";
import { StateType } from "~/reducers";
import { useDispatch, useSelector } from "react-redux";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
} from "~/reducers/workspaces";
import MaterialLoader from "~/components/base/material-loader";
import { MaterialLoaderTitle } from "~/components/base/material-loader/title";
import { MaterialLoaderContent } from "~/components/base/material-loader/content";
import { MaterialLoaderButtons } from "~/components/base/material-loader/buttons";
import { MaterialCompositeReply } from "~/generated/client";
import { updateAssignmentState } from "~/actions/workspaces/exams";

/**
 * WorkspaceMaterialProps
 */
interface ExamMaterialProps {
  materialContentNode: MaterialContentNodeWithIdAndLogic;
  compositeReply?: MaterialCompositeReply;
  workspace: WorkspaceDataType;
  anchorItem?: JSX.Element;
  readspeakerComponent?: JSX.Element;
}

/**
 * WorkspaceMaterial
 * @param props props
 */
const ExamMaterial = (props: ExamMaterialProps) => {
  const { materialContentNode, workspace, compositeReply, anchorItem } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const status = useSelector((state: StateType) => state.status);

  const websocket = useSelector((state: StateType) => state.websocket);

  const dispatch = useDispatch();

  return (
    <MaterialLoader
      material={materialContentNode}
      workspace={workspace}
      status={status}
      websocket={websocket}
      invisible={false}
      compositeReplies={compositeReply}
      answerable={true}
      readOnly={false}
      anchorElement={anchorItem}
      onUpdateAssignmentState={(...args) => {
        dispatch(
          updateAssignmentState({
            successState: args[0],
            avoidServerCall: args[1],
            workspaceId: args[2],
            workspaceMaterialId: args[3],
            existantReplyId: args[4],
            successMessage: args[5],
            callback: args[6],
          })
        );
      }}
    >
      {(props, state, stateConfiguration) => (
        <div>
          <MaterialLoaderTitle {...props} {...state} />
          <MaterialLoaderContent
            {...props}
            {...state}
            stateConfiguration={stateConfiguration}
          />

          <div className="material-page__de-floater"></div>

          <MaterialLoaderButtons
            {...props}
            {...state}
            stateConfiguration={stateConfiguration}
          />
        </div>
      )}
    </MaterialLoader>
  );
};

export default ExamMaterial;
